const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// Thin wrapper around fetch with JSON handling and basic error reporting
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const resp = await fetch(url, { ...options, headers });
  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;
  if (!resp.ok) {
    const error = new Error(data?.message || `Request failed: ${resp.status}`);
    error.status = resp.status;
    error.data = data;
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
