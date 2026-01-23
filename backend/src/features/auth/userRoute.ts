import { Router } from "express";
import {
  createUser,
  getUser,
  login,
  addToGallery,
  deleteFromGallery,
  updateCookingLevel,
  addScore,
  getLeaderboard,
} from "./userController";
import { auth } from "../../middleware/middleware";

const userRouter = Router();

userRouter.get("/me", auth, getUser);
userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/gallery", auth, addToGallery);
userRouter.delete("/gallery/:photoId", auth, deleteFromGallery);
userRouter.patch("/me/cooking-level", auth, updateCookingLevel);
userRouter.patch("/score", auth, addScore);
userRouter.get("/leaderboard", getLeaderboard);
export { userRouter };
