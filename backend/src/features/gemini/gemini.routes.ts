/**
 * Gemini routes
 *
 * Mounted at /api/gemini. POST /chat (auth) — ChefBot chat.
 */
import { Router } from "express";
import { chatController } from "./gemini.controller";
import { auth } from "../../middleware/middleware";

const router = Router();

// Protected route - requires authentication
router.post("/chat", auth, chatController);

export default router;
