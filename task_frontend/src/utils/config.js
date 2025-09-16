//
//
// Utilities to derive and validate API Base URL based on environment,
// with hosted/cloud runtime auto-rewrite to the current hostname:3001.
// This prevents accidental localhost pointing in previews.
//
// Design decisions:
// - In hosted/cloud (not localhost/127.0.0.1/::1), if REACT_APP_API_BASE is
//   unset, blank, invalid, or looks like localhost, we compute and use
//   `${window.location.protocol}//${window.location.hostname}:3001` at runtime.
// - Remove any fallback to http://localhost:3001 when not on localhost.
// - Provide console warnings and an in-app signal when rewrite fails.
// - ConfigWarningBanner already probes backend health; with a reachable API
//   base, it will hide automatically.
//
// PUBLIC helpers are kept minimal and documented.

function normalizeBaseUrl(url) {
  // Remove trailing slash but return as-is if not a string
  if (typeof url !== "string") return url;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function isValidUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function suggestHostedApiBase(defaultPort = 3001) {
  /** Suggest an API base using current location and provided port. */
  try {
    const { protocol, hostname } = window.location;
    const port = Number(defaultPort) || 3001;
    return `${protocol}//${hostname}:${port}`;
  } catch {
    // Shouldn't happen in browser, but keep a safe default for SSR/tests
    return `http://localhost:${defaultPort}`;
  }
}

export function isLocalHost() {
  const host = (window.location && window.location.hostname) || "";
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

// Local storage key to flag rewrite failures for in-app banner usage if needed
const RUNTIME_CONFIG_NS = "app:runtime-config";
const RUNTIME_WARN_KEY = `${RUNTIME_CONFIG_NS}:api-rewrite-warning`;

// INTERNAL: mark warning state for in-app usage
function setRuntimeWarningFlag(val) {
  try {
    window.sessionStorage.setItem(RUNTIME_WARN_KEY, String(!!val));
  } catch {
    // ignore storage errors (e.g., privacy mode)
  }
}

// PUBLIC_INTERFACE
export function getRuntimeWarningFlag() {
  /** Read runtime warning flag for in-app diagnostics. */
  try {
    return window.sessionStorage.getItem(RUNTIME_WARN_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * getApiConfig
 * Returns the effective API base and diagnostics.
 * Behavior:
 *  - Localhost: use REACT_APP_API_BASE if valid; otherwise fallback to http://localhost:3001.
 *  - Hosted/cloud: if REACT_APP_API_BASE is unset/blank/invalid/localhost-like, force a runtime
 *    base pointing at current hostname:3001. Never fallback to localhost in hosted.
 */
export function getApiConfig() {
  /** Compute effective API base URL and environment diagnostics. */
  const rawEnvBase = (process.env.REACT_APP_API_BASE || "").trim();
  const envBase = rawEnvBase ? normalizeBaseUrl(rawEnvBase) : undefined;
  const hostedLikely = !isLocalHost();

  const envLooksLocalhost =
    typeof envBase === "string" &&
    (envBase.includes("localhost") || envBase.includes("127.0.0.1"));

  const envInvalid = !!rawEnvBase && !isValidUrl(envBase);
  const isUnset = !rawEnvBase;

  let effectiveBase;
  let rewritten = false;
  let rewriteError = null;

  if (hostedLikely) {
    // Hosted/cloud behavior — do not allow localhost targets
    if (isUnset || envInvalid || envLooksLocalhost) {
      const suggested = suggestHostedApiBase(3001);
      try {
        // Validate suggested and assign
        if (!isValidUrl(suggested)) {
          throw new Error(`Suggested API base is not a valid URL: ${suggested}`);
        }
        effectiveBase = normalizeBaseUrl(suggested);
        rewritten = true;

        // eslint-disable-next-line no-console
        console.warn(
          `[config] Hosted environment detected. Using computed API base "${effectiveBase}" ` +
            `instead of env "${rawEnvBase || "(unset)"}".`
        );
        setRuntimeWarningFlag(false);
      } catch (e) {
        rewriteError = e;
        // eslint-disable-next-line no-console
        console.error(
          "[config] Failed to rewrite API base for hosted environment.",
          e
        );
        // As a last resort in hosted, avoid localhost fallback; keep envBase if valid else undefined
        effectiveBase = isValidUrl(envBase) ? envBase : undefined;
        setRuntimeWarningFlag(true);
      }
    } else {
      // Hosted and env provided is valid and not localhost-like
      effectiveBase = envBase;
      setRuntimeWarningFlag(false);
    }
  } else {
    // Local development — allow fallback to localhost
    if (isValidUrl(envBase)) {
      effectiveBase = envBase;
    } else {
      effectiveBase = "http://localhost:3001";
    }
    setRuntimeWarningFlag(false);
  }

  // Defensive: if still no effective base (shouldn't happen), set warning
  if (!effectiveBase) {
    setRuntimeWarningFlag(true);
  }

  const looksLocalhost =
    typeof effectiveBase === "string" &&
    (effectiveBase.includes("localhost") || effectiveBase.includes("127.0.0.1"));

  return {
    effectiveBase,
    isUnset,
    looksLocalhost,
    hostedLikely,
    suggestedHostedBase: suggestHostedApiBase(3001),
    envInvalid,
    rewritten, // whether we overrode env at runtime
    rewriteError, // error object if rewrite failed
  };
}
