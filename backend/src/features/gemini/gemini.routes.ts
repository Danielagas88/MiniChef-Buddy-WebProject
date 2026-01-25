import { Router } from "express";
import { chatController } from "./gemini.controller";
import { auth } from "../../middleware/middleware";

const router = Router();

// Protected route - requires authentication
router.post("/chat", auth, chatController);

export default router;
