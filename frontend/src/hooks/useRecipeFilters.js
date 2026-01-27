/**
 * useRecipeFilters
 *
 * Search, category, level, and allergen filtering for recipes.
 * Used on RecipesPage.
 *
 * @param {Object[]} recipes - Full recipe list
 * @param {string} [userLevel] - User cooking level (limits level options)
 * @param {string[]} [userAllergens] - User allergens (filters out recipes)
 * @returns {Object} search, setSearch, levelFilter, setLevelFilter, activeCategory,
 *   setActiveCategory, levelOptions, filteredRecipes
 *
 * @example
 * const { search, levelFilter, activeCategory, filteredRecipes } = useRecipeFilters(recipes, user?.cookingLevel, user?.allergens);
 */
import { useState, useMemo } from "react";
import { CATEGORY_FILTERS } from "../services/recipeService.js";
import { containsAllergen } from "../utils/allergenUtils.js";

const levelRank = { Easy: 1, Medium: 2, Advanced: 3 };

export function useRecipeFilters(recipes, userLevel, userAllergens) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_FILTERS.ALL);

  const levelOptions = ["Easy", "Medium", "Advanced"].filter(
    (lvl) => levelRank[lvl] <= levelRank[userLevel || "Easy"],
  );

  // Derive effective level during render when current value isn't in options (avoids setState-in-effect)
  const effectiveLevelFilter =
    levelFilter && levelOptions.includes(levelFilter) ? levelFilter : "";

  function allowedByUserLevel(recipeLevel, uLevel) {
    if (!uLevel) return true;
    return levelRank[recipeLevel] <= levelRank[uLevel];
  }

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);
      const matchesLevelFilter = effectiveLevelFilter
        ? r.level === effectiveLevelFilter
        : true;
      const matchesUserLevel = allowedByUserLevel(r.level, userLevel || "Easy");
      const safeForUser = !containsAllergen(r.ingredientNames, userAllergens || []);
      return (
        matchesName && matchesLevelFilter && matchesUserLevel && safeForUser
      );
    });
  }, [search, effectiveLevelFilter, recipes, userLevel, userAllergens]);

  return {
    search,
    setSearch,
    levelFilter: effectiveLevelFilter,
    setLevelFilter,
    activeCategory,
    setActiveCategory,
    levelOptions,
    filteredRecipes,
  };
}
