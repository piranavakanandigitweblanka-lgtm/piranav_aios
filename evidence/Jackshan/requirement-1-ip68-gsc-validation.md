---
name: jackshan-r1-ip68-gsc-validation
description: IP68 GSC validation — comparison of GSC UI screenshot vs PostgreSQL for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — IP68 GSC Validation

**Product URL:** `https://ledsone.co.uk/products/ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599`  
**Date:** 2026-07-13  
**Reporting Window:** 2026-06-11 to 2026-07-10 (latest 30 days)

---

## GSC Screenshot vs PostgreSQL Comparison

| Metric | GSC UI Screenshot | PostgreSQL (30-day) | Difference | Result |
|--------|-------------------|---------------------|------------|--------|
| Page Clicks | 2 | 0 | -2 | MISMATCH |
| Page Impressions | 351 | 0 | -351 | MISMATCH |
| Page CTR | 0.6% | N/A | — | MISMATCH |
| Page Avg Position | 7.8 | N/A | — | MISMATCH |

---

## Investigation

**Why does PostgreSQL show 0 for the 30-day window?**

The IP68 product URL has GSC data in PostgreSQL, but only up to 2026-05-15:

```sql
SELECT MIN(date), MAX(date), SUM(clicks), SUM(impressions)
FROM google_search_console.query_page
WHERE site_url = 'sc-domain:ledsone.co.uk'
  AND search_type = 'web'
  AND page = 'https://ledsone.co.uk/products/ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599';

-- Result: min=2026-03-20, max=2026-05-15, clicks=2, impressions=297
```

The 30-day reporting window starts at 2026-06-11. The IP68 product's most recent GSC data in PostgreSQL is 2026-05-15 — **27 days before the window starts**. This product has received no new GSC impressions in the period 2026-06-11 to 2026-07-10 according to the PostgreSQL import.

**Root cause options:**
1. **Incomplete GSC import:** The GSC import for this specific product may not have been fully captured after 2026-05-15
2. **Page dropped from GSC index:** The page may have lost GSC visibility after May 2026
3. **Canonical page mismatch:** Google may be attributing traffic to a variant URL (e.g. with UTM params or locale prefix) not matched by the exact canonical URL
4. **Screenshot from different period:** The GSC UI screenshot may show data from a different (earlier) date range than the 30-day window

**Lifetime PostgreSQL data for this URL:** 2 clicks, 297 impressions (2026-03-20 to 2026-05-15) — which is close to but not identical to the screenshot values (2 clicks, 351 impressions). The click count matches; the impression count differs by 54.

**Conclusion:** Data not reproducible from PostgreSQL for the latest 30-day window. IP68 product assigned `Data validation required` action and `Product resolved — no matched GSC data` status for the 30-day dashboard.

---

## Old Incorrect URL

The previous dashboard used the incorrect handle:
`ip68-waterproof-junction-box-outdoor-for-electrical-cable-wire-connector-5599`

The authoritative URL is:
`ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599`

**Old incorrect URL occurrence in current jakshan.html:** 0 ✓  
**Correct URL occurrence in current jakshan.html:** 1 ✓
