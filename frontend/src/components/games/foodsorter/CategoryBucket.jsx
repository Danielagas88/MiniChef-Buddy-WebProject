import React from "react";

/**
 * Renders the sorting category buttons.
 */
export default function CategoryBucket({ category, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(category.id)}
      disabled={disabled}
      className={`
        ${category.color} p-4 rounded-2xl border-b-[6px] transition-all 
        flex flex-col items-center justify-center gap-2 h-28 shadow-sm
        ${disabled ? "opacity-80" : "active:scale-95 active:border-b-0 hover:-translate-y-1"}
      `}
    >
      <span className="text-3xl pointer-events-none">{category.emoji}</span>
      <span className="font-bold text-slate-800 text-lg pointer-events-none">
        {category.label}
      </span>
    </button>
  );
}
