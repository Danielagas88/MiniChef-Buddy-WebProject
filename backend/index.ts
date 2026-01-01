/**
 * Backend entry point
 * -------------------
 * This file is responsible for:
 * - Loading environment variables
 * - Creating and configuring the Express app
 * - Connecting to MongoDB
 * - Registering routes and middlewares
 * - Starting the HTTP server
 */

require("dotenv").config();
import express from "express";
import cors from "cors";
import { connect as mongoConnect } from "mongoose";
import { userRouter } from "./src/features/auth/userRoute";
import { parentPinRouter } from "./src/features/parentPin/parentPin.routes"; //amit added this
import favoritesRoutes from "./src/features/favorites/favorites.routes";
import recipeHistoryRoutes from "./src/features/recipeHistory/recipeHistory.routes";

// Create Express application instance
const app = express();
const port = Number(process.env.PORT) || 3000;

const MONGO_URI = (process.env.MONGO_URI || "").replace(
  "<password>",
  process.env.MONGO_PASSWORD || ""
);

/**
 * Global middlewares
 * - express.json(): parses incoming JSON request bodies
 * - cors(): enables Cross-Origin Resource Sharing
 */
app.use(express.json());
app.use(cors());

//favorites routes amit added this
app.use("/api/favorites", favoritesRoutes);

/**
 * Routes
 * All authentication-related routes are prefixed with /api/auth
 */
app.use("/api/auth", userRouter);

/**
 * Parent PIN routes amit added this
 * -----------------
 * Routes responsible for managing parent access PIN:
 * - POST /api/parent-pin/set    → Create or update the parent's PIN
 * - POST /api/parent-pin/verify → Verify the parent's PIN
 *
 * All routes are protected by JWT authentication middleware.
 */
app.use("/api/parent-pin", parentPinRouter);
app.use("/api/recipe-history", recipeHistoryRoutes);

/**
 * Used to verify that the server is running
 */
app.get("/", (req, res) => {
  res.send("Server api");
});

/**
 * Application bootstrap
 * ---------------------
 * The server starts only after a successful connection to MongoDB.
 * If the database connection fails, the process exits.
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await mongoConnect(MONGO_URI);
    console.log("Server is connected to the MongoDB cluster");

    // Start HTTP server
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();
