// src/components/recipes/RecipesFilters.jsx
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
    <div className="flex flex-col gap-4 w-full">
      {" "}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by recipe name..."
          className="w-36 md:w-56 px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />

        <select
          className="text-xs md:text-sm px-2 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={level}
          onChange={(e) => onLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          {levelOptions.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(CATEGORY_FILTERS).map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold transition-all shadow-sm border
              ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-orange-50"
              }
            `}
          >
            {cat === "All" ? "All" : cat}
          </button>
        ))}
      </div>
    </div>
  );
}
