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
  const [validationErrors, setValidationErrors] = useState({});

  function validateField(name, value) {
    const errors = { ...validationErrors };
    
    if (name === "username") {
      if (!value.trim()) {
        errors.username = "Username is required";
      } else if (value.trim().length < 3) {
        errors.username = "Username must be at least 3 characters";
      } else {
        delete errors.username;
      }
    }
    
    if (name === "password") {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else {
        delete errors.password;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const isUsernameValid = validateField("username", username);
    const isPasswordValid = validateField("password", password);
    
    if (!isUsernameValid || !isPasswordValid) {
      return;
    }
    
    setIsSubmitting(true);
    const ok = await login(username, password);
    setIsSubmitting(false);
    if (ok) navigate("/");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 bg-(--bg-current)">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/30 rounded-full blur-[120px] animate-pulse" />

      <button
        onClick={toggleTheme}
        type="button"
        className="fixed top-6 right-6 p-3 rounded-2xl border shadow-lg hover:scale-110 transition-all z-50 bg-(--toggle-bg) border-(--toggle-border) text-(--toggle-icon)"
      >
        {isDarkMode ? (
          <Sun size={22} className="transition-transform hover:rotate-45" />
        ) : (
          <Moon size={22} className="transition-transform hover:-rotate-12" />
        )}
      </button>

      <section className="w-full max-w-md backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 space-y-8 animate-fade-in relative z-10 border border-(--card-surface-border) bg-(--card-surface) shadow-xl transition-all duration-500">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500/10 text-(--accent-emerald) rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 backdrop-blur-sm">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-(--text-primary) tracking-tight">
            Welcome <span className="text-(--accent-emerald)">Back!</span>
          </h2>
          <p className="text-sm text-(--text-secondary) font-medium">
            Ready to cook something yummy today?
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 opacity-60">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
                <User size={18} />
              </span>
              <input
                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-(--text-primary) placeholder:text-(--text-secondary) placeholder:opacity-30 bg-(--input-bg) border-2 ${
                  validationErrors.username ? "border-red-500" : "border-(--border-color)"
                }`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    validateField("username", e.target.value);
                  }
                }}
                onBlur={(e) => validateField("username", e.target.value)}
                placeholder="Your chef name"
                required
              />
              {validationErrors.username && (
                <p className="text-xs text-red-500 mt-1 ml-2">{validationErrors.username}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 opacity-60">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-(--text-primary) placeholder:text-(--text-secondary) placeholder:opacity-30 bg-(--input-bg) border-2 ${
                  validationErrors.password ? "border-red-500" : "border-(--border-color)"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    validateField("password", e.target.value);
                  }
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                placeholder="••••••••"
                required
              />
              {validationErrors.password && (
                <p className="text-xs text-red-500 mt-1 ml-2">{validationErrors.password}</p>
              )}
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

            <p className="text-xs font-bold text-(--text-secondary)">
              Not a chef yet?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-(--accent-emerald) hover:underline font-black transition-colors"
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
