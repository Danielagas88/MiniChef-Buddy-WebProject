import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "./UserModel";

export const createUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  console.log(username, name, password);
  if (!username || !name || !password) {
    return res.status(400).send("All fields are required");
  }

  if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long");
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).send("Username already taken");
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({ username, name, password: passwordHash });
  const savedUser = await newUser.save();

  const token = jwt.sign(
    { id: savedUser._id },
    process.env.JWT_SECRET as Secret
  );

  return res.send({
    id: savedUser._id,
    username: savedUser.username,
    name: savedUser.name,
    token,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send("Invalid username or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret);

  return res.send({
    id: user._id,
    username: user.username,
    name: user.name,
    token,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

export const getUser = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    return res.send({
      id: user._id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
