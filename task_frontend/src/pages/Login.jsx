import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Login page with email/password form */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await login(email, password);
      if (res?.ok) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 48 }}>
      <div className="card" style={{ padding: 20 }}>
        <div className="h2" style={{ marginBottom: 12 }}>Sign in</div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error ? <div className="meta" style={{ color: "var(--danger)" }}>{error}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="hr" />
        <div className="meta">
          Don’t have an account? <Link to="/signup" style={{ color: "var(--brand)" }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}
