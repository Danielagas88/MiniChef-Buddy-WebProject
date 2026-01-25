import { CATEGORY_FILTERS } from "../../../services/recipeService";

/**
 * Category filter buttons component
 */
export default function CategoryButtons({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(CATEGORY_FILTERS).map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border-2 ${
            activeCategory === cat
              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg scale-105"
              : "bg-(--input-bg) text-(--text-secondary) border-(--border-color) hover:border-emerald-200 hover:bg-emerald-500/10"
          }`}
          aria-label={`Filter by ${cat}`}
          aria-pressed={activeCategory === cat}
        >
          {cat === "All" ? "🌈 All" : cat}
        </button>
      ))}
    </div>
  );
}
