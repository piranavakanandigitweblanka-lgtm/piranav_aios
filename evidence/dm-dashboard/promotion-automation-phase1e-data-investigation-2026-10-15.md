# Evidence: Promotion Automation Phase 1E — Data Source Investigation

**Date:** 2026-10-15
**Phase:** 1E
**Status:** PARTIAL — D2 PARTIAL, D3 PARTIAL (Amazon refund rate found; reviews NOT FOUND)
**Executed by:** Claude Code (fork agent)
**Assigned by:** Muguntha / Piranav

---

## 1. Knowledge Base Search Results

Searches run on `ledsone-aios-knowledge-base`:
- "landed cost" → 0 results
- "gross margin" → 0 results
- "variable fees" → 0 results
- "review count" → 0 results
- "return rate" → 0 results (no dedicated doc)
- "promotion" → not specifically searched (policy already extracted in Phase 1D)

**Finding:** The AIOS knowledge base contains no documentation for landed cost, gross margin, variable fees, review counts, or return rates. These topics are undocumented in the knowledge base.

Relevant knowledge base docs read:
- `database/postgresql/schemas/suppliers/README.md` — suppliers schema with invoices, order_items, containers
- `database/postgresql/schemas/suppliers/relationships.md` — join verification
- `database/postgresql/schemas/accounting/tables/amazon_order_expenses.md` — Amazon financial events per order
- `database/postgresql/schemas/business_reports/tables/amz_sales_and_traffic_by_asin.md` — Amazon traffic + refund rate

---

## 2. Database Schema Findings — Landed Cost / Fees (D2)

### 2A. Landed Cost

**Search:** Columns matching `%cost%`, `%margin%`, `%landed%`, `%purchase%` across all schemas.

**Finding:** No `landed_cost`, `cogs`, `cost_price`, or `purchase_cost` column exists anywhere in the ledsone PostgreSQL database.

**Closest available source — `suppliers.invoices.unit_price`:**

| Property | Value |
|---|---|
| Table | `suppliers.invoices` |
| Column | `unit_price` (numeric, nullable) |
| Also | `fob` (numeric, nullable) — total FOB value for the invoice line |
| Grain | Per invoice line per final container — NOT per SKU |
| Join to SKU | `suppliers.invoices.final_container_id` → `suppliers.order_items.final_container_id` → `order_items.sku` |
| Currency | NOT confirmed in schema — likely USD (Chinese factory invoices). Piranav must confirm. |
| Sample data verified | YES — e.g. SKU `PHSF1GYRCH` shows unit_price £4.80, units 22030, fob 105744.00 (2026-06-04) |

**Critical limitations:**
- `unit_price` is the FOB (Free On Board) factory price — it does NOT include: freight, import duty, inland transport, insurance
- Landed cost = FOB + freight + duty + insurance. Only FOB is in the DB.
- `invoice_shipping_cost` table exists (`suppliers.invoice_shipping_cost.shipping_cost` per `final_container_id`) — gives freight per container but not allocated per SKU
- No per-SKU duty/import tax field exists anywhere
- Multiple rows per SKU per container are possible (50 total invoices, 4,947 order_items)
- No "most recent cost" flag — multiple dates exist; cost varies by shipment

**Status: PARTIAL** — FOB unit price is available and joinable to SKU, but full landed cost requires freight and duty allocation which is not in the DB.

### 2B. Variable Fees

**Amazon FBA + Referral Fees — CONFIRMED for Amazon:**

| Property | Value |
|---|---|
| Table | `accounting.amazon_order_expenses` |
| Key columns | `seller_sku`, `charge_type`, `amount`, `currency`, `date` |
| Relevant charge types confirmed | `FBAPerUnitFulfillmentFee` (negative — FBA pick/pack/ship), `Commission` (negative — Amazon referral %) |
| Grain | Per order item, per charge type |
| Sample data verified | e.g. `FBAPerUnitFulfillmentFee` and `Commission` present per `seller_sku` |
| Join key | `seller_sku` → LEDSone Amazon SKU |

**Limitation:** These are historical per-transaction fees, not a pre-computed "expected fee per unit" lookup. To use for promotion qualification: aggregate `WHERE charge_type = 'FBAPerUnitFulfillmentFee' AND date >= NOW() - INTERVAL '90 days'` grouped by `seller_sku` — compute avg fee per unit sold.

