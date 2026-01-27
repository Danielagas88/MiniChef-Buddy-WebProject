/**
 * useImageUpload
 *
 * Handles image uploads to Cloudinary and adding photos to the user gallery.
 * Used in the cooking session finish modal.
 *
 * @returns {Object} isUploading, isUploadSuccess, uploadError, uploadImage(file, recipeTitle)
 *
 * @example
 * const { isUploading, isUploadSuccess, uploadError, uploadImage } = useImageUpload();
 */
import { useState } from "react";
import { galleryService } from "../services/galleryService.js";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadImage = async (file, recipeTitle) => {
    if (!file) {
      setUploadError("No file selected.");
      return false;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return false;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image is too large. Please select an image smaller than 10MB.");
      return false;
    }

    setIsUploading(true);
    setUploadError(null);
    setIsUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
      }

      const imageUrl = data.secure_url;

      // Save to our backend
      await galleryService.addToGallery(
        imageUrl,
        `Cooked ${recipeTitle || "something yummy"}`,
      );

      setIsUploadSuccess(true);
      setUploadError(null);
      return true;
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadError(
        error.message || "Failed to save photo. Please check your connection and try again."
      );
      setIsUploadSuccess(false);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadState = () => {
    setIsUploading(false);
    setIsUploadSuccess(false);
    setUploadError(null);
  };

  return {
    isUploading,
    isUploadSuccess,
    uploadError,
    uploadImage,
    resetUploadState,
  };
}
