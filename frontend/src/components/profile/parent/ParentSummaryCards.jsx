import { Clock, ChefHat, TrendingUp } from "lucide-react";

export default function ParentSummaryCards({ loading, stats }) {
  const totalMinutes = stats.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Active Time Card */}
      <div className="rounded-[2.5rem] bg-white p-7 border border-emerald-50 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
            <Clock size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Active Time
          </span>
        </div>
        <div className="text-3xl font-black text-slate-800">
          {loading ? (
            <div className="h-9 w-24 bg-slate-50 animate-pulse rounded-lg" />
          ) : (
            `${hours}h ${mins}m`
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2 italic">
          Total kitchen experience
        </p>
      </div>

      {/* 2. Recipes Cooked Card */}
      <div className="rounded-[2.5rem] bg-white p-7 border border-emerald-50 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
            <ChefHat size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Recipes Cooked
          </span>
        </div>
        <div className="text-3xl font-black text-slate-800">
          {loading ? (
            <div className="h-9 w-16 bg-slate-50 animate-pulse rounded-lg" />
          ) : (
            stats.totalCooked
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2 italic">
          Successfully completed
        </p>
      </div>

      {/* 3. Growth Card - Now matches the rest with White background */}
      <div className="rounded-[2.5rem] bg-white p-7 border border-emerald-50 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Growth
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="text-3xl font-black text-slate-800">
            {loading ? "…" : `${stats.progressPercent}%`}
          </div>
          <div className="text-[10px] text-slate-400 text-right font-bold leading-tight">
            NEXT:{" "}
            <span className="text-emerald-600 uppercase">
              {stats.nextMilestone} recipes
            </span>
            <br />
            {stats.progressToNext}/15 TO BADGE
          </div>
        </div>

        {/* Updated Progress Bar: Emerald color, no purple */}
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
