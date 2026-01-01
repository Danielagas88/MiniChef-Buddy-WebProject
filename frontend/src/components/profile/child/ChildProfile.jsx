import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { galleryService } from "../../../services/galleryService.js";
import { Award, ChefHat, Star, Trophy } from "lucide-react";
import BadgeCard from "./BadgeCard";
import { BADGES, computeProgress } from "../../../utils/progressUtils";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import { updateMyCookingLevel } from "../../../services/userService.js";

const BADGE_ICONS = {
  "first-dish": Award,
  "mini-chef": ChefHat,
  "kitchen-star": Star,
  "master-chef": Trophy,
};

/**
 * ChildProfile Component
 * ----------------------
 * Displays the child's chef profile and their personal cooking gallery.
 * Photos are fetched from the backend (stored as Cloudinary URLs).
 */
export default function ChildProfile() {
  const { user, setUser } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [level, setLevel] = useState(user?.cookingLevel || "Easy");
  const [savingLevel, setSavingLevel] = useState(false);

  const progress = useMemo(() => computeProgress(historyItems), [historyItems]);

  useEffect(() => {
    setLevel(user?.cookingLevel || "Easy");
  }, [user?.cookingLevel]);

  async function saveLevel() {
    try {
      setSavingLevel(true);
      const updated = await updateMyCookingLevel({
        token: user.token,
        cookingLevel: level,
      });

      setUser((prev) => ({ ...prev, cookingLevel: updated.cookingLevel }));
    } catch (e) {
      alert(e.message || "Failed to update cooking level");
    } finally {
      setSavingLevel(false);
    }
  }

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
            Level: {user.cookingLevel || "Easy"}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Update cooking level:
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 bg-white text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              onClick={saveLevel}
              disabled={savingLevel || level === (user.cookingLevel || "Easy")}
              className="rounded-xl bg-purple-600 px-4 py-2 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {savingLevel ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACHIEVEMENTS (no history list shown) */}
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-6 border border-yellow-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              🏅 Achievements
            </h3>
            <p className="text-sm text-gray-500">
              Earn badges as you cook more recipes!
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Recipes cooked</div>
            <div className="text-2xl font-extrabold text-gray-800">
              {progressLoading ? "…" : progress.totalCooked}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          {progressLoading ? (
            <div className="text-sm text-gray-400">Loading progress…</div>
          ) : (
            <>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Next milestone: {progress.nextMilestone} recipes</span>
                <span>
                  {progress.progressToNext}/15 ({progress.progressPercent}%)
                </span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-pink-500 rounded-full transition-all"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Total cooking time:{" "}
                <b className="text-gray-700">{progress.totalMinutes}</b> minutes
              </div>
            </>
          )}
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {BADGES.map((b) => {
            const unlocked = progress.earnedBadges.some((x) => x.key === b.key);
            const Icon = BADGE_ICONS[b.key] || Award;

            return (
              <BadgeCard
                key={b.key}
                IconComponent={Icon}
                title={b.name}
                unlocked={unlocked}
                subtitle={`Unlock at ${b.at} recipes`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. COOKING GALLERY SECTION */}
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
