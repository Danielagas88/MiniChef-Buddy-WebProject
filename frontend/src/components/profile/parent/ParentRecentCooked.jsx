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
    <div className="rounded-[2rem] bg-white/80 backdrop-blur-sm p-6 border border-emerald-50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Recent Cooking Sessions
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Last {items.length} recipes completed
          </p>
        </div>
        <div className="text-2xl opacity-50">🍳</div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-slate-100 p-10 text-center">
          <p className="text-sm text-slate-400 font-bold italic">
            No recipes cooked yet. Time to get started!
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((it) => (
            <div
              key={it.id || `${it.recipeId}-${it.sessionId}`}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* סמל קטן של רמת קושי בצבעים */}
                <div
                  className={`w-2 h-10 rounded-full ${
                    it.level === "Advanced" ? "bg-orange-400" : "bg-emerald-400"
                  }`}
                />

                <div>
                  <div className="font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {it.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-bold">
                    {formatDate(it.completedAt)} •{" "}
                    <span className="text-slate-500 uppercase tracking-tighter">
                      Level: {it.level || "Easy"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-black shadow-sm border border-emerald-100">
                  {Number(it.minutes) || 0} min
                </div>
                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  Duration
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
