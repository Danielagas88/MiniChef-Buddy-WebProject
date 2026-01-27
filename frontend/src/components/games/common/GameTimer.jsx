/**
 * GameTimer
 *
 * Timer display for games: bar or digital. Used in GameHeader (Trivia, etc.).
 *
 * @param {Object} props
 * @param {number} props.timeLeft - Seconds remaining
 * @param {number} props.totalTime - Total seconds for progress
 * @param {string} [props.variant="bar"] - "bar" or "digital"
 *
 * @component
 */
import React from "react";
import { Clock } from "lucide-react";

export default function GameTimer({ timeLeft, totalTime, variant = "bar" }) {
  // 1. Digital Clock Mode (Best for Headers)
  if (variant === "digital") {
    return (
      <div className="flex items-center gap-1.5">
        <Clock size={16} className="text-current opacity-80" />
        <span
          className={`font-black tabular-nums ${timeLeft <= 5 ? "animate-pulse" : ""}`}
        >
          {timeLeft}s
        </span>
      </div>
    );
  }

  // 2. Progress Bar Mode (Original)
  const percentage = Math.max(0, (timeLeft / totalTime) * 100);

  return (
    <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 ease-linear ${
          timeLeft <= 5 ? "bg-rose-500" : "bg-current"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
