# Evidence — Lampshade SOT Metafield Updates (Post-Upload)

**Date:** 2026-08-17
**Task:** Post-upload metafield corrections and reformatting across 79 SOT-matched products
**Prepared by:** Piranav (AIOS)

---

## Work Completed

### 1 — SHAPES Audit
- Checked all 125 products for `bulb_shapes` metafield
- All 125 confirmed populated — 79 from SOT bulk upload, remainder had pre-existing values

### 2 — SIZE Field Reformatted (79 products)
- Updated from plain number `["220"]` → `["100mm x 180mm"]` (Height x Diameter format)
- All 79 SOT-matched products updated, 0 errors
- Product `15269017223554` stored as `["130mm x -"]` (no diameter in SOT)

### 3 — TYPE Field: N/A → Pendant Fit (6 products)
| Product ID | Shape |
|---|---|
| 7702867771642 | Teardrop |
| 7702888907002 | Teardrop |
| 7702867935482 | Teardrop |
| 14934663922050 | Mosque |
| 15273974301058 | Dome |
| 15273985540482 | Dome |

- Updated `custom.core` from `["N/A"]` → `["Pendant Fit"]`, 0 errors

### 4 — HOLE DIAMETER Filter
- Metafield data exists on 79 products but not added to Search & Discovery filters
- Action required: Admin → Search & Discovery → Filters → Add `hole_diameter`

### 5 — Stale Filter Values
- Old MODEL values showing in storefront filter with 0 products
- Fix: Search & Discovery → Filters → Save (forces re-index, allow 30 mins)

---

## Data Files
All working files archived to:
`C:\Users\PC\Documents\piranav_aios\data\piranav\lampshade-sot-2026-08-17\`

| File | Purpose |
|---|---|
| `batch_3.txt` – `batch_9.txt` | Original SOT bulk upload GraphQL mutations |
| `mutations_filled.json` | Full 79-product mutation source |
| `products-by-parent.csv` | 125 rows, one per Parent List ID with SOT fields |
| `products-variant-merged.csv` | Merged variant + SOT data (346 rows) |

---

## Metafield Status (79 SOT products)

| Metafield | Key | Status |
|---|---|---|
| TYPE | core | ✅ N/A → Pendant Fit fixed |
| SHAPES | bulb_shapes | ✅ All 125 populated |
| SIZE | size | ✅ Reformatted to HHmm x DDmm |
| HEIGHT | height | ✅ Unchanged (plain mm values) |
| HOLE DIAMETER | hole_diameter | ✅ Set — needs Search & Discovery filter |
| MODEL | model | ✅ Complete |
| COLOUR | colour | ✅ Complete |
| HOLDER TYPE | holder_ | ✅ Complete |
| STYLE | style | ✅ Complete |

**Status: PASS**
