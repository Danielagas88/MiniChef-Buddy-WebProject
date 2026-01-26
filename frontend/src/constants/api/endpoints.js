/**
 * API Endpoints Constants
 * 
 * Centralized location for all API endpoint paths.
 * 
 * Benefits:
 * - Single source of truth for endpoints
 * - Easy to refactor if routes change
 * - Prevents typos
 * - Better IDE autocomplete
 * 
 * @module constants/api/endpoints
 * 
 * @example
 * import { API_ENDPOINTS } from "../constants/api/endpoints.js";
 * apiClient.get(API_ENDPOINTS.AUTH.ME, { token });
 */

/**
 * All API endpoint paths organized by feature domain
 * @type {Object}
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    SCORE: "/api/auth/score",
    LEADERBOARD: "/api/auth/leaderboard",
    GALLERY: "/api/auth/gallery",
    GALLERY_DELETE: (photoId) => `/api/auth/gallery/${photoId}`,
    COOKING_LEVEL: "/api/auth/me/cooking-level",
  },
  FAVORITES: {
    BASE: "/api/favorites",
    TOGGLE: "/api/favorites/toggle",
  },
  PARENT: {
    VERIFY_PIN: "/api/parent-pin/verify",
    SET_PIN: "/api/parent-pin/set",
  },
  RECIPE_HISTORY: {
    COMPLETE: "/api/recipe-history/complete",
    ME: (limit = 200) => `/api/recipe-history/me?limit=${limit}`,
  },
  GEMINI: {
    CHAT: "/api/gemini/chat",
  },
};
