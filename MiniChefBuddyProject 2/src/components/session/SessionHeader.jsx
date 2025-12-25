export default function SessionHeader({ title, onBack }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Cooking: {title}
        </h2>
        <p className="text-xs text-gray-500">
          Follow the steps and always ask an adult for help when needed.
        </p>
      </div>
      <button
        onClick={onBack}
        className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-gray-200 text-gray-700"
      >
        Back to recipes
      </button>
    </div>
  );
}
