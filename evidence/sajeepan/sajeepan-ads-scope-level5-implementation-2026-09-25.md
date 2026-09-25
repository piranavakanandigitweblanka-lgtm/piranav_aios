# Level 5 — Ads Product Scope Implementation Evidence [2026-09-25]

## Summary

Level 5 implementation of the Ads Product Scope admin page is complete.
Two new files created, two existing files modified. Frontend build passes. Backend syntax clean.
No existing code modified beyond the approved file list. No DB changes.

---

## Files Created

| File | Description |
|---|---|
| `dm-dashboard/backend/app/admin_ads_product_scope.py` | Backend router, SQL, snapshot |
| `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx` | Frontend page component |

## Files Modified

| File | Change |
|---|---|
| `dm-dashboard/backend/app/main.py` | +2 import lines, +1 `app.include_router()`, +1 `start_ads_scope_snapshots()` in startup |
| `dm-dashboard/frontend/src/admin/AdminLayout.jsx` | +1 import, +12 lines nav item in ADMIN_ITEMS, +3 lines panel render |

## Files NOT Modified (confirmed)

- `dm-dashboard/backend/app/sajeepan.py` — unchanged
- `dm-dashboard/backend/app/auth.py` — unchanged
- `dm-dashboard/backend/app/db.py` — unchanged
- No other staff files touched

---

## Backend Implementation

### Router
```
APIRouter(prefix="/api/admin/ads-product-scope", tags=["admin-ads-product-scope"])
```

### Endpoints
- `GET /api/admin/ads-product-scope/sajeepan?days=30` — main data endpoint
- `POST /api/admin/ads-product-scope/sajeepan/sync/run-now` — manual refresh trigger

### Campaign IDs
Imported directly from `sajeepan.py.SJ_CAMPAIGN_IDS` — not duplicated.

### Product ID Normalization (Jefri pattern, exact SQL)
```sql
CASE
    WHEN product_item_id ILIKE 'shopify\_%'
    THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
    ELSE product_item_id
END AS shopify_id
```

### Group Classification (CASE expression in SQL — backend-authoritative)
```
UNRESOLVED            → format not shopify-prefixed AND not numeric AND no listing match
UNMATCHED             → format recognised but no shopify_listings match
SALE_SIGNAL_CONFLICT  → compare_price=0 AND merchant sale_price>0
ON_SALE               → compare_price > 0
GROUP_A               → non-sale + active + merchant IN_STOCK or qty>0
GROUP_B               → non-sale + active + merchant OOS or qty=0/NULL
NON_SALE_INACTIVE     → non-sale + inactive status
```

### Stock Logic (mirrors sajeepan.py lines 623–627)
- Merchant availability primary
- Shopify quantity fallback when no merchant record
- NULL qty + merchant IN_STOCK → IN_STOCK (165 products confirmed)

### Snapshot
```python
ScheduledSnapshot(
    scope="admin-ads-product-scope-sajeepan",
    staff="admin",
    tab="ads-product-scope",
    table_name="public.admin_ads_product_scope_snapshot",
    compute_fn=lambda: _compute_scope("sajeepan", 30),
    interval_hours=1,
)
```
Follows exact same pattern as `admin_dm_campaign.py` product snapshot.
App DB pool: unchanged. Business DB pool: unchanged (max 4).

### Auth
No endpoint-level auth added — follows existing admin page convention (admin_dm_campaign.py, admin_sku_audit.py have no token checks; AdminLayout frontend handles access). Auth pattern consistent with existing admin pages.

---

## Frontend Implementation

### Nav item
Added to `ADMIN_ITEMS` under `section-sales-performance`, after `dm-campaign`:
```
key: 'ads-product-scope'
label: 'Ads Product Scope'
sub: 'Sajeepan — non-sale product classification'
```

### Page layout
- Summary cards (7): Total Products, Matched, Non-Sale, Group A (hero), Group B, On Sale, Signal Conflict
- Sync status line (snapshot timestamp + staff + window)
- Filter bar: search (SKU/title/product ID), Group dropdown, Window dropdown, Export CSV, Refresh
- Table: SKU, Title, Price, Compare Price, Qty, Merch Availability, Group (pill), Spend, Clicks, Convs, CV
- Footer: footnote explaining scope and classifications

### CSV Export
Exports **currently filtered view** (not all products). Filename includes group suffix when filtered.
Uses existing Blob + anchor pattern from DmCampaign.jsx.

### CSS classes used
All existing `jreq-*` classes. No new CSS introduced.

---

## Build Results

| Check | Result | Notes |
|---|---|---|
| Backend Python syntax (ast.parse) | PASS | Both new + modified files clean |
| Frontend Vite build | PASS | `✓ built in 2.15s` |
| Build warnings | Pre-existing only | INEFFECTIVE_DYNAMIC_IMPORT warnings existed before this PR |
| sajeepan.py unchanged | PASS | `git diff backend/app/sajeepan.py` empty |

---

## Live Data Validation

Live data count validation requires the running server with real DB credentials.
Historical investigation counts (from Phases 1–4A) for reference:

| Metric | Expected (30d window, 2026-09-25) |
|---|---|
| Total Ads products | ~2,126 |
| Matched | ~2,125 |
| Unresolved | ~1 |
| Group A | ~693 |
| Group B | ~25 |
| On Sale | ~1,407 |
| SALE_SIGNAL_CONFLICT | ~4 |

Note: These are 30-day rolling window counts. Daily data churn means live counts may differ slightly from historical investigation. If counts differ materially, report the reason — do not force counts to match.

---

## Deployment Requirement

Before production use, the server must be restarted so the new snapshot table is created and the first snapshot is primed. The `ScheduledSnapshot.__init__` creates the table in the app DB on startup — no migration file needed.

---

## Known Issues / Follow-up

1. **Auth consistency**: Existing admin pages (DmCampaign, SkuAudit) do not check tokens at the endpoint level — they rely on frontend AdminLayout auth. This page follows the same pattern for consistency. If a future task adds endpoint-level auth to all admin pages, this page is ready (auth.py `verify_admin_token` already imported in auth.py and used by seo_intelligence.py).

2. **Group A NULL-qty clarification**: 165 products have `quantity IS NULL` but `merchant_products.availability = IN_STOCK`. These are classified as GROUP_A by the SQL logic (merchant IN_STOCK branch). Consistent with business rules confirmed in Level 4A.

3. **Multi-staff extension**: `STAFF_CONFIG` dict is ready for future Ads staff (Thasitha/DE, Thivajini/FR, Jefri). Adding a new staff requires: add row to STAFF_CONFIG, add endpoint + snapshot per staff (or extend with a `?staff=` param). See Level 4C design Section 13.
