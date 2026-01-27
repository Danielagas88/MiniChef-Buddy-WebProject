/**
 * FavoritesContext
 *
 * React context for favorite recipe IDs. Provided by FavoritesProvider.
 * Consumers use useFavorites() to access favoriteIds, isFavorite, toggleFavorite.
 *
 * @module context/favorites.context
 */
import { createContext } from "react";

export const FavoritesContext = createContext(null);
