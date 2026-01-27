/**
 * AuthArea
 *
 * User avatar, name, and logout button in the header. Shown when user
 * is logged in.
 *
 * @component
 */
import { useAuth } from "../hooks/useAuth.js";

export default function AuthArea() {
  const { user, logout, setUser } = useAuth();

  if (!user) return null;

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-3 bg-(--card-bg) backdrop-blur-md rounded-full pl-2 pr-4 md:pr-5 py-1.5 border border-(--border-color) shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-(--text-primary) flex items-center justify-center font-bold text-sm shadow-inner border-2 border-(--border-color)">
          {user.name?.[0]?.toUpperCase() || "C"}
        </div>

        <div className="flex flex-col leading-tight min-w-[80px]">
          <span className="text-sm font-bold text-(--text-primary) transition-colors">
            {user.name}
          </span>
          <span className="text-[10px] text-(--accent-emerald) font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-full w-fit transition-colors border border-emerald-500/20">
            {user.cookingLevel || "Beginner"} Chef
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-(--border-color) mx-1" />

      <button
        onClick={handleLogout}
        className="text-xs font-bold transition-colors flex items-center gap-1 text-(--text-primary) hover:text-red-500"
        title="Logout"
      >
        <span>Logout</span>
      </button>
    </div>
  );
}
