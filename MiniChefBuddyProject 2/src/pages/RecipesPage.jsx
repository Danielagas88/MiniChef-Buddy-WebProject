import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
// Axios is gone! We use only fetch via our service.
import { fetchRecipes } from "../services/recipeService";
import { useAuth } from "../hooks/useAuth.js";
import { useFavorites } from "../hooks/useFavorites.js";
import RecipesFilters from "../components/recipes/RecipesFilters.jsx";
import RecipeCard from "../components/recipes/RecipeCard.jsx";

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Fetching real data (Defaults to 'Dessert' for kids, or change to '' for all)
        const data = await fetchRecipes("");

        if (isMounted) {
          setRecipes(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setLoadError("Failed to load recipes. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Logic
  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);
      // Now using the SMART calculated level (Easy/Medium/Hard)
      const matchesLevel = levelFilter ? r.level === levelFilter : true;

      return matchesName && matchesLevel;
    });
  }, [search, levelFilter, recipes]);

  return (
    <section className="space-y-4">
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Choose a Yummy Recipe
          </h3>

          <RecipesFilters
            search={search}
            onSearch={setSearch}
            level={levelFilter}
            onLevel={setLevelFilter}
          />
        </div>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6">
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}

          {loadError && <p className="text-center text-red-500">{loadError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {!isLoading && filteredRecipes.length === 0 && (
              <p className="text-xs md:text-sm text-gray-500 col-span-full">
                No recipes found.
              </p>
            )}

            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpen={() => navigate(`/session/${recipe.id}`)}
                action={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) return navigate("/login");
                      toggleFavorite(recipe.id);
                    }}
                    className={`w-9 h-9 rounded-full shadow flex items-center justify-center
                      ${isFavorite(recipe.id) ? "bg-pink-100" : "bg-white/90"}
                    `}
                  >
                    <span
                      className={`text-lg ${
                        isFavorite(recipe.id)
                          ? "text-pink-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isFavorite(recipe.id) ? "♥" : "♡"}
                    </span>
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