**eBay Fees — PARTIAL:**
- `accounting.ebay_order_expenses` exists with `fee`, `order_marketplace_fee`, `fee_type` (e.g. `FINAL_VALUE_FEE`)
- `accounting.ebay_transaction_fees` with `fee_type`, `fee_basis_amount` per transaction
- These are per-order but joinable via order_id

**Shopify Fees — PARTIAL:**
- `accounting.shopify_transactions.fee` exists — Shopify transaction/payment fee per transaction

**B&Q / Wayfair fees — NOT FOUND** in accounting schema.

**Status: PARTIAL** — Amazon FBA + referral fees are confirmed per SKU via `amazon_order_expenses`. eBay and Shopify fees exist per transaction but are not pre-aggregated. B&Q/Wayfair not found.

### 2C. Net Contribution Inputs

Required formula: `Post-promo price − landed cost − variable fees ≥ £2`

| Input | Source | Status |
|---|---|---|
| Selling price | `order_management.order_item_info.real_price` (phase 1B verified) | CONFIRMED |
| FOB / purchase cost | `suppliers.invoices.unit_price` via order_items join | PARTIAL |
| Freight per unit | NOT in DB | NOT FOUND |
| Import duty per unit | NOT in DB | NOT FOUND |
| Amazon FBA fee | `accounting.amazon_order_expenses.amount` WHERE charge_type = 'FBAPerUnitFulfillmentFee' | PARTIAL (Amazon only) |
| Amazon referral fee | `accounting.amazon_order_expenses.amount` WHERE charge_type = 'Commission' | PARTIAL (Amazon only) |
| eBay marketplace fee | `accounting.ebay_order_expenses.fee` | PARTIAL (per order) |
| Shopify transaction fee | `accounting.shopify_transactions.fee` | PARTIAL (per order) |
| Ad spend per SKU | `accounting.amazon_order_expenses` + Google Ads `product_performance` (phase 1A) | PARTIAL |

**Status: PARTIAL** — Selling price confirmed. FOB available (not full landed cost). Channel fees available for Amazon/eBay/Shopify but require aggregation. Net contribution formula cannot be computed with full accuracy until freight + duty per unit are resolved (D2 gap).

---

## 3. Database Schema Findings — Reviews / Returns (D3)

### 3A. Product Reviews

**Search:** Columns matching `%review%`, `%review_count%`, `%rating%` across all schemas.

**Results:**
- `%review_count%` → 0 results
- `%review%` → 4 results, all `body_preview` in message tables (unrelated)
- `%rating%` → 7 results:
  - `customer_service.amazon_order_feedback.rating` (smallint) — **NOTE: only 1-3 star ratings (negative/neutral) per knowledge base doc. Amazon report returns negative/neutral feedback only. NOT a basis for average star rating or review count.**
  - `customer_service.ebay_account_ratings` — seller-level DSR (Communication, ItemAsDescribed, ShippingTime, ShippingCharges) — NOT product-level reviews
  - `customer_service.ebay_orders_customer_feedbacks.rating_star` — eBay feedback star colour — seller feedback, not product review count

**Finding:** No product-level review count or average star rating exists anywhere in the ledsone database. Amazon listings table (`listings.amazon_listings`) has no review fields. No SP-API review data is ingested.

**Status: NOT FOUND** — Review count / review base (policy metric C2) has no data source in the database.

### 3B. Product Returns / Refund Rate

**Amazon refund rate — PARTIAL (Amazon only):**

