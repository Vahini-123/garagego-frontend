import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell, ErrorText, Field } from "./Login";
import { primaryBtn } from "../theme";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field) {
    return (value) => setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Register">
      <form onSubmit={handleSubmit}>
        <Field label="First name" value={form.first_name} onChange={update("first_name")} required={false} />
        <Field label="Last name" value={form.last_name} onChange={update("last_name")} required={false} />
        <Field label="Email" type="email" value={form.email} onChange={update("email")} />
        <Field label="Phone" type="tel" value={form.phone} onChange={update("phone")} required={false} />
        <Field label="Password" type="password" value={form.password} onChange={update("password")} />
        {error && <ErrorText>{error}</ErrorText>}
        <button type="submit" disabled={busy} style={{ ...primaryBtn, width: "100%", marginTop: 8, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
