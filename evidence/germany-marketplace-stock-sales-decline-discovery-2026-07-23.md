# Germany Marketplace Stock & Sales Decline — Discovery Evidence

**Evidence ID:** germany-marketplace-stock-sales-decline-discovery-2026-07-23  
**Date:** 2026-07-23  
**Owner:** Piranav / AIOS  
**Reviewers:** Warehouse-owner (business validator required before build)  
**Evidence Status:** DRAFT — awaiting business validation  
**Pass / Fail:** CONDITIONAL PASS — all four marketplaces verified, accounts documented, centralized stock confirmed without double-counting, product match measured, OOS history honestly unavailable, missing formulas not invented

---

## 1. Requirement & Business Purpose

**Written requirement:** German Sales Decline Analysis for warehouse-owner review.

**Business objective:** Identify German products losing sales because centralized warehouse stock is unavailable. Show impact by marketplace and account. Identify fast-moving products that should remain permanently stocked.

**Requested reports:**
1. Last-Year Best Sellers Now Out of Stock
2. High-Demand Products With No Stock (Google Ads view)
3. Channel-Wise Stock Impact
4. Slow Restocking and Lost Opportunity
5. Fast-Moving Products Requiring Permanent Stock

**Scope supplied by requester:**
- Germany only
- Compare Shopify, Amazon, eBay, and Wayfair
- Discover and compare every German account — do not assume one per marketplace

---

## 2. Document Requirements vs Requester Additions

| Requirement | Source | Discovery Impact |
|---|---|---|
| Germany only | Requester | `order_management.market_place` id=10, abbreviation=DE confirmed |
| All four marketplaces | Requester | Shopify, Amazon, eBay, Wayfair all found with DE orders |
| Multiple accounts per marketplace | Requester | 11+ DE-active sub-sources documented below |
| Centralized stock — no double-count | Requester | `local_inventory_current_stock_location_wise` `warehouse_location='Germany'` is one row per product per location, already summed. Confirmed safe |
| "Last year" = 2025 | Requester/discovery default | `orders` covers full 2025-01-01 to 2025-12-31 for market_place=10. Reporting period requires business-validator confirmation |

---

## 3. Sources Inspected

| Source | Type | Tool | Notes |
|---|---|---|---|
| `order_management.orders` | PostgreSQL | Live query | 198,018 rows for market_place=10 (Germany) |
| `order_management.order_item_info` | PostgreSQL | Live query | Line items with item_sku, item_quantity, item_price, real_sku |
| `order_management.sub_source` | PostgreSQL | Live query | 118 accounts total; 11+ active in DE |
| `order_management.market_place` | PostgreSQL | Live query | id=10, name=Germany, abbreviation=DE, amz_marketplace_id=A1PA6795UKMFR9 |
| `order_management.source` | PostgreSQL | Live query | source_id: 1=AMAZON, 2=EBAY, 3=SHOPIFY, 6=WAYFAIR |
| `inventory.local_inventory_current_stock_location_wise` | PostgreSQL | Live query | 43,780 products tracked for Germany, 14,502 in stock, 29,278 at zero |
| `inventory.physical_product_stock` | PostgreSQL | Live query | Physical warehouse-level stock; 3 Germany warehouse entries |
| `inventory.warehouse` | PostgreSQL / KB | KB + query | Trossingen schmutter str + Trossingen kronen str active; Duisburg excluded per rule |
| `inventory.products` | PostgreSQL / KB | KB | Product catalogue with sku, title, inventory_bool |
| `google_ads.accounts` | PostgreSQL | Live query | 8 accounts; 1 confirmed DE (ledsone.de, account_id=9031058245) |
| `google_ads.merchant_products` | PostgreSQL | Live query | 8,409 DE products; 3,954 OOS; only 25 with mpn (SKU) |
| `google_ads.product_performance` | PostgreSQL | KB | Columns confirmed: clicks, cost, conversions, conversion_value; join via campaign_id→campaign_id (not id). DE join returned 0 — needs verification |
| `google_ads.campaigns` | PostgreSQL | Live query | Has account_id column confirmed |
| `listings.ebay_listings` | PostgreSQL / KB | KB | Sub-source, site (ebay.de), all_list=1 filter required |
| `listings.amazon_listings` | PostgreSQL / KB | KB | Sub-source, site (amazon.de), all_list=1, asin, sku/mapped_sku |
| `listings.market_place_id_mapping` | PostgreSQL / KB | KB | Germany row confirmed: site_id=77, code=DE, amz_market_place=A1PA6795UKMFR9, is_ebay=2, is_amz=1 |
| `business/rules/stock-calculation-logic.md` | AIOS KB | KB | GetInvStock logic documented; Germany is a distinct location |
| `business/rules/platform-stock-update-rules.md` | AIOS KB | KB | Confirms Germany=DE push pipeline |
| `business/rules/warehouse-restrictions.md` | AIOS KB | KB | Netherlands1 and Duisburg excluded globally |
| Information schema (stock history tables) | PostgreSQL | Live query | Zero results for any stock-history, OOS-event, or stock-log tables |
| Local evidence folder | Local files | Glob | No prior Germany stock/sales decline reports found |
| AIOS knowledge base Germany search | AIOS KB | KB search | 18 files reference Germany — no existing Germany sales decline or OOS report |

