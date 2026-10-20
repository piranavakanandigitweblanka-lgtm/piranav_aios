# Handover: Promotion Automation Step 1 Audit

**Date:** 2026-10-15
**From:** Claude Code (Step 1 audit)
**To:** Next session (Phase 2B implementation) + Piranav (decisions)

## Current State

Phase 2A is committed and pushed (957c79b). Page exists, financial gates are FAIL-CLOSED, 15/48 requirements are fully implemented.

## Phase 2B Can Begin Immediately

19 requirements are buildable with existing data — no business decisions needed.

### Exact Phase 2B scope (promotion_automation.py — main file):

1. **GET /sku/{sku}/snapshot** — query business DB: 90d sales (order_item_info + orders), inventory (physical_product_stock + inventory.products), MOS = stock / (units_90d / 3), days_cover = stock / (units_90d / 90), Amazon FBA avg fee (accounting.amazon_order_expenses), AOV (revenue_90d / order_count_90d)

2. **score_brief(brief_id)** — calculate sections B/C/D/E from brief fields + snapshot:
   - B1: already enforced (1 intent) → 8pts
   - B2: intent in allowed blockers for channel → 6pts (use intent-blocker table from policy)
   - B3: kpi_targets has day14 AND day30 defined → 6pts
   - C1: price_elasticity_signal in kpi_targets → 6pts (manual flag for now)
   - C3: listing_quality in kpi_targets ≥ 80 → 4pts (manual input)
   - C4: days_cover ≥ 45 → 6pts (from snapshot)
   - D (Amazon only): keywords ≥ 3 → 5pts (amazon_listing_search_engine_keywords JOIN amazon_listings); AOV ≥ 20 → 4pts (from snapshot); PPC active manual flag → 6pts
   - E1: spend_ceiling not null → 5pts; E2: kpi_targets has day14+day30 → 4pts; E3: kill_conditions not empty → 4pts; E4: owner_staff_key not empty → 2pts
   - Section A: stays BLOCKED_MISSING_DATA (0pts, gate status = pending)
   - overall_score = FLOOR(B+C+D+E) displayed as "PARTIAL — Section A pending"
   - Store result in score_sections JSONB

3. **Velocity classification + discount recommendation:**
   - MOS < 2 = Low mover → 15-30% range
   - MOS 2-8 = Medium mover → 0-8% (5-8 MOS) or 10-18% (>8 MOS)
   - MOS > 8 fast mover → CONFLICT_UNRESOLVED (show policy flag)

4. **Auto-exclusion seeder** — on startup call, scan shopify_listings for SKUs matching:
   - ends with CO, CH, RO, FG, SN, YB, GB AND sku has combo indicator → insert as permanent exclusion
   - starts with PLAD AND combo indicator → insert as permanent exclusion
   NOTE: confirm "combo SKU" definition with Piranav before implementation

5. **POST /briefs cool-off check** — before allowing new brief: check if SKU has killed brief where killed_at > NOW() - INTERVAL '30 days' → return 422 with cool-off expiry date

6. **Kill condition auto-evaluation in POST /monitoring/{brief_id}** — after storing monitoring record, check: kpi_met=false AND check_day=14 → set kill_triggered=true, update brief to 'killed'

7. **Override framework** — add override_class field to ApprovalAction, validate against 4 classes, set override_expires_at = NOW() + 30 days in promotion_approvals

## Piranav Must Decide Before Phase 2C

| Q | Decision |
|---|---|
| Q1-Q3 | Cost basis: FOB only? Include freight? Currency? |
| Q4 | Review source: SP-API? Manual? |
| Q5 | Amazon refund_rate for A4? |
| Q6 | Amazon-only scope for Section A? |
| Q7 | **CRITICAL:** Amazon UK refund data is ONLY Jan 2026 (1,653 rows). Must reload from SP-API. |
| D4a/D4b | Fast mover discount conflict resolution |
| D5 | Non-Amazon Section D point allocations |
| NEW | Listing quality score source |
| NEW | "Combo SKU" definition for auto-exclusion seeder |

## Files to Modify in Phase 2B
- `backend/app/dashboard_pages/promotion_automation.py` — main scoring logic + new endpoints
- `backend/app/dashboard_pages/promotion_automation_db.py` — minor: add score_reasoning column to promotion_briefs (optional)
- `frontend/src/admin/pages/PromotionAutomation.jsx` — add SKU score display, MOS/velocity/discount recommendation
