/**
 * Auth / User controller
 *
 * Handles user registration, login, profile (get/update), gallery, score, and leaderboard.
 * Uses JWT for auth; auth middleware attaches req.user on protected routes.
 */
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
    let { username, name, password, allergens, cookingLevel, parentPin } = req.body as {
      username?: string;
      name?: string;
      password?: string;
      allergens?: string[];
      cookingLevel?: "Easy" | "Medium" | "Advanced";
      parentPin?: string;
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
            allergens
              .map((a) => String(a).trim().toLowerCase())
              .filter(Boolean),
          ),
        )
      : [];

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Hash parent PIN if provided
    let parentPinHash: string | null = null;
    if (parentPin && /^\d{4}$/.test(parentPin)) {
      parentPinHash = await bcrypt.hash(parentPin, 10);
    }

    const savedUser = await new User({
      username,
      name,
      password: passwordHash,
      allergens: cleanAllergens,
      cookingLevel: level,
      parentPinHash,
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
      totalScore: savedUser.totalScore || 0,
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
      totalScore: user.totalScore || 0, // <--- הוספנו כאן
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
    totalScore: req.user.totalScore || 0,
    gallery: req.user.gallery || [],
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
};

export const addToGallery = async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { gallery: { imageUrl, caption } } },
      { new: true },
    );

    return res.status(200).json({
      message: "Photo added to gallery",
      gallery: user?.gallery,
    });
  } catch (err) {
    console.error("addToGallery error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteFromGallery = async (req: AuthRequest, res: Response) => {
  try {
    const { photoId } = req.params;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { gallery: { _id: photoId } } },
      { new: true },
    );

    return res
      .status(200)
      .json({ message: "Photo deleted", gallery: user?.gallery });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCookingLevel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Unauthorized" });

    const { cookingLevel } = req.body as {
      cookingLevel?: "Easy" | "Medium" | "Advanced";
    };

    const allowed = new Set(["Easy", "Medium", "Advanced"]);
    if (!cookingLevel || !allowed.has(cookingLevel)) {
      return res.status(400).json({ message: "Invalid cookingLevel" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cookingLevel } },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: updated._id.toString(),
      username: updated.username,
      name: updated.name,
      allergens: updated.allergens || [],
      cookingLevel: updated.cookingLevel || "Easy",
      totalScore: updated.totalScore || 0,
      gallery: updated.gallery || [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    console.error("updateCookingLevel error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addScore = async (req: AuthRequest, res: Response) => {
  try {
    const { points } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!points || typeof points !== "number") {
      return res.status(400).json({ message: "Points must be a number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { totalScore: points } },
      { new: true },
    );

    return res.status(200).json({
      message: "Score updated",
      totalScore: updatedUser?.totalScore,
    });
  } catch (err) {
    console.error("addScore error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // We find users, sort by totalScore descending (-1), and limit to top 5
    // We only select username and totalScore to keep it efficient
    const topUsers = await User.find()
      .sort({ totalScore: -1 })
      .limit(5)
      .select("username totalScore");

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};
