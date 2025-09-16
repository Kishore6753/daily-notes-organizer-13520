import React, { useEffect, useState } from "react";
import { listNotes, listTags } from "../services/api";

/** Categories visualization using tags as categories */
export default function Categories() {
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    listTags().then(d => setTags(Array.isArray(d) ? d : (d?.items || []))).catch(()=>setTags([]));
    listNotes().then(d => setNotes(Array.isArray(d) ? d : (d?.items || []))).catch(()=>setNotes([]));
  }, []);

  function notesForTag(tagId) {
    return notes.filter(n => (n.tags || []).some(t => t.id === tagId)).slice(0, 3);
  }

  return (
    <div className="container">
      <div className="h1" style={{ marginBottom: 16 }}>Task Categories</div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="h2">Categories</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary">New Category</button>
            <button className="btn btn-secondary">Reorder</button>
          </div>
        </div>
      </section>

      <div className="grid-cards">
        {tags.map(tag => (
          <div key={tag.id} className="card" tabIndex={0}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: tag.color || "#6C8BFF" }} />
                <div className="h3">{tag.name}</div>
              </div>
              <span className="badge">{notesForTag(tag.id).length}</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {notesForTag(tag.id).map(n => (
                <div key={n.id} className="row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div className="h3">{n.title}</div>
                  <span className="chip chip-st-in_progress" style={{ justifySelf: "end" }}>{n.status}</span>
                </div>
              ))}
              {notesForTag(tag.id).length === 0 ? <div className="meta">No notes in this category.</div> : null}
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-secondary">View all</button>
            </div>
          </div>
        ))}
        {tags.length === 0 ? <div className="meta">No categories yet. Create Tag to start categorizing notes.</div> : null}
      </div>
    </div>
  );
}
