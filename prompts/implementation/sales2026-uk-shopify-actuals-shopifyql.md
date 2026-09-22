# Prompt: Sales2026 UK Shopify Actuals — Replace with ShopifyQL

## Task
Replace the current `/api/sales/uk-shopify-actuals` endpoint (raw GraphQL order fetch)
with ShopifyQL analytics data. Month is dynamic — matches the month selector on the page.

## ShopifyQL Query
```
FROM sales
SHOW gross_sales, discounts, sales_reversals, net_sales, shipping_charges,
  return_fees, taxes, total_sales
TIMESERIES day WITH TOTALS, CURRENCY 'GBP'
SINCE {YYYY-MM-01} UNTIL {YYYY-MM-last-day}
ORDER BY day ASC
LIMIT 1000
```

## Backend Changes — `sales.py`
- Replace `_build_uk_shopify_actuals_payload()` entirely
- Use `graphql(UK_STORE, ...)` with `shopifyqlQuery` — same pattern as `jefri.py:r6_fetch_shopify_sales_total()`
- Derive SINCE/UNTIL from `month` param (e.g. "2026-01" → SINCE 2026-01-01 UNTIL 2026-01-31)
- Parse `tableData.rows` — find the TOTALS row (day == null or "__totals__") for the summary card values
- Also return the daily rows array for potential future use
- Return shape:
  ```json
  {
    "success": true,
    "reportPeriod": { "month": "2026-01", "label": "Jan 2026", "since": "2026-01-01", "until": "2026-01-31" },
    "supportedMonths": [...],
    "isLive": true,
    "shopifyActuals": {
      "grossSales": 0.0,
      "discounts": 0.0,
      "salesReversals": 0.0,
      "netSales": 0.0,
      "shippingCharges": 0.0,
      "returnFees": 0.0,
      "taxes": 0.0,
      "totalSales": 0.0,
      "currency": "GBP"
    },
    "dailyRows": [...],
    "meta": { "generatedAt": "...", "rowsFetched": 0 }
  }
  ```

## Frontend Changes — `Sales2026.jsx`
- Update 6 KPI cards to use new fields:
  1. Gross Sales → `grossSales`
  2. Total Refunds / Reversals → `salesReversals` (label: "Sales Reversals")
  3. Net Sales → `netSales`
  4. Shipping → `shippingCharges` (new, was Orders before — replace Orders card)
  5. Discounts → `discounts`
  6. Total Sales (incl. shipping+tax) → `totalSales` (new, was VAT before)
- Attribution gap panel: compare `shopifyActuals.netSales` vs GA4 grand total (unchanged)

## Key Files
- `dm-dashboard/backend/app/sales.py` — replace `_build_uk_shopify_actuals_payload()`
- `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx` — update card labels/fields

## Constraints
- Use `UK_STORE = "ledsone_uk"` (already defined)
- Use same `graphql()` helper as rest of file
- UNTIL date = last day of the month (handle Feb correctly with calendar)
- Keep same cache key `"uk-shopify-actuals"` / `"uk2026"`
