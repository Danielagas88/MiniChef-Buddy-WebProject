/**
 * Favorites controller
 *
 * GET favorites and POST toggle favorite. Both require auth; delegate to favorites.service.
 */
import { Response } from "express";
import { AuthRequest } from "../../middleware/middleware";
import { validateRecipeId } from "./favorites.types";
import { getFavoriteIds, toggleFavorite } from "./favorites.service";

export async function getFavoritesController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ids = await getFavoriteIds(req.user._id.toString());
    return res.json({ favoriteRecipeIds: ids });
  } catch (err: any) {
    if (err?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ message: "Failed to load favorites" });
  }
}

export async function toggleFavoriteController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipeId = validateRecipeId(req.body?.recipeId);
    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    const ids = await toggleFavorite(req.user._id.toString(), recipeId);
    return res.json({ favoriteRecipeIds: ids });
  } catch (err: any) {
    if (err?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ message: "Failed to toggle favorite" });
  }
}
