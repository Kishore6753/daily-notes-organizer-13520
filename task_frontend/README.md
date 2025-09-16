# Daily Notes Organizer — React Frontend

A modern, lightweight React UI for managing daily notes with tagging, search, and CRUD actions. Styled according to the provided Figma-derived style guide.

## Quick start

1) Install dependencies:
   npm install

2) Configure environment:
   - Copy `.env.example` to `.env` and set the backend URL.
     REACT_APP_API_BASE=http://localhost:3001

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
- Base URL configured via REACT_APP_API_BASE
- Endpoints used: /notes, /notes/{id}, /tags, /tags/{id}, and root health `/`

## Styling

- CSS variables and component tokens are defined in `src/styles/theme.css`
- Components adhere to spacing, typography, and state tokens from the style guide
