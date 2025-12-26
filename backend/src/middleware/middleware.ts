import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserType } from "../features/auth/UserType";
import User from "../features/auth/UserModel";

interface IAuth extends Request {
  user?: UserType;
}

const auth = async (req: IAuth, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) throw {};
    const token = req.headers.authorization.split("Bearer ")[1];

    if (!token) throw {};

    const verified = jwt.verify(token, process.env["JWT_SECRET"] as string) as { id: string };

    if (!verified) throw {};

    const user: UserType | null = await User.findById(verified.id);

    if (!user) throw {};

    req.user = user;
    next();
  } catch (err) {
    console.log({ message: "Unauthorized" });
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { auth };
