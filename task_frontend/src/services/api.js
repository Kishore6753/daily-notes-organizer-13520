const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// Developer hint to properly configure backend base URL in non-local environments
if (!process.env.REACT_APP_API_BASE) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] REACT_APP_API_BASE is not set. Falling back to http://localhost:3001. " +
      "If you are not running the backend on localhost, set REACT_APP_API_BASE in .env"
  );
}

// Thin wrapper around fetch with JSON handling and robust error reporting
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  let resp;
  try {
    resp = await fetch(url, { ...options, headers, mode: "cors" });
  } catch (networkErr) {
    const err = new Error(
      `Network error while calling ${method} ${url}: ${networkErr?.message || "Failed to fetch"}`
    );
    err.cause = networkErr;
    err.isNetworkError = true;
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
export async function listNotes(params = {}) {
  /** List/search notes; params include user_id, tag_ids, status, priority, archived, q, page, pageSize */
  const q = new URLSearchParams(params).toString();
  return request(`/notes${q ? `?${q}` : ""}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id */
  return request(`/notes/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note with fields: user_id, title, content, status, priority, tags[] */
  return request("/notes", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note by id */
  return request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  return request(`/notes/${id}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export async function listTags(params = {}) {
  /** List tags; optional q */
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
