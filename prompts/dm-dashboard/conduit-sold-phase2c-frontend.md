---
name: conduit-sold-phase2c-frontend
category: dm-dashboard
created: 2026-10-02
status: COMPLETE
---

# Conduit Stock Alert Phase 2C — Frontend Implementation Prompt

## Purpose
Add a "Component Stock" tab to the existing ConduitSold.jsx page.
Consumes GET /api/admin/conduit-stock. Must not break existing 4 sales tabs.

## File Modified
`dm-dashboard/frontend/src/admin/pages/ConduitSold.jsx`

## Tab Architecture
- activeTab is now string | number — integers 0–3 = collection tabs, STOCK_TAB = 'stock'
- Stock tab always visible in tab bar; collection tabs appear once sold data loads
- Two independent fetch states: `data` (sold) + `stockData` (stock)
- Stock data loaded on first click of the stock tab via useEffect([activeTab])

## New Components Added
- `AlertBadge` — coloured inline badge for CRITICAL / WARNING / LOW / OK
- `ComponentStockView` — full stock tab: summary cards, filters, SKU table, expandable rows
- `exportStockCSV` — CSV export for filtered stock view

## Summary Cards
5 cards: Total SKUs, CRITICAL, WARNING, LOW, OK
Alert count cards are clickable — clicking toggles filterAlert to that status.

## Client-Side Filters (combinable)
1. SKU text search (contains match)
2. Collection dropdown (unique handles from API response)
3. SKU Type dropdown (single / combo / enc / pack)
4. Alert Status dropdown (CRITICAL / WARNING / LOW / OK)
Shows "X of 288 SKUs" count. Clear filters button appears when any filter active.

## SKU Table Columns
SKU | Type | Collections | Stock | Status | Alternative | [expand]

## Expandable Rows
Rows where components[] is non-empty get a ▸/▾ toggle button.
Expanded sub-table: Component SKU | Stock | Bottleneck?
BOTTLENECK badge shown in red when is_bottleneck=true.

## Security (must preserve)
- No Shopify token in frontend code
- No stock calculations in React — all values from API
- authHeaders() sends JWT Bearer token

## What Was NOT Modified
- Phase 1 sales fetch (load() function)
- CollectionTab, MonthCell, ProductBlock, CollectionView, exportCSV
- Authentication pattern
- All existing CSS classes (jreq-card, jreq-refresh, jreq-error, etc.)

## Evidence
`evidence/dm-dashboard/conduit-sold-phase2c-frontend-2026-10-02.md`

## Validation
`validation/piranav/conduit-sold-phase2c-validation-2026-10-02.md`
