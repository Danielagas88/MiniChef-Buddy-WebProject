import { useAuth } from "../hooks/useAuth.js";

export default function AuthArea() {
  const { user, logout, setUser } = useAuth();

  if (!user) return null;

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full pl-2 pr-5 py-1.5 border border-emerald-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-slate-800 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-white">
          {user.name?.[0]?.toUpperCase() || "C"}
        </div>

        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-700">{user.name}</span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full w-fit">
            {user.cookingLevel || "Beginner"} Chef
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 mx-1"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
}
