# Validation: Promotion Automation Phase 2C

**Date:** 2026-10-15
**Phase:** 2C — Account filter, Unknown fix, CSV export
**Branch:** piranv-work

---

## Syntax + Build

| Check | Command | Result |
|---|---|---|
| Backend syntax | `python -m py_compile app/dashboard_pages/promotion_automation.py` | PASS |
| Frontend build | `npm run build` | PASS — ✓ 804ms, no errors |

---

## Tests

| Suite | Result |
|---|---|
| Phase 2C tests only (T13–T22) | 10 new tests, all PASS |
| Phase 2B + 2C together | 22 passed |
| Full suite | 141 passed, 2 pre-existing deprecation warnings, 0 failures |

---

## Validation Checklist

| Check | Status | Notes |
|---|---|---|
| VERIFIED_UK_SHOPIFY_ACCOUNTS contains 104, 109, 112 | PASS | T13 confirms names + IDs |
| Default account = 104 (LEDSone UK) | PASS | T14 |
| DE/FR/US accounts excluded (108, 233, 245) | PASS | T15 |
| GET /accounts endpoint added | PASS | Code review — returns list + default_account_id |
| eligible-skus validates account_id server-side | PASS | Raises 400 for unknown account |
| eligible-skus JOINs sub_source for store_name | PASS | SQL confirmed in code: JOIN order_management.sub_source ss ON ss.id = sl.sub_source |
| Unknown fallback never infers from SKU | PASS | Fallback = "Unknown — mapping missing (sub_source=<id>)" |
| CSV columns = 25 | PASS | T20 |
| CSV has discount_range/status/note (flat, not nested) | PASS | T22 |
| CSV store fields (account_id, account_name, store, store_name, store_company) | PASS | T21 |
| _csv_safe protects = + - @ prefixes | PASS | T16, T17 |
| _csv_safe passes normal values unchanged | PASS | T18 |
| _csv_safe None → empty string | PASS | T19 |
| UTF-8 BOM prepended in CSV output | PASS | Code review — output.write("﻿") |
| StreamingResponse used (no temp file) | PASS | Code review |
| Content-Disposition header with descriptive filename | PASS | Code review |
| Section A = BLOCKED_MISSING_DATA in export/csv | PASS | Hardcoded in rows_data loop |
| score_is_executable = False in export/csv | PASS | Hardcoded in rows_data loop |
| Frontend: accounts loaded via useEffect on mount | PASS | Code review |
| Frontend: account dropdown triggers loadSkus(aid) | PASS | handleAccountChange resets + reloads |
| Frontend: Export CSV button window.open | PASS | Code review |
| Frontend: Store column in results table | PASS | storeDisplay logic + red on Unknown |
| Frontend: account_name + scanned_at in summary | PASS | scanMeta state used |

---

## NOT TESTED (requires live environment)

- Actual API responses from running FastAPI server
- Browser rendering of account dropdown
- CSV download in browser
- Store name resolving correctly for all 3 accounts

---

## Overall Result

**PASS** — All unit tests pass, syntax clean, build clean, all safety invariants confirmed.
Runtime verification required in live environment.
