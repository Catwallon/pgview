export async function apiFetch(path: string, options?: RequestInit) {
  const API_URL =
    import.meta.env.MODE === "development" ? "http://localhost:8080" : "";

  const res = await fetch(`${API_URL}/api${path}`, options);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }

  return res.json();
}
