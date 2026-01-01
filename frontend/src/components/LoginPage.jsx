import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LogIn, User, Lock } from "lucide-react";

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
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
    /* הוספת bg-slate-50 כדי "לדרוס" את הוורוד ולוודא שהרקע נקי */
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-6">
      {/* max-w-md הוא הרוחב הקלאסי (448px) - הוא לא יהיה מכווץ יותר */}
      <section className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-emerald-50 p-8 md:p-12 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm transition-transform hover:scale-110">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome <span className="text-emerald-600">Back!</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Ready to cook something yummy today? <br />
            Log in to your chef profile.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                placeholder="Your chef name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-400 focus:outline-none transition-all text-slate-700 shadow-inner"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-400 focus:outline-none transition-all text-slate-700 shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 animate-pulse flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="pt-2 space-y-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95 cursor-pointer transform hover:-translate-y-0.5"
            >
              {isSubmitting ? "Opening the Kitchen..." : "Login to Profile"}
            </button>

            <p className="text-xs font-bold text-slate-400">
              Not a chef yet?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-emerald-600 hover:underline cursor-pointer font-black"
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
