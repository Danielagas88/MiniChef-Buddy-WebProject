import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

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
  const storageKey = useMemo(() => storageKeyFor(user?.id), [user?.id]);

  const [favoriteIds, setFavoriteIds] = useState(() => safeLoad(storageKey));

  useEffect(() => {
    setFavoriteIds(safeLoad(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
  }, [storageKey, favoriteIds]);

  const value = useMemo(() => {
    const set = new Set(favoriteIds);

    function isFavorite(id) {
      return set.has(String(id));
    }

    function toggleFavorite(id) {
      const rid = String(id);
      setFavoriteIds((prev) => {
        const s = new Set(prev);
        if (s.has(rid)) s.delete(rid);
        else s.add(rid);
        return Array.from(s);
      });
    }

    return { favoriteIds, isFavorite, toggleFavorite };
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
