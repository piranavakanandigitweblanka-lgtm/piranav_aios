# Evidence: Promotion Automation Phase 2B — Shopify Eligibility Engine

**Date:** 2026-10-15
**Phase:** 2B — Shopify-only SKU Eligibility Scoring Engine
**Branch:** piranv-work
**Base commit:** 957c79b (Phase 2A)
**Status:** IMPLEMENTED — syntax OK, 12 tests pass, build clean. Uncommitted — await Piranav commit instruction.

---

## Data Source Verification (carried forward from Phase 2B pre-work)

| Source | Verified Value | Method |
|---|---|---|
| Shopify UK sub_source_id | **104** (name="ledsone") | Queried order counts across all sub_sources — 68,343 orders, latest 2026-10-15 |
| Orders date column | `order_date` | Confirmed by live query — `created_at` returns zero results |
| real_qty type | VARCHAR | Requires `~ '^[0-9]+$'` regex guard before CAST |
| Stock join | `inventory.products p JOIN physical_product_stock pps ON pps.inventory = p.id` | Confirmed |
| Listings | `listings.shopify_listings` columns: sku, title, price, product_type, status, sub_source | Confirmed |
| Cost data | UNAVAILABLE — suppliers.invoices joins via final_container_id, no SKU column | Confirmed |
| Shopify channel name | "LEDSone" | Confirmed from shopify_listings where sub_source=104 |

---

## Files Modified

### `backend/app/dashboard_pages/promotion_automation.py`

**Added helpers:**
- `_classify_velocity(mos)` — fast (≤3), medium (3<MOS≤8), low (>8), UNKNOWN
- `_discount_recommendation(velocity, mos)` — returns range/status/note; fast=CONFLICT_UNRESOLVED, medium/low=APPROVED
- `_INTENT_BLOCKER_MAP` — maps each valid intent to allowed blocker keywords (Section B2)
- `_get_shopify_snapshot(sku, business_conn)` — shared snapshot logic used by both snapshot and evaluate endpoints

**Added endpoints (4):**

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/sku/{sku}/snapshot` | GET | require_any_login | Sales 30/60/90d + stock + MOS + velocity + discount rec |
| `/sku/{sku}/evaluate` | POST | require_any_login | Full B/C/D/E scoring for a brief. Section A always BLOCKED. |
| `/eligible-skus` | GET | require_any_login | Batch scan all active Shopify UK SKUs with ranking |
| `/seed-exclusions` | POST | admin only | Seed CO/CH/RO/FG/SN/YB/GB suffix + PLAD prefix exclusions |

**Cool-off enforcement (added in Phase 2B pre-work):**
- `POST /briefs`: pre-check for killed briefs within 30 days (409 COOL_OFF_ACTIVE)

**Kill conditions (added in Phase 2B pre-work):**
- `POST /monitoring/{brief_id}`: 5 kill conditions evaluated on every monitoring record

### `frontend/src/admin/pages/PromotionAutomation.jsx`

**Added:**
- `VELOCITY_COLORS` lookup (fast=green, medium=blue, low=orange, UNKNOWN=grey)
- `EligibleSkusPanel` component — lazy load SKUs via GET /eligible-skus, seed exclusions via POST /seed-exclusions
- "Eligible SKUs" tab entry added to tabs array

**Tab order:** Briefs | Eligible SKUs | SKU Exclusions | Policy Flags

### `backend/tests/test_promotion_automation.py` (NEW)

12 unit tests — all pure, no DB, no HTTP:
- T01: sub_source_id == 104
- T02: velocity fast (MOS ≤ 3)
- T03: velocity medium (3 < MOS ≤ 8)
- T04: velocity low (MOS > 8)
- T05: velocity UNKNOWN (MOS is None)
- T06: discount low mover → APPROVED 15-30%
- T07: discount medium mover → APPROVED with range
- T08: discount fast mover → CONFLICT_UNRESOLVED, range=None
- T09: discount unknown velocity → UNKNOWN
- T10: exclusion suffix set matches policy (CO/CH/RO/FG/SN/YB/GB)
- T11: PLAD in exclusion prefix set
- T12: intent-blocker map covers all 5 valid intents

---

## Test Results

```
12 passed in 1.06s  (test_promotion_automation.py)
131 passed, 2 warnings  (full suite — was 119, +12 new)
```

---

## Build Results

```
Frontend build: ✓ built in 859ms — no errors, no warnings
Python syntax: python -m py_compile promotion_automation.py → SYNTAX OK
```

---

## Section A Gate — Confirmation

- All 4 new endpoints return `financial_section_a.status = "BLOCKED_MISSING_DATA"` or `score_a_status = "BLOCKED_MISSING_DATA"`
- `score_is_executable` is always `False` in all responses
- `cost_source` always `"UNAVAILABLE"` — no cost value ever returned from DB
- EligibleSkusPanel always shows Section A blocked warning banner

---

## Scoring Summary (Phase 2B Shopify)

| Section | Max Pts | Phase 2B Status |
|---|---|---|
| A — Financial | 30 | BLOCKED_MISSING_DATA (Q1-Q7 unresolved) |
| B — Strategic | 20 | IMPLEMENTED (B1/B2/B3) |
| C — SKU Readiness | 20 | PARTIAL — C4 (6pts) only; C1/C2/C3 blocked |
| D — Shopify | 15 | PROPOSED (D1/D2/D3) — not in policy doc |
| E — Control | 15 | IMPLEMENTED (E1/E2/E3/E4) |

Provisional max (excl Section A) = 70pts

---

## Pending Before Phase 2C

Piranav must answer Q1–Q7 to unblock Section A:

| Q | Question |
|---|---|
| Q1 | Is `suppliers.invoices.unit_price` (FOB) accepted as cost basis? |
| Q2 | Freight/duty allocation method? |
| Q3 | Currency + exchange rate policy? |
| Q4 | Review source (SP-API / Trustpilot / manual)? |
| Q5 | Amazon refund_rate acceptable for A4? |
| Q6 | Amazon-only or multi-channel scope for Section A? |
| Q7 | Amazon UK (sub_source=8) data coverage gap resolved? |

Also resolve: D4a (fast mover 5-8 MOS), D4b (fast mover >8 MOS), D5 (non-Amazon Section D points)
