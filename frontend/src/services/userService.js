/**
 * User Service
 * 
 * Handles user profile and account operations.
 * 
 * @module services/userService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Update user's cooking level
 * 
 * Updates the user's cooking skill level (Beginner, Medium, Advanced).
 * 
 * @param {Object} params - Update parameters
 * @param {string} params.token - User authentication token
 * @param {string} params.cookingLevel - New cooking level (e.g., "Beginner", "Medium", "Advanced")
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} If token is missing or request fails
 * 
 * @example
 * await updateMyCookingLevel({ token: userToken, cookingLevel: "Advanced" });
 */
export async function updateMyCookingLevel({ token, cookingLevel }) {
  if (!token) throw new Error("Missing token");

  return apiClient.patch(
    API_ENDPOINTS.AUTH.COOKING_LEVEL,
    { cookingLevel },
    { token }
  );
}
