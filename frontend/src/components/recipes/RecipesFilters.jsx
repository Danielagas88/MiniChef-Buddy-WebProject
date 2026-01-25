import { CATEGORY_FILTERS } from "../../services/recipeService";

export default function RecipesFilters({
  search,
  onSearch,
  level,
  onLevel,
  activeCategory,
  onCategoryChange,
  levelOptions = ["Easy", "Medium", "Advanced"],
}) {
  return (
    <div className="flex flex-col gap-6 w-full bg-(--card-surface) backdrop-blur-md p-6 rounded-3xl border border-(--card-surface-border) shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search yummy recipes..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-(--border-color) rounded-full focus:outline-none focus:border-emerald-400 bg-(--input-bg) text-(--text-primary) font-medium transition-all"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2.5 text-sm font-bold border-2 border-(--border-color) rounded-full focus:outline-none focus:border-amber-400 bg-(--input-bg) text-(--text-primary) cursor-pointer transition-all"
            value={level}
            onChange={(e) => onLevel(e.target.value)}
          >
            <option value="" className="bg-(--input-bg) text-(--text-primary)">
              All Levels
            </option>
            {levelOptions.map((lvl) => (
              <option key={lvl} value={lvl} className="bg-(--input-bg) text-(--text-primary)">
                {lvl}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--muted)">
            ▼
          </span>
        </div>
      </div>

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
          >
            {cat === "All" ? "🌈 All" : cat}
          </button>
        ))}
      </div>
    </div>
  );
}
