import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { validate, validationSchemas } from "../../middleware/validation";
import { complete, me } from "./recipeHistory.controller";

const router = Router();

router.post("/complete", auth, validate(validationSchemas.completeRecipe), complete);
router.get("/me", auth, me);

export default router;
