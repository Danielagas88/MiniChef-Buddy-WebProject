import React from "react";
import { Trophy, Crown, ChefHat, Star, Loader } from "lucide-react";

export default function Leaderboard({ players = [], isLoading = false }) {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown size={22} className="text-yellow-500" />;
      case 1:
        return <Star size={20} className="text-slate-500" />; // כסף מודגש יותר
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
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Header - More Compact */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <h3 className="font-black text-lg text-slate-800 uppercase italic tracking-tighter">
            Chef <span className="text-emerald-500">Rankings</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
          Global
        </span>
      </div>

      {/* Unified List - More Compact */}
      <div className="space-y-1.5">
        {players.map((player, index) => {
          const isTop3 = index < 3;

          // Dynamic styling logic
          const rankStyles = {
            0: "bg-gradient-to-r from-yellow-50 to-white border-yellow-200 shadow-sm",
            1: "bg-gradient-to-r from-slate-100 to-white border-slate-400 shadow-sm", // הדגשת מסגרת כסופה
            2: "bg-gradient-to-r from-orange-50 to-white border-orange-200 shadow-sm",
          };

          const cardStyle =
            rankStyles[index] ||
            "bg-white border-slate-100 hover:border-slate-200";

          return (
            <div
              key={player._id || index}
              className={`
                relative flex items-center justify-between rounded-xl border-2 transition-all duration-200
                ${cardStyle}
                ${isTop3 ? "py-2 px-4 mx-0" : "py-1.5 px-4 mx-2"} 
              `}
            >
              {/* Left Side: Rank & Info */}
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Slimmer Rank Badge */}
                <div
                  className={`
                  font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full
                  ${isTop3 ? "bg-white shadow-inner" : "text-slate-400"}
                `}
                >
                  {index + 1}
                </div>

                {/* Smaller Icon Container */}
                <div
                  className={`
                  flex items-center justify-center rounded-lg bg-white shadow-sm flex-shrink-0
                  ${isTop3 ? "w-9 h-9 border border-white/50" : "w-7 h-7"}
                `}
                >
                  {getRankIcon(index)}
                </div>

                {/* Name & Title */}
                <div className="flex flex-col truncate">
                  <span
                    className={`font-bold text-slate-800 truncate ${isTop3 ? "text-sm" : "text-xs"}`}
                  >
                    {player.username || "Unknown Chef"}
                  </span>
                  {isTop3 && (
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {index === 0
                        ? "Master"
                        : index === 1
                          ? "Executive"
                          : "Sous Chef"}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Score */}
              <div className="flex items-center gap-1">
                <span
                  className={`font-black ${isTop3 ? "text-sm text-slate-700" : "text-xs text-slate-500"}`}
                >
                  {player.totalScore || 0}
                </span>
                <span className="text-[9px] font-bold text-slate-300 uppercase">
                  pts
                </span>
              </div>

              {/* Rank 1 TOP Badge */}
              {index === 0 && (
                <div className="absolute -top-2 -right-1 bg-yellow-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md uppercase tracking-tighter rotate-12 border border-white/50">
                  TOP
                </div>
              )}
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="text-center py-6 text-slate-300 text-xs font-bold uppercase">
          No data found
        </div>
      )}
    </div>
  );
}
