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
    <header className="sticky top-0 z-50 h-20 w-full bg-[var(--header-bg)] shadow-md border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <Brand onClick={() => navigate("/")} />
        </div>

        <div className="hidden lg:block flex-1 px-4">
          <TopNav />
        </div>

        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <div className="hidden sm:block">
            <AuthArea />
          </div>

          <button
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none shadow-sm group
             bg-slate-900/10 text-slate-700 hover:bg-slate-900/20 
             dark:bg-white/10 dark:text-yellow-400 dark:border dark:border-white/20 dark:hover:bg-white/20 
             dark:shadow-lg dark:shadow-yellow-500/10"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun
                size={20}
                strokeWidth={2.5}
                className="drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
              />
            ) : (
              <Moon
                size={20}
                strokeWidth={2.5}
                className="group-hover:-rotate-12 transition-transform"
              />
            )}
          </button>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-20 left-0 w-full transition-all duration-500 ease-in-out overflow-hidden border-b ${
          isMenuOpen
            ? "max-h-[600px] opacity-100 shadow-xl pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        } 
  !bg-white/30 dark:!bg-black/40 backdrop-blur-3xl border-white/40 dark:border-white/10`}
      >
        <nav className="flex flex-col p-8 gap-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -z-10"></div>
          <Link
            to="/"
            onClick={closeMenu}
            className="text-lg font-bold text-slate-700 dark:text-slate-200"
          >
            Home
          </Link>
          <Link
            to="/recipes"
            onClick={closeMenu}
            className="text-lg font-bold text-slate-700 dark:text-slate-200"
          >
            Recipes
          </Link>
          <Link
            to="/favorites"
            onClick={closeMenu}
            className="text-lg font-bold text-slate-700 dark:text-slate-200"
          >
            My Favorites
          </Link>
          <Link
            to="/games"
            onClick={closeMenu}
            className="text-lg font-bold text-slate-700 dark:text-slate-200"
          >
            Games
          </Link>
          <Link
            to="/progress"
            onClick={closeMenu}
            className="text-lg font-bold text-slate-700 dark:text-slate-200"
          >
            My Profile
          </Link>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

          <Link
            to="/parent-dashboard"
            onClick={closeMenu}
            className="text-lg font-bold text-amber-600 dark:text-amber-400"
          >
            Parent Dashboard
          </Link>

          <div className="flex items-center gap-2 lg:gap-4 text-[var(--text-primary)]">
            <AuthArea />
          </div>
        </nav>
      </div>
    </header>
  );
}
