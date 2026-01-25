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
      <div className="relative z-10 bg-emerald-500/10 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl border-4 border-white/40 dark:border-white/10 text-center min-h-[450px] flex flex-col justify-center transition-all">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-emerald-700 rounded-b-xl opacity-50"></div>

        {/* Question Text */}
        <h3 className="text-2xl md:text-3xl font-black text-(--text-primary) leading-relaxed mb-12 drop-shadow-md">
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
  relative overflow-hidden p-6 rounded-2xl font-black text-lg transition-all duration-200
  active:scale-95 shadow-[0_6px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1.5 backdrop-blur-md border-2
  ${
    status === "correct"
      ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20"
      : status === "wrong"
        ? "bg-rose-500 text-white border-rose-400 shadow-rose-500/20"
        : "bg-white/60 dark:bg-white/10 text-(--text-primary) border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20"
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
