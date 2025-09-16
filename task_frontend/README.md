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

   Notes:
   - If `REACT_APP_API_BASE` is not set, the app falls back to `http://localhost:3001` for local development.
   - On hosted environments, pointing to localhost will fail due to network/CORS; the UI shows a banner and the console logs a warning with a suggested base.

3) Run the app:
   npm start

The app will be available at http://localhost:3000

## Features implemented

- Fixed sidebar and top search bar shell
- Dashboard with To‑Do list, progress rings, and completed tasks
- Notes page with list, global search, create/edit modal, delete, toggle complete
- Tags management (create, rename, recolor, delete)
- Categories overview using tags with previewed notes per category
- Accessible components with focus rings and semantic roles

## API

The frontend talks to the Express backend defined by the OpenAPI at `task_backend`:
- Base URL configured via REACT_APP_API_BASE (read at build/start; normalized and validated by `src/utils/config.js`)
- Endpoints used: /notes, /notes/{id}, /tags, /tags/{id}, and root health `/`

## Troubleshooting

- "TypeError: Failed to fetch" when creating a note
  - Ensure `REACT_APP_API_BASE` is set to the correct backend origin (protocol + host + port).
  - Check browser console for CORS/network errors.
  - Our fetch layer surfaces clearer errors, safely parses empty responses, and warns on misconfiguration.
  - The UI banner (`ConfigWarningBanner`) appears when the app is hosted but REACT_APP_API_BASE is unset or points to localhost.

## Styling

- CSS variables and component tokens are defined in `src/styles/theme.css`
- Components adhere to spacing, typography, and state tokens from the style guide
