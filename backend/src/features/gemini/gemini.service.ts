import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY not found in environment variables. Gemini API will not work.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function generateChefBotResponse(
  recipeTitle: string,
  currentStep: string,
  userQuery: string
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API is not configured");
  }

  const prompt = `You are ChefBot. Recipe: ${recipeTitle}. Step: ${currentStep}. User query: "${userQuery}". Reply: Short, safe, and encouraging.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response from Gemini API");
  }
}
