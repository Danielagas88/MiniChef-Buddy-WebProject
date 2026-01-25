import React from "react";

/**
 * Renders the sorting category buttons.
 */
export default function CategoryBucket({ category, onClick, disabled }) {
  const glassStyles = {
    fruit_veg:
      "bg-emerald-500/10 border-emerald-500/30 border-b-emerald-500/50 text-emerald-700 dark:text-emerald-400 shadow-emerald-500/5",
    dairy:
      "bg-blue-500/10 border-blue-500/30 border-b-blue-500/50 text-blue-700 dark:text-blue-400 shadow-blue-500/5",
    protein:
      "bg-rose-500/10 border-rose-500/30 border-b-rose-500/50 text-rose-700 dark:text-rose-400 shadow-rose-500/5",
    grains:
      "bg-amber-500/10 border-amber-500/30 border-b-amber-500/50 text-amber-700 dark:text-amber-400 shadow-amber-500/5",
  };

  const currentStyle =
    glassStyles[category.id] ||
    "bg-white/10 border-white/20 text-[var(--text-primary)]";

  return (
    <button
      onClick={() => onClick(category.id)}
      disabled={disabled}
      className={`
        relative p-4 rounded-2xl border-2 backdrop-blur-md transition-all h-28 shadow-lg flex flex-col items-center justify-center gap-2
        ${currentStyle}
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:translate-y-[4px] active:border-b-2 hover:-translate-y-1"}
      `}
    >
      <span className="text-3xl pointer-events-none drop-shadow-sm">
        {category.emoji}
      </span>
      <span className="font-black text-lg pointer-events-none tracking-tight">
        {category.label}
      </span>
    </button>
  );
}
