# Handover: Promotion Automation Phase 1E

**Date:** 2026-10-15
**From:** Claude Code (Phase 1E executor)
**To:** Piranav (approver) + next Claude Code session (Phase 2 executor)
**Project:** DM Dashboard — Promotion Automation page
**Status:** PHASE 1E COMPLETE — D2 PARTIAL, D3 PARTIAL, reviews NOT FOUND

---

## What Was Done in Phase 1E

1. Searched ledsone-aios-knowledge-base for landed cost, gross margin, variable fees, reviews, return rate — all returned 0 results
2. Inspected ledsone PostgreSQL DB schema for cost, fee, review, return, refund, rating, margin columns across all schemas
3. Found `suppliers.invoices.unit_price` (FOB factory price) joinable to SKU via `order_items.final_container_id` — verified with live sample data
4. Found `accounting.amazon_order_expenses` with FBAPerUnitFulfillmentFee and Commission per seller_sku — verified
5. Found `business_reports.amz_sales_and_traffic_by_sku.refund_rate` per SKU — Amazon only, coverage uncertain
6. Confirmed NO review_count exists anywhere in the database (0 results on search)
7. Confirmed sub_source 38 = LEDSONEUK (Shopify UK channel)
8. Identified 7 specific questions Piranav must answer before Section A can be implemented

---

## D-Blocker Status After Phase 1E

| Blocker | Status | What Piranav Must Do |
|---|---|---|
| D2: Landed cost | PARTIAL | Answer Q1: Is FOB (`suppliers.invoices.unit_price`) the accepted cost basis? Answer Q2: If freight needed, what allocation method? Answer Q3: Currency of unit_price? |
| D2: Variable fees | PARTIAL | Confirm Amazon fee aggregation formula is acceptable. Decide if eBay/Shopify fees needed for Phase 1. |
| D3: Product reviews | NOT FOUND | Answer Q4: Where are reviews stored? SP-API? Trustpilot? Manual? |
| D3: Return rate | PARTIAL (Amazon) | Answer Q5: Is Amazon `refund_rate` acceptable for A4, or physical returns needed? Answer Q7: Confirm Amazon UK coverage improved post history load. |
| D3: Category benchmark | NOT FOUND (derivable) | Once Q5 and Q7 answered: can be derived. |
| D4a/D4b | OPEN | Approve fast mover discount ranges (unchanged from Phase 1D) |
| D5 | OPEN | Confirm Amazon-only for Phase 1, or define non-Amazon Section D points (unchanged) |

---

## Key Data Sources Found

| Data | Source | Verified |
|---|---|---|
| FOB unit cost per SKU | `ledsone.suppliers.invoices.unit_price` JOIN `order_items` ON `final_container_id` | YES — sample returned |
| Amazon FBA fee per SKU | `ledsone.accounting.amazon_order_expenses` WHERE charge_type = 'FBAPerUnitFulfillmentFee' | YES |
| Amazon referral fee per SKU | `ledsone.accounting.amazon_order_expenses` WHERE charge_type = 'Commission' | YES |
| Amazon refund rate per SKU | `ledsone.business_reports.amz_sales_and_traffic_by_sku.refund_rate` | YES (coverage uncertain) |
| Product reviews | NOT FOUND | NO |

---

## Phase 2 Scope Decision

Phase 2 CAN begin for: sections B/C(partial)/D(Amazon)/E, page scaffold, UAM registration, brief schema, monitoring framework, Section A stubs with manual override.

Phase 2 CANNOT complete Section A automation until Q1–Q7 answered.

**Recommended approach:** Start Phase 2 with known-good sections. Build Section A with manual_override flag on each metric — Piranav enters cost/fee/review data manually until automated sources are resolved.

---

## Files to Read Before Phase 2

| File | Why |
|---|---|
| `evidence/dm-dashboard/promotion-automation-phase1e-data-investigation-2026-10-15.md` | Full data source investigation + decision table |
| `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md` | Full extracted requirements matrix |
| `handover/piranav/promotion-automation-phase1c-handover-2026-10-15.md` | Implementation file list + UAM registration steps |
| `backend/app/dashboard_pages/dm_campaign.py` | Primary backend reference |
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Approval workflow reference |
| `backend/app/core/task_auth.py` | Auth helper |
