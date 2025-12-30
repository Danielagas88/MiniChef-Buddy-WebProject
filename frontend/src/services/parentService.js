const API_BASE = "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export const parentApi = {
  verifyPin: (pin, token) =>
    request("/api/parent-pin/verify", { method: "POST", body: { pin }, token }),

  setPin: (pin, token) =>
    request("/api/parent-pin/set", { method: "POST", body: { pin }, token }),

  getWeeklyReport: (token) => request("/api/weekly-report/me", { token }),

  saveWeeklyReport: (report, token) =>
    request("/api/weekly-report/me", { method: "PUT", body: report, token }),
};
