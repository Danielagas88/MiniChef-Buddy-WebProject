import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export const ALLERGEN_OPTIONS = [
  { key: "milk", label: "Milk" },
  { key: "eggs", label: "Eggs" },
  { key: "nuts", label: "Nuts" },
  { key: "soy", label: "Soy" },
  { key: "wheat", label: "Wheat / Gluten" },
  { key: "fish", label: "Fish" },
  { key: "sesame", label: "Sesame" },
];

export default function RegisterPage() {
  const { register, error, isAuthLoading } = useAuth();

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cookingLevel, setCookingLevel] = useState("Easy");
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
    });

    setIsSubmitting(false);

    if (ok) {
      navigate("/");
    }
  }

  function toggleAllergen(key) {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }

  const isDisabled =
    isSubmitting ||
    isAuthLoading ||
    !name.trim() ||
    !username.trim() ||
    !password;

  return (
    <section className="max-w-md mx-auto bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Register to MiniChef Buddy
      </h2>
      <p className="text-sm text-gray-700">
        Register to create a personal profile, level up your cooking skills, and
        earn fun badges!
      </p>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-semibold text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-xs font-semibold text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">
            Cooking Level
          </label>
          <select
            value={cookingLevel}
            onChange={(e) => setCookingLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">
            Allergens to avoid
          </p>

          <div className="grid grid-cols-2 gap-2">
            {ALLERGEN_OPTIONS.map((a) => (
              <label
                key={a.key}
                className="flex items-center gap-2 text-xs text-gray-700 bg-white/70 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={allergens.includes(a.key)}
                  onChange={() => toggleAllergen(a.key)}
                />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full mt-2 text-sm bg-pink-500 text-white px-3 py-2 rounded-full shadow hover:bg-pink-600 disabled:opacity-60"
        >
          {isSubmitting || isAuthLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
}
