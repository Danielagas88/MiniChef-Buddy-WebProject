import { Router } from "express";
import { auth as authMiddleware } from "../../middleware/middleware";

import User from "../auth/UserModel";

const router = Router();

// GET /api/favorites
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user._id;

    const user = await User.findById(userId).select("favoriteRecipeIds");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      favoriteRecipeIds: user.favoriteRecipeIds || [],
    });
  } catch (err) {
    console.error("GET favorites error:", err);
    return res.status(500).json({ message: "Failed to load favorites" });
  }
});


// POST /api/favorites/toggle
router.post("/toggle", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const { recipeId } = req.body as { recipeId?: string };

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    const user = await User.findById(userId).select("favoriteRecipeIds");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ids = user.favoriteRecipeIds || [];
    const idx = ids.indexOf(String(recipeId));

    if (idx >= 0) {
      ids.splice(idx, 1); // remove
    } else {
      ids.push(String(recipeId)); // add
    }

    user.favoriteRecipeIds = ids;
    await user.save();

    return res.json({ favoriteRecipeIds: user.favoriteRecipeIds || [] });
  } catch (err) {
    console.error("TOGGLE favorites error:", err);
    return res.status(500).json({ message: "Failed to toggle favorite" });
  }
});



export default router;
