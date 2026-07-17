# Documentation — L2 Albion Web Portal

Guide for AI agents working on this repo. Read this before changing code.

## What this project is

A **web portal for a Lineage 2 private server ("L2 Albion")** built on the **aCis (L2J-based) datapack**. Players register a portal account, get linked to one in-game account, manage it, and browse rankings. Admins can inspect users/characters and drop items into a character's inventory or warehouse directly in the DB.

Two halves:
- **Frontend** (`src/`) — React SPA players see in the browser.
- **Backend** (`backend_service/`) — FastAPI service that talks to the aCis **MariaDB** database and the game server (GS).

## Architecture at a glance

```
Browser (React, :20201)
   │  fetch("/api/...")
   ▼
Vite dev server (:20201)  ── proxies /api ──►  FastAPI (:20200)
                                            │
                                            ├─ MariaDB  (aCis: portal_users, accounts, characters, items ...)
                                            └─ Game Server TCP ping (:7777, configurable)
```

- `vite.config.js` proxies `/api` → `http://localhost:20200`. The frontend never calls the backend by host; it always uses relative `/api/...` paths.
- CORS on the backend allows only `http://localhost:20201` (`backend_service/app.py:67`).

## Stack

**Frontend**
- React 19, plain **JSX (no TypeScript)**.
- Vite 8 dev/build.
- Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"` + `@theme` in `src/index.css`). Custom palette: `dark-900..600`, `orange-500..700`, fonts `display`/`body`. No `tailwind.config.js`.
- `react-router-dom` v7 (routes in `src/App.jsx`).
- `react-hot-toast` for toasts.

**Backend**
- FastAPI + Uvicorn, Python.
- `mariadb` connector with a **connection pool** (`backend_service/app.py:31`).
- Auth: **JWT (PyJWT, HS256)** in `Authorization: Bearer` header; passwords hashed with **bcrypt**.
- Two extra routers included from sibling modules: `updater` (`/updater`) and `downloads` (`/api/download`).

## How to run

Easiest: `start.bat` (Windows). It kills anything on ports 20200/20201, then launches the backend (`python app.py` in `backend_service/`) and the frontend (`npm run dev -- --port 20201`) in two terminals.

Manual:
```bash
cd backend_service && pip install -r requirements.txt && python app.py   # :20200
npm install && npm run dev -- --port 20201                                # :20201
```
Lint: `npm run lint` (oxlint). Build: `npm run build`.

## Environment variables (all have defaults; set for real deploys)

| Var | Default | Purpose |
|-----|---------|---------|
| `JWT_SECRET` | dev placeholder | JWT signing key — **change in prod**. |
| `DB_HOST/PORT/USER/PASS/NAME` | localhost/3306/root/root/acis | MariaDB connection. |
| `DB_POOL_SIZE` | 5 | MariaDB pool size. |
| `GS_HOST/GS_PORT` | 127.0.0.1/7777 | Game server for the TCP-ping status check. |
| `ITEM_XML_DIR` | "" | aCis datapack `data/xml/items` dir; if set, loads item-id→name map for the admin UI. Empty = no names. |
| `UPDATER_DIR` | `C:\Users\frank\...\updater` | Patch file tree served by `/updater`. |
| `LAUNCHER_FILE` | `...\L2Launcher.exe` | Launcher binary served by `/api/download/launcher`. |

These paths in `updater.py`/`downloads.py` point at the owner's local machine — change them via env vars, not by editing code.

## Backend API surface (`backend_service/app.py`)

Auth-required routes use the `Depends(get_current_user)` dependency. `get_current_user` decodes the JWT and returns the `portal_users.id`. Admin routes add `require_admin` (checks `accounts.access_level > 0` via `portal_l2_links`).

