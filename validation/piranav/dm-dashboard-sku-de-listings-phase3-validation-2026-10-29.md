# Validation — SKU DE Listings Phase 3 (Price Calculator + CSV Export)
**Date:** 29 October 2026

## Tests

| Suite | Command | Result |
|---|---|---|
| Calc unit tests | `node frontend/tests/test_price_calc.mjs` | **52/52 PASS** |
| Backend regression | `python -m pytest tests/test_sku_de_listings.py tests/test_sku_stock_lookup.py` | **56/56 PASS** |
| Lint | `npx oxlint src/lib/priceCalc.js src/admin/pages/SkuDeListings.jsx` | **0 warnings** |

## Spec Example Verification

| Input | Expected | Actual | Pass |
|---|---|---|---|
| €30.59 +12% | €34.26 | €34.26 | ✓ |
| €22.39 +12% | €25.08 | €25.08 | ✓ |
| €19.39 +12% | €21.72 | €21.72 | ✓ |
| €30.59 −12% | €26.92 | €26.92 | ✓ |
| €30.59 −100% | €0.00 | €0.00 | ✓ |
| 0% | unchanged | unchanged | ✓ |

## Files

| File | Status |
|---|---|
| `frontend/src/lib/priceCalc.js` | Created ✓ |
| `frontend/src/admin/pages/SkuDeListings.jsx` | Modified ✓ |
| `frontend/tests/test_price_calc.mjs` | Created ✓ |

## Result: PASS
