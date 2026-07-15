# Prompt Record — Theekshy Requirement 1

- **Title:** Campaign Optimisation Dashboard — Prompt Record
- **Task:** Build Requirement 1 (Campaign Optimisation) into pages/theekshy.html
- **Date:** 2026-07-15
- **Member:** Theekshy
- **Team:** Google Ads
- **Requirement:** 1 — Campaign Optimisation
- **Source:** What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv (C:/Users/PC/Downloads/)
- **Objective:** Build a professional before/after campaign optimisation dashboard for Theekshy's two Google Ads campaigns, backed by verified PostgreSQL data, with product-level flagging and business rule engine.
- **Dashboard Tab:** Requirement 1 — Campaign Optimisation
- **Campaign Scope:**
  - Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK (ID: 23714290257)
  - Pmax | Theekshy | Shoptimised | THEE_MYSTERY| Non-Converting | MCV | UK (ID: 23684837882)
- **Store and Country:** LEDSone UK / United Kingdom
- **Date Range:** 2026-06-15 to 2026-07-14 (30 days)
- **Latest Data Date:** 2026-07-14
- **PostgreSQL Environment:** ledsone-db-mcp (read-only)
- **PostgreSQL Sources:** google_ads.campaign_performance, google_ads.product_performance, google_ads.merchant_products, google_ads.campaigns
- **Tables or Views:** google_ads.campaign_performance (daily grain), google_ads.product_performance (product_item_id grain), google_ads.merchant_products (title lookup)
- **Join Keys:** campaign_id, product_item_id / merchant_products.product_id
- **Files Changed:** Staff-requirements/pages/theekshy.html
- **Business Rules:** 6 rules per CSV — High Spend/0 Conv (Critical), ROAS<3.0 (Critical), ROAS 3.0–4.5 (Monitor), ROAS≥4.5 (Healthy), Post-Opt Improved (Healthy), Post-Opt No Improvement (Monitor)
- **Evidence:** See evidence/theekshy/requirement-01-2026-07-15.md
- **Validation:** See validation/theekshy/requirement-01-2026-07-15.md
- **Reviewer:** GPT / Piranav
- **Status:** PASS
- **Risks:** Action log empty — no optimisation event source found in DB
- **Next Action:** Piranav/GPT to approve Vercel deployment; Theekshy to begin logging optimisation events
- **PASS / FAIL:** PASS

## Execution Prompt Summary

Requirement source: CSV with 4 requirements. Requirement 1 = Campaign Optimisation.

Campaign label mapping from CSV:
- "Gems – Performance Max" → Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK
- "Mystery – Performance Max" → Pmax | Theekshy | Shoptimised | THEE_MYSTERY| Non-Converting | MCV | UK

Restrictions: No PostgreSQL writes. No git push. No Vercel deployment. No fake data. No invented optimisation events. Only 2 exact campaigns. Before/after table shows empty state if no action log exists.

Expected result: Updated theekshy.html with Requirement 1 tab showing live campaign status, product performance table with Rule 1 flagging, empty before/after log, ROAS and conversion value charts, all from verified DB data.
