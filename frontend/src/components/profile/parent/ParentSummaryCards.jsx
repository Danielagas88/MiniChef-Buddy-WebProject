export default function ParentSummaryCards({ loading, stats }) {
  const totalMinutes = stats.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active time */}
      <div className="rounded-3xl bg-white/80 shadow p-6 border border-gray-100">
        <div className="text-sm text-gray-500">Active time</div>
        <div className="text-3xl font-extrabold text-gray-800 mt-2">
          {loading ? "…" : `${hours}h ${mins}m`}
        </div>
        <div className="text-xs text-gray-500 mt-2">Sum of cooking minutes</div>
      </div>

      {/* Recipes cooked */}
      <div className="rounded-3xl bg-white/80 shadow p-6 border border-gray-100">
        <div className="text-sm text-gray-500">Recipes cooked</div>
        <div className="text-3xl font-extrabold text-gray-800 mt-2">
          {loading ? "…" : stats.totalCooked}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Summary of last sessions
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-3xl bg-white/80 shadow p-6 border border-gray-100">
        <div className="text-sm text-gray-500">Progress</div>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="text-3xl font-extrabold text-gray-800">
            {loading ? "…" : `${stats.progressPercent}%`}
          </div>
          <div className="text-xs text-gray-500 text-right">
            Next milestone:{" "}
            <b className="text-gray-700">{stats.nextMilestone}</b>
            <br />
            {stats.progressToNext}/15 to next badge
          </div>
        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div
            className="h-3 bg-purple-600 rounded-full transition-all"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
