# Sajeepan Requirement 1 — Campaign Data Verification Evidence
**Date:** 2026-08-18 | **Verified by:** AIOS (ledsone-db-mcp, read-only) | **Status:** PASS with advisory

---

## 1. Requirement Summary
Verify that the Campaign Data shown in `Staff-requirements/pages/sajeepan.html` (Requirement 1 — Google Ads Product Intelligence Dashboard) is correct against the approved PostgreSQL source data.

---

## 2. Dashboard Tab
- Tab: **Requirement 1 — Campaign & Product Intelligence**
- URL: `Staff-requirements/pages/sajeepan.html` (default load)
- Sidebar link: `data-tab="1"` (active on page load)
- Date range default: **Last 7 days** (button `id="sj-preset-7"` has class `on`)
- Date range used for this verification: **Last 30 days** from latest DB date (2026-07-19 to 2026-08-17) — matches API default when no user date is passed

---

## 3. Assets Found

| Asset | Path | Date |
|---|---|---|
| Evidence (previous) | `evidence/sajeepan/requirement-1-2026-07-14.md` | 2026-07-14 |
| Capability | `capability/sajeepan/requirement-1-2026-07-14.md` | 2026-07-14 |
| Closure (previous) | `closure/sajeepan/requirement-1-2026-07-14.md` | 2026-07-14 |
| Prompt | `prompts/sajeepan/requirement-1-2026-07-14.md` | 2026-07-14 |
| Dashboard HTML | `Staff-requirements/pages/sajeepan.html` | Current |
| API handler | `Staff-requirements/api/members-api.js` | Current |

---

## 4. PostgreSQL Sources
- Connection: `ledsone-db-mcp` (read-only)
- Schema: `google_ads`
- Tables used: `campaign_performance`, `campaigns`, `product_performance`, `merchant_products`

---

## 5. Tables / Views Used

| Table | Purpose |
|---|---|
| `google_ads.campaigns` | Campaign name, status, budget, target_roas |
| `google_ads.campaign_performance` | Daily cost, clicks, impressions, conversions, conversion_value |
| `google_ads.product_performance` | Product-level daily performance |
| `google_ads.merchant_products` | Product metadata (title, image, availability, sku, price) |

---

## 6. Campaign Scope
6 PMax campaigns defined in API constant `SJ_CAMPAIGN_IDS`:

| Campaign ID | Short Name | DB Name (truncated) |
|---|---|---|
| 21069663519 | SJ_PENDANT_KLARNA | Pmax \| Sajeepan \| Klarna CSS \| SJ_PENDANT_KLARNA |
| 23110323532 | HIGH REVENUE PH | Pmax \| Sajeepan \| SHOPTIMISED CSS \| HIGH REVENUE PH |
| 23516313256 | SJ_TOP_20 | Pmax \| Sajeepan \| Klarna CSS \| SJ_TOP_20 |
| 23590572906 | zero conv2 | Pmax \| Sajeepan \| Shoptimised CSS \| zero conv2 |
| 22079334413 | SJALL HERO | Pmax \| Sajeepan \| G CSS SJALL \| SJALL \| HERO |
| 21242723265 | ALLACRSJ2 Accessories | Pmax \| Sajeepan \| Klarna CSS \| ALLACRSJ2 \| Accessories |

All 6 campaigns confirmed **ENABLED** in `google_ads.campaigns.campaign_status`.

---

## 7. Date Range

| Parameter | Value |
|---|---|
| Date range mode | Last 30 days from latest DB date |
| `fromDate` | 2026-07-19 |
| `toDate` | 2026-08-17 |
| `prevFrom` | 2026-06-18 |
| `prevTo` | 2026-07-18 |
| API logic | `toDate = MAX(date) from campaign_performance WHERE campaign_id IN (SJ_CAMPAIGN_IDS)` |
| Dashboard default button | "Last 7d" highlighted on page load, but API default when no date passed = last 30d from latest |

---

## 8. Latest Data Date

```
PostgreSQL latest date:  2026-08-17
Dashboard latest date:   Rendered dynamically via #sjLatestChip — pulls from API meta.to
Match:                   YES (dashboard shows whatever the API returns as meta.to)
```

SQL used:
```sql
SELECT MAX(date) AS latest_date
FROM google_ads.campaign_performance
WHERE campaign_id=ANY(ARRAY[21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265]::bigint[])
-- Result: 2026-08-17
```

---

## 9. Campaign-by-Campaign Comparison

