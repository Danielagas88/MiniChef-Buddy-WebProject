/**
 * RecipesFilters
 *
 * Search, level, and category filter controls for RecipesPage.
 *
 * @param {Object} props - Controlled filter values and handlers
 * @param {string} props.search - Search text
 * @param {Function} props.onSearch - Search change handler
 * @param {string} props.level - Level filter
 * @param {Function} props.onLevel - Level change handler
 * @param {string} props.activeCategory - Active category
 * @param {Function} props.onCategoryChange - Category change handler
 * @param {string[]} [props.levelOptions] - Allowed level options
 *
 * @component
 */
import SearchInput from "./filters/SearchInput.jsx";
import LevelFilter from "./filters/LevelFilter.jsx";
import CategoryButtons from "./filters/CategoryButtons.jsx";

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
        <SearchInput value={search} onChange={onSearch} />
        <LevelFilter value={level} onChange={onLevel} levelOptions={levelOptions} />
      </div>
      <CategoryButtons activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
    </div>
  );
}
