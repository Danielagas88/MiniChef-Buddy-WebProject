import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { RecipeHistory } from "./recipeHistory.model";

const router = Router();

/**
 * POST /api/recipe-history/complete
 * Saves a "recipe completed" event for the logged-in user.
 */
router.post("/complete", auth, async (req: any, res) => {
  try {
    const userId = req.user?._id;

    const {
      recipeId,
      title,
      level,
      minutes = 0,
      sessionId,
    } = req.body as {
      recipeId?: string;
      title?: string;
      level?: string;
      minutes?: number;
      sessionId?: string;
    };

    if (!recipeId || !title || !sessionId) {
      return res
        .status(400)
        .json({ message: "recipeId, title and sessionId are required" });
    }

    const doc = await RecipeHistory.create({
      userId,
      recipeId: String(recipeId),
      title: String(title),
      level: String(level || ""),
      minutes: Number(minutes || 0),
      sessionId: String(sessionId),
      completedAt: new Date(),
    });

    return res.status(201).json({ ok: true, item: doc });
  } catch (err: any) {
    // duplicate click (unique index)
    if (err?.code === 11000) {
      return res.json({ ok: true, duplicate: true });
    }
    console.error("recipe-history complete error:", err);
    return res
      .status(500)
      .json({ message: "Failed to save recipe completion" });
  }
});

/**
 * GET /api/recipe-history/me
 * Returns user's history (latest first).
 */
router.get("/me", auth, async (req: any, res) => {
  try {
    const userId = req.user?._id;
    const items = await RecipeHistory.find({ userId })
      .sort({ completedAt: -1 })
      .limit(200);

    return res.json({ items });
  } catch (err) {
    console.error("recipe-history me error:", err);
    return res.status(500).json({ message: "Failed to load history" });
  }
});

export default router;
