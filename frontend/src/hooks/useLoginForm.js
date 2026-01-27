/**
 * useLoginForm (functionality)
 *
 * Owns login form state, validation, and submit. Keeps LoginPage presentational.
 * Validation rules live in utils/authValidation.js.
 *
 * @returns {Object} Form state and handlers for the login UI
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth.js";
import { validateLoginField } from "../utils/authValidation.js";

export function useLoginForm() {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const err = validateLoginField(name, value);
    setValidationErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
    return !err;
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const okUser = validateField("username", username);
      const okPass = validateField("password", password);
      if (!okUser || !okPass) return;

      setIsSubmitting(true);
      const ok = await login(username, password);
      setIsSubmitting(false);
      if (ok) navigate("/");
    },
    [username, password, login, navigate, validateField]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting,
    validationErrors,
    error,
    validateField,
    handleSubmit,
    navigate,
  };
}
