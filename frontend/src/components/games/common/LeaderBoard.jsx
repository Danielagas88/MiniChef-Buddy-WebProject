/**
 * Leaderboard
 *
 * Ranks players by score. Used on GamesPage. Shows loading state when fetching.
 *
 * @param {Object} props
 * @param {Object[]} [props.players=[]] - List of { username, totalScore } 
 * @param {boolean} [props.isLoading=false] - Whether leaderboard is loading
 *
 * @component
 */
import React from "react";
import { Trophy, Crown, ChefHat, Star, Loader } from "lucide-react";

export default function Leaderboard({ players = [], isLoading = false }) {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown size={22} className="text-yellow-500" />;
      case 1:
        return <Star size={20} className="text-slate-500" />; 
      case 2:
        return <Star size={20} className="text-orange-500" />;
      default:
        return <ChefHat size={16} className="text-emerald-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader className="animate-spin text-emerald-500" size={32} />
        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
          Kitchen is heating up...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header - More Compact */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <h3 className="font-black text-xl text-(--text-primary) uppercase italic tracking-tighter">
            Chef <span className="text-emerald-500">Rankings</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
          Global
        </span>
      </div>

      {/* Unified List - More Compact */}
      <div className="space-y-2">
        {players.map((player, index) => {
          const isTop3 = index < 3;

          // Dynamic styling logic
          const rankStyles = {
            0: "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30 dark:from-yellow-500/20",
            1: "bg-gradient-to-r from-slate-400/10 to-transparent border-slate-400/30 dark:from-slate-400/20",
            2: "bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30 dark:from-orange-500/20",
          };

          const cardStyle = isTop3
            ? rankStyles[index]
            : "bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10";

          return (
            <div
              key={player._id || index}
              className={`
                relative flex items-center justify-between rounded-2xl border-2 backdrop-blur-md transition-all duration-300
                ${cardStyle}
                ${isTop3 ? "py-3 px-5 mx-0 shadow-lg shadow-black/5" : "py-2 px-5 mx-2 shadow-sm opacity-90 hover:opacity-100"} 
              `}
            >
              {/* Left Side: Rank & Info */}
              <div className="flex items-center gap-4 overflow-hidden">
                <div
                  className={`
                  font-black text-[11px] w-6 h-6 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300
                    ${
                      isTop3
                        ? "bg-white/60 dark:bg-white/20 text-(--text-primary) border-white/60 dark:border-white/20 shadow-sm"
                        : "bg-white/30 dark:bg-white/5 text-(--text-secondary) border-white/20 dark:border-white/10"
                    }
`}
                >
                  {index + 1}
                </div>
                {/* Smaller Icon Container */}
                <div
                  className={`
                  flex items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 shadow-sm border border-white/40 shrink-0
                  ${isTop3 ? "w-11 h-11" : "w-8 h-8"}
                `}
                >
                  {getRankIcon(index)}
                </div>

                {/* Name & Title */}
                <div className="flex flex-col truncate">
                  <span
                    className={`font-black text-(--text-primary) truncate ${isTop3 ? "text-base" : "text-sm"}`}
                  >
                    {player.username || "Unknown Chef"}
                  </span>
                  {isTop3 && (
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">
                      {index === 0
                        ? "Master Chef"
                        : index === 1
                          ? "Executive Chef"
                          : "Sous Chef"}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Score */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black ${isTop3 ? "text-lg text-emerald-600 dark:text-emerald-400" : "text-sm text-(--text-secondary)"}`}
                >
                  {player.totalScore || 0}
                </span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
                  pts
                </span>
              </div>

              {/* Rank 1 TOP Badge */}
              {index === 0 && (
                <div className="absolute -top-2.5 -right-1 bg-linear-to-r from-yellow-400 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg uppercase rotate-12 border-2 border-white dark:border-slate-800">
                  TOP
                </div>
              )}
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="text-center py-10 bg-white/20 dark:bg-white/5 rounded-3xl border border-dashed border-white/20">
          <p className="text-(--text-secondary) text-sm font-bold uppercase tracking-wider italic">
            No legends yet...
          </p>
        </div>
      )}
    </div>
  );
}
