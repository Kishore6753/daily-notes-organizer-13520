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

// PUBLIC_INTERFACE
function AppShell() {
  /** Application shell: renders layout with sidebar, topbar, and routes (no auth) */
  const [globalQuery, setGlobalQuery] = useState("");

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
        {/* Auth removed: keep simple avatar placeholder */}
        <div className="badge" aria-label="Profile">DN</div>
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
  /** Root app with public routes only; dashboard is the default view */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
