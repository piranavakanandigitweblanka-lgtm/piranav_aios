# LEVEL 4C — ADS PRODUCT SCOPE DESIGN
## DM Dashboard — Sajeepan Non-Sale Product Scope Page
### Design-Only Document [2026-09-25]

> **STATUS: DESIGN ONLY — NO IMPLEMENTATION**
> No files have been modified. No routes have been created. No components have been built.
> This document is the approved design specification for Level 5 implementation.

---

## SECTION 1 — PURPOSE AND SCOPE

### 1.1 What This Page Does

The **Ads Product Scope** page is an admin-only view showing which products are in Sajeepan's Google Ads campaigns, classified by:
- Sale / Non-sale status (based on `compare_price`)
- Stock status (in-stock / OOS / NULL-qty)
- Data quality flags (SALE_SIGNAL_CONFLICT, UNRESOLVED)

It allows Piranav to verify the product population Sajeepan is advertising, identify non-sale products, and export the classified list for further action.

### 1.2 Why This Page Exists

The Ads Product Scope investigation (Phases 1–4A) confirmed:
- 2,126 distinct products appear in Sajeepan's 7 campaigns over the last 30 days
- 719 of them are non-sale (compare_price IS NULL or = 0)
- 693 are non-sale + active + in-stock (Group A — primary eligible set)
- 25 are non-sale + OOS (Group B — monitoring list)
- 4 have conflicting sale signals (SALE_SIGNAL_CONFLICT)
- 1 is unresolvable format

The existing Sajeepan dashboard does not surface this classification. A dedicated page makes the scope queryable, filterable, and exportable.

### 1.3 Staff Scope — Phase 1

**Sajeepan only** in the first build. The architecture is designed to support extension to Sonya, Thivajini, Thasitha, and Jefri in future phases (see Section 14).

### 1.4 Business Rules (Approved)

These rules were confirmed during Phases 1–4A. They are fixed for Level 5 implementation:

| Rule | Definition |
|---|---|
| NON-SALE | `compare_price IS NULL OR compare_price = 0` |
| ON-SALE | `compare_price > 0` |
| IN-STOCK | `merchant_products.availability = 'IN_STOCK'` (primary) OR `shopify_listings.quantity > 0` (fallback) |
| OOS | `merchant_products.availability IN ('out of stock','out_of_stock','preorder')` (primary) OR `(quantity IS NULL OR quantity = 0)` when no merchant record (fallback) |
| NULL-QTY + MERCH IN_STOCK | Classified as IN_STOCK — all 165 confirmed by merchant signal |
| SALE_SIGNAL_CONFLICT | `compare_price = 0 AND merchant sale_price > 0` — 4 products, shown with flag |
| UNRESOLVED | product_item_id not matching any known format — 1 product, excluded from counts |

---

## SECTION 2 — PRODUCT ID NORMALIZATION

### 2.1 Authoritative Pattern (Jefri)

All product_item_id resolution uses the Jefri normalization pattern, confirmed in `jefri.py` lines 71–75 (used in 4 locations):

```sql
CASE WHEN product_item_id LIKE 'shopify_%'
     THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
     ELSE product_item_id END AS shopify_id
```

**What this does:**
- `shopify_GB_<product_id>_<variant_id>` → extracts `<variant_id>` (last segment)
- `<bare_numeric_variant_id>` → used directly as-is
- Both forms resolve to `shopify_listings.item_id` for site='UK'

### 2.2 Format Distribution (Sajeepan 30d)

| Format | Count |
|---|---|
| `shopify_GB_*` prefixed | 1,422 |
| Pure numeric (bare variant ID) | 703 |
| Other (unresolvable) | 1 |
| **Total** | **2,126** |

Phase 2 missed the 703 numeric IDs — this caused the Phase 2 error (362 vs 719 non-sale). The Jefri pattern must be used in all Level 5 SQL.

---

## SECTION 3 — DATA SOURCES

### 3.1 Tables Used (READ-ONLY)

| Table | Schema | Role | Join key |
|---|---|---|---|
| `google_ads.product_performance` | Business DB | Source of Ads product IDs + spend | `product_item_id`, `campaign_id`, `date` |
| `google_ads.campaigns` | Business DB | Campaign metadata, group_name filter | `campaign_id` |
| `listings.shopify_listings` | Business DB | SKU, title, price, compare_price, quantity, status | `item_id` (= resolved shopify_id) + `site='UK'` |
| `google_ads.merchant_products` | Business DB | Merchant availability, sale_price | `product_id` (= resolved shopify_id) |

