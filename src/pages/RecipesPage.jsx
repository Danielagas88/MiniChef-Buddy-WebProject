import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "../data/fakeData.js";

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const navigate = useNavigate();

  const filteredRecipes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesName = recipe.title.toLowerCase().includes(searchValue);
      const matchesLevel = levelFilter ? recipe.level === levelFilter : true;
      return matchesName && matchesLevel;
    });
  }, [search, levelFilter]);

  const handleCardClick = (id) => {
    navigate(`/session/${id}`);
  };

  return (
    <section className="space-y-4">
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Choose a Recipe
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Search by recipe name..."
              className="w-32 md:w-56 px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="text-xs md:text-sm px-2 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filteredRecipes.length === 0 && (
              <p className="text-xs md:text-sm text-gray-500 col-span-full">
                No recipes found. Try another search or level.
              </p>
            )}

            {filteredRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="bg-white bg-opacity-90 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex flex-col"
                onClick={() => handleCardClick(recipe.id)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-32 object-cover rounded-t-2xl"
                />
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                    {recipe.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Level: <span className="font-medium">{recipe.level}</span> ·
                    Time: {recipe.time}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] bg-pink-50 text-pink-600 rounded-full border border-pink-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
