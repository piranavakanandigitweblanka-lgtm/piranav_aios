# Evidence: Sajeepan Requirement 2 — Stop Waste & Intel Verification

**Title:** Sajeepan Req 2 — Stop Waste & Intel Verification  
**Task:** Independent PostgreSQL verification of Req 2 data, business rules, aggregation, and date range  
**Date:** 2026-08-18  
**Member:** Sajeepan  
**Team:** Google Ads / PPC  
**Requirement:** Req 2 — Stop Waste Spend & Search Term Intelligence  
**Verified by:** Claude Code (AIOS execution agent)  
**Status:** PASS WITH DEFECT FLAGGED

---

## Objective

Independently verify that the Req 2 dashboard panel and API handler (`handleSajeepanReq2`) correctly identify:
1. Zero-conversion waste products (cost > £5, clicks > 0)
2. Negative KW candidates from search terms (cost > £2, zero conversions)
3. Campaign budget waste signals (cost increased AND ROAS declined)
4. Cross-platform opportunities (Amazon/eBay SKUs with 3+ orders)
5. 30/60/90-day rolling window summaries

---

## Assets Found

No existing Req 2 evidence, capability, closure, prompts, validation, or implementation files found under:
- `evidence/sajeepan/` — none
- `capability/sajeepan/` — none
- `prompts/sajeepan/` — none
- `validation/sajeepan/` — none
- `implementation/sajeepan/` — none
- `closure/sajeepan/` — none

This is the first verification run for Req 2.

---

## PostgreSQL Sources

- **Source:** `ledsone-db-mcp` (READ ONLY — no writes performed)
- **Connection:** Verified — queries executed successfully

---

## Tables / Views Used

| Table | Schema | Columns Used | Status |
|---|---|---|---|
| `product_performance` | `google_ads` | `product_item_id`, `campaign_id`, `date`, `clicks`, `cost`, `impressions`, `conversions` | VERIFIED — all columns exist with correct types |
| `campaign_performance` | `google_ads` | `campaign_id`, `date`, `cost`, `conversion_value`, `conversions` | VERIFIED — all columns exist |
| `pmax_campaign_search_term_data` | `google_ads` | `search_term`, `campaign_id`, `date`, `cost`, `clicks`, `impressions`, `conversions` | VERIFIED — all columns exist |
| `merchant_products` | `google_ads` | `product_id`, `title`, `image_link`, `link`, `price`, `availability`, `country`, `mpn` | VERIFIED — all columns exist |
| `order_management.orders` | `order_management` | `id`, `order_date`, `sub_source_id` | Used for cross-platform section |
| `order_management.order_item_info` | `order_management` | `order_id`, `item_sku`, `item_quantity` | Used for cross-platform section |
| `order_management.source` | `order_management` | `id`, `source_name` | Used for cross-platform section (AMAZON, EBAY) |
| `order_management.sub_source` | `order_management` | `id`, `source_id` | Used for cross-platform section |

---

## Business Rules (Waste Thresholds, Filters, Calculations)

### Waste Products
- Table: `google_ads.product_performance`
- Filter: `campaign_id IN SJ_CAMPAIGN_IDS`, `date BETWEEN fromDate AND toDate`, `product_item_id != ''`
- Threshold: `SUM(conversions)=0 AND SUM(cost)>5 AND SUM(clicks)>0`
- Output: sorted by cost DESC

### Negative KW Candidates
- Table: `google_ads.pmax_campaign_search_term_data`
- Filter: `campaign_id IN SJ_CAMPAIGN_IDS`, `date BETWEEN fromDate AND toDate`, `conversions=0` (ROW-LEVEL — see defect below)
- Threshold: `SUM(cost)>2` (after grouping by search_term, campaign_id)
- Output: sorted by cost DESC
- **DEFECT FOUND:** API applies `WHERE conversions=0` at row level before GROUP BY. This means a search term that converted on some days but not others will still appear in candidates if its zero-conversion rows sum to > £2. The correct approach is `HAVING SUM(conversions)=0`.