### 3.2 Sajeepan Campaign IDs (Hard-coded)

```python
SAJEEPAN_CAMPAIGN_IDS = [
    21069663519, 23110323532, 23516313256, 23590572906,
    22079334413, 21242723265, 24092456136
]
```

Source: confirmed in `sajeepan.py` (the existing staff module). These are the 7 campaigns in Sajeepan's scope.

### 3.3 DB Pool Constraints

- Business DB pool: max 4 connections — **DO NOT RAISE**
- This endpoint uses `get_business_conn()` (same as all other admin pages)
- If this page uses a background snapshot (recommended — see Section 11), it runs once per refresh cycle and does not hold a connection during page loads

---

## SECTION 4 — BACKEND ENDPOINT DESIGN

### 4.1 File Location

```
dm-dashboard/backend/app/admin_ads_product_scope.py
```

New file. Follows the `admin_dm_campaign.py` pattern.

### 4.2 Router Declaration

```python
from fastapi import APIRouter, Depends
from .auth import verify_admin_token
from .db import get_business_conn
from .scheduled_snapshot import ScheduledSnapshot

router = APIRouter(
    prefix="/api/admin/ads-product-scope",
    tags=["admin-ads-product-scope"]
)
```

### 4.3 Endpoints

#### GET `/api/admin/ads-product-scope/sajeepan`

Returns the full product scope for Sajeepan.

**Auth:** `verify_admin_token` — admin/dev only.

**Query parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `days` | int | 30 | Rolling window: 7, 30, 90 |
| `group` | str | `all` | Filter: `all`, `group_a`, `group_b`, `conflict`, `on_sale`, `unresolved` |
| `q` | str | `` | Search: SKU or title substring (case-insensitive) |

**Response shape:**
```json
{
  "summary": {
    "total_ads_products": 2126,
    "matched": 2125,
    "unmatched": 1,
    "non_sale_total": 719,
    "group_a": 693,
    "group_b": 25,
    "on_sale": 1407,
    "sale_signal_conflict": 4,
    "unresolved": 1,
    "window_days": 30,
    "as_of": "2026-09-25"
  },
  "products": [
    {
      "product_item_id": "shopify_GB_123_456",
      "shopify_id": "456",
      "sku": "ENC8046",
      "title": "White Pendant",
      "price": 12.99,
      "compare_price": null,
      "quantity": 42,
      "merch_availability": "IN_STOCK",
      "merch_sale_price": null,
      "status": "active",
      "group": "group_a",
      "spend_30d": 9.30,
      "clicks_30d": 12,
      "conversions_30d": 1.15,
      "cv_30d": 92.70
    }
  ]
}
```

#### GET `/api/admin/ads-product-scope/sajeepan/export`

Returns the same data as a CSV download. No additional parameters — exports whatever the current snapshot contains (all products, all groups).

**Auth:** `verify_admin_token`.

**Response:** `text/csv` with `Content-Disposition: attachment; filename=sajeepan-ads-scope-<date>.csv`

---

## SECTION 5 — CORE SQL QUERY DESIGN

### 5.1 Product Scope CTE

The core query uses the Jefri normalization pattern as a CTE to resolve product IDs before joining:

