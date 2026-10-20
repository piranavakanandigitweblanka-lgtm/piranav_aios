# Handover: Promotion Automation Phase 1D

**Date:** 2026-10-15
**From:** Claude Code (Phase 1D executor)
**To:** Piranav (approver) + next Claude Code session (Phase 2 executor)
**Project:** DM Dashboard — Promotion Automation page
**Status:** PHASE 1D COMPLETE — D1 resolved, D2/D3/D4 still open

---

## What Was Done in Phase 1D

1. Located and extracted `Nishani_Promotion_Multi_Channel.docx` (395 paragraphs) from `C:\Users\PC\Downloads\`
2. Extracted all 8 requirement categories — scoring, intents, financial, readiness, platforms, discounts, monitoring, governance
3. Identified and documented the discount range conflict between Step 8 and Summary sections
4. Re-verified landed cost, reviews/return rate, net contribution gaps in backend post-merge — all still NOT FOUND
5. Produced 19-item rules-ready list and 8-item rules-blocked list

---

## Blocker Status

| # | Blocker | Status | What Piranav Must Do |
|---|---|---|---|
| D1 | Policy doc not found | **RESOLVED** | Nothing — done |
| D2 | Landed cost / variable fee source | **OPEN** | Identify where LEDSone landed cost is stored (ERP, Linnworks, spreadsheet, or separate DB) |
| D3 | Reviews / return rate source | **OPEN** | Identify source (Amazon SP-API, eBay API, Trustpilot, or manual) |
| D4a | Fast mover 5–8 MOS: 0–8% vs 0% | **OPEN** | Approve one version — affects discount generation for fast movers |
| D4b | Fast mover >8 MOS: 5–12% vs 5–8% | **OPEN** | Approve one version — affects discount generation for fast movers |
| D5 | Section D Platform Fit non-Amazon points | **OPEN** | Define point allocations for eBay, Shopify, Wayfair or confirm Amazon-only for Phase 1 |

---

## What Phase 2 Can Begin With (D2/D3/D4 still open)

These 19 rules are fully specifiable NOW:

**Score engine (partial — Sections B, C partial, D Amazon, E):**
- Section B (all 3 metrics: intent check, blocker alignment, payback defined)
- Section C: C1 (price elasticity), C3 (listing quality), C4 (stock cover)
- Section D (Amazon only): PPC support 6pts, Keywords 5pts, AOV 4pts
- Section E (all 4 metrics: spend ceiling, KPI targets, kill conditions, ownership)

**Hard reject gate:**
- Multiple intents → reject
- Spend ceiling missing → block
- Kill condition missing → block
- Stock cover < 45 days → reject
- Section A subtotal < 18 → reject (can enforce structure even without landed cost)

**Intent and brief:**
- 5 promotion intents (exact names)
- SKU brief schema (7 fields)
- One-intent-per-SKU DB constraint

**SKU exclusions:**
- Electroplated colour combo SKUs (CO/CH/RO/FG/SN/YB/GB)
- PLAD combo SKUs

**Discount logic (partial):**
- Low movers: 15–30% (unambiguous)
- Medium movers 5–8 MOS: 0–8% (unambiguous)
- Medium movers >8 MOS: 10–18% (unambiguous)
- Fast movers: BLOCKED pending D4

**Monitoring:**
- Day 7/14/30 checkpoint structure
- 5 auto-terminate triggers
- 30-day cool-off + re-entry conditions

**Governance:**
- Approval bands
- Override framework (4 exception classes, requirements, 30-day expiry)

---

## Section A Blocked Metrics (requires D2/D3)

These CANNOT be computed until Piranav resolves data sources:
- A1: post-promo net contribution = post-promo price − landed cost − variable fees ≥ £2
- A2: pre-promo gross margin ≥ 25%
- A3: landed cost variance ≤ ±5% (90d)
- A4: return rate (90d) ≤ category average
- C2: review base ≥ platform minimum

**Suggested Phase 2 approach:** Build Section A as stubs that accept manual input until data sources are confirmed. This unblocks the UI and approval workflow.

---

## Files to Read Before Phase 2

| File | Why |
|---|---|
| `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md` | Full extracted requirements matrix |
| `handover/piranav/promotion-automation-phase1c-handover-2026-10-15.md` | Implementation file list + UAM registration steps |
| `evidence/dm-dashboard/promotion-automation-phase1c-discovery-2026-10-15.md` | Verified file paths, patterns, code examples |
| `backend/app/dashboard_pages/dm_campaign.py` | Primary backend reference |
| `backend/app/admin/muguntha_budget_alerts.py` | Approval workflow reference |
| `backend/app/core/task_auth.py` | Auth helper reference |
