import { useEffect, useState, useCallback } from "react";
import { parentApi } from "../services/parentService.js";

export function useParentArea({ token, viewMode }) {
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);

  const [pinMode, setPinMode] = useState("enter"); // enter | create | forgot
  const [pinInput, setPinInput] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState("");

  const [activeParentSection, setActiveParentSection] = useState("usage");

  const [dailyLimit, setDailyLimit] = useState("");
  const [allowedFrom, setAllowedFrom] = useState("");
  const [allowedTo, setAllowedTo] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [weeklyReport, setWeeklyReport] = useState(null);

  // gate visibility
  useEffect(() => {
    if (!token) {
      setShowParentGate(false);
      setIsParentUnlocked(false);
      return;
    }
    setShowParentGate(viewMode === "parent" && !isParentUnlocked);
  }, [viewMode, isParentUnlocked, token]);

  // load limits from localStorage
  useEffect(() => {
    if (activeParentSection !== "usage") return;
    const saved = JSON.parse(localStorage.getItem("usageLimits") || "{}");
    setDailyLimit(saved.dailyLimit || "");
    setAllowedFrom(saved.allowedFrom || "");
    setAllowedTo(saved.allowedTo || "");
  }, [activeParentSection]);

  const saveUsageLimits = useCallback(() => {
    localStorage.setItem(
      "usageLimits",
      JSON.stringify({ dailyLimit, allowedFrom, allowedTo })
    );
    setSaveMessage("Settings saved ✔️");
    setTimeout(() => setSaveMessage(""), 2000);
  }, [dailyLimit, allowedFrom, allowedTo]);

  const loadWeeklyReport = useCallback(async () => {
    if (!token) return;
    try {
      const data = await parentApi.getWeeklyReport(token);
      setWeeklyReport(data.report ?? null);
    } catch (e) {
      console.error("loadWeeklyReport failed:", e);
    }
  }, [token]);

  useEffect(() => {
    if (activeParentSection === "report") loadWeeklyReport();
  }, [activeParentSection, loadWeeklyReport]);

  const generateDemoWeek = useCallback(async () => {
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
      setWeeklyReport(data.report ?? demo);
    } catch (e) {
      console.error("saveWeeklyReport failed:", e);
    }
  }, [token]);

  const submitPin = useCallback(async () => {
    try {
      if (!token) {
        setPinError("Not logged in (missing token)");
        return;
      }

      setPinError("");

      if (pinMode === "forgot") {
        setPinError("Forgot PIN flow not implemented yet");
        return;
      }

      if (pinMode === "create") {
        if (pinInput.length !== 4 || pinConfirm.length !== 4) {
          setPinError("PIN must be 4 digits");
          return;
        }
        if (pinInput !== pinConfirm) {
          setPinError("PINs do not match");
          return;
        }

        await parentApi.setPin(pinInput, token);
        setIsParentUnlocked(true);
        setShowParentGate(false);
        setPinMode("enter");
        setPinInput("");
        setPinConfirm("");
        return;
      }

      // enter
      if (pinInput.length !== 4) {
        setPinError("PIN must be 4 digits");
        return;
      }

      const result = await parentApi.verifyPin(pinInput, token);
      if (result.ok) {
        setIsParentUnlocked(true);
        setShowParentGate(false);
        setPinInput("");
      } else {
        setPinError("Incorrect PIN");
      }
    } catch (err) {
      setPinError(err?.message || "Server error");
    }
  }, [token, pinMode, pinInput, pinConfirm]);

  return {
    // gate
    isParentUnlocked,
    showParentGate,
    setShowParentGate,

    // pin UI
    pinMode,
    setPinMode,
    pinInput,
    setPinInput,
    pinConfirm,
    setPinConfirm,
    pinError,
    setPinError,
    submitPin,

    // sections
    activeParentSection,
    setActiveParentSection,

    // usage
    dailyLimit,
    setDailyLimit,
    allowedFrom,
    setAllowedFrom,
    allowedTo,
    setAllowedTo,
    saveMessage,
    saveUsageLimits,

    // report
    weeklyReport,
    generateDemoWeek,
  };
}
