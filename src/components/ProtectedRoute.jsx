import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../theme";

/**
 * Gate a route behind login, optionally requiring the ADMIN role.
 * Shows a plain loading state while the initial /me/ check is in flight
 * so we don't flash a redirect before we actually know the auth state.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ background: COLORS.asphalt, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