Verification period: 2026-07-19 to 2026-08-17 (30 days from latest DB date).

The API query joins `campaign_performance` with `campaigns` and uses CASE WHEN date BETWEEN to aggregate current and previous period in one pass. This was replicated exactly.

Duplicate check: **zero duplicate (date, campaign_id) rows found** — no double-counting risk.

### Live DB Values (read-only query 2026-08-18):

| Campaign ID | Short Name | Cost £ | Conv Value £ | ROAS % | Conversions | Clicks | Impressions |
|---|---|---|---|---|---|---|---|
| 21069663519 | SJ_PENDANT_KLARNA | 2,752.66 | 7,941.79 | 288.51 | 276.55 | 6,325 | 442,280 |
| 23110323532 | HIGH REVENUE PH | 1,058.00 | 2,495.57 | 235.88 | 76.54 | 1,984 | 119,180 |
| 23516313256 | SJ_TOP_20 | 569.44 | 1,705.90 | 299.58 | 48.95 | 1,241 | 95,853 |
| 21242723265 | ALLACRSJ2 Access. | 313.38 | 689.88 | 220.14 | 31.50 | 886 | 58,469 |
| 22079334413 | SJALL HERO | 251.60 | 255.62 | 101.60 | 11.77 | 440 | 22,768 |
| 23590572906 | zero conv2 | 209.84 | 564.58 | 269.05 | 15.66 | 421 | 15,835 |

### API Query vs Independent DB Query Comparison:

Both the API exact query replication (using CASE WHEN BETWEEN) and the direct SUM query produced **identical results** to 2 decimal places for all 6 campaigns. Result: **MATCH confirmed for all campaigns**.

### ROAS Calculation Verification:
| Campaign | Cost | Conv Value | DB ROAS (CV/Cost×100) | Matches API formula? |
|---|---|---|---|---|
| SJ_PENDANT_KLARNA | 2752.66 | 7941.79 | 7941.79/2752.66×100 = **288.51%** | YES |
| HIGH REVENUE PH | 1058.00 | 2495.57 | 2495.57/1058.00×100 = **235.88%** | YES |
| SJ_TOP_20 | 569.44 | 1705.90 | 1705.90/569.44×100 = **299.58%** | YES |
| ALLACRSJ2 Access. | 313.38 | 689.88 | 689.88/313.38×100 = **220.14%** | YES |
| SJALL HERO | 251.60 | 255.62 | 255.62/251.60×100 = **101.60%** | YES |
| zero conv2 | 209.84 | 564.58 | 564.58/209.84×100 = **269.05%** | YES |

---

## 10. Business Rules

| Rule | Formula | Source |
|---|---|---|
| ROAS % | `Conv Value ÷ Cost × 100` | API line 1651: `cost>0?Math.round(cv/cost*10000)/100:0` |
| CTR % | `Clicks ÷ Impressions × 100` | Rendered in HTML KPI card |
| Ad Contribution | `Conv Value − Ad Cost` | Dashboard chip: "Ad Contribution = Conv Value − Ad Cost" |
| Profit | Not shown — COGS unverified | Dashboard chip confirmed |
| ROAS format | Percentage throughout (no × multiplier) | Dashboard chip confirmed |

### Aggregation Rules (API):
- Campaign data: `GROUP BY campaign_id, campaign_name, budget, campaign_status`
- Product data: `GROUP BY product_item_id, campaign_id ORDER BY cv DESC LIMIT 500`
- Merchant join: `DISTINCT ON (LOWER(product_id))` — deduplication of merchant snapshots
- Date filter: `WHERE campaign_id=ANY(SJ_CAMPAIGN_IDS) AND date BETWEEN fromDate AND toDate`

---

## 11. Advisory Finding — Target ROAS Hardcoded Values

**FINDING (non-blocking — data correct, presentation advisory):**

The API constant `SJ_TARGET_ROAS` is hardcoded in `members-api.js` line 871–874. These values are used for campaign card UI display (target vs actual ROAS bars) only — they do **not** affect the data aggregation queries.

Comparison of hardcoded vs live DB values (`google_ads.campaigns.target_roas × 100`):