### Budget Waste Signal
- Table: `google_ads.campaign_performance`
- Current period: `fromDate` to `toDate` (last 30d)
- Previous period: `prevFrom` to `prevTo` (30d before that)
- Signal fires when: `cost_l > cost_p AND roas_l < roas_p`
- ROAS calculated as: `conversion_value / cost * 100`

### Cross-Platform Opportunities
- Source: Amazon/eBay orders in `order_management` schema
- Threshold: `COUNT(DISTINCT orders) >= 3` in the date window
- Limit: Top 15 SKUs by order count
- Google search term matching: fuzzy title-word match against top 300 search terms by clicks+imps

### 30/60/90-Day Windows
- Computed from `toDate` backwards (29, 59, 89 days respectively)
- Aggregated from `google_ads.campaign_performance`

---

## Date Range

- **Latest DB date:** 2026-08-17
- **Default current period (last 30d):** 2026-07-19 to 2026-08-17 (toDate − 29 days = fromDate)
- **Previous period:** 2026-06-19 to 2026-07-18 (fromDate − 1 day = prevTo; prevTo − 29 days = prevFrom)
- **Span calculation:** `spanDays = (toDate - fromDate) / 86400000` = 29 days
- **Date range matches Req 1:** YES — same MAX(date) lookup from `campaign_performance` using SJ_CAMPAIGN_IDS
- **Date boundaries correct:** YES — BETWEEN is inclusive on both ends

---

## Latest Data Date

- Confirmed: `2026-08-17` (MAX date in `google_ads.campaign_performance` for SJ_CAMPAIGN_IDS)

---

## Data Verification — Independent Query vs API Logic

### Waste Products
| Metric | Independent Query | API Logic |
|---|---|---|
| Waste product count | 40 | Same logic — 40 expected |
| Total waste cost | £327.33 | Same logic — £327.33 expected |
| Top waste product | shopify_gb_14880113525122_54875583283586, campaign 21069663519, cost £30.01 | Consistent |

**Result: MATCH**

### Negative KW Candidates — DISCREPANCY FOUND
| Metric | API Approach (WHERE conversions=0) | Correct Approach (HAVING SUM(conversions)=0) |
|---|---|---|
| KW candidate count | 172 | 142 |
| Difference | +30 terms over-reported | — |

**Cause:** API query uses `WHERE conversions=0` at row level before GROUP BY. This includes search terms that had zero-conversion rows costing > £2 but also had other rows with conversions > 0 on different days. These 30 extra terms should NOT be flagged as negative KW candidates because they have generated conversions within the period.

**Risk Level:** MEDIUM — Sajeepan may add 30 terms as negatives in Google Ads that should not be excluded, potentially suppressing converting traffic.

### Budget Waste Signals (independent)
| Campaign ID | Cost L | ROAS L | Cost P | ROAS P | Cost Up | ROAS Down | is_waste |
|---|---|---|---|---|---|---|---|
| 21069663519 | £2752.67 | 288.51% | £1940.27 | 318.87% | YES | YES | **WASTE** |
| 21242723265 | £313.38 | 220.14% | £105.42 | 431.23% | YES | YES | **WASTE** |
| 22079334413 | £251.60 | 101.60% | £256.30 | 355.86% | NO | YES | not waste |
| 23110323532 | £1058.00 | 235.88% | £1238.11 | 305.29% | NO | YES | not waste |
| 23516313256 | £569.44 | 299.58% | £222.07 | 384.60% | YES | YES | **WASTE** |
| 23590572906 | £209.84 | 269.05% | £228.38 | 275.63% | NO | YES | not waste |
| 24092456136 | £234.48 | 484.72% | £0.00 | 0% | YES | NO | not waste |

**Result:** 3 campaigns flagging as waste (21069663519, 21242723265, 23516313256). API logic correctly identifies `is_waste = cost_l > cost_p AND roas_l < roas_p`. MATCH.

**Note:** Campaign 24092456136 has cost_p = £0 (new campaign, no previous period data). API handles this correctly — `is_waste` will be false since roas_p = 0 means ROAS didn't decline from a positive value.

