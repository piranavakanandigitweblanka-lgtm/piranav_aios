# Thivajini — Requirement 4 — Order Data — Build Prompt
## Date: 2026-07-09
## Status: COMPLETE — LOCAL ONLY (NOT PUSHED — awaiting GPT approval)

**Title:** Requirement 4 — Shopify Orders vs Google Ads Orders Comparison
**Purpose:** Rule 12 permanent GPT prompt capture for Req 4 implementation
**Requirement Source:** Screenshot showing Order Data table with 30/60/90 day comparison
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products have Shopify orders versus Google Ads orders over the last 30, 60, and 90 days?
**Store:** ledsone.fr (EUR) | sub_source_id=233 | merchant_id=5551466539

## Build Specification
- File updated: Staff-requirements/pages/thivajini.html (panel-4)
- New tab: "Order Data / Req 4"
- Do not create new HTML file
- Req 1, 2, 3 unchanged

## Data Sources
- Shopify orders: ShopifyQL `FROM sales SHOW orders, gross_sales GROUP BY product_title` (30/60/90d windows)
- Ads orders: public.ppc_etl_performance_data (sub_source_id=233, record_type='product', 30/60/90d)
- Product title lookup: Shopify GraphQL for Ads product IDs extracted from ppc_etl.record_id

## Matching Key
Product Title (Shopify product title ↔ Shopify product title via ppc_etl.record_id product ID lookup)
- ppc_etl.record_id format: `shopify_zz_{product_id}_{variant_id}` → extract product_id → Shopify product title
- ppc_etl.sku (numeric when set) = Shopify variant ID → look up product title

## AIOS Files Created
- prompts/Thivajini/requirement-4-order-data-build.md (this file)
- evidence/Thivajini/requirement-4-order-data-evidence.md
- validation/Thivajini/requirement-4-order-data-validation.md
- handover/Thivajini/requirement-4-order-data-handover.md
- reports/Thivajini/requirement-4-order-data-report.md
- vercel/Thivajini/requirement-4-deployment-notes.md

## PASS / FAIL: PASS (local only, not pushed)

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
