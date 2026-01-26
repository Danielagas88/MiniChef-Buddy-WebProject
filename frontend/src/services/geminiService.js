/**
 * Gemini Service (ChefBot)
 * 
 * Handles communication with the AI chatbot (ChefBot) via Google Gemini API.
 * The backend processes the request and returns AI-generated responses.
 * 
 * @module services/geminiService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Send a chat message to ChefBot via backend Gemini API
 * 
 * Sends user's question along with recipe context to the AI chatbot.
 * The backend uses Google Gemini API to generate helpful cooking responses.
 * 
 * @param {string} recipeTitle - The title of the current recipe
 * @param {string} currentStep - The current cooking step text
 * @param {string} userQuery - The user's question or message
 * @param {string} token - User's authentication token
 * @returns {Promise<string>} The AI-generated response text
 * @throws {Error} If the API request fails
 * 
 * @example
 * const response = await sendChefBotMessage(
 *   "Pasta Carbonara",
 *   "Boil water in a large pot",
 *   "How long should I boil it?",
 *   userToken
 * );
 */
export async function sendChefBotMessage(recipeTitle, currentStep, userQuery, token) {
  try {
    const data = await apiClient.post(
      API_ENDPOINTS.GEMINI.CHAT,
      {
        recipeTitle,
        currentStep,
        userQuery,
      },
      { token }
    );
    return data.response;
  } catch (error) {
    console.error("Gemini service error:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get response from ChefBot");
  }
}
