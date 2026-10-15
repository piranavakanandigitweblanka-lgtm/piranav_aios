# Validation: Promotion Automation Phase 2B — Shopify Eligibility Engine

**Date:** 2026-10-15
**Phase:** 2B
**Branch:** piranv-work
**Base commit:** 957c79b

---

## Syntax Checks

| Check | Command | Result |
|---|---|---|
| promotion_automation.py | `python -m py_compile app/dashboard_pages/promotion_automation.py` | PASS |
| Frontend build | `npm run build` | PASS — ✓ built in 859ms, no errors, no warnings |

---

## Test Results

| Suite | Command | Result |
|---|---|---|
| Phase 2B unit tests | `pytest tests/test_promotion_automation.py -v` | 12/12 PASS |
| Full suite regression | `pytest --tb=short -q` | 131 passed, 2 warnings (pre-existing deprecation, unrelated) |

Test count delta: 119 (Phase 2A) → 131 (Phase 2B) = +12 new tests, 0 regressions.

---

## Financial Gate Validation

| Check | Result |
|---|---|
| GET /snapshot returns `financial_section_a.status = "BLOCKED_MISSING_DATA"` | PASS — hardcoded in `_get_shopify_snapshot` |
| POST /evaluate returns `score_is_executable = False` | PASS — hardcoded, no code path sets True |
| POST /evaluate returns `financial_eligibility_status = "BLOCKED_MISSING_DATA"` | PASS — hardcoded |
| GET /eligible-skus returns `financial_section_a = "BLOCKED_MISSING_DATA"` | PASS — hardcoded in response |
| cost_source always "UNAVAILABLE" (no fabricated cost values) | PASS — confirmed by code read |
| Section A score never computed | PASS — score_a = 0, status always BLOCKED_MISSING_DATA |

---

## Data Source Validation

| Check | Result |
|---|---|
| sub_source_id = 104 (not 131, 110, 234, or 256) | PASS — confirmed T01 test + Phase 2B pre-work query |
| order_date used (not created_at) | PASS — confirmed in SQL |
| real_qty regex guard before CAST | PASS — `oi.real_qty ~ '^[0-9]+$'` in all queries |
| Stock join via physical_product_stock | PASS — confirmed in code |
| Cost marked UNAVAILABLE (no SKU column in suppliers.invoices) | PASS — warning added |

---

## NOT TESTED (requires live environment)

- API endpoint HTTP responses (requires running FastAPI + business DB)
- DB snapshot table writes (requires live DB)
- Seed exclusions API (requires live DB)
- Eligible SKUs page render in browser
- Velocity colour display in table

---

## Overall Result

PASS (syntax + tests + build) — runtime validation requires live environment.

All financial gates confirmed by code review — Section A cannot be computed, score_is_executable cannot be set True.
