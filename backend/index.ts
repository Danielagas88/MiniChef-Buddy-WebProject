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
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connect as mongoConnect } from "mongoose";
import { userRouter } from "./src/features/auth/userRoute";
import { parentPinRouter } from "./src/features/parentPin/parentPin.routes"; //amit added this
import favoritesRoutes from "./src/features/favorites/favorites.routes";
import recipeHistoryRoutes from "./src/features/recipeHistory/recipeHistory.routes";
import geminiRoutes from "./src/features/gemini/gemini.routes";
import { triviaQuestions } from "./src/features/data/triviaQuestions";

// Create Express application instance
const app = express();
const port = Number(process.env.PORT) || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

/**
 * Global State Management
 * These variables stay in memory to manage active sessions and the matchmaking queue.
 */
let waitingPlayers: any[] = [];

const roomStates: Record<
  string,
  {
    answersCount: number;
    players: any[];
    isRoundLocked: boolean;
    scores: Record<string, number>;
  }
> = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  /**
   * MATCHMAKING LOGIC
   * Handles player queueing and pairs two users into a private room.
   */
  socket.on("join_waiting_room", (userData) => {
    // 1. Cleanup: Remove any stale/disconnected socket IDs from the waiting list
    waitingPlayers = waitingPlayers.filter((p) => io.sockets.sockets.has(p.id));

    // Prevent the same socket from joining the queue twice
    if (waitingPlayers.find((p) => p.id === socket.id)) return;

    // 2. Store user profile on the socket instance for easy access during the session
    const username =
      userData.username || `Chef_${Math.floor(Math.random() * 1000)}`;
    (socket as any).username = username;

    const player = { id: socket.id, username };
    waitingPlayers.push(player);
    socket.join("trivia_waiting");

    // 3. Matchmaking: Check if we have a pair ready
    if (waitingPlayers.length >= 2) {
      const pair = waitingPlayers.splice(0, 2);

      // Secondary Verification: Ensure both players are still truly connected
      const s1 = io.sockets.sockets.get(pair[0].id);
      const s2 = io.sockets.sockets.get(pair[1].id);

      if (!s1 || !s2) {
        // If one dropped, put the remaining player back at the front of the line
        if (s1) waitingPlayers.unshift(pair[0]);
        if (s2) waitingPlayers.unshift(pair[1]);
        return;
      }

      // 4. Room Creation
      const roomId = `room_${pair[0].id}`;
      roomStates[roomId] = {
        answersCount: 0,
        players: pair,
        isRoundLocked: false,
        scores: {
          [pair[0].id]: 0,
          [pair[1].id]: 0,
        },
      };

      // Select and shuffle questions for this specific battle
      const shuffledQuestions = [...triviaQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      // 5. Room Initialization
      pair.forEach((p) => {
        const s = io.sockets.sockets.get(p.id);
        if (s) {
          s.leave("trivia_waiting");
          s.join(roomId);
          (s as any).roomId = roomId;
          io.to(p.id).emit("start_multiplayer_game", {
            questions: shuffledQuestions,
            roomId,
            opponents: pair
              .map((pl) => pl.username)
              .filter((n) => n !== p.username),
          });
        }
      });
    }

    // Update lobby count for waiting users
    io.to("trivia_waiting").emit("user_joined_room", {
      count: waitingPlayers.length,
    });
  });

  /**
   * BATTLE LOGIC: ANSWER SUBMISSION
   * Synchronizes feedback and manages question progression.
   */

  socket.on("submit_answer", (data) => {
    const { roomId, isCorrect, score } = data;
    const room = roomStates[roomId];

    // Prevent processing if room doesn't exist or round is already locked
    if (!room || room.isRoundLocked) return;

    room.isRoundLocked = true; // Lock immediately so no one else can answer this round
    const myName = (socket as any).username;
    const opponent = room.players.find((p) => p.id !== socket.id);

    if (isCorrect) {
      room.scores[socket.id] = score;
      socket.emit("battle_feedback", {
        type: "SELF",
        isCorrect: true,
        message: "Correct! You were fast! +10 points",
      });

      // 2. Notification for the opponent (Red/Oops - they were too slow)
      if (opponent) {
        io.to(opponent.id).emit("battle_feedback", {
          type: "OPPONENT",
          isCorrect: false, // Opponent sees red because they missed the points
          newScore: score,
          message: `${myName} answered correctly! Be faster next time!`,
        });
      }
    } else {
      // 1. Feedback for the person who answered incorrectly (Red/Oops)
      socket.emit("battle_feedback", {
        type: "SELF",
        isCorrect: false,
        message: `Wrong! Points go to ${opponent?.username || "Opponent"}`,
      });

      // 2. Bonus for the opponent (Green/Tasty - they got lucky points)
      if (opponent) {
        room.scores[opponent.id] += 10;
        const opponentNewScore = room.scores[opponent.id];
        io.to(opponent.id).emit("battle_feedback", {
          type: "PLAYER_BONUS",
          isCorrect: true, // Opponent sees green because they got bonus points
          newScore: opponentNewScore,
          message: `${myName} was wrong! You got 10 bonus points!`,
        });

        socket.emit("battle_feedback", {
          type: "OPPONENT_BONUS",
          isCorrect: false,
          newScore: opponentNewScore,
          message: `Oops! You gave ${opponent.username} 10 points.`,
        });
      }
    }

    // 3. Automated transition after 2.5 seconds
    setTimeout(() => {
      if (roomStates[roomId]) {
        roomStates[roomId].isRoundLocked = false; // Reset lock for the next question
        io.to(roomId).emit("move_to_next_question");
      }
    }, 2500);
  });

  /**
   * TECHNICAL VICTORY HANDLER
   * Triggers when a player leaves mid-game (refresh, tab close, or navigation).
   */
  socket.on("leave_room", ({ roomId }) => {
    if (roomId && roomStates[roomId]) {
      const username = (socket as any).username || "A Chef";

      socket.to(roomId).emit("opponent_left", {
        message: `${username} left the kitchen! Technical Victory for you.`,
      });
      delete roomStates[roomId];
      socket.leave(roomId);
      (socket as any).roomId = null;
      console.log(`Room ${roomId} cleaned up after manual leave.`);
    }
  });

  socket.on("disconnecting", () => {
    const roomId = (socket as any).roomId;
    if (roomId) {
      const username = (socket as any).username || "A Chef";
      console.log(`Disconnecting: ${username} from ${roomId}`);

      socket.to(roomId).emit("opponent_left", {
        message: `${username} disconnected! Technical Victory.`,
      });

      delete roomStates[roomId];
    }
  });

  /**
   * GENERAL DISCONNECT CLEANUP
   */
  socket.on("disconnect", () => {
    waitingPlayers = waitingPlayers.filter((p) => p.id !== socket.id);
    io.to("trivia_waiting").emit("user_joined_room", {
      count: waitingPlayers.length,
    });
    console.log("Client fully disconnected:", socket.id);
  });
});

const MONGO_URI = (process.env.MONGO_URI || "").replace(
  "<password>",
  process.env.MONGO_PASSWORD || "",
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
app.use("/api/gemini", geminiRoutes);

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
    if (!MONGO_URI || MONGO_URI === "") {
      console.error("ERROR: MONGO_URI is not set in environment variables!");
      console.error("Please check your .env file and ensure MONGO_URI is configured.");
      process.exit(1);
    }

    await mongoConnect(MONGO_URI);
    console.log("✅ Server is connected to the MongoDB cluster");

    server.listen(port, () => {
      console.log(`✅ Server (HTTP & WebSockets) is listening on port ${port}`);
      console.log(`✅ API available at http://localhost:${port}`);
    });

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ ERROR: Port ${port} is already in use!`);
        console.error(`   Please stop the other process using port ${port} or change PORT in .env`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1);
  }
}

// Start the application
startServer();
