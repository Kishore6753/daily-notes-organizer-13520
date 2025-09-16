import React from "react";

/** Top search bar shown on all pages */
export default function TopSearchBar({ value, onChange, placeholder = "Search notes..." }) {
  return (
    <header className="topbar">
      <input
        className="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Global search"
      />
      <button className="btn btn-icon" aria-label="Notifications">
        🔔
      </button>
      <div className="badge" aria-label="Profile">JD</div>
    </header>
  );
}
