/**
 * GameEndScreen
 *
 * End-of-game screen: title, score, optional moves/battle info,
 * "Play Again" and "Back to Menu" buttons. Used by Trivia, Memory, Food Sorter.
 *
 * @param {Object} props
 * @param {string} props.title - Screen title (e.g. "You Win!")
 * @param {number} props.score - Player score
 * @param {number} [props.moves] - Moves taken (e.g. Memory)
 * @param {string} [props.variant="emerald"] - Theme: emerald, orange, violet, indigo
 * @param {Function} props.onPlayAgain - Play again handler
 * @param {Function} props.onExit - Back to menu handler
 * @param {boolean} [props.isBattle] - Multiplayer battle mode
 * @param {number} [props.opponentScore] - Opponent score in battle
 * @param {string} [props.opponentName] - Opponent name
 * @param {boolean} [props.technicalWin] - Win by opponent leaving
 * @param {number} [props.winBonus] - Bonus points for winning
 *
 * @component
 */
import React from "react";
import GameButton from "./GameButton";
import { Footprints } from "lucide-react";

export default function GameEndScreen({
  title,
  score,
  moves,
  variant = "emerald",
  onPlayAgain,
  onExit,
  isBattle = false,
  opponentScore,
  opponentName,
  technicalWin = false,
  winBonus = 0,
}) {
  const themes = {
    emerald:
      "text-emerald-600 dark:text-emerald-200 bg-emerald-500/10 dark:bg-emerald-900/40 border-emerald-500/30 dark:border-emerald-400/60 shadow-emerald-500/10",
    orange:
      "text-orange-600 dark:text-orange-200 bg-orange-500/10 dark:bg-orange-900/40 border-orange-500/30 dark:border-orange-400/60 shadow-orange-500/10",
    violet:
      "text-violet-600 dark:text-violet-200 bg-violet-500/10 dark:bg-violet-900/40 border-violet-500/30 dark:border-violet-400/60 shadow-violet-500/10",
    indigo:
      "text-indigo-600 dark:text-indigo-200 bg-indigo-500/10 dark:bg-indigo-900/40 border-indigo-500/30 dark:border-indigo-400/60 shadow-indigo-500/10",
  };

  const currentTheme = themes[variant] || themes.emerald;

  return (
    <div className="text-center py-6 animate-fade-in max-w-md mx-auto w-full px-4">
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border-4 border-white/60 dark:border-white/10 relative overflow-hidden transition-all">
        <div className="text-7xl mb-6 drop-shadow-lg flex justify-center">
          {isBattle
            ? technicalWin
              ? "🏃‍♂️"
              : score > opponentScore
                ? "🏆"
                : score === opponentScore
                  ? "🤝"
                  : "🍳"
            : score > 0
              ? "🏆"
              : "⏰"}
        </div>

        <h2 className="text-4xl font-black text-(--text-primary) mb-2 italic uppercase tracking-tighter drop-shadow-sm">
          {title || (score > 0 ? "Well Done!" : "Time's Up!")}
        </h2>

        {isBattle && winBonus > 0 && score > opponentScore && (
          <p className="text-emerald-500 font-black text-sm mb-4 animate-bounce">
            + {winBonus} WINNER BONUS!
          </p>
        )}

        {isBattle ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              className={`p-5 rounded-3xl border-2 backdrop-blur-md ${currentTheme}`}
            >
              <p className="text-[10px] font-black uppercase mb-1">You</p>
              <p className="text-4xl font-black text-(--text-primary)">
                {score}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-orange-500/10 border-2 border-orange-500/20 backdrop-blur-md">
              <p className="text-[10px] font-black text-orange-500 uppercase mb-1 truncate">
                {opponentName}
              </p>
              <p className="text-4xl font-black text-(--text-primary)">
                {opponentScore}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`p-6 md:p-8 rounded-4xl border-2 backdrop-blur-md mb-6 mx-auto flex flex-col items-center justify-center max-w-[280px] ${currentTheme}`}
          >
            <div className="flex flex-col items-center w-full space-y-4">
              <div className="flex flex-col items-center">
                <span className="text-sm font-black uppercase tracking-[0.3em] dark:opacity-100 opacity-80 mb-1 dark:text-emerald-100">
                  Final Score
                </span>
                <p className="text-7xl font-black dark:text-emerald-300 text-(--text-primary) leading-none drop-shadow-2xl">
                  {score}
                </p>
              </div>

              {moves !== undefined && (
                <div className="flex items-center gap-2 bg-white/30 dark:bg-white/10 px-5 py-2 rounded-full border border-white/40 dark:border-white/10 shadow-sm mt-2 transition-transform hover:scale-105">
                  <Footprints size={14} className="opacity-70" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Moves: {moves}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="space-y-4">
          <GameButton
            label="Play Again"
            onClick={onPlayAgain}
            variant="primary"
            className={`w-full h-14 text-white! font-black rounded-full shadow-lg active:scale-95 ${variant === "orange" ? "bg-orange-500!" : variant === "violet" ? "bg-violet-600!" : "bg-emerald-600!"}`}
          />
          <GameButton
            label="Back to Menu"
            onClick={onExit}
            variant="default"
            className="w-full h-14 font-black rounded-full bg-white/40! dark:bg-slate-800! dark:text-white! text-slate-800! border-white/60! dark:border-slate-600! backdrop-blur-md transition-all hover:bg-white/60! dark:hover:bg-slate-700!"
          />
        </div>
      </div>
    </div>
  );
}
