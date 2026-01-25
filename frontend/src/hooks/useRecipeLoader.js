import { useState, useEffect, useRef } from "react";
import { fetchRecipeById } from "../services/recipeService.js";

/**
 * Custom hook for loading recipe data
 */
export function useRecipeLoader(recipeId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const startedAtRef = useRef(null);

  useEffect(() => {
    async function loadRecipe() {
      if (!recipeId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchRecipeById(recipeId);
        if (data) {
          setRecipe(data);
          startedAtRef.current = Date.now();
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [recipeId]);

  return {
    recipe,
    loading,
    error,
    startedAt: startedAtRef.current,
  };
}
