export default function StepPanel({
  stepText,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}) {
  return (
    <>
      <div className="bg-pink-50 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
            Current step
          </h3>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
            {stepText}
          </p>
        </div>

        <div className="w-full md:w-40 h-32 bg-white rounded-2xl shadow-inner flex items-center justify-center text-gray-400 text-xs md:text-sm">
          Step image
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-gray-200 text-gray-700 disabled:opacity-40"
        >
          Previous step
        </button>
        <button
          onClick={onNext}
          disabled={disableNext}
          className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40"
        >
          Next step
        </button>
      </div>
    </>
  );
}
