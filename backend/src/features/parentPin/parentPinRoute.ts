import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../auth/UserModel";
import { auth, AuthRequest } from "../../middleware/middleware";


/**
 * amit added this
 */
export const parentPinRouter = Router();

/**
 * POST /api/parent-pin/set
 * Body: { pin: "1234" }
 * Saves hashed PIN in MongoDB for the logged-in user.
 */
parentPinRouter.post("/set", auth, async (req: AuthRequest, res) => {
  try {
    const { pin } = req.body as { pin?: string };

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hash = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(userId, { parentPinHash: hash });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Failed to set PIN" });
  }
});

/**
 * POST /api/parent-pin/verify
 * Body: { pin: "1234" }
 * Returns { ok: true } if matches the stored hash.
 */
parentPinRouter.post("/verify", auth, async (req: AuthRequest, res) => {
  try {
    const { pin } = req.body as { pin?: string };

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("parentPinHash");
    if (!user || !user.parentPinHash) {
      return res.status(404).json({ message: "No PIN set yet" });
    }

    const ok = await bcrypt.compare(pin, user.parentPinHash);

    return res.json({ ok });
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify PIN" });
  }
});
