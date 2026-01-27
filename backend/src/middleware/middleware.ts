/**
 * Auth middleware
 *
 * Verifies JWT from Authorization: Bearer <token>, loads user, attaches req.user.
 * Use on routes that require authentication.
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../features/auth/UserModel";
import { UserDocument } from "../features/auth/UserType";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export async function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ message: "Server misconfiguration: missing JWT_SECRET" });
    }

    const decoded = jwt.verify(token, secret) as { id?: string };
    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user as UserDocument;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
