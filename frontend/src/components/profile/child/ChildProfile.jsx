import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { galleryService } from "../../../services/galleryService.js";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import ProfileHeader from "./ProfileHeader.jsx";
import AchievementsSection from "./AchievementsSection.jsx";
import GallerySection from "./GallerySection.jsx";

export default function ChildProfile() {
  const { user, setUser } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        setProgressLoading(true);
        const items = await getMyRecipeHistory({
          token: user?.token,
          limit: 200,
        });
        setHistoryItems(items);
      } catch (e) {
        console.error("Failed to load progress history:", e);
        setHistoryItems([]);
      } finally {
        setProgressLoading(false);
      }
    }
    if (user?.token) loadProgress();
  }, [user?.token]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const galleryData = await galleryService.getUserGallery();
        setImages(galleryData);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadGallery();
  }, [user]);

  const handleDelete = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await galleryService.deletePhoto(photoId);
      setImages((prev) => prev.filter((img) => img._id !== photoId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete the photo. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <section className="space-y-4 animate-fade-in pb-12">
      <ProfileHeader user={user} setUser={setUser} />
      <AchievementsSection
        historyItems={historyItems}
        progressLoading={progressLoading}
      />
      <GallerySection
        images={images}
        loading={loading}
        onDelete={handleDelete}
      />
    </section>
  );
}
