/**
 * RecipesList
 *
 * Renders filtered recipes as RecipeCards. Handles loading/error,
 * favorites, and navigation to session.
 *
 * @param {Object} props
 * @param {Object[]} props.recipes - Recipe list
 * @param {boolean} props.isLoading - Loading state
 * @param {string} [props.loadError] - Error message
 *
 * @component
 */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import RecipeCard from "./RecipeCard.jsx";

export default function RecipesList({ recipes, isLoading, loadError }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <p className="text-center text-(--text-secondary)">Loading recipes...</p>
    );
  }

  if (loadError) {
    return <p className="text-center text-red-500">{loadError}</p>;
  }

  if (recipes.length === 0) {
    return (
      <p className="text-sm text-(--text-secondary) col-span-full text-center py-10">
        No recipes found for this selection.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {recipes.map((recipe) => (
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
              className={`w-9 h-9 rounded-full shadow flex items-center justify-center transition-all bg-(--card-bg) border border-(--border-color)`}
              aria-label={isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <span
                className={`text-lg ${
                  isFavorite(recipe.id)
                    ? "text-red-500"
                    : "text-(--muted)"
                }`}
              >
                {isFavorite(recipe.id) ? "❤️" : "♡"}
              </span>
            </button>
          }
        />
      ))}
    </div>
  );
}
