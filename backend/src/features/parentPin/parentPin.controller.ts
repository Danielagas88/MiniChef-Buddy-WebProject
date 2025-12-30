import { Response } from "express";
import { AuthRequest } from "../../middleware/middleware";
import { validatePin } from "./parentPin.types";
import { setParentPin, verifyParentPin } from "./parentPin.service";

export async function setPinController(req: AuthRequest, res: Response) {
  try {
    const pin = validatePin(req.body?.pin);
    if (!pin) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await setParentPin(req.user._id.toString(), pin);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Failed to set PIN" });
  }
}

export async function verifyPinController(req: AuthRequest, res: Response) {
  try {
    const pin = validatePin(req.body?.pin);
    if (!pin) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await verifyParentPin(req.user._id.toString(), pin);

    if (result === "NO_PIN") {
      return res.status(404).json({ message: "No PIN set yet" });
    }

    return res.json({ ok: result });
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify PIN" });
  }
}
