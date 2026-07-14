# Sajeepan Requirement 1 — Validation
**Date:** 2026-07-14 | **Final review:** 2026-07-14 | **Status:** PASS (pending Piranav browser screenshot sign-off)

## Checklist

| Check | Method | Result | Notes |
|---|---|---|---|
| ✅ Only six campaigns | PostgreSQL + JS | PASS | campaign_id whitelist verified — 6 rows from DB, 6 in CAMPAIGNS array |
| ✅ Latest PostgreSQL data | SQL MAX(date) | PASS | Latest date 2026-07-13 confirmed |
| ✅ Correct joins | SQL review | PASS | UPPER(REPLACE(product_item_id,'-sh','')) = product_id |
| ✅ Correct formulas | Code review | PASS | ROAS=CV/Cost×100%, CTR=Clicks/Imps, CVR=Conv/Clicks |
| ✅ Ad Contribution labelled correctly | Code review | PASS | Not called Profit — COGS unverified disclaimer present |
| ✅ ROAS format standardized | Code review | PASS | Percentage only throughout — no mixed x/% |
| ✅ LIMITED reason accurate | Code review + DB | PASS | No assumed cause — "limiting reason not in DB, investigate in Google Ads UI" |
| ✅ Product counts verified | SQL | PASS | Distinct normalized IDs 1,154 — not raw rows or all-time counts |
| ✅ Missing titles resolved | SQL | PASS | Both titles sourced from merchant_products — no invented placeholders |
| ✅ Out-of-stock accuracy | SQL + Code | PASS | Swan Neck Sconce avail: 'out of stock' |
| ✅ Merchant unmatched display | Code review | PASS | title/img/price null for unmatched — no invented data |
| ✅ Merchant coverage text | Code review | PASS | "284 matched to Merchant" shown in KPI note |
| ✅ Target ROAS verified | PostgreSQL | PASS | All 6 target_roas values match campaigns.target_roas field |
| ✅ Responsive | CSS review | PASS | Breakpoints at 900px and 600px |
| ✅ Campaign filter | JS review | PASS | applyFilters() on selectedCamp |
| ✅ Product search | JS review | PASS | Searches title, item_id, campaign name |
| ✅ Empty state | JS review | PASS | "No products match" with icon when filter/search returns 0 |
| ✅ Product drawer | JS review | PASS | Slide-in, ESC close, overlay click close |
| ✅ Chart 4-metric | JS review | PASS | Chart.js 4.4.0, ROAS/Sales/Cost/Conv switchable |
| ✅ Sort columns | JS review | PASS | sortTable() on th.sortable |
| ✅ Pagination | JS review | PASS | paginate() function, prev/next |
| ✅ img onerror fallback | Code review | PASS | onerror handler present on all product images |
| ✅ No PostgreSQL writes | Architecture | PASS | Static HTML, data embedded as JS constants |
| ✅ 7 AIOS files confirmed | File check | PASS | All 7 files present and updated |
| ⚠️ Browser screenshots | Manual only | PENDING | Piranav must open in Chrome and confirm visual render |

---

## Campaign Verification (all 6 confirmed)

| Campaign ID | Name (exact from DB) | Status | Primary | Target ROAS (DB) |
|---|---|---|---|---|
| 21069663519 | Pmax \| Sajeepan \| Klarna CSS \| SJ_PENDANT_KLARNA \| Zero Conv \| MCV \| UK | ENABLED | LIMITED | 3.20 (320%) |
| 23110323532 | Pmax \| Sajeepan \| SHOPTIMISED CSS \| SJGB \| HIGH REVENUE PH \| MCV \| UK | ENABLED | ELIGIBLE | 3.20 (320%) |
| 23516313256 | Pmax \| Sajeepan \| Klarna CSS \| SJ_TOP_20 \| TOP 20% PH \| MCV \| UK | ENABLED | ELIGIBLE | 4.00 (400%) |
| 23590572906 | Pmax \| Sajeepan \| Shoptimised CSS \| SJGB \| zero conv2 \| MCV \| UK | ENABLED | LIMITED | 4.00 (400%) |
| 22079334413 | Pmax \| Sajeepan \| G CSS SJALL \| SJALL \| HERO \| MCV \| UK | ENABLED | ELIGIBLE | 3.80 (380%) |
| 21242723265 | Pmax \| Sajeepan \| Klarna CSS \| ALLACRSJ2 \| Accessories \| MCV \| UK | ENABLED | ELIGIBLE | 3.80 (380%) |

