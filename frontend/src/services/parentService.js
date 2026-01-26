/**
 * Parent PIN Service
 * 
 * Handles parent PIN verification and setup for secure parent dashboard access.
 * PINs are 4-digit codes that provide an additional security layer.
 * 
 * @module services/parentService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Parent API service object
 * @namespace parentApi
 */
export const parentApi = {
  /**
   * Verify parent PIN for dashboard access
   * @param {string} pin - 4-digit PIN code
   * @param {string} token - User authentication token
   * @returns {Promise<Object>} Verification result
   * @throws {Error} If PIN is incorrect or request fails
   */
  verifyPin: (pin, token) =>
    apiClient.post(API_ENDPOINTS.PARENT.VERIFY_PIN, { pin }, { token }),

  /**
   * Set or update parent PIN
   * @param {string} pin - 4-digit PIN code to set
   * @param {string} token - User authentication token
   * @returns {Promise<Object>} Confirmation result
   * @throws {Error} If request fails
   */
  setPin: (pin, token) =>
    apiClient.post(API_ENDPOINTS.PARENT.SET_PIN, { pin }, { token }),
};
