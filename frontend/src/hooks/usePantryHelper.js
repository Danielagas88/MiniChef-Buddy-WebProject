/**
 * usePantryHelper (functionality)
 *
 * Owns pantry state, recipe loading, matching, add/remove/scan logic.
 * Keeps PantryHelper presentational (layout and composition only).
 *
 * @returns {Object} Pantry state and handlers for the pantry UI
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../services/recipeService.js";
import { useAuth } from "./useAuth.js";
import { usePantryMatching } from "./usePantryMatching.js";

export function usePantryHelper() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pantryInput, setPantryInput] = useState("");
  const [pantryItems, setPantryItems] = useState([]);
  const [matchMode, setMatchMode] = useState("any");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRecipes("");
        if (alive) setRecipes(data);
      } catch {
        if (alive) setError("Failed to load recipes");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const { matchedRecipes, normalizeIngredientLine } = usePantryMatching(
    recipes,
    pantryItems,
    matchMode,
    user?.cookingLevel,
    user?.allergens
  );

  const addItem = useCallback(
    (raw) => {
      const item = normalizeIngredientLine(raw);
      if (!item) return;
      setPantryItems((prev) => Array.from(new Set([...prev, item])));
    },
    [normalizeIngredientLine]
  );

  const addFromInput = useCallback(() => {
    addItem(pantryInput);
    setPantryInput("");
  }, [pantryInput, addItem]);

  const scanFromInputCommaSeparated = useCallback(() => {
    const parts = pantryInput
      .split(",")
      .map(normalizeIngredientLine)
      .filter(Boolean);
    if (parts.length === 0) return;
    setPantryItems((prev) => Array.from(new Set([...prev, ...parts])));
    setPantryInput("");
  }, [pantryInput, normalizeIngredientLine]);

  const removeItem = useCallback((item) => {
    setPantryItems((prev) => prev.filter((x) => x !== item));
  }, []);

  const clearItems = useCallback(() => setPantryItems([]), []);

  return {
    pantryInput,
    setPantryInput,
    pantryItems,
    matchMode,
    setMatchMode,
    loading,
    error,
    matchedRecipes,
    addFromInput,
    scanFromInputCommaSeparated,
    removeItem,
    clearItems,
    navigate,
  };
}