---

## 4. German Marketplace Accounts

All accounts confirmed from live query of `order_management.sub_source` JOIN `order_management.orders` WHERE `market_place='10'`, filtered to 2025.

### 4a. Shopify DE

| Account ID (sub_source) | Account Name | Company | 2025 DE Orders | 2025 DE Revenue | Last Order | Status |
|---|---|---|---|---|---|---|
| 108 | ledsone-de | LEDSone DE | 6,419 | €180,753 | 2025-12-31 | **ACTIVE** |

One Shopify DE account. No other Shopify sub_source recorded German orders in 2025.

### 4b. Amazon DE

Orders with market_place=10 and source=AMAZON. Multiple Amazon accounts sell across EU marketplaces; market_place=10 isolates Germany-only orders.

| Account ID (sub_source) | Account Name | Company | 2025 DE Orders | 2025 DE Revenue | Last Order | Status |
|---|---|---|---|---|---|---|
| 8 | amazon Ledsone | LEDSone | 7,207 | €218,522 | 2025-12-31 | **ACTIVE** |
| 6 | amazon Dcvoltage | DC Voltage | 3,981 | €104,404 | 2025-12-31 | **ACTIVE** |
| 14 | amazon Ledsonede | LEDSone DE | 576 total orders | (inactive in 2025) | 2023-04-19 | DORMANT |
| 229 | amazon Homin gmbh | — | 5 (2026 only) | — | 2026-07-19 | NEW/LOW VOLUME |

Primary DE Amazon accounts in 2025: sub_source 8 and 6. Account 229 (Homin GmbH) appeared in the DE order set but with only 5 orders all in 2026 — exclude from 2025 reporting.

### 4c. eBay DE

eBay orders include multi-account selling on ebay.de (market_place=10 confirms the buyer is in Germany, regardless of which eBay seller account was used).

| Account ID (sub_source) | Account Name | Company | 2025 DE Orders | 2025 DE Revenue | Last Order | Status |
|---|---|---|---|---|---|---|
| 1 | led_sone | LEDSone | 8,562 | €179,393 | 2025-12-31 | **ACTIVE** |
| 28 | huettenlampen | Huettenlampen | 7,525 | €152,625 | 2025-12-31 | **ACTIVE** |
| 27 | ledsonede | LEDSone DE | 5,185 | €103,280 | 2025-12-31 | **ACTIVE** |
| 22 | electricalsone | Electricalsone | 2,972 | €52,976 | 2025-12-31 | **ACTIVE** |
| 4 | so_926407 | Sunsone | 2,837 | €58,250 | 2025-12-31 | **ACTIVE** |
| 222 | homin_gmbh | Homin GmbH | 393 | €6,584 | 2025-12-30 | **ACTIVE** |

Six eBay accounts recorded DE orders in 2025. Additional eBay accounts (retroled, bestbringer, etc.) had a handful of historical DE orders but none in 2025 — treat as inactive for this report.

