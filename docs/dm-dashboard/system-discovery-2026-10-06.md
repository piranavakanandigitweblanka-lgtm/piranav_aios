# DM Dashboard — System Discovery Report

**Discovery Date:** 2026-10-06
**Inspected by:** Claude Code (read-only audit)
**Existing AIOS docs found:** YES — see Section 2
**New pages found since last doc (2026-09-25):** Conduit Sold, Conduit Stock, Listing Issues, AdsProductScope (was design, now built)

---

## 1. Project Identity

| Item | Value |
|---|---|
| Project name | DM Dashboard (Digital Marketing Dashboard) |
| Purpose | Internal staff dashboard — 11 staff members, Google Ads + SEO + product data |
| Disk path | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\` |
| Frontend port (local) | 5199 |
| Backend port | 8499 |
| Public access | VS Code Dev Tunnel → Contabo VPS |

---

## 2. AIOS Documentation Found (Pre-Existing — Do Not Duplicate)

| File | Content | Status |
|---|---|---|
| `docs/dm-dashboard-dev-knowledge.md` | Quick-reference: stack, rules, structure, staff roster | **OUTDATED** — backend subdir structure not reflected; Conduit/Listing Issues missing |
| `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` | Full GPT briefing (Sep 25 2026) — comprehensive architecture reference | **MOSTLY CURRENT** — pre-Conduit/Listing Issues |
| `docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md` | Full design spec for AdsProductScope | CURRENT — page was built per this spec |
| `docs/dm-dashboard/conduit-sold-phase1-2026-10-01.md` | Conduit Sold Phase 1 (Shopify fetch approach) | CURRENT |
| `docs/dm-dashboard/conduit-sold-phase2-discovery-2026-10-01.md` | Conduit Sold Phase 2 discovery | CURRENT |
| `docs/dm-dashboard/conduit-sold-phase2b-api-design-2026-10-02.md` | Conduit Sold API design | CURRENT |
| `docs/dm-dashboard/conduit-sold-phase2c-frontend-2026-10-02.md` | Conduit Sold frontend | CURRENT |
| `docs/dm-dashboard/listing-issue-tracker-build-2026-10-02.md` | Listing Issues tracker build | CURRENT |
| `docs/dm-dashboard/listing-issues-pdf-enhancement-2026-10-02.md` | Listing Issues PDF enhancement | CURRENT |
| `capability/piranav/dm-dashboard-local-setup-2026-09-01.md` | Local dev setup | CURRENT |
| `capability/piranav/ads-product-scope-admin-page.md` | AdsProductScope capability record | **STALE PATH** — backend path listed as `app/admin_ads_product_scope.py`, actual is `app/admin/admin_ads_product_scope.py` |
| `evidence/dm-dashboard/` | 6 evidence files for Conduit + Listing Issues | CURRENT |

**Action:** The primary reference for architecture is `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md`. This discovery report captures what changed since then. Do not duplicate the GPT brief.

---

## 3. Repository & Git

| Item | Value |
|---|---|
| Remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Active branch | `piranv-work` |
| Main branch | `main` |
| Other branches | `dev-work`, `origin/main`, `origin/piranv-work` |
| Working tree | **Clean** — nothing to commit, up to date with `origin/piranv-work` |
| Latest commit | `5e243b2` — `feat(listing-issues): embed images in PDF export + prominent Reported By` |
| GitHub account | `websitetecteam-arch` |
| Push command | Always from `piranav_aios/dm-dashboard/` directory |

**Recent commits of note:**
- `9ee1bd3` — fix: restore missing `start_conduit_sold_snapshots` import (production outage)
- `1e437e6` — fix: repair merge corruption in ConduitSold.jsx and admin_conduit_stock.py
- `524cb98` — feat: Conduit Sold stored in Postgres ScheduledSnapshot (replaces 15-min in-memory)
- `cf5a260` — feat(admin): Listing Management Issue Tracker
- `a726bbf` — fix: Conduit Sold now honours access_grants (not just admin/dev)

**RISK: Merge conflict in closure/README.md** — lines 1609–1661 have unresolved `<<<<<<<`/`=======`/`>>>>>>>` markers. This must be resolved before the next `git commit` in the `piranav_aios` root repo.

---

## 4. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Frontend build tool | Vite | (current) |
| Frontend language | Plain JS (JSX) — no TypeScript | — |
| Backend framework | FastAPI | 0.115 |
| Backend runtime | Python | 3.13 (prod: 3.14 compiled per .pyc) |
| Backend server | Uvicorn | 0.32 |
| DB driver | psycopg3 (`psycopg`) + `psycopg_pool` | 3.2 |
| Auth | JWT (`pyjwt`) + bcrypt | — |
| Package manager | npm (frontend), pip + venv (backend) | — |

---

## 5. Frontend Architecture

**Entry:** `frontend/src/main.jsx` → `frontend/src/App.jsx`

**Routing pattern:**
- `App.jsx` handles login and role-based routing
- `admin` role → `AdminLayout.jsx`
- `staff_key` → matching `<Name>Layout.jsx`
- CSS-based tab switching (panels never unmount — critical pattern)

**Folder structure:**
```
frontend/src/
  App.jsx               — login + role-based routing
  taskRegistry.js       — User Access Management grant keys
  devTasksRegistry.js   — Dev task registry (shared admin + dev)
  lib/apiFetch.js       — SHARED API client (added 2026-10-01) — always attaches auth token
  components/
    Sidebar.jsx         — DashboardShell (shared by ALL modules)
    Overview.jsx        — shared home tab
    DailyBriefWidget.jsx
    EodPage.jsx
  admin/
    AdminLayout.jsx     — admin sidebar nav + lazy-loaded page routing
    admin.css           — admin-specific styles
    pages/              — all admin report pages (see Section 9)
  jefri/               — template staff module (exports jefri.css shared styles)
    jefri.css          — DE FACTO SHARED CONTENT STYLESHEET (jreq-* classes — ALL modules use this)
  <name>/              — one folder per staff member (11 total)
  styles/
    dashboard.css       — global CSS
  blog-tool/           — Shopify blog HTML generator
  dev/                 — Dev role pages