```sql
WITH ads_window AS (
    -- Aggregate Ads metrics per product_item_id over the rolling window
    SELECT
        product_item_id,
        CASE WHEN product_item_id LIKE 'shopify_%'
             THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
             ELSE product_item_id END AS shopify_id,
        SUM(cost)::numeric AS spend,
        SUM(clicks)::bigint AS clicks,
        SUM(conversions)::numeric AS conversions,
        SUM(conversion_value)::numeric AS cv
    FROM google_ads.product_performance
    WHERE campaign_id = ANY(%(campaign_ids)s)
      AND date >= CURRENT_DATE - INTERVAL '%(days)s days'
    GROUP BY product_item_id
),
scope AS (
    -- Join to shopify_listings to get pricing + stock
    SELECT
        a.product_item_id,
        a.shopify_id,
        sl.sku,
        sl.title,
        sl.price,
        sl.compare_price,
        sl.quantity,
        sl.status,
        mp.availability AS merch_availability,
        mp.sale_price AS merch_sale_price,
        a.spend,
        a.clicks,
        a.conversions,
        a.cv,
        CASE
            -- Unresolvable format
            WHEN sl.item_id IS NULL AND a.shopify_id !~ '^[0-9]+$'
                AND a.product_item_id NOT LIKE 'shopify_%' THEN 'unresolved'
            -- No listing match at all
            WHEN sl.item_id IS NULL THEN 'unmatched'
            -- On sale
            WHEN sl.compare_price > 0 THEN 'on_sale'
            -- Sale signal conflict
            WHEN (sl.compare_price = 0 OR sl.compare_price IS NULL)
                AND mp.sale_price > 0 THEN 'sale_signal_conflict'
            -- Group A: non-sale + in-stock (merchant primary)
            WHEN (sl.compare_price IS NULL OR sl.compare_price = 0)
                AND sl.status = 'active'
                AND (
                    mp.availability = 'IN_STOCK'
                    OR (mp.availability IS NULL AND sl.quantity > 0)
                ) THEN 'group_a'
            -- Group B: non-sale + OOS
            WHEN (sl.compare_price IS NULL OR sl.compare_price = 0)
                AND sl.status = 'active'
                AND (
                    mp.availability IN ('out of stock','out_of_stock','preorder')
                    OR (mp.availability IS NULL AND (sl.quantity IS NULL OR sl.quantity = 0))
                ) THEN 'group_b'
            ELSE 'other'
        END AS product_group
    FROM ads_window a
    LEFT JOIN listings.shopify_listings sl
        ON sl.item_id::text = a.shopify_id AND sl.site = 'UK'
    LEFT JOIN google_ads.merchant_products mp
        ON mp.product_id = a.shopify_id
)
SELECT * FROM scope
ORDER BY spend DESC;
```

### 5.2 Summary Aggregation

The summary counts are computed from the same CTE using COUNT(CASE WHEN group = 'group_a' THEN 1 END) pattern — no second query needed.

### 5.3 Performance Notes

- `product_performance` table: ~2.46M rows all-time, ~300K rows in 90d window. 30d window is faster.
- JOIN is on `item_id::text` vs `shopify_id` (text) — add index on `shopify_listings(item_id, site)` if not present (do not create during design phase).
- Background snapshot recommended (same pattern as `admin_dm_campaign.py`) to avoid live 10s query on page load.

---

## SECTION 6 — BACKGROUND SNAPSHOT

### 6.1 Pattern

Follows `ScheduledSnapshot` in `admin_dm_campaign.py`. The snapshot runs on server startup and refreshes every N minutes (suggested: 60 min, same as DM Campaign).

### 6.2 What Gets Snapshotted

The default 30d window full product list. The snapshot stores:
- Summary counts
- Full product list with all fields

On page load, the frontend reads from the snapshot (instant). Refresh button triggers a live re-query.

### 6.3 Startup Registration

In `main.py`:
```python
from .admin_ads_product_scope import router as admin_ads_scope_router
from .admin_ads_product_scope import start_snapshots as start_ads_scope_snapshots

app.include_router(admin_ads_scope_router)  # in include_router block

# In _start_background_sync():
start_ads_scope_snapshots()
```

Schema init is not required (this page uses only existing Business DB tables — no app DB tables needed).

---

## SECTION 7 — FRONTEND COMPONENT

### 7.1 File Location

```
dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx
```

New file. Follows DmCampaign.jsx as the closest pattern.

### 7.2 Nav Registration in AdminLayout.jsx

Add a new nav item to `ADMIN_ITEMS` in `AdminLayout.jsx`.

**Placement:** Under `section-sales-performance` (same section as `dm-campaign`). Insert after the existing `dm-campaign` entry.

**Nav item shape:**
```jsx
{
  key: 'ads-product-scope',
  label: 'Ads Product Scope',
  sub: 'Non-sale product classification for Sajeepan Ads campaigns',
  enabled: true,
  icon: (/* bar chart or filter icon — same SVG pattern as existing items */)
}
```

**Import in AdminLayout.jsx:**
```jsx
import AdsProductScope from './pages/AdsProductScope'
```

