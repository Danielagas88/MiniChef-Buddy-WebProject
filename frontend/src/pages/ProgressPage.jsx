import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";


/* amit add this for the lock*/
const API_BASE = "http://localhost:3000";

async function apiPost(path, body, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
}
async function apiGet(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

async function apiPut(path, body, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}






export default function ProgressPage() {
  const { user, viewMode } = useAuth();
  console.log("user in ProgressPage:", user);// amit add this
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinMode, setPinMode] = useState("enter"); // "enter", "create", "forgot"
const [pinConfirm, setPinConfirm] = useState("");
const [activeParentSection, setActiveParentSection] = useState("usage");
const [dailyLimit, setDailyLimit] = useState("");
const [allowedFrom, setAllowedFrom] = useState("");
const [allowedTo, setAllowedTo] = useState("");
const [saveMessage, setSaveMessage] = useState("");
const [weeklyReport, setWeeklyReport] = useState(null);

async function loadWeeklyReport() {
  try {
    if (!user?.token) return;
    const data = await apiGet("/api/weekly-report/me", user.token);
    setWeeklyReport(data.report); // יכול להיות null
  } catch (e) {
    console.error("loadWeeklyReport failed:", e);
  }
}


async function saveWeeklyReport(report) {
  try {
    if (!user?.token) return;
    const data = await apiPut("/api/weekly-report/me", report, user.token);
    setWeeklyReport(data.report);
  } catch (e) {
    console.error("saveWeeklyReport failed:", e);
  }
}

async function generateDemoWeek() {
  const demo = {
    weekLabel: "This Week",
    totals: { recipes: 3, games: 5, minutes: 78 },
    events: [
      { type: "recipe", title: "Pancakes", when: "Mon 17:20" },
      { type: "game", title: "Knife Safety Quiz", when: "Tue 18:10" },
      { type: "recipe", title: "Fruit Salad", when: "Wed 16:45" },
      { type: "game", title: "Measure & Mix", when: "Thu 19:05" },
      { type: "recipe", title: "Omelette", when: "Fri 17:35" }
    ]
  };

  await saveWeeklyReport(demo);
}




useEffect(() => {
  // אם אין משתמש או אין טוקן - אל תפתח את המודאל בכלל
  if (!user?.token) {
    setShowParentGate(false);
    return;
  }

  if (viewMode === "parent" && !isParentUnlocked) {
    setShowParentGate(true);
  } else {
    setShowParentGate(false);
  }
}, [viewMode, isParentUnlocked, user?.token]);


  useEffect(() => {
  if (activeParentSection === "usage") {
    const saved = JSON.parse(localStorage.getItem("usageLimits") || "{}");
    setDailyLimit(saved.dailyLimit || "");
    setAllowedFrom(saved.allowedFrom || "");
    setAllowedTo(saved.allowedTo || "");
  }
}, [activeParentSection]);

useEffect(() => {
  if (activeParentSection === "report") {
    loadWeeklyReport();
  }
}, [activeParentSection]);



  if (!user) {
    return (
      <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
        <p className="text-sm text-gray-700">
          To view the personal area and the parent report, please log in.
        </p>
      </section>
    );
  }

  // CHILD VIEW
  if (viewMode === "child") {
    return (
      <section className="space-y-4">
        {/* Child personal area */}
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-800">My Chef Profile</h2>

          <div className="mt-3"></div>
        </div>

        {/* Child gallery */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow p-3 md:p-4 h-40 overflow-y-auto mt-4">
          <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">
            Cooking Gallery
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-2"></p>
          <div className="grid grid-cols-3 gap-1">
            <div className="w-full h-12 bg-pink-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 1
            </div>
            <div className="w-full h-12 bg-yellow-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 2
            </div>
            <div className="w-full h-12 bg-purple-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 3
            </div>
          </div>
        </div>
      </section>
    );
  }

// PARENT VIEW
if (viewMode === "parent") {
  return (
    <>
{isParentUnlocked && (
  <section className="space-y-6">
    {/* Header */}
    <div className="rounded-3xl bg-white bg-opacity-80 shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800">Parent Area</h2>
      <p className="text-sm text-gray-600 mt-1">
        Manage limits, approvals, and see weekly activity.
      </p>
    </div>

    {/* Dashboard Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={() => setActiveParentSection("usage")}
        className={`text-left rounded-3xl shadow p-5 bg-white bg-opacity-80 hover:shadow-md transition border ${
          activeParentSection === "usage" ? "border-purple-400" : "border-transparent"
        }`}
      >
        <div className="text-2xl">⏱️</div>
        <div className="mt-2">
          <h3 className="text-lg font-bold text-gray-800">Usage Limits</h3>
          <p className="text-sm text-gray-600">Set daily time and allowed hours.</p>
        </div>
      </button>

      <button
        onClick={() => setActiveParentSection("report")}
        className={`text-left rounded-3xl shadow p-5 bg-white bg-opacity-80 hover:shadow-md transition border ${
          activeParentSection === "report" ? "border-purple-400" : "border-transparent"
        }`}
      >
        <div className="text-2xl">📊</div>
        <div className="mt-2">
          <h3 className="text-lg font-bold text-gray-800">Weekly Report</h3>
          <p className="text-sm text-gray-600">Summary of recipes, games, and time.</p>
        </div>
      </button>

    </div>

    {/* Selected Section */}
    <div className="rounded-3xl bg-white bg-opacity-80 shadow p-6">
      {activeParentSection === "usage" && (
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">Usage Limits</h3>
          <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Daily usage limit (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
              placeholder="e.g. 60"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Allowed from
              </label>
              <input
                type="time"
                value={allowedFrom}
                onChange={(e) => setAllowedFrom(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Allowed to
              </label>
              <input
                type="time"
                value={allowedTo}
                onChange={(e) => setAllowedTo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.setItem(
                "usageLimits",
                JSON.stringify({ dailyLimit, allowedFrom, allowedTo })
              );
              setSaveMessage("Settings saved ✔️");
              setTimeout(() => setSaveMessage(""), 2000);
            }}
            className="rounded-xl bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700"
          >
            Save Settings
          </button>

          {saveMessage && (
            <p className="text-sm text-green-600">{saveMessage}</p>
          )}
        </div>

        </div>
      )}

      {activeParentSection === "report" && (
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">Weekly Report</h3>
          <div className="space-y-4">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="text-xl font-bold text-gray-800">Weekly Report</h3>
      <p className="text-sm text-gray-600">
        Overview of your child’s activity for the week.
      </p>
    </div>

    <button
      onClick={generateDemoWeek}
      className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white font-semibold hover:bg-purple-700"
    >
      Generate Demo Week
    </button>
  </div>

  {!weeklyReport ? (
    <div className="rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-gray-600">
      No data yet. Click <b>Generate Demo Week</b> to preview the report.
        </div>
      ) : (
        <>
          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white shadow p-4">
              <div className="text-sm text-gray-500">Recipes</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklyReport.totals.recipes}
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-4">
              <div className="text-sm text-gray-500">Games</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklyReport.totals.games}
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-4">
              <div className="text-sm text-gray-500">Minutes</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklyReport.totals.minutes}
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="rounded-2xl bg-white shadow p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">
              Activity Timeline
            </div>

            <div className="space-y-2">
              {weeklyReport.events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {ev.type === "recipe" ? "🍳" : "🎮"}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {ev.title}
                      </div>
                      <div className="text-xs text-gray-500">{ev.type}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">{ev.when}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>

        </div>
      )}
    </div>
  </section>
)}


      {/* מודאל PIN - יופיע רק אם עדיין לא נפתח */}
      {showParentGate && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowParentGate(false)}
        >
          <div
            className="w-[420px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-2xl translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
           <h2 className="text-lg font-semibold text-gray-800">
              {pinMode === "enter" && "Parent Access"}
              {pinMode === "create" && "Create / Change Parent PIN"}
              {pinMode === "forgot" && "Forgot PIN"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {pinMode === "enter" && "Enter your 4-digit PIN"}
              {pinMode === "create" && "Choose a new 4-digit PIN"}
              {pinMode === "forgot" && "For now: reset PIN (later via database)"}
            </p>


            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            {pinMode === "create" && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                placeholder="Confirm PIN"
                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              )}




            {pinError && <p className="mt-2 text-sm text-red-600">{pinError}</p>}

            <div className="mt-3 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setPinMode("create");
                  setPinError("");
                  setPinInput("");
                }}
                className="text-purple-600 hover:underline"
              >
                Create / Change PIN
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinMode("forgot");
                  setPinError("");
                  setPinInput("");
                }}
                className="text-gray-600 hover:underline"
              >
                Forgot PIN?
              </button>
            </div>


            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowParentGate(false)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    if (!user?.token) {
                      setPinError("Not logged in (missing token)");
                      return;
                    }

                    // forgot - כרגע לא ממומש מול DB
                    if (pinMode === "forgot") {
                      setPinError("Forgot PIN flow not implemented yet");
                      return;
                    }

                    // create/change -> שמירה ב-DB
                    if (pinMode === "create") {
                      if (pinInput.length !== 4 || pinConfirm.length !== 4) {
                        setPinError("PIN must be 4 digits");
                        return;
                      }
                      if (pinInput !== pinConfirm) {
                        setPinError("PINs do not match");
                        return;
                      }

                      await apiPost("/api/parent-pin/set", { pin: pinInput }, user.token);

                      setIsParentUnlocked(true);
                      setShowParentGate(false);
                      setPinMode("enter");
                      setPinInput("");
                      setPinConfirm("");
                      setPinError("");
                      return;
                    }

                    // enter -> verify מול DB
                    if (pinInput.length !== 4) {
                      setPinError("PIN must be 4 digits");
                      return;
                    }

                    const result = await apiPost(
                      "/api/parent-pin/verify",
                      { pin: pinInput },
                      user.token
                    );

                    if (result.ok) {
                      setIsParentUnlocked(true);
                      setShowParentGate(false);
                      setPinMode("enter");
                      setPinInput("");
                      setPinError("");
                    } else {
                      setPinError("Incorrect PIN");
                    }
                  } catch (err) {
                    setPinError(err.message || "Server error");
                  }
                }}
                className="flex-1 rounded-xl bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
              >
                Submit
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
}