### 4d. Wayfair DE

| Account ID (sub_source) | Account Name | Company | 2025 DE Orders | 2025 DE Revenue | Last Order | Status |
|---|---|---|---|---|---|---|
| 66 | LEDSONEDE | LEDSone DE | 13 | €391 | 2025-01-07 | **DORMANT — last order 2025-01-07** |

Wayfair DE is **NOT unsupported — it exists in the system**. However the account is effectively dormant: 13 orders in the first 7 days of 2025, then nothing. Historical total: 2,660 orders from 2020-09-03 to 2025-01-07. Include in reports with a DORMANT flag. Do not exclude — the lost-sales story from Wayfair DE is real history.

---

## 5. Source-to-Target Field Mapping

### 5a. Sales / Orders / Revenue

| Required Field | Source Object | Column | Grain | Date Coverage | German Filter | Account Filter |
|---|---|---|---|---|---|---|
| Product ID (internal) | `inventory.products` | `id` | product | all time | via stock join | — |
| SKU | `order_management.order_item_info` | `real_sku` (resolved) or `item_sku` (listed) | line item | 2020→present | via orders.market_place='10' | sub_source_id |
| Product title | `inventory.products` | `title` | product | — | — | — |
| Last-year sales EUR | `order_management.orders` | `total` (order total) or `order_item_info.item_price × item_quantity` | order / line | 2025 full year confirmed | `market_place='10'` | `sub_source_id` |
| Last-year quantity sold | `order_management.order_item_info` | `item_quantity` (cast to INT) | line item | 2025 full year | via order join | via sub_source |
| Category | `inventory.products` | no category column in products table — via `staff.ph_category_products` if needed | — | — | — | — |
| Google Ads account | `google_ads.accounts` | `account_name` | account | — | `market_place='DE'` | — |
| Campaign | `google_ads.campaigns` | `campaign_name` | campaign | — | via account_id | — |
| Google Ads product ID | `google_ads.merchant_products` | `product_id` (e.g. shopify_GB_…) | product | — | `country='DE'` | — |
| Clicks | `google_ads.product_performance` | `clicks` | product × date | needs join verification | via campaign→account | — |
| Advertising cost | `google_ads.product_performance` | `cost` | product × date | needs join verification | via campaign→account | — |
| Sales before stock issue | `order_management.orders` + `order_item_info` | `total` / `item_price × qty` | order | 2025 | `market_place='10'` | sub_source |

### 5b. Stock

| Required Field | Source Object | Column | Grain | Date Coverage | German Filter | Account Filter |
|---|---|---|---|---|---|---|
| Current centralized DE stock | `inventory.local_inventory_current_stock_location_wise` | `stock` | product × location | Live (updated every 4 hours) | `warehouse_location='Germany'` | N/A — single row per product |
| Physical DE stock by warehouse | `inventory.physical_product_stock` | `quantity - reserved_quantity` | product × warehouse | Live | via warehouse.warehouse_location='Germany' | — |
| Marketplace listing availability | `google_ads.merchant_products` | `availability` ('in stock'/'out of stock') | product | Snapshot (synced hourly) | `country='DE'` | — |

**No historical stock snapshots or OOS event log exists** — see Section 7.

---

## 6. Centralized Stock Validation

**Determination:** Germany stock is **genuinely centralized** and managed as a location, not per-marketplace.

### Evidence

1. `inventory.local_inventory_current_stock_location_wise` stores one row per `(inventory_id, warehouse_location)`. For Germany, there is exactly **one row per product** — it is the computed available stock for the Germany location as a whole.

2. `GetInvStock` (the authoritative stock calculation) sums stock across all warehouses within a location. For Germany this means: Trossingen Schmutter Str + Trossingen Kronen Str (Duisburg excluded per global rule).

3. Physical warehouse query confirmed three entries for `warehouse_location='Germany'`:
   - **Trossingen Schmutter Str** — 7,752 products, 178,925 total qty, 317 reserved (ACTIVE — include)
   - **Trossingen Kronen Str** — 7,752 products, 95,344 total qty, 20 reserved (ACTIVE — include)
   - **Duisburg warehouse** — 7,754 products, 675 total qty (EXCLUDED per warehouse-restrictions.md)

