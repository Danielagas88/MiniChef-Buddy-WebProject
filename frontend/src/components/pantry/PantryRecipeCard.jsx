/**
 * PantryRecipeCard
 *
 * Card for a single pantry-matched recipe: image, title, level, matched
 * ingredients count, and "Start!" button. Used in PantryResults.
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe object (id, title, image, level, category)
 * @param {number} props.hitsCount - Number of matched ingredients
 * @param {string[]} props.hits - List of matched ingredient names
 * @param {Function} props.onStart - Called when "Start!" is clicked
 *
 * @component
 */
export default function PantryRecipeCard({ recipe, hitsCount, hits, onStart }) {
  const levelStyles = {
    Easy: "text-(--accent-emerald) bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-(--accent-amber) bg-amber-500/10 border-amber-500/20",
    Advanced: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <article className="bg-(--card-surface) backdrop-blur-md rounded-2xl shadow-sm border border-(--card-surface-border) hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group h-full">
      <div className="relative overflow-hidden h-28 md:h-32">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
          {hitsCount} Matched
        </div>
      </div>

      <div className="p-3 md:p-4 flex-1 flex flex-col gap-1.5">
        <h4 className="text-sm md:text-base font-bold text-(--text-primary) group-hover:text-(--accent-emerald) transition-colors line-clamp-1">
          {recipe.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold uppercase tracking-wider ${levelStyles[recipe.level] || levelStyles.Easy}`}
          >
            {recipe.level}
          </span>
          <span className="text-[9px] text-(--text-secondary) font-semibold italic">
            • {recipe.category}
          </span>
        </div>

        <p className="text-[10px] md:text-[11px] text-(--text-secondary) leading-snug mb-2 flex-1">
          Matched:{" "}
          <span className="text-(--accent-emerald) font-bold">
            {hits.join(", ")}
          </span>
        </p>

        <button
          onClick={onStart}
          className="w-full py-2 text-[10px] md:text-xs font-bold rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-sm transition-all active:scale-95"
        >
          Start! 👨‍🍳
        </button>
      </div>
    </article>
  );
}
