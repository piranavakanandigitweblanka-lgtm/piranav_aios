# Evidence — Conduit Stock Alert Phase 2C — Frontend Implementation

**Date**: 2026-10-02
**Feature**: Component Stock tab in ConduitSold.jsx
**Status**: IMPLEMENTED — PENDING BROWSER TEST

---

## What Was Built

Added a 5th tab "Component Stock" to the existing Conduit Sold page at:
`dm-dashboard/frontend/src/admin/pages/ConduitSold.jsx`

### New code additions (no existing code modified)
| Item | Description |
|---|---|
| `ALERT_STYLES` | Colour map for CRITICAL/WARNING/LOW/OK badges |
| `stockThStyle` | Table header style constant for stock table |
| `AlertBadge` | Coloured inline badge component |
| `exportStockCSV()` | CSV export function for stock view |
| `ComponentStockView` | Full stock tab component |
| `loadStock()` | Async fetch for `/api/admin/conduit-stock` |
| `stockData`, `stockError`, `stockLoading` | Separate state for stock API |
| `STOCK_TAB = 'stock'` | Tab identifier constant |
| `useEffect([activeTab])` | Triggers stock load on first tab visit |

### Tab bar change
Tab bar now shows collection tabs (when sold data loads) + permanent "Component Stock" tab.
`activeTab` changed from integer-only to `string | number`.

---

## API Contract Consumed

```
GET /api/admin/conduit-stock
Auth: Authorization: Bearer {dm_token}
Cache: 5 min, ?refresh=1 bypass

Response shape:
{
  success: true,
  generatedAt: "ISO string",
  summary: { total: 288, by_alert: { CRITICAL, WARNING, LOW, OK }, by_type: {...} },
  skus: [{
    sku, sku_type, collections[], stock, alert_status,
    alternative_sku, components[{ sku, stock, is_bottleneck }]
  }]
}
```

---

## UI Features

### Summary cards
- Total SKUs (288)
- CRITICAL (34), WARNING (23), LOW (56), OK (175) — all clickable to filter

### Filters (client-side, combinable)
- SKU text search
- Collection dropdown (from API data)
- Type dropdown (single/combo/enc/pack)
- Alert status dropdown
- Clear filters button + "X of 288 SKUs" counter

### SKU table
- Columns: SKU (monospace), Type, Collections, Stock (right-aligned, alert-coloured), Status badge, Alternative SKU, expand toggle
- Row background tint: CRITICAL=light red, WARNING=light amber, OK/LOW=white

### Expandable component rows
- ▸/▾ toggle on any SKU where components[] length > 0
- Sub-table: Component SKU | Stock | Bottleneck label
- BOTTLENECK badge in red; non-bottleneck shows —

### Refresh button
- Context-aware: shows "Refresh (live)" on sold tabs, "Refresh stock" on stock tab
- Timestamp shown per tab using respective generatedAt field

### CSV export
- Stock tab has its own Export CSV button (exports filtered rows)
- Sold tab Export CSV still works unchanged

---

## Files Modified
| File | Change |
|---|---|
| `dm-dashboard/frontend/src/admin/pages/ConduitSold.jsx` | Added ComponentStockView + stock fetch + tab bar update |

## Files NOT Modified
| File | Reason |
|---|---|
| `dm-dashboard/backend/app/admin_conduit_stock.py` | Backend complete from Phase 2B |
| `dm-dashboard/backend/app/main.py` | Router registered in Phase 2B |
| All other frontend files | No changes needed |

---

## Commit
Pending — not yet committed as of evidence creation.

## Test Cases Pending (browser)
1. 288 SKUs shown on load
2. Summary counts match: CRITICAL=34, WARNING=23, LOW=56, OK=175
3. Search "CRSF10025BM" → finds single SKU, shows stock=0 CRITICAL, alt=CRSF100BM
4. LHTTAGU10WH+LDGU10WD5 → expand → both components show BOTTLENECK
5. ENC8401 → expand → PCGZ20MT shows BOTTLENECK, LHNSE27CO does not
6. CRSF10025BM+PHHC1BMRBM → expand → no BOTTLENECK (combo OK, stock=92)
7. Filter by CRITICAL → count = 34
8. Filter by type=enc → count = 45
9. All 4 collection tabs still load and show data
10. No console errors
