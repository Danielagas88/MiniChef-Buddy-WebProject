/**
 * Favorites types and validators
 *
 * ToggleFavoriteBody and validateRecipeId for the toggle endpoint.
 */
export type ToggleFavoriteBody = { recipeId?: string };

export function validateRecipeId(id?: string): string | null {
  const v = id?.trim();
  if (!v) return null;
  return v;
}
