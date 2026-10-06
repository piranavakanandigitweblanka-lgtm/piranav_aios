# Evidence — WLG SKU Sales Date Filter

**Evidence ID:** wlg-date-filter-2026-09-30
**Date:** 2026-09-30
**Project:** dm-dashboard — Germany Sales Decline → Tab 7 WLG SKU Sales
**Commit:** `083020b` on websitetecteam-arch/dm-dashboard piranv-work

---

## What Was Built

Date filter added to the WLG SKU Sales tab (Report 7) in GermanySalesDecline.jsx.

**Backend change:** `backend/app/germany_sales_decline.py`
- `report_wlg_sales()` now accepts `from_date` and `to_date` optional query params
- Injected as parameterized SQL WHERE clauses: `AND o.order_date >= %s` / `AND o.order_date < %s`
- Default: no filter (all-time) when params absent

**Frontend change:** `frontend/src/admin/pages/GermanySalesDecline.jsx`
- Added `YEAR_PILLS` constant: All Time | 2025 | 2026 | Custom
- Added state: `yearPill`, `customFrom`, `customTo`, `appliedFrom`, `appliedTo`, `loading`
- `fetchData(from, to)` — builds URL with query params, re-fetches data
- `selectYear(key)` — maps year pills to date ranges
- `applyCustom()` — converts month inputs to day-level date params
- Date filter bar rendered above channel filter bar
- Active range label shown (e.g. "2026-01 → 2026-10")
- Loading indicator during refetch

## Data Verification

DB query run manually before build confirmed:
- 33 rows across 13 active SKUs (6 zero-sales)
- Data range: Jun 2026 – Sep 2026
- Query logic matches backend exactly — **data confirmed correct**

## Build Result

`npm run build` — ✓ 1.87s, zero errors

## Files Changed

| File | Change |
|---|---|
| `backend/app/germany_sales_decline.py` | +13 lines — date params + SQL injection |
| `frontend/src/admin/pages/GermanySalesDecline.jsx` | +74 lines — date filter UI + state + fetch logic |
