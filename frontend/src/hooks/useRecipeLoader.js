/**
 * useRecipeLoader Hook
 * 
 * Loads recipe data from external API and manages loading/error states.
 * Tracks when the recipe session started for timing calculations.
 * 
 * @param {string} recipeId - Recipe ID to load
 * @returns {Object} Recipe loader state
 * @returns {Object|null} returns.recipe - Loaded recipe data
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if loading failed
 * @returns {number|null} returns.startedAt - Timestamp when recipe was loaded
 * 
 * @example
 * const { recipe, loading, error, startedAt } = useRecipeLoader(recipeId);
 */
import { useState, useEffect, useRef } from "react";
import { fetchRecipeById } from "../services/recipeService.js";

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
