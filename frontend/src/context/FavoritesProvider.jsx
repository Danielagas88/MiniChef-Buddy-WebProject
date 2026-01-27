/**
 * FavoritesProvider
 *
 * Manages favorite recipe IDs. Syncs with server when user is logged in
 * and falls back to localStorage for guests. Provides favoriteIds,
 * isFavorite(id), and toggleFavorite(id).
 *
 * @component
 */
import { useEffect, useMemo, useState } from "react";
import { FavoritesContext } from "./favorites.context.js";

import { useAuth } from "../hooks/useAuth.js";
import {
  getFavorites,
  toggleFavoriteOnServer,
} from "../services/favoritesService.js";

function storageKeyFor(userId) {
  return `miniChef:favorites:${userId || "guest"}`;
}

function safeLoad(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const storageKey = useMemo(() => storageKeyFor(userId), [userId]);

  const [favoriteIds, setFavoriteIds] = useState(() => safeLoad(storageKey));

  useEffect(() => {
    let alive = true;
    async function load() {
      // guest / no token -> localStorage
      if (!user?.token) {
        setFavoriteIds(safeLoad(storageKey));
        return;
      }
      try {
        const data = await getFavorites(user.token);
        const ids = Array.isArray(data?.favoriteRecipeIds)
          ? data.favoriteRecipeIds.map(String)
          : [];
        if (alive) setFavoriteIds(ids);
      } catch (e) {
        console.error("Failed to load favorites from server:", e);
        // fallback to local storage
        if (alive) setFavoriteIds(safeLoad(storageKey));
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [storageKey, user?.token]);

  useEffect(() => {
    if (user?.token) return; // when logged-in, server is source of truth
    localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
  }, [storageKey, favoriteIds, user?.token]);

  const isFavorite = (id) => favoriteIds.includes(String(id));

  const toggleFavorite = async (id) => {
    const rid = String(id);

    // guest
    if (!user?.token) {
      setFavoriteIds((prev) => {
        const s = new Set(prev);
        if (s.has(rid)) s.delete(rid);
        else s.add(rid);
        return Array.from(s);
      });
      return;
    }

    // logged-in
    try {
      const data = await toggleFavoriteOnServer(rid, user.token);
      const ids = Array.isArray(data?.favoriteRecipeIds)
        ? data.favoriteRecipeIds.map(String)
        : [];
      setFavoriteIds(ids);
    } catch (e) {
      console.error("Failed to toggle favorite on server:", e);
    }
  };

  const value = { favoriteIds, isFavorite, toggleFavorite };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
