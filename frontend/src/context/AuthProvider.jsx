/**
 * Authentication Provider
 * 
 * Manages user authentication state and provides auth methods to the app.
 * 
 * Features:
 * - User registration and login
 * - Token management (localStorage)
 * - Auto-login on page load
 * - Error handling for auth operations
 * - View mode switching (child/parent)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthContext provider
 */

import { useMemo, useState, useEffect } from "react";
import { AuthContext } from "./auth.context.js";
import { API_CONFIG } from "../config/api.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("child");
  const [error, setError] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  function getErrorMessage(err, fallback) {
    // Fetch error -> server response data (already parsed)
    const data = err?.responseData;

    // Case 1: backend sent a plain string: res.status(...).send("...")
    if (typeof data === "string" && data.trim()) return data;

    // Case 2: backend sent JSON: { message: "..." } or { error: "..." }
    if (data && typeof data === "object") {
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }

    // Case 3: network / fetch message
    if (typeof err?.message === "string" && err.message.trim())
      return err.message;

    return fallback;
  }

  /**
   * Register a new user account
   * @param {Object} userData - Registration data
   * @param {string} userData.username - Unique username
   * @param {string} userData.password - User password
   * @param {string} userData.name - User's display name
   * @param {string[]} userData.allergens - List of allergens
   * @param {string} userData.cookingLevel - Initial cooking level
   * @param {string} [userData.parentPin] - Optional 4-digit parent PIN
   * @returns {Promise<boolean>} True if registration successful
   */
  async function register({
    username,
    password,
    name,
    allergens,
    cookingLevel,
    parentPin,
  }) {
    try {
      setError(null);
      setIsAuthLoading(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          name,
          allergens,
          cookingLevel,
          ...(parentPin && parentPin.trim().length === 4 ? { parentPin: parentPin.trim() } : {}),
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            errorData = await response.json();
          } else {
            errorData = await response.text();
          }
        } catch {
          errorData = null;
        }
        const error = new Error(`Request failed: ${response.status}`);
        error.responseData = errorData;
        throw error;
      }

      const data = await response.json();
      const token = data.token;
      const userFromServer = data.user ?? data;

      localStorage.setItem("token", token);
      setUser({ ...userFromServer, token });

      setViewMode("child");
      return true;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "An error occurred during registration. Please try again."
      );
      setError(message);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }

  /**
   * Authenticate user and create session
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<boolean>} True if login successful
   */
  async function login(username, password) {
    try {
      setError(null);
      setIsAuthLoading(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            errorData = await response.json();
          } else {
            errorData = await response.text();
          }
        } catch {
          errorData = null;
        }
        const error = new Error(`Request failed: ${response.status}`);
        error.responseData = errorData;
        throw error;
      }

      const data = await response.json();
      const token = data.token;
      const userFromServer = data.user ?? data;

      localStorage.setItem("token", token);
      setUser({ ...userFromServer, token });

      setViewMode("child");
      return true;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Wrong username or password. Please try again."
      );
      setError(message);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }

  /**
   * Logout current user and clear session
   */
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

        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        const u = data?.user ?? data;
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
