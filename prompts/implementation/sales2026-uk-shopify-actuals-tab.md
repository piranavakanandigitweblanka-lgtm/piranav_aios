# Prompt: Sales2026 UK — Shopify Actuals Tab

## Task
Add a new "Shopify Actuals" tab to the ledsone.co.uk Channel Group Summary dashboard in Sales2026.jsx.

## What to Build

### Backend — new endpoint `/api/sales/uk-shopify-actuals`
- Reuse `_fetch_uk_orders_for_month()` to pull all UK orders for the selected month
- Do NOT filter by channel group — include ALL non-cancelled, non-test orders
- Aggregate using `_uk_summarize_rows()`:
  - `ordersCount`, `grossSales`, `discounts`, `refunds`, `netSales`, `vat`, `orderTotalSum`
- Return shape:
  ```json
  {
    "success": true,
    "reportPeriod": { "month": "...", "label": "...", "timezone": "Europe/London" },
    "supportedMonths": [...],
    "isLive": true,
    "shopifyActuals": {
      "ordersCount": 0,
      "grossSales": 0.0,
      "discounts": 0.0,
      "refunds": 0.0,
      "netSales": 0.0,
      "vat": 0.0,
      "orderTotalSum": 0.0,
      "currency": "GBP"
    },
    "meta": { "generatedAt": "...", "ordersFetched": 0, "pagesFetched": 0 }
  }
  ```
- Use same `_cached_route` / `_register_cached_tab` pattern as other UK endpoints
- Cache key: `"uk-shopify-actuals"`, `"uk2026"`

### Frontend — new tab in ChannelGroupSummaryUK component
- Add tab switcher: `"Channel Summary"` (existing) | `"Shopify Actuals"` (new)
- The month selector and Refresh button stay shared at top (both tabs use same `month` state)
- Shopify Actuals tab content — KPI cards grid (3 columns):
  1. **Shopify Gross Sales** — grossSales in £
  2. **Total Refunds** — refunds in £ (red accent)
  3. **Shopify Net Sales** — netSales in £ (green accent)
  4. **Orders** — ordersCount
  5. **Discounts** — discounts in £
  6. **VAT** — vat in £
- Below cards: one comparison row showing:
  - Shopify Net Sales vs GA4 Grand Total (grandTotal from channel summary)
  - Gap = Shopify Net - GA4 attributed (can be +/-)
  - Label: "Attribution gap — orders not matched to a channel"

## Key Files
- Backend: `dm-dashboard/backend/app/sales.py`
  - Add `_build_uk_shopify_actuals_payload(month, force_refresh=False)`
  - Add `@router.get("/uk-shopify-actuals")` endpoint
  - Register cache tab
- Frontend: `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx`
  - Add tab state to `ChannelGroupSummaryUK` component
  - Add fetch for `/api/sales/uk-shopify-actuals?month=...` alongside existing fetchAll
  - Add `ShopifyActualsTab` inline component

## Constraints
- Do NOT change existing channel group endpoints or their data
- Use same `money()` and `currencySymbol` helpers already in the file
- Tab switcher must not break the existing Channel Summary view
- Cache pattern: same as other UK endpoints (`_cached_route` + `_register_cached_tab`)
