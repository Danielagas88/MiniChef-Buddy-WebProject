import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { fetchRecipeById } from "../services/recipeService.js";
import RecipeCard from "../components/recipes/RecipeCard.jsx";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadFavoritesRecipes() {
      if (!user?.token) return;

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const ids = favoriteIds.map(String);

        const results = await Promise.all(ids.map((id) => fetchRecipeById(id)));

        const clean = results.filter(Boolean);

        const byId = new Map(clean.map((r) => [String(r.id), r]));
        const ordered = ids.map((id) => byId.get(id)).filter(Boolean);

        if (alive) setFavoriteRecipes(ordered);
      } catch (e) {
        console.error(e);
        if (alive) setError("Failed to load favorite recipes.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadFavoritesRecipes();
    return () => {
      alive = false;
    };
  }, [user?.token, favoriteIds]);

  if (!user?.token) {
    return (
      <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">My Favorites</h2>
        <p className="text-sm text-gray-700">
          Please login to save and view your favorite recipes.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-sm bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600"
        >
          Go to Login
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
      <h2 className="text-xl font-bold text-gray-800">My Favorites</h2>

      {loading && <p className="text-sm text-gray-600">Loading favorites...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {favoriteRecipes.length === 0 && !loading ? (
        <p className="text-sm text-gray-700">
          No favorites yet. Go to Recipes and tap ♡ on a recipe card.
        </p>
      ) : (
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpen={() => navigate(`/session/${recipe.id}`)}
                action={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className="w-9 h-9 rounded-full bg-pink-100 shadow flex items-center justify-center"
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                  >
                    <span className="text-lg text-pink-600">♥</span>
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
