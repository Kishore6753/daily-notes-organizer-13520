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
        // Compose actionable message
        if (res?.isNetworkError) {
          const base = res?.details?.hints?.effectiveApiBase;
          const suggested = res?.details?.hints?.suggestedHostedBase;
          const msg = [
            "Cannot reach the backend API.",
            base ? `Tried: ${base}` : "",
            suggested ? `Hint: set REACT_APP_API_BASE=${suggested} or ensure the backend is running and CORS allows this origin.` : "",
          ]
            .filter(Boolean)
            .join(" ");
          setError(msg || "Network error contacting API.");
        } else if (res?.status === 401) {
          setError(res?.error || "Invalid credentials. Please try again.");
        } else if (res?.error) {
          setError(res.error);
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } catch (err) {
      // Fallback catch (should be covered by normalized result)
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
