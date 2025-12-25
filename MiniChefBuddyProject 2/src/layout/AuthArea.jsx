import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function AuthArea() {
  const navigate = useNavigate();
  const { user, viewMode, setViewMode, logout } = useAuth();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="text-xs md:text-sm bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600"
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-full shadow-sm px-3 py-2">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
        {user.childName?.[0] || "👧"}
      </div>

      {/* Name + mode */}
      <div className="hidden md:flex flex-col leading-tight">
        <span className="text-sm font-semibold text-gray-800">
          {user.childName}
        </span>
        <span className="text-[11px] text-gray-500">
          Mode: <span className="font-medium">{viewMode}</span>
        </span>
      </div>

      {/* Segmented control */}
      <div className="flex items-center bg-gray-100 rounded-full p-1">
        <button
          type="button"
          onClick={() => setViewMode("child")}
          className={`px-3 py-1 text-[11px] rounded-full transition ${
            viewMode === "child"
              ? "bg-pink-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Child
        </button>
        <button
          type="button"
          onClick={() => setViewMode("parent")}
          className={`px-3 py-1 text-[11px] rounded-full transition ${
            viewMode === "parent"
              ? "bg-purple-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Parent
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-300"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
}