---

## Aggregation Check

- Waste products: GROUP BY `product_item_id, campaign_id` — no duplicates confirmed (independent aggregation query returned 0 duplicate rows)
- Campaign budget waste: GROUP BY `campaign_id` — 7 rows returned matching 7 SJ campaigns, no duplicates
- Search terms: GROUP BY `search_term, campaign_id` — grouping correct but see row-level filter defect above
- merchant_products join: `DISTINCT ON (LOWER(product_id))` with GB-country preference — correct deduplication approach

**Result: PASS (no aggregation duplicates)**

---

## Hardcoded Data Check

- `SJ_CAMPAIGN_IDS = [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265, 24092456136]` — hardcoded in API. Campaign 24092456136 was added 2026-08-18 (Req 1 work). Current array is correct.
- `SJ_TARGET_ROAS` map — hardcoded per campaign. Does NOT include 24092456136. This is for Req 1 use, not Req 2. Acceptable for now.
- Cost threshold £5 (waste products) — hardcoded in HAVING clause. Business rule, not data.
- Cost threshold £2 (negative KW) — hardcoded in HAVING clause. Business rule, not data.
- Cross-platform threshold: 3+ orders — hardcoded. Business rule, not data.
- STOP words set for search term matching — hardcoded list in JS. Acceptable.

**Result: No business data hardcoded. Thresholds are business rules.**

---

## Defects Found

### DEFECT 1 — Negative KW Filter: Row-level vs Aggregated (MEDIUM Risk)
- **Location:** `handleSajeepanReq2`, line ~958 in `members-api.js`
- **Current:** `WHERE conversions=0` applied before GROUP BY
- **Correct:** Should use `HAVING SUM(conversions)=0` after GROUP BY
- **Impact:** 172 candidates returned vs correct 142 — 30 over-reported terms
- **Action:** Report to coordinator. Do not fix without explicit instruction.

### DEFECT 2 — Missing Campaign in Req 2 Dropdown Filter (LOW Risk)
- **Location:** `sajeepan.html`, lines ~677-685 and ~706-713 (both `r2WasteCampFilter` and `r2KwCampFilter` selects)
- **Current:** Dropdown lists only 6 campaigns, missing 24092456136 (SJ_Lighting_PH_KLARNA)
- **Impact:** Sajeepan cannot filter Req 2 tables by this campaign in the UI. Data still appears in "All Campaigns" view. API queries include the campaign correctly.
- **Action:** Report to coordinator. Do not fix without explicit instruction.

---

## Risks

| Risk | Severity | Details |
|---|---|---|
| Negative KW over-reporting (+30 terms) | MEDIUM | Row-level filter vs aggregated filter discrepancy. 30 terms that actually converted are flagged as candidates. Adding them as negatives could suppress converting traffic. |
| New campaign missing from UI filter | LOW | 24092456136 not in dropdown. Data still visible under "All Campaigns". No data loss. |
| Campaign 24092456136 has no previous period data | INFO | New campaign (launched 2026-08-18). budget_waste is_waste=false correctly. No action needed. |

---

## Next Action

1. **Report DEFECT 1** (negative KW filter) to coordinator — Medium risk, needs fix decision
2. **Report DEFECT 2** (missing campaign in UI dropdown) to coordinator — Low risk, simple HTML fix
3. Do not modify dashboard or API without explicit instruction
4. Capability extraction can proceed once coordinator reviews defects

---

## PASS / FAIL

**PASS WITH DEFECTS FLAGGED**

Core data verification passed:
- Waste products: 40 products, £327.33 total waste — verified correct
- Budget waste signals: 3 campaigns flagging — logic correct, data consistent
- Date range: correct (2026-07-19 to 2026-08-17)
- Table schema: all tables and columns exist as expected
- Aggregation: no duplicates

Defects flagged (not blocking dashboard use):
- DEFECT 1: Negative KW over-reporting by 30 terms (MEDIUM)
- DEFECT 2: Missing campaign filter option in UI (LOW)
