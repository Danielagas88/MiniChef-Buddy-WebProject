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
          w-48 h-48 bg-white rounded-[2rem] shadow-xl border-4 border-white
          flex flex-col items-center justify-center gap-2
          transition-all duration-300
          ${isShaking ? "shake-anim border-rose-200 bg-rose-50" : ""}
          ${isAnimatingOut ? "fly-out-anim border-emerald-200 bg-emerald-50" : "hover:scale-105"}
        `}
      >
        <span className="text-7xl drop-shadow-sm filter">{item.emoji}</span>
        <span className="text-slate-700 font-black text-xl tracking-wide">
          {item.name}
        </span>
      </div>
    </div>
  );
}
