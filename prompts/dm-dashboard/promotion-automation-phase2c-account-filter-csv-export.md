# Prompt: Promotion Automation Phase 2C — Account Filter, Unknown Fix, CSV Export

**Category:** dm-dashboard / promotion-automation
**Registered:** 2026-10-15
**Phase:** 2C
**Author:** Claude Code (Piranav AIOS)

---

## Purpose

Extend the Phase 2B Shopify eligibility engine with:
1. UK account-wise filtering (dropdown selector for verified Shopify UK stores)
2. Fix "Unknown" store name in results (root cause: missing sub_source JOIN)
3. Server-side CSV export endpoint with formula injection protection

---

## Prompt

```
You are implementing Phase 2C of Promotion Automation for the DM Dashboard (FastAPI + React 19).

Phase 2B delivered a GET /eligible-skus endpoint that scanned LEDSone UK (sub_source=104) SKUs.
Phase 2C adds three changes:

### Change 1 — UK Account Filter
- Build a `VERIFIED_UK_SHOPIFY_ACCOUNTS` dict in the backend router:
  - Key = sub_source_id (int), value = dict with name, store, company
  - Verified by querying order_management.sub_source WHERE source_id=3 (Shopify) — UK stores only
  - Do NOT infer accounts from SKU prefixes — only use DB-confirmed accounts
- Add GET /accounts endpoint returning the verified accounts list
- Update GET /eligible-skus to accept `account_id: int = 104` query param
  - Validate account_id against VERIFIED_UK_SHOPIFY_ACCOUNTS (400 if not found)
  - Pass account_id into all sub_source / sub_source_id queries
  - Include account_id, account_name, store in every result row

### Change 2 — Fix Unknown Store Name
- Root cause: eligible-skus queried listings.shopify_listings without joining order_management.sub_source
- Fix: JOIN order_management.sub_source ss ON ss.id = sl.sub_source in the main listing query
- Include ss.name AS store_name, ss.company AS store_company in SELECT
- If store_name IS NULL from DB: show "Unknown — mapping missing (sub_source=<id>)"
- NEVER infer store name from SKU prefix

### Change 3 — CSV Export
- Add GET /export/csv endpoint (same auth as eligible-skus)
- Same data-fetch logic as eligible-skus (reuse queries, do not call the endpoint internally)
- 25 columns: sku, title, product_type, selling_price, account_id, account_name, store,
  store_name, store_company, sales_90d, sales_30d, avg_monthly_sales, current_stock, mos,
  days_cover, velocity_class, hard_reject, hard_reject_reason, section_a_status,
  score_is_executable, discount_range, discount_status, discount_note, warning_count, scanned_at
- Formula injection protection: prefix cells starting with =, +, -, @, \t, \r with single quote
- UTF-8 BOM (﻿) prepended for Excel compatibility
- Descriptive filename in Content-Disposition: promotion_eligible_skus_{store}_{YYYYMMDD_HHMMSS}.csv
- StreamingResponse from fastapi.responses

### Frontend (React)
- EligibleSkusPanel: load accounts from GET /accounts on mount via useEffect
- Account dropdown <select> that triggers loadSkus(aid) on change — resets results before fetch
- Pass account_id=<selected> query param to eligible-skus and export/csv
- Export CSV button (visible only when loaded=true) calls window.open(csv_url, '_blank')
- Results summary line: show account_name and scanned_at from response meta
- Table: add Store column showing store_name; if value starts with "Unknown" show in red

### Safety rules (never violate)
- Section A must remain BLOCKED_MISSING_DATA always
- score_is_executable must never be True
- No Shopify price changes, discount creation, or inventory modifications
- Account filter is NOT a security boundary — backend validates account_id on every request
- No hardcoded secrets, no n8n, no new services
```

---

## Expected Output

- `VERIFIED_UK_SHOPIFY_ACCOUNTS` dict with 3 verified UK accounts (104, 109, 112)
- GET /accounts — returns accounts list + default_account_id
- GET /eligible-skus?account_id=104 — returns store_name from DB JOIN (no Unknown for mapped stores)
- GET /export/csv?account_id=104 — returns downloadable CSV, UTF-8 BOM, formula-safe
- Frontend: account dropdown, Export CSV button, account name in results summary, Store column

## Verification

- python -m py_compile promotion_automation.py → OK
- npm run build → ✓ no errors
- pytest tests/test_promotion_automation.py → 22 passed (10 new Phase 2C tests added)
- Full suite → 141 passed, 0 failures
