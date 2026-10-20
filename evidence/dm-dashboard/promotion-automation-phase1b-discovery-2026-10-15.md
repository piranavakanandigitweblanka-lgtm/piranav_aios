# Evidence: Promotion Automation — Phase 1B Discovery

**Date:** 2026-10-15  
**Requirement ID:** PROMO-01-B  
**Task:** Git synchronization + full repository discovery + UAM inspection for Promotion Automation  
**Assigned by:** Muguntha  
**Coordinator:** Piranav  
**Status:** COMPLETE — discovery and Git sync only, no implementation  
**Session Result:** PASS (with BLOCKERS carried forward from Phase 1 — see below)

---

## 1. Git Synchronization Report

### Pre-flight Verification

| Property | Value |
|---|---|
| Repo root | `C:/Users/PC/Documents/piranav_aios/dm-dashboard` |
| Remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` (VERIFIED — correct) |
| Branch before sync | `piranv-work` (VERIFIED — correct) |
| Working tree before sync | **CLEAN** — no uncommitted changes |
| Local HEAD before sync | `1b56766` — fix(admin): RC-02 drill-down panel scrolls into view on open |
| origin/main HEAD before sync | `087d807` — Merge branch 'piranv-work' via Dev Tools |

### Divergence Analysis

- **Commits on origin/main not in local:** 107 commits (all merges from `piranv-work` and `dev-work` into main — no net-new code lost from local branch)
- **Commits on local not in origin/main:** 0 (local piranv-work had zero commits ahead of main)
- **Working tree:** CLEAN — safe to proceed

### Merge Execution

```
git merge origin/main
```

**Result:** Fast-forward merge succeeded.  
- 114 files changed, 11059 insertions(+), 10117 deletions(-)
- No conflicts.

### Post-Merge Verification

| Property | Value |
|---|---|
| Branch after sync | `piranv-work` |
| HEAD after sync | `087d807` — Merge branch 'piranv-work' via Dev Tools |
| origin/main ancestry check | EXIT 0 — origin/main IS ancestor of HEAD (PASS) |
| Working tree after sync | CLEAN |
| Local now ahead of origin/piranv-work | 107 commits (expected — piranv-work not yet pushed; do not push until Piranav instructs) |

**IMPORTANT:** `piranv-work` is now 107 commits ahead of `origin/piranv-work`. This is intentional — the merge brought in dev-work history that was on main but not yet on this branch. Piranav must push `piranv-work` to remote when ready.

---

## 2. Full Repository Structure (Post-Merge)

```
dm-dashboard/
├── backend/
│   └── app/
│       ├── main.py                    — FastAPI app, all router registrations, startup events
│       ├── core/
│       │   ├── auth.py                — JWT login, verify_token, verify_admin_token
│       │   ├── task_auth.py           — make_task_auth(), make_admin_task_auth(), require_any_login()
│       │   ├── scheduled_snapshot.py  — ScheduledSnapshot class (reuse for promotion score compute)
│       │   ├── db.py                  — get_conn(), get_business_conn() pools
│       │   ├── access_grants.py       — CRUD for access_grants table
│       │   ├── users.py               — User management (make_admin_task_auth("tools.Users"))
│       │   └── deploy_log.py
│       ├── admin/
│       │   ├── admin_repeat_customer.py          — BEST REFERENCE for admin page pattern
│       │   ├── admin_repeat_customer_products.py — Most recent admin page (RC-02)
│       │   └── muguntha_budget_alerts.py         — Rule engine + Discord + ScheduledSnapshot pattern
│       ├── automation_task/
│       │   ├── jefri_nonmoving_router.py  — Automation task pattern (dedicated schema)
│       │   ├── jefri_nonmoving_db.py      — Schema creation pattern (ensure_schema)
│       │   └── [others: dilaksi_faq, mahima_stpm, sajeepan_lens, thivajini_feed]
│       ├── dashboard_pages/
│       │   ├── dm_campaign.py         — Google Ads + Shopify + real orders join (KEY REFERENCE)
│       │   ├── conduit_stock.py       — inventory.products + location stock queries
│       │   ├── shared.py              — Shared helpers across dashboard pages
│       │   └── [~40 other pages]
│       ├── ai_chat/                   — Per-staff AI chat routers
│       ├── dev_tasks/                 — Dev tooling (blog, geo, competitor analysis, etc.)
│       └── sales/                     — Sales sync, employee performance
├── frontend/
│   └── src/
│       ├── App.jsx                    — Top-level router (role-based layout switching)
│       ├── main.jsx                   — Vite entry point
│       ├── taskRegistry.js            — ALL grantable tasks + tools (single source of truth)
│       ├── devTasksRegistry.js        — Dev-task entries for sidebar + admin panel
│       ├── admin/
│       │   ├── AdminLayout.jsx        — Admin sidebar nav, UAM-filtered, tool-gated
│       │   └── pages/
│       │       ├── UserAccessManagement.jsx
│       │       ├── Users.jsx
│       │       ├── BudgetAlerts.jsx   — Best reference for rule-based admin page
│       │       ├── RepeatCustomers.jsx
│       │       └── [others]
│       ├── hooks/
│       │   └── useGrantedTasks.js     — Fetches user's granted task keys from backend
│       ├── lib/
│       │   ├── apiFetch.js            — Centralized fetch with Authorization header
│       │   └── fetchRetry.js
│       ├── components/
│       │   ├── Sidebar.jsx            — DashboardShell, tabPanelClass, LazyPanel, useStickyTab
│       │   └── StaffLayout.jsx        — Staff member layout wrapper
│       └── [per-staff folders: jefri/, kamsi/, mahima/, thasitha/, etc.]
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE-TABLE-INVENTORY.md    — 168 tables across 3 schemas (verified 2026-09-24)
│   ├── SYSTEM-KNOWLEDGE.md
│   └── DATABASE.md
├── migrations/
│   └── mahima_ownership_seed.sql
└── mcp/                               — MCP integration
```

---

## 3. Frontend Routing and Navigation Map

### Routing Architecture

| Component | Role |
|---|---|
| `App.jsx` | Role-based layout switcher: `admin` role → `AdminLayout`, `dev` role → `DevLayout`, others → per-staff Layout |
| `AdminLayout.jsx` | Admin sidebar + tab panels; UAM-filtered via `useGrantedTasks` + `filterAdminItems` |
| `taskRegistry.js` | **Single source of truth** for ALL grantable tasks and tools — both TASKS (staff-owned) and TOOLS (admin/shared) |
| `devTasksRegistry.js` | Dev-task entries for sidebar children |

### Key Frontend Patterns

| Pattern | Where |
|---|---|
| Tab/panel navigation | `DashboardShell` + `useStickyTab` from `Sidebar.jsx` |
| Lazy loading | `lazy(() => import('./pages/SomePage'))` + `LazyPanel` or `Suspense` |
| API calls | `apiFetch.js` — always attaches `Authorization: Bearer <token>` |
| Auth context | JWT token stored in localStorage; `App.jsx` reads role from decoded token |
| Grant-gated nav items | Each item has `toolKey: 'tools.SomeKey'` — `filterAdminItems` filters by user's grants |

### Admin Nav Items (complete list from AdminLayout.jsx)

Section | Items (toolKey)
---|---
Development | Development Tasks (via devTasksRegistry)
Workspace | EOD Admin, EOD Reports, Requirement Pages (tools.RequirementPages), Blog Tool (tools.BlogTool)
Listing Management | Issues & Bugs (tools.ListingIssues)
Catalog | Product Ownership (tools.ProductOwnership), 2026 New Listings (tools.Listings), SKU Audit (tools.SkuAudit)
Sales & Performance | DM Campaign (tools.DmCampaign), Conduit Sold (tools.AdminConduitSold), Repeat Customers (tools.AdminRepeatCustomers), Budget Alerts (tools.AdminBudgetAlerts), Ads Product Scope (tools.AdsProductScope), Sales 2026 DE/UK/FR/Total, Sales 2025 UK/DE, Staff ID Performance (tools.StaffIdPerformance), Employee Performance (tools.EmployeePerformance)
Access & Intelligence | User Access Management (always visible), Staff Monitor (tools.StaffMonitor), Team Task Monitor (tools.TeamTaskMonitor), Organic Revenue Intelligence, SEO Intelligence, Germany Sales Decline, Shopify UK/DE Refunds

---

## 4. UAM Authentication and Authorization Flow (COMPLETE TRACE)

### End-to-End Flow

```
1. User logs in → POST /api/auth/login
2. Backend issues JWT: { sub: username, role: admin|dev|staff, staff_key: "muguntha" }
3. Every request → require_login middleware → verify_token(Authorization header)
4. For admin pages with toolKey gate:
   - make_task_auth("tools.SomeTool") → checks role in {"admin","dev"} OR access_grants row
   - make_admin_task_auth("tools.SomeTool") → checks role == "dev" ONLY OR access_grants row
     (admin role does NOT auto-bypass — must have explicit grant in UAM)
