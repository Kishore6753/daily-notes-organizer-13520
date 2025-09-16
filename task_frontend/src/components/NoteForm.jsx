import React, { useEffect, useState } from "react";
import { listTags } from "../services/api";

/** Form for creating/updating a note */
export default function NoteForm({ initial = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [priority, setPriority] = useState(initial.priority || "moderate");
  const [status, setStatus] = useState(initial.status || "not_started");
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(
    (initial.tags || []).map(t => t.id).filter(Boolean)
  );

  useEffect(() => {
    listTags().then(setAllTags).catch(() => setAllTags([]));
  }, []);

  function toggleTag(id) {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ title, content, priority, status, tags: selectedTagIds }); }}
    >
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" className="input" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="content">Content</label>
        <textarea id="content" value={content} onChange={(e)=>setContent(e.target.value)} />
      </div>
      <div className="field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" className="select" value={priority} onChange={(e)=>setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" className="select" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Tags</label>
        <div className="chips">
          {allTags.map(t => (
            <button
              key={t.id}
              type="button"
              className="btn btn-secondary"
              aria-pressed={selectedTagIds.includes(t.id)}
              onClick={() => toggleTag(t.id)}
            >
              <span style={{
                width: 10, height: 10, borderRadius: 999, background: t.color || "var(--brand)", display: "inline-block"
              }} />
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
