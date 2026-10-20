# Evidence: Promotion Automation — Phase 1C Discovery

**Date:** 2026-10-15
**Requirement ID:** PROMO-01-C
**Task:** Dashboard page location + UAM registration discovery for Promotion Automation
**Assigned by:** Muguntha | **Coordinator:** Piranav
**Status:** COMPLETE — read-only discovery only, no implementation
**Session Result:** PASS (with 4 carried-forward blockers — see below)

---

## 1. Git State

| Property | Value |
|---|---|
| Branch | `piranv-work` (VERIFIED) |
| HEAD | `087d807` — Merge branch 'piranv-work' via Dev Tools |
| Ahead of origin/piranv-work | 107 commits (expected — same as Phase 1B) |
| Working tree | CLEAN — no uncommitted changes |
| Push required | YES — when Piranav instructs. Account: `websitetecteam-arch` |

---

## 2. Dashboard Pages Architecture (VERIFIED)

`dashboard_pages/` is located at:
`backend/app/dashboard_pages/`

It contains approximately 70+ individual Python router modules (one per staff page requirement), plus `shared.py`.

**VERIFIED FACT:** There is NO separate `dashboard_pages/__init__.py` routing pattern — each module is imported individually at the top of `main.py` and registered with `app.include_router()`. This was confirmed by reading `main.py` lines 1–360.

### `shared.py` — VERIFIED contents
File: `backend/app/dashboard_pages/shared.py`

Contains shared constants and helpers reused across multiple staff pages:
- Google Ads constants: `GOOGLE_ADS_CAMPAIGN_ID`, `UK_MARKET_PLACE`, `UK_ACCOUNT_ID`, `UK_SUB_SOURCE`
- Math helpers: `roas_pct()`, `r2()`, `r7_verdict()`
- Per-staff shared state: `SJ_CAMPAIGN_IDS` (Sajeepan), `TV_ACCOUNT_ID` / `TV_CAMPAIGNS` (Thivajini), `MAHIMA_CAMPAIGNS`, `SUKIRTHA_R3_PRODUCTS_QUERY`, `THASITHA_GROUP_NAME`, `JEFRI_CAMPAIGN_IDS` (with 1h-cached refresh), `HETHEESHA_*`, `THEEKSHY_CAMPAIGNS`
- Promotion Automation has no shared constants yet — will not need to touch `shared.py` unless cross-page constants emerge.

---

## 3. Two Worked Page Examples (VERIFIED)

### Example A: `dm_campaign.py` — Admin tool, most relevant to Promotion Automation

| Field | Value |
|---|---|
| File path | `backend/app/dashboard_pages/dm_campaign.py` |
| Router definition | `router = APIRouter(prefix="/api/admin/dm-campaign", tags=["admin-dm-campaign"], dependencies=[Depends(make_admin_task_auth("tools.DmCampaign"))])` |
| Permission key | `tools.DmCampaign` |
| Auth helper | `make_admin_task_auth` — role='admin' does NOT bypass; only 'dev' bypasses |
| Database | Business DB (`get_business_conn()`) — READ ONLY |
| Endpoints | Multiple GET endpoints for campaign data; `ScheduledSnapshot` for background compute |
| Frontend component | `frontend/src/admin/pages/DmCampaign.jsx` |
| TOOLS entry | `{ taskKey: 'tools.DmCampaign', label: 'DM Campaign', kind: 'tool', load: () => import('./admin/pages/DmCampaign') }` |
| ADMIN_ITEMS entry | `{ key: 'dm-campaign', toolKey: 'tools.DmCampaign', label: 'DM Campaign', sub: 'ledsone.co.uk — Google Ads overall performance', enabled: true, icon: <svg...> }` |
| main.py import | `from .dashboard_pages.dm_campaign import router as admin_dm_campaign_router` |
| main.py register | `app.include_router(admin_dm_campaign_router)` |
| Snapshot import | `from .dashboard_pages.dm_campaign import start_snapshots as start_dm_campaign_snapshots` (called in startup) |

### Example B: `muguntha_budget_alerts.py` — Admin tool with rule engine + approval workflow

