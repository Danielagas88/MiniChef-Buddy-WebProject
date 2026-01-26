/**
 * Gallery Service
 * 
 * Handles user photo gallery operations.
 * Users can save photos of their completed recipes to their gallery.
 * 
 * @module services/galleryService
 */

import { apiClient } from "../lib/apiClient.js";
import { API_ENDPOINTS } from "../constants/api/endpoints.js";

/**
 * Gallery service object
 * @namespace galleryService
 */
export const galleryService = {
  /**
   * Add a new photo to the user's gallery
   * 
   * Saves a photo URL to the user's gallery with an optional caption.
   * 
   * @param {string} imageUrl - URL of the image to add
   * @param {string} [caption="My Creation"] - Optional caption for the photo
   * @returns {Promise<Object>} Updated gallery data
   * @throws {Error} If request fails
   * 
   * @example
   * await galleryService.addToGallery("https://example.com/photo.jpg", "My Pasta!");
   */
  addToGallery: async (imageUrl, caption = "My Creation") => {
    const token = localStorage.getItem("token");
    return apiClient.post(
      API_ENDPOINTS.AUTH.GALLERY,
      { imageUrl, caption },
      { token }
    );
  },

  /**
   * Fetch all gallery images from the current user profile
   * 
   * Retrieves all photos saved in the user's gallery.
   * 
   * @returns {Promise<Array>} Array of gallery photo objects
   * @throws {Error} If request fails
   * 
   * @example
   * const photos = await galleryService.getUserGallery();
   */
  getUserGallery: async () => {
    const token = localStorage.getItem("token");
    const data = await apiClient.get(API_ENDPOINTS.AUTH.ME, { token });
    // Return only the gallery array from the user object
    return data.gallery || [];
  },

  /**
   * Delete a specific photo by its ID
   * 
   * Removes a photo from the user's gallery.
   * 
   * @param {string} photoId - ID of the photo to delete
   * @returns {Promise<Object>} Deletion confirmation
   * @throws {Error} If request fails
   * 
   * @example
   * await galleryService.deletePhoto("photo-123");
   */
  deletePhoto: async (photoId) => {
    const token = localStorage.getItem("token");
    return apiClient.delete(API_ENDPOINTS.AUTH.GALLERY_DELETE(photoId), { token });
  },
};
