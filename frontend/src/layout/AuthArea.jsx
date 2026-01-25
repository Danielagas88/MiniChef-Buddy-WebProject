import { useAuth } from "../hooks/useAuth.js";

export default function AuthArea() {
  const { user, logout, setUser } = useAuth();

  if (!user) return null;

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-3 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full pl-2 pr-4 md:pr-5 py-1.5 border border-emerald-100 dark:border-white/20 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-slate-800 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-white dark:border-slate-600">
          {user.name?.[0]?.toUpperCase() || "C"}
        </div>

        <div className="flex flex-col leading-tight min-w-[80px]">
          <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">
            {user.name}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-400/10 px-1.5 py-0.5 rounded-full w-fit transition-colors">
            {user.cookingLevel || "Beginner"} Chef
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-200 dark:bg-white/20 mx-1"></div>

      <button
        onClick={handleLogout}
        className="text-xs font-bold transition-colors flex items-center gap-1 text-[var(--text-primary)] sm:hover:text-red-500 dark:sm:hover:text-red-400"
        title="Logout"
      >
        <span>Logout</span>
      </button>
    </div>
  );
}
