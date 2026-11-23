import { api, clearTokens, setTokens } from "./client";

export async function register({ email, password, first_name, last_name, phone }) {
  return api.post("/accounts/register/", { email, password, first_name, last_name, phone }, { auth: false });
}

export async function login({ email, password }) {
  const data = await api.post("/accounts/login/", { email, password }, { auth: false });
  setTokens({ access: data.access, refresh: data.refresh });
  return data.user;
}

export async function fetchMe() {
  return api.get("/accounts/me/");
}

export function logout() {
  clearTokens();
}

export async function requestPasswordReset(email) {
  return api.post("/accounts/password-reset/", { email }, { auth: false });
}

export async function confirmPasswordReset({ uid, token, password }) {
  return api.post("/accounts/password-reset/confirm/", { uid, token, password }, { auth: false });
}