| Method & path | Auth | Notes |
|---------------|------|-------|
| `POST /api/register` | – | email + password (≥6, confirm match). |
| `POST /api/login` | – | returns `token`, `email`, `is_admin`. |
| `GET /api/me` | user | current email + admin flag. |
| `GET /api/game-accounts` | user | list linked L2 accounts. |
| `POST /api/game-accounts` | user | create L2 account; **deletes any existing one first** (one-per-portal-user rule). |
| `DELETE /api/game-accounts/{login}` | user | delete own L2 account + link. |
| `GET /api/dashboard` | user | characters on the linked account. |
| `GET /api/rankings?sort=level|pvp|pk` | – | top 50. |
| `GET /api/server-status` | – | GS TCP ping + online count. |
| `POST /api/change-password` | user | old+new password. |
| `GET /api/admin/check` | admin | admin gate check. |
| `GET /api/admin/users` | admin | paginated users. |
| `GET /api/admin/characters` | admin | paginated, searchable by name. |
| `GET /api/admin/users/{id}/characters` | admin | chars for a user. |
| `GET /api/admin/characters/{obj_id}/items` | admin | that char's items. |
| `POST /api/admin/characters/{obj_id}/items` | admin | **give item** (INVENTORY/WAREHOUSE, offline-only). |
| `DELETE /api/admin/items/{object_id}` | admin | remove item (owner offline-only). |
| `GET /updater/files.xml` | – | patch manifest. |
| `POST /updater/download` | – | serve one `.bz2` patch file (traversal-guarded). |
| `GET /api/download/launcher` | – | serve launcher binary. |

### Item-giving details (read before touching)
- `GiveItemRequest` validates count (1..2e9) and enchant (0..65535).
- Reserves the next `object_id` under `FOR UPDATE` row lock so concurrent gives don't collide (`backend_service/app.py:704`). The aCis **IdFactory** loads all existing object_ids at GS startup, so inserted ids are never reused — do not change this without understanding IdFactory.
- Blocks if the character is online (GS owns the item state).

## Database model (aCis + portal tables)

Portal-specific tables (created by your DB setup, not by this repo):
- `portal_users` — email auth: `id, email, password (bcrypt), created_at, updated_at`.
- `portal_l2_links` — join `portal_user_id ↔ l2_account (accounts.login)`. One per user.
- `accounts` — aCis login table; `access_level > 0` = admin. `created_by_portal` flags portal-made rows.
- `characters` — aCis char table; `account_name = accounts.login`, keyed by `obj_Id`.
- `items` — `owner_id = characters.obj_Id`, keyed by `object_id`.

Class id → name is a hardcoded map `CLASS_NAMES` in `app.py:76` (L2 class ids). Keep it in sync if you add classes.

## Frontend structure

- `src/main.jsx` — React root + StrictMode.
- `src/App.jsx` — `BrowserRouter` + all routes + `<Toaster>`.
- `src/lib/api.js` — **the auth layer**. `getToken`, `authHeader`, `setAuth`, `clearAuth`, `isAdmin`, and `apiFetch` (thin fetch wrapper that throws on non-2xx with parsed `detail`). Pages mix direct `fetch` and `apiFetch` — prefer `apiFetch` for new code.
- `src/pages/` — `Home, Login, Register, Dashboard, Rankings, About, Admin`.
- `src/components/` — `Navbar, Footer, Hero, ServerStatus, About`.
- Styling: Tailwind v4 utility classes + the `@theme` tokens. Dark/neutral palette with orange accent. Most components are large single-file JSX with inline state — that is the established style; match it.

Auth flow: `setAuth(token, email, isAdmin)` stores in `localStorage` and fires a `window` `auth-change` event; `Navbar` listens and re-fetches `/api/me`. Logout calls `clearAuth`.

## Conventions to respect

- **No comments unless asked** is for AI output, not the codebase — the repo already has helpful `# ponytail:` comments; leave them, don't strip them. They document real trade-offs (pool, id reservation, one-account rule).
- Backend uses `get_db()` + a `try/except/finally` close pattern everywhere. Reuse it; don't leave connections open.
- Errors return FastAPI `HTTPException` with a `detail` string the frontend shows as a toast.
- One portal user = one L2 account (creating a new one deletes the old). Don't "fix" this without confirming it's intended.
- Item edits require the character offline — preserve that guard.
- Don't hardcode the owner's local `C:\Users\frank\...` paths; they only appear as env-var defaults in `updater.py`/`downloads.py`.

## Quick orientation for common tasks

- **Add an API endpoint:** add a route function in `app.py` (or a new router included at the bottom). Use `Depends(get_current_user)` / `require_admin` for protection. Mirror the connection try/finally pattern.
- **Add a page:** create `src/pages/Foo.jsx`, register it in `src/App.jsx` `<Routes>`, and (if linked) add a `Navbar` `<Link>`.
- **Add a protected page:** check `localStorage.getItem('token')` in `useEffect` and `navigate('/login')` if missing (see `Dashboard.jsx`).
- **Change item-giving / admin DB logic:** read the embedded `ponytail:` notes in `app.py` first — they explain the IdFactory constraint.
- **Build a client patch:** `python backend_service/build_patch.py --source <L2 client dir> --output <updater dir>`.
