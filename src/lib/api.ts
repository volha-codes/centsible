const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface ApiErrorPayload {
  status: number;
  message: string;
  details: string[];
}

export function toApiErrorPayload(error: unknown): ApiErrorPayload {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      message: error.message,
      details: error.details,
    };
  }

  return {
    status: 0,
    message: error instanceof Error ? error.message : "Unknown error",
    details: [],
  };
}

async function readError(response: Response): Promise<ApiError> {
  const fallback = `Request failed: ${response.status}`;

  try {
    const body: { message?: string | string[] } = await response.json();

    if (Array.isArray(body.message)) {
      return new ApiError(
        response.status,
        body.message.join(", "),
        body.message,
      );
    }

    if (typeof body.message === "string") {
      return new ApiError(response.status, body.message);
    }
  } catch {
    return new ApiError(response.status, fallback);
  }

  return new ApiError(response.status, fallback);
}

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
    throw new ApiError(0, "Network error");
  }

  if (!response.ok) {
    console.error(`[api] ${method} ${url} -> ${response.status}`);
    throw await readError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
