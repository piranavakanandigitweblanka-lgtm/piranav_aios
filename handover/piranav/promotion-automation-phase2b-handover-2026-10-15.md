# Handover: Promotion Automation Phase 2B — Shopify Eligibility Engine

**Date:** 2026-10-15
**From:** Claude Code (Phase 2B executor)
**To:** Piranav (commit/push) + next Claude Code session (Phase 2C executor)
**Status:** PHASE 2B COMPLETE — all checks pass — UNCOMMITTED — awaiting Piranav commit instruction

---

## What Was Built in Phase 2B

### Backend — `promotion_automation.py`

4 new endpoints added (all safe — no live writes, no promotion execution):

| Endpoint | What It Does |
|---|---|
| `GET /sku/{sku}/snapshot` | Returns 30/60/90d sales, stock, MOS, days_cover, velocity, discount rec for one SKU |
| `POST /sku/{sku}/evaluate` | Scores a brief against Sections B/C/D/E. Section A always BLOCKED. |
| `GET /eligible-skus` | Batch scans all active Shopify UK SKUs, returns ranked list with velocity and hard-reject flags |
| `POST /seed-exclusions` | Seeds CO/CH/RO/FG/SN/YB/GB suffix + PLAD prefix exclusions (admin only, idempotent) |

Also added in this phase session:
- `POST /briefs`: 30-day cool-off check (409 COOL_OFF_ACTIVE if killed brief exists within 30 days)
- `POST /monitoring/{brief_id}`: 5 auto-kill conditions (net_contribution, KPI misses, days_cover, spend_ceiling, kill_flag)

### Frontend — `PromotionAutomation.jsx`

- Added "Eligible SKUs" tab (tab 2 of 4)
- `EligibleSkusPanel` component: lazy-load table of all active Shopify UK SKUs with velocity and discount columns
- Seed Exclusions button triggers `POST /seed-exclusions`
- Section A blocked warning always visible in the panel

### Tests — `backend/tests/test_promotion_automation.py` (NEW)

12 unit tests. 131 total pass (was 119). Zero regressions.

---

## Commit Required

**Files to commit (all uncommitted):**

| File | Change |
|---|---|
| `backend/app/dashboard_pages/promotion_automation.py` | MODIFIED — +4 endpoints, cool-off, kill conditions, helpers |
| `frontend/src/admin/pages/PromotionAutomation.jsx` | MODIFIED — Eligible SKUs tab + EligibleSkusPanel |
| `backend/tests/test_promotion_automation.py` | NEW — 12 unit tests |
| `prompts/dm-dashboard/promotion-automation-phase2b-shopify-eligibility.md` | NEW |
| `evidence/dm-dashboard/promotion-automation-phase2b-shopify-eligibility-2026-10-15.md` | NEW |
| `validation/piranav/promotion-automation-phase2b-validation-2026-10-15.md` | NEW |
| `handover/piranav/promotion-automation-phase2b-handover-2026-10-15.md` | NEW |
| `PROMPT_REGISTER.md` | MODIFIED |
| `closure/README.md` | MODIFIED |

**Push:** select **websitetecteam-arch** account for dm-dashboard files, **piranavakanandigitweblanka-lgtm** for AIOS docs.

---

## What Is Still BLOCKED

Section A (Financial, 30pts) cannot be implemented until Piranav answers:

| Q | Question | Blocks |
|---|---|---|
| Q1 | Is suppliers.invoices.unit_price (FOB) accepted as cost basis? | A1/A2/A3 |
| Q2 | Freight/duty allocation method? | A1/A2/A3 |
| Q3 | Currency + exchange rate policy? | A1/A2/A3 |
| Q4 | Review source (SP-API / Trustpilot / manual)? | C2 |
| Q5 | Amazon refund_rate acceptable for A4? | A4 |
| Q6 | Amazon-only or multi-channel scope for Section A? | Phase 2C scope |
| Q7 | Amazon UK (sub_source=8) data coverage gap resolved? | A4 viability |

And policy conflicts: D4a (fast 5-8 MOS), D4b (fast >8 MOS), D5 (non-Amazon Section D).

---

## Phase 2C Scope (when Q1–Q7 answered)

1. Add Section A scoring (A1 net contribution, A2 gross margin, A3 cost stability, A4 return rate)
2. Update `score_is_executable` to allow True when Section A passes
3. Resolve D4a/D4b fast mover discount ranges
4. Add Amazon UK eligibility (sub_source=8 per `dm_campaign.py`)
