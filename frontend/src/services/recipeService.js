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

export const fetchRecipes = async (query = "") => {
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

    // --- CLEANED UP: No more 'count' variable here ---
    return allMeals.map((meal) => {
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
