# Closure — Sonya Requirement 1

## Title
Sonya Req 1 — Campaign Data Source Migration

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## Requirement Source
Sonya Spreadsheet

## PostgreSQL Source
public.ppc_etl_performance_data

## Files Changed
- `Staff-requirements/pages/sonya.html` — Requirement 1 JavaScript data and logic updated

## Evidence
- `evidence/sonya/req1-source-migration-evidence-2026-07-08.md`

## Validation
- `validation/sonya/req1-implementation-validation-2026-07-08.md`

## Implementation Notes
- `implementation/sonya/req1-implementation-notes-2026-07-08.md`

## Reviewer
Claude Code — AIOS execution worker

## Status
✅ COMPLETE

## Summary
Requirement 1 in sonya.html updated from cppc_workbook/grain_queue sources to public.ppc_etl_performance_data (daily-grain, source=3). Campaign filter applied via cppc_campaign_truth_registry_v1 — 7 Sonya campaigns confirmed. Table now shows all 10 spreadsheet columns. Stage column shows Last 30 Days (2026-06-08 to 2026-07-07) and Before Last (2026-05-09 to 2026-06-07) comparison blocks. ROAS segment row colours applied. Existing UI fully preserved.

## Known Risks
- Budget field: not available in ppc_etl_performance_data — shown as N/A
- Campaign 22847654610: minimal spend (£2.48) in last 30d — confirm if should be excluded
- Campaign 23793722836: no spend in last 30d — confirm if should be excluded

## Next Action
- Await Sonya approval of 7-campaign count
- Confirm budget source if required
- Git commit and push when approved

## PASS / FAIL
**✅ PASS**
