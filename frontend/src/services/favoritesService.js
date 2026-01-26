/**
 * Favorites Service
 * 
 * Handles all favorite recipe operations with the backend API.
 * Uses centralized apiClient for consistent error handling.
 * 
 * @module services/favoritesService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Get user's favorite recipes from the server
 * @param {string} token - User authentication token
 * @returns {Promise<Object>} Response containing favoriteRecipeIds array
 * @throws {Error} If request fails
 */
export function getFavorites(token) {
  return apiClient.get(API_ENDPOINTS.FAVORITES.BASE, { token });
}

/**
 * Toggle favorite status of a recipe on the server
 * @param {string} recipeId - Recipe ID to toggle
 * @param {string} token - User authentication token
 * @returns {Promise<Object>} Updated favorites data
 * @throws {Error} If request fails
 */
export function toggleFavoriteOnServer(recipeId, token) {
  return apiClient.post(
    API_ENDPOINTS.FAVORITES.TOGGLE,
    { recipeId },
    { token }
  );
}