4. `local_inventory_current_stock_location_wise.stock` for `warehouse_location='Germany'` already reflects the summed, calculated available stock across the two active Trossingen warehouses. **Use this column directly — do not sum across warehouses manually.**

### DO NOT double-count rule

Query pattern for centralized DE stock:
```sql
SELECT inventory_id, stock AS centralized_de_stock
FROM inventory.local_inventory_current_stock_location_wise
WHERE warehouse_location = 'Germany';
```

This is the single authoritative DE stock figure. Do not join to `physical_product_stock` and re-sum warehouse quantities for the same purpose.

### Current DE Stock Summary
- Products tracked: **43,780**
- Products with stock > 0: **14,502**
- Products at zero stock: **29,278** (67% of catalogue has zero DE stock)

---

## 7. Product Matching Coverage

### 7a. Orders → Inventory (SKU match)

| Source | Join Key | Quality |
|---|---|---|
| `order_item_info.real_sku` → `inventory.products.sku` | real_sku (resolved by order management system) | HIGH — real_sku is the system-resolved inventory SKU |
| `order_item_info.item_sku` → `inventory.products.sku` | item_sku (platform-listed SKU) | MEDIUM — may differ from inventory.products.sku for some accounts |

Recommendation: use `real_sku` as the primary join key. Fall back to `item_sku` only when `real_sku` is null.

### 7b. Amazon Listings → Inventory

| Key | Column | Notes |
|---|---|---|
| ASIN | `amazon_listings.asin` | Join to `order_item_info.item_asin` |
| SKU | `amazon_listings.sku` / `mapped_sku` | both must be checked; `mapped_sku` takes priority when populated |

### 7c. eBay Listings → Inventory

| Key | Column | Notes |
|---|---|---|
| eBay Item ID | `ebay_listings.item_id` | Joins to `order_item_info.item_id` |
| SKU | `ebay_listings.sku` | Filter: `all_list=1` mandatory |
| Site | `ebay_listings.site` | Filter `site='ebay.de'` for German listings |

### 7d. Google Ads Merchant Products → Inventory

| Key | Column | Coverage | Risk |
|---|---|---|---|
| `mpn` | `google_ads.merchant_products.mpn` | **Only 25 of 8,409 DE products have mpn populated (0.3%)** | CRITICAL — near-zero SKU coverage |
| `product_id` | `google_ads.merchant_products.product_id` | e.g. `shopify_GB_4551406878816_…` | Parseable to Shopify product/variant ID, then join to `listings.shopify_listings` |
| `item_group_id` | `google_ads.merchant_products.item_group_id` | Groups variants | Secondary |

**Blocker:** Direct SKU matching from Google Ads merchant products to inventory is not viable via `mpn` alone (0.3% coverage). The `product_id` parsing route (extract Shopify product ID → join `shopify_listings` → join inventory via `real_sku`) requires reviewer approval before implementation and may not cover all campaigns.

### 7e. Wayfair → Inventory

Wayfair orders are in `order_management.orders` / `order_item_info` (source_id=6, sub_source_id=66 for DE). Product matching follows the same `real_sku` path as other channels. No separate Wayfair listing table identified in PostgreSQL.

### 7f. Inventory → Centralized Stock

| Key | Join |
|---|---|
| `inventory.products.id` = `local_inventory_current_stock_location_wise.inventory_id` | Direct FK — reliable |

### Duplicate Key / Null Key Summary

| Source | Null key risk | Duplicate key risk | Unmatched risk |
|---|---|---|---|
| order_item_info.real_sku | LOW — system-resolved | LOW | LOW — resolves to inventory sku |
| amazon_listings.sku | MEDIUM — mapped_sku may differ | LOW | MEDIUM — verify sku vs mapped_sku |
| ebay_listings.sku (all_list=1) | LOW | LOW | LOW |
| merchant_products.mpn | HIGH — 99.7% null for DE | — | CRITICAL |
| merchant_products.product_id | LOW | LOW | MEDIUM — parse required |

**Rule:** Do not match products by title. Only the paths listed above are permitted.

