/**
 * Recipe History Service
 * 
 * Handles recipe completion tracking and history retrieval.
 * Tracks which recipes users have completed and when.
 * 
 * @module services/recipeHistoryService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Save a completed recipe to user's history
 * 
 * Records that a user has completed a recipe, including timing information.
 * 
 * @param {Object} params - Completion data
 * @param {Object} params.recipe - Recipe object with id, title, level
 * @param {string} params.token - User authentication token
 * @param {string} params.sessionId - Unique session identifier
 * @param {number} [params.minutes=0] - Time taken to complete (in minutes)
 * @returns {Promise<Object>} Saved history entry
 * @throws {Error} If request fails
 * 
 * @example
 * await saveRecipeCompletion({
 *   recipe: { id: "123", title: "Pasta", level: "Medium" },
 *   token: userToken,
 *   sessionId: "uuid-123",
 *   minutes: 25
 * });
 */
export async function saveRecipeCompletion({
  recipe,
  token,
  sessionId,
  minutes = 0,
}) {
  return apiClient.post(
    API_ENDPOINTS.RECIPE_HISTORY.COMPLETE,
    {
      recipeId: recipe.id,
      title: recipe.title,
      level: recipe.level,
      minutes,
      sessionId,
    },
    { token }
  );
}

/**
 * Get user's recipe history
 * 
 * Retrieves a list of recipes the user has completed, ordered by completion date.
 * 
 * @param {Object} [params={}] - Query parameters
 * @param {string} params.token - User authentication token
 * @param {number} [params.limit=200] - Maximum number of items to return
 * @returns {Promise<Array>} Array of completed recipe history items
 * @throws {Error} If token is missing or request fails
 * 
 * @example
 * const history = await getMyRecipeHistory({ token: userToken, limit: 50 });
 */
export async function getMyRecipeHistory({ token, limit = 200 } = {}) {
  if (!token) throw new Error("Missing token");

  const data = await apiClient.get(API_ENDPOINTS.RECIPE_HISTORY.ME(limit), { token });
  
  // backend returns: { items: [...] }
  return data.items ?? [];
}