| Field | Value |
|---|---|
| File path | `backend/app/admin/muguntha_budget_alerts.py` |
| Router definition | `router = APIRouter(prefix="/api/admin/budget-alerts", tags=["muguntha-budget-alerts"])` |
| Permission key | `tools.AdminBudgetAlerts` |
| Auth helper | `verify_admin_token` / `verify_token` directly (older pattern — pre-dates `make_admin_task_auth`) |
| Database | App DB (`get_conn()`) + Business DB (`get_business_conn()`) |
| Endpoints | GET for alerts data, POST for approve/reject/dismiss actions, ScheduledSnapshot (6h) |
| Frontend | `frontend/src/admin/pages/BudgetAlerts.jsx` |
| TOOLS entry | `{ taskKey: 'tools.AdminBudgetAlerts', ... }` |
| Pattern note | This is the REFERENCE for approval workflow design — it has pending/approved/rejected/review_required/dismissed statuses |

**KEY DIFFERENCE between examples:** `dm_campaign.py` uses `make_admin_task_auth` inline on the `APIRouter`. `muguntha_budget_alerts.py` uses `verify_admin_token` directly. **For Promotion Automation, follow `dm_campaign.py` — it is the newer, canonical admin tool pattern.**

---

## 4. Page Registration Mechanism (VERIFIED)

**VERIFIED FACT:** All dashboard_pages modules follow exactly this pattern in `main.py`:

```python
# Step 1 — Import at top of main.py
from .dashboard_pages.promotion_automation import router as promotion_automation_router  # noqa: E402
# (if ScheduledSnapshot): from .dashboard_pages.promotion_automation import start_snapshots as start_promotion_snapshots

# Step 2 — Register the router (no prefix argument here — prefix is set inside the module)
app.include_router(promotion_automation_router)

# Step 3 — Start snapshot in startup handler (if used)
@app.on_event("startup")
def _start_snapshots():
    start_promotion_snapshots()
```

The `_ensure_schemas()` startup handler is also in `main.py` — new schema setup functions are called from there.

---

## 5. Frontend Routing and Nav Registration (VERIFIED)

### `taskRegistry.js` — TOOLS array
File: `frontend/src/taskRegistry.js`

The `TOOLS` array is the single source of truth for all admin/grantable tools. Every admin page with a `tools.*` key is registered here. The UAM admin UI reads this array to build the grant matrix.

**Format (exact, from line 117+):**
```js
{ taskKey: 'tools.PromotionAutomation', label: 'Promotion Automation', kind: 'tool', load: () => import('./admin/pages/PromotionAutomation') }
```

### `AdminLayout.jsx` — ADMIN_ITEMS array
File: `frontend/src/admin/AdminLayout.jsx`

This array defines the sidebar nav items. Each item has:
- `key` — unique DOM/tab key
- `toolKey` — matches `taskKey` in `TOOLS` and in `access_grants.task_key`
- `label` — sidebar display name
- `sub` — subtitle shown under label
- `enabled: true`
- `icon` — inline SVG

**Format (exact, following dm-campaign pattern):**
```jsx
{
  key: 'promotion-automation',
  toolKey: 'tools.PromotionAutomation',
  label: 'Promotion Automation',
  sub: 'Product promotion eligibility, scoring & approvals',
  enabled: true,
  icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>),
},
```

This item also needs a lazy import at the top of `AdminLayout.jsx`:
```jsx
const PromotionAutomation = lazy(() => import('./pages/PromotionAutomation'))
```

And a panel render inside the `return` JSX:
```jsx
<div className={tabPanelClass(active, 'promotion-automation')}>
  <Suspense fallback={<PageFallback />}><PromotionAutomation /></Suspense>
</div>
```

### `filterAdminItems()` — VERIFIED logic
File: `frontend/src/admin/AdminLayout.jsx` lines 499–527

This function filters `ADMIN_ITEMS` to only items whose `toolKey` is in `grantedKeys`. An item without a `toolKey` in `access_grants` will not appear in the sidebar. There is no other filter mechanism — no hardcoded role check, no separate allowlist. The admin page nav is entirely grant-driven.

`ALWAYS_VISIBLE_KEYS = new Set(['overview', 'user-access-management'])` — only these two items always show. Everything else including Promotion Automation requires an explicit grant.

---

## 6. UAM Deep Dive (VERIFIED)

### Backend — `core/task_auth.py`

**Three auth helpers:**

