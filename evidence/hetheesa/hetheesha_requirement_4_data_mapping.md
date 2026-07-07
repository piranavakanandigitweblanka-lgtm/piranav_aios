---
Title: Data Mapping — Requirement 4 — High-Traffic Product Stock Alert
Purpose: Document exact field-to-column mapping for dashboard build
Requirement Source: Hetheesha Req 04 — ledsone.fr
Staff Member: Hetheesha
Supporting AIOS Staff: Piranav
Date: 2026-07-06
---

## Dashboard Column → Data Source Mapping

| Dashboard Column | Source | Table/Field | Notes |
|---|---|---|---|
| Product URL | PostgreSQL GSC | `google_search_console.gsc_web_page.page` | Stripped of query strings via REGEXP_REPLACE |
| Product Name | Derived | Handle extracted from URL → title-cased | Best approximation without Shopify re-auth |
| GSC Clicks (30d) | PostgreSQL GSC | `SUM(clicks)` grouped by clean URL | Last 30 days filter: `date >= CURRENT_DATE - 30` |
| Inventory Status | PostgreSQL via join | inv_final_stock + listing_data (UK bridge) | Review Required for 86/90 pending Shopify re-auth |
| Stock Qty | PostgreSQL | `SUM(inv_final_stock.stock)` WHERE warehouse_location='UK' | NULL shown as "–" |
| Suggested Alternative | Not applicable | N/A | Requires Shopify inventory for meaningful alternatives |
| Suggested Alternative URL | Not applicable | N/A | Requires Shopify inventory for meaningful alternatives |
| Action Needed | Logic rule applied | Derived from Inventory Status + Clicks | See action logic table below |

---

## Action Needed Logic

| Inventory Status | GSC Clicks | Action |
|---|---|---|
| Out of Stock | Any | Redirect / Update Internal Links |
| Low Stock | Any | Monitor Closely |
| In Stock | Any | None |
| Review Required | Any | Review Required |

---

## URL Normalization

- Strip query string: `REGEXP_REPLACE(page, '\?.*$', '')`
- Filter product pages: `page LIKE '%ledsone.fr/products/%'`
- Extract handle: `REGEXP_REPLACE(clean_url, '.*\/products\/', '')`
- Match to listing_data.shopify_handle (ledsone UK sub_source_name)

---

## Inventory Join Path

```
google_search_console.gsc_web_page (page → handle)
    ↓ LEFT JOIN on handle
public.listing_data (shopify_handle → sku) [UK, ledsone, shopify channel]
    ↓ INNER JOIN on sku
public.inv_final_stock (sku → stock) [UK warehouse only]
    ↓ SUM(stock) per handle
```

**Match rate:** 4/90 products (4%)
**Root cause of low match:** ledsone.fr uses French-language handles; ledsone UK listing_data uses English handles. The jedsz8-km France listing_data has `shopify_handle = NULL`.

---

## GSC Site URL

- Confirmed site: `https://ledsone.fr/`
- Rows: 25,198
- Date range in table: 2026-03-20 to 2026-07-03
- Filter applied: last 30 days from 2026-07-06

---

## Inventory Source Note

- `analytics.slow_stock_snapshot` (2026-06-15) — has sku, title, current_stock but no handle/URL — not joinable
- `public.inv_final_stock` — has sku + stock per warehouse — joinable via UK listing_data
- Shopify Admin API — needed for complete ledsone.fr inventory (requires re-authorization)

---

## Status: PASS ✅ (partial — 4/90 products have confirmed stock)

**Reviewer:** Hetheesha / Piranav

---

## V2 Update — Variant-Level Schema (2026-07-07)

### V2 Dashboard Column → Data Source Mapping

| Dashboard Column | Index | Source | Table/Field | Notes |
|---|---|---|---|---|
| Product URL | 0 | PostgreSQL GSC | `gsc_web_page.page` | Stripped of query strings |
| Product Name | 1 | Derived | Handle → title-cased | From URL handle |
| Variant SKU | 2 | PostgreSQL | `listing_data.sku` (jedsz8-km) | NULL for Review Required rows |
| Variant Name | 3 | PostgreSQL | `listing_data.title` (jedsz8-km) | NULL for Review Required rows |
| GSC Clicks (30d) | 4 | PostgreSQL GSC | `SUM(clicks)` per clean URL | Last 30 days |
| Impressions (30d) | 5 | PostgreSQL GSC | `SUM(impressions)` per clean URL | Last 30 days |
| Inventory Status | 6 | Derived | qty≥30→In Stock, 1-29→Low Stock, 0→Out of Stock | NULL→Review Required |
| Stock Qty | 7 | PostgreSQL | `listing_data.quantity` (jedsz8-km) | NULL for Review Required rows |
| Alt SKU | 8 | PostgreSQL | `listing_data.sku` (jedsz8-km, different product) | NULL unless Out of Stock with alt found |
| Alt Product | 9 | PostgreSQL | `listing_data.title` (jedsz8-km) | Alt product name |
| Alt URL | 10 | Derived | `ledsone.fr/products/` + handle | Alt product URL |
| Action | 11 | Logic rule | Derived from Inventory Status | See action table below |

### V2 Stock Threshold Rules (Changed from V1)

| Qty | Status | V1 Threshold | V2 Threshold |
|---|---|---|---|
| ≥30 | In Stock | >10 | ≥30 |
| 1–29 | Low Stock | 1–10 | 1–29 |
| 0 | Out of Stock | 0 | 0 |
| NULL | Review Required | NULL | NULL |

### V2 Alternative Product Logic (SKU Family)

1. Extract SKU family prefix from confirmed SKU (e.g., `LHPOE27` from `LHPOE27CH`)
2. Check if other variants of same family are on **different product pages** with qty≥30
3. If no same-family alternative: query jedsz8-km for same `product_type` with qty≥30, different product URL
4. If no alternative found: altSku/altProduct/altUrl = null/'—'/'—'

### V2 Inventory Join Path

```
google_search_console.gsc_web_page (page → handle)
    ↓ LEFT JOIN on handle
public.listing_data (shopify_handle → sku) [UK, ledsone sub_source]
    ↓ INNER JOIN on sku
public.listing_data (sku → quantity, title) [jedsz8-km sub_source]
    ↓ one row per variant
```

**Match rate:** 4/109 products (15 variants)
**Root cause of low match:** shopify_handle=NULL for all jedsz8-km rows; bridge uses 296-SKU overlap via UK listing_data

### V2 Status: PASS ✅

**Reviewer:** Hetheesha / Piranav
