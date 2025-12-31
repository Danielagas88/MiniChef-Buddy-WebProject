/**
 * useParentArea.js
 * ----------------
 * A reducer-based hook that owns ALL Parent Area state & logic.
 * Features:
 * 1) Gate visibility/unlock state
 * 2) PIN modal state (modes: enter/create/forgot)
 * 3) Parent dashboard section state ("usage" or "report")
 * 4) Usage limits state (stored in localStorage)
 * 5) Weekly report state (fetched/saved via API)
 * 6) Cleanup of timer used for "Saved ✔️" message (prevents warnings)
 */

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { parentApi } from "../../../services/parentService.js"; // <-- adapt path to your project

// localStorage key for usage limits
const USAGE_KEY = "usageLimits";

/**
 * Build initial state for reducer.
 * We keep everything grouped so UI doesn't juggle many separate states.
 */
function initialState() {
  return {
    gate: {
      isUnlocked: false, // parent area unlocked after correct PIN
      show: false, // whether to show the PIN modal
    },
    pin: {
      mode: "enter", // "enter" | "forgot"
      input: "",
      confirm: "",
      error: "",
    },
    section: "usage", // "usage" | "report"
    usage: {
      dailyLimit: "",
      allowedFrom: "",
      allowedTo: "",
      saveMessage: "",
    },
    report: {
      weeklyReport: null, // object or null
    },
  };
}

function reducer(state, action) {
  switch (action.type) {
    // -----------------
    // GATE actions
    // -----------------

    case "GATE/RESET": {
      // Used when token is missing (logout / session expired)
      // We ensure parent area is locked and modal is closed.
      return {
        ...state,
        gate: { isUnlocked: false, show: false },
        pin: { ...state.pin, input: "", confirm: "", error: "", mode: "enter" },
      };
    }

    case "GATE/SHOW_IF_NEEDED": {
      // Show the modal only when in parent mode and not unlocked
      return {
        ...state,
        gate: { ...state.gate, show: action.payload.show },
      };
    }

    case "GATE/HIDE": {
      // Just hides the modal (does not unlock)
      return {
        ...state,
        gate: { ...state.gate, show: false },
      };
    }

    case "GATE/UNLOCK": {
      // Unlock parent area and hide gate
      return {
        ...state,
        gate: { isUnlocked: true, show: false },
        pin: { ...state.pin, input: "", confirm: "", error: "", mode: "enter" },
      };
    }

    // -----------------
    // PIN actions
    // -----------------

    case "PIN/SET_MODE": {
      // Switch between enter/create/forgot and clear inputs/errors
      return {
        ...state,
        pin: {
          mode: action.payload.mode,
          input: "",
          confirm: "",
          error: "",
        },
      };
    }

    case "PIN/SET_INPUT": {
      return {
        ...state,
        pin: { ...state.pin, input: action.payload },
      };
    }

    case "PIN/SET_CONFIRM": {
      return {
        ...state,
        pin: { ...state.pin, confirm: action.payload },
      };
    }

    case "PIN/SET_ERROR": {
      return {
        ...state,
        pin: { ...state.pin, error: action.payload },
      };
    }

    case "PIN/CLEAR": {
      return {
        ...state,
        pin: { ...state.pin, input: "", confirm: "", error: "" },
      };
    }

    // -----------------
    // SECTION actions
    // -----------------

    case "SECTION/SET": {
      return {
        ...state,
        section: action.payload,
      };
    }

    // -----------------
    // USAGE actions
    // -----------------

    case "USAGE/LOAD_FROM_STORAGE": {
      return {
        ...state,
        usage: {
          ...state.usage,
          dailyLimit: action.payload.dailyLimit || "",
          allowedFrom: action.payload.allowedFrom || "",
          allowedTo: action.payload.allowedTo || "",
        },
      };
    }

    case "USAGE/SET": {
      // Merge partial updates (patch) into usage object
      return {
        ...state,
        usage: { ...state.usage, ...action.payload },
      };
    }

    // -----------------
    // REPORT actions
    // -----------------

    case "REPORT/SET": {
      return {
        ...state,
        report: { ...state.report, weeklyReport: action.payload },
      };
    }

    default:
      return state;
  }
}