| Campaign ID | Short Name | Hardcoded (API) | DB target_roas | Mismatch? |
|---|---|---|---|---|
| 21069663519 | SJ_PENDANT_KLARNA | 320% | 3.20 × 100 = **320%** | NO |
| 23110323532 | HIGH REVENUE PH | 320% | 3.60 × 100 = **360%** | **YES — stale** |
| 23516313256 | SJ_TOP_20 | 400% | 4.00 × 100 = **400%** | NO |
| 23590572906 | zero conv2 | 400% | 4.80 × 100 = **480%** | **YES — stale** |
| 22079334413 | SJALL HERO | 380% | 4.00 × 100 = **400%** | **YES — stale** |
| 21242723265 | ALLACRSJ2 Access. | 380% | 3.80 × 100 = **380%** | NO |

3 of 6 campaigns have stale hardcoded target_roas values. This affects the ROAS progress bar display and campaign card status classification in Requirement 1 UI — not the underlying performance data.

**Implication:** The campaign card ROAS bars for HIGH REVENUE PH, zero conv2, and SJALL HERO use incorrect targets, which may show a different performance position than what Google Ads is actually targeting. This is a UI advisory — no data corruption.

---

## 12. Browser Verification
Browser-level live test not possible in AIOS environment. All verification performed at source-code and database level:

- SQL query logic verified by code review of `members-api.js` lines 1595–1668
- ROAS formula verified: `Math.round(cv/cost*10000)/100` — correct percentage calculation
- No hardcoded data values found in the req1 campaign data path — all values fetched from DB dynamically
- Static note in HTML tbar: `"Period: 2026-06-14 to 2026-07-13"` is a stale static label in the product table bar — does not affect actual data loaded (data is fetched dynamically via API). This is a cosmetic finding.

---

## 13. Validation Summary

| Check | Result |
|---|---|
| All 6 campaigns present in DB | PASS |
| All campaigns ENABLED | PASS |
| No duplicate (date, campaign_id) rows | PASS |
| API query replication matches direct SUM query | PASS — identical to 2dp |
| ROAS formula correct (CV/Cost×100) | PASS |
| No hardcoded performance data | PASS |
| Latest DB date matches dashboard source | PASS |
| Target ROAS hardcoded values vs DB | ADVISORY — 3 of 6 stale |
| Stale static date in product table tbar | ADVISORY — cosmetic only |

---

## 14. Evidence Location
`C:\Users\PC\Documents\piranav_aios\evidence\sajeepan\requirement-1-campaign-data-verification-2026-08-18.md`

Previous evidence: `evidence\sajeepan\requirement-1-2026-07-14.md` (preserved, not modified)

---

## 15. AIOS Updates
- This evidence file created (new)
- `capability\sajeepan\requirement-1-2026-07-14.md` — no update needed (finding is advisory, not a new capability)
- `closure\sajeepan\requirement-1-2026-07-14.md` — no update (original closure was correct for July build; stale target_roas is a post-closure DB change)
- No prompt file update required

---

## 16. Git Status
Git Push: NOT PERFORMED

---

## 17. Deployment Status
Deployment: NOT PERFORMED

---

## 18. Risks

| Risk | Severity | Detail |
|---|---|---|
| Stale `SJ_TARGET_ROAS` hardcoded values | LOW | 3 of 6 campaigns show wrong target ROAS bars in UI. Does not corrupt underlying data. Google Ads target ROAS changed in DB since July build. |
| Static tbar date label | COSMETIC | HTML contains `"Period: 2026-06-14 to 2026-07-13"` as static text but data is loaded dynamically. User-facing mislead on date range is possible. |
| 75% merchant_products coverage gap | KNOWN | Unchanged from July evidence. 870 of ~1,154 active products lack merchant metadata — title/image fallbacks apply. |

---

## 19. Next Action
1. **Advisory fix (optional):** Replace hardcoded `SJ_TARGET_ROAS` in `members-api.js` with a live DB query to `google_ads.campaigns.target_roas` — or manually update the 3 stale values (23110323532: 360, 23590572906: 480, 22079334413: 400).
2. **Cosmetic fix (optional):** Remove the static date string from the product table `tbar` span.
3. If fixes are applied: commit, push, re-verify on Vercel.
4. If no fixes required: mark verification PASS with advisory noted.

---

## 20. PASS / FAIL

**PASS with advisory**

Campaign data fetched from PostgreSQL is correct. All 6 campaigns are present, all aggregations verified, ROAS formula is correct, no duplicate rows, no hardcoded performance data. Latest DB date is 2026-08-17 (one day lag — normal for Google Ads sync).

Advisory items (non-blocking): 3 of 6 campaign target_roas display values are stale; 1 static date label in HTML. Neither affects data correctness.
