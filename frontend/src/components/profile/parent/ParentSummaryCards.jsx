import { Clock, ChefHat, TrendingUp } from "lucide-react";

export default function ParentSummaryCards({ loading, stats }) {
  const totalMinutes = stats.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Active Time Card */}
      <div className="rounded-[2.5rem] bg-(--card-surface) backdrop-blur-md p-7 border border-(--card-surface-border) shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/10 rounded-xl text-(--accent-amber)">
            <Clock size={20} />
          </div>
          <span className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest">
            Active Time
          </span>
        </div>
        <div className="text-3xl font-black text-(--text-primary)">
          {loading ? (
            <div className="h-9 w-24 bg-(--input-bg) animate-pulse rounded-lg" />
          ) : (
            `${hours}h ${mins}m`
          )}
        </div>
        <p className="text-xs text-(--text-secondary) font-medium mt-2 italic">
          Total kitchen experience
        </p>
      </div>

      {/* 2. Recipes Cooked Card */}
      <div className="rounded-[2.5rem] bg-(--card-surface) backdrop-blur-md p-7 border border-(--card-surface-border) shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-(--accent-emerald)">
            <ChefHat size={20} />
          </div>
          <span className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest">
            Recipes Cooked
          </span>
        </div>
        <div className="text-3xl font-black text-(--text-primary)">
          {loading ? (
            <div className="h-9 w-16 bg-(--input-bg) animate-pulse rounded-lg" />
          ) : (
            stats.totalCooked
          )}
        </div>
        <p className="text-xs text-(--text-secondary) font-medium mt-2 italic">
          Successfully completed
        </p>
      </div>

      {/* 3. Growth Card - Now matches the rest with White background */}
      <div className="rounded-[2.5rem] bg-(--card-surface) backdrop-blur-md p-7 border border-(--card-surface-border) shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-(--accent-emerald)">
            <TrendingUp size={20} />
          </div>
          <span className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest">
            Growth
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="text-3xl font-black text-(--text-primary)">
            {loading ? "…" : `${stats.progressPercent}%`}
          </div>
          <div className="text-[10px] text-(--text-secondary) text-right font-bold leading-tight">
            NEXT:{" "}
            <span className="text-emerald-600 dark:text-emerald-400 uppercase">
              {stats.nextMilestone} recipes
            </span>
            <br />
            {stats.progressToNext}/15 TO BADGE
          </div>
        </div>

        <div className="h-2.5 bg-(--border-color) rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
