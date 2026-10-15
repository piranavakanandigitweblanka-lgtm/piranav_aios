# Evidence: Promotion Automation Phase 2C — Account Filter, Unknown Fix, CSV Export

**Date:** 2026-10-15
**Phase:** 2C
**Branch:** piranv-work
**HEAD before:** 76053b3 (Phase 2B commit)
**Status:** IMPLEMENTED — pending commit + push

---

## DB Investigation Results (Action 2A-2H)

Query run: `SELECT id, source_id, name, company FROM order_management.sub_source WHERE source_id=3 AND ... ORDER BY order_count DESC`

### Verified UK Shopify Accounts (source_id=3, active UK orders in last 90 days)

| sub_source_id | name | company | Orders (90d) | Decision |
|---|---|---|---|---|
| 104 | ledsone | LEDSone | 10,416 | ✅ LEDSone UK — included |
| 109 | vintage-light-web | Vintagelite | 93 | ✅ VintageLite UK — included |
| 112 | electricalsoneuk | Electricalsone | 124 | ✅ Electricalsone UK — included |
| 108 | ledsone-de | LEDSone DE | 2,802 | ❌ German — excluded |
| 233 | jedsz8-km | LED Sone FR | 334 | ❌ French — excluded |
| 245 | ledsone-us | LEDSone US | 51 | ❌ US — excluded |
| 248 | dcvoltage-2 | dcvoltage | 105 | ❌ Not in Phase 2C scope |

---

## Files Changed

### Backend: `backend/app/dashboard_pages/promotion_automation.py`

1. **New imports:** `csv`, `io` added to module top; `Query` and `StreamingResponse` from fastapi
2. **`VERIFIED_UK_SHOPIFY_ACCOUNTS` dict** replacing single `_SHOPIFY_UK_SUB_SOURCE_ID` for multi-account support
   - `_SHOPIFY_UK_SUB_SOURCE_ID = 104` kept for backward compat (snapshot, seed-exclusions endpoints)
3. **GET /accounts** — new endpoint returning verified accounts list + default_account_id
4. **GET /eligible-skus** — updated:
   - Added `account_id: int = Query(default=104)` param
   - Validates against `VERIFIED_UK_SHOPIFY_ACCOUNTS` (400 on unknown account)
   - Main listing query now JOINs `order_management.sub_source` to get `store_name`, `store_company`
   - All `_SHOPIFY_UK_SUB_SOURCE_ID` references replaced with `account_id` param
   - Response rows now include: `account_id`, `account_name`, `store`, `store_name`, `store_company`
   - Unknown fallback: `"Unknown — mapping missing (sub_source=<id>)"` — never inferred from SKU
5. **GET /export/csv** — new endpoint:
   - Same auth (make_admin_task_auth)
   - Same data-fetch queries as eligible-skus (not a redirect — queries run directly)
   - `_csv_safe()` helper for formula injection protection (=, +, -, @, \t, \r prefix → prepend ')
   - `_CSV_COLUMNS` list (25 columns)
   - UTF-8 BOM (﻿) prepended
   - Content-Disposition: `attachment; filename="promotion_eligible_skus_{store}_{timestamp}.csv"`
   - StreamingResponse — no temp file on disk

### Frontend: `frontend/src/admin/pages/PromotionAutomation.jsx`

**EligibleSkusPanel changes:**
1. New state: `accounts`, `accountId` (default 104), `scanMeta`
2. `useEffect` on mount: loads GET /accounts and populates dropdown
3. Account `<select>` dropdown — triggers `loadSkus(aid)` on change, resets skus/loaded/scanMeta
4. `loadSkus(aid)` now passes `account_id=<aid>` to eligible-skus; stores response meta in `scanMeta`
5. Export CSV button — visible when `loaded=true`; calls `window.open(BASE/export/csv?account_id=...)` in new tab
6. Results summary: shows `account_name` and `scanned_at` from `scanMeta`
7. Table: new Store column; unknown store_names rendered in red with "Unknown — mapping missing"

### Tests: `backend/tests/test_promotion_automation.py`

10 new Phase 2C tests (T13–T22):
- T13: VERIFIED_UK_SHOPIFY_ACCOUNTS content (104, 109, 112 + names)
- T14: Default account ID is 104 (LEDSone UK)
- T15: No non-UK accounts in verified dict (108, 233, 245 absent)
- T16–T19: `_csv_safe()` — formula injection, normal values, None
- T20: CSV columns count = 25
- T21: CSV columns include store resolution fields
- T22: CSV columns include flat discount fields (not nested dict)

---

## Syntax + Build + Test Results

| Check | Result |
|---|---|
| `python -m py_compile promotion_automation.py` | PASS — SYNTAX OK |
| `npm run build` | PASS — ✓ built in 804ms, no errors |
| `pytest test_promotion_automation.py` | PASS — 22 passed (12 Phase 2B + 10 Phase 2C) |
| Full suite (`pytest -q`) | PASS — 141 passed, 2 pre-existing deprecation warnings |

---

## Safety Confirmations

- Section A: `section_a_status = "BLOCKED_MISSING_DATA"` hardcoded in both eligible-skus and export/csv — no change
- `score_is_executable = False` hardcoded — no change
- Account filter validated on backend (400 on unknown account_id) — not just a frontend selector
- No Shopify writes, no price changes, no discount creation
- No new services, no n8n
- CSV formula injection protection applied via `_csv_safe()` on all cell values
