const API_BASE = "http://localhost:3000";

export async function updateMyCookingLevel({ token, cookingLevel }) {
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${API_BASE}/api/auth/me/cooking-level`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cookingLevel }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}
