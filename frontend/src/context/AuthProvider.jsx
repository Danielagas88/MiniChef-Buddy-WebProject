import { useMemo, useState, useEffect } from "react";
import { Axios } from "../Axios";
import { AuthContext } from "./auth.context.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("child");
  const [error, setError] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  function getErrorMessage(err, fallback) {
    // Axios error -> server response
    const data = err?.response?.data;

    // Case 1: backend sent a plain string: res.status(...).send("...")
    if (typeof data === "string" && data.trim()) return data;

    // Case 2: backend sent JSON: { message: "..." } or { error: "..." }
    if (data && typeof data === "object") {
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }

    // Case 3: network / axios message
    if (typeof err?.message === "string" && err.message.trim())
      return err.message;

    return fallback;
  }

  async function register({
    username,
    password,
    name,
    allergens,
    cookingLevel,
  }) {
    try {
      setError(null);
      setIsAuthLoading(true);

      const response = await Axios.post("/auth/register", {
        username,
        password,
        name,
        allergens,
        cookingLevel,
      });

      const token = response.data.token;
      const userFromServer = response.data.user ?? response.data;

      localStorage.setItem("token", token);
      setUser({ ...userFromServer, token });

      setViewMode("child");
      return true;
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "An error occurred during registration. Please try again."
        )
      );
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function login(username, password) {
    try {
      setError(null);
      setIsAuthLoading(true);

      const response = await Axios.post("/auth/login", { username, password });

      const token = response.data.token;
      const userFromServer = response.data.user ?? response.data;

      localStorage.setItem("token", token);
      setUser({ ...userFromServer, token });

      setViewMode("child");
      return true;
    } catch (err) {
      setError(
        getErrorMessage(err, "Wrong username or password. Please try again.")
      );
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setViewMode("child");
    setError(null);
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      viewMode,
      setViewMode,
      login,
      register,
      logout,
      error,
      isAuthLoading,
    }),
    [user, viewMode, error, isAuthLoading]
  );

  useEffect(() => {
    let alive = true;

    async function hydrate() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setIsAuthLoading(true);

        const res = await Axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data?.user ?? res.data;
        if (alive && u) setUser({ ...u, token });
      } catch {
        localStorage.removeItem("token");
        if (alive) setUser(null);
      } finally {
        if (alive) setIsAuthLoading(false);
      }
    }

    hydrate();
    return () => {
      alive = false;
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