**Render in switch/case block** (wherever AdminLayout routes by key):
```jsx
case 'ads-product-scope': return <AdsProductScope />
```

### 7.3 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  SUMMARY CARDS (6 cards — same jreq-cards pattern)          │
│  [Total Products] [Matched] [Non-Sale] [Group A] [Group B]  │
│  [On Sale]                                                   │
├─────────────────────────────────────────────────────────────┤
│  FILTER BAR (jreq-tbar pattern)                              │
│  [Search SKU/Title…] [Group▾] [Days▾] [Export CSV] [N rows] │
├─────────────────────────────────────────────────────────────┤
│  TABLE (jreq-tablebox + jreq-scroll pattern)                 │
│  SKU | Title | Price | Compare | Qty | Merch Avail | Group  │
│  | Spend | Clicks | Convs | CV                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Component State

```jsx
const [data, setData] = useState(null)  // full API response
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [q, setQ] = useState('')          // search text
const [group, setGroup] = useState('all')
const [days, setDays] = useState(30)
```

### 7.5 API Call Pattern

Same as DmCampaign.jsx — `fetch('/api/admin/ads-product-scope/sajeepan?days=30')` with admin auth token in header. On mount + on filter change.

### 7.6 Client-Side Filtering

The API returns the full list. Client filters by `q` (SKU/title substring) and `group` dropdown. Same `useMemo` pattern as DmCampaign.jsx:

```jsx
const filtered = useMemo(() => {
  let out = data?.products ?? []
  if (group !== 'all') out = out.filter(r => r.group === group)
  if (q.trim()) {
    const qq = q.trim().toLowerCase()
    out = out.filter(r =>
      (r.sku ?? '').toLowerCase().includes(qq) ||
      (r.title ?? '').toLowerCase().includes(qq)
    )
  }
  return out
}, [data, q, group])
```

---

## SECTION 8 — CSV EXPORT

### 8.1 Export Location

Client-side export — same Blob+anchor pattern as DmCampaign.jsx.

```jsx
function exportCsv() {
  const hdr = ['product_item_id', 'shopify_id', 'sku', 'title', 'price',
               'compare_price', 'quantity', 'merch_availability', 'merch_sale_price',
               'status', 'group', 'spend_30d', 'clicks_30d', 'conversions_30d', 'cv_30d']
  const lines = [hdr.join(',')]
  data.products.forEach(r => {
    const vals = hdr.map(k => r[k] ?? '')
    lines.push(vals.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  })
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `sajeepan-ads-scope-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
}
```

### 8.2 Export Contents

Exports ALL products (not just the current filter view), same as DmCampaign.jsx behaviour. Export button disabled when `loading || !data?.products?.length`.

---

## SECTION 9 — GROUP CLASSIFICATION LOGIC

### 9.1 Group Values (for `product_group` field)

| Group Key | Meaning | Count (30d) |
|---|---|---|
| `group_a` | Non-sale + active + in-stock | 693 |
| `group_b` | Non-sale + active + OOS | 25 |
| `on_sale` | compare_price > 0 | 1,407 |
| `sale_signal_conflict` | compare_price=0 but merchant sale_price>0 | 4 |
| `unmatched` | No shopify_listings match | ~0 |
| `unresolved` | Unrecognised product_item_id format | 1 |

### 9.2 Group A Composition

| Sub-group | Count |
|---|---|
| Non-sale + active + quantity > 0 (merchant IN_STOCK or no merch) | 528 |
| Non-sale + active + quantity NULL + merchant IN_STOCK | 165 |
| **Group A Total** | **693** |

### 9.3 OOS Detection in SQL (mirrors sajeepan.py lines 623–627)

Merchant availability is the primary signal. Shopify quantity is the fallback:

```sql
CASE
    WHEN mp.availability = 'IN_STOCK' THEN 'in_stock'
    WHEN mp.availability IN ('out of stock','out_of_stock','preorder') THEN 'oos'
    WHEN mp.availability IS NULL AND sl.quantity > 0 THEN 'in_stock'
    WHEN mp.availability IS NULL AND (sl.quantity IS NULL OR sl.quantity = 0) THEN 'oos'
    ELSE 'unknown'
