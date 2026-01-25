import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth.js";

// Layouts & Pages
import MainLayout from "./layout/MainLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import RecipesPage from "./components/recipes/RecipesPage.jsx";
import FavoritesPage from "./components/FavoritesPage.jsx";
import SessionPage from "./components/session/SessionPage.jsx";
import ChildProfile from "./components/profile/child/ChildProfile.jsx";

// Lazy loaded routes for code splitting
const GamesPage = lazy(() => import("./components/games/GamesPage.jsx"));
const ParentPage = lazy(() => import("./components/profile/parent/ParentMainPage.jsx"));

export default function App() {
  const { user } = useAuth();
  // Note: Auth hydration is handled in AuthProvider.jsx to avoid duplicate /auth/me calls

  const LoadingFallback = () => (
    <div className="min-h-screen bg-(--bg-current) flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl animate-pulse">🍳</div>
        <p className="text-(--text-secondary) font-medium">Loading...</p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-(--bg-current) flex items-center justify-center p-4 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route
              path="/games"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <GamesPage />
                </Suspense>
              }
            />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/progress" element={<ChildProfile />} />
            <Route
              path="/parent-dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ParentPage />
                </Suspense>
              }
            />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
}
