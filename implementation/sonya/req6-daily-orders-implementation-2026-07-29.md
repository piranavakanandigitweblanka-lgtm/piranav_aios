# Sonya R6 — Daily Orders — Implementation
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## Files Modified

| File | Change |
|---|---|
| `Staff-requirements-02/api/sonya/daily-orders.js` | NEW — serverless API for R6 |
| `Staff-requirements-02/pages/sonya.html` | Added nav button (tab 6), panel-6 HTML, R6 CSS, R6 JavaScript |
| `Staff-requirements-02/index.html` | Sonya badge updated "5 Reports Live" → "6 Reports Live"; removed redundant `/api/status` fetch |
| `Staff-requirements-02/api/status.js` | DELETED — static data already in index.html; slot freed for daily-orders.js |

## API: `api/sonya/daily-orders.js`

**Endpoint:** `GET /api/sonya/daily-orders[?date=YYYY-MM-DD]`

**Logic:**
1. Resolve `targetDate` = query param date OR `DATE(MAX(order_date)) - 1`
2. Compute `l7From` = targetDate - 6 days
3. Summary query: total UK orders + LEDsone UK orders for targetDate
4. Order rows query: GROUP BY `(real_sku, sub_source)` → aggregated qty, max price, image, title
5. Collect distinct SKUs → batch stock lookup (SUM inventory)
6. Batch shopify_listings lookup: `DISTINCT ON (sku)` filtered to `site='UK' AND listing_url ILIKE '%ledsone.co.uk%' AND is_parent=0`
7. L7d sales: filter to ledsone Shopify sub_sources (ILIKE '%ledsone%', NOT amazon/ebay)
8. Merge all maps → return `{ ok, summary, rows }`

**Response shape:**
```json
{
  "ok": true,
  "summary": { "total_uk_orders": 939, "ledsone_uk_orders": 111, "date": "2026-07-28", "refreshed_at": "..." },
  "rows": [
    { "sku": "ENC9764", "sub_source": "ledsone", "qty": 3, "sold_price": 39.65,
      "image": "...", "title": "...", "stock": 45, "ledsone_uk_price": 39.65,
      "ledsone_url": "https://ledsone.co.uk/...", "l7_shopify_uk": 3 }
  ]
}
```

## HTML Tab (panel-6)

- Summary cards: Date, Total UK Orders, LEDsone UK Orders, Last Refresh
- Filters: Date picker, SKU search, Marketplace dropdown (dynamic), Stock filter, Price comparison filter
- Table: SKU, Stock (colour-coded), Image (thumbnail), URL (ledsone.co.uk link), Marketplace, L7d Shopify UK, Selling Price, LEDsone UK £, Qty Sold, Title
- Pagination: 50 rows/page
- CSV export
- Lazy load: fetches on first tab click

## Function Slot Management

Vercel Hobby plan limit: 12 serverless functions.
Was at 12/12. `api/status.js` (static badge counts) removed — data already hardcoded in index.html. `api/sonya/daily-orders.js` takes the freed slot. Still 12/12.
