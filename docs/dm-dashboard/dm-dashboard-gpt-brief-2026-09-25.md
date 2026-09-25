# DM Dashboard — GPT Briefing [2026-09-25]

## 1. What It Is

A private internal dashboard system built for Piranav's digital marketing team. Each staff member gets their own module (React frontend + Python FastAPI backend). It replaced the old `Staff-requirements` / `Staff-requirements-02` Vercel + Neon + static-HTML system. **Not a public product.**

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite (`frontend/`) |
| Backend | Python 3.13, FastAPI 0.115, Uvicorn 0.32 (`backend/`) |
| ORM / DB driver | `psycopg` 3.2 (psycopg3) with `psycopg_pool` |
| Auth | JWT (`pyjwt`) + bcrypt password hashes |
| Package manager | npm (frontend), pip + venv (backend) |
| Build | `npm run build` → static dist served by Nginx in production |

Key backend dependencies: `requests`, `google-auth`, `google-api-python-client`, `playwright`, `beautifulsoup4`, `python-multipart`.

---

## 3. Hosting & Deployment

| Environment | How it runs |
|---|---|
| **Local dev** | `uvicorn app.main:app --port 8499` + `npm run dev -- --port 5199` |
| **Production** | Contabo VPS (Ubuntu). Backend: `systemctl` (single uvicorn process). Frontend: Nginx serves static build. |
| **Deploy command** | `git pull && systemctl restart dm-dashboard-backend` (backend) + `npm run build --prefix frontend` (frontend) |
| **Tunnel** | VS Code Dev Tunnel — exposes the Contabo VPS to staff browsers |

**Critical constraint:** Backend runs **single worker process only**. Multiple workers would run all background sync jobs in parallel with no leader election — never deploy with `--workers N > 1` until leader election is built.

No CI/CD pipeline. All deploys are manual git pull on Contabo.

---

## 4. Git

