# Evidence: Promotion Automation — Phase 1 Discovery

**Date:** 2026-10-15  
**Requirement ID:** PROMO-01  
**Task:** Read-only discovery for Promotion Automation page inside DM Dashboard  
**Status:** COMPLETE — discovery only, no implementation  
**Session Result:** PASS (with BLOCKERS — see below)

---

## 1. Repository and Architecture Discovery Report

### DM Dashboard

| Property | Value |
|---|---|
| Local root | `C:\Users\PC\Documents\piranav_aios\dm-dashboard` |
| Git remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Active branch | `piranv-work` |
| Working tree | **CLEAN** — nothing to commit, working tree clean |
| Uncommitted changes | **NONE** — all existing work is committed |
| Git account to push | `websitetecteam-arch` |

**VERIFIED FACT:** Working tree is clean. No existing uncommitted changes to preserve.

### Root folder structure (verified)

```
dm-dashboard/
  backend/        FastAPI Python backend
  frontend/       React 19 + Vite frontend
  docs/           Internal docs (includes DATABASE-TABLE-INVENTORY.docx)
  migrations/     SQL migrations (mahima_ownership_seed.sql found)
  mcp/            MCP integration
  README.md
```

### Backend Architecture (VERIFIED FACT)

| Component | Detail |
|---|---|
| Framework | FastAPI 0.115.0 + Uvicorn |
| Language | Python (psycopg3 for Postgres) |
| Auth | JWT (pyjwt) + bcrypt — `make_task_auth("tools.<ToolKey>")` pattern |
| Scheduling | `ScheduledSnapshot` class in `core/scheduled_snapshot.py` — compute-once, serve-instantly from Postgres JSON snapshot |
| Background jobs | `core/background_job.py` |
| Two DB pools | App DB (`DATABASE_URL`) + Business DB (`BUSINESS_DATABASE_URL`) + optional Business DB 2 (`BUSINESS_DATABASE_2_URL`) |
| Connection limit | Business DB: hard 10-connection cap; pool max_size=4 |

### Backend module map (key modules)

| Module path | Purpose |
|---|---|
| `app/core/scheduled_snapshot.py` | Reusable ScheduledSnapshot pattern — proven pattern for any slow-compute page |
| `app/core/task_auth.py` | `make_task_auth(toolKey)` — UAM access control |
| `app/core/db.py` | DB connection pools |
| `app/admin/admin_repeat_customer.py` | Repeat customer list (reference implementation for admin page pattern) |
| `app/admin/admin_repeat_customer_products.py` | Product analytics (most recent admin page — best reference) |
| `app/admin/muguntha_budget_alerts.py` | Budget alerts with rule engine (reference for rule-based automation) |
| `app/dashboard_pages/dm_campaign.py` | Google Ads + revenue join (has `order_management.orders` + `order_item_info` join) |
| `app/dashboard_pages/conduit_stock.py` | Stock queries against `inventory.products` + `local_inventory_current_stock_location_wise` |
| `app/automation_task/jefri_nonmoving.py` | Non-moving product detection — has `inventory.products` + sales history join |

### Frontend Architecture (VERIFIED FACT)

| Component | Detail |
|---|---|
| Framework | React 19 + Vite |
| Admin pages location | `frontend/src/admin/pages/` |
| Routing | Component-based, registered in `taskRegistry.js` and `devTasksRegistry.js` |
| Nav/access | `AdminLayout.jsx` — sidebar nav, toolKey-gated |
| Existing admin pages | `UserAccessManagement.jsx`, `BudgetAlerts.jsx`, `RepeatCustomers.jsx` (best reference) |

### n8n Integration Status (VERIFIED FACT)

**n8n is NOT active.** The only n8n reference in the codebase is a comment in `backend/app/main.py` line ~168:
> `# code comment about an old, already-removed n8n integration`

n8n was previously used but has been removed. Any n8n re-integration would need to be built from scratch.

---

## 2. AIOS Existing Asset and Duplicate Check Report

| Asset type | Existing files related to promotion automation | Decision |
|---|---|---|
| Prompts | None — no promotion automation prompt existed | CREATE — this file |
| Evidence | None in `evidence/dm-dashboard/` | CREATE — this file |
| Capability | No promotion capability exists | CREATE if new capability confirmed |
| Closure | Previous open items: RC-02 B3 drill-down (browser verify pending) | Separate item |
| PROMPT_REGISTER | No promotion row exists | ADD row |
| Source-map | Business DB schemas not fully mapped | UPDATE recommended |

**Duplicate risk:** GREEN — no existing promotion automation documentation found.

**Existing OPEN items from closure (from previous session 2026-10-14):**
- RC-02 B3: backend restart + product sync + browser test still pending

