# Evidence — Avasam UK Stock CSV Tool Phase 1 Discovery
## Date: 2026-10-27
## Status: COMPLETE — ready for Phase 2 approval

---

## A. AIOS Assets Found

| Asset | Path | Status |
|---|---|---|
| Original workflow capability | `capability/2026/10/2026-10-07/avasam-uk-stock-update-workflow-2026-10-07.md` | ACTIVE |
| Original workflow prompt | `prompts/reusable/avasam-uk-stock-update-workflow.md` | ACTIVE |
| Extended output prompt (27 Oct) | `prompts/reusable/avasam-uk-stock-retrieve-extended-output-2026-10-27.md` | ACTIVE |
| Phase 1 discovery prompt | `prompts/dm-dashboard/avasam-uk-stock-csv-tool-phase1-discovery-2026-10-27.md` | NEW |
| Evidence 2026-10-07 | `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md` | PASS |
| Evidence 2026-10-27 | `evidence/avasam/avasam_stock_update_2026-10-27_evidence.md` | PASS |
| Output CSV 2026-10-07 | `evidence/avasam/avasam_stock_2026-10-07.csv` | EXISTS |
| Output CSV 2026-10-27 | `evidence/avasam/avasam_uk_current_stock_2026-10-27.csv` | EXISTS |
| Validation 2026-10-27 | `validation/piranav/avasam-stock-update-2026-10-27-validation.md` | PASS |

---

## B. Previous 2,656-SKU Workflow — Validation Status

**Run date:** 2026-10-27
**Input:** `Avasam Products Stock Update - stock update - 27_10.csv` (2,656 rows)
**Output:** `evidence/avasam/avasam_uk_current_stock_2026-10-27.csv` (2,656 rows)

| Metric | Value |
|---|---|
| Matched | 2,605 (98.1%) — PASS |
| Unmatched | 26 (bundle SKUs + 3 singles) |
| Ambiguous | 25 (sku vs sku_original conflict) |
| Zero stock | 812 |
| Positive stock | 1,793 |
| DB rows scanned | 45,314 |

**SKU matching rules used:**
1. Primary match: `inventory.products.sku`
2. Fallback: `inventory.products.sku_original`
3. If both match different product IDs → `AMBIGUOUS`
4. No match → `UNMATCHED` (never silently set to zero)

**Stock column:** `inventory.local_inventory_current_stock_location_wise.stock`
**Join:** `uk.inventory_id = p.id AND uk.warehouse_location = 'UK'`
**Aggregation:** No aggregation needed — one UK row per product confirmed

**Validation: PASS** — all checks passed, evidence on file.

---

## C. DM Dashboard Architecture

### Repository
- Root: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`
- Git remote: `https://github.com/websitetecteam-arch/dm-dashboard.git`
- Active branch: `piranv-work`

### Backend
- **Framework:** FastAPI (Python)
- **Entry point:** `backend/app/main.py`
- **Structure:** `backend/app/dashboard_pages/` — one `.py` file per page, each exports a `router`
- **Auth pattern:** JWT Bearer token, decoded by `core/auth.py:verify_token()`. Claims: `sub`, `role`, `staff_key`
- **Roles:** `admin`, `dev`, staff roles. `admin`/`dev` bypass task grants; staff need explicit UAM grant
- **Task auth factory:** `core/task_auth.py:make_task_auth("tools.SomeKey")` — used for write endpoints
- **Admin-only auth:** `core/auth.py:verify_strict_admin_token()` — used for admin-exclusive pages
- **Router registration:** All routers imported and registered in `main.py`

### Database Connections
| Pool | Function | Schemas | Usage |
|---|---|---|---|
| `get_conn()` | App DB (users, grants, logs) | public (users, access_grants, etc.) | Auth, UAM, task logging |
| `get_business_conn()` | Business DB | google_ads, listings, inventory, order_management | **Inventory queries — confirmed working** |
| `get_business2_conn()` | Business DB 2 | blos | Optional, for specific price features |

**Key finding:** `inventory.products` and `inventory.local_inventory_current_stock_location_wise` are already accessed via `get_business_conn()` in `jefri_nonmoving.py` (lines 281–296). No new DB connection or environment variable is needed.

