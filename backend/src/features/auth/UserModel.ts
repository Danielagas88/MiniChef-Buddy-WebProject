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
    },

    password: { type: String, required: true },

    parentPinHash: { type: String, default: null },

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
  { timestamps: true }
);

const User = model<UserDoc>("User", userSchema);
export default User;
