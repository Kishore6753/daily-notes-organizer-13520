import React from "react";

/** Simple modal dialog */
export default function Modal({ title, children, onClose, footer }) {
  return (
    <div role="dialog" aria-modal="true" style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "grid", placeItems: "center", zIndex: 50
    }}>
      <div className="card" style={{ width: "min(560px, 92vw)", padding: 20 }}>
        <div className="h2" style={{ marginBottom: 12 }}>{title}</div>
        <div style={{ display: "grid", gap: 12 }}>
          {children}
        </div>
        <div className="hr" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {footer}
          <button className="btn btn-secondary" onClick={onClose} aria-label="Close modal">Close</button>
        </div>
      </div>
    </div>
  );
}
