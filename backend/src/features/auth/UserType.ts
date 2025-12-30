import { HydratedDocument } from "mongoose";

export interface UserDoc {
  name: string;
  username: string;
  password: string;

  parentPinHash?: string | null;
  favoriteRecipeIds?: string[];
  allergens?: string[];
  cookingLevel?: "Easy" | "Medium" | "Advanced";

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserDoc>;