| Helper | Who can bypass | Use case |
|---|---|---|
| `make_task_auth(task_key)` | `admin` OR `dev` role — and any staff with a grant | Standard staff pages |
| `make_admin_task_auth(task_key)` | `dev` role ONLY — admin must have an explicit grant | Admin console tools (DmCampaign, etc.) |
| `require_any_login` | N/A — just checks login, no grant needed | GET endpoints that any logged-in user can read |

**How `make_admin_task_auth` works (exact, lines 77–101):**
```python
def make_admin_task_auth(task_key: str):
    def require_admin_task_access(request: Request) -> dict:
        payload = verify_token(request.headers.get("Authorization"))
        ...
        if role == "dev" or has_task_grant(task_key, staff_key):
            return {"username": username, "role": role, "staff_key": staff_key}
        raise HTTPException(status_code=403, detail="You do not have access to this task")
    return require_admin_task_access
```

**403 response** when staff without grant hits a protected endpoint — not a redirect, not a 401.

**Grant storage:** `public.access_grants` table, columns `(task_key, granted_to_staff_key)`. Grants are managed via the UAM admin UI — no migration or seed script needed for standard grants.

### Frontend — `useGrantedTasks.js`

Fetches: `GET /api/access-grants/mine?staff={staff_key}`
Returns: `{ taskKeys: ["tools.DmCampaign", ...] }`
Resolves against `ALL_GRANTABLE = [...TASKS, ...TOOLS]` from `taskRegistry.js`
Filters out tasks the staff member owns themselves (prevents double-render bug, fixed 2026-10-10)

### UAM Admin UI

The admin UAM page reads the full `TASKS` + `TOOLS` arrays from `taskRegistry.js` to build the grant matrix — it does not have its own hardcoded list. **This means adding `tools.PromotionAutomation` to `TOOLS` in `taskRegistry.js` is all that's needed for it to appear in the UAM admin matrix.** No separate registration step.

---

## 7. Permission Key Convention (VERIFIED)

From reading `main.py`, `task_auth.py`, `taskRegistry.js`, and `AdminLayout.jsx`:

| Pattern | Examples | When used |
|---|---|---|
| `tools.PascalCase` | `tools.DmCampaign`, `tools.AdminBudgetAlerts`, `tools.SkuAudit`, `tools.RepeatCustomers`, `tools.ListingIssues` | Admin console tools — things in `ADMIN_ITEMS` |
| `staffkey.ComponentName` | `jefri.ProductStatusLabels`, `sonya.CampaignPerformance` | Staff requirement pages |
| `automation_task.slug` | `automation_task.jefri_nonmoving`, `automation_task.dilaksi_faq` | Automation task pages |
| `ai_chat.staffkey` | `ai_chat.jefri`, `ai_chat.sajeepan` | AI chat modules |
| `staff_pages.slug` | `staff_pages.thasitha_manual_campaigns` | Legacy staff page modules |

**VERIFIED RECOMMENDATION:** Permission key for Promotion Automation = `tools.PromotionAutomation`
This is consistent with all other admin console tools in `ADMIN_ITEMS`.

---

## 8. Proposed Implementation File List (VERIFIED PATTERN — not yet created)

| File | Purpose | Pattern based on |
|---|---|---|
| `backend/app/dashboard_pages/promotion_automation.py` | FastAPI router — all promotion endpoints | `dm_campaign.py` |
| `backend/app/dashboard_pages/promotion_automation_db.py` | Schema creation (`ensure_promotion_automation_schema()`) | `jefri_nonmoving_db.py` |
| `frontend/src/admin/pages/PromotionAutomation.jsx` | React page component | `DmCampaign.jsx` / `BudgetAlerts.jsx` |

**Changes required in existing files:**
| Existing File | Change | Line range |
|---|---|---|
| `backend/app/main.py` | Add import + `app.include_router()` + startup call | Lines 120–160 import block; lines 345–360 router block; `_ensure_schemas()` + `_start_snapshots()` |
| `frontend/src/taskRegistry.js` | Add entry to `TOOLS` array | After line 154 (after `tools.AdminBudgetAlerts`) |
| `frontend/src/admin/AdminLayout.jsx` | Add lazy import + `ADMIN_ITEMS` entry + panel `<div>` | Lines 40–50 (lazy imports), ~line 265 (after budget-alerts item), ~line 600+ (panel renders) |

---

## 9. UAM Registration Steps — Exact Sequence

When implementation is authorized, the steps are:

