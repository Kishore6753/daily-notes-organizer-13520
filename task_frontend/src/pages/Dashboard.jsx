import React, { useEffect, useMemo, useState } from "react";
import ProgressRing from "../components/ProgressRing";
import TaskRow from "../components/TaskRow";
import { listNotes, updateNote, deleteNote } from "../services/api";

/** Dashboard with welcome, todo list, summary, completed tasks */
export default function Dashboard({ globalQuery }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listNotes({ q: globalQuery || "" });
      setNotes(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setNotes([]);
      setError(e?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [globalQuery]);

  const completed = notes.filter(n => n.status === "completed");
  const inProgress = notes.filter(n => n.status === "in_progress");
  const notStarted = notes.filter(n => n.status === "not_started");
  const total = notes.length || 1;

  async function toggleComplete(note) {
    const newStatus = note.status === "completed" ? "not_started" : "completed";
    await updateNote(note.id, { status: newStatus });
    refresh();
  }

  async function handleDelete(note) {
    await deleteNote(note.id);
    refresh();
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <div className="h1">Welcome back 👋</div>
        <div className="meta">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
      </div>

      <div className="grid-2-1">
        <section className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="h2">To-Do</div>
            <div className="chips">
              <span className="chip chip-st-not_started">All</span>
              <span className="chip chip-st-in_progress">Active</span>
              <span className="chip chip-st-completed">Completed</span>
            </div>
          </div>
          <div role="list" aria-busy={loading}>
            {loading ? <div className="meta">Loading...</div> : null}
            {error ? <div className="meta" style={{ color: "var(--danger)" }}>{error}</div> : null}
            {!loading && !error && notes.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div className="h3" style={{ marginBottom: 8 }}>No notes yet</div>
                <div className="meta">Create your first note to get started</div>
              </div>
            ) : null}
            {!loading && notes.map(n => (
              <div key={n.id} style={{ marginBottom: 12 }}>
                <TaskRow
                  note={n}
                  onToggleComplete={toggleComplete}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card" aria-label="Task Status Summary">
          <div className="h2" style={{ marginBottom: 12 }}>Task Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <ProgressRing value={Math.round((completed.length / total) * 100)} color="var(--progress-completed)" label="Completed" />
            <ProgressRing value={Math.round((inProgress.length / total) * 100)} color="var(--progress-inprogress)" label="In Progress" />
            <ProgressRing value={Math.round((notStarted.length / total) * 100)} color="var(--progress-notstarted)" label="Not Started" />
          </div>
          <div className="meta" style={{ marginTop: 12 }}>Based on tasks in the last 7 days</div>

          <div className="hr" />

          <div className="h2" style={{ marginBottom: 12 }}>Completed Tasks</div>
          <div style={{ display: "grid", gap: 12 }}>
            {completed.slice(0, 5).map(n => (
              <div key={n.id} className="row">
                <div style={{ gridColumn: "1 / span 3" }}>
                  <div className="h3" style={{ color: "var(--success)" }}>✅ {n.title}</div>
                  <div className="meta">Completed: {new Date(n.updated_at || n.created_at || Date.now()).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {completed.length === 0 ? <div className="meta">No completed notes yet.</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
