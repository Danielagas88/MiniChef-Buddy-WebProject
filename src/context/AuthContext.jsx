import { createContext, useContext, useState } from "react";
import { fakeUser, parentReportTemplate } from "../data/fakeData.js";

const AuthContext = createContext(null);

/**
 * AuthProvider – שומר:
 * user: אובייקט הילד
 * viewMode: "child" | "parent"
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("child"); // child / parent
  const [error, setError] = useState(null);

  // כרגע login "fake" – בהמשך אפשר להחליף ל-Firebase או backend
  async function login(email, password) {
    setError(null);

    // כאן תבוא קריאה אמיתית לשרת.
    // בינתיים אנחנו מדמים התחברות לחשבון אחד:
    if (email === fakeUser.email && password === fakeUser.password) {
      const childUser = {
        id: fakeUser.id,
        email: fakeUser.email,
        childName: fakeUser.childName,
        childAge: fakeUser.childAge,
        parentName: fakeUser.parentName,
        parentEmail: fakeUser.parentEmail,
        stats: fakeUser.stats,
        parentReport: {
          childName: fakeUser.childName,
          parentName: fakeUser.parentName,
          totalTimeThisWeek: parentReportTemplate.totalTimeThisWeek,
          recipesCookedThisWeek: ["Happy Pancakes", "Rainbow Salad"],
          safetyNotes: parentReportTemplate.safetyNotes,
        },
      };
      setUser(childUser);
      setViewMode("child");
      return true;
    } else {
      setError("Wrong email or password. Please try again.");
      return false;
    }
  }

  function logout() {
    setUser(null);
    setViewMode("child");
    setError(null);
  }

  const value = {
    user,
    viewMode,
    setViewMode,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
