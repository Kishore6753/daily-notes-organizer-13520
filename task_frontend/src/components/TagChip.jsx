import React from "react";

export default function TagChip({ tag }) {
  const bg = tag.color || "rgba(255,255,255,0.06)";
  const style = {
    background: bg,
    color: "var(--text-inverse)",
    border: "1px solid rgba(0,0,0,0.08)"
  };
  return <span className="chip" style={style}>{tag.name}</span>;
}
