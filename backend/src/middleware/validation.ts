/**
 * Validation middleware
 *
 * Uses Zod to validate request body. Exports validate(schema) and validationSchemas
 * for register, login, addToGallery, updateCookingLevel, addScore, toggleFavorite, etc.
 * Gracefully skips if zod is not installed.
 */
import { Request, Response, NextFunction } from "express";

// Try to import zod, but allow graceful fallback if not installed
let z: any;
let ZodError: any;
try {
  const zodModule = require("zod");
  z = zodModule.z;
  ZodError = zodModule.ZodError;
} catch (error) {
  console.warn("Zod not found. Validation middleware will be disabled. Run: npm install zod");
}

/**
 * Validation middleware factory
 * Creates a middleware that validates request body against a Zod schema
 */
export function validate(schema: any) {
  // If zod is not available or schema is undefined, just pass through
  if (!z || !ZodError || !schema) {
    if (!z || !ZodError) {
      console.warn("Validation skipped: zod not installed");
    }
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      // Type guard for ZodError
      if (ZodError && error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> };
        const errors = zodError.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }
      return res.status(400).json({ message: "Invalid request data" });
    }
  };
}

/**
 * Validation schemas for different endpoints
 * Note: These will be empty objects if zod is not installed
 */
export const validationSchemas: any = z ? {
  // Auth schemas
  register: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(/^[a-z0-9_]+$/i, "Username can only contain letters, numbers, and underscores")
      .transform((val: string) => val.toLowerCase()),
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
    allergens: z.array(z.string()).optional().default([]),
    cookingLevel: z.enum(["Easy", "Medium", "Advanced"]).optional().default("Easy"),
    parentPin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits").optional(),
  }),

  login: z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  }),

  // Gallery schemas
  addToGallery: z.object({
    imageUrl: z.string().url("Invalid image URL"),
    caption: z.string().max(200, "Caption must be less than 200 characters").optional(),
  }),

  // Cooking level schema
  updateCookingLevel: z.object({
    cookingLevel: z.enum(["Easy", "Medium", "Advanced"], {
      errorMap: () => ({ message: "Cooking level must be Easy, Medium, or Advanced" }),
    }),
  }),

  // Score schema
  addScore: z.object({
    points: z.number().int().min(0, "Points must be a non-negative integer"),
  }),

  // Parent PIN schemas
  setPin: z.object({
    pin: z
      .string()
      .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  }),

  verifyPin: z.object({
    pin: z
      .string()
      .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  }),

  // Recipe history schema
  completeRecipe: z.object({
    recipeId: z.string().trim().min(1, "Recipe ID is required"),
    title: z.string().trim().min(1, "Recipe title is required"),
    sessionId: z.string().trim().min(1, "Session ID is required"),
    level: z.string().optional(),
    minutes: z.number().int().min(0, "Minutes must be a non-negative integer"),
  }),

  // Favorites schema
  toggleFavorite: z.object({
    recipeId: z.string().trim().min(1, "Recipe ID is required"),
  }),
} : {};
