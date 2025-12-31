const API_BASE = "http://localhost:3000";

export const galleryService = {
  // 1. Add a new photo to the user's gallery
  addToGallery: async (imageUrl, caption = "My Creation") => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/auth/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ imageUrl, caption }),
    });

    if (!res.ok) {
      throw new Error("Failed to save to gallery");
    }

    return res.json();
  },

  // 2. Fetch all gallery images from the current user profile
  getUserGallery: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch gallery");
    }

    const data = await res.json();
    // Return only the gallery array from the user object
    return data.gallery || [];
  },

  // 3. Delete a specific photo by its ID
  deletePhoto: async (photoId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/auth/gallery/${photoId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) throw new Error("Failed to delete photo");
    return res.json();
  },
};
