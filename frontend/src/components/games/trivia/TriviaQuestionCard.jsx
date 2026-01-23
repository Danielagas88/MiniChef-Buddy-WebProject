import React from "react";
import GameButton from "../common/GameButton";

export default function TriviaQuestionCard({
  question,
  options,
  selectedAnswer,
  showFeedback,
  correctAnswer,
  onAnswerClick,
}) {
  return (
    <div className="relative animate-scale-in max-w-3xl mx-auto w-full px-4">
      <div className="relative z-10 bg-emerald-100 rounded-[3rem] p-10 md:p-14 shadow-2xl border-8 border-emerald-200 text-center min-h-[450px] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-emerald-700 rounded-b-xl opacity-50"></div>

        {/* Question Text */}
        <h3 className="text-2xl md:text-3xl font-black text-emerald-900 leading-relaxed mb-12 drop-shadow-md">
          {question}
        </h3>

        {/* Answers Grid - Buttons pop out against the dark background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {options.map((option) => {
            // Determine visual status
            let status = "";
            if (showFeedback) {
              if (option === correctAnswer) status = "correct";
              if (option === selectedAnswer && option !== correctAnswer)
                status = "wrong";
            }

            return (
              <button
                key={option}
                onClick={() => onAnswerClick(option)}
                disabled={showFeedback}
                className={`
                  relative overflow-hidden p-6 rounded-2xl font-bold text-lg transition-all duration-200
                  active:scale-95 shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px]
                  ${
                    status === "correct"
                      ? "bg-emerald-400 text-emerald-900 ring-4 ring-emerald-200" // Correct style
                      : status === "wrong"
                        ? "bg-rose-400 text-rose-900 ring-4 ring-rose-200" // Wrong style
                        : "bg-white text-emerald-900 hover:bg-emerald-50" // Default style (High Contrast)
                  }
                `}
              >
                {/* Flex layout for the button content */}
                <div className="flex items-center justify-between relative z-10">
                  <span>{option}</span>
                  {status === "correct" && <span>✅</span>}
                  {status === "wrong" && <span>❌</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
