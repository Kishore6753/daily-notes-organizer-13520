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
function App() {
  /** Root app: renders layout with sidebar, topbar, routes */
  const [globalQuery, setGlobalQuery] = useState("");

  return (
    <BrowserRouter>
      <div className="layout">
        <SidebarNav />
        <TopSearchBar value={globalQuery} onChange={setGlobalQuery} />
        <ConfigWarningBanner />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard globalQuery={globalQuery} />} />
            <Route path="/notes" element={<Notes globalQuery={globalQuery} />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
