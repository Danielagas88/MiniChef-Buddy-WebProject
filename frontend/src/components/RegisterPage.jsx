/**
 * RegisterPage 
 *
 * Registration form UI: layout, styling, and wiring of useRegisterForm.
 * Validation, submit, allergens, and PIN logic live in useRegisterForm
 * and utils/authValidation; options live in constants/allergenOptions.
 *
 * @component
 */
import { useTheme } from "../context/ThemeContext";
import { useRegisterForm } from "../hooks/useRegisterForm.js";
import { ALLERGEN_OPTIONS } from "../constants/allergenOptions.js";
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

export default function RegisterPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    username,
    setUsername,
    password,
    setPassword,
    name,
    setName,
    cookingLevel,
    setCookingLevel,
    parentPin,
    validationErrors,
    error,
    validateField,
    handleSubmit,
    toggleAllergen,
    handlePinChange,
    isDisabled,
    isSubmitting,
    allergens,
    navigate,
  } = useRegisterForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 bg-(--bg-current)">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />

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

      <section className="w-full max-w-lg backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 space-y-8 animate-fade-in relative z-10 border border-(--card-surface-border) bg-(--card-surface) shadow-xl transition-all duration-500">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-500/10 text-(--accent-amber) rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 backdrop-blur-sm">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-(--text-primary) tracking-tight">
            Join the <span className="text-(--accent-emerald)">Kitchen!</span>
          </h2>
          <p className="text-sm text-(--text-secondary) font-medium leading-relaxed opacity-80">
            Create your profile and start your yummy cooking adventure.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 opacity-60">
                Chef Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
                  <User size={18} />
                </span>
                <input
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-(--text-primary) placeholder:opacity-30 bg-(--input-bg) border-2 border-(--border-color)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 opacity-60">
                Username
              </label>
              <input
                placeholder="CoolChef123"
                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-(--text-primary) placeholder:opacity-30 bg-(--input-bg) border-2 ${
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
                required
              />
              {validationErrors.username && (
                <p className="text-xs text-red-500 mt-1 ml-2">{validationErrors.username}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 opacity-60">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all text-(--text-primary) placeholder:opacity-30 bg-(--input-bg) border-2 border-(--border-color)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-(--accent-amber) uppercase tracking-widest ml-2 flex items-center gap-1">
                <ShieldCheck size={12} /> Parent PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-black focus:border-amber-400 focus:outline-none transition-all text-(--text-primary) tracking-[0.3em] placeholder:tracking-normal bg-amber-500/5 border-2 ${
                  validationErrors.parentPin ? "border-red-500" : "border-amber-500/20"
                }`}
                value={parentPin}
                onChange={(e) => {
                  handlePinChange(e);
                  if (validationErrors.parentPin && e.target.value.length === 4) {
                    validateField("parentPin", e.target.value);
                  }
                }}
                onBlur={(e) => {
                  if (parentPin) validateField("parentPin", parentPin);
                }}
              />
              {validationErrors.parentPin && (
                <p className="text-xs text-red-500 mt-1 ml-2">{validationErrors.parentPin}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 flex items-center gap-1 opacity-60">
                <ChefHat size={12} /> Level
              </label>
              <select
                value={cookingLevel}
                onChange={(e) => setCookingLevel(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:border-emerald-400 focus:outline-none transition-all cursor-pointer text-(--text-primary) bg-(--input-bg) border-2 border-(--border-color) appearance-none"
              >
                <option value="Easy">Easy Peasy</option>
                <option value="Medium">Medium Chef</option>
                <option value="Advanced">Master Chef</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest ml-2 flex items-center gap-1 opacity-60">
              <AlertCircle size={12} /> Allergens
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleAllergen(a.key)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                    allergens.includes(a.key)
                      ? "bg-emerald-500/20 border-emerald-500 text-(--accent-emerald) shadow-sm"
                      : "bg-(--input-bg) border-(--border-color) text-(--text-secondary) opacity-60 hover:opacity-100"
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

          {error && (
            <div className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-bounce-in flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 text-center">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-30 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? "Creating Profile..." : "Start Cooking Now!"}
            </button>

            <p className="text-xs font-bold text-(--text-secondary)">
              Already a chef?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-(--accent-emerald) hover:underline font-black transition-colors"
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
