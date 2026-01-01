/* StepCard.jsx */
function SpeakingRobot({ isSpeaking }) {
  return (
    <div
      className={`text-6xl md:text-7xl transition-transform duration-300 ${
        isSpeaking ? "animate-bounce" : ""
      }`}
    >
      🤖
    </div>
  );
}

export default function StepCard({
  stepText,
  currentStep,
  totalSteps,
  level,
  isSpeaking,
  onPrev,
  onNext,
  isFirst,
  isLast,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[300px] flex flex-col justify-between relative overflow-hidden border border-emerald-50">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -z-0 opacity-60"></div>

      <div className="z-10 relative">
        <div className="flex justify-between items-start mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold tracking-wide border ${
              level === "Advanced"
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-emerald-100 text-emerald-700 border-emerald-200"
            }`}
          >
            STEP {currentStep} of {totalSteps} • {level}
          </span>
          <SpeakingRobot isSpeaking={isSpeaking} />
        </div>

        <p className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
          {stepText}
        </p>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="px-6 py-3 rounded-full text-slate-500 font-bold hover:bg-slate-100 disabled:opacity-30 text-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className={`px-8 py-3 rounded-full text-slate-800 text-lg font-bold shadow-lg transition transform hover:scale-105 ${
            isLast
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-amber-400 hover:bg-amber-500"
          }`}
        >
          {isLast ? "Finish! 🎉" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
