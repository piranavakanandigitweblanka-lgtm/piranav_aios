# Implementation Notes — Sonya Req 1 Correction

## Title
Sonya Req 1 — Missing Campaigns Correction

## Date
2026-07-08

## What Changed

### Problem
Original filter `campaign_name ILIKE '%Sonya%'` returned 7 campaigns but missed:
1. English_EU (23914872425) — name contains 'Sonya' but not yet in truth registry at query time
2. Muguntha DM 46 All (20810136438) — name contains 'Muguntha', not 'Sonya'

### Solution
Hardcoded all 9 confirmed campaign IDs directly in the RAW array in sonya.html.
This avoids reliance on dynamic name-based filtering which can miss campaigns due to:
- Registry lag (name not yet in cppc_campaign_truth_registry_v1)
- Cross-staff ownership (Muguntha campaign managed by Sonya)

### RAW Array — Before (7 campaigns)
21435967873, 22943583032, 23526695953, 23515806682, 23729304135, 22847654610, 23793722836

### RAW Array — After (9 campaigns)
20810136438 (Muguntha DM 46 — NEW)
21435967873
22943583032
23526695953
23914872425 (English_EU — NEW)
23515806682
23729304135
22847654610
23793722836

### Safe Muguntha Rule
Only campaign 20810136438 is included. No ILIKE '%Muguntha%' wildcard used.
Other Muguntha campaigns (different IDs/names) are not included.

## Files Modified
- `Staff-requirements/pages/sonya.html` — RAW data array, chips, info-note, tbar, validation box, footnotes, footer