| Item | Value |
|---|---|
| Repo | `https://github.com/websitetecteam-arch/dm-dashboard` |
| Working branch | `piranv-work` (all active development) |
| Main branch | `main` (stable, merged periodically) |
| GitHub account | `websitetecteam-arch` |
| Location on disk | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\` (submodule of `piranav_aios`) |

Push rule: always push from `piranav_aios/dm-dashboard/` using the `websitetecteam-arch` account. Never push from `piranav_aios` root for dm-dashboard changes.

---

## 5. Databases

### App DB — `dm_dashboard` (read/write)

- Local PostgreSQL 18 on `localhost:5432`
- Role: `dm_dashboard_app`
- Connection: `DATABASE_URL` env var
- Pool: `min_size=2, max_size=10`

Key tables:

| Table | Purpose |
|---|---|
| `public.users` | Login accounts (id, username, password_hash, display_name, role, staff_key) |
| `sales_cache.live_snapshots` | Current-month sales data (overwritten nightly) |
| `sales_cache.historical_snapshots` | Closed-month sales cache (computed once, never overwritten) |
| `sales_cache.employee_performance_snapshots` | Employee performance cache |
| `sales_cache.sync_control` | Pause/resume flags for background syncs |
| `sales_cache.sync_history` | Log of every sync run |
| `public.hetheesha_product_snapshot` | Hetheesha Req1 fix tracker |
| `public.hetheesha_fix_tracker` | Hetheesha Req2 collection SEO fix tracker |
| `public.feed_optimization_tracker` | Sajeepan Req4 optimisation tracker |
| `public.kamsi_ai_chat` | Kamsi AI daily chat history (session_date-keyed) |
| `public.dilaksi_faq_*` | Dilaksi FAQ Addition feature tables |
| `public.mahima_stpm_*` | Mahima Search Term → Product Mapping tables |
| `public.google_lens_keyword_*` | Sajeepan Automation Keyword Finder tables |
| `public.thivajini_feed_*` | Thivajini Feed Optimisation tables |
| `public.seo_skill_results` | SEO Intelligence Skills tab result storage |
| `public.competitor_*` | Dev Tasks competitor research tables |

### Business DB — read-only (live business data)

- Remote PostgreSQL server (crosses the internet — not localhost)
- Role: `dev_user` — **hard server-side connection limit of 10, shared with all external consumers**
- Connection: `BUSINESS_DATABASE_URL` env var
- Pool: `min_size=0, max_size=4` (deliberately capped — raising it starves others)
- Access function: `get_business_conn()` in `backend/app/db.py`

Key schemas and tables:

| Schema | Contains |
|---|---|
| `google_ads` | `campaigns`, `campaign_performance`, `search_term_data`, `merchant_products` (708k+ rows), `campaign_search_term_data` (currently 0 rows — upstream feed issue) |
| `listings` | `shopify_listings` (variant-level stock/price/availability), `amazon_listings` |
| `order_management` | Order-level sales data |
| `amazon_campaigns` | Amazon PPC data |
| + 15 more schemas | Total 19 schemas |

**Never write to the business DB. Always retry on `too many connections` — never raise pool size.**

---

## 6. Backend Structure

Entry point: `backend/app/main.py` (257 lines)

Pattern:
- One `.py` router file per staff member (e.g. `kamsi.py`) registered in `main.py`
- One `_ai.py` file per staff member for the AI daily brief (e.g. `kamsi_ai.py`)
- Shared utilities: `db.py`, `auth.py`, `ai_shared.py`, `ai_validator.py`, `shopify_client.py`, `google_client.py`
- Schema-init functions called crash-proof at startup (a failure in one schema never blocks the whole app)
- Background snapshot jobs started at `@app.on_event("startup")` — Jefri Req1/6/8, Hetheesha Req2-5, Thivajini Req1, Sukirtha Req1/4, Mahima Req1/3/5/5b, SKU audit, DM Campaign, Dev Tasks

Notable multi-file modules (large features split across files):
- `sajeepan_lens_*.py` (~25 files) — Sajeepan Automation Keyword Finder / Title Optimizer
- `mahima_stpm_*.py` (~13 files) — Mahima Search Term → Product Mapping
- `thivajini_feed_*.py` (~14 files) — Thivajini Feed Optimization
- `dilaksi_faq_*.py` (~15 files) — Dilaksi FAQ Addition feature
- `jefri_nonmoving_*.py` (4 files) — Jefri Non-Moving Finetune

---

## 7. Frontend Structure

Entry: `frontend/src/main.jsx` → `App.jsx`

Pattern: one folder per staff member under `frontend/src/<name>/`, each containing:
- `<Name>Layout.jsx` — sidebar nav, tab definitions, React Router routes
- `pages/` — one `.jsx` file per requirement tab
- `<Name>DailyTaskPage.jsx` — AI brief + task hub page (all staff have this)

Shared:
- `frontend/src/admin/` — Admin panel (AdminLayout.jsx + pages for all admin reports)
- `frontend/src/components/` — shared UI components
- `frontend/src/hooks/` — shared React hooks
- `frontend/src/styles/` — global CSS (`dashboard.css`, etc.)
- `frontend/src/taskRegistry.js` — single source of truth for grantable tasks via access grants
- `frontend/src/blog-tool/` — Shopify blog HTML generator
- `frontend/src/dev/` — Dev role pages

**Architecture note:** Sidebar panels never unmount — tab switching toggles CSS `display`, not React mount/unmount. This prevents hammering the connection-limited business DB on every tab switch. Any `setInterval`/polling must pause when its panel is not visible.

---

## 8. Staff Roster

| Staff | Folder | Role / Market | Requirements built | AI Brief |
|---|---|---|---|---|
| Jefri | `jefri/` | Google Ads — Germany (ledsone.de) | 8/8 | ✓ `jefri_ai.py` |
| Kamsi | `kamsi/` | SEO — UK (ledsone.co.uk) | 6/6 | ✓ `kamsi_ai.py` |
| Mahima | `mahima/` | Google Ads — Germany (ledsone.de) | 5/5 | ✓ `mahima_ai.py` |
| Dilaksi | `dilaksi/` | SEO — UK (ledsone.co.uk) | 3/3 | ✓ `dilaksi_ai.py` |
| Thasitha | `thasitha/` | Google Ads — Germany (ledsone.de) | 7/7 | ✓ `thasitha_ai.py` |
| Sukirtha | `sukirtha/` | SEO — UK (ledsone.co.uk) | 6/6 | ✓ `sukirtha_ai.py` |
| Sonya | `sonya/` | Google Ads — UK (ledsone.co.uk) | 7/7 | ✓ `sonya_ai.py` |
| Sajeepan | `sajeepan/` | Google Ads — UK (ledsone.co.uk) | 4/5 (Req5 needs SEARCHAPI_IO_KEY) | ✓ `sajeepan_ai.py` |
| Theekshy | `theekshy/` | Google Ads — UK (ledsone.co.uk) | 5/5 | ✓ `theekshy_ai.py` |
| Hetheesha | `hetheesha/` | SEO — France (ledsone.fr) | 5/5 | ✓ `hetheesha_ai.py` |
| Thivajini | `thivajini/` | Google Ads — France (ledsone.fr) | 4/5 (Req5 out of scope) | ✓ `thivajini_ai.py` |
| Muguntha | — | Manager / reviewer (no personal dashboard) | — | ✓ `muguntha_ai.py` |

---

## 9. AI System

**Engine:** `backend/app/ai_shared.py` — shared by all staff AI files.

**Primary model:** `gemini-3.6-flash` via Google Generative Language API (`GEMINI_API_KEY`).

**Fallback chain:**
1. Gemini (multi-key: `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`)
2. Groq (`GROQ_API_KEY`, model: `openai/gpt-oss-120b`)
3. NVIDIA NIM (`NVIDIA_API_KEY` — tries live model list, seeds from Llama/Mistral/Gemma)
4. Local LLM (`LOCAL_LLM_BASE_URL` + `LOCAL_LLM_API_KEY` + `LOCAL_LLM_MODEL`)

**How the brief works (per staff):**
1. Frontend calls `GET /api/<staff>/ai/brief`
2. Backend checks `_last_regeneration_ts` — if client's `saved_at` is stale, regenerates
3. `_gather_data()` pulls relevant business DB data (5-min in-memory cache)
4. `_build_system_prompt()` composes staff-specific prompt with profile, thresholds, data
5. `validated_brief_call()` in `ai_validator.py` calls Gemini, validates structured output, retries on failure
6. Result cached in app DB as chat history (session_date-keyed — new day = new brief)
7. Frontend polls `regenerated_at` every 30s, shows update banner when server has a fresher brief

**Staff profiles:** JSON files in `backend/app/staff_profiles/<name>.json` — role, market, decision authority thresholds, skill blocks injected into system prompt.

**Business DB concurrency guard:** `BUSINESS_DB_AI_LOCK = threading.Semaphore(1)` in `ai_shared.py` — only one AI brief may query the business DB at a time. This is intentional pool protection, not a bug.

**Admin regeneration:** All staff have `POST /api/<staff>/ai/admin/regenerate-brief` (admin/dev role only).

---

## 10. Requirement Pages Built Per Staff

**Jefri:** Cross-Campaign Attribution, Image Update Tracker, Item ID Parent Mapping, Daily Task Page, Non-Moving Finetune, Order Conversion Split, Product Status Labels, Search Terms Labels, SKU Price Reconciliation, Three Period Comparison.

**Kamsi:** Duplicate Price Check, GA4 SEO Performance, Daily Task Page, Low CTR Pages, Missing Meta Detection, Product Priority Guidance, Slow Moving Products.

**Mahima:** Daily Task Page, Product Campaign Sales, Product ID Coverage, Product Performance Report, Search Term Product Mapping, Search Terms, Stock Management.

**Dilaksi:** Collections Removal Audit, Daily Task Page, FAQ Addition, GA4 SEO Performance, Product Priority Guidance.

**Thasitha:** Amazon DE Search Terms, Campaign Performance, Item ID Cross Campaign Check, Multichannel YoY Sales, PMax Zero Performance, Search Terms Labels, Search Terms Shared, Shopify vs Ads Value, Daily Task Page.

**Sukirtha:** Core GA4 Data, Duplicate Price Check, Low CTR Blog/Collections, Low Stock Alerts, Missing Meta Title/Desc, Slow Moving Stock, Daily Task Page.

**Sonya:** Campaign Performance, Cross Campaign Attribution, Daily Orders, Opportunity, Product Performance, Daily Task Page, Stop Waste Spend, Trend Segment Dashboard.

**Sajeepan:** Automation Keyword Finder (sajeepan_lens), Feed Optimization, Product Action Dashboard, Product Intelligence, Revenue Protection, Daily Task Page. (Req5 — SERP validation — blocked on `SEARCHAPI_IO_KEY` not configured.)

**Theekshy:** Campaign Optimisation, Feed Optimisation, Product Optimisation, Search Term Optimisation, Stock Status Snapshot, Daily Task Page.

**Hetheesha:** Collection Performance, Duplicate Page Analysis, Daily Task Page, High Traffic Stock Alert, Internal Link Audit, Product SEO Report.

**Thivajini:** Conversion Tracking, Feed Optimization (thivajini_feed module), Order Data, Product Performance, Stock Spend Tracker, Daily Task Page. (Req5 out of scope.)

---

## 11. Admin Pages (admin/dev role)

| Page | Purpose |
|---|---|
| Sales2026.jsx | Channel group sales by month — UK (4 sub-tabs incl. Shopify Actuals), DE, FR, Total |
| Sales2025.jsx | 2025 historical sales |
| GermanySalesDecline.jsx | OOS / marketplace gap analysis report |
| SeoIntelligence.jsx | SEO intelligence + Skills tab (7 skill-runner panels) |
| OrganicRevenueIntelligence.jsx | Organic revenue breakdown |
| StaffIdPerformance.jsx | Per-staff ID performance (5 tabs) |
| EmployeePerformance.jsx | Cross-staff performance metrics |
| StaffMonitor.jsx | Staff activity monitor |
| SkuAudit.jsx | SKU spec + duplicate audit |
| DmCampaign.jsx | DM Campaign Products view with campaign filter |
| ShopifyUkRefunds.jsx / ShopifyDeRefunds.jsx | 60-day refund reports |
| UserAccessManagement.jsx | Grant/revoke access to tasks across staff |
| TeamTaskMonitor.jsx | Cross-team task overview |
| EodTeamLog*.jsx | EOD reports — TEC / SEO / ADS / combined |

---

## 12. Environment Variables

All in `backend/.env` (gitignored):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | App DB (dm_dashboard PostgreSQL) |
| `BUSINESS_DATABASE_URL` | Read-only business data PostgreSQL |
| `JWT_SECRET` | Auth token signing |
| `JWT_EXPIRE_MINUTES` | Token expiry (default 480) |
| `CORS_ORIGIN` | Allowed frontend origin(s) |
| `SHOPIFY_ADMIN_TOKEN` | ledsone.de Shopify Admin API |
| `SHOPIFY_UK_ADMIN_TOKEN` | ledsone.co.uk Shopify Admin API |
| `SHOPIFY_FR_ADMIN_TOKEN` | ledsone.fr Shopify Admin API |
| `GEMINI_API_KEY` / `_2` / `_3` | Primary AI model keys (multi-key fallback) |
| `GROQ_API_KEY` | Groq fallback (Gemini exhausted) |
| `NVIDIA_API_KEY` | NVIDIA NIM fallback |
| `LOCAL_LLM_API_KEY` / `LOCAL_LLM_BASE_URL` / `LOCAL_LLM_MODEL` | Local LLM last-resort fallback |
| `GA4_SERVICE_ACCOUNT_JSON` | Google Analytics 4 service account key JSON |
| `GSC_SERVICE_ACCOUNT_KEY` | Google Search Console service account key JSON |
| `GOOGLE_SHEETS_CREDENTIALS_JSON` | Google Sheets API |
| `EOD_GITHUB_TOKEN` | GitHub token for EOD report storage |
| `DM_DASHBOARD_GITHUB_TOKEN` | GitHub token for other Git-backed features |
| `SEARCHAPI_IO_KEY` | SerpAPI / SearchAPI — needed for Sajeepan Req5 (not yet configured) |
| `DILAXI_SCRAPE_API_TOKEN` | Web scraping API for Dilaksi FAQ |
| `RIVA_TRANSLATE_API_KEY_DILAX` / `RIVA_TRANSLATE_API_MODEL` | Translation for Dilaksi |

---

## 13. Known Open Items / Deferred Work

| Item | Status |
|---|---|
| Sajeepan Req5 (SERP UK validation) | Blocked — `SEARCHAPI_IO_KEY` not configured on Contabo |
| Thivajini Req5 | Deliberately out of scope |
| `google_ads.campaign_search_term_data` table empty | Upstream feed issue — affects Mahima Search Terms tab, will self-resolve |
| Contabo VPS Neon DB egress | Blocks Claude Code remote sessions from writing to Neon — scripts must run locally |
| Kamsi/Dilaksi scope allocation | Product ID filter for Req2 Low CTR pages — needs collection-to-person mapping from Piranav |
| Sajeepan Step 9 (UK Search Validation) | Not built — needs new table + UI + endpoint |
| Sajeepan Shopify title write step | Scope not confirmed — must be confirmed before building |
| GSC live sync first run | `gsc_live.*` schema doesn't exist in prod until backend restarts post-deploy |

---

## 14. Architectural Constraints — Must Know Before Any Task

1. **Single worker process.** Never deploy with `--workers > 1`. No leader election for background jobs.
2. **Business DB connection cap is 10, shared.** Pool capped at `max_size=4`. Never raise it. Retry on transient errors, never add connections.
3. **Sidebar panels never unmount.** Any polling (`setInterval`) must self-pause when panel is not visible, or it burns DB connections in background.
4. **No `--reload` on backend.** File watcher has served stale code. Kill and fully restart after every backend change.
5. **`.env` is not hot-reloaded.** Adding a new env var requires full backend restart.
6. **AI lock is a semaphore, not a queue.** `BUSINESS_DB_AI_LOCK` allows only one AI brief at a time — intentional pool protection, not a bug.
7. **Deploy sequence is mandatory.** Always: `git commit` → `git push` → `git pull` on Contabo → `systemctl restart backend` → `npm run build frontend`. Never deploy from a stale local copy.
8. **EOD system uses GitHub storage**, not Postgres — EOD `.md` files committed to GitHub, cached in memory.
9. **`feed_optimization_tracker` table already exists** — do not duplicate it for any Sajeepan post-optimisation tracking.
