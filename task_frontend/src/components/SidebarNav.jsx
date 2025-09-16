import { NavLink } from "react-router-dom";

/** Sidebar navigation per style guide */
export default function SidebarNav() {
  const items = [
    { to: "/", label: "Dashboard" },
    { to: "/notes", label: "My Notes" },
    { to: "/tags", label: "Tags" },
    { to: "/categories", label: "Categories" }
  ];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="logo">Daily Notes</div>
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                end={it.to === "/"}
                to={it.to}
                className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
                aria-label={it.label}
              >
                <span style={{ width: 20, height: 20, background: "transparent", borderRadius: 4, border: "1px solid var(--border-muted)" }} />
                <span>{it.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
