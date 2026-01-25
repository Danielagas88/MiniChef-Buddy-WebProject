import { Axios } from "../Axios.js";

/**
 * Send a chat message to ChefBot via backend Gemini API
 * @param {string} recipeTitle - The title of the recipe
 * @param {string} currentStep - The current cooking step
 * @param {string} userQuery - The user's question
 * @param {string} token - User's authentication token
 * @returns {Promise<string>} The AI response text
 */
export async function sendChefBotMessage(recipeTitle, currentStep, userQuery, token) {
  try {
    const response = await Axios.post(
      "/gemini/chat",
      {
        recipeTitle,
        currentStep,
        userQuery,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.response;
  } catch (error) {
    console.error("Gemini service error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get response from ChefBot"
    );
  }
}
