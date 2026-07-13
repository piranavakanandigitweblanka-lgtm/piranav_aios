# Sonya Req5 — Stop Waste Spend Closure

**Title:** Stop Waste Spend Tab — Closure Report
**Task:** sonya-requirement-5-stop-waste-spend
**Date:** 2026-07-13
**Member:** Piranav
**Team:** Google Ads Team
**Requirement Source:** GPT-approved Requirement 5 brief
**PostgreSQL Sources:** google_ads.campaign_performance, campaigns, asset_performance, campaign_search_term_data
**Files Changed:** Staff-requirements/pages/sonya.html
**Evidence:** req5_stop_waste_spend_evidence.md
**Validation:** req5_stop_waste_spend_validation.md
**Reviewer:** GPT

---

## Summary

Sonya Requirement 5 — Stop Waste Spend tab is implemented in sonya.html.

All 4 data columns are populated from verified PostgreSQL sources:
- 30/60/90 day campaign performance ✅
- Wasteful assets (17 found) ✅
- Negative keyword candidates (44 found) ✅
- Wasteful products (0 found at threshold — not invented) ✅
- Geo excludes (no DB source — shown as "No Data Available") ✅

## Deployment Status

**NOT deployed to Vercel.** Awaiting GPT approval.
**NOT git pushed.** Awaiting GPT approval.

## Known Risks

1. Wasteful products = 0. May need threshold review.
2. Geo performance table does not exist in ledsone-db.
3. Search term cost field is NULL — cannot apply £5 cost threshold.
4. 10 paused campaigns not shown (no 90d spend).

## Next Action

- GPT approves and instructs git push
- GPT confirms whether paused campaigns should also appear (with all-zero data)
- GPT confirms whether wasteful product thresholds should be relaxed

## PASS / FAIL: PASS
