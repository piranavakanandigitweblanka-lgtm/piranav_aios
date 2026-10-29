# DM Dashboard — SKU DE Listings Page: Phase 1 Discovery
**Req ID:** DMDASH-SKUDE-DISC-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code (discovery only — no implementation)
**Status:** COMPLETE — Phase 1 discovery done. No code written or changed.

---

## 1. Purpose

Trace the full implementation pattern of the existing SKU Stock Lookup page in dm-dashboard so that a new page (SKU DE Listings — user inputs SKU, gets ledsone.de listings from Postgres) can be built following the same pattern.

This document covers: frontend component, navigation registration, backend router, authentication/UAM enforcement, and DB connection.

---

## 2. Reference Implementation — SKU Stock Lookup

### 2a. File locations

| Layer | File | Purpose |
|---|---|---|
| Frontend component | `frontend/src/admin/pages/SkuStockLookup.jsx` | Page UI — two tabs: Single SKU Search + CSV Bulk Upload |
| Navigation (admin) | `frontend/src/admin/AdminLayout.jsx` line 198 | Sidebar registration via toolKey |
| Task registry | `frontend/src/taskRegistry.jsx` | Single source of truth: toolKey → Component (lazy) |
| Backend router | `backend/app/dashboard_pages/sku_stock_lookup.py` | FastAPI router, two endpoints |
| Auth factory | `backend/app/core/task_auth.py` | UAM gate via `make_task_auth()` |
| App entry | `backend/app/main.py` lines 144 + 357 | Router imported and registered |

---

### 2b. Frontend — Component structure

`SkuStockLookup.jsx` exports one default function. No React Router. Navigation is tab/panel-based.

- Two sub-components: `SingleSkuTab` (GET) and `CsvBulkTab` (POST file upload)
- API base: `const BASE = \`${API_URL}/api/sku-stock-lookup\``
- Calls use `apiFetch()` from `../../lib/apiFetch` — this handles 401/403 globally (dispatches `dm:session-expired` event)
- No auth check inside the component — auth is server-enforced only
- Returns read-only data. Never writes to DB.

---

### 2c. Navigation registration

**AdminLayout.jsx** — `RAW_ADMIN_ITEMS` array (line 198):
```js
{ key: 'sku-stock-lookup', toolKey: 'tools.SkuStockLookup', enabled: true },
```

**Pattern:** every admin tool needs one entry here with a unique `key` and matching `toolKey`.

**taskRegistry.jsx** — this is where `toolKey: 'tools.SkuStockLookup'` maps to the actual React component (lazy-loaded). Every new tool needs an entry added to `TOOLS` in taskRegistry.

**Rendering path:** `AdminLayout → flattenAdminToolKeys() → GrantedTaskPanel` renders each tool's panel when its key is active.

---

### 2d. Backend — Router

**File:** `backend/app/dashboard_pages/sku_stock_lookup.py`

```python
router = APIRouter(prefix="/api/sku-stock-lookup", tags=["sku-stock-lookup"])

require_task_access = make_task_auth("tools.SkuStockLookup")
_REQUIRE_ACCESS = Depends(require_task_access)

@router.post("/upload", dependencies=[_REQUIRE_ACCESS])
@router.get("/single", dependencies=[_REQUIRE_ACCESS])
```

Both endpoints gated by `_REQUIRE_ACCESS`. No endpoint is unprotected.

**Router registration in main.py:**
```python
from .dashboard_pages.sku_stock_lookup import router as sku_stock_lookup_router
# ...
app.include_router(sku_stock_lookup_router)
```

---

### 2e. UAM Authorization — `make_task_auth`

**File:** `backend/app/core/task_auth.py`

```python
def make_task_auth(task_key: str):
    def require_task_access(request: Request) -> dict:
        payload = verify_token(request.headers.get("Authorization"))
        role = payload.get("role") or ""
        staff_key = payload.get("staff_key") or ""
        if role in {"admin", "dev"} or has_task_grant(task_key, staff_key):
            return {...}
        raise HTTPException(status_code=403, ...)
    return require_task_access
```

**Authorization logic:**
| User type | Access |
|---|---|
| role = `admin` | Auto-allowed (no UAM grant needed) |
| role = `dev` | Auto-allowed always |
| Any other staff | Must have a row in `access_grants` WHERE `task_key = 'tools.X'` AND `granted_to_staff_key = staff_key` |

**Two variants:**
- `make_task_auth` — admin auto-bypasses (used by SKU Stock Lookup)
- `make_admin_task_auth` — admin does NOT auto-bypass (used for admin-console tools moved into dashboard_pages in Oct 2026) 

