/**
 * Favorites routes
 *
 * Mounted at /api/favorites. GET / (auth), POST /toggle (auth).
 */
import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { validate, validationSchemas } from "../../middleware/validation";
import {
  getFavoritesController,
  toggleFavoriteController,
} from "./favorites.controller";

const router = Router();

router.get("/", auth, getFavoritesController);
router.post("/toggle", auth, validate(validationSchemas.toggleFavorite), toggleFavoriteController);

export default router;
