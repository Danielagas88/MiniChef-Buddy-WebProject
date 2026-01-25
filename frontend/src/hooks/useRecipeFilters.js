import { useState, useEffect, useMemo } from "react";
import { CATEGORY_FILTERS } from "../services/recipeService.js";
import { containsAllergen } from "../utils/allergenUtils.js";

const levelRank = { Easy: 1, Medium: 2, Advanced: 3 };

/**
 * Custom hook for managing recipe filters and filtering logic
 */
export function useRecipeFilters(recipes, userLevel, userAllergens) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_FILTERS.ALL);

  const levelOptions = ["Easy", "Medium", "Advanced"].filter(
    (lvl) => levelRank[lvl] <= levelRank[userLevel || "Easy"],
  );

  // Reset level filter if it's not in allowed options
  useEffect(() => {
    if (levelFilter && !levelOptions.includes(levelFilter)) {
      setLevelFilter("");
    }
  }, [levelFilter, levelOptions]);

  function allowedByUserLevel(recipeLevel, uLevel) {
    if (!uLevel) return true;
    return levelRank[recipeLevel] <= levelRank[uLevel];
  }

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);
      const matchesLevelFilter = levelFilter ? r.level === levelFilter : true;
      const matchesUserLevel = allowedByUserLevel(r.level, userLevel || "Easy");
      const safeForUser = !containsAllergen(r.ingredientNames, userAllergens || []);
      return (
        matchesName && matchesLevelFilter && matchesUserLevel && safeForUser
      );
    });
  }, [search, levelFilter, recipes, userLevel, userAllergens]);

  return {
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    activeCategory,
    setActiveCategory,
    levelOptions,
    filteredRecipes,
  };
}
