import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Axios } from "./Axios.js";
import { useAuth } from "./hooks/useAuth.js";

// Layouts & Pages
import MainLayout from "./layout/MainLayout.jsx";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import RecipesPage from "./components/recipes/RecipesPage.jsx";
import GamesPage from "./components/games/GamesPage.jsx";
import FavoritesPage from "./components/FavoritesPage.jsx";
import SessionPage from "./components/session/SessionPage.jsx";
import ChildProfile from "./components/profile/child/ChildProfile.jsx";
import ParentPage from "./components/profile/parent/ParentMainPage.jsx";

export default function App() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const loginWithToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await Axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data?.user ?? res.data;
        if (u.username) {
          localStorage.setItem("username", u.username);
        }
        setUser({ ...u, token });
      } catch (err) {
        console.error("Token invalid", err);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    };
    loginWithToken();
  }, [setUser]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/progress" element={<ChildProfile />} />
        <Route path="/parent-dashboard" element={<ParentPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
