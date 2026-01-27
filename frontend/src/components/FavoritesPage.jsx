/**
 * FavoritesPage
 *
 * Lists the user's favorite recipes using data from the favorites context
 * and recipe service. Supports toggling favorites and navigating to a recipe
 * session.
 *
 * @component
 */
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
      if (!user?.token || !favoriteIds || favoriteIds.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const ids = favoriteIds.map(String);
        const results = await Promise.allSettled(ids.map((id) => fetchRecipeById(id)));
        const clean = results
          .filter((result) => result.status === 'fulfilled' && result.value)
          .map((result) => result.value);
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

  return (
    <section className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm border border-(--card-surface-border) p-6 space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-(--border-color) pb-4">
        <h2 className="text-2xl font-extrabold text-(--text-primary)">
          My <span className="text-(--accent-emerald)">Favorites</span>
        </h2>
        <span className="bg-emerald-500/10 text-(--accent-emerald) text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-emerald-500/20">
          {favoriteRecipes.length} Recipes
        </span>
      </div>

      {loading && (
        <p className="text-center py-10 text-(--text-secondary) animate-pulse">
          Gathering your favorites...
        </p>
      )}
      {error && (
        <p className="text-center py-10 text-red-500 font-bold">{error}</p>
      )}

      {!loading && favoriteRecipes.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl grayscale opacity-30">🍳</div>
          <p className="text-(--text-secondary) font-medium text-lg">
            Your favorites list is empty.
          </p>
          <button
            onClick={() => navigate("/recipes")}
            className="bg-emerald-500 text-white px-8 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-600 transition-all hover:scale-105"
          >
            Find Yummy Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
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
                  className="w-10 h-10 rounded-full bg-(--card-bg) shadow-md flex items-center justify-center hover:scale-110 transition-transform border border-(--border-color)"
                  aria-label="Remove from favorites"
                >
                  <span className="text-xl text-red-500">❤️</span>
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
