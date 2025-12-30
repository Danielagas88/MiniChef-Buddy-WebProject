import { Router } from "express";
import { createUser, getUser } from "./userController";
import { login } from "./userController";
import { auth } from "../../middleware/middleware";

const userRouter = Router();

userRouter.get("/", auth, getUser);
userRouter.get("/me", auth, getUser);
userRouter.post("/register", createUser);
userRouter.post("/login", login);

export { userRouter };
