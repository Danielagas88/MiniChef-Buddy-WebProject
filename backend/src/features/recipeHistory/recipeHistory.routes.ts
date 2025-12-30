import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { complete, me } from "./recipeHistory.controller";

const router = Router();

router.post("/complete", auth, complete);
router.get("/me", auth, me);

export default router;
