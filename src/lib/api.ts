const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${path}`;
  const method = options?.method ?? "GET";

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: options?.body
        ? { "Content-Type": "application/json" }
        : undefined,
    });
  } catch (error) {
    console.error(`[api] ${method} ${url} failed`, error);
    throw error;
  }

  if (!response.ok) {
    console.error(`[api] ${method} ${url} -> ${response.status}`);
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
