import User from "../auth/UserModel";

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const user = await User.findById(userId).select("favoriteRecipeIds");
  if (!user) throw new Error("USER_NOT_FOUND");
  return user.favoriteRecipeIds || [];
}

export async function toggleFavorite(
  userId: string,
  recipeId: string
): Promise<string[]> {
  const user = await User.findById(userId).select("favoriteRecipeIds");
  if (!user) throw new Error("USER_NOT_FOUND");

  const ids = user.favoriteRecipeIds || [];
  const strId = String(recipeId);

  const idx = ids.indexOf(strId);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(strId);

  user.favoriteRecipeIds = ids;
  await user.save();

  return user.favoriteRecipeIds || [];
}
