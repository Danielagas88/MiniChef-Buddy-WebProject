import { useAuth } from "../../hooks/useAuth.js";
import PantryRecipeCard from "./PantryRecipeCard.jsx";

export default function PantryResults({ pantryItems, results, onStart }) {
  const { user } = useAuth();

  if (!pantryItems || pantryItems.length === 0) return null;

  const difficultyMap = { easy: 1, medium: 2, advanced: 3 };
  const userLevel = (user?.cookingLevel || "Easy").toLowerCase().trim();
  const userScore = difficultyMap[userLevel] || 1;

  const filteredResults = results.filter(({ recipe }) => {
    const recipeLevel = (recipe.level || "Easy").toLowerCase().trim();
    const recipeScore = difficultyMap[recipeLevel] || 1;
    return recipeScore <= userScore;
  });

  return (
    <div className="pt-6 border-t border-(--border-color)">
      <h5 className="text-xl font-bold text-(--text-primary) mb-4 flex items-center gap-2">
        <span className="text-emerald-500">✨</span> Suggested Recipes
      </h5>

      {filteredResults.length === 0 ? (
        <div className="bg-emerald-500/10 p-6 rounded-2xl text-center border-2 border-dashed border-emerald-500/20">
          <p className="text-(--text-secondary) font-medium italic">
            {results.length > 0
              ? "We found recipes, but they are a bit too advanced for your current level. Try other ingredients!"
              : "No recipes found. Try adding more ingredients to your pantry!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {filteredResults.map(({ recipe, hits, hitsCount }) => (
            <PantryRecipeCard
              key={recipe.id}
              recipe={recipe}
              hits={hits}
              hitsCount={hitsCount}
              onStart={() => onStart(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
