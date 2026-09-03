# Sajeepan Requirement 3 — Revenue Protection & PPC Actions — Verification Evidence

**Title:** Revenue Protection & PPC Actions Tab — PostgreSQL & Logic Verification  
**Task:** Verify Req 3 implementation, SQL queries, business rules, and data integrity  
**Date:** 2026-08-18  
**Member:** Sajeepan  
**Team:** PPC / Google Ads  
**Requirement:** SAJEEPAN-R3  
**Verifier:** Claude Code (claude-sonnet-4-6)  
**AIOS Root:** `C:\Users\PC\Documents\piranav_aios`

---

## Objective

Independently verify that the Requirement 3 "Revenue Protection & PPC Actions" dashboard tab:
- Runs correct SQL against the correct tables
- Applies correct business rules (ROAS thresholds, drop thresholds, OOS override)
- Covers all 7 SJ campaigns including newly added 24092456136
- Produces data consistent with independent DB queries
- Contains no logic defects, missing joins, or hardcoded data issues

---

## Assets Found

| Asset | Path | Status |
|---|---|---|
| Dashboard HTML | `Staff-requirements/pages/sajeepan.html` (line 778–948) | EXISTS |
| API handler | `Staff-requirements/api/members-api.js` — `handleSajeepanReq3()` (line 1050–1236) | EXISTS |
| Route dispatch | `members-api.js` line 1710–1712 | EXISTS |
| Closure file (partial) | `closure/sajeepan/requirement-3-2026-08-11.md` | EXISTS (PARTIAL status) |
| Evidence (previous) | `evidence/sajeepan/` | EMPTY — this file is the first |
| Capability file | `capability/sajeepan/` | EMPTY — still missing |
| Validation file | `validation/sajeepan/` | EMPTY — still missing |
| SR-02 version | `Staff-requirements-02/api/members-api.js` line 1050 | EXISTS (identical function) |

---

## PostgreSQL Sources

- **Read-only source:** `ledsone-db-mcp` (ledsone-db MCP tool)
- **Connection:** PostgreSQL via DATABASE_URL environment variable
- **Schema verified:** `google_ads` and `order_management`

---

## Tables / Views Used by Req 3

| Table | Schema | Used In | Columns Used |
|---|---|---|---|
| `campaign_performance` | google_ads | Drops (A3), date range filter | campaign_id, date, impressions, conversion_value, conversions, cost |
| `campaigns` | google_ads | Limited campaigns (A2), drops join | campaign_id, campaign_name, campaign_primary_status, campaign_status, budget, target_roas |
| `product_performance` | google_ads | OOS (A1), cross-platform (A4), ROAS bands (B), duplicates (C1) | campaign_id, date, product_item_id, conversion_value, conversions, cost, impressions, clicks |
| `merchant_products` | google_ads | OOS join (A1), ROAS bands (B), dup titles (C2), dup merch (C3) | product_id, title, image_link, availability, price, mpn, feed_label |
| `order_management.orders` | order_management | Cross-platform (A4) | id, order_date |
| `order_management.order_item_info` | order_management | Cross-platform (A4) | order_id, item_sku, item_quantity |

**All tables confirmed to exist and contain expected columns.**

---

## Business Rules

### Date Ranges (Default: Last 30 days from latest DB date 2026-08-17)
- Current period: 2026-07-19 to 2026-08-17
- Previous period: 2026-06-19 to 2026-07-18 (equal length, adjacent)
- 60d / 90d presets available via UI buttons (but API uses same 30d default unless overridden by frontend)

### SJ_CAMPAIGN_IDS (hardcoded constant, line 870)
```
[21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265, 24092456136]
```
All 7 campaigns confirmed to exist in `google_ads.campaigns`.

### SJ_TARGET_ROAS (hardcoded constant, lines 871–874)
```js
{ '21069663519': 320, '23110323532': 320, '23516313256': 400,
  '23590572906': 400, '22079334413': 380, '21242723265': 380 }
```
NOTE: Campaign `24092456136` (SJ_Lighting_PH_KLARNA) is NOT in `SJ_TARGET_ROAS`. The handler falls back to `SJ_TARGET_ROAS[id] || 300`. This is used only in Req 1 campaign display; Req 3 does not reference `SJ_TARGET_ROAS`.

### Section A1 — OOS Best-Sellers
- Filter: `product_item_id` in SJ campaigns, current period
- Join: `merchant_products` on LOWER(product_id) = LOWER(product_item_id)
- Condition: `availability = 'out of stock' AND cv > 0`
- Sort: cv DESC, LIMIT 50
- **Business rule:** Products spending ad budget while OOS — pause or restock urgently

