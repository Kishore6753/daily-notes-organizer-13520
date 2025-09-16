# Daily Notes Organizer — React Frontend

A modern, lightweight React UI for managing daily notes with tagging, search, and CRUD actions. Styled according to the provided Figma-derived style guide.

## Quick start

1) Install dependencies:
   npm install

2) Configure environment:
   - Copy `.env.example` to `.env` and set the backend URL in `REACT_APP_API_BASE`.
   - Make sure it matches the actual backend host and protocol and does NOT have a trailing slash.
     For local dev: REACT_APP_API_BASE=http://localhost:3001
     For hosted env (example): REACT_APP_API_BASE=https://vscode-internal-36885-beta.beta01.cloud.kavia.ai:3001

   Notes (Updated):
   - Local development:
     - If `REACT_APP_API_BASE` is unset or invalid, the app falls back to `http://localhost:3001`.
   - Hosted/cloud/preview environments (not on localhost/127.0.0.1):
     - If `REACT_APP_API_BASE` is unset, invalid, or points to localhost, the app will automatically compute and use:
       `https://<current-hostname>:3001` (protocol preserved, port 3001).
     - There is no fallback to `http://localhost:3001` in hosted environments.
     - The console will show a warning when a runtime rewrite occurs. If the rewrite fails, an error is logged and the in‑app warning may appear.

3) Run the app:
   npm start

The app will be available at http://localhost:3000

## Authentication

- New pages: Login (`/login`) and Signup (`/signup`)
- JWT storage: on successful login, a JWT token and user are persisted in localStorage under `auth:token` and `auth:user`.
- Authorization: all note endpoints automatically include `Authorization: Bearer <token>` when a token is present.
- Protected routes: all app routes are protected and redirect to `/login` if unauthenticated.
- Logout: click "Log out" in the header to clear credentials and return to the login page.
- Notes visibility: notes are fetched for the currently logged-in user (user_id is derived by the backend from JWT; the frontend does not send user_id).

## Features implemented

- Fixed sidebar and top search bar shell
- Dashboard with To‑Do list, progress rings, and completed tasks
- Notes page with list, global search, create/edit modal, delete, toggle complete
- Tags management (create, rename, recolor, delete)
- Categories overview using tags with previewed notes per category
- Accessible components with focus rings and semantic roles
- Authentication (signup, login, logout), protected routes, and Authorization headers

## API

The frontend talks to the Express backend defined by the OpenAPI at `task_backend`:
- Base URL configured via REACT_APP_API_BASE, normalized and validated by `src/utils/config.js`
- Hosted behavior: runtime rewrite to `https://<hostname>:3001` if env is unset/invalid/localhost-like
- Endpoints used: `/login`, `/signup`, `/notes`, `/notes/{id}`, `/tags`, `/tags/{id}`, and root health `/`

## Troubleshooting

- "TypeError: Failed to fetch" when calling the API
  - Local dev: ensure the backend is running on http://localhost:3001 or set `REACT_APP_API_BASE` accordingly.
  - Hosted/cloud: the app auto-uses `https://<hostname>:3001` if misconfigured. Verify your backend is reachable at that origin and CORS allows the frontend origin.
  - Check browser console for any `[config]` warnings/errors.
  - The UI banner (`ConfigWarningBanner`) appears when hosted and configuration is likely incorrect. It automatically hides once the backend health probe succeeds.
- 401 Unauthorized
  - Sign in at `/login` first. The notes endpoints require a valid JWT.

## Styling

- CSS variables and component tokens are defined in `src/styles/theme.css`
- Components adhere to spacing, typography, and state tokens from the style guide
