/**
 * Header
 *
 * App header: logo/brand, navigation links, theme toggle, and auth area.
 * Shown on all authenticated routes.
 *
 * @component
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Brand from "./Brand.jsx";
import TopNav from "./TopNav.jsx";
import AuthArea from "./AuthArea.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-(--header-bg) shadow-md border-b border-(--border-color) transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="shrink-0">
          <Brand onClick={() => navigate("/")} />
        </div>

        <div className="hidden lg:block flex-1 px-4">
          <TopNav />
        </div>

        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          <div className="hidden sm:block">
            <AuthArea />
          </div>

          <button
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none shadow-sm border border-(--toggle-border) bg-(--toggle-bg) text-(--toggle-icon) hover:opacity-90"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun size={20} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
            ) : (
              <Moon size={20} strokeWidth={2.5} className="transition-transform hover:-rotate-12" />
            )}
          </button>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-(--text-primary) rounded-lg hover:bg-(--input-bg) transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-20 left-0 w-full transition-all duration-500 ease-in-out overflow-hidden border-b border-(--border-color) bg-(--card-bg) ${
          isMenuOpen
            ? "max-h-[600px] opacity-100 shadow-xl pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-8 gap-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -z-10" />
          <Link to="/" onClick={closeMenu} className="text-lg font-bold text-(--text-primary)">
            Home
          </Link>
          <Link to="/recipes" onClick={closeMenu} className="text-lg font-bold text-(--text-primary)">
            Recipes
          </Link>
          <Link to="/favorites" onClick={closeMenu} className="text-lg font-bold text-(--text-primary)">
            My Favorites
          </Link>
          <Link to="/games" onClick={closeMenu} className="text-lg font-bold text-(--text-primary)">
            Games
          </Link>
          <Link to="/progress" onClick={closeMenu} className="text-lg font-bold text-(--text-primary)">
            My Profile
          </Link>

          <div className="h-px bg-(--border-color) my-1" />

          <Link
            to="/parent-dashboard"
            onClick={closeMenu}
            className="text-lg font-bold text-(--accent-amber)"
          >
            Parent Dashboard
          </Link>

          <div className="flex items-center gap-2 lg:gap-4 text-(--text-primary)">
            <AuthArea />
          </div>
        </nav>
      </div>
    </header>
  );
}
