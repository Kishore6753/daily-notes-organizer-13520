import { getApiConfig } from "../utils/config";

const {
  effectiveBase: API_BASE,
  isUnset,
  looksLocalhost,
  hostedLikely,
  suggestedHostedBase,
  rewritten,
  dynamicInferenceActive,
} = getApiConfig();

// Developer hints: avoid misleading messages if dynamic inference is being used
if (hostedLikely && (isUnset || looksLocalhost) && !dynamicInferenceActive) {
  // eslint-disable-next-line no-console
  console.warn(
    `[config] Potential API base misconfiguration. effectiveBase="${API_BASE}". ` +
      `Hosted=${hostedLikely}. Consider setting REACT_APP_API_BASE=${suggestedHostedBase}`
  );
} else if (dynamicInferenceActive) {
  // eslint-disable-next-line no-console
  console.debug(
    `[config] Dynamic API base in effect (${rewritten ? "rewritten" : "env"}): ${API_BASE}`
  );
} else if (!hostedLikely && isUnset) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] REACT_APP_API_BASE is not set. Falling back to http://localhost:3001 for local development."
  );
}

/**
 * Token accessor for attaching Authorization header.
 * Reads token from localStorage to avoid circular imports with context.
 */
function getAuthToken() {
  try {
    return window.localStorage.getItem("auth:token") || "";
  } catch {
    return "";
  }
}

// Thin wrapper around fetch with JSON handling and robust error reporting
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let resp;
  try {
    resp = await fetch(url, { ...options, headers, mode: "cors" });
  } catch (networkErr) {
    const err = new Error(
      `Network error while calling ${method} ${url}: ${networkErr?.message || "Failed to fetch"}`
    );
    err.cause = networkErr;
    err.isNetworkError = true;
    // Attach helpful context for hosted misconfig
    err.hints = {
      effectiveApiBase: API_BASE,
      hostedLikely,
      suggestedHostedBase,
    };
    // eslint-disable-next-line no-console
    console.error("[api] Network error", err);
    throw err;
  }

  // Safely parse JSON only when present
  const contentType = resp.headers.get("content-type") || "";
  let data = null;
  let text = "";
  try {
    text = await resp.text();
    if (text && contentType.includes("application/json")) {
      data = JSON.parse(text);
    } else if (text && !contentType.includes("application/json")) {
      // Return raw text when not JSON to avoid JSON.parse errors
      data = { raw: text };
    } else {
      data = null;
    }
  } catch (parseErr) {
    const err = new Error(
      `Response parse error from ${method} ${url}: ${parseErr?.message || "Invalid JSON"}`
    );
    err.cause = parseErr;
    err.responseStatus = resp.status;
    err.responseText = text;
    throw err;
  }

  if (!resp.ok) {
    const error = new Error(
      data?.message ||
        `Request failed: ${resp.status} ${resp.statusText} for ${method} ${url}`
    );
    error.status = resp.status;
    error.data = data;
    error.url = url;
    error.method = method;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Check backend health */
  return request("/");
}

// PUBLIC_INTERFACE
export async function loginRequest(payload) {
  /** Auth: login, returns { token, user } */
  return request("/login", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function signupRequest(payload) {
  /** Auth: signup, returns created user; may include token+user depending on backend */
  return request("/signup", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function listNotes(params = {}) {
  /** List/search notes for the logged-in user via JWT; supports tag_ids, status, priority, archived, q, pagination */
  const q = new URLSearchParams(params).toString();
  return request(`/notes${q ? `?${q}` : ""}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id (requires auth) */
  return request(`/notes/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note (requires auth). Backend derives user_id from JWT; do not send user_id. */
  const { user_id, ...rest } = payload || {};
  return request("/notes", { method: "POST", body: JSON.stringify(rest) });
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note by id (requires auth) */
  return request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id (requires auth) */
  return request(`/notes/${id}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export async function listTags(params = {}) {
  /** List tags (public or protected depending on backend) */
  const q = new URLSearchParams(params).toString();
  return request(`/tags${q ? `?${q}` : ""}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createTag(payload) {
  /** Create tag {name, color} */
  return request("/tags", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function updateTag(id, payload) {
  /** Update tag by id */
  return request(`/tags/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function deleteTag(id) {
  /** Delete tag by id */
  return request(`/tags/${id}`, { method: "DELETE" });
}
