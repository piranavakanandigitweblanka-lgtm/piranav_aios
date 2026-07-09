# Thivajini — Requirement 3 — Stock Filter Fix Evidence
## Date: 2026-07-09

**Title:** Req 3 Stock Status Filter Fix
**Team Member:** Thivajini
**Issue Fixed:** Availability filter was using Feed Availability as stock truth. Now uses Current Stock (p.st) for Stock Status filter. Feed Availability kept as separate filter.

## Problem

The original dashboard had one filter: "Feed Availability" (using `p.av` from google_merchant_products).
This was wrong because:
- Some products show `av = 'in stock'` in the feed but have `st = 0` (zero stock in listing_data)
- These rows would NOT appear under an "Out of Stock" filter
- Flag logic was already correct (based on p.st), but the filter misled users

## Fix Applied

### New `r3StockStatus(p)` helper function
```js
function r3StockStatus(p){
  if(p.st<0) return 'Unknown Stock';
  if(p.st===0) return 'Out of Stock';
  if(p.st<=5)  return 'Low Stock';
  return 'Healthy Stock';
}
```

### New dropdown: Stock Status (id=r3-ss)
- All Stock Status
- Out of Stock (p.st === 0)
- Low Stock (p.st > 0 && p.st <= 5)
- Healthy Stock (p.st > 5)
- Unknown Stock (p.st < 0)

### Feed Availability dropdown (id=r3-av) — kept separate
- All Feed Availability / In Stock / Out of Stock / Unknown

### Filter logic updated
```js
if(ss && r3StockStatus(p)!==ss) return false;
if(av && p.av!==av)             return false;
```

### Notes column updated
If `p.av === 'in stock' && p.st === 0`:
→ Notes shows: "Feed says in stock but stock=0 — check feed sync"

### Table header updated
Added `<th>Stock Status</th>` before `<th>Feed Avail.</th>`

### CSV export updated
Added `Stock Status` column (computed via r3StockStatus) before `Feed Availability`

## Mismatch Count

**8 rows** where Feed Availability = 'in stock' but Current Stock = 0

| Variant ID | SKU | Flag | 30d Spend |
|-----------|-----|------|-----------|
| 42039847026763 | ENC9243 | STOP | €5.98 |
| 41413877891147 | CRSF100CH+... | STOP | €0.99 |
| 42039826841675 | CRSF100BM+... | STOP | €0.92 |
| 41306757791819 | CRFF100GB+HKR10GB | STOP | €0.26 |
| 41976892391499 | WCB7BM+RPR44WH | STOP | €0.16 |
| (3 more) | — | STOP | <€0.10 each |

All 8 are already flagged as STOP (flag logic uses p.st, not p.av). Fix ensures they now also appear under "Out of Stock" in the Stock Status filter.

## Flag Logic (unchanged)
- STOP: st=0 AND sp>0
- ACT SOON: st<=5 AND sp>0
- MONITOR: st<=5 AND sp=0
- OK: st>5

## Files Updated
- Staff-requirements/pages/thivajini.html (391,929 bytes)

## PASS / FAIL: PASS

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
