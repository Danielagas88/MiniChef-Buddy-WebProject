import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  fetchRecipes,
  CATEGORY_FILTERS,
} from "../../services/recipeService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import RecipesFilters from "./RecipesFilters.jsx";
import RecipeCard from "./RecipeCard.jsx";

/** Allergen aliases (exact ingredient-name matching; no substring matching) */
const ALLERGEN_ALIASES = {
  milk: [
    "milk",
    "cream",
    "sour cream",
    "butter",
    "cheese",
    "greek yogurt",
    "yogurt",
    "yoghurt",
    "whey",
    "cream cheese",
    "condensed milk",
    "evaporated milk",
  ],
  eggs: ["egg", "eggs", "egg yolk", "egg white"],
  nuts: [
    "nut",
    "nuts",
    "peanut",
    "peanuts",
    "almond",
    "almonds",
    "walnut",
    "walnuts",
    "cashew",
    "cashews",
    "hazelnut",
    "hazelnuts",
    "pistachio",
    "pistachios",
  ],
  soy: ["soy", "soya", "soy sauce", "tofu", "edamame", "miso"],
  wheat: [
    "wheat",
    "flour",
    "bread",
    "pasta",
    "noodles",
    "breadcrumbs",
    "semolina",
    "gluten",
  ],
  fish: [
    "fish",
    "salmon",
    "tuna",
    "cod",
    "anchovy",
    "anchovies",
    "sardine",
    "sardines",
  ],
  sesame: ["sesame", "sesame seeds", "tahini"],
};

/**
 * Checks if a recipe contains any allergens defined for the user.
 * @param {string[]} ingredientNames - List of ingredients in the recipe
 * @param {string[]} userAllergens - List of allergens the user is allergic to
 */
function containsAllergen(ingredientNames = [], userAllergens = []) {
  if (!userAllergens?.length) return false;
  const ingredients = ingredientNames.map((i) =>
    String(i).toLowerCase().trim(),
  );
  const blocked = new Set();
  for (const a of userAllergens) {
    const key = String(a).toLowerCase().trim();
    blocked.add(key);
    (ALLERGEN_ALIASES[key] || []).forEach((alias) => blocked.add(alias));
  }
  return ingredients.some((ing) => blocked.has(ing));
}

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_FILTERS.ALL);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const levelRank = { Easy: 1, Medium: 2, Advanced: 3 };
  const userLevel = user?.cookingLevel || "Easy";
  const userAllergens = user?.allergens || [];

  function allowedByUserLevel(recipeLevel, uLevel) {
    if (!uLevel) return true;
    return levelRank[recipeLevel] <= levelRank[uLevel];
  }

  const levelOptions = ["Easy", "Medium", "Advanced"].filter(
    (lvl) => levelRank[lvl] <= levelRank[userLevel],
  );

  useEffect(() => {
    if (levelFilter && !levelOptions.includes(levelFilter)) {
      setLevelFilter("");
    }
  }, [levelFilter, levelOptions]);

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

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);
      const matchesLevelFilter = levelFilter ? r.level === levelFilter : true;
      const matchesUserLevel = allowedByUserLevel(r.level, userLevel);
      const safeForUser = !containsAllergen(r.ingredientNames, userAllergens);
      return (
        matchesName && matchesLevelFilter && matchesUserLevel && safeForUser
      );
    });
  }, [search, levelFilter, recipes, userLevel, userAllergens]);

  return (
    <section className="space-y-4">
      {/* Container with the new Emerald theme but keeping your original padding/shadow structure */}
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-sm p-4 md:p-6 space-y-3 border border-white/40 dark:border-white/20 transition-all">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">
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

        {/* The Actual Grid */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-center text-slate-500">Loading recipes...</p>
          )}
          {loadError && <p className="text-center text-red-500">{loadError}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {!isLoading && filteredRecipes.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full text-center py-10">
                No recipes found for this selection.
              </p>
            )}

            {filteredRecipes.map((recipe) => (
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
                    className={`w-9 h-9 rounded-full shadow flex items-center justify-center transition-all ${
                      isFavorite(recipe.id)
                        ? "bg-white border border-red-100"
                        : "bg-white/90"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isFavorite(recipe.id)
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isFavorite(recipe.id) ? "❤️" : "♡"}
                    </span>
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
