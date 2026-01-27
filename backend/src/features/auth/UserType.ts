/**
 * User types
 *
 * UserDoc and UserDocument for the User model and auth middleware.
 */
import { HydratedDocument } from "mongoose";

export interface UserDoc {
  name: string;
  username: string;
  password: string;

  parentPinHash?: string | null;
  totalScore: number;
  favoriteRecipeIds?: string[];
  allergens?: string[];
  cookingLevel?: "Easy" | "Medium" | "Advanced";

  createdAt: Date;
  updatedAt: Date;

  gallery?: {
    imageUrl: string;
    caption?: string;
    createdAt?: Date;
  }[];
}

export type UserDocument = HydratedDocument<UserDoc>;
