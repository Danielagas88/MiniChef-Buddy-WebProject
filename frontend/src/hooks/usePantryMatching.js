/**
 * usePantryMatching
 *
 * Matches user pantry ingredients to recipes. Filters by level and allergens,
 * ranks recipes by match count.
 *
 * @param {Object[]} pantryItems - User's pantry items
 * @param {Object[]} recipes - Recipe list
 * @param {string} [userLevel] - User cooking level
 * @param {string[]} [userAllergens] - User allergens
 * @returns {Object} matchedRecipes, loading-like state if needed
 *
 * @example
 * const { matchedRecipes } = usePantryMatching(pantryItems, recipes, userLevel, userAllergens);
 */
import { useMemo } from "react";
import { containsAllergen } from "../utils/allergenUtils.js";

const levelRank = { Easy: 1, Medium: 2, Advanced: 3 };

/**
 * Normalizes ingredient line by removing measurements and extra spaces
 */
function normalizeIngredientLine(line) {
  return line
    .toLowerCase()
    .replace(/[\d/.]+/g, " ")
    .replace(
      /\b(cup|cups|tbsp|tsp|teaspoon|tablespoon|grams|g|kg|ml|l|oz|lb)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if recipe is allowed by user's cooking level
 */
function allowedByUserLevel(recipeLevel, userLevel) {
  if (!userLevel) return true;
  return levelRank[recipeLevel] <= levelRank[userLevel];
}

/**
 * Custom hook for matching pantry items to recipes
 * Also filters by user's allergens and cooking level (same logic as RecipesPage)
 */
export function usePantryMatching(recipes, pantryItems, matchMode, userLevel, userAllergens) {
  const matchedRecipes = useMemo(() => {
    if (pantryItems.length === 0) return [];

    return recipes
      .filter((r) => {
        // Filter by user's cooking level (same as RecipesPage)
        const matchesUserLevel = allowedByUserLevel(r.level, userLevel || "Easy");
        // Filter by user's allergens (same as RecipesPage)
        const safeForUser = !containsAllergen(r.ingredientNames, userAllergens || []);
        return matchesUserLevel && safeForUser;
      })
      .map((r) => {
        const ing = (r.ingredients || []).map(normalizeIngredientLine);

        const hits = pantryItems.filter((p) =>
          ing.some((i) => i.includes(p) || p.includes(i)),
        );

        const ok =
          matchMode === "all"
            ? hits.length === pantryItems.length
            : hits.length > 0;

        return ok ? { recipe: r, hitsCount: hits.length, hits } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.hitsCount - a.hitsCount);
  }, [recipes, pantryItems, matchMode, userLevel, userAllergens]);

  return { matchedRecipes, normalizeIngredientLine };
}
