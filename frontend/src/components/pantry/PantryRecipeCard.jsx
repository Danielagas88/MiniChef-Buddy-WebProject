export default function PantryRecipeCard({ recipe, hitsCount, hits, onStart }) {
  // Use specialized colors for each level to make it more visual
  const levelColors = {
    Easy: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Medium: "text-amber-600 bg-amber-50 border-amber-100",
    Advanced: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <article className="bg-white bg-opacity-95 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group h-full">
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
          {hitsCount} Matched
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {recipe.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${
              levelColors[recipe.level] || levelColors.Easy
            }`}
          >
            {recipe.level}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold italic">
            • {recipe.category}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug mb-4">
          Matched from your pantry:{" "}
          <span className="text-emerald-600 font-bold">{hits.join(", ")}</span>
        </p>

        <button
          onClick={onStart}
          className="mt-auto w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-400 text-slate-800 hover:bg-amber-500 shadow-sm transition-all active:scale-95"
        >
          Start Cooking! 👨‍🍳
        </button>
      </div>
    </article>
  );
}
