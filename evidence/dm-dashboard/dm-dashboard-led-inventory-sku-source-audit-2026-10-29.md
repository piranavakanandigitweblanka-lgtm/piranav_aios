# DM Dashboard — LED Inventory: SKU Source Verification & Data Refresh Audit

**Req ID:** DMDASH-LEDINV-SKUAUDIT-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code
**Scope:** Read-only investigation of SKU `PHSHF1PBRYB+LSMS320RE+ICST64E27` — DE market source verification, data refresh behaviour, stock discrepancy analysis.
**Branch:** `piranv-work` — clean, up to date with `origin/piranv-work`

---

## 1. Exact SKU Source Verification

**Result: FOUND**

The SKU `PHSHF1PBRYB+LSMS320RE+ICST64E27` exists in both authoritative source tables:

### listings.shopify_listings

| Field | Value |
|---|---|
| item_id | `57200618930441` |
| sku | `PHSHF1PBRYB+LSMS320RE+ICST64E27` |
| sub_source | `108` (ledsone.de — correct) |
| is_child | `1` |
| price | `22.78` |
| currency (DB column) | `NULL` — expected; currency served from market_config |
| compare_price | `NULL` |
| quantity | `452` |
| status | `draft` |
| listing_url | `https://ledsone.de/products/deckenleuchte-vintage-industrial-pendelleuchte-hangelampe-metall-rot-deckenlampe?variant=57200618930441` |
| selected_variations | `[{"Name":"color","Value":"Rot"},{"Name":"Brauchen Sie eine Glühbirne?","Value":"Ja"}]` |
| created_at | `2026-07-16T08:39:09Z` |
| updated_at | `2026-07-21T00:30:53Z` |

No duplicate records. Single row only.

### inventory.products

| Field | Value |
|---|---|
| id | `32359` |
| sku | `PHSHF1PBRYB+LSMS320RE+ICST64E27` |
| sku_original | `PHSHF1PBRYB+LSMS320RE+ICST64E27` |
| updated_at | `2025-12-01T17:15:29Z` |

`sku` and `sku_original` are identical for this product (no ENC encoding). This product would not be returned by the ENC branch of the DE query.

---

## 2. How the Search Match Works

Search term entered by user: `LSMS320RE`

The DE query Branch 1 runs:
```sql
WHERE sl.sub_source = 108
  AND sl.sku LIKE '%LSMS320RE%'
  AND sl.is_child = 1
```

`PHSHF1PBRYB+LSMS320RE+ICST64E27` contains `LSMS320RE`, so it matches. The SKU is classified `sku_type = 'Combo'` because Branch 1 of the DE query returns all non-ENC matches as Combo (original DE SQL, unchanged from sku_de_listings.py).

**This is correct behaviour** — the user searched for a component SKU and received the parent Combo listing that contains it.

---

## 3. Market and Warehouse Mapping — Verified

| Config value | Expected | Actual (market_config.py) | DB |
|---|---|---|---|
| sub_source | 108 | 108 | 108 ✓ |
| warehouse_location | Germany | `'Germany'` | Row exists ✓ |
| currency | EUR | EUR (served from config) | NULL in DB ✓ |
| currency_symbol | € | € | N/A |

---

## 4. Displayed vs Database Comparison

| Field | DB value | Dashboard displays |
|---|---|---|
| sku | `PHSHF1PBRYB+LSMS320RE+ICST64E27` | Same |
| price | `22.78` | `22.78 €` (currency symbol from market_config) |
| stock (quantity column) | `452` | `452` |
| status | `draft` | `draft` |
| sku_type | Branch 1 returns 'Combo' | `Combo` |
| store | `ledsone-de` (hardcoded in SQL) | `ledsone.de` (from market_config.store_label) |

No display discrepancy identified.

---

## 5. Stock Discrepancy: quantity=452 vs Germany stock=27

**This is not a bug — these are two different measurements:**

| Source | Value | Meaning |
|---|---|---|
| `listings.shopify_listings.quantity` | 452 | Shopify platform inventory level — what the Shopify store shows as available to buy |
| `inventory.local_inventory_current_stock_location_wise` (Germany) | 27 | Physical warehouse stock in Germany |

All four warehouse rows for this SKU (inventory_id=32359):

| warehouse_location | stock |
|---|---|
| Canada | 0 |
| Germany | 27 |
| UK | 1546 |
| US | 0 |

The Stock Lookup tab (`led_inventory_stock.py`) queries the warehouse table filtered to `warehouse_location = 'Germany'` for DE market — it will return `27`, not `452`. The Listings tab shows `452` from `shopify_listings.quantity`. Both values are correct for their respective data sources.

**Recommendation:** Consider adding a footnote or tooltip in the Listings tab clarifying that the Stock column shows Shopify platform inventory, not warehouse physical stock.

---

## 6. Data Refresh Frequency

### A. Shopify Listings Sync (`listings.shopify_listings`)

- **No sync task found** in `backend/app/dev_tasks/` for listings — sync is performed by an **external system** (Linnworks or equivalent channel management platform), not by the dm-dashboard backend.
- **Latest DE listing updated_at across all 16,065 rows:** `2026-10-29T03:26:56Z` (today, ~03:27 UTC)
- **This specific listing last updated:** `2026-07-21T00:30:53Z` — 3+ months ago. The record has not changed since then, which is expected if the Shopify listing itself has not been updated.
- **Sync frequency:** Cannot be confirmed from code alone — no scheduler config found for listings. Evidence from `updated_at` distribution suggests at minimum daily sync (most recent rows updated today).

