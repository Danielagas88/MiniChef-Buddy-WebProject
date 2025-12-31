import { useAuth } from "../hooks/useAuth.js";

export default function AuthArea() {
  const { user, logout, setUser } = useAuth();

  if (!user) return null;

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-full pl-2 pr-4 py-1.5 border border-white/60 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          {user.name?.[0]?.toUpperCase() || "C"}
        </div>
        <div className="hidden md:flex flex-col leading-none">
          <span className="text-sm font-bold text-gray-800">{user.name}</span>
          <span className="text-[10px] text-gray-500 font-medium">
            Level: {user.cookingLevel || "Beginner"}
          </span>
        </div>
      </div>

      <div className="h-5 w-px bg-gray-300 mx-1"></div>

      <button
        onClick={handleLogout}
        className="text-xs font-bold text-gray-500 hover:text-red-500 transition flex items-center gap-1"
        title="Logout"
      >
        <span>Logout</span>
        <span className="text-lg"></span>
      </button>
    </div>
  );
}
