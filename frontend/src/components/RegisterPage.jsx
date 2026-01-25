import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext";
import {
  UserPlus,
  User,
  Lock,
  ShieldCheck,
  ChefHat,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";

const ALLERGEN_OPTIONS = [
  { key: "milk", label: "Milk", icon: "🥛" },
  { key: "eggs", label: "Eggs", icon: "🥚" },
  { key: "nuts", label: "Nuts", icon: "🥜" },
  { key: "soy", label: "Soy", icon: "🫘" },
  { key: "wheat", label: "Wheat", icon: "🌾" },
  { key: "fish", label: "Fish", icon: "🐟" },
  { key: "sesame", label: "Sesame", icon: "🥯" },
];

export default function RegisterPage() {
  const { register, error, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cookingLevel, setCookingLevel] = useState("Easy");
  const [parentPin, setParentPin] = useState("");
  const [allergens, setAllergens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password) return;

    setIsSubmitting(true);
    const ok = await register({
      username: username.trim(),
      password,
      name: name.trim(),
      cookingLevel,
      allergens,
      parentPin,
    });
    setIsSubmitting(false);
    if (ok) navigate("/");
  }

  function toggleAllergen(key) {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  }

  function handlePinChange(e) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setParentPin(val);
  }

  const isDisabled =
    isSubmitting ||
    isAuthLoading ||
    !name.trim() ||
    !username.trim() ||
    !password;

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 
        ${isDarkMode ? "bg-[#030712]" : "bg-slate-50"}`}
      style={{ colorScheme: isDarkMode ? "dark" : "light" }}
    >
      {/* אלמנטים זוהרים ברקע (Blobs) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />

      {/* כפתור מצבים צף */}
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

      {/* כרטיס המודאל (Glass Card) */}
      <section
        className={`w-full max-w-lg backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 space-y-8 animate-fade-in relative z-10 border transition-all duration-500
        ${
          isDarkMode
            ? "!bg-white/[0.03] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            : "!bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        }`}
      >
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 backdrop-blur-sm">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Join the <span className="text-emerald-500">Kitchen!</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed opacity-80">
            Create your profile and start your yummy cooking adventure.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 opacity-60">
                Chef Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-[var(--text-primary)] placeholder:opacity-30
                    bg-white/40 border-slate-200/50 dark:bg-white/5 dark:border-white/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 opacity-60">
                Username
              </label>
              <input
                placeholder="CoolChef123"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-[var(--text-primary)] placeholder:opacity-30
                  bg-white/40 border-slate-200/50 dark:bg-white/5 dark:border-white/10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 opacity-60">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-[var(--text-primary)] placeholder:opacity-30
                    bg-white/40 border-slate-200/50 dark:bg-white/5 dark:border-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent PIN */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest ml-2 flex items-center gap-1">
                <ShieldCheck size={12} /> Parent PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-black focus:border-amber-400 focus:outline-none transition-all text-[var(--text-primary)] tracking-[0.3em] placeholder:tracking-normal
                  bg-amber-500/5 border-amber-500/20 dark:border-amber-500/10"
                value={parentPin}
                onChange={handlePinChange}
              />
            </div>

            {/* Cooking Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 flex items-center gap-1 opacity-60">
                <ChefHat size={12} /> Level
              </label>
              <select
                value={cookingLevel}
                onChange={(e) => setCookingLevel(e.target.value)}
                style={{ colorScheme: isDarkMode ? "dark" : "light" }}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all cursor-pointer text-[var(--text-primary)]
                  bg-white/40 border-slate-200/50 dark:bg-white/5 dark:border-white/10 appearance-none"
              >
                <option value="Easy">Easy Peasy</option>
                <option value="Medium">Medium Chef</option>
                <option value="Advanced">Master Chef</option>
              </select>
            </div>
          </div>

          {/* Allergens Grid */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 flex items-center gap-1 opacity-60">
              <AlertCircle size={12} /> Allergens
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleAllergen(a.key)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                    allergens.includes(a.key)
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "bg-white/20 border-white/40 dark:border-white/5 text-[var(--text-secondary)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="text-xl mb-1">{a.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-bounce-in flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit & Footer */}
          <div className="space-y-4 text-center">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-30 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? "Creating Profile..." : "Start Cooking Now!"}
            </button>

            <p className="text-xs font-bold text-[var(--text-secondary)]">
              Already a chef?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-black transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
