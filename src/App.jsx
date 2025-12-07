import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

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
