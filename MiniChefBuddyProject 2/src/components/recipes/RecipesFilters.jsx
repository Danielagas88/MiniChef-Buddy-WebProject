export default function RecipesFilters({ search, onSearch, level, onLevel }) {
  return (
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
        <option value="">All levels</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
  );
}
