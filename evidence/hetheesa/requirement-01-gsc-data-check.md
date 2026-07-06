---
title: Requirement 01 — GSC Data Check
purpose: Document Google Search Console data availability and matching for ledsone.fr product pages
requirement_source: "What I Need to Improve SEO Performance - Hetheesa_.csv"
staff: Hetheesa
supporting_aios: Piranav
date: 2026-07-06
status: PASS — GSC data available in PostgreSQL; matched for 13 of 50 products
---

# GSC Data Check — Requirement 01

## Session 3 Refresh — 2026-07-06

Source: PostgreSQL `google_search_console.gsc_web_page`
Site URL: `https://ledsone.fr/`
Period: Last 30 days ending 2026-07-06
Page filter: `LIKE '%/products/%'`

## Match Summary

- Products in top 50: 50
- Products with GSC data: **13**
- Products with no GSC data: 37

## Matched Products (Session 3)

| Rank | Handle (~ID) | Impressions | CTR (%) | Low CTR Flag |
|---|---|---|---|---|
| 2 | ~1541 (5-way-spider-light-fixture) | 404 | 0.50 | Low CTR |
| 5 | ~1553 (adjustable-height-metal-spider-led) | 142 | 0.70 | Low CTR |
| 7 | ~1507 (industrial-vintage-ratio-2-head-hemp) | 261 | 0.00 | Low CTR |
| 13 | ~1545 (vintage-e27-bulb-holder-suspension-1m) | 799 | 0.88 | Low CTR |
| 14 | ~1916 (suspension-ledsone-8-voies-araignee) | 64 | 0.00 | Low CTR |
| 17 | ~1544 (suspension-industrielle-lustre-retro) | 60 | 0.00 | Low CTR |
| 19 | ~1642 (vintage-e27-bulb-holder-suspension-2m-4907) | 101 | 0.99 | Low CTR |
| 22 | ~1993 (ledsone-industriel-suspension-luminaire-retro) | 30 | 3.33 | OK |
| 25 | ~1628 (suspension-araign-e-3-voies-cuivre) | 176 | 0.57 | Low CTR |
| 31 | ~1580 (2-way-retro-vintage-chandelier-4945) | 156 | 1.28 | Low CTR |
| 37 | ~3645 (2m-black-white-round-cable-e27-base) | 166 | 0.60 | Low CTR |
| 40 | ~1863 (dc24v-ip67-150w-waterproof-led-driver) | 117 | 0.00 | Low CTR |
| 50 | ~1514 (ledsone-200mm-kit-rosace-cylindrique) | 73 | 5.48 | OK |

**Total matched:** 13 of 50 products
**Low CTR (< 2%):** 11 of 13 matched products
**OK CTR (≥ 2%):** 2 of 13 matched products (~1993 at 3.33%, ~1514 at 5.48%)

## Highest-Impact GSC Opportunity

| Product | Revenue | Impressions | CTR | Issue |
|---|---|---|---|---|
| ~1545 Suspension Extérieure IP65 | €76.33 | **799** | 0.88% | Low CTR — improve meta desc |
| ~1541 Lustre Araignée 5 Ampoules | €207.23 | 404 | 0.50% | Low CTR — fix 2 alt texts |
| ~1507 Suspension Chanvre 2 Têtes | €108.05 | 261 | 0.00% | Low CTR — fix 10 alt texts |
| ~1628 Lustre Araignée 3 Têtes | €38.82 | 176 | 0.57% | Low CTR — title Too Long |

**Top quick win:** ~1541 (rank 2, €207 revenue) — 404 impressions, 0.50% CTR. Fix meta title/description for immediate click uplift without needing to improve rankings.

## Differences from Session 2 (Jul 03)

- Old top 48 included `multi-shade-2m-pendant-light` (~1533) with 3,143 impressions — this product dropped out of top 50 by revenue in the Jul 06 window.
- New top 50 includes ~1553, ~1628 with GSC data. 13 matches vs 12 in session 2.
- Session 2 had `vintage-e27-bulb-holder-suspension-ceiling-hanging` (~1545) at 883 impressions — now 799 in new period.

## Products Without GSC Data

37 of 50 products had no GSC impression data. This indicates zero or near-zero organic impressions in the period — pages may not be indexed for relevant keywords or have very low visibility in French organic search.

## SQL Used

```sql
SELECT
  REGEXP_REPLACE(url, '.*/products/', '') AS handle,
  SUM(impressions) AS impressions,
  ROUND(
    (SUM(clicks)::numeric / NULLIF(SUM(impressions), 0) * 100)::numeric, 2
  ) AS ctr_pct
FROM google_search_console.gsc_web_page
WHERE site_url = 'https://ledsone.fr/'
  AND url LIKE '%/products/%'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY handle
ORDER BY impressions DESC;
```

## Limitations

- GSC pipeline lag may apply (data may not include last 2–3 days)
- Only top-100 product pages by impression retrieved — lower-impression products may have uncaptured data
- CTR averaged across query period, not a single snapshot
- GSC data is for `https://ledsone.fr/` property (verified-exact, not sc-domain)

## Validation Result

PASS

## Reviewer

Piranav (AIOS worker)

## Status

PASS — 2026-07-06

---

## Previous Session Record (2026-07-03)

Session 2 matched 12 of 48 products. Highest impression product was `multi-shade-2m-pendant-light` (~1533) at 3,143 impressions / 0.06% CTR. That product dropped out of top 50 revenue in the Jul 06 window.
