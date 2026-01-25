import React from "react";
import { ChefHat, Sword } from "lucide-react";

export default function TriviaFeedback({
  isCorrect,
  fact,
  onNext,
  isLastQuestion,
  showNextButton, // Controls if the button is visible
  isBattle, // Controls if we show emojis or battle icons
}) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4 animate-bounce-slight">
      <div
        className={`
  p-10 rounded-[3rem] shadow-2xl border-4 backdrop-blur-2xl text-center relative overflow-hidden
  ${
    isCorrect
      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-100"
      : "bg-rose-500/20 border-rose-500/30 text-rose-900 dark:text-rose-100"
  }
`}
      >
        {/* Background Bubbles Decoration */}
        <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white opacity-20"></div>
        <div className="absolute -bottom-5 -left-5 w-32 h-32 rounded-full bg-white opacity-20"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-7xl mb-6 filter drop-shadow-md flex justify-center">
            {/* OPTION 1: Solo Emojis */}
            {!isBattle && <span>{isCorrect ? "😎" : "😅"}</span>}

            {/* OPTION 2: Battle Icons */}
            {isBattle && (
              <div className={isCorrect ? "text-emerald-500" : "text-rose-500"}>
                <ChefHat size={80} strokeWidth={2.5} />
              </div>
            )}
          </div>

          <h4 className="font-black text-4xl mb-3">
            {isCorrect ? "Tasty!" : "Oops..."}
          </h4>

          <p className="font-medium text-xl leading-relaxed mb-10 opacity-90 text-(--text-primary)">
            {fact}
          </p>

          {/* Conditional Button: Only shows in Solo mode */}
          {showNextButton && (
            <button
              onClick={onNext}
              className={`
                  px-10 py-4 rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 bg-white border-b-4
                  ${
                    isCorrect
                      ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      : "text-rose-600 border-rose-200 hover:bg-rose-50"
                  }
              `}
            >
              {isLastQuestion ? "See Final Score 🏆" : "Next Question ➜"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
