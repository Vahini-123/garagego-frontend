import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONT_BODY, FONT_HEAD, GLOBAL_FONT_IMPORT, inputStyle, labelStyle, primaryBtn } from "../theme";

/**
 * Shared login form for both customers and admins.
 * requireAdmin=true (used by /admin/login) rejects a successful login if the
 * account isn't staff/admin, so a customer can't land in the admin panel by
 * mistake, and points them back to the regular sign-in instead.
 */
export default function Login({ requireAdmin = false }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form);
      const isAdmin = user.role === "ADMIN" || user.is_superuser;
      if (requireAdmin && !isAdmin) {
        setError("This account doesn't have admin access.");
        return;
      }
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title={requireAdmin ? "Admin login" : "Sign in"}>
      <form onSubmit={handleSubmit}>
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        {error && <ErrorText>{error}</ErrorText>}
        <button type="submit" disabled={busy} style={{ ...primaryBtn, width: "100%", marginTop: 8, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
          <Link to="/forgot-password" style={{ color: COLORS.steel, textDecoration: "none" }}>
            Forgot password?
          </Link>
        </div>
      </form>
      {!requireAdmin && (
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 18, textAlign: "center" }}>
          No account yet?{" "}
          <Link to="/register" style={{ color: COLORS.steel }}>
            Sign up
          </Link>
        </p>
      )}
    </AuthShell>
  );
}

export function AuthShell({ title, children }) {
  return (
    <div style={{ background: COLORS.asphalt, minHeight: "100vh", fontFamily: FONT_BODY, display: "flex", flexDirection: "column" }}>
      <style>{GLOBAL_FONT_IMPORT}</style>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          borderBottom: `1px solid ${COLORS.hairline}`,
        }}
      >
        <Link to="/" style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, color: COLORS.chrome, textDecoration: "none" }}>
          GarageGo
        </Link>
        <Link to="/" style={{ color: COLORS.steel, fontSize: 14, textDecoration: "none" }}>
          ← Back to home
        </Link>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 380, background: COLORS.graphite, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, padding: "34px 32px" }}>
          <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 24, color: COLORS.chrome, margin: "0 0 24px", textAlign: "center" }}>
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, type = "text", value, onChange, required = true, ...rest }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        {...rest}
      />
    </div>
  );
}

export function ErrorText({ children }) {
  return (
    <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{children}</div>
  );
}