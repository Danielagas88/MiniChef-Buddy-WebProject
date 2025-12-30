import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/middleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./UserModel";

// Define a small helper to avoid repeating secret checks
function getJwtSecret(res: Response): string | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res
      .status(500)
      .json({ message: "Server misconfiguration: missing JWT_SECRET" });
    return null;
  }
  return secret;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    let { username, name, password, allergens, cookingLevel } = req.body as {
      username?: string;
      name?: string;
      password?: string;
      allergens?: string[];
      cookingLevel?: "Easy" | "Medium" | "Advanced";
    };

    // Normalize inputs
    username = username?.trim().toLowerCase();
    name = name?.trim();

    if (!username || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const allowedLevels = new Set(["Easy", "Medium", "Advanced"]);
    const level =
      cookingLevel && allowedLevels.has(cookingLevel) ? cookingLevel : "Easy";

    const cleanAllergens = Array.isArray(allergens)
      ? Array.from(
          new Set(
            allergens.map((a) => String(a).trim().toLowerCase()).filter(Boolean)
          )
        )
      : [];

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const savedUser = await new User({
      username,
      name,
      password: passwordHash,
      allergens: cleanAllergens,
      cookingLevel: level,
    }).save();

    const secret = getJwtSecret(res);
    if (!secret) return;

    const token = jwt.sign({ id: savedUser._id.toString() }, secret, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      id: savedUser._id.toString(),
      username: savedUser.username,
      name: savedUser.name,
      allergens: savedUser.allergens || [],
      cookingLevel: savedUser.cookingLevel || "Easy",
      token,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    username = username?.trim().toLowerCase();

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const secret = getJwtSecret(res);
    if (!secret) return;

    const token = jwt.sign({ id: user._id.toString() }, secret, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      allergens: user.allergens || [],
      cookingLevel: user.cookingLevel || "Easy",
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  return res.json({
    id: req.user._id.toString(),
    username: req.user.username,
    name: req.user.name,
    allergens: req.user.allergens || [],
    cookingLevel: req.user.cookingLevel || "Easy",
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
};