```

**Key CSS classes (from jefri.css — use without modification):**
`jreq-header`, `jreq-eyebrow`, `jreq-sub`, `jreq-cards`, `jreq-card`, `jreq-card-label`, `jreq-card-value`, `jreq-tbar`, `jreq-refresh`, `jreq-cnt`, `jreq-tablebox`, `jreq-scroll`, `jreq-loading`, `jreq-empty`, `jreq-error`, `jreq-footnotes`, `jreq-chip`, `.num`

**Lazy loading:** All admin pages use `lazy(() => import('./pages/X'))` — added 2026-09-30 to replace a 2.5MB monolithic bundle.

**API client:** `lib/apiFetch.js` — added 2026-10-01. All `fetch()` calls should route through this. Previously only 19 of 106 calls had auth headers.

---

## 6. Backend Architecture

**Entry:** `backend/app/main.py`

**Subpackage structure (refactored since Sep 2026 docs):**
```
backend/app/
  main.py                     — FastAPI entrypoint, all routers, startup hooks
  core/
    db.py                     — get_conn() (app DB) + get_business_conn() (business DB)
    auth.py                   — JWT login, verify_token(), verify_admin_token()
    task_auth.py              — make_task_auth() — per-task grant checker
    scheduled_snapshot.py     — ScheduledSnapshot class (reusable background cache pattern)
    shopify_client.py         — Shopify Admin API client (uk, de, fr)
    google_client.py          — GA4 + Search Console client
    task_log.py               — task logging router
    deploy_log.py             — passive deploy log
  admin/
    admin.py                  — admin user management router
    admin_conduit_sold.py     — Conduit Sold page + snapshot
    admin_conduit_stock.py    — Conduit Stock page (5-min cache)
    admin_dm_campaign.py      — DM Campaign page
    admin_ads_product_scope.py — Ads Product Scope page
    admin_sku_audit.py        — SKU Audit page
    eod.py                    — EOD reports
    employee_performance.py   — Employee Performance
    staff_id_performance.py   — Staff ID Performance
    staff_monitor.py          — Staff Monitor
    access_grants.py          — User Access Management
    product_ownership.py      — Product Ownership
    dev_branches.py           — Dev Branches
    dev_kuberan_tasks.py      — Dev Kuberan Tasks
    listing_issues.py         — Listing Management Issue Tracker
  staff_pages/
    jefri.py, kamsi.py, mahima.py, dilaksi.py, thasitha.py,
    sukirtha.py, sonya.py, sajeepan.py, theekshy.py, hetheesha.py, thivajini.py
    thasitha_manual_campaigns.py
  ai_chat/
    ai_shared.py, ai_validator.py
    jefri_ai.py, kamsi_ai.py, mahima_ai.py, dilaksi_ai.py, thasitha_ai.py,
    sukirtha_ai.py, sonya_ai.py, sajeepan_ai.py, theekshy_ai.py, hetheesha_ai.py,
    thivajini_ai.py, muguntha_ai.py, sajeepan_bot.py
  automation_task/
    dilaksi_faq_*.py (~15 files)
    mahima_stpm_*.py (~13 files)
    sajeepan_lens_*.py (~25 files)
    thivajini_feed_*.py (~14 files)
    jefri_nonmoving*.py (4 files)
  sales/
    sales.py, seo_intelligence.py, organic_revenue.py,
    germany_sales_decline.py, shopify_uk_refunds.py, shopify_de_refunds.py
  dev_tasks/             — 13+ dev tool packages
