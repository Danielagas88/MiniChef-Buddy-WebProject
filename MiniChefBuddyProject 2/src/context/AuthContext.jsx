import { createContext, useMemo, useState } from "react";
import { Axios } from "../Axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("child");
  const [error, setError] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  function getErrorMessage(err, fallback) {
    const errorMessage =
      typeof err?.response?.data === "string" && err.response.data;
    return (
      errorMessage || err?.response?.data?.error || err?.message || fallback
    );
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

// async function login(email, password) {
//     setError(null);

//     if (email === fakeUser.email && password === fakeUser.password) {
//       const childUser = {
//         id: fakeUser.id,
//         email: fakeUser.email,
//         childName: fakeUser.childName,
//         childAge: fakeUser.childAge,
//         parentName: fakeUser.parentName,
//         parentEmail: fakeUser.parentEmail,
//         stats: fakeUser.stats,
//         parentReport: {
//           childName: fakeUser.childName,
//           parentName: fakeUser.parentName,
//           totalTimeThisWeek: parentReportTemplate.totalTimeThisWeek,
//           recipesCookedThisWeek: ["Happy Pancakes", "Rainbow Salad"],
//           safetyNotes: parentReportTemplate.safetyNotes,
//         },
//       };

//       setUser(childUser);
//       setViewMode("child");
//       return true;
//     }

//     setError("Wrong email or password. Please try again.");
//     return false;
//   }
