---
Title: Prompt Capture — Thivajini Requirement 3 — Stock-Spend Tracker Discovery
Purpose: Rule 12 permanent GPT prompt capture
Staff: Thivajini
Department: Digital Marketing / Google Ads / PPC
Store: ledsone.fr (LEDSone FR · EUR · sub_source_id=233)
Date: 2026-07-09
AIOS Root: C:\Users\PC\Documents\piranav_aios
---

## Original Requirement

**Business question:** Which products are wasting Google Ads spend because they are out of stock or low stock?

**Source:** Screenshot / CSV requirement from Thivajini

**Decision rules:**
- STOP — Out of Stock: Current Stock = 0 AND Last 30-day Spend > £0
- ACT SOON — Low Stock: Current Stock ≤ 5 (default threshold) AND Last 30-day Spend > £0
- MONITOR: Current Stock ≤ 5 AND Last 30-day Spend = £0
- OK: Current Stock > 5

**Tasks:**
1. Search existing AIOS assets for any stock-spend, inventory, Google Ads spend, Merchant Center feed status, product eligibility, or Thivajini Req 3 work
2. Inspect PostgreSQL read-only
3. Search schemas: public, staging_ai, cppc_intelligence
4. Find data sources for: Product ID/Item ID, SKU, title, category, campaign, feed status/MC status, current stock, last 30-day spend, clicks, conversion rate, units sold 30d
5. Confirm Shopify inventory data exists
6. Confirm Merchant Center feed status exists
7. Confirm campaign-product relationship exists
8. Do not build HTML
9. Do not invent missing data
10. Save discovery notes in evidence/Thivajini
11. Save this prompt in prompts/Thivajini

---

## Discovery Results Summary

### PASS — All required data fields mapped

### Data sources confirmed for LEDSone FR (sub_source_id=233, merchant_id=5551466539):

| Field | Source | Confirmed |
|-------|--------|-----------|
| Product ID (Variant ID) | ppc_etl_performance_data.sku | YES |
| Product title | google_merchant_products.title | YES |
| Product URL | google_merchant_products.link | YES |
| Category | google_merchant_products.product_types | PARTIAL |
| Campaign relationship | ppc_etl.parent_id → public.ppc | YES |
| Feed availability | google_merchant_products.availability | YES |
| GMC diagnostics | raw_data.gmc_product_diagnostics_daily | NO (0 rows for FR) |
| Current stock (numeric) | listing_data.quantity (sub_source=233) | YES (4,152 SKUs, handle=NULL) |
| Warehouse stock | inv_final_stock via internal SKU bridge | YES via listing_data.sku join |
| 30d spend | ppc_etl_performance_data (sub_source=233) | YES — €253.41 |
| 30d clicks | ppc_etl_performance_data | YES — 916 clicks |
| Conversion rate | orders/clicks×100 | YES |
| Units sold 30d | ppc_etl.orders (Google Ads proxy) | YES (proxy) |

### Key pre-existing table found:
`staging_ai.cppc_workbook_stock_spend_v1` — stock-spend tracker with Thivajini's 41 internal SKUs.
Status: STALE (spend_as_of=2026-06-11). Do NOT reuse — build fresh from ppc_etl + gmp.

### Shopify inventory: 
listing_data sub_source=233 has 4,152 SKUs with quantity field. shopify_handle=NULL for all FR rows (same limitation as Hetheesha Req 4). Use listing_data.quantity as stock indicator where joinable.

### Merchant Center feed status:
gmp.availability field confirmed: 'in stock' or 'out of stock' per variant. GMC disapproval table NOT available for FR (0 rows).

### Campaign-product relationship:
CONFIRMED — ppc_etl_performance_data has parent_id (campaign ID) per product SKU. Can link to campaign names via public.ppc.

### Key join (PRIMARY):
ppc_etl_performance_data.sku = google_merchant_products.product_id WHERE merchant_id=5551466539

### Gap: 180 of 324 spending SKUs (€112.29) have no direct gmp record — shopify_ZZ_ format products.

---

## PASS / FAIL Result

**PASS** — Evidence filed. Build approved pending GPT decision on the two open questions:
1. Include or exclude the 180 shopify_ZZ_ products (€112.29 spend without direct gmp join)?
2. Use listing_data.quantity as numeric stock count, or availability-only classification?

## Evidence file
`evidence/Thivajini/req3-stock-spend-discovery-evidence-2026-07-09.md`