```

**Global auth middleware (added 2026-10-01 — NOT in Sep 2026 docs):**
Every request requires a valid Bearer token EXCEPT `/api/auth/login` and `/api/health`. Implemented as `@app.middleware("http")` in `main.py`. This replaced the previous model where ~87 of 106 fetch calls had no auth.

**Per-page access grants (added separately):**
All staff page routers are wrapped with `make_task_auth(task_key)`. Admin/dev role always passes. Staff members need an `access_grants` row for their own pages and any admin tools explicitly granted.

**Startup background jobs (from `_start_background_sync()`):**
- Sales hourly sync
- Jefri Req1/6/8 snapshots
- Hetheesha Req2/3/4/5 snapshots
- Thivajini Req1 snapshot
- Sukirtha Req1/4 snapshots
- Mahima Req1/3/5/5b snapshots
- SKU Audit spec/duplicate snapshots
- DM Campaign snapshot
- Ads Product Scope snapshots
- **Conduit Sold snapshot** (12-hour interval)
- Dev task snapshots

**Key API routes (selected):**
| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/auth/login` | POST | Public | JWT login |
| `/api/health` | GET | Public | Uptime check |
| `/api/admin/conduit-sold` | GET | `tools.AdminConduitSold` grant | Conduit Sold report |
| `/api/admin/conduit-sold/sync/run-now` | POST | `tools.AdminConduitSold` grant | Trigger live Shopify fetch |
| `/api/admin/conduit-stock` | GET | `tools.AdminConduitSold` grant | Component stock (PostgreSQL only) |
| `/api/admin/ads-product-scope/sajeepan` | GET | `verify_admin_token` | Ads Product Scope |
| `/api/admin/dm-campaign` | GET | admin/dev | DM Campaign products |
| `/api/admin/sku-audit/...` | GET | admin/dev | SKU Audit |
| `/api/sales/...` | GET | logged in | Sales data |
| `/api/<staff>/...` | GET/POST | `staff_pages.<staff>` grant | Per-staff pages |
| `/api/<staff>/ai/brief` | GET | `ai_chat.<staff>` grant | AI daily brief |

---

## 7. Database Architecture

### App DB — `dm_dashboard` (read/write, local)
- PostgreSQL 18 local, `localhost:5432`
- Pool: `min_size=2, max_size=10`
- Connection: `DATABASE_URL` env var

**Key tables:**
| Table | Purpose |
|---|---|
| `public.users` | Login accounts |
| `sales_cache.live_snapshots` | Current month sales (overwritten nightly) |
| `sales_cache.historical_snapshots` | Past months (computed once, never overwritten) |
| `sales_cache.employee_performance_snapshots` | Performance cache |
| `sales_cache.sync_control` | Pause/resume sync flags |
| `sales_cache.sync_history` | Sync run log |
| `public.admin_conduit_sold_snapshot` | Conduit Sold last computed report (JSON) |
| `public.hetheesha_product_snapshot` | Hetheesha Req1 fix tracker |
| `public.hetheesha_fix_tracker` | Hetheesha Req2 collection SEO fix tracker |
| `public.feed_optimization_tracker` | Sajeepan Req4 tracker |
| `public.kamsi_ai_chat` | Kamsi AI chat history |
| `public.dilaksi_faq_*` | Dilaksi FAQ Addition tables |
| `public.mahima_stpm_*` | Mahima Search Term → Product Mapping tables |
| `public.google_lens_keyword_*` | Sajeepan Lens Keyword Finder tables |
| `public.thivajini_feed_*` | Thivajini Feed Optimization tables |
| `public.seo_skill_results` | SEO Intelligence Skills tab results |
| `public.competitor_*` | Dev Tasks competitor research tables |
| `public.listing_issues` | Listing Management Issue Tracker (added 2026-10-02) |

### Business DB — read-only (remote)
- Remote PostgreSQL, separate host
- Pool: **max_size=4, hard limit shared with all consumers — NEVER raise**
- Connection: `BUSINESS_DATABASE_URL` env var
- Access: `get_business_conn()` in `core/db.py`

**Key schemas used by Conduit pages:**
| Schema.Table | Used by |
|---|---|
| `listings.shopify_collections` | Conduit Sold (collection membership lookup) |
| `listings.shopify_collection_products` | Conduit Sold (product IDs per collection) |
| `listings.shopify_listings` | Conduit Sold (product info), Conduit Stock, AdsProductScope |
| `listings.shopify_listings_parent_child_mapping` | Conduit Stock (SKU→variant lookup) |
| `inventory.products` | Conduit Stock (SKU classification, sku_original) |
| `inventory.local_inventory_current_stock_location_wise` | Conduit Stock (UK stock levels) |
| `inventory.product_mapping` | Conduit Stock (alternative inventory links) |
| `google_ads.product_performance` | AdsProductScope, Jefri, Thasitha, Theekshy |
| `google_ads.campaigns` | Various staff pages |
| `google_ads.merchant_products` | AdsProductScope (708k+ rows) |
| `order_management.*` | Various sales reports |

---

## 8. External Integrations (Confirmed in Code)

| Integration | Used by | Auth method |
|---|---|---|
| Shopify UK (ledsone.myshopify.com) | Conduit Sold, Kamsi, Sonya, Admin | `SHOPIFY_UK_ADMIN_TOKEN` |
| Shopify DE (ledsone.de) | Jefri, Mahima, Thasitha | `SHOPIFY_ADMIN_TOKEN` |
| Shopify FR (ledsone.fr) | Hetheesha, Thivajini | `SHOPIFY_FR_ADMIN_TOKEN` |
| Google Analytics 4 | Kamsi, Dilaksi, Sukirtha + Admin | `GA4_SERVICE_ACCOUNT_JSON` |
| Google Search Console | Kamsi, Dilaksi, Admin | `GSC_SERVICE_ACCOUNT_KEY` |
| Google Sheets | Various | `GOOGLE_SHEETS_CREDENTIALS_JSON` |
| Gemini API (primary AI) | All AI brief endpoints | `GEMINI_API_KEY` / `_2` / `_3` |
| Groq API (AI fallback 1) | All AI brief endpoints | `GROQ_API_KEY` |
| NVIDIA NIM (AI fallback 2) | All AI brief endpoints | `NVIDIA_API_KEY` |
| Local LLM (AI fallback 3) | All AI brief endpoints | `LOCAL_LLM_*` |
| GitHub (EOD storage) | EOD reports | `EOD_GITHUB_TOKEN` |
| Web scraping API (Dilaksi FAQ) | dilaksi_faq_*.py | `DILAXI_SCRAPE_API_TOKEN` |
| Translation API (Dilaksi) | dilaksi_faq_*.py | `RIVA_TRANSLATE_API_KEY_DILAX` |

