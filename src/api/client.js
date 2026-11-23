const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ACCESS_KEY = "csms_access";
const REFRESH_KEY = "csms_refresh";

export function getTokens() {
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * Thrown for any non-2xx response. Carries the parsed body (if any) and status
 * so callers/forms can show a real message instead of a generic "failed".
 */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function extractMessage(body, fallback) {
  if (!body) return fallback;
  // Our DRF exception handler wraps errors as { error, detail, status_code }
  const detail = body.detail ?? body;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.join(" ");
  if (typeof detail === "object") {
    const firstKey = Object.keys(detail)[0];
    const firstVal = detail[firstKey];
    const msg = Array.isArray(firstVal) ? firstVal[0] : firstVal;
    return firstKey ? `${firstKey}: ${msg}` : fallback;
  }
  return fallback;
}

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) return false;

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = await res.json();
  setTokens({ access: data.access });
  return true;
}

/**
 * Core request helper. Automatically attaches the JWT, retries once after a
 * silent token refresh on 401, and throws ApiError with a readable message
 * on any other failure.
 */
export async function request(path, { method = "GET", body, auth = true, isRetry = false } = {}) {
  const { access } = getTokens();
  const headers = { "Content-Type": "application/json" };
  if (auth && access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, { method, body, auth, isRetry: true });
    }
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(extractMessage(data, `Request failed (${res.status})`), res.status, data);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
