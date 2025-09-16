import React from "react";
import { getApiConfig } from "../utils/config";

/**
 * ConfigWarningBanner
 * Renders a prominent warning when the API base is unset or incorrectly points to localhost
 * while the app is running in a hosted/cloud environment.
 */
export default function ConfigWarningBanner() {
  const {
    isUnset,
    looksLocalhost,
    hostedLikely,
    suggestedHostedBase,
    effectiveBase,
  } = getApiConfig();

  const shouldWarn = hostedLikely && (isUnset || looksLocalhost);

  if (!shouldWarn) return null;

  const message =
    isUnset
      ? "REACT_APP_API_BASE is not set."
      : `REACT_APP_API_BASE is set to ${effectiveBase}, which points to localhost.`;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 64, // below topbar
        left: 256, // beside sidebar
        right: 0,
        zIndex: 100,
        background: "rgba(239, 68, 68, 0.15)",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        color: "#FCA5A5",
        padding: "12px 16px",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 700, color: "#FCA5A5" }}>
        API Base Misconfiguration Detected
      </div>
      <div style={{ color: "#FCA5A5" }}>
        {message} Since this app is running on a hosted URL (not localhost), API requests to localhost will fail due to network/CORS.
      </div>
      <div style={{ color: "#FCA5A5" }}>
        To fix:
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, color: "#FCA5A5" }}>
        <li>Set REACT_APP_API_BASE to the backend URL, then rebuild/redeploy the frontend.</li>
        <li>Example (paste into .env): REACT_APP_API_BASE={suggestedHostedBase}</li>
        <li>Backend docs: check that your backend is reachable and has CORS enabled for this origin.</li>
      </ul>
      <div style={{ marginTop: 6 }}>
        <code style={{ background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: 6 }}>
          REACT_APP_API_BASE={suggestedHostedBase}
        </code>
      </div>
    </div>
  );
}
