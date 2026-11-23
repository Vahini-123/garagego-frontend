import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/auth";
import { COLORS, FONT_BODY, FONT_HEAD, GLOBAL_FONT_IMPORT, inputStyle, labelStyle, primaryBtn } from "../theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: COLORS.asphalt,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_BODY,
      }}
    >
      <style>{GLOBAL_FONT_IMPORT}</style>
      <div
        style={{
          background: COLORS.graphite,
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: 8,
          padding: "40px 36px",
          width: 380,
        }}
      >
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 26, color: COLORS.chrome, textAlign: "center", margin: "0 0 12px" }}>
          Forgot password
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6, textAlign: "center", margin: "0 0 24px" }}>
          Enter your account email and we'll send you a link to set a new password.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          {error && <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {message && <div style={{ color: COLORS.success, fontSize: 13, marginBottom: 16 }}>{message}</div>}
          <button type="submit" disabled={loading} style={{ ...primaryBtn, width: "100%" }}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          <Link to="/login" style={{ color: COLORS.steel, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}