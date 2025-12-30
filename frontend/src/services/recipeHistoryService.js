const API_BASE = "http://localhost:3000";

export async function saveRecipeCompletion({
  recipe,
  token,
  sessionId,
  minutes = 0,
}) {
  const res = await fetch(`${API_BASE}/api/recipe-history/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipeId: recipe.id,
      title: recipe.title,
      level: recipe.level,
      minutes,
      sessionId,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}
