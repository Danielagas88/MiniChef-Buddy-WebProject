/**
 * Recipe history model (Mongoose)
 *
 * Stores completed recipes per user: userId, recipeId, title, level, minutes,
 * sessionId (unique per user), completedAt. Used for progress and stats.
 */
import mongoose, { Schema } from "mongoose";

const RecipeHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // TheMealDB recipe id (string)
    recipeId: { type: String, required: true },

    title: { type: String, required: true },
    level: { type: String, default: "" },

    // optional: for future stats
    minutes: { type: Number, default: 0 },

    // to prevent duplicates if user clicks finish twice
    sessionId: { type: String, required: true, index: true },

    completedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// unique per user per cooking session
RecipeHistorySchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export const RecipeHistory = mongoose.model(
  "RecipeHistory",
  RecipeHistorySchema
);