---

## 9. Existing Pages

### Admin Pages (role: admin/dev)

| Page | Nav Key | Frontend File | Backend Route(s) | Purpose |
|---|---|---|---|---|
| Overview | `overview` | `components/Overview.jsx` | — | Home/summary |
| Development Tasks | `development-tasks` | `DEV_TASKS` registry | `/api/dev-tasks/...` | Internal dev tools (13+ tools) |
| EOD Admin | `eod-admin` | `EodPage.jsx` | `/api/eod/...` | Attendance, act-on-behalf, history |
| EOD Reports | `eod-reports` | `EodTeamLogTec/Seo/Ads.jsx` | `/api/eod/...` | Team EOD log by team |
| Dev Branches | `dev-branches` | `DevBranches.jsx` | `/api/dev/branches` | Branch management |
| Piranav Branch | `piranav-branch` | `PiranavBranch.jsx` | — | Piranav-specific tools |
| Sales 2026 | `sales-2026` | `Sales2026.jsx` | `/api/sales/...` | Channel sales by month (UK/DE/FR/Total) |
| Sales 2025 | `sales-2025` | `Sales2025.jsx` | `/api/sales/...` | 2025 historical sales |
| Germany Sales Decline | `germany-sales-decline` | `GermanySalesDecline.jsx` | `/api/admin/germany-sales-decline` | OOS/marketplace gap analysis |
| Staff ID Performance | `staff-id-performance` | `StaffIdPerformance.jsx` | `/api/admin/staff-id-performance/...` | Per-staff product ID performance (5 tabs) |
| Employee Performance | `employee-performance` | `EmployeePerformance.jsx` | `/api/admin/employee-performance` | Cross-staff performance metrics |
| SEO Intelligence | `seo-intelligence` | `SeoIntelligence.jsx` | `/api/admin/seo-intelligence/...` | SEO data + Skills tab |
| Organic Revenue | `organic-revenue` | `OrganicRevenueIntelligence.jsx` | `/api/admin/organic-revenue` | Organic revenue breakdown |
| SKU Audit | `sku-audit` | `SkuAudit.jsx` | `/api/admin/sku-audit/...` | SKU spec + duplicate audit |
| DM Campaign | `dm-campaign` | `DmCampaign.jsx` | `/api/admin/dm-campaign/...` | DM campaign products with filter |
| **Ads Product Scope** | `ads-product-scope` | `AdsProductScope.jsx` | `/api/admin/ads-product-scope/sajeepan` | Non-sale product classification (Sajeepan) |
| **Conduit Sold** | `conduit-sold` | `ConduitSold.jsx` | `/api/admin/conduit-sold` | Conduit sales Apr–Sep 2026 + Component Stock |
| Shopify UK Refunds | `shopify-uk-refunds` | `ShopifyUkRefunds.jsx` | `/api/admin/shopify-uk-refunds` | 60-day refund report |
| Shopify DE Refunds | `shopify-de-refunds` | `ShopifyDeRefunds.jsx` | `/api/admin/shopify-de-refunds` | 60-day DE refund report |
| **Listing Issues** | `listing-issues` | `ListingIssues.jsx` | `/api/admin/listing-issues/...` | Listing Management Issue Tracker |
| Users | `users` | `Users.jsx` | `/api/admin/users/...` | User management |
| User Access Management | `user-access-mgmt` | `UserAccessManagement.jsx` | `/api/admin/access-grants/...` | Grant/revoke task access |
| Team Task Monitor | `team-task-monitor` | `TeamTaskMonitor.jsx` | `/api/admin/team-task-monitor` | Cross-team task overview |
| Staff Monitor | `staff-monitor` | `StaffMonitor.jsx` | `/api/admin/staff-monitor` | Staff activity monitor |
| Blog Tool | `blog-tool` | `blog-tool/BlogTool.jsx` | — | Shopify blog HTML generator |
| Listings | `listings` | `Listings.jsx` | — | (listings page) |
| Requirement Pages | `requirement-pages` | `RequirementPages.jsx` | — | Staff requirement status grid |

### Staff Pages (one per staff member)
Each staff member has their own layout with tabs. See `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` Section 10 for the full list of all 11 staff members and their requirement tabs.

---

## 10. Conduit Sold Architecture

**Purpose:** Shows Shopify UK gross units sold and revenue for the 4 Conduit collections (Apr–Sep 2026), broken down by collection → product → SKU → month.

**Backend file:** `backend/app/admin/admin_conduit_sold.py`

**API Routes:**
- `GET /api/admin/conduit-sold` — reads from Postgres snapshot (instant)
- `POST /api/admin/conduit-sold/sync/run-now` — triggers background Shopify fetch

