# dm-dashboard — Dev Knowledge Reference

Last updated: 2026-09-03

## Full Docs Location
All detailed documentation lives inside the project itself:
- Architecture: `dm-dashboard/docs/ARCHITECTURE.md`
- Database schema: `dm-dashboard/docs/DATABASE.md`
- Setup/ports: `dm-dashboard/docs/SETUP.md`
- Deployment: `dm-dashboard/docs/DEPLOYMENT.md`

**Read those before making any changes. This file is a session quick-reference only.**

---

## Git Remote
```
cd dm-dashboard
git remote -v  → websitetecteam-arch/dm-dashboard
```
**Never push dm-dashboard from the piranav_aios root.** Always `cd dm-dashboard` first.

---

## Tech Stack

| Layer | Tech | Port |
|---|---|---|
| Frontend | React 19 + Vite (plain JS, no TypeScript) | localhost:5199 |
| Backend | Python + FastAPI (uvicorn) | localhost:8499 |
| App DB | PostgreSQL 18 local (`dm_dashboard` database) | localhost:5432 |
| Business DB | Shared business Postgres (read-only) | separate host — see `.env` |

Frontend runs via **VS Code Dev Tunnel** (`.devtunnels.ms`) — NOT on Vercel.

---

## Critical Rules Before Touching Code

1. **Never run backend with `--reload`** — causes stale responses after .env/code edits. Always kill and restart fully.
2. **Business DB pool is capped at max_size=4** — hard 10-connection limit shared with other apps. Never raise pool size.
3. **Panels stay mounted, never unmount** — toggled via CSS class (`dm-tabpanel-active`). Any polling must check visibility first or it leaks. See `SalesSyncMonitor.jsx` for the pattern.
4. **Slow endpoints need 10-minute cache** — use `_reqN_cache` dict pattern. Every full Shopify scan must be cached. See `kamsi.py` for the pattern.
5. **Commit to dm-dashboard repo before any deploy** — Rule 2 applies here too.

---

## Frontend Structure

```
src/
  App.jsx              — login + routing (role-based: admin → AdminLayout, staff_key → <Name>Layout)
  components/
    Sidebar.jsx        — DashboardShell (shared by ALL modules — never build a new sidebar)
    Overview.jsx       — shared home tab (used by every staff module)
  jefri/
    jefri.css          — de facto shared content stylesheet (jreq-* classes) — ALL modules import this
    JefriLayout.jsx    — template for all staff modules
  admin/               — AdminLayout.jsx + all admin report pages
  taskRegistry.js      — single source of truth for User Access Management grants
  <name>/              — one folder per staff member (same shape as jefri/)
```

**CSS classes to reuse:** `jreq-header`, `jreq-cards`, `jreq-tablebox`, `jreq-pill-{green,blue,purple,grey}`
**Never create a new stylesheet per staff module** unless jreq-* genuinely can't cover it.

---

## Backend Structure

```
backend/app/
  main.py              — FastAPI entrypoint, all routers registered here
  db.py                — get_conn() (app DB) + get_business_conn() (business DB, read-only)
  auth.py              — JWT login endpoint
  shopify_client.py    — shared Shopify Admin API client (ledsone_de, ledsone_uk, ledsone_fr)
  google_client.py     — shared GA4 + Search Console client (added 2026-08-24)
  <name>.py            — one router per staff member
  <name>_ai.py         — AI assistant endpoints per staff member
```

---

## Database — App DB Tables

| Table | Purpose |
|---|---|
| `public.users` | Login accounts (id, username, password_hash, role, staff_key) |
| `sales_cache.live_snapshots` | Current month sales cache |
| `sales_cache.historical_snapshots` | Past months sales cache (never overwritten) |
| `sales_cache.employee_performance_snapshots` | Employee performance cache |
| `sales_cache.sync_control` | Pause/resume sync per scope |
| `public.hetheesha_product_snapshot` | Hetheesha Req1 fix tracker |
| `public.feed_optimization_tracker` | Sajeepan Req4 tracker |

---

## Shopify Stores Configured

| Store | Env var | Used by |
|---|---|---|
| ledsone.de | `SHOPIFY_ADMIN_TOKEN` | Jefri, Mahima |
| ledsone.co.uk | `SHOPIFY_UK_ADMIN_TOKEN` | Kamsi, Sonya Req7, Admin |
| ledsone.fr | `SHOPIFY_FR_ADMIN_TOKEN` | Hetheesha (no `read_content` scope) |

---

## Staff Modules — Status

| Staff | Module folder | Backend file | Status |
|---|---|---|---|
| Jefri | src/jefri/ | jefri.py | Full |
| Kamsi | src/kamsi/ | kamsi.py | Full |
| Mahima | src/mahima/ | mahima.py | Full |
| Dilaksi | src/dilaksi/ | dilaksi.py | Full |
| Thasitha | src/thasitha/ | thasitha.py | Full |
| Sukirtha | src/sukirtha/ | sukirtha.py | Full |
| Sonya | src/sonya/ | sonya.py | Full |
| Sajeepan | src/sajeepan/ | sajeepan.py | Req5 deferred (needs SERPAPI_KEY) |
| Theekshy | src/theekshy/ | theekshy.py | Full 5/5 |
| Hetheesha | src/hetheesha/ | hetheesha.py | Full 5/5 |
| Thivajini | src/thivajini/ | thivajini.py | 4/5 (Req5 not ported) |

---

## Adding a New Staff Member — Checklist
1. Read old `pages/<name>.html` — find every `fetch()` call
2. Read matching handlers in old `api/requirement.js`
3. Backend: create `app/<name>.py` — one endpoint per requirement, with slow-scan cache
4. Frontend: create `src/<name>/` — `<Name>Layout.jsx` + `pages/ReqN.jsx`, import `../jefri/jefri.css`
5. Wire `staff_key` branch into `App.jsx` + `STAFF_LAYOUTS`
6. Add login: `INSERT INTO users ...` with bcrypt hash (12 rounds)
7. Update `admin/pages/RequirementPages.jsx` STAFF_PAGES list (`built: true`)

---

## Credentials Location
Real passwords and tokens: `dm-dashboard/api/credentials.md` (gitignored — never commit)
Env shape: `dm-dashboard/backend/.env.example`
