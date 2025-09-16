import React from "react";

/** Top search input (to be embedded into header) */
export default function TopSearchBar({ value, onChange, placeholder = "Search notes..." }) {
  return (
    <>
      <input
        className="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Global search"
      />
    </>
  );
}