5. Frontend: useGrantedTasks(staff_key) → GET /api/access-grants/mine → returns list of task_keys
6. AdminLayout.jsx: filterAdminItems() removes nav items whose toolKey is not in grantedKeys
7. AdminLayout always shows Overview + User Access Management (no grant required)
```

### Permission Storage

**VERIFIED:** `public.access_grants` table — columns: `id, task_key, granted_to_staff_key, granted_by, created_at`  
Source: `docs/DATABASE-TABLE-INVENTORY.md` line 150, `backend/app/core/access_grants.py`

### Roles (VERIFIED from codebase)

| Role | Behavior |
|---|---|
| `dev` | Bypasses ALL auth gates — full superuser (Kuberan's account). Sees full admin panel without any grants. |
| `admin` | Bypasses `make_task_auth()` gates, does NOT bypass `make_admin_task_auth()` gates. Must hold access_grants for admin-tool-specific endpoints. |
| `staff` | Must hold explicit access_grants for every task they can access. |

### Existing Permission Key Convention (VERIFIED from taskRegistry.js)

| Pattern | Examples | Used for |
|---|---|---|
| `tools.<PascalCase>` | `tools.AdminBudgetAlerts`, `tools.DmCampaign`, `tools.AdminRepeatCustomers`, `tools.StaffMonitor` | Admin/shared tools visible in admin sidebar |
| `<staffKey>.<ComponentName>` | `jefri.ProductStatusLabels`, `thasitha.CampaignPerformance` | Staff member's own requirement pages |
| `automation_task.<snakeCase>` | `automation_task.jefri_nonmoving`, `automation_task.mahima_stpm` | Automation tool pages |
| `ai_chat.<staffKey>` | `ai_chat.jefri`, `ai_chat.muguntha` | AI chat pages |
| `staff_pages.<snakeCase>` | `staff_pages.thasitha_manual_campaigns` | Legacy staff page gates |

### How to Add a New Permission Key for Promotion Automation

1. **Backend:** `make_admin_task_auth("tools.PromotionAutomation")` or `make_task_auth(...)` on each router
2. **taskRegistry.js TOOLS array:** Add entry: `{ taskKey: 'tools.PromotionAutomation', label: 'Promotion Automation', kind: 'tool', load: () => import('./admin/pages/PromotionAutomation') }`
3. **AdminLayout.jsx:** Add nav item with `toolKey: 'tools.PromotionAutomation'` and panel render
4. **UAM:** Admin grants `tools.PromotionAutomation` to Muguntha via User Access Management UI
5. **No code change needed for grant assignment** — UAM handles it at runtime

### Proposed Promotion Automation Access Matrix

| Role | Proposed taskKey | Access Level | Auth Pattern |
|---|---|---|---|
| dev (Kuberan) | N/A (bypasses all) | Full | Auto-bypass |
| admin (Piranav) | `tools.PromotionAutomation` via access_grants | Full — view, create, approve, terminate | `make_admin_task_auth` (explicit grant required) |
| admin (Muguntha) | `tools.PromotionAutomation` via access_grants | Full — view, create, approve, terminate | `make_admin_task_auth` |
| staff | `tools.PromotionView` (proposed separate key) | Read-only — view scores, active promotions | `make_task_auth` (weaker gate) |

**RECOMMENDATION:** Start with single key `tools.PromotionAutomation` gated with `make_admin_task_auth`. Add `tools.PromotionView` for read-only staff access in Phase 2 if needed.

---

## 5. Backend Architecture Map

| Router / Module | Path | Pattern | Auth |
|---|---|---|---|
| `admin_repeat_customer` | `backend/app/admin/admin_repeat_customer.py` | ScheduledSnapshot + GET/POST/export | `make_task_auth("tools.AdminRepeatCustomers")` |
| `admin_repeat_customer_products` | `backend/app/admin/admin_repeat_customer_products.py` | ScheduledSnapshot multi-scope | `make_admin_task_auth(...)` |
| `muguntha_budget_alerts` | `backend/app/admin/muguntha_budget_alerts.py` | Rule engine + 6-hr snapshot + Discord | `verify_admin_token` + explicit admin check |
| `dm_campaign` | `backend/app/dashboard_pages/dm_campaign.py` | ScheduledSnapshot + business DB join | `make_admin_task_auth("tools.DmCampaign")` |
| `conduit_stock` | `backend/app/dashboard_pages/conduit_stock.py` | inventory join queries | No per-route gate (global login) |
| `jefri_nonmoving_router` | `backend/app/automation_task/jefri_nonmoving_router.py` | Dedicated schema automation | `make_task_auth("automation_task.jefri_nonmoving")` |

**Best reference for Promotion Automation:** `admin_repeat_customer_products.py` (most recent admin page, modular snapshot pattern) + `muguntha_budget_alerts.py` (rule engine + notifications pattern).

### Startup Schema Registration Pattern

All new schemas must use the crash-proof `try/except` pattern in `main.py`'s `_ensure_schemas()`:
```python
try:
    ensure_promotion_automation_schema()
