import { Request, Response } from "express";
import { generateChefBotResponse } from "./gemini.service";

export async function chatController(req: Request, res: Response) {
  try {
    const { recipeTitle, currentStep, userQuery } = req.body;

    if (!recipeTitle || !currentStep || !userQuery) {
      return res.status(400).json({
        message: "recipeTitle, currentStep, and userQuery are required",
      });
    }

    const response = await generateChefBotResponse(
      recipeTitle,
      currentStep,
      userQuery
    );

    return res.json({ response });
  } catch (error) {
    console.error("Gemini controller error:", error);
    return res.status(500).json({
      message: "Failed to generate AI response",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
