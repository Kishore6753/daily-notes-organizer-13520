import React, { useEffect, useMemo, useRef, useState } from "react";
import { getApiConfig } from "../utils/config";
import { getHealth } from "../services/api";

/**
 * ConfigWarningBanner
 * Renders a prominent warning when the API base is unset or incorrectly points to localhost
 * while the app is running in a hosted/cloud environment.
 * Improvement: perform a runtime health probe; if backend is reachable, suppress the banner.
 *
 * Additional improvements:
 * - Always probe on hosted environments at mount (not only when heuristics suggest warning), so a healthy backend hides the banner proactively.
 * - Add a minimal debounce and one retry to reduce flicker/false positives on slow cold starts.
 */
export default function ConfigWarningBanner() {
  const {
    isUnset,
    looksLocalhost,
    hostedLikely,
    suggestedHostedBase,
    effectiveBase,
    rewritten,
    dynamicInferenceActive,
  } = getApiConfig();

  const [overrideHide, setOverrideHide] = useState(false);
  const [probing, setProbing] = useState(false);
  const retryRef = useRef(0);

  // If dynamic inference is active and health check succeeds, we should never show a warning.
  const shouldWarnHeuristic = hostedLikely && (isUnset || looksLocalhost) && !dynamicInferenceActive;

  // Probe health when hosted to decide banner visibility more robustly
  useEffect(() => {
    let cancelled = false;

    async function probeWithRetry() {
      if (!hostedLikely) return;
      setProbing(true);
      try {
        // Try health check
        await getHealth();
        if (!cancelled) {
          setOverrideHide(true);
          // eslint-disable-next-line no-console
          console.debug("[config/banner] Health probe succeeded. Hiding banner. base=", effectiveBase, "dynamic=", dynamicInferenceActive, "rewritten=", rewritten);
        }
      } catch {
        // Brief retry once in case of cold-start/transient issues
        if (!cancelled && retryRef.current < 1) {
          retryRef.current += 1;
          setTimeout(async () => {
            try {
              await getHealth();
              if (!cancelled) {
                setOverrideHide(true);
                // eslint-disable-next-line no-console
                console.debug("[config/banner] Health probe retry succeeded. Hiding banner.");
              }
            } catch {
              if (!cancelled) setOverrideHide(false);
            } finally {
              if (!cancelled) setProbing(false);
            }
          }, 400);
          return;
        }
        if (!cancelled) setOverrideHide(false);
      } finally {
        if (!cancelled) setProbing(false);
      }
    }

    probeWithRetry();

    return () => {
      cancelled = true;
    };
  }, [hostedLikely, effectiveBase, dynamicInferenceActive, rewritten]);

  const shouldWarn = useMemo(() => {
    // Only show banner if heuristics suggest a problem AND health probe did not override hiding.
    return shouldWarnHeuristic && !overrideHide;
  }, [shouldWarnHeuristic, overrideHide]);

  if (!shouldWarn) return null;

  // Tailored message: if dynamic inference is inactive and we truly have a localhost/empty env in hosted
  const message =
    isUnset && !dynamicInferenceActive
      ? "API base is not set in the environment for a hosted deployment."
      : `Configured API base "${effectiveBase}" points to localhost while running on a hosted URL.`;

  // If dynamic inference were active we wouldn't reach here, but keep the copy clean:
  const showEnvGuidance = !dynamicInferenceActive;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, color: "#FCA5A5" }}>
          API Base Misconfiguration Detected
        </div>
        {probing ? (
          <span className="meta" aria-live="polite">Rechecking…</span>
        ) : null}
      </div>
      <div style={{ color: "#FCA5A5" }}>
        {message} Hosted environments cannot reach localhost services directly.
      </div>

      {showEnvGuidance ? (
        <>
          <div style={{ color: "#FCA5A5" }}>
            Recommended fix:
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#FCA5A5" }}>
            <li>Set REACT_APP_API_BASE to the backend URL for this host, then rebuild/redeploy the frontend.</li>
            <li>Example: REACT_APP_API_BASE={suggestedHostedBase}</li>
            <li>Ensure the backend allows this origin via CORS and is reachable over the network.</li>
          </ul>
          <div style={{ marginTop: 6 }}>
            <code style={{ background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: 6 }}>
              REACT_APP_API_BASE={suggestedHostedBase}
            </code>
          </div>
        </>
      ) : null}
    </div>
  );
}
