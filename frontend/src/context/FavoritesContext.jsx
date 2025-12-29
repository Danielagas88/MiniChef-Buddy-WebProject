import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getFavorites, toggleFavoriteOnServer } from "../services/favoritesService.js";



export const FavoritesContext = createContext(null);

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


  const value = useMemo(() => {
    const set = new Set(favoriteIds);

    function isFavorite(id) {
      return set.has(String(id));
    }

async function toggleFavorite(id) {
  const rid = String(id);

  // guest -> local state/localStorage
  if (!user?.token) {
    setFavoriteIds((prev) => {
      const s = new Set(prev);
      if (s.has(rid)) s.delete(rid);
      else s.add(rid);
      return Array.from(s);
    });
    return;
  }

  // logged-in -> server toggle
  try {
    const data = await toggleFavoriteOnServer(rid, user.token);
    const ids = Array.isArray(data?.favoriteRecipeIds)
      ? data.favoriteRecipeIds.map(String)
      : [];
    setFavoriteIds(ids);
  } catch (e) {
    console.error("Failed to toggle favorite on server:", e);
  }
}


    return { favoriteIds, isFavorite, toggleFavorite };
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