### Confirmed SQL Pattern (from jefri_nonmoving.py lines 283–295)
```python
with get_business_conn() as conn:
    rows = conn.execute(
        """
        SELECT p.sku AS base_sku, COUNT(DISTINCT p.id) AS product_matches, SUM(s.stock) AS stock
        FROM inventory.products p
        JOIN inventory.local_inventory_current_stock_location_wise s ON s.inventory_id = p.id
        WHERE p.sku = ANY(%s) AND s.warehouse_location = %s
        GROUP BY p.sku
        """,
        (unique, WAREHOUSE_LOCATION),
    ).fetchall()
```
**Note:** This uses `p.sku` only. For the Avasam tool we must also match `p.sku_original`. The 2026-10-27 run confirmed 25 ambiguous SKUs where sku ≠ sku_original — the Avasam tool needs dual-key matching.

### Existing File Upload Pattern
- **File:** `backend/app/dashboard_pages/listing_issues.py`
- **Import:** `from fastapi import UploadFile, File`
- **Upload directory:** `backend/uploads/listing_issues/`
- **Allowed MIME types:** includes `text/csv`
- **Max size:** 20 MB
- **Pattern:** `UploadFile` parameter → read bytes → process → `StreamingResponse` for download
- The Avasam tool does NOT need to persist the uploaded file — process in memory and stream CSV back immediately.

### Existing CSV Download Pattern
- **File:** `backend/app/dashboard_pages/admin_repeat_customer.py` lines 353–405
- Uses `StreamingResponse` with generator, `media_type="text/csv"`, `Content-Disposition: attachment`
- CSV injection protection: `_safe_csv_field()` helper
- Streams directly — never written to disk

### Frontend
- **Framework:** React 19 + Vite
- **Admin pages:** `frontend/src/admin/pages/` — one `.jsx` per page
- **Routing:** `AdminLayout.jsx` reads `TOOLS` array from `taskRegistry.jsx`
- **Tool registration:** `taskRegistry.jsx` TOOLS array — each entry: `taskKey`, `label`, `kind: 'tool'`, `lazy: true`, `load: () => import('./path/to/Component')`
- **UAM:** `UserAccessManagement.jsx` reads `TOOLS` from `taskRegistry.jsx` — single source of truth

### UAM Pattern
- Every tool gets a `taskKey` like `tools.AvasamUkStock`
- `make_task_auth("tools.AvasamUkStock")` on the backend enforces access at the API level
- Admin grants access per staff member via the UAM page
- New admin tools: use `verify_strict_admin_token()` if admin-only, or `make_task_auth()` for grantable access
- **Recommended for Avasam page:** `admin`-role only (same as `ListingIssues` pattern) since this involves business inventory data. Can be made grantable to specific staff if needed in Phase 2.

---

## D. Git Repository Status

| Field | Value |
|---|---|
| Root | `C:\Users\PC\Documents\piranav_aios\dm-dashboard` |
| Branch | `piranv-work` |
| Upstream | `origin/piranv-work` |
| Remote name | `origin` |
| Remote URL | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Working tree | **CLEAN** — nothing to commit |
| Local vs remote | Up to date with `origin/piranv-work` |
| Latest commit | `69cee74` — feat(seo-url-intelligence): UI/UX redesign |

---

## E. Git Pull Readiness

**Status: SAFE TO PULL**

Working tree is clean. Branch is `piranv-work` and tracks `origin/piranv-work`.

Recommended pull command (do not run until approved):
```bash
cd C:\Users\PC\Documents\piranav_aios\dm-dashboard
git pull origin piranv-work
```

**Note:** Also check if `origin/main` has diverged — `main` is behind by 220 commits locally. This is normal if `piranv-work` is the active development branch. Do not merge main into piranv-work without Piranav approval.

**GitHub account for push:** `websitetecteam-arch`

---

## F. Database Integration Approach

**Conclusion: No new DB pool, no new env var required.**

`inventory.*` is already accessible via `get_business_conn()` (= `BUSINESS_DATABASE_URL`). This is confirmed live by `jefri_nonmoving.py` which already queries `inventory.products` and `inventory.local_inventory_current_stock_location_wise` with `warehouse_location = 'UK'`.

**Recommended backend approach:**
1. Accept uploaded CSV via `UploadFile`
2. Parse in memory (Python `csv` module, `utf-8-sig`)
3. Extract SKU list
4. Query `inventory.products + local_inventory_current_stock_location_wise` via `get_business_conn()` using `p.sku = ANY(%s) OR p.sku_original = ANY(%s)` with `warehouse_location = 'UK'`
5. Build dual-key stock map (sku + sku_original), flag conflicts as AMBIGUOUS
6. Match all input rows, append columns
7. Stream output CSV back as `StreamingResponse`
8. No file written to disk, no DB writes

