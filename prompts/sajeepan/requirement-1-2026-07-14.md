# Sajeepan Requirement 1 — Prompt Record
**Date:** 2026-07-14 | **Staff:** Sajeepan | **AIOS:** Piranav

## Original Prompt Summary
Build Sajeepan Requirement 1 — a full Google Ads PMax Product Intelligence Dashboard in `Staff-requirements/pages/sajeepan.html` using only the 6 approved PMax campaign IDs. Do not create another HTML page. Dashboard must be modern, responsive, professional. Data sourced read-only from ledsone-db-mcp PostgreSQL.

## Corrections Applied (Review Round)
1. Product counts corrected: raw rows ≠ product count. Distinct normalized IDs used.
2. Two missing product titles resolved from merchant_products (no invented placeholders).
3. Profitability relabelled: "Ad Contribution = Conv Value − Ad Cost". Profit not shown (COGS unverified).
4. ROAS standardized: percentage format only (Conv Value ÷ Cost × 100). No `x` multiplier used.
5. LIMITED status: "Delivery LIMITED — limiting reason not available in verified source". No assumed cause.
6. Seven AIOS files confirmed and completed.

## Campaign Whitelist (6 IDs only)
- 21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265
