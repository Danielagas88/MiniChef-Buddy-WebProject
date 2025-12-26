import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function RegisterPage() {
  const { register, error, isAuthLoading } = useAuth();

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !password) return;

    setIsSubmitting(true);
    const ok = await register({
      username: username.trim(),
      password,
      name: name.trim(),
    });
    setIsSubmitting(false);

    if (ok) {
      navigate("/");
    }
  }

  const isDisabled =
    isSubmitting || isAuthLoading || !name.trim() || !username.trim() || !password;

  return (
    <section className="max-w-md mx-auto bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Register to MiniChef Buddy
      </h2>
      <p className="text-sm text-gray-700">
        Register to see the child&apos;s cooking profile and the parent report.
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