---

## 3. Promotion Policy Requirements Matrix

### BLOCKER: Policy Document Not Found

`Nishani_Promotion_Multi_Channel.docx` was searched across all of:
- `C:\Users\PC\Documents\piranav_aios\` (full recursive glob)
- `dm-dashboard/` subfolder
- All `.docx` files enumerated

**Result: NOT FOUND.** The document does not exist in the AIOS workspace.

**BLOCKER — Resolution required:** Piranav must provide or locate `Nishani_Promotion_Multi_Channel.docx` before the requirements matrix can be completed.

The following is a placeholder structure based on the task brief description only:

| Section | Points (unknown) | Verified from doc? |
|---|---|---|
| Section 1 — (unknown) | Unknown | NO — doc missing |
| Section 2 — (unknown) | Unknown | NO — doc missing |
| Section 3 — (unknown) | Unknown | NO — doc missing |
| Section 4 — (unknown) | Unknown | NO — doc missing |
| Section 5 — (unknown) | Unknown | NO — doc missing |
| Hard rejection rules | Unknown | NO — doc missing |
| Promotion intents (5) | Unknown | NO — doc missing |
| Financial guardrails | Unknown | NO — doc missing |
| Platform eligibility | Unknown | NO — doc missing |
| Permanent exclusions | Unknown | NO — doc missing |
| Discount ranges | CONFLICTING per task brief | NO — doc missing |
| Kill conditions | Unknown | NO — doc missing |

**ASSUMPTION (from task brief only):** The policy defines a 0–100 qualification score across 5 sections, exactly one promotion intent per SKU, Day 7/14/30 performance monitoring, and automatic termination.

---

## 4. Data Availability and Integration Gap Matrix

| Required Data | Existing Source | Verified? | Gap |
|---|---|---|---|
| Product / SKU | `listings.shopify_listings` (site=UK) — columns: id, item_id, sku, mapped_sku, parent_sku, title, product_type, status, price, main_image_url | YES | No cost price, no margin. Price only = Shopify selling price. |
| Sales history (units, revenue) | `order_management.orders` JOIN `order_management.order_item_info` — columns confirmed: real_sku, real_qty, real_price, product_id, variant_id, order_date | YES | Revenue = real_price × real_qty. No discount field confirmed yet. No refund/return netting confirmed. |
| Sales by channel/platform | `order_management.sub_source` (sub_source_id) — used in daily_orders.py | PARTIAL | Sub-source maps to marketplace/channel but column mapping not fully inspected. |
| Inventory / Stock cover | `inventory.products` JOIN `inventory.local_inventory_current_stock_location_wise` — stock qty per location | YES | Stock cover (days) = stock_qty / avg_daily_sales — this JOIN exists in conduit_stock.py and jefri_nonmoving.py. Needs compute per SKU. |
| Landed cost / variable fees | **NOT FOUND** in any backend query | NO | **GAP — BLOCKER.** No landed_cost, variable_fee, or margin column found in any queried table. Source unknown. |
| Reviews / Return rate | **NOT FOUND** | NO | **GAP — BLOCKER.** No review count or return rate table found in business DB. |
| Google Ads platform performance | Google Ads data via Postgres — confirmed in `dm_campaign.py` (cost, conversions, conversion_value, impressions, clicks, ROAS) by product/campaign | YES | Linked by campaign/product_id. SKU-level mapping may need `listings.shopify_listings` JOIN. |
| Promotion approvals | **NOT FOUND** | NO | **GAP.** No approval workflow table exists. Would need to be created. |
| Promotion history / audit | **NOT FOUND** | NO | **GAP.** No promotion record or audit trail table exists. |
| Product exclusion list | **NOT FOUND** | NO | **GAP.** No permanent SKU exclusion list exists in any DB or file. |
| Promotion active status per SKU | **NOT FOUND** | NO | **GAP.** No "one promotion intent per SKU" enforcement table exists. |

**Summary of gaps:**
- 5 of 11 data requirements have NO existing source
- Landed cost / variable fees: most critical gap — cannot compute financial guardrails without it
- Reviews / return rate: no data source in business DB at all
- All promotion-specific tables (approvals, history, exclusions, active intent) must be created new

---

## 5. Proposed Page Structure and User Workflow

**ASSUMPTION / RECOMMENDATION** — to be validated against actual policy doc.

### Page: Promotion Automation (Admin)

**URL:** `/admin/promotion-automation` (pattern: matches existing admin pages)  
**Auth:** `tools.PromotionAutomation` — via `make_task_auth` + UAM grant

### Tabs proposed

| Tab | Purpose |
|---|---|
| **Dashboard** | Summary: SKUs in each qualification tier, active promotions, pending approvals |
| **Qualification Score** | Per-SKU score breakdown (5 sections), filters by score range, platform |
| **Promotion Intents** | One active intent per SKU — view/edit/reject; enforce single-intent rule |
| **Approval Queue** | Pending promotion briefs awaiting Piranav/manager approval |
| **Active Promotions** | Live promotions with Day 7/14/30 KPIs, kill switch |
| **Audit History** | Full audit trail — created, approved, terminated, with reasons |

### User workflow

```
1. System computes qualification score per SKU (scheduled, e.g. daily)
2. SKUs above threshold appear in Qualification Score tab
3. User selects promotion intent for eligible SKU (one per SKU enforced)
4. System generates promotion brief (discount range, budget, platforms, duration)
5. Brief sent to Approval Queue
6. Approver approves or rejects with note
7. On approval: system records active promotion; notifies relevant staff
8. Day 7 / Day 14 / Day 30 check: auto-compute KPIs against targets
9. If kill conditions met: auto-terminate; log in Audit History
10. On termination or expiry: SKU is eligible for new promotion intent
```

---

## 6. Proposed Backend, Database, and n8n Architecture

### RECOMMENDATION — reuse existing patterns

| Component | Approach |
|---|---|
| ScheduledSnapshot | Use for qualification score compute (daily at off-peak hours) |
| New schema | `promotion_automation.*` in app DB (pattern: `jefri_nonmoving.*`) |
| API router | `app/admin/promotion_automation_*.py` (modular, like RC-02) |
| Auth | `make_task_auth("tools.PromotionAutomation")` |
| n8n | NOT recommended — n8n is removed. Use ScheduledSnapshot + Python for automation. |

### New DB tables required (ASSUMPTION — needs policy doc confirmation)

| Table | Purpose |
|---|---|
| `promotion_automation.sku_score` | Per-SKU qualification score snapshot (JSON) |
| `promotion_automation.sku_score_history` | Score history per run |
| `promotion_automation.promotion_intent` | One active intent per SKU (enforced by unique constraint on sku) |
| `promotion_automation.promotion_brief` | Generated brief per intent |
| `promotion_automation.approval` | Approval/reject workflow |
| `promotion_automation.active_promotion` | Live promotions with start date, platforms, discount |
| `promotion_automation.performance_check` | Day 7/14/30 KPI snapshot |
| `promotion_automation.audit_log` | Immutable audit trail |
| `promotion_automation.sku_exclusion` | Permanent SKU exclusion list |
| `promotion_automation.run` | Compute run log |

### Data gaps that block backend design

- Landed cost source → cannot compute financial guardrails (margin %, contribution)
- Review/return rate source → cannot compute 2 of 5 score sections (assumed)
- Policy doc → cannot define score weights, thresholds, or discount ranges

---

## 7. Role and Permission Requirements

| Role | Access | UAM Tool Key |
|---|---|---|
| Admin / Piranav | Full — score, intents, approvals, kill switch, audit | `tools.PromotionAutomation` |
| Manager | Approve/reject briefs, view active, view audit | `tools.PromotionApproval` (new) |
| Read-only | View scores and active promotions only | `tools.PromotionView` (new) |

**RECOMMENDATION:** Start with single toolKey `tools.PromotionAutomation` for Piranav only. Expand to multi-role in Phase 2 after policy is confirmed.

---

## 8. Financial and Automation Risks

| Risk | Severity | Status |
|---|---|---|
| No landed cost data → cannot enforce financial guardrails | HIGH | BLOCKER |
| Policy doc missing → score weights, thresholds, discount ranges all unknown | HIGH | BLOCKER |
| Conflicting discount ranges in policy (flagged in task brief) | HIGH | Needs approved resolution before Phase 2 |
| Single-promotion-intent enforcement: race condition if two users submit simultaneously | MEDIUM | Mitigate with DB unique constraint on sku + transaction |
| Kill conditions trigger while staff reviewing a brief | MEDIUM | Needs locking design |
| n8n is removed — any automation must be Python/ScheduledSnapshot | LOW | Documented — no external dep |
| Business DB 10-connection cap shared across all snapshots | MEDIUM | Stagger compute per existing startup spacing pattern |
| No review/return rate data → score sections incomplete | HIGH | BLOCKER — needs data source decision |

---

## 9. Phased Implementation Plan with Acceptance Criteria

**Phase 0 — Prerequisite (BLOCKER — do before any code)**

| Step | Action | Owner |
|---|---|---|
| P0-1 | Obtain and share `Nishani_Promotion_Multi_Channel.docx` | Piranav |
| P0-2 | Identify source of landed cost and variable fees | Piranav + GPT |
| P0-3 | Identify source of review counts and return rates | Piranav + GPT |
| P0-4 | Resolve conflicting discount ranges in policy | Piranav approval |
| P0-5 | Confirm which 5 score sections and their point allocation | GPT review of policy doc |

**Phase 1 — Schema and Score Engine**

| Step | Action | Acceptance Criteria |
|---|---|---|
| 1-A | Create `promotion_automation` schema + 10 tables | Schema migrations run without error |
| 1-B | Build qualification score compute function (per policy) | Score 0–100 reproducible for test SKUs |
| 1-C | Wire to ScheduledSnapshot (daily) | Score visible in sync monitor |
| 1-D | Backend endpoints: GET score list, GET SKU score detail | 200 response with correct structure |

**Phase 2 — Promotion Intent and Brief**

| Step | Action | Acceptance Criteria |
|---|---|---|
| 2-A | Build intent creation endpoint (enforces one-per-SKU) | Second intent submission returns 409 |
| 2-B | Brief generator (discount, budget, platforms) | Brief matches policy rules |
| 2-C | Approval queue endpoints | Approve/reject creates audit record |
| 2-D | Frontend: Qualification + Intents + Approval tabs | UAM-gated, no console errors |

**Phase 3 — Active Promotions and Monitoring**

| Step | Action | Acceptance Criteria |
|---|---|---|
| 3-A | Active promotion record on approval | Appears in Active tab immediately |
| 3-B | Day 7/14/30 ScheduledSnapshot performance check | KPIs populated at correct day milestones |
| 3-C | Kill condition auto-termination | Terminated promotions appear in Audit History with reason |
| 3-D | Manual kill switch | Admin can terminate any active promotion with reason |

**Phase 4 — Notifications and Governance**

| Step | Action | Acceptance Criteria |
|---|---|---|
| 4-A | Discord or email notification on approval/rejection | Notification delivered (pattern from MUGA-BRAS) |
| 4-B | Spending limit enforcement | System rejects briefs exceeding limit |
| 4-C | Audit export | Audit log exportable as CSV |

---

## 10. Test Strategy and Outstanding Decisions

### Test strategy

- Unit tests for score compute function: boundary values (0, 100, threshold)
- Unit tests for hard rejection rules: each rule independently
- Unit test for single-intent enforcement: duplicate submission → 409
- Unit test for kill conditions: each condition independently
- Integration test: full workflow end-to-end in test DB
- Pattern: 49+ tests (RC-02 standard), all pass before any browser test
- No mocking of DB (pattern: existing tests use real schema)

### Outstanding decisions (all BLOCKERS for Phase 1)

| # | Decision | Owner | Impact |
|---|---|---|---|
| D1 | Where is `Nishani_Promotion_Multi_Channel.docx`? | Piranav | Cannot define any score logic |
| D2 | What is the source of landed cost / variable fees? | Piranav | Cannot compute financial guardrails |
| D3 | What is the source of review count and return rate? | Piranav | Cannot compute full score |
| D4 | Resolve conflicting discount ranges | Piranav approval | Cannot generate promotion briefs |
| D5 | Which platforms are in scope for Phase 1? (Google, Meta, Amazon, all?) | GPT/Piranav | Affects platform eligibility logic |
| D6 | Who are the approvers? What is the approval SLA? | Piranav | Affects approval workflow design |
| D7 | Should notifications go to Discord (existing pattern) or email? | Piranav | Affects Phase 4 implementation |

---

## Evidence Summary

| Item | Verified? | Source |
|---|---|---|
| DM Dashboard repo + branch | YES | `git status` output |
| Working tree clean (no uncommitted changes) | YES | `git status`: "nothing to commit, working tree clean" |
| Backend framework: FastAPI + psycopg3 | YES | `requirements.txt` |
| ScheduledSnapshot pattern | YES | `core/scheduled_snapshot.py` read |
| UAM make_task_auth pattern | YES | `admin/admin_repeat_customer.py` line 54 |
| Business DB schemas: listings, inventory, order_management | YES | Multiple `.py` query files |
| listings.shopify_listings columns | YES | `sajeepan_lens_sql.py` `_CATALOGUE_COLUMNS` |
| order_management.orders + order_item_info | YES | `dm_campaign.py`, `jefri_nonmoving.py` |
| inventory.products + local_inventory join | YES | `conduit_stock.py`, `jefri_nonmoving.py` |
| n8n removed | YES | `main.py` comment line ~168 |
| Landed cost / margin data | NOT FOUND | Searched all backend `.py` files |
| Review / return rate data | NOT FOUND | Searched all backend `.py` files |
| Policy doc `Nishani_Promotion_Multi_Channel.docx` | NOT FOUND | Full AIOS root glob |
| No existing promotion automation tables | YES | No matches in any `.py` or `.sql` |
