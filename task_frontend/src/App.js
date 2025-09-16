import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/theme.css";
import SidebarNav from "./components/SidebarNav";
import TopSearchBar from "./components/TopSearchBar";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Tags from "./pages/Tags";
import Categories from "./pages/Categories";
import ConfigWarningBanner from "./components/ConfigWarningBanner";
import AuthProvider, { useAuth } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// PUBLIC_INTERFACE
function AppShell() {
  /** Authenticated shell: renders layout with sidebar, topbar, routes */
  const [globalQuery, setGlobalQuery] = useState("");
  const { user, logout } = useAuth();

  const initials =
    (user?.name || user?.email || "User")
      .split(" ")
      .map((s) => s[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  return (
    <div className="layout">
      <SidebarNav />
      <ConfigWarningBanner />
      <header className="topbar" style={{ gap: 12 }}>
        <TopSearchBar
          value={globalQuery}
          onChange={setGlobalQuery}
          placeholder="Search notes..."
        />
        <button className="btn btn-icon" aria-label="Notifications">🔔</button>
        <div className="badge" aria-label="Profile">{initials}</div>
        <button className="btn btn-secondary" onClick={logout}>Log out</button>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard globalQuery={globalQuery} />} />
          <Route path="/notes" element={<Notes globalQuery={globalQuery} />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with auth provider and public/private routes */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Private routes */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
