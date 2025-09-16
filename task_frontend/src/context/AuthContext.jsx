import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, signupRequest } from "../services/api";

/**
 * AuthContext provides authentication state and helpers across the app.
 * Stores JWT token and user in localStorage for persistence.
 */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions */
  return useContext(AuthContext);
}

/**
 * Keys used in localStorage.
 */
const LS_TOKEN_KEY = "auth:token";
const LS_USER_KEY = "auth:user";

function readPersistedAuth() {
  try {
    const token = window.localStorage.getItem(LS_TOKEN_KEY) || "";
    const userStr = window.localStorage.getItem(LS_USER_KEY) || "";
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch {
    return { token: "", user: null };
  }
}

function writePersistedAuth(token, user) {
  try {
    if (token) window.localStorage.setItem(LS_TOKEN_KEY, token);
    else window.localStorage.removeItem(LS_TOKEN_KEY);
    if (user) window.localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(LS_USER_KEY);
  } catch {
    // ignore storage errors (e.g., private mode)
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const { token: t, user: u } = readPersistedAuth();
    if (t && u) {
      setToken(t);
      setUser(u);
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async (email, password) => {
    const res = await loginRequest({ email, password });
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      writePersistedAuth(res.token, res.user);
      return { ok: true };
    }
    return { ok: false, error: "Invalid response" };
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const res = await signupRequest({ name, email, password });
    // Some backends may auto-login on signup; if token present, persist.
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      writePersistedAuth(res.token, res.user);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    writePersistedAuth("", null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [token, user, isAuthenticated, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
