/**
 * RecipesPage
 *
 * Browse and filter recipes. Uses recipeService and useRecipeFilters.
 * Supports search, category, level, and allergen filtering.
 *
 * @component
 */
import { useEffect, useState } from "react";
import { fetchRecipes } from "../../services/recipeService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useRecipeFilters } from "../../hooks/useRecipeFilters.js";
import RecipesFilters from "./RecipesFilters.jsx";
import RecipesList from "./RecipesList.jsx";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const { user } = useAuth();
  const {
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    activeCategory,
    setActiveCategory,
    levelOptions,
    filteredRecipes,
  } = useRecipeFilters(recipes, user?.cookingLevel, user?.allergens);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchRecipes("", activeCategory);
        if (isMounted) setRecipes(data);
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setLoadError("Failed to load recipes. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <section className="space-y-4">
      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-4 md:p-6 space-y-3 border border-(--card-surface-border) transition-all">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg md:text-xl font-bold text-(--text-primary)">
              Choose a Yummy Recipe
            </h3>

            <RecipesFilters
              search={search}
              onSearch={setSearch}
              level={levelFilter}
              onLevel={setLevelFilter}
              levelOptions={levelOptions}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>

        <div className="mt-6">
          <RecipesList
            recipes={filteredRecipes}
            isLoading={isLoading}
            loadError={loadError}
          />
        </div>
      </div>
    </section>
  );
}
