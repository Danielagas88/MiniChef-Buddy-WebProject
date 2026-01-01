import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import {
  UserPlus,
  User,
  Lock,
  ShieldCheck,
  ChefHat,
  AlertCircle,
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
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-6">
      <section className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-emerald-50 p-8 md:p-10 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Join the <span className="text-emerald-600">Kitchen!</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
            Create your profile and start your yummy cooking adventure.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Chef Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-400 focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Username & Password Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Username
                </label>
                <input
                  placeholder="CoolChef123"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-400 focus:outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-400 focus:outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parent PIN - Safety Color (Amber) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 flex items-center gap-1">
                <ShieldCheck size={12} /> Parent Security PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit secret code"
                className="w-full px-4 py-3 bg-amber-50/50 border-2 border-amber-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-amber-400 focus:outline-none transition-all tracking-[0.3em] placeholder:tracking-normal"
                value={parentPin}
                onChange={handlePinChange}
              />
            </div>

            {/* Cooking Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <ChefHat size={12} /> Starting Level
              </label>
              <select
                value={cookingLevel}
                onChange={(e) => setCookingLevel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-400 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Easy">Easy Peasy</option>
                <option value="Medium">Medium Chef</option>
                <option value="Advanced">Master Chef</option>
              </select>
            </div>

            {/* Allergens Grid */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> Allergens to avoid
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALLERGEN_OPTIONS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => toggleAllergen(a.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                      allergens.includes(a.key)
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <span className="text-base">{a.icon}</span>
                    <span className="text-[11px] font-bold">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-2xl border border-red-100 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4 text-center">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Profile..." : "Start Cooking Now!"}
            </button>

            <p className="text-xs font-bold text-slate-400">
              Already a chef?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-emerald-600 hover:underline font-black cursor-pointer"
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
