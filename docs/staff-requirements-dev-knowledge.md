# Staff-requirements — Dev Knowledge Reference

Last updated: 2026-09-03

## Full Docs Location
Detailed documentation lives inside the project itself:
- Architecture: `Staff-requirements/ARCHITECTURE.md`
- Dashboard explainer: `Staff-requirements/DASHBOARD-EXPLAINER.md`

**Read those before making changes. This file is a session quick-reference only.**

---

## Git Remotes — Two Separate Repos

| Repo | Git remote | GitHub |
|---|---|---|
| Staff-requirements (SR-01) | inside `Staff-requirements/` | `digitalmarketing69140951-sys/Staff-requirements` |
| Staff-requirements-02 | inside `piranav_aios/` root | `piranavakanandigitweblanka-lgtm/piranav_aios` |

**Never push SR-01 from the piranav_aios root.** Always `cd Staff-requirements` first.
SR-02 is a subfolder of the main AIOS repo — push from `piranav_aios/` root.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Plain HTML + CSS + vanilla JavaScript (no framework, no build step) |
| Backend | Vercel Serverless Functions (`api/*.js`) — Node.js |
| Database (business) | Neon PostgreSQL — `DATABASE_URL` — LEDSone business data (orders, GSC, Ads) |
| Database (auth) | Neon PostgreSQL — `AUTH_DATABASE_URL` — user accounts, trackers |
| Database (chat) | Neon PostgreSQL — `SJ_CHAT_DB_URL` — AI chat history per staff |
| Hosting | Vercel Hobby plan (`digital-marketing-member-pages`) |
| Deployment | GitHub → GitHub Actions → Vercel Deploy Hook |

**Vercel project ID:** `prj_ziowoLxTbIReqBYx1zVweZZBaBDg`
**Vercel plan constraint:** Hobby plan has a 12-function cap — merging endpoints is required to stay under it.

---

## Critical Rules Before Touching Code

1. **Commit before deploy** — Rule 2. Never run `vercel --prod` from a stale local copy.
2. **12-function Vercel cap** — Never add a new `api/*.js` file without removing or merging an existing one. Merged endpoints use `?store=uk|de` or `?fn=name` routing.
3. **Never commit `.env.local`** — all secrets live in Vercel env settings and `.env.local` (gitignored).
4. **DB pool max: 3** — Neon has hard connection limits. All pools in `api/*.js` use `max: 3`.
5. **No framework, no build step** — everything is plain HTML. Do not introduce React, TypeScript, or any bundler.
6. **Page guards are mandatory** — every staff HTML page must call `/api/auth?action=session` on load and redirect if `staff_key` doesn't match the page.

---

## File Structure

```
Staff-requirements/
  api/
    auth.js                 — login, session check, logout (httpOnly cookie, HMAC-SHA256)
    requirement.js          — main handler for Jefri, Thasitha, Mahima, Dilaksi requirements
    members-api.js          — Kamsi, Sukirtha, Sonya, Sajeepan, Hetheesha, Theekshy, Thivajini
    intel-api.js            — SEO intelligence, organic revenue, admin reports
    sales.js / salesuk.js   — sales data endpoints
    sales25.js / salesde25.js — 2025 historical sales
    staff-id-performance.js — staff ID performance report
    muguntha.js             — Muguntha admin reports
    assign-order.js         — order assignment tool
    generate-staff-attribution.js — attribution generation
    data/                   — frozen JSON snapshots (never re-fetched live)
    scripts/                — one-off DB scripts
  lib/
    groq.js                 — AI model chain (Groq API)
    nvidia.js / openrouter.js — AI provider fallbacks
    feed/                   — Thivajini feed optimization logic
    stpm/                   — Mahima STPM logic
    lens-keywords/          — Sajeepan lens keyword automation
    faq-addition/           — Dilaksi FAQ tool
    jefri-nonmoving/        — Jefri non-moving products logic
    developer-projects/     — developer projects tracker
  pages/
    <name>.html             — one HTML page per staff member
    eod.html / eod-ads.html / eod-seo.html / eod-tec.html — EOD report pages
    sales25.html / salesuk.html / 2025DE.html — sales report pages
    blog-tool/              — blog HTML generator tool
    monitor.html            — staff monitor page
  db/
    migrations/             — SQL migration files (named YYYY-MM-DD_NNN_description.sql)
  ARCHITECTURE.md
  DASHBOARD-EXPLAINER.md
```

---

## API Routing Pattern

All requirements route through two main files:

| File | Handles | Routing key |
|---|---|---|
| `api/requirement.js` | Jefri, Thasitha, Mahima, Dilaksi | `?fn=jefri-req1`, `?fn=mahima-req2` etc. |
| `api/members-api.js` | Kamsi, Sukirtha, Sonya, Sajeepan, Hetheesha, Theekshy, Thivajini | `?member=kamsi&type=req1` etc. |

AI chat also routes through these same files:
- `?fn=NAME-ai-chat` (requirement.js staff)
- `?member=NAME&type=ai-chat` (members-api.js staff)