except Exception as e:
    print(f"WARNING: promotion_automation schema init failed, that feature alone will 500: {e}")
```

### ScheduledSnapshot Pattern (VERIFIED)

```python
from ..core.scheduled_snapshot import ScheduledSnapshot

_score_snapshot = ScheduledSnapshot(
    scope="promotion-automation-score",
    table_name="sales_cache.promotion_score_snapshot",
    compute_fn=_compute_scores,
    interval_days=1,
    run_hour=2,  # 2:00 AM Sri Lanka time, off-peak
    schedule_label="daily at 2:00 AM",
)
# In main.py startup:
# _score_snapshot.start()
```

---

## 6. Database and Integration Map

### App DB (`DATABASE_URL`) — public schema

| Table | Relevant to Promotion Automation |
|---|---|
| `public.users` | User accounts — username, role, staff_key |
| `public.access_grants` | Permission grants (task_key, granted_to_staff_key) |
| All `sales_cache.*` snapshot tables | Pattern for new `sales_cache.promotion_score_snapshot` |

### Business DB (`BUSINESS_DATABASE_URL`) — read-only

| Schema | Key Tables | Promotion Relevance |
|---|---|---|
| `listings` | `shopify_listings` — sku, title, price, status, product_type | Product/SKU source — VERIFIED |
| `order_management` | `orders`, `order_item_info` — real_sku, real_qty, real_price, sub_source_id, market_place | Sales history — VERIFIED |
| `inventory` | `products`, `local_inventory_current_stock_location_wise` | Stock cover — VERIFIED |
| `google_ads` | `campaign_performance` — cost, conversion_value, impressions, clicks; `campaigns` — campaign_id, group_name, budget, campaign_status | Ads performance at campaign level — VERIFIED; SKU-level via product_performance join |
| `google_ads` | `product_performance` — product_item_id, cost, conversions, conversion_value | Product-level ads performance — VERIFIED (73% match rate to shopify_listings) |

**Connection cap:** Business DB hard limit 10 connections shared org-wide. ScheduledSnapshot startup spacing already handles this.

---

## 7. Data Feasibility Re-verification

| Required Data | Existing Source | Verified? | Evidence File + Line | Gap |
|---|---|---|---|---|
| Product / SKU | `listings.shopify_listings` | YES | `dm_campaign.py` line 16 — `UK_LISTING_CHANNEL = "LEDSone"` join to shopify_listings | No cost price / margin column |
| Sales history | `order_management.orders` + `order_item_info` | YES | `dm_campaign.py` line 15-17 — `UK_SUB_SOURCE_ID = 38`, join pattern confirmed | No discount netting / refund netting confirmed |
| Sales by channel | `order_management.sub_source_id` | PARTIAL | `dm_campaign.py` line 15 — sub_source_id=38 for UK Shopify | Other sub_source_ids (Amazon, etc.) not mapped |
| Inventory / Stock cover | `inventory.products` + `local_inventory_*` | YES | Phase 1 confirmed in `conduit_stock.py`, `jefri_nonmoving.py` | Need per-SKU daily-average-sales for cover days calc |
| Google Ads performance | `google_ads.campaign_performance` + `product_performance` | YES | `dm_campaign.py` full file — cost, conversion_value, impressions, clicks, ROAS | Campaign-level confirmed; product-level has 73% match rate; SKU-level via product_item_id join |
| Landed cost / variable fees | **NOT FOUND** | NO | Grepped all backend .py files for `landed_cost`, `cost_price`, `cogs`, `variable_fee` — ZERO matches | **BLOCKER D2** — no source exists in any DB or file |
| Reviews / Return rate | **NOT FOUND** | NO | Grepped all backend .py files for `review`, `return_rate`, `refund_rate` — zero relevant matches | **BLOCKER D3** — no customer review or return data exists |
| Promotion approvals | **NOT FOUND** | NO | No table in DATABASE-TABLE-INVENTORY.md | Must be built new |
| Promotion history / audit | **NOT FOUND** | NO | No table in DATABASE-TABLE-INVENTORY.md | Must be built new |
| SKU exclusion list | **NOT FOUND** | NO | No table in DATABASE-TABLE-INVENTORY.md | Must be built new |
| Policy doc `Nishani_Promotion_Multi_Channel.docx` | **NOT FOUND** | NO | Glob `**/*Nishani*` across AIOS root — zero results | **BLOCKER D1** |

---

## 8. Reusable Files and Components

### Backend (copy/reuse these patterns)

| File | What to Reuse |
|---|---|
| `backend/app/admin/admin_repeat_customer_products.py` | Admin page pattern: ScheduledSnapshot, router, auth, compute_fn, GET endpoint |
| `backend/app/admin/muguntha_budget_alerts.py` | Rule engine pattern, Discord notification, approval workflow pattern |
| `backend/app/core/task_auth.py` | `make_admin_task_auth("tools.PromotionAutomation")` — copy pattern exactly |
| `backend/app/core/scheduled_snapshot.py` | ScheduledSnapshot — instantiate with scope + table_name + compute_fn |
| `backend/app/core/db.py` | `get_conn()` (app DB), `get_business_conn()` (business DB read-only) |
| `backend/app/dashboard_pages/dm_campaign.py` | Business DB join pattern: listings + order_management + google_ads |

### Frontend (copy/reuse these patterns)

| File | What to Reuse |
|---|---|
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Rule-based admin page with filters, status badges, approval actions |
| `frontend/src/admin/pages/RepeatCustomers.jsx` | Table + KPI cards + CSV export pattern |
| `frontend/src/components/Sidebar.jsx` | `DashboardShell`, `tabPanelClass`, `LazyPanel`, `useStickyTab` |
| `frontend/src/lib/apiFetch.js` | Always use this for API calls — attaches Authorization header |
| `frontend/src/taskRegistry.js` | Add new TOOLS entry here — single source of truth |
| `frontend/src/admin/AdminLayout.jsx` | Add nav item + panel render — follow existing pattern |

---

## 9. Policy Conflicts and Decisions Required

**BLOCKER D1** — `Nishani_Promotion_Multi_Channel.docx` NOT FOUND in AIOS workspace. All score sections, weights, thresholds, discount ranges, and hard rejection rules are UNKNOWN.

| # | Decision | Owner | Impact |
|---|---|---|---|
| D1 | Provide `Nishani_Promotion_Multi_Channel.docx` (or paste key sections) | Piranav | BLOCKER — cannot define any score logic |
| D2 | Source for landed cost / variable fees | Piranav | BLOCKER — cannot compute financial guardrails |
| D3 | Source for reviews / return rate | Piranav | BLOCKER — cannot compute full 5-section score |
| D4 | Resolve conflicting discount ranges in policy | Piranav approval | Cannot generate promotion briefs |
| D5 | Which platforms in scope for Phase 1 (Google only, or also Amazon, Meta?) | GPT/Piranav | Affects eligibility logic |
| D6 | Approver identity and SLA (who approves? in how many hours/days?) | Piranav | Affects approval workflow design |
| D7 | Notification channel — Discord (existing pattern in budget_alerts.py) or email? | Piranav | Affects Phase 4 |

---

## 10. Recommended Implementation Sequence

**Phase 0 (PREREQUISITE — no code until complete):**
- Resolve D1, D2, D3 (blockers)

**Phase 1 — Schema + Score Engine (after P0):**
- Create `promotion_automation` schema + tables in app DB
- Build qualification score compute (per policy, all 5 sections)
- Wire to ScheduledSnapshot (daily at 2:00 AM Sri Lanka time)
- Backend endpoints: GET score list, GET SKU score detail
- Auth: `make_admin_task_auth("tools.PromotionAutomation")`

**Phase 2 — Promotion Intent + Brief + Approval:**
- Intent creation (single-intent-per-SKU enforced via DB unique constraint)
- Brief generator (discount range, budget, platforms, duration)
- Approval queue endpoints (approve/reject with note, creates audit record)
- Frontend: Qualification + Intents + Approval tabs

**Phase 3 — Active Promotions + Monitoring + Kill Switch:**
- Active promotion record on approval
- Day 7/14/30 ScheduledSnapshot performance checks
- Kill condition auto-termination
- Manual kill switch (admin-only, requires reason)

**Phase 4 — Notifications + Governance:**
- Discord notification on approval/rejection (pattern from budget_alerts.py)
- Spending limit enforcement
- Audit log CSV export
- Admin policy settings (thresholds, SKU exclusion management)

---

## 11. Test Strategy

- Unit tests for score compute: boundary values (0, 100, threshold), each section independently
- Unit test for single-intent enforcement: second submission → 409
- Unit test for each kill condition independently
- Unit test for hard rejection rules
- Integration test: full workflow in test DB
- Pattern: 49+ tests (RC-02 standard set), all pass before any browser test
- No DB mocking — existing pattern uses real schema

---

## 12. Evidence Summary

| Item | Verified? | Source |
|---|---|---|
| Git remote correct (websitetecteam-arch/dm-dashboard) | YES | `git remote -v` output |
| Branch: piranv-work | YES | `git branch --show-current` output |
| Working tree clean before merge | YES | `git status -sb`: clean |
| Merge succeeded (fast-forward, no conflicts) | YES | `git merge origin/main` output |
| HEAD after merge: 087d807 | YES | `git log -5` post-merge |
| make_task_auth() full implementation | YES | `core/task_auth.py` read in full |
| make_admin_task_auth() — admin does NOT bypass | YES | `core/task_auth.py` lines 77–101 |
| Permission storage: public.access_grants table | YES | `DATABASE-TABLE-INVENTORY.md` line 150 |
| Roles: dev, admin, staff | YES | `core/task_auth.py` `_PRIVILEGED_ROLES = {"admin", "dev"}` |
| taskRegistry.js TOOLS naming convention | YES | `taskRegistry.js` read in full — pattern: `tools.PascalCase` |
| ScheduledSnapshot startup spacing (60s) | YES | `core/scheduled_snapshot.py` lines 41-48 |
| Business DB 10-connection cap | YES | Phase 1 confirmed |
| google_ads.product_performance (SKU-level ads) | YES | `dm_campaign.py` docstring — 73% match rate |
| Landed cost data | NOT FOUND | Grep across all backend .py: zero matches |
| Customer reviews / return rate data | NOT FOUND | Grep across all backend .py: zero relevant matches |
| Policy document Nishani_Promotion_Multi_Channel.docx | NOT FOUND | Glob across full AIOS root: zero results |
| n8n removed | YES (re-confirmed) | `main.py` comment: "old, already-removed n8n integration" (line ~210) |
