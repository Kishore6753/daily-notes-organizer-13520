import React from "react";
import TagChip from "./TagChip";

/** Single note row */
export default function TaskRow({ note, onToggleComplete, onEdit, onDelete }) {
  const completed = note.status === "completed";
  const priorityClass =
    note.priority === "high" ? "chip-pri-high" :
    note.priority === "moderate" ? "chip-pri-moderate" : "chip-pri-low";
  const statusClass = `chip-st-${note.status}`;

  return (
    <div className="row" role="listitem">
      <button
        className={`checkbox ${completed ? "checked" : ""}`}
        aria-label={completed ? "Mark not completed" : "Mark completed"}
        onClick={() => onToggleComplete?.(note)}
      >
        {completed ? "✓" : ""}
      </button>

      <div style={{ display: "grid", gap: 6 }}>
        <div className="h3" style={{ textDecoration: completed ? "line-through" : "none", color: completed ? "var(--text-tertiary)" : "var(--text-primary)" }}>
          {note.title}
        </div>
        {note.content ? (
          <div style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
            {note.content}
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="meta">Updated: {new Date(note.updated_at || note.created_at || Date.now()).toLocaleString()}</span>
          {note.tags?.map(t => <TagChip key={t.id || t.name} tag={t} />)}
        </div>
      </div>

      <div className="chips" style={{ justifySelf: "end" }}>
        <span className={`chip ${priorityClass}`}>{note.priority || "low"}</span>
        <span className={`chip ${statusClass}`}>{note.status || "not_started"}</span>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button className="btn btn-icon" aria-label="Edit note" onClick={() => onEdit?.(note)}>✏️</button>
        <button className="btn btn-icon" aria-label="Delete note" onClick={() => onDelete?.(note)}>🗑️</button>
      </div>
    </div>
  );
}
