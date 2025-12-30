import { Router } from "express";
import { auth } from "../../middleware/middleware";
import {
  getFavoritesController,
  toggleFavoriteController,
} from "./favorites.controller";

const router = Router();

router.get("/", auth, getFavoritesController);
router.post("/toggle", auth, toggleFavoriteController);

export default router;
