// src/components/games/common/GameButton.jsx
import React from "react";

/**
 * A reusable "Bubble" style button component.
 * Supports different variants for styling (primary, correct, wrong, etc.).
 */
export default function GameButton({
  label,
  onClick,
  variant = "default",
  disabled = false,
  icon: Icon,
  className = "",
}) {
  // Define styles based on the variant prop
  const baseStyles =
    "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-100",
    primary:
      "bg-blue-500 text-white hover:bg-blue-400 border-b-4 border-blue-700",
    correct: "bg-emerald-400 text-emerald-900 border-b-4 border-emerald-600",
    wrong: "bg-rose-400 text-rose-900 border-b-4 border-rose-600",
    outline:
      "bg-transparent border-2 border-slate-300 text-slate-500 hover:bg-slate-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {Icon && <Icon size={20} strokeWidth={2.5} />}
      <span>{label}</span>
    </button>
  );
}
