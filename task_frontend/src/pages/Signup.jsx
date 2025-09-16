import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Signup page for creating an account */
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const res = await signup(name, email, password);
      if (res?.id || res?.user || res?.token) {
        // Show success and navigate to login
        setMessage("Account created. You can now sign in.");
        setTimeout(() => navigate("/login"), 600);
      } else {
        setMessage("Account created. You can now sign in.");
        setTimeout(() => navigate("/login"), 600);
      }
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 48 }}>
      <div className="card" style={{ padding: 20 }}>
        <div className="h2" style={{ marginBottom: 12 }}>Create account</div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="semail">Email</label>
            <input id="semail" className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="spassword">Password</label>
            <input id="spassword" className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
          </div>
          {error ? <div className="meta" style={{ color: "var(--danger)" }}>{error}</div> : null}
          {message ? <div className="meta" style={{ color: "var(--success)" }}>{message}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Sign up"}
          </button>
        </form>
        <div className="hr" />
        <div className="meta">
          Already have an account? <Link to="/login" style={{ color: "var(--brand)" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
