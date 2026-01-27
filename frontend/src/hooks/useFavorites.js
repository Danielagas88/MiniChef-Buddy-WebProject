/**
 * useFavorites
 *
 * Access favorites context. Must be used inside FavoritesProvider.
 *
 * @returns {Object} favoriteIds, isFavorite(id), toggleFavorite(id)
 * @throws {Error} If used outside FavoritesProvider
 *
 * @example
 * const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
 */
import { useContext } from "react";
import { FavoritesContext } from "../context/favorites.context.js";

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
