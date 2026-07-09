# Thivajini — Requirement 3 — Stock-Spend Tracker — Build Prompt
## Date: 2026-07-09
## Status: COMPLETE

**Title:** Requirement 3 — Stock-Spend Tracker Build
**Purpose:** Rule 12 permanent GPT prompt capture for Req 3 implementation
**Requirement Source:** Thivajini / Digital Marketing / Google Ads / PPC
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products are wasting Google Ads spend because they are out of stock or low stock?

## Build Specification (verbatim)

Update existing file only: Staff-requirements/pages/thivajini.html
Add Requirement 3 tab: Stock-Spend Tracker — All Products

Data sources:
- public.ppc_etl_performance_data (sub_source_id=233, last 30 days)
- public.google_merchant_products (merchant_id=5551466539)
- public.listing_data (sub_source=233)
- public.inv_final_stock (via SKU bridge)
NOT cppc_workbook_stock_spend_v1 (stale)

Business rules:
- STOP: Stock=0 AND 30d Spend>0 → Pause immediately
- ACT SOON: Stock≤5 AND 30d Spend>0 → Cut budget / restock
- MONITOR: Stock≤5 AND 30d Spend=0 → Watch
- OK: Stock>5 → No action needed
- Wasted Spend: Only STOP rows

Match methods:
- product_id match: ppc_etl.sku = gmp.product_id (direct)
- record_id match: LOWER(ppc_etl.record_id) = LOWER(gmp.product_id)
- missing mapping: no gmp record

## PostgreSQL Sources Checked
- public.ppc_etl_performance_data
- public.google_merchant_products
- public.listing_data
- public.ppc (campaign names)

## Files Created or Modified
- Staff-requirements/pages/thivajini.html — MODIFIED (panel-3 replaced, JS injected)
- evidence/Thivajini/requirement-3-data-mapping.md — CREATED
- evidence/Thivajini/requirement-3-build-evidence.md — CREATED
- validation/Thivajini/requirement-3-validation.md — CREATED
- handover/Thivajini/requirement-3-handover.md — CREATED
- reports/Thivajini/requirement-3-summary.md — CREATED
- vercel/Thivajini/requirement-3-deployment-notes.md — CREATED

## Evidence Location
evidence/Thivajini/requirement-3-build-evidence.md

## PASS / FAIL Result
PASS

## Owner / Reviewer
Owner: Thivajini | Reviewer: GPT / Piranav