**Auth:** `make_task_auth("tools.AdminConduitSold")` — admin/dev always pass; staff with explicit grant also pass.

**Data sources (two deliberate sources):**
1. Business DB (`listings.shopify_collections`, `listings.shopify_collection_products`) — collection membership + product IDs. Read once per sync.
2. Shopify UK Admin API (GraphQL, 50 orders per page) — actual order line items. Takes 1–3 minutes (100–200 API pages for Apr–Sep 2026).

**4 Conduit collections tracked:**
- `conduit-accessories`
- `conduit-lamp-holder`
- `conduit-lighting`
- `conduit-lightings`

**Date range:** Fixed — Apr 1 2026 to Sep 30 2026 (PHASE1_START/PHASE1_END constants).

**Sales rule:** Gross units sold on non-VOIDED, non-cancelled orders. Financial statuses included: PAID, PARTIALLY_PAID, PARTIALLY_REFUNDED, AUTHORIZED, PENDING. Refunds NOT subtracted. Cancelled orders excluded even if not VOIDED.

**Revenue definition:** `originalTotalSet.shopMoney.amount` per line item (qty × original unit price, pre-discount, GBP). Same field used by `admin_sku_audit.py`.

**Storage pattern (reworked 2026-10-02):**
- `ScheduledSnapshot` pattern (same as DmCampaign, SkuAudit)
- Postgres table: `public.admin_conduit_sold_snapshot`
- Schedule: 12-hour refresh interval
- On first deploy with no snapshot: computes live, writes to Postgres
- Manual update: frontend "Update" button → `POST /sync/run-now` → background thread → polls 10s interval until timestamp advances

**Frontend file:** `frontend/src/admin/pages/ConduitSold.jsx`

**UI structure:**
- Tab per collection (shows grand total + revenue in tab label)
- `+ Component Stock` tab (loads Conduit Stock data on tab activation)
- Collection view: summary cards (Products, Products with Sales, Total Units, Total Revenue) + collapsible product blocks
- Each product block: table of SKUs with monthly units + revenue columns + product total row
- Export CSV per collection (includes SKU rows + product total rows)
- "Update" button triggers background live refresh, polls until done

**Data flow:**
```
User loads page
    → Frontend GET /api/admin/conduit-sold
    → Backend reads public.admin_conduit_sold_snapshot (instant)
    → Returns JSON: {collections[], months[], meta, generatedAt, syncedAt}

User clicks "Update"
    → Frontend POST /api/admin/conduit-sold/sync/run-now (returns immediately)
    → Backend starts background thread
        → _fetch_conduit_collections() from Business DB
        → _fetch_uk_orders_in_range() from Shopify UK API (~1–3 min)
        → _build_report() aggregates per-collection/product/SKU/month
        → conduit_sold_snapshot.write(payload) to Postgres
    → Frontend polls GET every 10s until syncedAt timestamp changes
```

---

## 11. Conduit Stock Architecture

**Purpose:** Live UK warehouse stock for all 288 Conduit SKUs across the 4 collections. Alert tiers: CRITICAL (0), WARNING (1–3), LOW (4–10), OK (>10). SKU types: single, pack, combo, enc.

**Backend file:** `backend/app/admin/admin_conduit_stock.py`

**API Route:** `GET /api/admin/conduit-stock?refresh=0|1`

**Auth:** Same as Conduit Sold — `make_task_auth("tools.AdminConduitSold")`.

**Data source:** Business DB only (no Shopify API calls). Sub-second response.

**Cache:** 5-minute in-memory dict (`_CACHE`). `?refresh=1` bypasses cache. Cache versioned with `_CACHE_VERSION` constant.

**3 PostgreSQL queries:**
1. Collection→SKU mapping (deduplicated in Python to build `collections[]` per SKU)
2. Inventory metadata + UK stock for all 288 conduit SKUs (DISTINCT ON p.sku)
3. Bulk stock lookup for component SKUs (combos/ENC only)

**Tables used:**
- `listings.shopify_collections` + `listings.shopify_collection_products`
- `listings.shopify_listings` + `listings.shopify_listings_parent_child_mapping`
- `inventory.products` (sku_original, inventory_bool, alternative_inventory_id)
- `inventory.local_inventory_current_stock_location_wise` (warehouse_location='UK')
- `inventory.product_mapping` (alternative inventory links)

**COMBO RULE (critical invariant):** `inventory.local_inventory_current_stock_location_wise` is authoritative for ALL SKU types including combos. `+` separator is decoded ONLY to identify bottleneck components for display. Stock values are never recalculated by this endpoint.

**Frontend:** Tab within `ConduitSold.jsx` (`STOCK_TAB = 'stock'`). Lazy-loaded on first tab activation. Has its own `loadStock()` function and state (`stockData`, `stockLoading`, `stockError`).

**UI:** Summary cards (total SKUs + CRITICAL/WARNING/LOW/OK counts — clickable to filter), filter bar (search SKU, collection, type, alert), table with expandable component rows for combo/ENC SKUs, Export CSV.

