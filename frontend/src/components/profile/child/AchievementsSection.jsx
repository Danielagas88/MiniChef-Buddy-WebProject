import { Award, ChefHat, Star, Trophy } from "lucide-react";
import BadgeCard from "./BadgeCard";
import { BADGES, computeProgress } from "../../../utils/progressUtils";

const BADGE_ICONS = {
  "first-dish": Award,
  "mini-chef": ChefHat,
  "kitchen-star": Star,
  "master-chef": Trophy,
};

/**
 * Achievements section component showing badges and progress
 */
export default function AchievementsSection({ historyItems, progressLoading }) {
  const progress = computeProgress(historyItems);

  return (
    <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-6 border border-(--card-surface-border) transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-(--text-primary) flex items-center gap-2">
            <span className="text-amber-500">🏅</span> My Achievements
          </h3>
          <p className="text-xs text-(--text-secondary) font-medium">
            Earn badges as you cook more!
          </p>
        </div>
        <div className="bg-(--input-bg) p-3 rounded-2xl text-center border border-(--border-color) min-w-[100px]">
          <div className="text-[9px] uppercase font-bold text-(--text-secondary) tracking-widest mb-0.5">
            Total Cooked
          </div>
          <div className="text-2xl font-black text-(--accent-emerald)">
            {progressLoading ? "…" : progress.totalCooked}
          </div>
        </div>
      </div>

      <div className="bg-(--input-bg) p-4 rounded-2xl border border-(--border-color) mb-6">
        {progressLoading ? (
          <div className="text-center py-2 text-(--muted) animate-pulse text-xs">
            Calculating progress…
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-(--text-primary)">
                Next milestone: {progress.nextMilestone} recipes
              </span>
              <span className="text-[10px] font-bold text-(--accent-emerald) bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {progress.progressToNext}/15 ({progress.progressPercent}%)
              </span>
            </div>

            <div className="h-3 bg-(--border-color) rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${progress.progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progress.progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>

            <p className="text-[10px] text-(--text-secondary) font-medium italic">
              You've spent <b className="text-(--text-primary)">{progress.totalMinutes}</b> minutes in the kitchen.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BADGES.map((b) => {
          const unlocked = progress.earnedBadges.some((x) => x.key === b.key);
          const Icon = BADGE_ICONS[b.key] || Award;

          return (
            <BadgeCard
              key={b.key}
              IconComponent={Icon}
              title={b.name}
              unlocked={unlocked}
              subtitle={`Unlock at ${b.at}`}
            />
          );
        })}
      </div>
    </div>
  );
}
