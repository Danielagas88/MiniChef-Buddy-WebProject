import React from "react";
import { Trophy } from "lucide-react";
import GameTimer from "./GameTimer";

const THEMES = {
  green: {
    wrapper: "bg-emerald-100/90 border-emerald-200 shadow-emerald-200/50",
    text: "text-emerald-900",
    pill: "bg-white text-emerald-700",
    activeDot: "bg-emerald-500 ring-emerald-300",
    inactiveDot: "bg-emerald-200",
  },
  purple: {
    wrapper: "bg-violet-100/90 border-violet-200 shadow-violet-200/50",
    text: "text-violet-900",
    pill: "bg-white text-violet-700",
    activeDot: "bg-violet-500 ring-violet-300",
    inactiveDot: "bg-violet-200",
  },
  orange: {
    wrapper: "bg-orange-100/90 border-orange-200 shadow-orange-200/50",
    text: "text-orange-900",
    pill: "bg-white text-orange-700",
    activeDot: "bg-orange-500 ring-orange-300",
    inactiveDot: "bg-orange-200",
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
      rounded-full border-4 backdrop-blur-md shadow-xl transition-all duration-300
      ${styles.wrapper}
    `}
    >
      {/* LEFT SECTION: Timer & Info */}
      <div className="flex items-center gap-3 justify-start">
        <div
          className={`px-4 py-2 rounded-full shadow-sm flex items-center gap-2 font-bold min-w-[90px] justify-center ${styles.pill}`}
        >
          <GameTimer
            timeLeft={timeLeft}
            totalTime={totalTime}
            variant="digital"
          />
        </div>

        {extraInfo && (
          <div
            className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm hidden lg:block ${styles.pill}`}
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
                    ? `${styles.activeDot} scale-125 ring-2`
                    : idx < progressCurrent
                      ? styles.activeDot
                      : styles.inactiveDot
                }
              `}
            />
          ))}
        </div>

        {/* Mobile progress text */}
        <div
          className={`md:hidden font-black text-[10px] uppercase tracking-widest opacity-80 ${styles.text}`}
        >
          {progressLabel} {progressCurrent + 1}/{progressTotal}
        </div>
      </div>

      {/* RIGHT SECTION: Score */}
      <div className="flex items-center justify-end">
        <div
          className={`px-5 py-2 rounded-full flex items-center gap-2 shadow-sm border-2 border-slate-50/50 ${styles.pill}`}
        >
          <Trophy size={18} className="text-yellow-500 fill-yellow-500" />
          <span className="font-black text-xl leading-none tabular-nums">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