**Data flow:**
```
User clicks "Component Stock" tab (first time)
    → Frontend GET /api/admin/conduit-stock
    → Backend checks _CACHE (miss)
    → 3 PostgreSQL queries against Business DB
    → Builds 288 SKU records with alert tiers + component breakdown
    → Caches result for 5 minutes
    → Returns JSON: {summary, skus[], generatedAt}
    → Frontend renders stock table

User clicks "Refresh stock"
    → Frontend GET /api/admin/conduit-stock?refresh=1
    → Cache bypassed, fresh 3-query fetch
```

---

## 12. Shared Components & Services

### Backend Shared (all in `backend/app/core/`)

| File | Purpose | Reuse rule |
|---|---|---|
| `db.py` | `get_conn()` (app DB), `get_business_conn()` (business DB) | Always use these — never open raw connections |
| `auth.py` | `verify_token()`, `verify_admin_token()`, login router | Reuse `verify_admin_token` for all admin endpoints |
| `task_auth.py` | `make_task_auth(task_key)` — grant-aware auth | Use for all new task endpoints |
| `scheduled_snapshot.py` | `ScheduledSnapshot` class | Use for any slow query (>2s) that can tolerate staleness |
| `shopify_client.py` | `graphql(store, query, vars)` — UK, DE, FR stores | Use for all Shopify API calls |
| `google_client.py` | GA4 + Search Console API client | Use for analytics data |
| `ai_chat/ai_shared.py` | Multi-key Gemini + fallback chain for AI briefs | Use for any new AI brief endpoint |
| `ai_chat/ai_validator.py` | `validated_brief_call()` | Validates structured AI output with retries |

### Frontend Shared

| File/Component | Purpose | Reuse rule |
|---|---|---|
| `lib/apiFetch.js` | Auth-attaching fetch wrapper | Use for ALL new fetch calls — never raw `fetch()` |
| `components/Sidebar.jsx` (`DashboardShell`) | Shared sidebar/navigation shell | Never build a new sidebar |
| `components/Overview.jsx` | Shared home tab | Reuse for all staff modules |
| `components/DailyBriefWidget.jsx` | AI brief widget | Reuse for staff daily brief |
| `jefri/jefri.css` | Shared content stylesheet (`jreq-*`) | All modules import this — never create per-module stylesheet |
| `taskRegistry.js` | Access grant keys registry | Add new task keys here |
| `devTasksRegistry.js` | Dev task definitions | Add new dev tasks here |

### ScheduledSnapshot Pattern (critical reusable pattern)

Used by: DmCampaign, SkuAudit, AdsProductScope, ConduitSold, Jefri Req1/6/8, Hetheesha Req2-5, Sukirtha Req1/4, Thivajini Req1, Mahima Req1/3/5/5b.

Pattern: create `ScheduledSnapshot(scope, staff, tab, table_name, compute_fn, interval_hours)` → call `.start()` in `_start_background_sync()` → `GET` endpoint calls `.read()` for instant response → "Update" button calls `.run_sync(manual=True)` in background thread.

**Any new slow admin page should use ScheduledSnapshot.**

---

## 13. Authentication & Permissions

**Model (as of 2026-10-01 — global middleware added):**

1. `POST /api/auth/login` — public, returns JWT
2. All other routes — global `require_login` middleware: valid JWT required
3. Staff page routes — wrapped with `make_task_auth(task_key)`: admin/dev auto-pass; staff need a grant in `access_grants` table
4. Admin routes — use `verify_admin_token()`: roles `admin` or `dev` only
5. Special grant routes (Conduit Sold, tools.*) — use `make_task_auth("tools.AdminConduitSold")`: admin/dev + explicitly granted staff

**Roles:** `admin`, `dev`, `staff`

**User table:** `public.users` — columns: id, username, password_hash, display_name, role, staff_key

**Access grants:** `access_grants` table — `(username, task_key)` pairs. Admin/dev always pass regardless.

---

## 14. Environment & Configuration (Variable Names Only)

All in `backend/.env` (gitignored).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | App DB (dm_dashboard local PostgreSQL) |
| `BUSINESS_DATABASE_URL` | Read-only business PostgreSQL (remote) |
| `JWT_SECRET` | Auth token signing |
| `JWT_EXPIRE_MINUTES` | Token expiry (default 480) |
| `CORS_ORIGIN` | Allowed frontend origin(s) |
| `SHOPIFY_ADMIN_TOKEN` | ledsone.de |
| `SHOPIFY_UK_ADMIN_TOKEN` | ledsone.co.uk |
| `SHOPIFY_FR_ADMIN_TOKEN` | ledsone.fr |
| `GEMINI_API_KEY` / `_2` / `_3` | Primary AI model (multi-key) |
| `GROQ_API_KEY` | Groq fallback |
| `NVIDIA_API_KEY` | NVIDIA NIM fallback |
| `LOCAL_LLM_API_KEY` / `LOCAL_LLM_BASE_URL` / `LOCAL_LLM_MODEL` | Local LLM last resort |
| `GA4_SERVICE_ACCOUNT_JSON` | Google Analytics 4 |
| `GSC_SERVICE_ACCOUNT_KEY` | Google Search Console |
| `GOOGLE_SHEETS_CREDENTIALS_JSON` | Google Sheets |
| `EOD_GITHUB_TOKEN` | GitHub for EOD report storage |
| `DM_DASHBOARD_GITHUB_TOKEN` | GitHub for other Git-backed features |
| `SEARCHAPI_IO_KEY` | SerpAPI for Sajeepan Req5 (not yet configured) |
| `DILAXI_SCRAPE_API_TOKEN` | Web scraping for Dilaksi FAQ |
| `RIVA_TRANSLATE_API_KEY_DILAX` / `RIVA_TRANSLATE_API_MODEL` | Translation for Dilaksi |

