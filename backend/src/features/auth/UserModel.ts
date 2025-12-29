import { model, Schema } from "mongoose";
import { UserType } from "./UserType";

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

    // 🔐 Parent PIN (hashed) amit add this
    parentPinHash: { type: String, default: null },
     //  Favorites
    favoriteRecipeIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = model<UserType>("User", userSchema);

export default User;
