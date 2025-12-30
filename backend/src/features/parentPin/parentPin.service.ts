import bcrypt from "bcryptjs";
import User from "../auth/UserModel";

export async function setParentPin(userId: string, pin: string): Promise<void> {
  const hash = await bcrypt.hash(pin, 10);
  await User.findByIdAndUpdate(userId, { parentPinHash: hash });
}

export async function verifyParentPin(
  userId: string,
  pin: string
): Promise<"NO_PIN" | boolean> {
  const user = await User.findById(userId).select("parentPinHash");
  if (!user || !user.parentPinHash) return "NO_PIN";

  return bcrypt.compare(pin, user.parentPinHash);
}