/**
 * Helper: safely read usage limits from localStorage.
 * Returns an object with fallback defaults if parsing fails.
 */
function readUsageLimits() {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      dailyLimit: parsed?.dailyLimit ?? "",
      allowedFrom: parsed?.allowedFrom ?? "",
      allowedTo: parsed?.allowedTo ?? "",
    };
  } catch {
    return { dailyLimit: "", allowedFrom: "", allowedTo: "" };
  }
}

/**
 * Helper: safely write usage limits to localStorage.
 */
function writeUsageLimits({ dailyLimit, allowedFrom, allowedTo }) {
  localStorage.setItem(
    USAGE_KEY,
    JSON.stringify({ dailyLimit, allowedFrom, allowedTo })
  );
}
/**
 * useParentArea hook
 * @param {Object} params
 * @param {string | undefined} params.token - JWT token for protected APIs.
 * @param {"child" | "parent"} params.viewMode - current UI mode.
 */
export function useParentArea({ token, viewMode }) {
  // reducer state + dispatch
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // we store timeout id to cleanup properly
  const saveTimerRef = useRef(null);

  // -------------------------
  // Gate visibility management
  // -------------------------
  useEffect(() => {
    if (!token) {
      dispatch({ type: "GATE/RESET" });
      return;
    }

    // Show gate if parent mode and NOT unlocked yet
    const shouldShow = viewMode === "parent" && !state.gate.isUnlocked;

    dispatch({
      type: "GATE/SHOW_IF_NEEDED",
      payload: { show: shouldShow },
    });
  }, [token, viewMode, state.gate.isUnlocked]);

  // -------------------------
  // Load usage limits
  // -------------------------
  useEffect(() => {
    if (state.section !== "usage") return;
    const saved = readUsageLimits();
    dispatch({ type: "USAGE/LOAD_FROM_STORAGE", payload: saved });
  }, [state.section]);

  // -------------------------
  // Load weekly report
  // -------------------------
  const loadWeeklyReport = useCallback(async () => {
    if (!token) return;
    try {
      const data = await parentApi.getWeeklyReport(token);
      dispatch({ type: "REPORT/SET", payload: data?.report ?? null });
    } catch (e) {
      console.error("loadWeeklyReport failed:", e);
    }
  }, [token]);

  useEffect(() => {
    if (state.section === "report") {
      loadWeeklyReport();
    }
  }, [state.section, loadWeeklyReport]);

  // -------------------------
  // Public setters used by UI components
  // -------------------------
  const hideGate = useCallback(() => {
    dispatch({ type: "GATE/HIDE" });
  }, []);

  const setSection = useCallback((section) => {
    dispatch({ type: "SECTION/SET", payload: section });
  }, []);

  const setPinMode = useCallback((mode) => {
    dispatch({ type: "PIN/SET_MODE", payload: { mode } });
  }, []);

  const setPinInput = useCallback((value) => {
    const onlyDigits = String(value).replace(/\D/g, "");
    dispatch({ type: "PIN/SET_INPUT", payload: onlyDigits.slice(0, 4) });
  }, []);

  const setPinConfirm = useCallback((value) => {
    const onlyDigits = String(value).replace(/\D/g, "");
    dispatch({ type: "PIN/SET_CONFIRM", payload: onlyDigits.slice(0, 4) });
  }, []);

  const setUsage = useCallback((patch) => {
    dispatch({ type: "USAGE/SET", payload: patch });
  }, []);

  const handleForgotPin = useCallback(() => {
    dispatch({ type: "PIN/SET_MODE", payload: { mode: "create" } });
  }, []);

  // -------------------------
  // Save usage limits
  // -------------------------
  const saveUsageLimits = useCallback(() => {
    writeUsageLimits({
      dailyLimit: state.usage.dailyLimit,
      allowedFrom: state.usage.allowedFrom,
      allowedTo: state.usage.allowedTo,
    });

    dispatch({
      type: "USAGE/SET",
      payload: { saveMessage: "Settings saved ✔️" },
    });

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      dispatch({ type: "USAGE/SET", payload: { saveMessage: "" } });
    }, 2000);
  }, [state.usage.dailyLimit, state.usage.allowedFrom, state.usage.allowedTo]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // -------------------------
  // Demo weekly report generator
  // -------------------------
  const generateDemoWeek = useCallback(async () => {
    if (!token) return;

    const demo = {
      weekLabel: "This Week",
      totals: { recipes: 3, games: 5, minutes: 78 },
      events: [
        { id: "1", type: "recipe", title: "Pancakes", when: "Mon 17:20" },
        {
          id: "2",
          type: "game",
          title: "Knife Safety Quiz",
          when: "Tue 18:10",
        },
        { id: "3", type: "recipe", title: "Fruit Salad", when: "Wed 16:45" },
        { id: "4", type: "game", title: "Measure & Mix", when: "Thu 19:05" },
        { id: "5", type: "recipe", title: "Omelette", when: "Fri 17:35" },
      ],
    };

    try {
      const data = await parentApi.saveWeeklyReport(demo, token);
      dispatch({ type: "REPORT/SET", payload: data?.report ?? demo });
    } catch (e) {
      console.error("saveWeeklyReport failed:", e);
      dispatch({ type: "REPORT/SET", payload: demo });
    }
  }, [token]);

  // -------------------------
  // Submit PIN (enter or create)
  // -------------------------
  const submitPin = useCallback(async () => {
    if (!token) {
      dispatch({
        type: "PIN/SET_ERROR",
        payload: "Not logged in (missing token)",
      });
      return;
    }

    dispatch({ type: "PIN/SET_ERROR", payload: "" });

    if (state.pin.mode === "create") {
      if (state.pin.input.length !== 4 || state.pin.confirm.length !== 4) {
        dispatch({ type: "PIN/SET_ERROR", payload: "PIN must be 4 digits" });
        return;
      }
      if (state.pin.input !== state.pin.confirm) {
        dispatch({ type: "PIN/SET_ERROR", payload: "PINs do not match" });
        return;
      }

      try {
        await parentApi.setPin(state.pin.input, token);
        dispatch({ type: "GATE/UNLOCK" });

        dispatch({ type: "PIN/SET_MODE", payload: { mode: "enter" } });
      } catch (e) {
        dispatch({
          type: "PIN/SET_ERROR",
          payload: e?.message || "Server error",
        });
      }
      return;
    }

    if (state.pin.input.length !== 4) {
      dispatch({ type: "PIN/SET_ERROR", payload: "PIN must be 4 digits" });
      return;
    }

    try {
      const result = await parentApi.verifyPin(state.pin.input, token);
      if (result?.ok) {
        dispatch({ type: "GATE/UNLOCK" });
      } else {
        dispatch({ type: "PIN/SET_ERROR", payload: "Incorrect PIN" });
      }
    } catch (e) {
      dispatch({
        type: "PIN/SET_ERROR",
        payload: e?.message || "Server error",
      });
    }
  }, [token, state.pin.mode, state.pin.input, state.pin.confirm]);

  // -------------------------
  // Expose public API to UI
  // -------------------------
  return useMemo(() => {
    return {
      gate: state.gate,
      pin: state.pin,
      section: state.section,
      usage: state.usage,
      weeklyReport: state.report.weeklyReport,

      // actions
      hideGate,
      setSection,

      setPinMode,
      setPinInput,
      setPinConfirm,
      handleForgotPin,

      setUsage,
      saveUsageLimits,

      generateDemoWeek,
      submitPin,

      pinMode: state.pin.mode,
    };
  }, [
    state.gate,
    state.pin,
    state.section,
    state.usage,
    state.report.weeklyReport,
    hideGate,
    setSection,
    setPinMode,
    setPinInput,
    setPinConfirm,
    handleForgotPin,
    setUsage,
    saveUsageLimits,
    generateDemoWeek,
    submitPin,
  ]);
}