**Frontend:** `VITE_API_URL` — backend URL (defaults to `http://localhost:8499`).

Template: `backend/.env.example` — safe to read, no secrets.

---

## 15. Deployment Architecture

| Environment | Configuration |
|---|---|
| Local dev | `uvicorn app.main:app --port 8499` + `npm run dev -- --port 5199` |
| Production | Contabo VPS (Ubuntu) |
| Backend prod | `systemctl` — single uvicorn worker process |
| Frontend prod | Nginx serves static build |
| Deploy command | `git pull && systemctl restart dm-dashboard-backend` (backend) + `npm run build --prefix frontend` (frontend) |
| Public access | VS Code Dev Tunnel (`.devtunnels.ms`) — exposes Contabo VPS to staff browsers |

**Critical constraint:** Single worker process only. Multiple workers would run all background sync jobs in parallel with no leader election. Never deploy with `--workers N > 1`.

**No CI/CD.** All deploys are manual `git pull` on Contabo followed by service restart.

---

## 16. Data Flow

### 16.1 Conduit Sold

```
User → Browser → ConduitSold.jsx
    → GET /api/admin/conduit-sold (with JWT in apiFetch.js)
    → main.py middleware: verify JWT
    → admin_conduit_sold.py: task_auth check (admin/dev/granted)
    → conduit_sold_snapshot.read() → SELECT from public.admin_conduit_sold_snapshot
    → Returns JSON payload
    → ConduitSold.jsx renders collection tabs + product tables

Background (12h schedule / manual trigger):
    → admin_conduit_sold.py: _compute_conduit_sold()
    → _fetch_conduit_collections() → Business DB (2 queries)
    → _fetch_uk_orders_in_range() → Shopify UK API (GraphQL pagination, ~1–3 min)
    → _build_report() → aggregate per collection/product/SKU/month
    → conduit_sold_snapshot.write() → INSERT/UPDATE public.admin_conduit_sold_snapshot
```

### 16.2 Conduit Stock

```
User → ConduitSold.jsx (Component Stock tab)
    → GET /api/admin/conduit-stock (apiFetch.js with JWT)
    → main.py middleware: verify JWT
    → admin_conduit_stock.py: task_auth check
    → _CACHE check (5-min TTL)
      [CACHE HIT] → return cached payload
      [CACHE MISS]
        → _fetch_conduit_stock_data()
          → Q1: listings.shopify_collections JOIN shopify_collection_products
          → Q2: inventory.products JOIN local_inventory_current_stock_location_wise (UK)
          → Q3: bulk component stock lookup (combos/ENC only)
          → assemble 288 SKU records with alert tiers
        → _CACHE = { payload, at=now, version=1 }
    → Return JSON: {summary, skus[], generatedAt}
    → ComponentStockView renders filtered table
```

### 16.3 Ads Product Scope (admin page using ScheduledSnapshot)

```
User → AdminLayout → AdsProductScope.jsx
    → GET /api/admin/ads-product-scope/sajeepan?days=30
    → verify_admin_token (admin/dev only)
    → ads_scope_snapshot.read() → instant from app DB
    → Returns JSON: {summary, products[]}
    → Client filters by group/search using useMemo()
    → Export CSV: client-side Blob download

Background (60-min schedule):
    → Business DB CTE query (product_performance + shopify_listings + merchant_products)
    → Jefri ID normalization pattern (shopify_GB_* extraction)
    → Writes snapshot to app DB table
```

---

## 17. Reusable Architecture for New Pages

When adding any new page to this dashboard:

| Need | What to reuse | File |
|---|---|---|
| Sidebar/navigation | `DashboardShell` | `components/Sidebar.jsx` |
| Auth for admin page | `verify_admin_token` | `core/auth.py` |
| Auth for staff/granted | `make_task_auth("tools.YourKey")` | `core/task_auth.py` |
| Slow query (>2s) | `ScheduledSnapshot` | `core/scheduled_snapshot.py` |
| App DB connection | `get_conn()` | `core/db.py` |
| Business DB connection | `get_business_conn()` | `core/db.py` |
| Shopify API call | `graphql(store, query, vars)` | `core/shopify_client.py` |
| Frontend API calls | `apiFetch.js` (or `import.meta.env.VITE_API_URL` + auth header) | `lib/apiFetch.js` |
| CSS styles | `jreq-*` classes | `jefri/jefri.css` |
| Summary cards | `<div className="jreq-card">` | CSS from jefri.css |
| Table + scroll | `jreq-tablebox` + `jreq-scroll` | CSS |
| Filter toolbar | `jreq-tbar` | CSS |
| Export CSV (client-side) | Blob+anchor pattern | `ConduitSold.jsx` exportCSV() or `DmCampaign.jsx` |
| Error state | `<div className="jreq-error">` | CSS |
| Loading state | `<td className="jreq-loading">` | CSS |
| Admin nav registration | `ADMIN_ITEMS` array | `admin/AdminLayout.jsx` |
| Background sync registration | `_start_background_sync()` | `main.py` |
| AI brief endpoint | `ai_shared.py` + `ai_validator.py` | `ai_chat/` folder |

