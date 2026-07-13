---
name: jackshan-r1-url-recovery-evidence
description: Evidence for URL recovery task — Jackshan Requirement 1 — all 7 unresolved product URLs recovered from authoritative Excel source
metadata:
  type: project
---

# Jackshan Requirement 1 — URL Recovery Evidence

**Task:** Fix seven allocated product URLs that were truncated or unresolved in the dashboard  
**Date:** 2026-07-10  
**Authoritative Source:** `Jackshanan _ SEO_tasksheet_digitweb (2).xlsx` — Column A, rows 4–53  
**Staff Owner:** Jackshan  
**Reviewer:** Piranav  

---

## Root Cause

The product allocation CSV (`Jackshan Product Allocation - Sheet1.csv`) contained truncated URLs with `…` ellipsis in 21 of 50 rows. Session 3 recovered 17 of these from PostgreSQL pattern matching but 4 remained unresolvable, and 3 more had incorrect URLs. The authoritative Excel source file provided full canonical URLs for all 50 products.

---

## Authoritative Source File

**File:** `Jackshanan _ SEO_tasksheet_digitweb (2).xlsx`  
**Location:** `C:\Users\PC\Downloads\`  
**Column:** A (hyperlinks), rows 4–53  
**Format:** Full canonical URLs — `https://ledsone.co.uk/products/{handle}`

---

## Seven Unresolved Product URLs (Before Recovery)

| # | Fragment in HTML | Status | Issue |
|---|-----------------|--------|-------|
| 1 | `ip68-waterproof-junction-box-case-for-electrical-cable-wire-connecto…` | Truncated | CSV ellipsis; no PostgreSQL match |
| 2 | `ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shad…` | Truncated | CSV ellipsis; no PostgreSQL match |
| 3 | `ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-variation-lam…` | Truncated | CSV ellipsis; no PostgreSQL match |
| 4 | `fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with…` | Truncated | CSV ellipsis; no PostgreSQL match |
| 5 | `pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-black` | Wrong URL | Session 3 chose wrong handle variant |
| 6 | `tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light-decorative-home` | Wrong URL | Session 3 chose handle without -4541 suffix |
| 7–9 | dc12v-60w, red-wicker, b22-t185 | Wrong status label | Showed "No matched GSC data" instead of "Product resolved — no matched GSC data" |

---

## Recovered Full URLs

| # | Excel Row | Full Canonical URL | GSC Match | Action |
|---|-----------|-------------------|-----------|--------|
| 1 | A4 | `https://ledsone.co.uk/products/ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599` | YES — 1 click, 19 imp | Rewrite |
| 2 | A11 | `https://ledsone.co.uk/products/ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shade-e27-uk-holder` | No match | Data validation required |
| 3 | A22 | `https://ledsone.co.uk/products/ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-variation-lamp-holder` | YES — 0 clicks, 16 imp | Do not optimize |
| 4 | A46 | `https://ledsone.co.uk/products/fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with-glass` | No match | Data validation required |
| 5 | A8 | `https://ledsone.co.uk/products/pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-rose-gold` | YES — 0 clicks, 340 imp | Intent mismatch |
| 6 | A9 | `https://ledsone.co.uk/products/tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light-decorative-home-4541` | YES — 0 clicks, 12 imp | Do not optimize |

---

## PostgreSQL Objects Checked

```sql
-- GSC match for ip68-case URL
SELECT query, SUM(clicks) clicks, SUM(impressions) impressions
FROM google_search_console.query_page
WHERE site_url = 'sc-domain:ledsone.co.uk'
  AND search_type = 'web'
  AND page ILIKE '%ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599%'
  AND date BETWEEN '2026-04-07' AND '2026-07-07'
GROUP BY query ORDER BY clicks DESC, impressions DESC LIMIT 1;
-- Result: "coaxial cable junction box" | 1 click | 19 imp | pos 6.1

-- GSC match for ceramic-variation URL
SELECT query, SUM(clicks), SUM(impressions)
FROM google_search_console.query_page
WHERE page ILIKE '%ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-variation-lamp-holder%'
  AND site_url='sc-domain:ledsone.co.uk' AND search_type='web';
-- Result: "ceramic lamp holder screwfix" | 0 clicks | 16 imp | pos 10.8

-- GSC match for pendant-rose-gold URL
SELECT query, SUM(clicks), SUM(impressions)
FROM google_search_console.query_page
WHERE page ILIKE '%pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-rose-gold%'
  AND site_url='sc-domain:ledsone.co.uk' AND search_type='web';
-- Result: "rose gold light fitting" | 0 clicks | 340 imp | pos 7.9

-- GSC match for tiffany-4541 URL
SELECT query, SUM(clicks), SUM(impressions)
FROM google_search_console.query_page
WHERE page ILIKE '%tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light-decorative-home-4541%'
  AND site_url='sc-domain:ledsone.co.uk' AND search_type='web';
-- Result: "mediterranean lamp shades" | 0 clicks | 12 imp | pos 6.7
```

---

## KPI Changes

| KPI | Before Recovery | After Recovery | Change |
|-----|----------------|----------------|--------|
| Products with GSC | 43 | 45 | +2 (ip68, ceramic) |
| No GSC / Data Validation | 7 | 5 | -2 |
| Rewrite | 10 | 11 | +1 (ip68) |
| Intent Mismatch | 4 | 5 | +1 (rose-gold replaced corded-black) |
| Do Not Optimize | 29 | 29 | 0 (net: +ceramic -pendant-corded-black) |
| Data Validation Required | 7 | 5 | -2 (ip68 → Rewrite; ceramic → DNO) |
| Action total | 50 | 50 | PASS |
| GSC total | 50 | 50 | PASS |

---

## Files Modified

| File | Change |
|------|--------|
| `Staff-requirements/pages/jakshan.html` | 9 JS object replacements; KPI cards updated (kpi-with-gsc=45, kpi-no-gsc=5, kpi-rewrite=11, kpi-intent=5, kpi-dno=29, kpi-validation=5) |
| `evidence/Jackshan/requirement-1-url-recovery.md` | This file |
| `evidence/Jackshan/requirement-1-url-recovery.csv` | CSV of all recovered URLs |
| `validation/Jackshan/requirement-1-url-validation.md` | URL-level validation table |

---

## Final State

- All 50 product rows: complete canonical `https://ledsone.co.uk/products/` URLs
- Zero ellipsis (`…`) in any productUrl field
- Zero duplicate URLs
- KPI reconciliation: 45 + 5 = 50; 11 + 5 + 29 + 5 = 50
- Badge: FAIL — DATA COVERAGE (unchanged; 9 days GSC vs 91 required)
