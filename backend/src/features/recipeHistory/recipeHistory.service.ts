import { RecipeHistory } from "./recipeHistory.model";

export async function createCompletion(input: {
  userId: string;
  recipeId: string;
  title: string;
  level: string;
  minutes: number;
  sessionId: string;
}) {
  return RecipeHistory.create({
    userId: input.userId,
    recipeId: input.recipeId,
    title: input.title,
    level: input.level,
    minutes: input.minutes,
    sessionId: input.sessionId,
    completedAt: new Date(),
  });
}

export async function listHistory(input: { userId: string; limit?: number }) {
  const limit = Math.min(Math.max(Number(input.limit ?? 200), 1), 200);

  return RecipeHistory.find({ userId: input.userId })
    .sort({ completedAt: -1 })
    .limit(limit);
}
