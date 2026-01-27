/**
 * useRegisterForm (functionality)
 *
 * Owns register form state, validation, allergens, PIN, and submit. Keeps
 * RegisterPage presentational. Validation rules live in utils/authValidation.js.
 *
 * @returns {Object} Form state and handlers for the register UI
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth.js";
import { validateRegisterField } from "../utils/authValidation.js";

const PIN_MAX_LENGTH = 4;

export function useRegisterForm() {
  const { register, error, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cookingLevel, setCookingLevel] = useState("Easy");
  const [parentPin, setParentPin] = useState("");
  const [allergens, setAllergens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const err = validateRegisterField(name, value);
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
      const okName = validateField("name", name);
      const okUser = validateField("username", username);
      const okPass = validateField("password", password);
      const okPin = parentPin ? validateField("parentPin", parentPin) : true;
      if (!okName || !okUser || !okPass || !okPin) return;

      setIsSubmitting(true);
      const ok = await register({
        username: username.trim(),
        password,
        name: name.trim(),
        cookingLevel,
        allergens,
        parentPin,
      });
      setIsSubmitting(false);
      if (ok) navigate("/");
    },
    [name, username, password, parentPin, cookingLevel, allergens, register, navigate, validateField]
  );

  const toggleAllergen = useCallback((key) => {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }, []);

  const handlePinChange = useCallback((e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH);
    setParentPin(val);
  }, []);

  const isDisabled =
    isSubmitting ||
    isAuthLoading ||
    !name.trim() ||
    !username.trim() ||
    !password;

  return {
    username,
    setUsername,
    password,
    setPassword,
    name,
    setName,
    cookingLevel,
    setCookingLevel,
    parentPin,
    setParentPin,
    allergens,
    isSubmitting,
    validationErrors,
    error,
    validateField,
    handleSubmit,
    toggleAllergen,
    handlePinChange,
    isDisabled,
    navigate,
  };
}
