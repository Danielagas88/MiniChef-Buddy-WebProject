import React from "react";

/**
 * Handles the display of the food item and its animations.
 */
export default function FoodCard({ item, isShaking, isAnimatingOut }) {
  if (!item) return <div className="w-48 h-48 mb-8" />;

  return (
    <div className="flex justify-center mb-8 min-h-[180px] items-center">
      <div
        className={`
  w-48 h-48 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-4 flex flex-col items-center justify-center gap-2 transition-all duration-300
  ${
    isShaking
      ? "shake-anim border-rose-500/50 bg-rose-500/20"
      : isAnimatingOut
        ? "fly-out-anim border-emerald-500/50 bg-emerald-500/20"
        : "bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:scale-105 shadow-black/5"
  }
`}
      >
        <span className="text-7xl drop-shadow-sm filter">{item.emoji}</span>
        <span className="text-(--text-primary) font-black text-xl tracking-wide">
          {item.name}
        </span>
      </div>
    </div>
  );
}
