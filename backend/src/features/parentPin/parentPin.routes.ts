import { Router } from "express";
import { auth } from "../../middleware/middleware";
import { validate, validationSchemas } from "../../middleware/validation";
import { setPinController, verifyPinController } from "./parentPin.controller";

export const parentPinRouter = Router();

parentPinRouter.post("/set", auth, validate(validationSchemas.setPin), setPinController);
parentPinRouter.post("/verify", auth, validate(validationSchemas.verifyPin), verifyPinController);
