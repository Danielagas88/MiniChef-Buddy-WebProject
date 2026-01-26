/**
 * Centralized API Configuration
 * 
 * Manages API base URLs using environment variables.
 * Falls back to localhost for development.
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL - Backend API base URL
 * - VITE_SOCKET_URL - WebSocket server URL
 * 
 * @module config/api
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

/**
 * API Configuration Object
 * @type {Object}
 * @property {string} BASE_URL - Base URL for REST API
 * @property {string} SOCKET_URL - Base URL for WebSocket server
 */
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: SOCKET_URL,
};

/**
 * Helper function to build full API URL
 * @param {string} path - API endpoint path
 * @returns {string} Full URL with base path
 */
export function getApiUrl(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

export default API_CONFIG;
