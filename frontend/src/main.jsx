/**
 * Application Entry Point
 * 
 * Initializes React application with:
 * - React Router for navigation
 * - Context providers for global state
 * - Error boundaries and strict mode
 * 
 * Provider Hierarchy:
 * ThemeProvider → BrowserRouter → AuthProvider → FavoritesProvider → App
 * 
 * @file
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
