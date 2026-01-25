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
    <div className="rounded-[2rem] bg-white/80 dark:bg-white/10 backdrop-blur-md p-6 border border-white/40 dark:border-white/20 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
            Recent Cooking Sessions
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-0.5">
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
          <p className="text-sm text-[var(--text-secondary)] font-bold italic">
            No recipes cooked yet. Time to get started!
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((it) => {
            const themes = {
              Advanced: {
                bar: "bg-orange-500",
                hoverBorder:
                  "hover:border-orange-300 dark:hover:border-orange-500/40",
                hoverText: "group-hover:text-orange-500",
              },
              Medium: {
                bar: "bg-amber-400",
                hoverBorder:
                  "hover:border-amber-300 dark:hover:border-amber-500/40",
                hoverText: "group-hover:text-amber-500",
              },
              Easy: {
                bar: "bg-emerald-500",
                hoverBorder:
                  "hover:border-emerald-300 dark:hover:border-emerald-500/40",
                hoverText: "group-hover:text-emerald-600",
              },
            };

            const theme = themes[it.level] || themes.Easy;

            return (
              <div
                key={it.id || `${it.recipeId}-${it.sessionId}`}
                className={`group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 px-5 py-4 bg-white/50 dark:bg-white/5 shadow-sm transition-all duration-300 hover:shadow-md ${theme.hoverBorder}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1.5 h-10 rounded-full shrink-0 ${theme.bar}`}
                  />

                  <div>
                    <div
                      className={`font-extrabold transition-colors duration-300 text-[var(--text-primary)] ${theme.hoverText}`}
                    >
                      {it.title}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-[var(--text-secondary)] font-semibold mt-0.5">
                      <span>{formatDate(it.completedAt)}</span>
                      <span className="text-slate-300 dark:text-white/20">
                        •
                      </span>
                      <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider text-[9px]">
                        {it.level || "Easy"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-0.5 shrink-0 min-w-[55px] md:min-w-[70px]">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-sm font-black shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                    {Number(it.minutes) || 0} min
                  </div>
                  <div className="text-[7px] md:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
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
