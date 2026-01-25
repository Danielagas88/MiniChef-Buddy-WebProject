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
import { validate, validationSchemas } from "../../middleware/validation";

const userRouter = Router();

userRouter.get("/me", auth, getUser);
userRouter.post("/register", validate(validationSchemas.register), createUser);
userRouter.post("/login", validate(validationSchemas.login), login);
userRouter.post("/gallery", auth, validate(validationSchemas.addToGallery), addToGallery);
userRouter.delete("/gallery/:photoId", auth, deleteFromGallery);
userRouter.patch("/me/cooking-level", auth, validate(validationSchemas.updateCookingLevel), updateCookingLevel);
userRouter.patch("/score", auth, validate(validationSchemas.addScore), addScore);
userRouter.get("/leaderboard", getLeaderboard);
export { userRouter };
