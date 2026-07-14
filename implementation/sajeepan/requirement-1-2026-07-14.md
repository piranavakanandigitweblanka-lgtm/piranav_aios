# Sajeepan — Requirement 1 Implementation
## Google Ads Product Intelligence Dashboard

**Date:** 2026-07-14 | **Review:** 2026-07-14 (corrections applied) | **Status:** PASS

---

## Objective
Build Sajeepan Requirement 1 — full Google Ads PMax Product Intelligence Dashboard in `pages/sajeepan.html`. Replace placeholder. Do not create another page.

---

## Campaigns (6 PMax — Verified)

| Campaign ID | Exact Name | Status | Primary | Budget | Target ROAS |
|---|---|---|---|---|---|
| 21069663519 | Pmax \| Sajeepan \| Klarna CSS \| SJ_PENDANT_KLARNA \| Zero Conv \| MCV \| UK | ENABLED | LIMITED | £100/day | 320% |
| 23110323532 | Pmax \| Sajeepan \| SHOPTIMISED CSS \| SJGB \| HIGH REVENUE PH \| MCV \| UK | ENABLED | ELIGIBLE | £100/day | 320% |
| 23516313256 | Pmax \| Sajeepan \| Klarna CSS \| SJ_TOP_20 \| TOP 20% PH \| MCV \| UK | ENABLED | ELIGIBLE | £36/day | 400% |
| 23590572906 | Pmax \| Sajeepan \| Shoptimised CSS \| SJGB \| zero conv2 \| MCV \| UK | ENABLED | LIMITED | £40/day | 400% |
| 22079334413 | Pmax \| Sajeepan \| G CSS SJALL \| SJALL \| HERO \| MCV \| UK | ENABLED | ELIGIBLE | £40/day | 380% |
| 21242723265 | Pmax \| Sajeepan \| Klarna CSS \| ALLACRSJ2 \| Accessories \| MCV \| UK | ENABLED | ELIGIBLE | £22/day | 380% |

---

## PostgreSQL Sources (ledsone-db-mcp — Read Only)

| Table | Purpose |
|---|---|
| `google_ads.campaigns` | Campaign master — IDs, names, status, budget, target_roas |
| `google_ads.campaign_performance` | Daily campaign metrics |
| `google_ads.product_performance` | Daily product metrics |
| `google_ads.merchant_products` | Product catalogue — title, image, price, availability |

---

## Join Keys & Normalization

- `campaign_performance.campaign_id = campaigns.campaign_id`
- Product join: `UPPER(REPLACE(pp.product_item_id, '-sh', '')) = mp.product_id`
- Merchant dedup: `DISTINCT ON (product_id) ORDER BY updated_at DESC` (latest record)
- Reason: merchant_products has 45,647 product_ids with duplicate rows

---

## Product Counts (30-day window: 2026-06-14 to 2026-07-13)

| Campaign ID | Raw Rows | Distinct Item IDs | Normalized |
|---|---|---|---|
| 21069663519 | 5,856 | 289 | 289 |
| 21242723265 | 1,982 | 223 | 223 |
| 22079334413 | 4,779 | 354 | 354 |
| 23110323532 | 5,018 | 221 | 221 |
| 23516313256 | 5,093 | 311 | 311 |
| 23590572906 | 1,685 | 225 | 225 |
| **All (deduped)** | **24,413** | — | **1,154** |

Matched to merchant_products: **284** | Unmatched: **870**

---

## Formulas (standardized)

| Metric | Formula |
|---|---|
| ROAS % | Conversion Value ÷ Cost × 100 (percentage only, no `x`) |
| CTR % | Clicks ÷ Impressions × 100 |
| CVR % | Conversions ÷ Clicks × 100 |
| Ad Contribution | Conversion Value − Ad Cost |
| Profit | NOT SHOWN — "Profit unavailable — product cost not verified" |

---

## LIMITED Status
- `campaigns.campaign_primary_status = 'LIMITED'` for 21069663519 and 23590572906
- `campaigns.budget_status = 'ENABLED'` for both (budget is not the confirmed cause)
- No `limiting_reason` column in `google_ads.campaigns`
- Display: "Delivery LIMITED — limiting reason not available in the verified source"

---

## Files Changed

| File | Change |
|---|---|
| `Staff-requirements/pages/sajeepan.html` | Placeholder → dashboard + 7 corrections applied |
| `prompts/sajeepan/requirement-1-2026-07-14.md` | Created |
| `implementation/sajeepan/requirement-1-2026-07-14.md` | Updated |
| `validation/sajeepan/requirement-1-2026-07-14.md` | Updated |
| `evidence/sajeepan/requirement-1-2026-07-14.md` | Updated |
| `deployment/sajeepan/requirement-1-2026-07-14.md` | Created |
| `closure/sajeepan/requirement-1-2026-07-14.md` | Updated |
| `capability/sajeepan/requirement-1-2026-07-14.md` | Updated |

---

## Status: PASS