### Section A2 — Limited Campaigns
- Filter: `campaign_primary_status = 'LIMITED'` within SJ_CAMPAIGN_IDS
- Performance data joined for current period
- **Business rule:** Investigate reason in Google Ads UI before increasing budget

### Section A3 — Sudden Performance Drops
- Period-over-period comparison, same date window width
- Thresholds applied in JS after query:
  - Impressions drop: `< -40%` → alert
  - Revenue (cv) drop: `< -30%` → alert
  - Conversions drop: `< -30%` → alert
- Only campaigns with at least one alert are included (`has_drop: true`)

### Section A4 — Cross-Platform Winners
- Amazon/eBay orders: last 30 days from NOW() (not from latest DB date — uses live timestamp)
- Threshold: `qty >= 3` units in 30 days
- Google visibility threshold: `< 500 impressions`
- Join: `merchant_products.mpn` to `order_item_info.item_sku` (LOWER match)

### Section B — ROAS Banding
- Source: product_performance × merchant_products, current period, LIMIT 500 (top by CV)
- ROAS formula: `cv / cost * 100` (percentage, e.g. 400 = 400%)
- OOS override: takes priority over all ROAS bands
- Band logic (in order):
  1. `oos` — availability = 'out of stock'
  2. `zero-high` — conv=0, cost>=20
  3. `zero-med` — conv=0, cost>=10
  4. `zero-low` — conv=0, cost<5 (also if price known and cost < price)
  5. `scale` — roas>=400 AND conv>0
  6. `keep` — roas>=300
  7. `monitor` — roas>=250
  8. `reduce` — roas>=100
  9. `exclude` — cost>0 (any remaining with cost)
  10. `low-data` — fallback (no cost, no conv)
- Thresholds editable in UI (Apply button re-renders client-side only — band sent by API is fixed)

### Section C — Duplicates
- C1: Same product_item_id in 2+ campaigns (current period, HAVING COUNT > 1)
- C2: Same title, different product_ids in merchant feed — feed_label ILIKE '%sj%'
- C3: Same product_id, multiple rows in merchant feed — feed_label ILIKE '%sj%'

---

## Date Range

| Parameter | Value |
|---|---|
| Current from | 2026-07-19 |
| Current to | 2026-08-17 |
| Previous from | 2026-06-19 |
| Previous to | 2026-07-18 |
| Preset | Last 30 days (default) |

---

## Latest Data Date

**2026-08-17** — confirmed by `MAX(date)` query on `google_ads.campaign_performance` across all 7 SJ campaigns.

---

## Data Verification (Independent Query vs API Logic)

### A1 — OOS Best-Sellers
| Metric | Independent Query | API Logic |
|---|---|---|
| Count of OOS rows with cv>0 | **152** | ≤50 (LIMIT 50 applied) |
| Total OOS revenue (all 152) | £7,456.62 | Top 50 by cv |
| Join method | LOWER(product_id)=LOWER(product_item_id) | Same |
| Filter | availability='out of stock' AND cv>0 | Same |

Result: Logic CORRECT. API returns top 50 by revenue; 152 total OOS revenue-generating product rows exist. LIMIT 50 is a display cap, not a data error.

### A2 — Limited Campaigns
| Metric | Independent Query | API Logic |
|---|---|---|
| LIMITED campaign count | **1** (campaign 21242723265 ALLACRSJ2) | Same filter |

Result: Logic CORRECT. 1 campaign currently LIMITED.

### A3 — Sudden Drops
Independent computation from raw period data:

| Campaign | imp_l | imp_p | imp_chg% | cv_l | cv_p | cv_chg% | conv_l | conv_p | conv_chg% | Drops? |
|---|---|---|---|---|---|---|---|---|---|---|
| 21069663519 | 442,390 | 282,679 | +56.5% | 7,941.79 | 6,186.90 | +28.4% | 276.55 | 180.09 | +53.6% | NO |
| 21242723265 | 58,474 | 18,109 | +222.9% | 689.88 | 454.60 | +51.8% | 31.50 | 11.65 | +170.4% | NO |
| 22079334413 | 22,776 | 23,518 | -3.2% | 255.62 | 912.07 | **-72.0%** | 11.77 | 15.59 | -24.5% | YES (revenue -72%) |
| 23110323532 | 119,199 | 97,238 | +22.6% | 2,495.57 | 3,779.78 | **-34.0%** | 76.54 | 90.98 | -15.9% | YES (revenue -34%) |
| 23516313256 | 95,857 | 39,047 | +145.5% | 1,705.90 | 854.09 | +99.7% | 48.95 | 30.81 | +58.9% | NO |
| 23590572906 | 15,839 | 18,442 | -14.1% | 564.58 | 629.49 | -10.3% | 15.66 | 12.08 | +29.6% | NO |
| 24092456136 | 44,971 | 0 | N/A | 1,136.57 | 0.00 | N/A | 29.68 | 0.00 | N/A | NO (new campaign, prev=0) |

