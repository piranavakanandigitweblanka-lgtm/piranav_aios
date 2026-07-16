# Prompts — Theekshy Requirement 3 (Feed Optimisation Action Log)
**Date:** 2026-07-16 | **Member:** Theekshy | **Team:** Google Ads | **AIOS:** Piranav

## Task
Rebuild Requirement 3 inside `Staff-requirements/pages/theekshy.html` as a manual Feed Optimisation Action Log. The previous implementation was a read-only DB snapshot dashboard (R3_DATA, 40 products). The new implementation must be a fully manual log with Add/Edit/Delete, localStorage persistence, and 7 business rules.

## Objective
Replace the stale R3_DATA snapshot table with a user-operated manual review system. Users enter feed review data after a product reaches 7 days from its last campaign optimisation. All calculations (Feed Review Date, Review State, Price Match, Condition, Status, Next Review Date) are performed client-side.

## Campaigns
1. Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK (ID: 23714290257)
2. Pmax | Theekshy | Shoptimised | THEE_MYSTERY | Non-Converting | MCV | UK (ID: 23684837882)

## Source discovery
- AIOS knowledge base: no existing Theekshy Req 3 assets found
- ledsone-db-mcp: R3_DATA was built from google_ads.product_performance + listings.shopify_listings + google_ads.merchant_products — used for asset discovery only, no writes
- No automation, no Vercel Cron, no GitHub Actions, no API integrations

## Dashboard Tab
Existing tab: `panel-3` / nav-3 "Feed Optimisation — Requirement 3"

## Status
PASS — 2026-07-16
