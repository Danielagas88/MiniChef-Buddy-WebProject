/**
 * WebSocket Service
 * 
 * Manages WebSocket connection for real-time multiplayer features.
 * Used primarily for trivia battle games.
 * 
 * @module services/socket
 */

import { io } from "socket.io-client";
import { API_CONFIG } from "../config/api.js";

const SOCKET_URL = API_CONFIG.SOCKET_URL;

/**
 * Socket.io client instance
 * 
 * Configured to not auto-connect. Call `socket.connect()` when needed.
 * 
 * @type {import('socket.io-client').Socket}
 * 
 * @example
 * import { socket } from "../services/socket.js";
 * socket.connect();
 * socket.emit("join_waiting_room", { username: "Chef123" });
 */
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
