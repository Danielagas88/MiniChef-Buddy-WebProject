/**
 * GameButton
 *
 * Reusable game UI button. Variants: default, primary, correct, wrong, outline, etc.
 * Used in games and GameEndScreen.
 *
 * @param {Object} props
 * @param {string} props.label - Button text
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.variant="default"] - Style variant
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ComponentType} [props.icon] - Optional Lucide icon
 * @param {string} [props.className=""] - Extra CSS classes
 *
 * @component
 */
import React from "react";

export default function GameButton({
  label,
  onClick,
  variant = "default",
  disabled = false,
  icon: Icon,
  className = "",
}) {
  const baseStyles =
    "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-(--input-bg) text-(--text-primary) hover:opacity-90 border-2 border-(--border-color) backdrop-blur-sm",
    primary:
      "bg-emerald-500 text-white hover:bg-emerald-400 border-b-4 border-emerald-700 dark:border-emerald-900 shadow-emerald-200/50",
    correct:
      "bg-emerald-400 dark:bg-emerald-500/40 text-emerald-900 dark:text-emerald-100 border-b-4 border-emerald-600 dark:border-emerald-500/60",
    wrong:
      "bg-rose-400 dark:bg-rose-500/40 text-rose-900 dark:text-rose-100 border-b-4 border-rose-600 dark:border-rose-500/60",
    outline:
      "bg-(--input-bg) border-2 border-(--border-color) text-(--accent-emerald) hover:opacity-90",
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
