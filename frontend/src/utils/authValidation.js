/**
 * Auth validation (functionality)
 *
 * Pure validation functions for login and register forms. Used by useLoginForm
 * and useRegisterForm so components stay presentation-only.
 *
 * @module utils/authValidation
 */

/**
 * Validate a single login field. Pure function, no side effects.
 * @param {string} name - Field name: "username" | "password"
 * @param {string} value - Current value
 * @returns {string | null} Error message or null if valid
 */
export function validateLoginField(name, value) {
  if (name === "username") {
    if (!value?.trim()) return "Username is required";
    if (value.trim().length < 3) return "Username must be at least 3 characters";
    return null;
  }
  if (name === "password") {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  }
  return null;
}

/**
 * Validate a single register field. Pure function, no side effects.
 * @param {string} name - Field name: "name" | "username" | "password" | "parentPin"
 * @param {string} value - Current value
 * @returns {string | null} Error message or null if valid
 */
export function validateRegisterField(name, value) {
  if (name === "name") {
    if (!value?.trim()) return "Name is required";
    return null;
  }
  if (name === "username") {
    if (!value?.trim()) return "Username is required";
    if (value.trim().length < 3) return "Username must be at least 3 characters";
    if (!/^[a-z0-9_]+$/i.test(value.trim()))
      return "Username can only contain letters, numbers, and underscores";
    return null;
  }
  if (name === "password") {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  }
  if (name === "parentPin") {
    if (value && value.length !== 4) return "PIN must be exactly 4 digits";
    return null;
  }
  return null;
}
