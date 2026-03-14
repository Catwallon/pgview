export async function apiFetch(path: string, options?: RequestInit) {
  const API_URL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

  const res = await fetch(`${API_URL}/api${path}`, options);
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