For the new DE Listings page, use `make_task_auth` (same as SKU Stock Lookup) unless Piranav/Muguntha access must be UAM-controlled.

---

### 2f. DB connection

**Backend:** `from ..core.db import get_business_conn` — used for the ledsone Postgres DB (inventory, listings tables).

`get_conn()` (in `task_auth.py`) — used for the dashboard/users DB (access_grants table).

The new page will need `get_business_conn()` to query `listings.shopify_listings` and `inventory.products`.

---

## 3. New Page Blueprint — SKU DE Listings

Based on the SKU Stock Lookup pattern, a new SKU DE Listings page would follow this exact structure:

### Frontend
| Item | Value |
|---|---|
| Component file | `frontend/src/admin/pages/SkuDeListings.jsx` |
| API base | `/api/sku-de-listings` |
| UI pattern | Single SKU input → table output (Item ID, Variant Title, SKU, Price EUR, Stock, Status, SKU Type, Listing URL) |
| Auth | `apiFetch()` — no component-level check needed |

### Navigation (AdminLayout.jsx)
```js
{ key: 'sku-de-listings', toolKey: 'tools.SkuDeListings', enabled: true },
```
Add under `section-catalog` (between `sku-audit` and `section-sales-performance`) or a new `section-listing-mgmt` slot.

### taskRegistry.jsx
Add to `TOOLS` array:
```js
{ toolKey: 'tools.SkuDeListings', label: 'SKU DE Listings', navSub: 'Catalog', kind: 'tool',
  icon: ICONS.box, Component: lazy(() => import('./admin/pages/SkuDeListings')) }
```

### Backend router
| Item | Value |
|---|---|
| File | `backend/app/dashboard_pages/sku_de_listings.py` |
| Prefix | `/api/sku-de-listings` |
| UAM task key | `tools.SkuDeListings` |
| Auth factory | `make_task_auth("tools.SkuDeListings")` |
| Endpoint | `GET /search?sku={sku}` |
| DB | `get_business_conn()` |

### SQL (proven query pattern from AIOS reports)
```sql
SELECT 'ledsone-de' AS store, sl.item_id, sl.sku, sl.price, sl.quantity AS stock,
       sl.status, 'Combo' AS sku_type, sl.listing_url,
       COALESCE((SELECT string_agg(sv->>'Value', ' / ' ORDER BY sv->>'Name')
         FROM jsonb_array_elements(sl.selected_variations::jsonb) sv), 'Default Title') AS variant_title
FROM listings.shopify_listings sl
WHERE sl.sub_source = 108 AND sl.sku LIKE '%' || sku_param || '%' AND sl.is_child = 1
UNION ALL
SELECT 'ledsone-de', sl.item_id, sl.sku, sl.price, sl.quantity, sl.status, 'ENC', sl.listing_url, ...
FROM listings.shopify_listings sl
JOIN inventory.products ip ON ip.sku = sl.sku
WHERE sl.sub_source = 108 AND sl.is_child = 1 AND sl.sku LIKE 'ENC%'
  AND ip.sku_original LIKE '%' || sku_param || '%'
ORDER BY sku_type, status, sku;
```
Key constraints: `sub_source = 108` (DE), `is_child = 1` (smallint — NOT boolean), stock column = `quantity`.

### main.py registration
```python
from .dashboard_pages.sku_de_listings import router as sku_de_listings_router
app.include_router(sku_de_listings_router)
```

---

## 4. Key Constraints and Gotchas

| Issue | Correct value | Wrong value (causes error) |
|---|---|---|
| Germany sub_source | 108 | 233 (France) |
| Stock column | `quantity` | `stock`, `qty` |
| Child filter | `is_child = 1` | `is_child = true` |
| Schema-qualified | `listings.shopify_listings` | `shopify_listings` |
| ENC dedup | `sl.sku LIKE 'ENC%'` on ENC branch | without this, combo SKUs appear twice |

---

## 5. What Was NOT Done

- No frontend file created
- No backend file created
- No taskRegistry entry added
- No AdminLayout entry added
- No main.py import added
- No DB query run
- No git commit made
- No deployment

This is a discovery-only document. Implementation requires a separate approved task.

---

## 6. Source Files Read

- `frontend/src/admin/pages/SkuStockLookup.jsx` — full read
- `frontend/src/admin/AdminLayout.jsx` — full read (200 lines)
- `frontend/src/App.jsx` — full read
- `frontend/src/taskRegistry.jsx` — read (first 30 lines, pattern confirmed)
- `backend/app/dashboard_pages/sku_stock_lookup.py` — full read
- `backend/app/core/task_auth.py` — full read
- `backend/app/main.py` — first 60 lines + grep for sku_stock_lookup (lines 144, 357)