### B. Inventory Products Sync (`inventory.products`)

- **Latest updated_at across all 45,439 rows:** `2026-10-29T09:52:04Z` (today, ~09:52 UTC)
- **This specific SKU last updated:** `2025-12-01T17:15:29Z` — nearly 11 months ago. The product record has not changed, which is consistent with a stable/unchanged product.
- **Sync frequency:** Cannot confirm schedule from code, but daily at minimum based on `updated_at` evidence.

### C. Stock Table (`local_inventory_current_stock_location_wise`)

- No `updated_at` column on this table — freshness cannot be directly measured from the table.
- Stock is joined via `inventory_id` → `inventory.products.id`. Products table updated today.

### D. Order Sync (`ledsone_de_order_sync`)

- Runs every 3 hours via `ScheduledSnapshot` infrastructure.
- Scope is **orders only** — not listings or inventory stock.

### E. Application-level Caching

- **No cache layer exists** in `led_inventory_listings.py` or `led_inventory_stock.py`.
- No `lru_cache`, Redis, TTL, or in-memory cache found.
- Every search triggers a fresh database query.
- **Frontend also performs no caching** — each new search is a fresh API call.

### F. Summary Table

| Source | Latest sync (observed) | This SKU last updated | Cache | Schedule confirmed |
|---|---|---|---|---|
| listings.shopify_listings (DE) | 2026-10-29T03:26Z | 2026-07-21T00:30Z | None | Unknown (external) |
| inventory.products | 2026-10-29T09:52Z | 2025-12-01T17:15Z | None | Unknown (external) |
| local_inventory_current_stock_location_wise | No timestamp column | N/A | None | Unknown |
| ledsone_de_order_sync | Every 3h (scheduler.py) | N/A | None | Confirmed |

---

## 7. Findings Summary

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | SKU exists in DB with correct sub_source=108 | — | VERIFIED |
| 2 | Search match is correct — component SKU match in Combo listing | — | VERIFIED |
| 3 | Market config (sub_source, warehouse, currency) correct | — | VERIFIED |
| 4 | No duplicate listing records | — | VERIFIED |
| 5 | quantity=452 (Shopify) vs Germany stock=27 (warehouse) | INFO | Expected — different sources |
| 6 | currency=NULL in DB — correct, served from market_config | — | VERIFIED |
| 7 | No application-level cache — all queries are live | — | VERIFIED |
| 8 | Listings sync schedule not confirmed (external system) | LOW | OPEN |
| 9 | inventory.products has no updated_at for stock table rows | LOW | OPEN |
| 10 | This listing record unchanged since 2026-07-21 | INFO | Expected if Shopify listing unchanged |

---

## 8. Recommended Actions

1. **No fix required** for the SKU match or display — all values are correct.
2. **Consider UI note** in Listings tab: "Stock shown is Shopify platform inventory. For warehouse stock, use the Stock Lookup tab."
3. **Identify the external sync system** (Linnworks/channel manager) — document its schedule in `source-map/README.md` to close the "listings refresh frequency unknown" gap.
4. **Add `updated_at` to stock table** if stock freshness needs to be monitored — currently no timestamp is available on `local_inventory_current_stock_location_wise`.

---

## 9. Queries Executed

```sql
-- Exact match in listings
SELECT item_id, sku, price, quantity, status, sub_source, is_child, listing_url, updated_at
FROM listings.shopify_listings
WHERE sku = 'PHSHF1PBRYB+LSMS320RE+ICST64E27' AND sub_source = 108;

-- Full record including variations
SELECT item_id, sku, price, compare_price, currency, quantity, status,
       sub_source, is_child, listing_url, selected_variations, created_at, updated_at
FROM listings.shopify_listings
WHERE sku = 'PHSHF1PBRYB+LSMS320RE+ICST64E27' AND sub_source = 108;

-- inventory.products
SELECT id, sku, sku_original, updated_at
FROM inventory.products
WHERE sku = 'PHSHF1PBRYB+LSMS320RE+ICST64E27';

-- Stock by warehouse
SELECT ip.id, ip.sku, w.warehouse_location, w.stock, ip.updated_at
FROM inventory.products ip
LEFT JOIN inventory.local_inventory_current_stock_location_wise w ON w.inventory_id = ip.id
WHERE ip.sku = 'PHSHF1PBRYB+LSMS320RE+ICST64E27';

-- Latest sync timestamps
SELECT 'DE listings' AS source, MAX(updated_at), COUNT(*)
FROM listings.shopify_listings WHERE sub_source = 108
UNION ALL
SELECT 'inventory.products', MAX(updated_at), COUNT(*) FROM inventory.products
UNION ALL
SELECT 'UK listings', MAX(updated_at), COUNT(*) FROM listings.shopify_listings WHERE sub_source = 104;
```

---

## 10. Files Inspected

| File | Purpose |
|---|---|
| `backend/app/dashboard_pages/led_inventory_listings.py` | Listings endpoint — SQL logic traced |
| `backend/app/core/market_config.py` | DE sub_source=108, warehouse='Germany' confirmed |
| `backend/app/dev_tasks/ledsone_de_order_sync/scheduler.py` | Only orders sync — 3h interval |
| `backend/app/dev_tasks/` (all) | No listings or inventory sync task found |

**Git status at investigation time:** `piranv-work` — clean, nothing uncommitted.
