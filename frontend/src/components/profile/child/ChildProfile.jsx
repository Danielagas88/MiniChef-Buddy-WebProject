import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import { galleryService } from "../../../services/galleryService.js";
import { Award, ChefHat, Star, Trophy, Camera } from "lucide-react";
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
      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-5 flex flex-col md:flex-row items-center gap-6 border border-(--card-surface-border) relative overflow-hidden transition-all">
        <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-br-full -z-0" />

        <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-400 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-(--border-color)">
          🧑‍🍳
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left space-y-1">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-(--text-primary)">
              Chef {user.name}
            </h2>
            <p className="text-(--text-secondary) text-xs font-medium">
              @{user.username}
            </p>
          </div>
          <div className="inline-flex items-center bg-emerald-500/10 text-(--accent-emerald) px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-emerald-500/20">
            Rank: {user.cookingLevel || "Easy"}
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-(--text-secondary)">
                Level up:
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-full border-2 border-(--border-color) px-3 py-1 text-(--text-primary) text-xs font-medium bg-(--input-bg) focus:border-emerald-400 outline-none transition-all shadow-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button
              onClick={saveLevel}
              disabled={savingLevel || level === (user.cookingLevel || "Easy")}
              className="rounded-full backdrop-blur-md bg-(--input-bg) border border-(--border-color) px-4 py-1.5 text-(--text-primary) text-xs font-bold hover:opacity-90 disabled:opacity-30 transition-all shadow-lg active:scale-95"
            >
              {savingLevel ? "Saving..." : "Update Level"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-6 border border-(--card-surface-border) transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-(--text-primary) flex items-center gap-2">
              <span className="text-amber-500">🏅</span> My Achievements
            </h3>
            <p className="text-xs text-(--text-secondary) font-medium">
              Earn badges as you cook more!
            </p>
          </div>
          <div className="bg-(--input-bg) p-3 rounded-2xl text-center border border-(--border-color) min-w-[100px]">
            <div className="text-[9px] uppercase font-bold text-(--text-secondary) tracking-widest mb-0.5">
              Total Cooked
            </div>
            <div className="text-2xl font-black text-(--accent-emerald)">
              {progressLoading ? "…" : progress.totalCooked}
            </div>
          </div>
        </div>

        <div className="bg-(--input-bg) p-4 rounded-2xl border border-(--border-color) mb-6">
          {progressLoading ? (
            <div className="text-center py-2 text-(--muted) animate-pulse text-xs">
              Calculating progress…
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-(--text-primary)">
                  Next milestone: {progress.nextMilestone} recipes
                </span>
                <span className="text-[10px] font-bold text-(--accent-emerald) bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {progress.progressToNext}/15 ({progress.progressPercent}%)
                </span>
              </div>

              <div className="h-3 bg-(--border-color) rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-(--text-secondary) font-medium italic">
                You've spent <b className="text-(--text-primary)">{progress.totalMinutes}</b> minutes in the kitchen.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((b) => {
            const unlocked = progress.earnedBadges.some((x) => x.key === b.key);
            const Icon = BADGE_ICONS[b.key] || Award;

            return (
              <BadgeCard
                key={b.key}
                IconComponent={Icon}
                title={b.name}
                unlocked={unlocked}
                subtitle={`Unlock at ${b.at}`}
              />
            );
          })}
        </div>
      </div>

      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm p-6 border border-(--card-surface-border) transition-all">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-(--text-primary) flex items-center gap-2">
              <Camera className="text-emerald-500" size={20} /> My Gallery
            </h3>
          </div>
          <span className="text-[10px] font-bold text-(--text-secondary) bg-(--input-bg) px-2 py-1 rounded-full border border-(--border-color)">
            {images.length} Photos
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-(--muted) text-sm">
            Loading... ⏳
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm border-2 border-(--border-color) bg-(--input-bg) hover:shadow-md transition-all"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || "My Dish"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 bg-(--card-bg) text-red-500 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow hover:bg-red-500 hover:text-white z-20"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-(--border-color) rounded-3xl flex flex-col items-center justify-center p-8 text-(--text-secondary) bg-(--input-bg)">
            <p className="text-sm font-bold italic">Gallery is empty</p>
          </div>
        )}
      </div>
    </section>
  );
}
