# Validation — Sonya Req 1 Correction

## Title
Sonya Req 1 — Missing Campaigns Correction Validation

## Date
2026-07-08

## Member
Sonya

## Requirement
Requirement 1 — Campaign Data (Correction)

## PostgreSQL Source
public.ppc_etl_performance_data

## Correction Checklist

| # | Check | Status |
|---|---|---|
| 1 | EUR_76 (23526695953) already present | ✅ Was already in dashboard |
| 2 | English_EU (23914872425) found in ppc_etl_performance_data | ✅ FOUND |
| 3 | English_EU added to RAW array | ✅ ADDED |
| 4 | Muguntha DM 46 (20810136438) found in ppc_etl_performance_data | ✅ FOUND |
| 5 | Muguntha DM 46 added to RAW array | ✅ ADDED |
| 6 | Other Muguntha campaigns NOT included | ✅ SAFE — only ID 20810136438 |
| 7 | Total campaigns now 9 | ✅ |
| 8 | L30 data correct for both new campaigns | ✅ |
| 9 | BL data correct for both new campaigns | ✅ |
| 10 | ROAS segments correct for new campaigns | ✅ |
| 11 | Existing 7 campaigns unchanged | ✅ |
| 12 | UI preserved | ✅ |
| 13 | No PostgreSQL write | ✅ |
| 14 | No git push | ✅ |
| 15 | No deployment | ✅ |

## New Campaigns Validated

| Campaign ID | Name | L30 ROAS | Segment |
|---|---|---|---|
| 23914872425 | English_EU \| Top Selling | 128.96% | Worst |
| 20810136438 | Muguntha \| DM 46 All | 324.09% | OK |

## Inclusion Rule — Safe Filter

Original filter `campaign_name ILIKE '%Sonya%'` missed:
- English_EU (23914872425) — name contains 'Sonya' but was not yet in truth registry
- Muguntha DM 46 (20810136438) — name does not contain 'Sonya'

Corrected approach: hardcode confirmed campaign IDs in RAW array to prevent over-inclusion.
No wildcard on Muguntha — prevents unrelated Muguntha campaigns from being included.

## PASS / FAIL

**✅ PASS**

Both missing campaigns found in public.ppc_etl_performance_data and added. Safe inclusion logic applied. 9 campaigns total. Existing UI preserved.
