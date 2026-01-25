import React from "react";
import { ChefHat, Sparkles } from "lucide-react";

export default function MemoryCard({ card, onClick, disabled, isShaking }) {
  const isFlipped = card.isFlipped || card.isMatched;

  return (
    <div
      onClick={() => !disabled && !isFlipped && onClick(card)}
      className={`
        relative w-full aspect-square cursor-pointer perspective-1000 group 
        ${card.isMatched ? "opacity-60 scale-95" : "hover:-translate-y-1"} 
        ${isShaking ? "shake-animation" : ""}
        transition-all duration-300
      `}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/90 to-violet-600/90 rounded-2xl shadow-lg border-2 border-white/30 backdrop-blur-md flex items-center justify-center">
            <div className="absolute inset-2 border border-white/20 rounded-xl border-dashed" />
            <ChefHat
              className="text-white/40 w-8 h-8 md:w-10 md:h-10 animate-pulse-slow"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div
            className={`
            w-full h-full backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden flex items-center justify-center border-2 transition-colors
            ${
              card.isMatched
                ? "bg-emerald-500/20 border-emerald-500/50"
                : "bg-white/60 dark:bg-white/10 border-white/60 dark:border-white/10"
            }
          `}
          >
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-full object-cover p-2 rounded-2xl"
            />

            {card.isMatched && (
              <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="text-emerald-500 w-8 h-8 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
