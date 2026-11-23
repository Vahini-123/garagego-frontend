import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { getTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we already hold a token, try to resolve the profile
  // so a page refresh doesn't drop the session.
  useEffect(() => {
    const { access } = getTokens();
    if (!access) {
      setLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const loggedInUser = await authApi.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(payload) {
    await authApi.register(payload);
    // Auto-login right after signup so the customer lands straight in the dashboard.
    return login({ email: payload.email, password: payload.password });
  }

  function logout() {
    authApi.logout();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthed: !!user,
    isAdmin: !!user && (user.role === "ADMIN" || user.is_superuser),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
