/**
 * Centralized HTTP Client
 * Provides a consistent interface for all API calls
 * 
 * Benefits:
 * - Single source of truth for API requests
 * - Consistent error handling
 * - Easy to add interceptors, logging, etc.
 * 
 * Uses functional programming approach (no classes)
 */

import { API_CONFIG } from "../config/api.js";

// Base URL for API requests
const API_BASE = API_CONFIG.BASE_URL.replace("/api", "");

/**
 * Make an HTTP request
 * @param {string} endpoint - API endpoint (e.g., "/api/auth/login")
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, etc.)
 * @param {Object} options.body - Request body
 * @param {string} options.token - Auth token
 * @param {Object} options.headers - Additional headers
 * @returns {Promise<any>} Response data
 */
async function request(endpoint, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;
  
  const url = `${API_BASE}${endpoint}`;
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, config);
    
    // Consume response body to prevent memory leaks
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle error response
      let errorData;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
      } catch {
        errorData = null;
      }
      
      const error = new Error(errorData?.message || `Request failed: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
  } catch (error) {
    // Re-throw if it's already our error
    if (error.status) throw error;
    
    // Network or other errors
    throw new Error(error.message || "Network error occurred");
  }
}

/**
 * API Client - Functional approach
 * All methods are pure functions
 */
export const apiClient = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options (token, headers, etc.)
   * @returns {Promise<any>} Response data
   */
  get: (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: "GET" });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options (token, headers, etc.)
   * @returns {Promise<any>} Response data
   */
  post: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: "POST", body });
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options (token, headers, etc.)
   * @returns {Promise<any>} Response data
   */
  patch: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: "PATCH", body });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options (token, headers, etc.)
   * @returns {Promise<any>} Response data
   */
  put: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: "PUT", body });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options (token, headers, etc.)
   * @returns {Promise<any>} Response data
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: "DELETE" });
  },
};
