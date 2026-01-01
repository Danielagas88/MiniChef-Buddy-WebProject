import { useCallback, useEffect, useMemo, useReducer } from "react";
import { parentApi } from "../../../services/parentService.js";

function initialState() {
  return {
    gate: { isUnlocked: false, show: false },
    pin: { mode: "enter", input: "", confirm: "", error: "" }, // enter | create
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return initialState();

    case "SHOW":
      return { ...state, gate: { ...state.gate, show: true } };

    case "HIDE":
      return { ...state, gate: { ...state.gate, show: false } };

    case "UNLOCK":
      return {
        ...state,
        gate: { isUnlocked: true, show: false },
        pin: { mode: "enter", input: "", confirm: "", error: "" },
      };

    case "PIN_MODE":
      return {
        ...state,
        pin: { mode: action.payload, input: "", confirm: "", error: "" },
      };

    case "PIN_INPUT":
      return { ...state, pin: { ...state.pin, input: action.payload } };

    case "PIN_CONFIRM":
      return { ...state, pin: { ...state.pin, confirm: action.payload } };

    case "PIN_ERROR":
      return { ...state, pin: { ...state.pin, error: action.payload } };

    default:
      return state;
  }
}

export function useParentArea({ token, viewMode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // show gate when parent mode and not unlocked
  useEffect(() => {
    if (!token) {
      dispatch({ type: "RESET" });
      return;
    }
    const shouldShow = viewMode === "parent" && !state.gate.isUnlocked;
    if (shouldShow) dispatch({ type: "SHOW" });
  }, [token, viewMode, state.gate.isUnlocked]);

  const setPinInput = useCallback((value) => {
    const onlyDigits = String(value).replace(/\D/g, "").slice(0, 4);
    dispatch({ type: "PIN_INPUT", payload: onlyDigits });
  }, []);

  const setPinConfirm = useCallback((value) => {
    const onlyDigits = String(value).replace(/\D/g, "").slice(0, 4);
    dispatch({ type: "PIN_CONFIRM", payload: onlyDigits });
  }, []);

  const handleForgotPin = useCallback(() => {
    dispatch({ type: "PIN_MODE", payload: "create" });
  }, []);

  const submitPin = useCallback(async () => {
    if (!token) {
      dispatch({ type: "PIN_ERROR", payload: "Not logged in" });
      return;
    }
    dispatch({ type: "PIN_ERROR", payload: "" });

    const { mode, input, confirm } = state.pin;

    if (mode === "create") {
      if (input.length !== 4 || confirm.length !== 4) {
        dispatch({ type: "PIN_ERROR", payload: "PIN must be 4 digits" });
        return;
      }
      if (input !== confirm) {
        dispatch({ type: "PIN_ERROR", payload: "PINs do not match" });
        return;
      }
      try {
        await parentApi.setPin(input, token);
        dispatch({ type: "UNLOCK" });
        return;
      } catch (e) {
        dispatch({ type: "PIN_ERROR", payload: e?.message || "Server error" });
        return;
      }
    }

    // enter mode
    if (input.length !== 4) {
      dispatch({ type: "PIN_ERROR", payload: "PIN must be 4 digits" });
      return;
    }

    try {
      const result = await parentApi.verifyPin(input, token);
      if (result?.ok) dispatch({ type: "UNLOCK" });
      else dispatch({ type: "PIN_ERROR", payload: "Incorrect PIN" });
    } catch (e) {
      dispatch({ type: "PIN_ERROR", payload: e?.message || "Server error" });
    }
  }, [token, state.pin]);

  return useMemo(() => {
    return {
      gate: state.gate,
      pin: state.pin,
      pinMode: state.pin.mode,

      setPinInput,
      setPinConfirm,
      handleForgotPin,
      submitPin,
    };
  }, [state, setPinInput, setPinConfirm, handleForgotPin, submitPin]);
}