---

## 8. Historical Stock Data — OOS Date Feasibility

**Finding: NO historical stock data source exists.**

Search of all PostgreSQL tables for any of: `stock_history`, `oos`, `out_of_stock`, `stock_event`, `stock_log`, `inventory_log`, `stock_change` — returned **zero results**.

The `inventory.local_inventory_current_stock_location_wise` table is a **live snapshot updated every 4 hours**. It contains no history column, no timestamp of when stock last changed, and no event log.

The `inventory.physical_product_stock` table is similarly a live snapshot.

**Consequence for Report 4 (Slow Restocking / Lost Opportunity):**

Report 4 requires `first_out_of_stock_date` and `days_out_of_stock` per SKU. These fields **cannot be populated** from any currently available source. The following substitutes are explicitly forbidden per the discovery brief:

- Last sale date — FORBIDDEN (does not confirm stock ran out)
- Product update date — FORBIDDEN
- Listing update date — FORBIDDEN
- Google merchant product `availability` snapshot — shows current status only, not when it changed

**Report 4 is BLOCKED** until a stock-event logging mechanism exists or a historical stock snapshot series is available.

---

## 9. Approved Calculation Rules

A search of `business/rules/` in the AIOS knowledge base was conducted. The following rules were confirmed or NOT FOUND:

| Calculation | Status | Source |
|---|---|---|
| Stock calculation (GetInvStock) | **CONFIRMED** | `business/rules/stock-calculation-logic.md` |
| Platform stock update pipeline | **CONFIRMED** | `business/rules/platform-stock-update-rules.md` |
| Warehouse exclusion rules | **CONFIRMED** | `business/rules/warehouse-restrictions.md` |
| SKU format rules | **CONFIRMED** | `business/rules/sku-format-rules.md` |
| Lost-sales estimate formula | **NOT FOUND** — not in knowledge base | Must be confirmed by business owner before use |
| Previous monthly sales calculation period | **NOT FOUND** | Must be confirmed |
| Fast-moving product classification rule | **NOT FOUND** | Must be confirmed |
| Average monthly sales period (1 month? 3 months? 12 months?) | **NOT FOUND** | Must be confirmed |
| Supplier lead time | **NOT FOUND** | Must be confirmed |
| Safety stock formula | **NOT FOUND** | Must be confirmed |
| Replenishment coverage days | **NOT FOUND** | Must be confirmed |
| Recommended minimum stock formula | **NOT FOUND** | Must be confirmed |
| Never-Out-of-Stock classification | **NOT FOUND** | Must be confirmed |

**None of the missing formulas have been invented or assumed.** All reports dependent on these formulas are marked PARTIAL until business confirmation is received.

---

## 10. "Last Year" Period Validation

**Default test period: 2025-01-01 to 2025-12-31**

Confirmed in live data:
- Earliest DE order in 2025: 2025-01-01 (multiple accounts)
- Latest DE order in 2025: 2025-12-31 (multiple accounts)
- Full year coverage confirmed for all active DE accounts

**Requires business-validator confirmation.** "Last year" may mean fiscal year or a different 12-month window. The standard calendar year 2025 is the tested assumption.

---

## 11. Report Feasibility

| Report | Sources Found | Reliable Join | Historical Stock Data | Formulas Confirmed | Status | Blocker |
|---|---|---|---|---|---|---|
| 1. Last-Year Best Sellers Now OOS | orders, order_item_info, inventory.products, local_inventory_current_stock_location_wise | YES — via real_sku | NOT AVAILABLE — no OOS date | Partial — lost-sales estimate formula missing | **PARTIAL** | No OOS date; lost-sales formula not confirmed |
| 2. High-Demand Products With No Stock | google_ads.merchant_products (8,409 DE), product_performance (join needs verification), local_inventory | WEAK — only 25/8,409 DE products have mpn | N/A | Partial — product match route unconfirmed | **PARTIAL — BLOCKED on product matching** | mpn coverage 0.3%; product_id parse route needs approval |
| 3. Channel-Wise Stock Impact | orders+order_item_info by sub_source, local_inventory | YES — orders.sub_source_id separates channels | NOT AVAILABLE for OOS timing | Lost-sales formula missing | **PARTIAL** | Lost-sales formula not confirmed |
| 4. Slow Restocking / Lost Opportunity | orders (velocity), local_inventory (current) | YES for velocity | **NONE** — no OOS event table found anywhere | Previous monthly sales period not confirmed | **BLOCKED** | No historical stock data; first-OOS-date cannot be determined |
| 5. Fast-Moving Products — Permanent Stock | orders (velocity), local_inventory (current stock) | YES | N/A | Min-stock formula, never-OOS rule, safety stock — all missing | **PARTIAL** | Classification rules and min-stock formula not confirmed |

