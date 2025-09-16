//
// Utilities to derive and validate API Base URL based on environment
//

/**
 * Normalize a base URL (remove trailing slash).
 */
function normalizeBaseUrl(url) {
  if (typeof url !== "string") return url;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Quick check if a value is a valid absolute URL with protocol.
 */
function isValidUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Derive a suggested API base URL for hosted/cloud environments by using the current
 * window.location hostname and a default backend port of 3001.
 * - Preserves protocol (https on hosted preview URLs)
 * - Handles non-standard ports by dropping them in the suggestion (uses backend port instead)
 */
export function suggestHostedApiBase(defaultPort = 3001) {
  try {
    const { protocol, hostname } = window.location;
    const port = Number(defaultPort) || 3001;
    return `${protocol}//${hostname}:${port}`;
  } catch {
    return `http://localhost:${defaultPort}`;
  }
}

/**
 * Determine whether we are running on localhost (including IPv4/IPv6 variants).
 */
export function isLocalHost() {
  const host = (window.location && window.location.hostname) || "";
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1"
  );
}

/**
 * Get the effective API base and validation info.
 * Priority:
 *  1) REACT_APP_API_BASE if present
 *  2) fallback "http://localhost:3001"
 * Returns an object with:
 *  - effectiveBase: string
 *  - isUnset: boolean (no env provided)
 *  - looksLocalhost: boolean (env is pointing to localhost)
 *  - hostedLikely: boolean (frontend not on localhost)
 *  - suggestedHostedBase: string (best guess for hosted API base)
 *  - envInvalid: boolean (env provided but not a valid absolute URL)
 */
export function getApiConfig() {
  const rawEnvBase = process.env.REACT_APP_API_BASE;
  const envBase = rawEnvBase ? normalizeBaseUrl(rawEnvBase) : undefined;
  const fallback = "http://localhost:3001";
  const fallbackNormalized = normalizeBaseUrl(fallback);
  const usingEnv = !!envBase && isValidUrl(envBase);
  const effectiveBase = usingEnv ? envBase : fallbackNormalized;

  const looksLocalhost =
    typeof effectiveBase === "string" &&
    (effectiveBase.includes("localhost") || effectiveBase.includes("127.0.0.1"));

  const hostedLikely = !isLocalHost();
  const isUnset = !rawEnvBase;
  const envInvalid = !!rawEnvBase && !isValidUrl(envBase);

  if (envInvalid) {
    // eslint-disable-next-line no-console
    console.warn(
      `[config] REACT_APP_API_BASE appears invalid: "${rawEnvBase}".` +
      " It must be an absolute URL including protocol (e.g., https://example.com:3001). Falling back to " +
      fallbackNormalized
    );
  }

  return {
    effectiveBase,
    isUnset,
    looksLocalhost,
    hostedLikely,
    suggestedHostedBase: suggestHostedApiBase(3001),
    envInvalid,
  };
}
