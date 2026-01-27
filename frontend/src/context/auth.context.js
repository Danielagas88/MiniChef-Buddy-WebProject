/**
 * AuthContext
 *
 * React context for authentication state. Provided by AuthProvider.
 * Consumers use useAuth() to access user, login, register, logout.
 *
 * @module context/auth.context
 */
import { createContext } from "react";

export const AuthContext = createContext(null);