**Pattern for adding a new admin page (minimal):**
1. Backend: create `backend/app/admin/admin_<name>.py` with router + ScheduledSnapshot
2. Register in `main.py`: import router + import start_snapshots + `app.include_router()` + `start_<name>_snapshots()` in `_start_background_sync()`
3. Frontend: create `frontend/src/admin/pages/<Name>.jsx` — import `jefri.css`, use `jreq-*` classes, use `apiFetch.js`
4. Register in `AdminLayout.jsx`: add lazy import + ADMIN_ITEMS nav entry + case in render switch

---

## 18. Confirmed Risks / Technical Debt

### Confirmed Issues

| # | Issue | Location | Impact |
|---|---|---|---|
| 1 | **Merge conflict in closure/README.md** | `closure/README.md` lines 1609–1661 | Will cause `git commit` failure in `piranav_aios` root; must resolve before next commit |
| 2 | **Stale path in capability file** | `capability/piranav/ads-product-scope-admin-page.md` | Backend path listed as `app/admin_ads_product_scope.py`, actual is `app/admin/admin_ads_product_scope.py` |
| 3 | **dm-dashboard-dev-knowledge.md outdated** | `docs/dm-dashboard-dev-knowledge.md` | Still shows flat `backend/app/` structure; doesn't mention Conduit, Listing Issues, global auth middleware |
| 4 | **Conduit Sold Phase 1 hardcoded date range** | `admin_conduit_sold.py` L51-52 | `PHASE1_START = date(2026, 4, 1)` / `PHASE1_END = date(2026, 9, 30)` are constants — Oct 2026+ data will not appear without a code change |
| 5 | **Conduit Stock uses in-memory cache** | `admin_conduit_stock.py` | Cache lives in process memory — restarting the backend resets it. Not a ScheduledSnapshot; data is not persisted. This is intentional (stock syncs frequently) but differs from other pages |
| 6 | **Single worker process constraint** | `main.py` comment | Background jobs have no leader election. Adding workers would cause duplicate syncs and race conditions |
| 7 | **Business DB pool cap** | `core/db.py` | max_size=4, shared with all external consumers. Cannot be raised |
| 8 | **Sajeepan Req5 blocked** | `SEARCHAPI_IO_KEY` not on Contabo | SERP validation tab not built |

### Possible Risks

| # | Risk | Details |
|---|---|---|
| A | Conduit Sold snapshot could be empty on fresh deploy | First load triggers live Shopify fetch (~3 min) — users see "Fetching Shopify UK orders" message |
| B | Conduit Stock component breakdown misidentifies bottleneck | `is_bottleneck` heuristic (within 2 units of combo stock) is approximate — documented in code |
| C | AI semaphore (`BUSINESS_DB_AI_LOCK`) serialises all AI briefs | Only one brief can query Business DB at a time — if all staff load simultaneously, briefs queue |
| D | Lazy-loaded admin pages download on first tab open | Minor: 100–500ms code stream on first visit to each tab (acceptable tradeoff vs. 2.5MB bundle) |

---

## 19. New Page Readiness

### Can we safely add a new page?

**YES**

**What to reuse:**
- ScheduledSnapshot for any slow Business DB query
- `make_task_auth` or `verify_admin_token` for auth
- `apiFetch.js` for all frontend API calls
- `jreq-*` CSS classes from `jefri/jefri.css`
- `get_business_conn()` for Business DB access (pool max 4 — be conservative)

**What NOT to duplicate:**
- Do not open raw DB connections — always use `get_conn()` / `get_business_conn()`
- Do not create a new sidebar — always use `DashboardShell`
- Do not create per-page stylesheets — always import `jefri/jefri.css`
- Do not raise the Business DB pool size — it is hard-capped at 4

**Constraints:**
- Business DB pool is shared — new pages adding live queries should use ScheduledSnapshot
- Backend must remain single worker — no concurrent snapshot leader election
- Any new Conduit Sold date extension requires changing the hardcoded `PHASE1_END` constant
- New staff member must also be added to `taskRegistry.js` and `STAFF_PAGES` in `RequirementPages.jsx`

---

## 20. Recommended Next Step

1. **Resolve the merge conflict in `closure/README.md`** — this blocks the next git commit in `piranav_aios`. The conflict is between the SEMrush scheduled task entry and the PI-01 stock-hiding entry at lines 1609–1661. Piranav should open the file, keep both entries (they cover different tasks), and remove the conflict markers.

2. **Update `docs/dm-dashboard-dev-knowledge.md`** — add: backend subdirectory structure, Conduit Sold/Stock entries, Listing Issues, global login middleware, `apiFetch.js`.

3. **Fix stale path in `capability/piranav/ads-product-scope-admin-page.md`** — update backend path from `app/admin_ads_product_scope.py` to `app/admin/admin_ads_product_scope.py`.

4. **Confirm scope for next dm-dashboard task** with GPT coordinator before building — architecture is now fully understood and ready.

---

*Discovery completed: 2026-10-06*
*All findings are read-only — no code was modified.*
