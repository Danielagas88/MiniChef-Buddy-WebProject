import React from "react";
import { ChefHat, Sparkles } from "lucide-react";

/**
 * A single card component that handles flipping animation and styling.
 */
export default function MemoryCard({ card, onClick, disabled, isShaking }) {
  // Determine if the card is showing its face
  const isFlipped = card.isFlipped || card.isMatched;

  return (
    <div
      onClick={() => !disabled && !isFlipped && onClick(card)}
      className={`
        relative w-full aspect-square cursor-pointer perspective-1000 group 
        ${card.isMatched ? "opacity-60 grayscale-[0.2]" : ""} 
        ${isShaking ? "shake-animation" : ""}
      `}
    >
      {/* Inner Container for 3D Flip */}
      <div
        className={`
          relative w-full h-full transition-all duration-500 transform-style-3d 
          ${isFlipped ? "rotate-y-180" : ""}
        `}
      >
        {/* === FRONT (Hidden Side - Purple Back) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-md border-b-4 border-indigo-800 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
            {/* Decoration */}
            <div className="absolute inset-2 border-2 border-white/20 rounded-xl border-dashed" />
            <ChefHat
              className="text-white/40 w-8 h-8 md:w-10 md:h-10 animate-pulse-slow"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* === BACK (Revealed Side - Your Image) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div
            className={`
              w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center border-4 
              ${card.isMatched ? "border-emerald-400 bg-emerald-50" : "border-white"}
            `}
          >
            {/* The Image from memoryCards data */}
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-full object-cover p-2"
            />

            {/* Match Indicator (Sparkles) */}
            {card.isMatched && (
              <Sparkles className="absolute top-1 right-1 text-emerald-400 w-4 h-4 animate-spin-slow" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