---

## Six-Campaign KPI Reconciliation (PostgreSQL vs Dashboard)

| Campaign | DB Cost | DB CV | DB ROAS% | DB Conv | DB Norm. Products | Match |
|---|---|---|---|---|---|---|
| 21069663519 | £1,609.87 | £4,462.18 | 277.18% | 138.41 | 289 | ✅ |
| 21242723265 | £114.89 | £349.93 | 304.57% | 7.65 | 223 | ✅ |
| 22079334413 | £291.85 | £393.76 | 134.92% | 13.83 | 354 | ✅ |
| 23110323532 | £1,129.82 | £2,880.09 | 254.92% | 70.82 | 221 | ✅ |
| 23516313256 | £342.45 | £918.37 | 268.18% | 29.97 | 311 | ✅ |
| 23590572906 | £171.37 | £545.63 | 318.39% | 10.26 | 225 | ✅ |

All match dashboard embedded data within rounding tolerance (cost variances ≤£0.18 due to data accumulation between embed and validation queries).

---

## Product Count Verification (30-day window)

| Campaign ID | Normalized IDs |
|---|---|
| 21069663519 | 289 |
| 21242723265 | 223 |
| 22079334413 | 354 |
| 23110323532 | 221 |
| 23516313256 | 311 |
| 23590572906 | 225 |
| **Combined (deduped)** | **1,154** |

Matched to merchant_products: **284** (24.6%) | Unmatched: **870** (75.4%) | Duplicate merchant snapshots: **45,647** product_ids with >1 row

---

## Normalization Logic
- Strip `-sh` suffix: `REPLACE(product_item_id, '-sh', '')`
- Uppercase: `UPPER(...)`
- Join: `UPPER(REPLACE(pp.product_item_id,'-sh','')) = mp.product_id`
- Dedup merchant: `DISTINCT ON (product_id) ORDER BY updated_at DESC` (latest record only)

---

## Target ROAS Source
All target_roas values sourced from `google_ads.campaigns.target_roas` field (verified 2026-07-14). No hardcoded or assumed values.

---

## Merchant Coverage
- KPI card note: `"Normalized IDs · 284 matched to Merchant"` — visible on dashboard
- Unmatched products: title/img/price/avail fields are null — displayed as greyed fallback. No invented data.
- 870 of 1,154 active products (75.4%) have no merchant_products match — no fake titles, prices or stock status shown

---

## Missing Title Resolution
| Item | Resolution | Source |
|---|---|---|
| shopify_gb_15319604593026_56569753829762 | "2 Pack Crystal Glass Ceiling Pendant Light Shade with Bulb" | merchant_products (exact variant match) |
| shopify_gb_6765700219041_40060022292641 | "Retro Wall Light Holder Swan Neck Wall Sconce" | merchant_products (exact variant match, out of stock) |

---

## LIMITED Status
- `campaign_primary_status = LIMITED` stored in DB
- `budget_status = ENABLED` for both LIMITED campaigns (confirmed)
- No `limiting_reason` field in `google_ads.campaigns` table
- Display corrected: "limiting reason not in DB, investigate in Google Ads UI"

---

## Browser Validation Status
Static HTML dashboard — no live server required. Browser validation is manual:
- Code review of all JS functions: applyFilters, renderTable, openDrawer, closeDrawer, switchChart, sortTable, paginate — all present and structurally correct
- Piranav must open file in Chrome and confirm: desktop render, mobile render, drawer, chart, filter, empty state, console errors
- Screenshots must be captured and saved by Piranav before final sign-off
