/**
 * User model (Mongoose)
 *
 * Schema for users: name, username, password, parentPinHash, totalScore,
 * favoriteRecipeIds, allergens, cookingLevel, gallery. Used by auth and related features.
 */
import { model, Schema } from "mongoose";
import { UserDoc } from "./UserType";

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true, // Index for login queries
    },

    password: { type: String, required: true },

    parentPinHash: { type: String, default: null },

    totalScore: { type: Number, default: 0, index: true }, // Index for leaderboard queries

    favoriteRecipeIds: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    cookingLevel: {
      type: String,
      enum: ["Easy", "Medium", "Advanced"],
      default: "Easy",
    },

    gallery: [
      {
        imageUrl: { type: String, required: true },
        caption: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const User = model<UserDoc>("User", userSchema);
export default User;