---

## 12. Duplicate Risk Register

| Existing Asset | Path | Coverage | Reuse or Extend | Duplicate Risk |
|---|---|---|---|---|
| UK Unit3 Shelf Refill Report | `reporting/inventory/uk_unit3_shelf_refill.md` | UK warehouse only | DO NOT reuse — UK scope only | LOW — different geography |
| Shopify Product Fee Report | `development/apps/mysql-to-postgresql/README.md` (referenced) | UK/multi market | DO NOT reuse — different purpose | LOW |
| Sonya Req 1 / Google Ads dashboards | `evidence/sonya/` | Google Ads performance (UK focus) | REVIEW before building Report 2 — may overlap on campaign/product data | MEDIUM for Report 2 |
| Thivajini Req 3 (stock spend) | `evidence/Thivajini/req3-stock-spend-discovery-evidence-2026-07-09.md` | Stock vs spend intersection | REVIEW — may cover similar stock-availability-vs-ads logic | MEDIUM for Reports 2 & 3 |
| No Germany-specific stock/sales report found | — | — | — | NONE — this is new work |

---

## 13. Known Limitations

1. **No OOS event log** — Reports 1, 2, 3, and 4 all reference "out of stock date" or "first OOS date." Only current stock (live snapshot every 4 hours) is available. This is the most significant limitation for the entire analysis.

2. **Google Ads product-to-SKU matching** — Only 25 of 8,409 DE merchant products have an mpn. The `product_id` parsing route (Shopify product ID extraction) needs reviewer approval and may miss non-Shopify products.

3. **Google Ads product_performance DE data** — Campaign join via `campaign_id` to filter to DE account returned 0 rows in discovery. The correct join key (`campaign_id` = `campaigns.campaign_id`, not `campaigns.id`) needs re-verification with a working query before Report 2 build begins.

4. **Orders.total currency** — The `orders` table has no explicit currency column. DE orders (market_place=10) are expected to be in EUR based on the marketplace definition. This assumption must be validated before revenue figures are reported as EUR.

5. **Wayfair DE dormant** — Last order 2025-01-07. Wayfair DE data will only contribute to historical comparison, not current stock impact.

6. **Order status filtering** — Cancelled orders are in the orders table. All revenue and quantity calculations must filter out cancelled/returned orders. The exact status values to exclude require business confirmation (current default: exclude status IN ('Cancelled','cancelled')).

7. **item_quantity stored as VARCHAR** — `order_item_info.item_quantity` is stored as VARCHAR(25) and must be cast to INT in all quantity calculations. Null and non-numeric values must be handled.

8. **Fast-moving classification** — Without a confirmed average monthly sales window (1 month? 3 months? rolling 12?), Report 5 cannot produce a "recommended minimum stock" or "Never-OOS" classification. These cannot be invented.

---

## 14. Next Action

**One action required before build can begin:**

> **Business owner to confirm or supply: (a) reporting period (2025 calendar year or other), (b) lost-sales estimation formula or approval to use a simple proxy (e.g. prev monthly avg × days OOS), (c) fast-moving/never-OOS classification rule, (d) minimum stock formula, and (e) decision on whether Report 4 should be deferred (no OOS history exists).**

Secondary action: verify `google_ads.product_performance` DE join via a corrected query (`campaigns.campaign_id = product_performance.campaign_id`) and confirm whether DE product performance data is populated.

---

*Discovery complete. No reports built. No formulas invented. Saved: `evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md`*
