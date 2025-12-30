import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchRecipes } from "../../services/recipeService.js";
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

function containsAllergen(ingredientNames = [], userAllergens = []) {
  if (!userAllergens?.length) return false;

  const ingredients = ingredientNames.map((i) =>
    String(i).toLowerCase().trim()
  );

  const blocked = new Set();
  for (const a of userAllergens) {
    const key = String(a).toLowerCase().trim();
    blocked.add(key);
    (ALLERGEN_ALIASES[key] || []).forEach((alias) => blocked.add(alias));
  }

  // exact match only (prevents false positives like "cream of tartar")
  return ingredients.some((ing) => blocked.has(ing));
}

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
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
    (lvl) => levelRank[lvl] <= levelRank[userLevel]
  );

  // If user level decreases, reset manual filter if it became invalid
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

        const data = await fetchRecipes("");
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
  }, []);

  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return recipes.filter((r) => {
      const matchesName = r.title.toLowerCase().includes(q);

      // Manual UI filter (optional)
      const matchesLevelFilter = levelFilter ? r.level === levelFilter : true;

      // Auto restriction by user's level (default)
      const matchesUserLevel = allowedByUserLevel(r.level, userLevel);

      // Allergen restriction (uses ingredientNames from recipeService)
      const safeForUser = !containsAllergen(r.ingredientNames, userAllergens);

      return (
        matchesName && matchesLevelFilter && matchesUserLevel && safeForUser
      );
    });
  }, [search, levelFilter, recipes, userLevel, userAllergens]);

  return (
    <section className="space-y-4">
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Choose a Yummy Recipe
          </h3>

          <RecipesFilters
            search={search}
            onSearch={setSearch}
            level={levelFilter}
            onLevel={setLevelFilter}
            levelOptions={levelOptions}
          />
        </div>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6">
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}

          {loadError && <p className="text-center text-red-500">{loadError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {!isLoading && filteredRecipes.length === 0 && (
              <p className="text-xs md:text-sm text-gray-500 col-span-full">
                No recipes found.
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
                    className={`w-9 h-9 rounded-full shadow flex items-center justify-center
                      ${isFavorite(recipe.id) ? "bg-pink-100" : "bg-white/90"}
                    `}
                  >
                    <span
                      className={`text-lg ${
                        isFavorite(recipe.id)
                          ? "text-pink-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isFavorite(recipe.id) ? "♥" : "♡"}
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