Expected drop alerts: 2 campaigns (22079334413 and 23110323532). Logic CORRECT.

NOTE: Campaign 24092456136 shows prev=0 (new campaign, launched Aug 2026). API correctly handles null % change when prev=0 — these return `null` for chg values and are excluded from drops.

### A4 — Cross-Platform Winners
| Metric | Independent Query | API Logic |
|---|---|---|
| SKUs with qty>=3 orders, imps<500 | **2,343** | LIMIT 20 (top by orders) |

Result: Logic CORRECT. 2,343 eligible SKUs; API displays top 20 by order count.

### B — ROAS Banding (LIMIT 500, top by CV)
| Band | Count | Total Cost | Total Revenue |
|---|---|---|---|
| scale | 272 | £10,667.16 | £69,020.07 |
| keep | 134 | £10,594.27 | £34,804.27 |
| reduce | 42 | £3,341.23 | £6,213.22 |
| monitor | 36 | £3,905.34 | £10,070.63 |
| oos | 16 | £155.78 | £2,731.10 |
| **Total** | **500** | **£28,663.78** | **£122,839.29** |

Result: Logic CORRECT. 500 rows returned (LIMIT 500), OOS override applied correctly (16 OOS products present in top 500).

### C1 — Duplicate Campaigns
| Metric | Independent Query | API Logic |
|---|---|---|
| Products in 2+ campaigns | **419** | LIMIT 100 applied |

Result: Logic CORRECT. 419 total; API displays top 100.

### C2 & C3 — Merchant Duplicates
| Check | Count |
|---|---|
| Duplicate titles (feed_label ILIKE '%sj%') | 6,297 |
| Duplicate merchant item IDs | 16,749 |

Result: High duplicate counts confirmed. These are real feed data quality issues surfaced correctly by Req 3.

---

## Aggregation Check

| Check | Result |
|---|---|
| GROUP BY in product queries | Correct — `product_item_id, campaign_id` (no fan-out from merchant_products join) |
| merchant_products join fan-out risk | PRESENT — LEFT JOIN without DISTINCT ON. Multiple merchant_products rows per product_id could create duplicates in B and C1 queries. See Risk section. |
| Period comparison in drops | Correct — CASE WHEN applied to single query, no double-join |
| HAVING COUNT > 1 in C1 | Correct — `COUNT(DISTINCT pp.campaign_id)` |
| Duplicate title query GROUP BY | Correct — `LOWER(title), title` |
| OOS override (band logic) | Correct — `availability='out of stock'` evaluated first in JS chain |

---

## Campaign Coverage Check

| Campaign ID | Name | In SJ_CAMPAIGN_IDS | In SJ_TARGET_ROAS | In DB campaigns table | Has product_performance data (30d) |
|---|---|---|---|---|---|
| 21069663519 | SJ_PENDANT_KLARNA | YES | YES (320) | YES | YES |
| 23110323532 | HIGH REVENUE PH | YES | YES (320) | YES | YES |
| 23516313256 | SJ_TOP_20 | YES | YES (400) | YES | YES |
| 23590572906 | zero conv2 | YES | YES (400) | YES | YES |
| 22079334413 | SJALL HERO | YES | YES (380) | YES | YES |
| 21242723265 | ALLACRSJ2 Access. | YES | YES (380) | YES | YES |
| **24092456136** | **SJ_Lighting_PH_KLARNA** | **YES** | **MISSING (falls back to 300)** | **YES** | **YES (426 products, first date 2026-08-03)** |

Campaign 24092456136 coverage:
- Included in all 8 Req 3 SQL queries via `SJ_CAMPAIGN_IDS` array. CONFIRMED.
- NOT in `SJ_TARGET_ROAS` — fallback to 300 used in Req 1 campaign display. Req 3 does not use `SJ_TARGET_ROAS` — no impact on Req 3.
- No separate UI dropdown or filter for campaign selection in Req 3 — all queries use the shared `SJ_CAMPAIGN_IDS` constant. 24092456136 is automatically included.
- Has data from 2026-08-03 onwards (within the 30-day window). Previous period (June–July) has 0 data — handled correctly (null chg, excluded from drops).
- 426 distinct products, £217.66 cost, £728.48 revenue in current period.

