/**
 * Allergen detection utilities
 */

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
 * Checks if recipe contains any of the user's allergens
 * @param {string[]} ingredientNames - Recipe ingredient names
 * @param {string[]} userAllergens - User's allergen list
 * @returns {boolean} True if recipe contains allergens
 */
export function containsAllergen(ingredientNames = [], userAllergens = []) {
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
