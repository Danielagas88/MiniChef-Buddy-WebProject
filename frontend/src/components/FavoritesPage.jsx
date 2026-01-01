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

  return (
    <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-emerald-50 p-6 space-y-6">
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-800">
          My <span className="text-emerald-600">Favorites</span>
        </h2>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {favoriteRecipes.length} Recipes
        </span>
      </div>

      {/* Status Messages */}
      {loading && (
        <p className="text-center py-10 text-slate-500 animate-pulse">
          Gathering your favorites...
        </p>
      )}
      {error && (
        <p className="text-center py-10 text-red-500 font-bold">{error}</p>
      )}

      {/* Empty State */}
      {!loading && favoriteRecipes.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl grayscale opacity-30">🍳</div>
          <p className="text-slate-500 font-medium text-lg">
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
        /* Recipes Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform border border-red-50"
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
