import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Axios } from "../Axios";
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

  async function fetchRecipes() {
    try {
      setIsLoading(true);
      setLoadError(null);

      const res = await Axios.get("/recipes");
      const list = res.data?.recipes ?? [];

      if (isMounted) {
        setRecipes(list);
      }
    } catch (err) {
      if (isMounted) {
        setLoadError(
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load recipes"
        );
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  fetchRecipes();

  return () => {
    isMounted = false;
  };
 }, []);

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);
      const matchesLevel = levelFilter ? r.level === levelFilter : true;
      return matchesName && matchesLevel;
    });
  }, [search, levelFilter]);

  return (
    <section className="space-y-4">
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Choose a Recipe
          </h3>

          <RecipesFilters
            search={search}
            onSearch={setSearch}
            level={levelFilter}
            onLevel={setLevelFilter}
          />
        </div>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filteredRecipes.length === 0 && (
              <p className="text-xs md:text-sm text-gray-500 col-span-full">
                No recipes found. Try another search or level.
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
                    aria-label={
                      isFavorite(recipe.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    title={
                      isFavorite(recipe.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
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
