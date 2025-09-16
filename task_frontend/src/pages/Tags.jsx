import React, { useEffect, useState } from "react";
import { createTag, deleteTag, listTags, updateTag } from "../services/api";

/** Tags management */
export default function Tags() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6C8BFF");

  async function refresh() {
    try {
      const data = await listTags();
      setTags(Array.isArray(data) ? data : (data?.items || []));
    } catch {
      setTags([]);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await createTag({ name, color });
    setName("");
    refresh();
  }

  async function onRename(tag, newName) {
    await updateTag(tag.id, { name: newName, color: tag.color });
    refresh();
  }

  async function onRecolor(tag, newColor) {
    await updateTag(tag.id, { name: tag.name, color: newColor });
    refresh();
  }

  async function onDelete(tag) {
    await deleteTag(tag.id);
    refresh();
  }

  return (
    <div className="container">
      <div className="h1" style={{ marginBottom: 16 }}>Tags</div>

      <section className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px", gap: 12 }}>
          <input className="input" placeholder="Tag name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" type="color" value={color} onChange={(e)=>setColor(e.target.value)} aria-label="Tag color" />
          <button className="btn btn-primary" type="submit">Create Tag</button>
        </form>
      </section>

      <section className="card">
        <div className="h2" style={{ marginBottom: 12 }}>All Tags</div>
        <div className="grid-cards">
          {tags.map(t => (
            <div key={t.id} className="card" style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="h3">{t.name}</div>
                <span className="badge">#{t.id}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 999, background: t.color || "#6C8BFF", border: "1px solid rgba(0,0,0,0.2)" }} />
                <input type="color" className="input" value={t.color || "#6C8BFF"} onChange={(e)=>onRecolor(t, e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" defaultValue={t.name} onBlur={(e)=>onRename(t, e.target.value)} aria-label={`Rename tag ${t.name}`} />
                <button className="btn btn-secondary" onClick={()=>onDelete(t)}>Delete</button>
              </div>
            </div>
          ))}
          {tags.length === 0 ? <div className="meta">No tags yet.</div> : null}
        </div>
      </section>
    </div>
  );
}
