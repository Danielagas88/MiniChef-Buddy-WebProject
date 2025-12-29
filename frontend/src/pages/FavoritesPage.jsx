import { useEffect, useMemo, useState } from "react";
import { fetchRecipes } from "../services/recipeService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFavorites } from "../hooks/useFavorites.js";
import RecipeCard from "../components/recipes/RecipeCard.jsx";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  let alive = true;

  async function load() {
    try {
      setLoading(true);
      setError(null);

      // אותו מקור כמו בדף Recipes
      const data = await fetchRecipes("");
      if (alive) setAllRecipes(data);
    } catch (e) {
      console.error(e);
      if (alive) setError("Failed to load recipes.");
    } finally {
      if (alive) setLoading(false);
    }
  }

  load();
  return () => {
    alive = false;
  };
}, []);

  

  const favoriteRecipes = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return allRecipes.filter((r) => set.has(String(r.id)));
  }, [favoriteIds, allRecipes]);


  if (!user) {
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


      {favoriteRecipes.length === 0 ? (
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
