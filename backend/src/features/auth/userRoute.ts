import { Router } from "express";
import {
  createUser,
  getUser,
  login,
  addToGallery,
  deleteFromGallery,
} from "./userController";
import { auth } from "../../middleware/middleware";

const userRouter = Router();

userRouter.get("/me", auth, getUser);
userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/gallery", auth, addToGallery);
userRouter.delete("/gallery/:photoId", auth, deleteFromGallery);
export { userRouter };
