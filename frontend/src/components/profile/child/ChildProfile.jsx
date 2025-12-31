import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { galleryService } from "../../../services/galleryService.js";

/**
 * ChildProfile Component
 * ----------------------
 * Displays the child's chef profile and their personal cooking gallery.
 * Photos are fetched from the backend (stored as Cloudinary URLs).
 */
export default function ChildProfile() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery images when the component mounts or user changes
  useEffect(() => {
    async function loadGallery() {
      try {
        // Fetch current user data which includes the gallery array
        const galleryData = await galleryService.getUserGallery();
        setImages(galleryData);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadGallery();
    }
  }, [user]);

  /**
   * Handles photo deletion
   * @param {string} photoId - The unique ID of the photo in the MongoDB array
   */
  const handleDelete = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await galleryService.deletePhoto(photoId);
      // Optimistically update the UI by filtering out the deleted image
      setImages((prev) => prev.filter((img) => img._id !== photoId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete the photo. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <section className="space-y-6 animate-fade-in">
      {/* 1. CHEF PROFILE CARD */}
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 flex items-center gap-4 border border-pink-100">
        {/* Avatar Placeholder */}
        <div className="w-20 h-20 bg-linear-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">
          🧑‍🍳
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chef {user.name}</h2>
          <p className="text-gray-500 text-sm">@{user.username}</p>

          <div className="mt-2 inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Level: {user.cookingLevel || "Beginner"}
          </div>
        </div>
      </div>

      {/* 2. COOKING GALLERY SECTION */}
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-6 min-h-[250px]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📸 My Cooking Gallery
          </h3>
          <p className="text-sm text-gray-500">
            Check out all the amazing dishes you've cooked!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading your photos... ⏳
          </div>
        ) : images.length > 0 ? (
          /* Render Grid of Images */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-gray-50"
              >
                {/* Image from Cloudinary */}
                <img
                  src={img.imageUrl}
                  alt={img.caption || "My Dish"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Delete Button - Visible on hover */}
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md hover:bg-red-600 z-20"
                  title="Delete Photo"
                >
                  ✕
                </button>

                {/* Optional Caption Overlay */}
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-xs p-2">
                    <p className="text-[10px] text-white font-medium truncate">
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State UI */
          <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50/50">
            <span className="text-4xl mb-2 opacity-50">🖼️</span>
            <p className="text-sm font-medium">Gallery is empty</p>
            <p className="text-xs mt-1 text-center">
              Cook a recipe and upload a photo to see it here!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
