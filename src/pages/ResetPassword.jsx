import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { confirmPasswordReset } from "../api/auth";
import { COLORS, FONT_BODY, FONT_HEAD, GLOBAL_FONT_IMPORT, inputStyle, labelStyle, primaryBtn } from "../theme";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await confirmPasswordReset({ uid, token, password });
      setMessage(data.detail);
      setDone(true);
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
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 26, color: COLORS.chrome, textAlign: "center", margin: "0 0 24px" }}>
          Set a new password
        </h1>

        {done ? (
          <>
            <div style={{ color: COLORS.success, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{message}</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 14 }}>
              <Link to="/login" style={{ color: COLORS.steel, textDecoration: "none" }}>
                Customer sign in
              </Link>
              <Link to="/admin/login" style={{ color: COLORS.steel, textDecoration: "none" }}>
                Admin sign in
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>New password</label>
              <input type="password" value={password} required minLength={8} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirm new password</label>
              <input type="password" value={confirm} required minLength={8} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
            </div>
            {error && <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ ...primaryBtn, width: "100%" }}>
              {loading ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}