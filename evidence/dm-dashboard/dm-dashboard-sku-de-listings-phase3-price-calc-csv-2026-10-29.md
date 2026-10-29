# DM Dashboard — SKU DE Listings: Phase 3 — Price Calculator + CSV Export
**Req ID:** DMDASH-SKUDE-PHASE3-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code
**Branch:** `piranv-work`
**Status:** IMPLEMENTED — tests pass. Awaiting Piranav commit + push + live verification.

---

## 1. Files Changed

| File | Change |
|---|---|
| `frontend/src/lib/priceCalc.js` | **New** — pure utility: `calcPrice`, `parsePct`, `fmtCalcPrice`, `buildCsv`, `csvField`, `safeSku` |
| `frontend/src/admin/pages/SkuDeListings.jsx` | **Modified** — added price adjustment controls, Calculated Price column, CSV export |
| `frontend/tests/test_price_calc.mjs` | **New** — 52 Node.js tests for priceCalc.js |

Backend (`sku_de_listings.py`) unchanged — all new features are client-side.

---

## 2. Architecture Decision

The full result set is already loaded in memory on the frontend (`result.rows`). Price calculation and CSV export are done entirely client-side — no new backend endpoint, no additional DB queries, no changes to the existing API response shape. This also means:
- No new UAM exposure
- No backend deployment needed for this feature
- Calculated prices are never written to the DB

---

## 3. Calculation Formula

**Single shared function:** `calcPrice(priceStr, mode, pct)` in `priceCalc.js` — used by both the table (`fmtCalcPrice`) and CSV export. No discrepancy possible between table and CSV.

```
Increase: calculatedPrice = originalPrice × (1 + pct / 100)
Decrease: calculatedPrice = originalPrice × (1 − pct / 100)
Round:    Math.round(price × factor × 100) / 100   ← avoids float drift
```

**Spec examples verified:**

| SKU Price | Mode | % | Result |
|---|---|---|---|
| €30.59 | +12% | Increase | €34.26 ✓ |
| €22.39 | +12% | Increase | €25.08 ✓ |
| €19.39 | +12% | Increase | €21.72 ✓ |
| €30.59 | −12% | Decrease | €26.92 ✓ |
| €30.59 | 100% decrease | Decrease | €0.00 ✓ |
| any | 0% | either | original price ✓ |

---

## 4. Input Validation

| Rule | Behaviour |
|---|---|
| Empty input | Treated as 0% (no adjustment) |
| Negative | Invalid — shows error, calculated prices show `—` |
| Non-numeric | Invalid |
| `> 1000` | Invalid |
| Decrease `> 100%` | Invalid |
| null/undefined price from DB | `calcPrice` returns null → shows `—`, excluded from CSV as empty |

---

## 5. Global Application

- All rows in `result.rows` (the full API result) are in memory
- `filtered` = `rows` after status/type/stock filters — same array used by both table and CSV
- `effectivePct` derived on every render from `adjPctInput` — any change immediately recalculates all rows in the next render pass
- No row mutation — original `price_eur` from the API response is never modified
- Adjustment state (`adjMode`, `adjPctInput`) is NOT reset when filters change or on new searches — persists across the session

---

## 6. CSV Export

- Client-side only — `buildCsv()` from `priceCalc.js`
- UTF-8 BOM (for Excel German-character compatibility)
- Iterates `filtered` (respects active Status / SKU Type / Stock filters)
- Columns: Store, Item ID, Variant Title, SKU, Price (EUR), Calculated Price (EUR), Stock, Status, SKU Type, Listing URL
- Both price columns formatted to 2dp
- All fields RFC 4180 quoted — commas, quotes, line breaks, German characters safe
- Formula injection guard (fields starting `= + - @` get `'` prefix)
- Filename: `sku-de-listings-{safeSku}.csv` — non-alphanumeric chars replaced with `-`
- Export button disabled when `filtered.length === 0` or `effectivePct === null`

---

## 7. Test Results

**Node.js tests:** `node frontend/tests/test_price_calc.mjs` → **52/52 PASS**
**Backend regression:** `python -m pytest tests/test_sku_de_listings.py tests/test_sku_stock_lookup.py` → **56/56 PASS**
**Lint:** `npx oxlint src/lib/priceCalc.js src/admin/pages/SkuDeListings.jsx` → **0 warnings**

---

## 8. UAM / Security

- No new backend endpoint — UAM gate on `/api/sku-de-listings/search` unchanged (`make_task_auth("tools.SkuDeListings")`)
- Calculated prices computed client-side only — never sent to or stored in DB
- No new permission grants
- No Shopify data modified

---

## 9. Deployment Steps

1. Commit 3 files on `piranv-work`
2. Push to `websitetecteam-arch/dm-dashboard` (select **websitetecteam-arch** in credential popup)
3. No backend restart needed — only frontend files changed
4. Live test: search a SKU, enter 12% increase, verify Calculated Price column, click Export CSV
