import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { setPinController, verifyPinController } from "./parentPin.controller";

export const parentPinRouter = Router();

parentPinRouter.post("/set", auth, setPinController);
parentPinRouter.post("/verify", auth, verifyPinController);
