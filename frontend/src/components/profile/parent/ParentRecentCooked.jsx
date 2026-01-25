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
    <div className="rounded-[2rem] bg-(--card-surface) backdrop-blur-md p-6 border border-(--card-surface-border) shadow-sm transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-(--text-primary) tracking-tight">
            Recent Cooking Sessions
          </h3>
          <p className="text-xs text-(--text-secondary) font-bold uppercase tracking-widest mt-0.5">
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
              className="h-16 w-full bg-(--input-bg) animate-pulse rounded-2xl border border-(--border-color)"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-(--border-color) p-10 text-center">
          <p className="text-sm text-(--text-secondary) font-bold italic">
            No recipes cooked yet. Time to get started!
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((it) => {
            const themes = {
              Advanced: {
                bar: "bg-orange-500",
                hoverBorder: "hover:border-orange-500/40",
                hoverText: "group-hover:text-orange-500",
              },
              Medium: {
                bar: "bg-amber-400",
                hoverBorder: "hover:border-amber-500/40",
                hoverText: "group-hover:text-amber-500",
              },
              Easy: {
                bar: "bg-emerald-500",
                hoverBorder: "hover:border-emerald-500/40",
                hoverText: "group-hover:text-emerald-500",
              },
            };

            const theme = themes[it.level] || themes.Easy;

            return (
              <div
                key={it.id || `${it.recipeId}-${it.sessionId}`}
                className={`group flex items-center justify-between rounded-2xl border border-(--border-color) px-5 py-4 bg-(--input-bg) shadow-sm transition-all duration-300 hover:shadow-md ${theme.hoverBorder}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1.5 h-10 rounded-full shrink-0 ${theme.bar}`}
                  />

                  <div>
                    <div
                      className={`font-extrabold transition-colors duration-300 text-(--text-primary) ${theme.hoverText}`}
                    >
                      {it.title}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-(--text-secondary) font-semibold mt-0.5">
                      <span>{formatDate(it.completedAt)}</span>
                      <span className="text-(--muted)">•</span>
                      <span className="bg-(--input-bg) px-2 py-0.5 rounded-md uppercase tracking-wider text-[9px] border border-(--border-color)">
                        {it.level || "Easy"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-0.5 shrink-0 min-w-[55px] md:min-w-[70px]">
                  <div className="bg-emerald-500/10 text-(--accent-emerald) px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-sm font-black shadow-sm border border-emerald-500/20">
                    {Number(it.minutes) || 0} min
                  </div>
                  <div className="text-[7px] md:text-[9px] font-bold text-(--text-secondary) uppercase tracking-widest">
                    Duration
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
