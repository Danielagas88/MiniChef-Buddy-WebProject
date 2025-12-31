// src/services/recipeService.js

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const KID_FRIENDLY_KEYWORDS = [
  "Pizza",
  "Pasta",
  "Salad",
  "Dessert",
  "Pie",
  "Pancake",
  "Burger",
  "Chicken",
];

export const CATEGORY_FILTERS = {
  ALL: "All",
  BREAKFAST: "Breakfast",
  MEAT: "Meat", // Include all kinds
  DESSERT: "Dessert",
  SALAD: "Salad",
  PASTA: "Pasta",
  VEGETARIAN: "Vegetarian",
};

const NON_VEGETARIAN_INGREDIENTS = [
  "beef",
  "chicken",
  "pork",
  "bacon",
  "ham",
  "steak",
  "lamb",
  "sausage",
  "duck",
  "turkey",
  "fish",
  "salmon",
  "tuna",
  "cod",
  "shrimp",
  "prawn",
  "crab",
  "meat",
  "mince",
  "gelatin",
  "chorizo",
];

const MEAT_API_CATEGORIES = ["Beef", "Chicken", "Lamb", "Pork", "Goat"];

/**
 * Calculates difficulty level based on EQUIPMENT and SAFETY keywords.
 * - Advanced: Involves Oven, Grill, Baking, Roasting.
 * - Medium: Involves Stove, Boiling, Frying, Heating.
 * - Easy: Mixing, Cutting, Blending.
 */
const calculateLevel = (instructions) => {
  const text = instructions.toLowerCase();

  if (
    text.includes("oven") ||
    text.includes("bake") ||
    text.includes("grill") ||
    text.includes("roast") ||
    text.includes("broil")
  ) {
    return "Advanced";
  }

  if (
    text.includes("stove") ||
    text.includes("boil") ||
    text.includes("fry") ||
    text.includes("pan") ||
    text.includes("heat") ||
    text.includes("simmer")
  ) {
    return "Medium";
  }

  return "Easy";
};

/**
 * Improved Step Parsing
 * Splits by new lines OR numbered lists.
 */
const parseInstructions = (text) => {
  if (!text) return ["Start cooking!"];

  let cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Regex to split by numbers like "1.", "2." or new lines
  let steps = cleanText.split(/\n|\.\s+(?=[A-Z])|\d+\.\s/);

  steps = steps
    .map((s) => s.trim())
    .filter((s) => s.length > 10)
    .filter((s) => !s.match(/^STEP \d+$/i))
    .filter((s) => !s.toLowerCase().includes("enjoy"));

  return steps.length > 0 ? steps : [text];
};

function extractIngredients(meal) {
  const display = [];
  const names = [];

  for (let i = 1; i <= 20; i++) {
    const nameRaw = meal[`strIngredient${i}`];
    const measureRaw = meal[`strMeasure${i}`];

    if (!nameRaw || !nameRaw.trim()) continue;

    const name = nameRaw.trim();
    const measure = (measureRaw || "").trim();

    display.push(`${measure} ${name}`.trim());

    names.push(name.toLowerCase());
  }

  return { display, names };
}

export const fetchRecipes = async (query = "", activeCategory = "All") => {
  try {
    let allMeals = [];

    if (query) {
      const response = await fetch(`${BASE_URL}${query}`);
      const data = await response.json();
      if (data.meals) allMeals = data.meals;
    } else {
      const promises = KID_FRIENDLY_KEYWORDS.map((keyword) =>
        fetch(`${BASE_URL}${keyword}`).then((res) => res.json())
      );

      const results = await Promise.all(promises);
      results.forEach((data) => {
        if (data.meals) allMeals = [...allMeals, ...data.meals];
      });

      // Remove duplicates
      allMeals = Array.from(new Set(allMeals.map((a) => a.idMeal))).map((id) =>
        allMeals.find((a) => a.idMeal === id)
      );
    }

    let mappedMeals = allMeals.map((meal) => {
      // Calculate level based on instructions text only
      const level = calculateLevel(meal.strInstructions || "");
      const ingredients = extractIngredients(meal);

      return {
        id: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory,
        image: meal.strMealThumb,
        instructions: meal.strInstructions,
        youtube: meal.strYoutube,
        area: meal.strArea,
        level: level,
        ingredients: ingredients.display,
        ingredientNames: ingredients.names,
      };
    });

    // --- FILTERING LOGIC ---
    // 3. Advanced Filtering Logic
    if (activeCategory !== CATEGORY_FILTERS.ALL) {
      mappedMeals = mappedMeals.filter((meal) => {
        const apiCat = meal.category;
        const title = meal.title.toLowerCase();

        // Vegetarian Safety Check:
        // Check if ANY ingredient is in the blacklist
        const hasMeatIngredients = meal.ingredientNames.some((ing) =>
          NON_VEGETARIAN_INGREDIENTS.some((meat) => ing.includes(meat))
        );
        // Check if TITLE contains meat words (extra safety)
        const hasMeatTitle = NON_VEGETARIAN_INGREDIENTS.some((meat) =>
          title.includes(meat)
        );
        // Result: True if absolutely no meat found
        const isSafeVegetarian = !hasMeatIngredients && !hasMeatTitle;

        const isExplicitMeatCategory = MEAT_API_CATEGORIES.includes(apiCat);
        const isMeatDish = isExplicitMeatCategory || !isSafeVegetarian;

        // Breakfast Logic Helpers:
        const isBreakfastItem =
          apiCat === "Breakfast" ||
          title.includes("pancake") ||
          title.includes("blini") ||
          title.includes("egg") ||
          title.includes("omelet");

        // --- SWITCH LOGIC ---
        switch (activeCategory) {
          case CATEGORY_FILTERS.BREAKFAST:
            return isBreakfastItem;

          case CATEGORY_FILTERS.DESSERT:
            return apiCat === "Dessert";

          case CATEGORY_FILTERS.PASTA:
            return (
              apiCat === "Pasta" ||
              title.includes("pasta") ||
              title.includes("spaghetti") ||
              title.includes("macaroni")
            );

          case CATEGORY_FILTERS.VEGETARIAN:
            return isSafeVegetarian && apiCat !== "Dessert";

          case CATEGORY_FILTERS.MEAT:
            return isMeatDish;

          case CATEGORY_FILTERS.SALAD:
            return title.includes("salad");

          default:
            return true;
        }
      });
    }

    return mappedMeals;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) return null;

    const meal = data.meals[0];
    const ingredients = extractIngredients(meal);

    const cleanSteps = parseInstructions(meal.strInstructions);
    const level = calculateLevel(meal.strInstructions || "");

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
      image: meal.strMealThumb,
      instructions: meal.strInstructions,
      steps: cleanSteps,
      youtube: meal.strYoutube,
      area: meal.strArea,
      ingredients: ingredients.display,
      ingredientNames: ingredients.names,
      level: level,
    };
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return null;
  }
};