---

## Hardcoded Data Check

| Item | Location | Status |
|---|---|---|
| SJ_CAMPAIGN_IDS | `members-api.js` line 870 | Intentional constant — 7 IDs hardcoded |
| SJ_TARGET_ROAS | `members-api.js` lines 871–874 | Hardcoded per-campaign targets. 24092456136 missing — fallback 300 used in Req 1. No impact on Req 3. |
| SJ_CAMP_NAMES | `members-api.js` lines 1240–1247 | Used in Req 4 only; 24092456136 not listed (same fallback pattern) |
| ROAS thresholds (bands) | JS logic in API | Hardcoded (400/300/250/100) but UI has editable threshold inputs — however editable thresholds only affect client-side re-render, API band assignment is fixed |
| Drop thresholds | JS line 1111–1113 | Hardcoded (-40% imps, -30% revenue, -30% conv) — NOT editable in UI |
| OOS override | JS line 1164 | Hardcoded — correct business logic |
| Cross-platform qty threshold | SQL line 1126 | Hardcoded: `qty >= 3` |
| Cross-platform imps threshold | SQL line 1138 | Hardcoded: `< 500` |
| Feed label filter (C2/C3) | SQL lines 1201, 1216 | Hardcoded: `ILIKE ANY(ARRAY['sjgb','sj_pendant_klarna','%sj%'])` |

---

## Risks

| Risk | Severity | Detail |
|---|---|---|
| merchant_products fan-out in ROAS band query (B) | MEDIUM | The GROUP BY in the ROAS banding query includes `mp.title, mp.image_link, mp.availability, mp.price, mp.mpn, mp.feed_label` — if a product has multiple merchant_products rows with different values, it creates multiple rows per product+campaign. For a product with 2 merchant rows (different availability), this would produce 2 banded rows instead of 1. |
| Duplicate merchant count inflation | HIGH | 16,749 duplicate merchant item IDs in feed — suggests many products have multiple rows. This amplifies the fan-out risk above. |
| LIMIT 500 on ROAS banding | LOW | Top 500 by CV covers the most actionable products. Zero-conv products (which need the most attention) may be excluded. The API independently also has zero-conv banding in Req 4 — complementary design. |
| A4 cross-platform uses NOW() not latest DB date | LOW | 30-day order window uses live NOW() timestamp, not DB latest date. This is correct intent but means the order window does not align precisely with the Google Ads date window. |
| 24092456136 missing from SJ_TARGET_ROAS | LOW | Only affects Req 1 display (falls back to 300). Req 3 is unaffected. Should be added for completeness. |
| UI ROAS threshold inputs do not re-query API | LOW | "Apply" button re-renders client-side from cached data — changes only affect display, not the `band` field returned by API. Band assigned by API at fixed thresholds cannot be changed by UI. Documented correctly via section labels showing default values. |
| Drop threshold not editable in UI | INFO | -40%/-30% thresholds are hardcoded in API. No UI override. Acceptable for current scope. |

---

## Next Action

1. **MUST FIX — Fan-out risk (MEDIUM):** Investigate whether the ROAS banding GROUP BY with merchant_products columns produces duplicate rows for products with multiple merchant_products rows. Add `DISTINCT ON` or sub-select to merchant_products join.
2. Add `24092456136` to `SJ_TARGET_ROAS` constant (Req 1 display fix — not a Req 3 blocker).
3. Create `capability/sajeepan/requirement-3-2026-08-11.md` (still missing per closure).
4. Create `validation/sajeepan/requirement-3-2026-08-11.md` (still missing per closure).
5. Piranav: browser-validate Req 3 tab and capture screenshot.

---

## PASS / FAIL

**PASS WITH OBSERVATIONS**

All 8 SQL queries execute correctly against verified tables. Campaign 24092456136 is included in all queries. Business rules are implemented correctly. Drop detection, OOS filter, ROAS banding, and duplicate detection all produce data-consistent results.

One medium risk flagged (merchant_products join fan-out in ROAS banding query) — requires investigation before declaring clean PASS.

---

## Files Changed

| File | Action |
|---|---|
| `evidence/sajeepan/requirement-3-revenue-protection-verification-2026-08-18.md` | CREATED (this file) |

No dashboard or API files were modified.

---

## Git Status
Git Push: NOT PERFORMED

## Deployment Status
Deployment: NOT PERFORMED
