# Capability — Shopify Listing Health Export Queries

## Date First Identified
2026-09-21

## Last Updated
2026-09-21

## Status
ACTIVE — Queries proven, CSVs exported and committed

## Purpose
Three reusable Shopify GraphQL query patterns (via Shopify MCP or Admin API) for identifying product listing health issues: non-sale in-stock products, products that have never sold, and products that were once selling but have gone dormant.

## Business Problem Solved
Ledsone UK has thousands of active products. Without structured queries it is impossible to identify which products are eligible for promotions (non-sale, in-stock), which have been completely overlooked (never sold), or which once performed but have fallen silent (dormant). These three queries give a repeatable snapshot for commercial and merchandising decisions.

## When To Use
- Preparing a list of candidates for promotions, Google Ads campaigns, or collection reviews
- Identifying catalogue dead weight (zero lifetime sales)
- Spotting products that need re-merchandising (once sold, now stagnant)

## When NOT To Use
- For German or French stores (queries are scoped to Shopify UK store — `sub_source = 104` / `store=ledsone_uk`)
- When real-time Shopify inventory is required — these queries use the DB mirror which has a sync lag

## Required Inputs
- Access to `ledsone-db-mcp` (read-only PostgreSQL)
- Shopify MCP access if using GraphQL directly (`mcp__claude_ai_Shopify__graphql_query`)
- Time window for dormant definition (default: 6 months from run date)

## Source Task / Requirement
Shopify UK Listing Exports — 2026-09-21
Three exports: non-sale in-stock, never-sold, dormant
Evidence: `exports/ledsone-uk-nonsale-instock-2026-09-21.csv`, `exports/ledsone-uk-neversold-lighting-product-level-2026-09-21.csv`, `exports/ledsone-uk-dormant-lighting-2026-09-21.csv`

## Execution Steps

### Query 1 — Non-sale in-stock active listings (variant level)
Purpose: Products eligible for sale promotions (not currently on sale, currently in stock).

Filters applied:
- `status = active`
- `stock > 0` (in-stock)
- `compareAtPrice IS NULL` (not on sale)
- SKU excludes `+` and `RPM` prefixes (combo and replenishment SKUs)
- SKU excludes `ENC` prefix (encoded combo SKUs)

Result (2026-09-21 run): 100 variants

Prompt: `prompts/implementation/shopify-uk-nonsale-instock-listing-fetch.md`

### Query 2 — Never-sold active lighting products (product level)
Purpose: Active lighting products with zero lifetime sales across the entire order history.

Method:
1. Query all `shopify_orders` (all-time) to get a set of ever-sold SKUs (9,894 distinct SKUs)
2. Query all active lighting products (`product_type` matching lighting categories)
3. Cross-reference: active lighting products NOT in the ever-sold set
4. Exclude ENC SKUs. Sort by stock desc.

Result (2026-09-21 run): 81 products from 5,044 active products scanned

Prompt: `prompts/implementation/shopify-uk-dormant-listing-fetch.md` (also covers this query variant)

### Query 3 — Dormant active listings (product level, 6-month window)
Purpose: Products that have sold at some point but NOT in the last 6 months — indicating a performance drop.

Method:
1. Query ever-sold SKUs (9,894)
2. Query recently-sold SKUs (sold since [run date minus 6 months]) — result: 4,777
3. Dormant = ever-sold MINUS recently-sold = 5,117 dormant SKUs
4. Filter for active lighting products in the dormant set
5. Sort by stock desc

Result (2026-09-21 run): 160 lighting products

Prompt: `prompts/implementation/shopify-uk-dormant-listing-fetch.md`

## Evidence Required
- Row counts from each query confirming the results
- Output CSVs saved to `exports/`

## Evidence Path
`exports/ledsone-uk-nonsale-instock-2026-09-21.csv`
`exports/ledsone-uk-neversold-lighting-product-level-2026-09-21.csv`
`exports/ledsone-uk-dormant-lighting-2026-09-21.csv`
`prompts/implementation/shopify-uk-nonsale-instock-listing-fetch.md`
`prompts/implementation/shopify-uk-dormant-listing-fetch.md`

## Pass / Fail Rule
PASS: Each query returns > 0 rows. Output CSVs saved with correct naming convention (`exports/ledsone-uk-[type]-[YYYY-MM-DD].csv`).
FAIL: Query returns 0 rows unexpectedly (check filter conditions or DB sync state). Output not saved.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- "Dormant" threshold (6 months) is configurable — adjust `[run date minus 6 months]` to any window
- "Lighting" product type filter depends on `product_type` field in the DB being correctly populated — verify accuracy before using results commercially
- ENC SKU exclusion is specific to LEDSone's catalogue structure — remove this filter for other clients
- Results are from the DB mirror — live Shopify stock may differ by 1 sync cycle

## Reuse Path
Run on any date by adjusting the dormant window and ENC exclusion. Update output CSV filenames with the run date. For other Shopify stores, adjust `sub_source` and product type filter to match the target store.

## Related Capabilities
- `shopify-collection-tag-audit-method-2026-10-07.md` — also uses `listings.shopify_listings` DB tables

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-21 | Initial capability captured from three Shopify UK listing exports | `exports/ledsone-uk-nonsale-instock-2026-09-21.csv`, `exports/ledsone-uk-neversold-lighting-product-level-2026-09-21.csv`, `exports/ledsone-uk-dormant-lighting-2026-09-21.csv` |
