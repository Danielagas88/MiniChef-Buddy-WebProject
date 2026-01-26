/**
 * useAuth Hook
 * 
 * Provides access to authentication context.
 * Must be used within an AuthProvider component.
 * 
 * @returns {Object} Auth context containing:
 *   - user: Current user object or null
 *   - login: Login function
 *   - register: Registration function
 *   - logout: Logout function
 *   - error: Auth error message
 *   - isAuthLoading: Loading state
 *   - viewMode: Current view mode (child/parent)
 *   - setViewMode: Function to change view mode
 * 
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth();
 */
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.js";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
