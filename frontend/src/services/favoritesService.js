const API_BASE = "http://localhost:3000";

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export function getFavorites(token) {
  return apiRequest("/api/favorites", { token });
}

export function toggleFavoriteOnServer(recipeId, token) {
  return apiRequest("/api/favorites/toggle", {
    method: "POST",
    body: { recipeId },
    token,
  });
}
