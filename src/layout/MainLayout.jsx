import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { user, viewMode, setViewMode, logout } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-orange-100 font-sans">
      {/* HEADER */}
      <header className="bg-white bg-opacity-70 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo + title */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-xl">
              🍳
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-pink-700">
                MiniChef Buddy
              </h1>
              <p className="text-xs text-gray-500">
                Fun & safe cooking for kids with an AI buddy
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex gap-4 text-sm text-gray-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `pb-0.5 ${
                  isActive
                    ? "font-semibold text-pink-700 border-b-2 border-pink-500"
                    : "hover:text-pink-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                `pb-0.5 ${
                  isActive
                    ? "font-semibold text-pink-700 border-b-2 border-pink-500"
                    : "hover:text-pink-600"
                }`
              }
            >
              Recipes
            </NavLink>
            <NavLink
              to="/games"
              className={({ isActive }) =>
                `pb-0.5 ${
                  isActive
                    ? "font-semibold text-pink-700 border-b-2 border-pink-500"
                    : "hover:text-pink-600"
                }`
              }
            >
              Learning Games
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `pb-0.5 ${
                  isActive
                    ? "font-semibold text-pink-700 border-b-2 border-pink-500"
                    : "hover:text-pink-600"
                }`
              }
            >
              My Profile
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `pb-0.5 ${
                  isActive
                    ? "font-semibold text-pink-700 border-b-2 border-pink-500"
                    : "hover:text-pink-600"
                }`
              }
            >
              My Favorites
            </NavLink>
          </nav>

          {/* AUTH AREA */}
          <div className="flex items-center gap-2">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="text-xs md:text-sm bg-pink-500 text-white px-3 py-1.5 rounded-full shadow hover:bg-pink-600"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs text-gray-600">
                    Logged in as {user.childName}
                  </span>
                  <div className="flex items-center gap-1 justify-end text-[11px]">
                    <span className="text-gray-600">Viewing as:</span>
                    <button
                      type="button"
                      className={`px-2 py-0.5 rounded-full ${
                        viewMode === "child"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setViewMode("child")}
                    >
                      Child
                    </button>
                    <button
                      type="button"
                      className={`px-2 py-0.5 rounded-full ${
                        viewMode === "parent"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setViewMode("parent")}
                    >
                      Parent
                    </button>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs md:text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full shadow hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">{children}</main>
    </div>
  );
}
