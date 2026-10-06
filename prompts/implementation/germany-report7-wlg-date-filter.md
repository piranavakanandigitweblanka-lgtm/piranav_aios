# Prompt: Germany Report 7 — WLG SKU Sales Date Filter

**Category:** implementation
**Created:** 2026-09-30
**Project:** Staff-requirements-02 / Germany Sales Decline Dashboard
**Status:** Active

---

## What to Build

Add a date range filter to Report 7 (WLG SKU Germany Sales History) in the Germany Sales Decline dashboard.

**Files to change:**
1. `dm-dashboard/backend/app/germany_sales_decline.py` — function `report_wlg_sales`
2. `dm-dashboard/frontend/src/admin/pages/GermanySalesDecline.jsx` — component `WlgSalesReport`

---

## Backend Changes (`intel-api.js` → `handleWlgSales`)

- Accept optional `from` and `to` query params (format: `YYYY-MM-DD`)
- If `from` provided: add `AND o.order_date >= $N` to the WHERE clause
- If `to` provided: add `AND o.order_date < $N` to the WHERE clause
- Return `date_range: { from, to }` in response JSON for frontend display
- Default: no filter (all-time) when params not provided

SQL pattern:
```sql
WHERE o.market_place = '10'
  AND o.status NOT IN ('CANCELLED','REFUNDED')
  AND ii.real_sku IN (${placeholders})
  [AND o.order_date >= $from_param]
  [AND o.order_date < $to_param]
```

---

## Frontend Changes (`report-7-wlg-sku-sales.html`)

- Add date filter bar above the table with:
  - Year pills: **All Time** | **2025** | **2026** (active pill = navy)
  - Custom range: two `<input type="month">` fields (From / To) + Apply button
- When year pill clicked: set `from=YYYY-01-01&to=YYYY+1-01-01` in API call
- When custom range applied: set `from` / `to` from month inputs (first day of from-month, first day of month after to-month)
- "All Time" clears both params
- Update the `tbar` to show active date range: e.g. "Showing: Jan 2026 – Sep 2026"
- API URL pattern: `/api/intel-api?service=germany&type=wlg-sales&from=2026-01-01&to=2026-10-01`
- On filter change: immediately re-fetch (do not wait for 5s poll)

---

## Key Technical Constraints

- WLG_SKUS hardcoded array of 19 SKUs stays unchanged
- Existing channel/search/SKU filters must still work after date filter applied
- `$N` placeholder numbering: WLG_SKUS use `$1`–`$19`, so `from` = `$20`, `to` = `$21`
- Use `pg` parameterized queries — no string interpolation for date values

---

## Expected Output

- Date pills render cleanly above the filter row
- Selecting "2026" shows only 2026 orders; "2025" shows 0 rows (data starts Jun 2026)
- tbar shows active range
- CSV export includes date range in filename: `wlg-sku-germany-sales-2026.csv`
