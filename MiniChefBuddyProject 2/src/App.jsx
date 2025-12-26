import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import { useAuth } from "./hooks/useAuth.js";
import RegisterPage from "./pages/RegisterPage.jsx";
import { useEffect } from "react";
import { Axios } from "./Axios.js";

export default function App() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const loginWithToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const loggedInUser = await Axios.get("/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(loggedInUser.data);
      }
    };

    loginWithToken();
  }, [setUser]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        <Route
          path="/progress"
          element={user ? <ProgressPage /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