| Property | Value |
|---|---|
| Table | `business_reports.amz_sales_and_traffic_by_sku` |
| Columns | `sku`, `units_refunded` (integer), `refund_rate` (numeric), `units_refunded_b2b`, `refund_rate_b2b` |
| Also | `business_reports.amz_sales_and_traffic_by_asin` — same fields at ASIN grain |
| Grain | Per SKU per day per seller account per marketplace |
| Pre-computed by | Amazon SP-API (not LEDSone's calculation) |
| Coverage — CRITICAL WARNING | Per knowledge base: LEDSone Amazon UK (sub_source=8, market_place=23) had only **1 day of data (2026-07-28)** as of 2026-08-12. Post large history load, coverage may have improved. **Must re-measure before using for 90-day return rate calculation.** |
| Join key | `sku` → LEDSone Amazon seller SKU |

**Amazon physical returns — PARTIAL:**
- `customer_service.amazon_returns` — per return record with `label_cost`, `refunded_amount`, `return_delivery_date`
- Does not include units_returned count or rate per SKU

**eBay returns — PARTIAL:**
- `customer_service.ebay_returns.return_qty` (integer) per return record
- Per return event, not aggregated per SKU with rate
- `customer_service.ebay_order_cancellations` — cancellations only, not returns

**Wayfair refunds:**
- `order_management.wayfair_refund` — refund_date, refunded_by, feedback (text) — financial refund only, not unit count

**Order management refunds (Shopify):**
- No dedicated refund/return rate table found for Shopify/BQ/other channels

**sub_source 38 confirmed:** LEDSONEUK (company=LEDSone, Shopify UK channel, source_id=6)

**Status: PARTIAL** — Amazon refund rate exists per SKU in `amz_sales_and_traffic_by_sku` but coverage for LEDSone UK may be sparse. No review count found. eBay per-return records exist but no aggregated rate. No Shopify return rate. No multi-channel return rate.

### 3C. Category Return Benchmark

**Required:** Category-level average return rate to compare individual SKU rate against (policy metric A4).

**Finding:** No pre-computed category-level return rate exists in the database. `listings.amazon_listings.product_type` exists and could be used as a category proxy. A derivable formula would be:
```sql
SELECT product_type, AVG(refund_rate) as category_avg_refund_rate
FROM business_reports.amz_sales_and_traffic_by_sku s
JOIN listings.amazon_listings l ON s.sku = l.sku
WHERE s.date >= NOW() - INTERVAL '90 days'
GROUP BY product_type;
```
**Critical caveat:** This relies on the sparse Amazon UK LEDSone coverage warning above. Until coverage is confirmed, this calculation may produce unreliable averages.

**Status: NOT FOUND (derivable, not pre-existing)** — Must be calculated from Amazon data. Non-Amazon category benchmark: NOT POSSIBLE with current data.

---

## 4. Order Management Verification (Phase 1A Cross-check)

**`order_management.orders` columns confirmed:** id, order_id, status, order_date, merge, sub_source_id, market_place, total, sub_total, shipping_cost, tax, discount, warehouse_id, completed_by, update_inv, is_shelf_updated

**`order_management.order_item_info` columns confirmed:** order_id, real_sku, real_price, real_qty, item_sku, item_price, item_quantity (+ combo, instruction, img fields)

**`sub_source id=38` confirmed:** LEDSONEUK — company=LEDSone, Shopify UK channel (source_id=6). This is the LEDSone Shopify UK account.

---

## 5. Decision Table

| Decision | Evidence found | Authoritative source | Status | Remaining gap |
|---|---|---|---|---|
| D2: Landed cost | `suppliers.invoices.unit_price` joinable to SKU via `order_items.final_container_id` | `ledsone.suppliers.invoices.unit_price` + join via `suppliers.order_items.sku` | PARTIAL | FOB only — no freight allocation, no import duty per SKU. Currency not confirmed. |
| D2: Variable fees | Amazon FBA fee + referral fee per SKU in `amazon_order_expenses`. eBay fee per order in `ebay_order_expenses`. Shopify fee per transaction in `shopify_transactions`. | `ledsone.accounting.amazon_order_expenses` (FBAPerUnitFulfillmentFee, Commission) | PARTIAL | Amazon confirmed; eBay/Shopify per-transaction only (not per-SKU aggregated); B&Q/Wayfair not found. |
| D2: Net contribution inputs | Selling price confirmed. FOB cost partial. Channel fees partial. | Multiple — see section 2C | PARTIAL | Freight + duty per unit missing. Full landed cost not calculable from DB alone. |
| D3: Product reviews | No review_count column anywhere in DB. amazon_order_feedback.rating is 1-3 only (negative feedback, not review count). | N/A | NOT FOUND | Requires Amazon SP-API `GET_MERCHANT_LISTINGS_ALL_DATA` or manual input. No existing data source. |
| D3: Product returns/refunds | `amz_sales_and_traffic_by_sku.refund_rate` (pre-computed by Amazon, per SKU per day). Coverage for LEDSone UK unconfirmed. | `ledsone.business_reports.amz_sales_and_traffic_by_sku.refund_rate` | PARTIAL | Amazon only. LEDSone UK (sub_source=8) coverage may be sparse (1 day as of 2026-08-12). Non-Amazon return rate NOT available. |
| D3: Category return benchmark | Not pre-computed. Derivable from Amazon data + product_type join if coverage is sufficient. | Derivable: `amz_sales_and_traffic_by_sku` JOIN `amazon_listings.product_type` | NOT FOUND (derivable) | Requires Amazon coverage confirmation. Non-Amazon: NOT POSSIBLE from current data. |

---

## 6. Conclusions

### What Can Be Implemented Safely Now

1. **Section A structure** — can be built as a framework accepting manual override for A1/A2/A3/A4 while automated sources are unresolved
2. **Amazon FBA fee per SKU** — aggregate `accounting.amazon_order_expenses` over 90 days by seller_sku, charge_type IN ('FBAPerUnitFulfillmentFee', 'Commission')
3. **Amazon refund rate per SKU (if coverage confirmed)** — aggregate `amz_sales_and_traffic_by_sku.refund_rate` over 90 days. Piranav must first verify LEDSone UK coverage post history load.
4. **FOB unit price** — fetch most recent `suppliers.invoices.unit_price` per SKU via order_items join as a PARTIAL proxy for product cost. Requires business approval that FOB = accepted cost basis.
5. **Category return benchmark (Amazon only, if coverage confirmed)** — derivable via SQL join on product_type.

### What Remains Blocked

1. **Full landed cost (A1, A2, A3)** — FOB exists but freight + duty per SKU does not. Cannot compute true gross margin or net contribution without this.
2. **Product review count (C2)** — NOT in database. No source identified.
3. **Multi-channel return rate (A4)** — Amazon partial; eBay/Shopify/Wayfair return rate per SKU not available.
4. **Non-Amazon variable fees (eBay/Wayfair)** — per-order fees exist but not in a per-SKU queryable format without aggregation formulas approved by Piranav.

### Exact Questions for Piranav / Finance

| # | Question | Impact |
|---|---|---|
| Q1 | Is `suppliers.invoices.unit_price` (FOB factory price) the accepted cost basis for promotion qualification, or must freight and duty be added? | A1/A2/A3 computation |
| Q2 | If freight must be included: how should it be allocated per SKU? (Per CBM? Per unit? Fixed %) | A1/A2/A3 computation |
| Q3 | What is the currency of `suppliers.invoices.unit_price`? USD? Should it be converted at what rate? | A1/A2/A3 computation |
| Q4 | Where are product reviews stored? Amazon SP-API? Trustpilot? Manual spreadsheet? | C2 score metric |
| Q5 | Should the Amazon refund rate (`amz_sales_and_traffic_by_sku`) be used for A4, or is physical returns data required? | A4 score metric |
| Q6 | Should Phase 1 scope be Amazon-only for financial metrics (Section A) given data availability? | Phase 2 scope decision |
| Q7 | Has the Amazon UK (LEDSone sub_source=8) coverage gap been resolved post history load? | A4 and C2 viability |

### Can Phase 2 Begin?

**Conditionally YES** — Phase 2 can begin for:
- Sections B, C (partial), D (Amazon), E — all fully specified, no data dependencies
- UAM registration and page scaffold (frontend + backend structure)
- Brief schema and one-intent-per-SKU enforcement
- Monitoring framework (Day 7/14/30 structure)
- Section A as stubs with manual override inputs

**Phase 2 CANNOT complete** Section A financial metrics until Q1–Q7 are answered by Piranav.

---

## 7. Evidence Sources

| Source | What was inspected |
|---|---|
| `ledsone.suppliers.invoices` | unit_price, fob, final_container_id, invoice_date |
| `ledsone.suppliers.order_items` | sku, final_container_id join verified with sample data |
| `ledsone.accounting.amazon_order_expenses` | charge_type distinct values confirmed; FBA + Commission per seller_sku verified |
| `ledsone.business_reports.amz_sales_and_traffic_by_asin` | refund_rate, units_refunded columns confirmed; coverage warning read |
| `ledsone.business_reports.amz_sales_and_traffic_by_sku` | same + sku column confirmed |
| `ledsone.listings.shopify_listings` | price, compare_price confirmed; no cost field |
| `ledsone.listings.amazon_listings` | no review_count or rating column confirmed |
| `ledsone.customer_service.amazon_order_feedback` | rating = 1-3 only (negative feedback), not review count |
| `ledsone.order_management.sub_source id=38` | LEDSONEUK Shopify UK confirmed |
| AIOS knowledge base | amz_sales_and_traffic_by_asin.md, amazon_order_expenses.md, suppliers/README.md, suppliers/relationships.md read in full |
| Column searches | %cost%, %fee%, %review%, %return%, %refund%, %rating%, %margin%, %review_count% across all schemas |
