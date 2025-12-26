import { model, Schema } from "mongoose";
import { UserType } from "./UserType";

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<UserType>("User", userSchema);

export default User;
