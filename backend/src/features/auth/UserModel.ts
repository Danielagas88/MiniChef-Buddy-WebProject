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
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });

const User = model<UserDoc>("User", userSchema);
export default User;