---

## Authentication Flow

1. User visits → Vercel rewrites `/` → `login.html`
2. POST `/api/auth?action=login` → bcrypt check → HMAC-SHA256 session token → `httpOnly` cookie (`dm_session`, 12h TTL)
3. Every page calls `GET /api/auth?action=session` on load → checks `staff_key` matches → redirect if not
4. `ROLE_LANDING` map in `auth.js` controls where each user lands after login

**Session cookie:** `httpOnly` + `Secure` + `SameSite=Lax` — JS cannot read it.

---

## Environment Variables

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Neon business DB (orders, GSC, Ads) |
| `AUTH_DATABASE_URL` | Neon auth DB (users, trackers) |
| `SJ_CHAT_DB_URL` | Neon chat DB (AI chat history) |
| `FEED_TRACKER_DB_URL` | Neon feed tracker DB (some features) |
| `SESSION_SECRET` | HMAC signing key for session tokens |
| `SHOPIFY_UK_ADMIN_TOKEN` | UK Shopify store |
| `SHOPIFY_ADMIN_TOKEN` | DE Shopify store |
| `SHOPIFY_FR_ADMIN_TOKEN` | FR Shopify store |
| `PGSSL` | `require` = SSL for DB connections |
| `GROQ_API_KEY` | Groq AI (primary AI provider) |
| `EOD_GITHUB_TOKEN` | GitHub token for EOD report writes |

Stored in Vercel env settings. Pulled locally via `.env.local` (gitignored).

---

## AI Assistant System

Every staff page has a floating AI button — a daily work prioritiser.

**Two-stage flow:**
1. Stage 1 — Short task card (auto, on panel open): top 5 tasks for today
2. Stage 2 — Deep-dive: staff picks a task, AI gives full analysis

**AI model chain** (`lib/groq.js`, tries in order):
1. `qwen/qwen3.6-27b` (primary)
2. `llama3-70b-8192`
3. `llama-3.1-8b-instant`
4. `gemma2-9b-it` (fallback)

**Chat history:** saved to `SJ_CHAT_DB_URL`, per-staff table (`kamsi_ai_chat` etc.), filtered by `session_date = CURRENT_DATE` — resets daily.

**Always use `pg.Pool` (not `pg.Client`) inside AI handlers** — parallel `Promise.all` queries will crash a single Client.

---

## Staff Pages — Status

| Staff | HTML page | API file | Notes |
|---|---|---|---|
| Jefri | pages/jefri.html | requirement.js | Full + AI assistant |
| Thasitha | pages/thasitha.html | requirement.js | Full + AI assistant |
| Mahima | pages/mahima.html | requirement.js | Full + AI assistant + STPM |
| Dilaksi | pages/dilaksi.html | requirement.js | Full + FAQ tool + AI assistant |
| Kamsi | pages/kamsi.html | members-api.js | Full + AI assistant |
| Sukirtha | pages/sukirtha.html | members-api.js | Full + AI assistant |
| Sonya | pages/sonya.html | members-api.js | Full + AI assistant |
| Sajeepan | pages/sajeepan.html | members-api.js | Full + lens keywords + AI |
| Hetheesha | pages/hetheesha.html | members-api.js | Full + AI assistant |
| Theekshy | pages/theekshy.html | members-api.js | Full + AI assistant |
| Thivajini | pages/thivajini.html | members-api.js | Full + feed tool + AI |
| Muguntha | pages/muguntha.html | muguntha.js | Admin-level reports |
| Kuberan | pages/kuberan.html | — | Admin overview |
| Piranav | pages/piranav.html | — | Admin overview |

---

## DB Migrations

All schema changes go in `db/migrations/` named `YYYY-MM-DD_NNN_description.sql`.
Run migrations manually via psql against `AUTH_DATABASE_URL` or `DATABASE_URL` as appropriate.
Latest migration: `2026-08-31_023_jefri_sales_last_sale_provenance.sql`

---

## Adding a New Staff Member — Checklist

1. Create `pages/<name>.html` — copy an existing page, change IDs and API URLs
2. Add page guard (session check + staff_key validation) at top of page script
3. Add handler in `requirement.js` or `members-api.js` — search existing handlers for pattern
4. Add `ROLE_LANDING` entry in `auth.js`
5. Add user to auth DB: `INSERT INTO users (username, password_hash, staff_key, role) VALUES (...)`
6. Add AI assistant widget — copy from any existing page, change id prefix and colours
7. Add AI handler in the matching API file
8. Add chat table to `SJ_CHAT_DB_URL`: `CREATE TABLE IF NOT EXISTS <name>_ai_chat (...)`
9. Check Vercel 12-function cap — merge if needed before adding new `api/*.js`

---

## Vercel Deployment

```bash
cd Staff-requirements   # must be in this directory
git add .
git commit -m "..."
git push                # triggers GitHub Actions → Vercel deploy
```

Manual deploy only if GitHub Actions fails:
```bash
vercel --prod           # only after git commit — Rule 2
```