**Security:**
- DB credentials never leave the backend
- Query is read-only (SELECT only)
- `BUSINESS_DATABASE_URL` role already confirmed as `dev_user` (read-only role)
- CSV output streamed — never persisted server-side

---

## G. Minimal Implementation Plan

### Files to create
| File | Purpose |
|---|---|
| `backend/app/dashboard_pages/avasam_uk_stock.py` | FastAPI router — upload endpoint + CSV stream |
| `frontend/src/admin/pages/AvasamUkStock.jsx` | React page — upload UI, status, download button |

### Files to modify
| File | Change |
|---|---|
| `backend/app/main.py` | Import and register `avasam_uk_stock.router` |
| `frontend/src/taskRegistry.jsx` | Add `tools.AvasamUkStock` entry to TOOLS array |
| `frontend/src/admin/AdminLayout.jsx` | Add nav item under appropriate section |

### Backend endpoint design
```
POST /api/avasam-uk-stock/upload
  - Auth: verify_strict_admin_token (admin only)
  - Input: UploadFile (CSV, max 10MB)
  - Validate: header row has SKU column
  - Query: SELECT p.id, p.sku, p.sku_original, COALESCE(s.stock, 0) AS uk_stock
            FROM inventory.products p
            LEFT JOIN inventory.local_inventory_current_stock_location_wise s
              ON s.inventory_id = p.id AND s.warehouse_location = 'UK'
            WHERE p.sku = ANY(%s) OR p.sku_original = ANY(%s)
  - Match: dual-key, flag AMBIGUOUS
  - Response: StreamingResponse CSV with original cols + UK_Current_Stock, Matched_Product_ID, Matched_By, Stock_Status
  - Also return: matched/unmatched/ambiguous counts in Content headers or a summary endpoint
```

### UAM / permission
- `taskKey: 'tools.AvasamUkStock'`
- Backend: `verify_strict_admin_token()` — admin-only initially
- Frontend: registered in TOOLS → automatically appears in UAM matrix
- Grant to Piranav on first deploy

### Design system
- Reuse `jreq-*` CSS classes (jreq-eyebrow, jreq-tbar, jreq-scroll, jreq-cards)
- Drag-drop file input + status row counts + download button
- Pattern reference: `SeoUrlIntelligence.jsx` (most recent jreq-* implementation)

---

## H. Files Created/Modified During Discovery

| File | Action |
|---|---|
| `prompts/dm-dashboard/avasam-uk-stock-csv-tool-phase1-discovery-2026-10-27.md` | CREATED |
| `evidence/avasam/avasam-uk-stock-csv-tool-phase1-discovery-2026-10-27.md` | CREATED (this file) |
| `PROMPT_REGISTER.md` | UPDATED |
| `closure/README.md` | UPDATED |

No application code modified. No git commits made.

---

## I. Evidence and Closure Paths

- Evidence: `evidence/avasam/avasam-uk-stock-csv-tool-phase1-discovery-2026-10-27.md`
- Closure: `closure/README.md` — AVASAM-P1-DISC-001

---

## J. Risks and Required Approvals

| Risk | Severity | Action Required |
|---|---|---|
| `BUSINESS_DATABASE_URL` connection limit (max_size=4) | LOW | Avasam upload is one-shot, not concurrent — unlikely to hit limit. Monitor post-deploy. |
| 25 AMBIGUOUS SKUs (sku vs sku_original conflict) | MEDIUM | Piranav to review and confirm resolution rule before Phase 2 |
| 26 UNMATCHED SKUs (bundles + 3 singles) | LOW | Expected — document in tool UI. ENC3548, SWGS1GBL1, PHSF1PWR40WH??? worth investigating separately |
| File upload size | LOW | Cap at 5MB (Avasam CSV ~200KB). Add MIME + size validation |
| CSV injection in streamed output | LOW | Use `_safe_csv_field()` pattern from admin_repeat_customer.py |
| UAM grant on first deploy | ACTION REQUIRED | Piranav must grant `tools.AvasamUkStock` to self via UAM after deploy |
| piranv-work branch not merged to main | INFO | All new files must go to piranv-work, not main |

**Approvals needed before Phase 2:**
1. Piranav confirms UAM permission model (admin-only vs grantable to staff)
2. Piranav confirms AMBIGUOUS SKU resolution rule (keep blank vs use sku match over sku_original)
3. Piranav approves the implementation plan above
4. git pull from `origin/piranv-work` approved (working tree is clean — safe)