END AS stock_signal
```

---

## SECTION 10 — AUTH MODEL

### 10.1 Endpoint Auth

All `/api/admin/ads-product-scope/*` endpoints use `verify_admin_token` (admin/dev roles only).

From `auth.py`:
```python
_PRIVILEGED_ROLES = {"admin", "dev"}

def verify_admin_token(token: str = Depends(oauth2_scheme)):
    payload = _decode(token)
    if payload.get("role") not in _PRIVILEGED_ROLES:
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload
```

Sajeepan (staff role) does **not** have access to this page. This is an admin-only diagnostic view.

### 10.2 Frontend Guard

AdminLayout already wraps all admin pages — no additional auth guard needed in the component. The admin token is set via the existing AdminLayout auth flow.

---

## SECTION 11 — SNAPSHOT vs LIVE QUERY DECISION

**Decision: Use ScheduledSnapshot (same as DmCampaign/SkuAudit).**

**Rationale:**
- 30d window query over product_performance takes ~4s (measured in Phase 3 queries)
- Page loads must be instant for admin usability
- Data freshness of 60 min is acceptable for a classification view (not real-time monitoring)
- ScheduledSnapshot pattern is already established and stable in this codebase

**Refresh button:** a manual "Refresh" button triggers a live re-query outside the snapshot cycle, same as DmCampaign.jsx.

---

## SECTION 12 — ERROR HANDLING

### 12.1 Backend

- Business DB connection failure: return HTTP 503 with `{"detail": "Business DB unavailable"}`
- No data in window: return empty `products: []` with zeroed summary (do not 500)
- Pool exhaustion: same `get_business_conn()` retry behaviour as all other admin endpoints

### 12.2 Frontend

- `error` state: shown as `<div className="jreq-error">` (existing CSS class)
- Loading state: table shows `<td colSpan={N} className="jreq-loading">Loading…</td>`
- Empty state: `<td colSpan={N} className="jreq-empty">No products match.</td>`

All three patterns are already defined in the existing admin CSS and used by DmCampaign.jsx.

---

## SECTION 13 — MULTI-STAFF EXTENSION PATH

This section documents how the page extends to other Ads staff in future phases.

### 13.1 Candidate Staff

| Staff | Campaign source | Product ID format | Notes |
|---|---|---|---|
| Sajeepan | `product_performance` | shopify_GB_* + numeric | Phase 1 — this build |
| Jefri | `product_performance` | shopify_GB_* + numeric | Same pattern; Jefri normalization already exists |
| Thasitha | `product_performance` | shopify_DE_* | DE market; needs `site='DE'` filter |
| Thivajini | `product_performance` | shopify_FR_* | FR market; needs `site='FR'` filter |
| Sonya | separate feed | item_id direct | Different join path — needs investigation |

### 13.2 Extension Architecture

**Backend:** Add a `staff` query parameter to the endpoint (`/api/admin/ads-product-scope?staff=sajeepan`). Each staff maps to a campaign ID list + site filter + listing join rule.

```python
STAFF_CONFIG = {
    "sajeepan": {
        "campaign_ids": [21069663519, 23110323532, ...],
        "site": "UK",
        "market": "GB"
    },
    # "jefri": {...},
    # "thasitha": {"site": "DE", "market": "DE"},
}
```

**Frontend:** Add a staff selector dropdown at the top of the page. The API re-fetches when the staff selection changes.

**Phase 1 constraint:** `staff` param is not needed for Phase 1 — Sajeepan is the only staff. The config map should be written but only `sajeepan` is populated.

---

## SECTION 14 — CONSTRAINTS AND NON-GOALS

### 14.1 Hard Constraints

| Constraint | Source |
|---|---|
| Business DB pool stays at max 4 | DB config — never raise |
| No new tables created | Level 4C rule — READ-ONLY Business DB |
| No app DB tables | This page requires no persistence beyond snapshot |
| No existing code modified | Level 4C constraint |
| No Shopify API calls | All data already in Business DB |

### 14.2 Non-Goals for Level 5

- Real-time stock updates (snapshot at 60 min interval is sufficient)
- Product-level drill-down modal (not requested in scope)
- Historical trend of Group A size over time (future phase)
- Automated alerting when Group A falls below threshold (future phase)
- Integration with Sajeepan's feed optimization tracker (future phase)

---

## SECTION 15 — OPEN DECISIONS (Require Piranav/GPT Confirmation Before Level 5)

| # | Question | Options | Recommended |
|---|---|---|---|
| 1 | Group B (25 OOS) include/exclude in default view? | Include all groups / Exclude Group B by default | Include with Group B filter |
| 2 | Rolling window default: 7d, 30d, or 90d? | Any | 30d (consistent with existing investigation) |
| 3 | Nav section placement: under "Sales & Performance" or new "Ads" section? | Existing section / New section | Existing — fewer nav items to maintain |
| 4 | Snapshot refresh interval: 30 min, 60 min, or on-demand only? | Any | 60 min (consistent with DM Campaign) |
| 5 | Export scope: all products or filtered view only? | All / Filtered | All (consistent with DmCampaign.jsx) |

---

## SECTION 16 — FILE CHANGE SUMMARY (Level 5 Implementation Plan)

### 16.1 New Files (to be created in Level 5)

| File | Type | Purpose |
|---|---|---|
| `dm-dashboard/backend/app/admin_ads_product_scope.py` | Python | Backend router + SQL + snapshot |
| `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx` | JSX | Frontend page component |

### 16.2 Existing Files to Modify (Level 5 only)

| File | Change |
|---|---|
| `dm-dashboard/backend/app/main.py` | Add import + `app.include_router()` + `start_ads_scope_snapshots()` in startup |
| `dm-dashboard/frontend/src/admin/AdminLayout.jsx` | Add `AdsProductScope` import + nav item in `ADMIN_ITEMS` + case in render switch |

### 16.3 No Other Files Modified

- `sajeepan.py` — NOT modified (this is a separate admin diagnostic page, not a change to Sajeepan's staff view)
- `auth.py` — NOT modified (existing `verify_admin_token` is reused as-is)
- `db.py` — NOT modified (existing `get_business_conn` is reused as-is)
- No schema migrations
- No new DB tables

---

## SECTION 17 — DATA FACTS CONFIRMED (from Phases 1–4A)

This section records the confirmed facts the design is built on. Do not re-investigate these in Level 5.

| Fact | Value | Source |
|---|---|---|
| Sajeepan campaign IDs | 7 IDs (see Section 3.2) | sajeepan.py confirmed |
| Total distinct product_item_ids (30d) | 2,126 | Phase 3 live query |
| shopify_GB_* format count | 1,422 | Phase 3 |
| Numeric format count | 703 | Phase 3 |
| Other format count | 1 | Phase 3 |
| Match rate (Jefri pattern) | 2,125/2,126 (99.95%) | Phase 3 |
| Total non-sale (compare_price NULL or = 0) | 719 | Phase 3 |
| Group A (non-sale + active + in-stock) | 693 | Level 4A |
| Group B (non-sale + active + OOS) | 25 | Phase 3 / Level 4A |
| SALE_SIGNAL_CONFLICT | 4 | Level 4A |
| NULL-qty products (all merch IN_STOCK) | 165 | Level 4A |
| shopify_listings has no `availability` column | confirmed | Level 4A |
| merchant_products has `availability` + `sale_price` | confirmed | Level 4A |

---

## APPENDIX — CSS Classes Reference

These existing CSS classes from the DM Dashboard admin styles are used without modification:

| Class | Usage |
|---|---|
| `jreq-cards` | Summary card row container |
| `jreq-card` | Individual summary card |
| `jreq-card hero` | Highlighted summary card (for Group A count) |
| `jreq-card-label` | Card label text |
| `jreq-card-value` | Card metric value |
| `jreq-tbar` | Filter toolbar row |
| `jreq-refresh` | Button style (used for Export CSV) |
| `jreq-cnt` | Row count label |
| `jreq-tablebox` | Table outer wrapper |
| `jreq-scroll` | Horizontal scroll wrapper |
| `jreq-loading` | Loading row in table |
| `jreq-empty` | Empty state row in table |
| `jreq-error` | Error message div |
| `.num` | Right-aligned numeric table cell |
| `jreq-footnotes` | Footnote text below table |

---

*Design by: Claude Code + GPT Coordinator [2026-09-25]*
*Phase: DESIGN ONLY — Level 5 implementation not started*
*Evidence base: Phases 1–4A confirmed data (see evidence/sajeepan/)*
