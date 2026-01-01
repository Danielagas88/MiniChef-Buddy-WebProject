function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ParentRecentCooked({ loading, items }) {
  return (
    <div className="rounded-3xl bg-white/80 shadow p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800">Recent cooked recipes</h3>
      <p className="text-sm text-gray-600 mt-1">Last {items.length} sessions</p>

      {loading ? (
        <div className="text-sm text-gray-400 mt-4">Loading…</div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-gray-600">
          No recipes cooked yet.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <div
              key={it.id || `${it.recipeId}-${it.sessionId}`}
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 bg-white"
            >
              <div>
                <div className="font-semibold text-gray-800">{it.title}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(it.completedAt)} • Level: {it.level || "-"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">
                  {Number(it.minutes) || 0} min
                </div>
                <div className="text-xs text-gray-400">session</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
