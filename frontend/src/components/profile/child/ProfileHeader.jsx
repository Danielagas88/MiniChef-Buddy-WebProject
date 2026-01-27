/**
 * ProfileHeader
 *
 * Child profile header: user info, avatar, name, and cooking level selector.
 * Saves level via userService.updateMyCookingLevel. Used in ChildProfile.
 *
 * @param {Object} props
 * @param {Object} props.user - Current user (name, cookingLevel, token)
 * @param {Function} props.setUser - Called to update user in auth context
 *
 * @component
 */
import { useState, useEffect } from "react";
import { updateMyCookingLevel } from "../../../services/userService.js";

export default function ProfileHeader({ user, setUser }) {
  const [level, setLevel] = useState(user?.cookingLevel || "Easy");
  const [savingLevel, setSavingLevel] = useState(false);

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

  return (
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
              aria-label="Select cooking level"
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
            aria-label="Update cooking level"
          >
            {savingLevel ? "Saving..." : "Update Level"}
          </button>
        </div>
      </div>
    </div>
  );
}
