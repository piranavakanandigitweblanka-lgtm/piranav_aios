# Report 5 — Marketplace Gap: DE In-Stock SKUs

**File:** `pages/report-5b-marketplace-gap.html`
**Hub label:** Report 5
**Last rebuilt:** 2026-07-28

---

## Purpose

Shows all 14,397 SKUs that currently have Germany warehouse stock > 0, and for each SKU shows whether it has an active listing on Amazon DE, eBay DE, and Shopify DE. Used to identify stocked products that are missing from one or more sales channels — a direct cause of lost Germany revenue.

---

## Key Numbers

| Metric | Value |
|---|---|
| Total DE In-Stock SKUs | 14,397 |
| Not Listed Anywhere | 5,667 |
| Missing Amazon DE | 12,643 |
| Missing eBay DE | 7,510 |
| Missing Shopify DE | 9,216 |
| Listed on All 3 Channels | 1,068 |

---

## Build Logic

### Step 1 — All DE in-stock SKUs

```sql
SELECT DISTINCT p.sku, SUM(licsl.stock) AS de_stock
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise licsl
  ON licsl.inventory_id = p.id
WHERE licsl.warehouse_location = 'Germany'
  AND licsl.stock > 0
GROUP BY p.sku
```

Produces 14,529 distinct SKUs with at least 1 unit in Germany warehouse.

### Step 2 — Amazon DE listing check

```sql
LEFT JOIN (
  SELECT DISTINCT sku, 1 AS listed
  FROM listings.amazon_listings
  WHERE site = 'Germany'
) amz ON amz.sku = p.sku
```

`site = 'Germany'` filters to Amazon DE marketplace listings only.

### Step 3 — eBay DE listing check

```sql
LEFT JOIN (
  SELECT DISTINCT sku, 1 AS listed
  FROM listings.ebay_listings
  WHERE site = 'Germany'
    AND all_list = 1
) ebay ON ebay.sku = p.sku
```

`all_list = 1` — mandatory filter on ebay_listings to exclude inactive/draft listings.

### Step 4 — Shopify DE listing check

```sql
LEFT JOIN (
  SELECT DISTINCT sku, 1 AS listed
  FROM listings.shopify_listings
  WHERE site = 'Germany'
    AND all_list = 1
) shop ON shop.sku = p.sku
```

`all_list = 1` — mandatory filter on shopify_listings. `site = 'Germany'` = ledsone-de store.

### Step 5 — Combine

Each SKU row gets three flags (1 = listed, 0 = not listed):
- `a` — Amazon DE listed
- `e` — eBay DE listed
- `sh` — Shopify DE listed

---

## Filter Pills

| Pill | Logic |
|---|---|
| All | Show all 14,397 SKUs |
| Not Listed Anywhere | `a=0 AND e=0 AND sh=0` |
| Missing Amazon | `a=0` |
| Missing eBay | `e=0` |
| Missing Shopify | `sh=0` |
| Listed All 3 | `a=1 AND e=1 AND sh=1` |

---

## Data Structure (JS)

Embedded as `var DATA=[...]` in the HTML. Each entry uses short keys to keep file size down (no images embedded):

```json
{"s":"EXAMPLE-SKU","st":500,"a":1,"e":0,"sh":0}
```

| Key | Field | Type |
|---|---|---|
| `s` | SKU | string |
| `st` | DE stock quantity | integer |
| `a` | Amazon DE listed | 0 or 1 |
| `e` | eBay DE listed | 0 or 1 |
| `sh` | Shopify DE listed | 0 or 1 |

File size: ~792KB (images stripped — SKU prefix shown as fallback thumbnail).

---

## Features

- Filter pills for channel gaps
- SKU search box
- Pagination: 100 rows per page
- CSV export (all filtered rows)
- Back button → Hub index

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `inventory` | `products` | SKU list |
| `inventory` | `local_inventory_current_stock_location_wise` | Germany stock > 0 filter |
| `listings` | `amazon_listings` | Amazon DE listing existence (site='Germany') |
| `listings` | `ebay_listings` | eBay DE listing existence (site='Germany', all_list=1) |
| `listings` | `shopify_listings` | Shopify DE listing existence (site='Germany', all_list=1) |

---

## Key Correctness Rules

1. `warehouse_location = 'Germany'` and `stock > 0` — only genuine DE in-stock SKUs
2. `site = 'Germany'` on all three listing tables — DE marketplace only
3. `all_list = 1` on ebay_listings and shopify_listings — active listings only
4. LEFT JOIN (not INNER) — preserves SKUs with no listing on a given channel
5. `DISTINCT sku` in each channel subquery — one row per SKU regardless of variant count
6. Each channel is joined twice: once on exact SKU match, once on `sku || '-IDE'` — some listings are stored with `-IDE` suffix (e.g. `CRFF140GL-IDE` for inventory SKU `CRFF140GL`). Without this, 2,042 eBay and 2,041 Shopify listings would show as missing.

---

## Known Limitations

- Listing existence ≠ listing is live/active beyond the `all_list=1` filter
- Amazon listings has no `all_list` column — uses `site='Germany'` only
- Stock figure is point-in-time snapshot; no restock orders factored in
- SKU images not embedded — file would be ~1.8MB with images vs 792KB without
