export default function ParentWeeklyReport({
  weeklyReport,
  onGenerateDemoWeek,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Weekly Report</h3>
          <p className="text-sm text-gray-600">
            Overview of your child’s activity for the week.
          </p>
        </div>

        <button
          onClick={onGenerateDemoWeek}
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
                {weeklyReport?.totals?.recipes ?? 0}
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-4">
              <div className="text-sm text-gray-500">Games</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklyReport?.totals?.games ?? 0}
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-4">
              <div className="text-sm text-gray-500">Minutes</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklyReport?.totals?.minutes ?? 0}
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="rounded-2xl bg-white shadow p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">
              Activity Timeline
            </div>

            <div className="space-y-2">
              {(weeklyReport?.events ?? []).map((ev, idx) => (
                <div
                  key={ev.id ?? `${ev.type}-${ev.title}-${idx}`}
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
  );
}
