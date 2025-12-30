/**
 * ParentDashboard.jsx
 * -------------------
 * Parent Area UI shell:
 * - header
 * - section selector cards (Usage / Weekly Report)
 * - renders selected section content
 *
 * Props:
 * - parent: object returned by useParentArea()
 */

import ParentUsage from "./ParentUsage.jsx";
import ParentWeeklyReport from "./ParentWeeklyReport.jsx";

export default function ParentDashboard({ parent }) {
  const { section } = parent;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white bg-opacity-80 shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">Parent Area</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage limits, approvals, and see weekly activity.
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => parent.setSection("usage")}
          className={`text-left rounded-3xl shadow p-5 bg-white bg-opacity-80 hover:shadow-md transition border ${
            section === "usage" ? "border-purple-400" : "border-transparent"
          }`}
        >
          <div className="text-2xl">⏱️</div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-gray-800">Usage Limits</h3>
            <p className="text-sm text-gray-600">
              Set daily time and allowed hours.
            </p>
          </div>
        </button>

        <button
          onClick={() => parent.setSection("report")}
          className={`text-left rounded-3xl shadow p-5 bg-white bg-opacity-80 hover:shadow-md transition border ${
            section === "report" ? "border-purple-400" : "border-transparent"
          }`}
        >
          <div className="text-2xl">📊</div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-gray-800">Weekly Report</h3>
            <p className="text-sm text-gray-600">
              Summary of recipes, games, and time.
            </p>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="rounded-3xl bg-white bg-opacity-80 shadow p-6">
        {section === "usage" && (
          <ParentUsage
            usage={parent.usage}
            onChange={parent.setUsage}
            onSave={parent.saveUsageLimits}
          />
        )}

        {section === "report" && (
          <ParentWeeklyReport
            weeklyReport={parent.weeklyReport}
            onGenerateDemoWeek={parent.generateDemoWeek}
          />
        )}
      </div>
    </section>
  );
}
