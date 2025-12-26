import { createContext, useMemo, useState } from "react";
import { Axios } from "../Axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("child");
  const [error, setError] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // function getErrorMessage(err, fallback) {
  //   const errorMessage =
  //     typeof err?.response?.data === "string" && err.response.data;
  //   return (
  //     errorMessage || err?.response?.data?.error || err?.message || fallback
  //   );
  // }
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

  async function register({ username, password, name }) {
    try {
      setError(null);
      setIsAuthLoading(true);

      const response = await Axios.post("/auth/register", {
        username,
        password,
        name,
      });

      localStorage.setItem("token", response.data.token);

      setUser(response.data?.user ?? response.data);

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

      localStorage.setItem("token", response.data.token);
      setUser(response.data?.user ?? response.data);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
