/**
 * GameHeader
 *
 * In-game header: title, score/timer, theme pills. Used by Trivia, Memory, Food Sorter.
 *
 * @param {Object} props
 * @param {string} props.title - Header title
 * @param {string} [props.theme="green"] - Theme: green, purple, orange, indigo
 * @param {React.ReactNode} [props.children] - Optional extra content (e.g. score, timer)
 *
 * @component
 */
import React from "react";
import { Trophy } from "lucide-react";
import GameTimer from "./GameTimer";

const THEMES = {
  green: {
    wrapper:
      "bg-emerald-500/10 dark:bg-white/5 border-emerald-500/20 dark:border-white/10 shadow-emerald-500/5",
    text: "text-emerald-700 dark:text-emerald-400",
    pill: "bg-white/60 dark:bg-white/10 text-emerald-700 dark:text-emerald-400 border-white/40 dark:border-white/10",
    activeDot: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    inactiveDot: "bg-emerald-200 dark:bg-white/5",
  },
  purple: {
    wrapper:
      "bg-violet-500/10 dark:bg-white/5 border-violet-500/20 dark:border-white/10 shadow-violet-500/5",
    text: "text-violet-700 dark:text-violet-400",
    pill: "bg-white/60 dark:bg-white/10 text-violet-700 dark:text-violet-400 border-white/40 dark:border-white/10",
    activeDot: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.4)]",
    inactiveDot: "bg-violet-200 dark:bg-white/5",
  },
  orange: {
    wrapper:
      "bg-orange-500/10 dark:bg-white/5 border-orange-500/20 dark:border-white/10 shadow-orange-500/5",
    text: "text-orange-700 dark:text-orange-400",
    pill: "bg-white/60 dark:bg-white/10 text-orange-700 dark:text-orange-400 border-white/40 dark:border-white/10",
    activeDot: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]",
    inactiveDot: "bg-orange-200 dark:bg-white/5",
  },
};

export default function GameHeader({
  score,
  timeLeft,
  totalTime,
  progressCurrent,
  progressTotal,
  progressLabel = "Round",
  theme = "green",
  extraInfo = null,
}) {
  const styles = THEMES[theme] || THEMES.green;

  return (
    <div
      className={`
      grid grid-cols-3 items-center 
      w-full max-w-2xl mx-auto mb-8 px-6 py-3
      rounded-full border-2 backdrop-blur-xl shadow-2xl transition-all duration-300
      ${styles.wrapper}
    `}
    >
      {/* LEFT SECTION: Timer & Info */}
      <div className="flex items-center gap-3 justify-start">
        <div
          className={`px-4 py-2 rounded-full shadow-sm flex items-center gap-2 font-black min-w-[90px] justify-center border backdrop-blur-md ${styles.pill}`}
        >
          <GameTimer
            timeLeft={timeLeft}
            totalTime={totalTime}
            variant="digital"
          />
        </div>

        {extraInfo && (
          <div
            className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm hidden lg:block border backdrop-blur-md ${styles.pill}`}
          >
            {extraInfo}
          </div>
        )}
      </div>

      {/* CENTER SECTION: Progress Dots */}
      <div className="flex flex-col items-center justify-center">
        <div className="hidden md:flex gap-1.5">
          {Array.from({ length: progressTotal }).map((_, idx) => (
            <div
              key={idx}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-500
                ${
                  idx === progressCurrent
                    ? `${styles.activeDot} scale-125 ring-2 ring-white/50 dark:ring-white/20`
                    : idx < progressCurrent
                      ? styles.activeDot
                      : `${styles.inactiveDot} border border-black/5 dark:border-white/10`
                }
              `}
            />
          ))}
        </div>

        {/* Mobile progress text */}
        <div
          className={`md:hidden font-black text-[10px] uppercase tracking-widest opacity-90 ${styles.text}`}
        >
          {progressLabel} {progressCurrent + 1}/{progressTotal}
        </div>
      </div>

      {/* RIGHT SECTION: Score */}
      <div className="flex items-center justify-end">
        <div
          className={`px-5 py-2 rounded-full flex items-center gap-2 shadow-sm border backdrop-blur-md ${styles.pill}`}
        >
          <Trophy
            size={18}
            className="text-yellow-500 fill-yellow-500 drop-shadow-sm"
          />
          <span className="font-black text-xl leading-none tabular-nums">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
