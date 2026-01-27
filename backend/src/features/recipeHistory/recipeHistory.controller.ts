/**
 * Recipe history controller
 *
 * complete: save a completed recipe (auth). me: list current user's history (auth).
 * Duplicate sessionId returns ok/duplicate instead of error.
 */
import { Response } from "express";
import { AuthRequest } from "../../middleware/middleware";
import { parseCompleteBody } from "./recipeHistory.types";
import { createCompletion, listHistory } from "./recipeHistory.service";

function toDTO(doc: any) {
  return {
    id: doc._id.toString(),
    recipeId: doc.recipeId,
    title: doc.title,
    level: doc.level,
    minutes: doc.minutes,
    sessionId: doc.sessionId,
    completedAt: doc.completedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function complete(req: AuthRequest, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = parseCompleteBody(req.body ?? {});
    if (!parsed) {
      return res.status(400).json({
        message:
          "recipeId, title, sessionId are required and minutes must be >= 0",
      });
    }

    try {
      const doc = await createCompletion({
        userId: req.user._id.toString(),
        ...parsed,
      });

      return res.status(201).json({ ok: true, item: toDTO(doc) });
    } catch (err: any) {
      // unique index userId+sessionId => duplicate click
      if (err?.code === 11000) {
        return res.json({ ok: true, duplicate: true });
      }
      throw err;
    }
  } catch (err) {
    console.error("recipe-history complete error:", err);
    return res
      .status(500)
      .json({ message: "Failed to save recipe completion" });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const limit = Number(req.query.limit ?? 200);

    const items = await listHistory({
      userId: req.user._id.toString(),
      limit,
    });

    return res.json({ items: items.map(toDTO) });
  } catch (err) {
    console.error("recipe-history me error:", err);
    return res.status(500).json({ message: "Failed to load history" });
  }
}
