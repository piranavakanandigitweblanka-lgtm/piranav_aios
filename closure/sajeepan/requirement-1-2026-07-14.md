# Sajeepan Requirement 1 — Closure
**Date:** 2026-07-14 | **Final review:** 2026-07-14 | **Reviewer:** Piranav | **Status:** PASS (browser screenshot pending Piranav)

## Deliverable
Full Google Ads PMax Product Intelligence Dashboard in `Staff-requirements/pages/sajeepan.html`. 8 corrections applied after review.

## Corrections Applied
1. Product counts: distinct normalized IDs (30d) — not raw rows or all-time counts
2. Missing titles: sourced from merchant_products — no invented placeholders
3. Availability: Swan Neck Sconce corrected to `out of stock`
4. Profitability: "Ad Contribution = Conv Value − Ad Cost" — profit not shown (COGS unverified)
5. ROAS: percentage format standardized throughout — no `x` multiplier
6. LIMITED reason: "limiting reason not in DB, investigate in Google Ads UI" — no assumed cause
7. AIOS files: all 7 created/updated
8. LIMITED "Needs Attention" card text: removed "check budget/merchant" — now "investigate in Google Ads UI"

## Key Findings
- SJALL HERO ROAS: 135% (target 380%) — most critical underperformer
- SJ_TOP_20 ROAS: 268% (target 400%) — significantly below target
- SJ_PENDANT_KLARNA ROAS: 277% (target 320%) — below target
- HIGH REVENUE PH ROAS: 255% (target 320%) — below target
- ALLACRSJ2 ROAS: 305% (target 380%) — below target
- zero conv2 ROAS: 318% (target 400%) — below target
- All 6 campaigns below their target_roas (verified from DB)
- 2 LIMITED campaigns — reason not determinable from DB
- 4 zero-conversion products spending £10–£24 with no return
- Swan Neck Sconce ROAS 19,083% — product is out of stock
- 870 of 1,154 active products (75.4%) have no merchant_products match

## Target ROAS — Verified
All target_roas values confirmed from `google_ads.campaigns.target_roas`:
320% for SJ_PENDANT_KLARNA and HIGH REVENUE PH | 380% for SJALL HERO and ALLACRSJ2 | 400% for SJ_TOP_20 and zero conv2

## Six-Campaign KPI Reconciliation
All 6 campaigns reconciled against PostgreSQL — Cost, Conv Value, ROAS%, Conversions and normalized product counts all match dashboard embedded data within rounding tolerance. See evidence file for full table.

## Merchant Coverage
284 of 1,154 normalized products matched to merchant_products (24.6%). Dashboard shows: `"Normalized IDs · 284 matched to Merchant"` in KPI card note. Unmatched products display with null/blank title, image, price and availability — no invented data.

## Remaining Risks
- 75.4% of products lack merchant title/image (no matched row in merchant_products)
- Merchant_products has 45,647 duplicate product_id rows — dedup required for accurate joins
- Browser screenshots not yet captured — Piranav must open in Chrome and confirm visual render
- All 6 campaigns currently below their target_roas — requires investigation in Google Ads UI
- 2 LIMITED campaigns — limiting reason must be investigated in Google Ads UI (no DB field)

## Git Status
Not committed. Not pushed. Not deployed.

## Next Action
1. Piranav opens `Staff-requirements/pages/sajeepan.html` in Chrome
2. Tests desktop (1440px), tablet, mobile (390px), campaign filter, product search, drawer, chart, empty state, console
3. Confirms all six campaign KPI cards display correctly
4. Captures screenshots as evidence
5. On approval → `git commit` + `git push` → Vercel auto-deploys
6. Share Vercel URL with Sajeepan
