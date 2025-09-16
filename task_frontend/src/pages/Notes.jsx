import React, { useEffect, useState } from "react";
import { createNote, deleteNote, listNotes, updateNote } from "../services/api";
import TaskRow from "../components/TaskRow";
import Modal from "../components/Modal";
import NoteForm from "../components/NoteForm";

/** Notes CRUD page */
export default function Notes({ globalQuery }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listNotes({ q: globalQuery || "" });
      setNotes(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setNotes([]);
      if (e?.status === 401) setError("Please sign in to view your notes.");
      else setError(e?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [globalQuery]);

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }
  function openEdit(note) {
    setEditing(note);
    setShowModal(true);
  }

  async function onSubmit(form) {
    if (editing) {
      await updateNote(editing.id, form);
    } else {
      await createNote({ ...form });
    }
    setShowModal(false);
    setEditing(null);
    refresh();
  }

  async function onToggleComplete(note) {
    const newStatus = note.status === "completed" ? "not_started" : "completed";
    await updateNote(note.id, { status: newStatus });
    refresh();
  }

  async function onDelete(note) {
    await deleteNote(note.id);
    refresh();
  }

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="h1">My Notes</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary">Import</button>
          <button className="btn btn-primary" onClick={openCreate}>Add Note</button>
        </div>
      </div>

      <section className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button className="chip chip-st-not_started">All</button>
          <button className="chip chip-st-in_progress">Active</button>
          <button className="chip chip-st-completed">Completed</button>
        </div>

        <div role="list" aria-busy={loading} style={{ display: "grid", gap: 12 }}>
          {loading ? <div className="meta">Loading...</div> : null}
          {error ? <div className="meta" style={{ color: "var(--danger)" }}>{error}</div> : null}
          {!loading && !error && notes.length === 0 ? <div className="meta">You’re all caught up! Add a note.</div> : null}
          {!loading && notes.map(n => (
            <TaskRow
              key={n.id}
              note={n}
              onToggleComplete={onToggleComplete}
              onEdit={openEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </section>

      {showModal ? (
        <Modal
          title={editing ? "Edit Note" : "New Note"}
          onClose={() => { setShowModal(false); setEditing(null); }}
          footer={null}
        >
          <NoteForm
            initial={editing || {}}
            onCancel={() => { setShowModal(false); setEditing(null); }}
            onSubmit={onSubmit}
          />
        </Modal>
      ) : null}
    </div>
  );
}