1. **Create** `backend/app/dashboard_pages/promotion_automation.py` with:
   ```python
   router = APIRouter(
       prefix="/api/admin/promotion-automation",
       tags=["admin-promotion-automation"],
       dependencies=[Depends(make_admin_task_auth("tools.PromotionAutomation"))],
   )
   ```
2. **Add** to `main.py` import block: `from .dashboard_pages.promotion_automation import router as promotion_automation_router`
3. **Add** to `main.py` router block: `app.include_router(promotion_automation_router)`
4. **Create** `frontend/src/admin/pages/PromotionAutomation.jsx`
5. **Add** to `frontend/src/taskRegistry.js` TOOLS array: `{ taskKey: 'tools.PromotionAutomation', label: 'Promotion Automation', kind: 'tool', load: () => import('./admin/pages/PromotionAutomation') }`
6. **Add** to `frontend/src/admin/AdminLayout.jsx`:
   - Lazy import at top
   - Item object in `ADMIN_ITEMS` with `toolKey: 'tools.PromotionAutomation'`
   - Panel `<div>` in the render JSX
7. **Grant via UAM UI:** Admin visits UAM → Piranav and Muguntha rows → tick `tools.PromotionAutomation` → saved to `access_grants` table. No migration needed.

---

## 10. Permission Granularity Recommendation

**RECOMMENDATION: Single `tools.PromotionAutomation` key — role-based differentiation within the page.**

Justification from existing patterns:
- `tools.AdminBudgetAlerts` covers both READ (view alerts) and WRITE (approve/reject/dismiss) for all users with the grant. The backend uses `verify_admin_token` to distinguish admin vs non-admin at the endpoint level.
- `tools.DmCampaign` covers all read endpoints under one key.
- No existing admin tool splits view vs approve vs execute into separate permission keys.
- The existing UAM has "a single grant per (task, staff member)" — this is an architectural constraint documented in `task_auth.py` line 13-14.

**Proposed access matrix (using verified role names):**

| Role | Access | Mechanism |
|---|---|---|
| `dev` | Full access, bypasses all | `make_admin_task_auth` bypass |
| `admin` (Piranav, Muguntha) with grant | Full access — view + approve + execute + terminate | grant row in `access_grants` |
| `admin` without grant | 403 on all endpoints | `make_admin_task_auth` enforces |
| `staff` with grant | View only recommended (use role check inside endpoints) | grant row + endpoint-level role check |
| `staff` without grant | 403 | `make_admin_task_auth` enforces |

For the 8 proposed capabilities (view, create brief, submit, approve, execute, terminate, audit, manage policy): **all under one `tools.PromotionAutomation` key, with role/staff_key checks inside specific sensitive endpoints** (approve, execute, terminate) to restrict those to admin/dev only. This matches `muguntha_budget_alerts.py` pattern exactly.

---

## 11. Carried-Forward Blockers (Unchanged)

| # | Blocker | Owner |
|---|---|---|
| D1 | `Nishani_Promotion_Multi_Channel.docx` not found — all score logic, intents, guardrails, kill conditions unknown | Piranav |
| D2 | Landed cost / variable fee data source not identified | Piranav |
| D3 | Reviews / return rate source not identified | Piranav |
| D4 | Conflicting discount ranges need approved business decision | Piranav |

---

## 12. Evidence Paths

| Evidence | Path |
|---|---|
| Backend auth helpers | `backend/app/core/task_auth.py` (full file) |
| Router pattern | `backend/app/dashboard_pages/dm_campaign.py` lines 47–50 |
| Approval pattern | `backend/app/admin/muguntha_budget_alerts.py` lines 46–65 |
| main.py registrations | `backend/app/main.py` lines 120–160, 267–360 |
| TOOLS array | `frontend/src/taskRegistry.js` lines 117–197 |
| ADMIN_ITEMS array | `frontend/src/admin/AdminLayout.jsx` lines 55–457 |
| filterAdminItems | `frontend/src/admin/AdminLayout.jsx` lines 499–527 |
| useGrantedTasks | `frontend/src/hooks/useGrantedTasks.js` (full file) |
| shared.py | `backend/app/dashboard_pages/shared.py` (full file) |

---

## Confirmation

No application files were created or modified. No schema changed. No production data touched. No commits made. No deployments triggered. Git state is identical to end of Phase 1B.
