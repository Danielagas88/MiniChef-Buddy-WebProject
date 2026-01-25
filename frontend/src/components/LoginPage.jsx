import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext";
import { LogIn, User, Lock, Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await login(username, password);
    setIsSubmitting(false);
    if (ok) navigate("/");
  }

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 
        ${isDarkMode ? "bg-[#030712]" : "bg-slate-50"}`}
      style={{ colorScheme: isDarkMode ? "dark" : "light" }}
    >
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/30 dark:bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/30 dark:bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />

      <button
        onClick={toggleTheme}
        type="button"
        className="fixed top-6 right-6 p-3 rounded-2xl backdrop-blur-md border shadow-xl hover:scale-110 transition-all z-50 group
          bg-white/40 border-white/40 text-[var(--text-primary)]
          dark:bg-white/10 dark:border-white/10 dark:text-yellow-400"
      >
        {isDarkMode ? (
          <Sun
            size={22}
            className="group-hover:rotate-45 transition-transform"
          />
        ) : (
          <Moon
            size={22}
            className="group-hover:-rotate-12 transition-transform"
          />
        )}
      </button>

      <section
        className={`w-full max-w-md backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 space-y-8 animate-fade-in relative z-10 border transition-all duration-500
        ${
          isDarkMode
            ? "!bg-white/[0.03] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            : "!bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        }`}
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 backdrop-blur-sm">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Welcome <span className="text-emerald-500">Back!</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            Ready to cook something yummy today?
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 opacity-60">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-30
                  bg-white/40 border-slate-200/50
                  dark:bg-white/5 dark:border-white/10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your chef name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 opacity-60">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-30
                  bg-white/40 border-slate-200/50
                  dark:bg-white/5 dark:border-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-bounce-in flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 space-y-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? "Opening the Kitchen..." : "Login to Profile"}
            </button>

            <p className="text-xs font-bold text-[var(--text-secondary)]">
              Not a chef yet?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-black transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
