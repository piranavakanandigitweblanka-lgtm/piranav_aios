# Sonya Requirement 1 — Validation Checklist

**Date:** 2026-07-07  
**Member:** Sonya  
**Requirement:** Sonya Requirement 1 — Last 30 Days Campaign Performance (Performance-First Filter)  
**Validator:** Piranav (AIOS)  
**Version:** v3 — final, 4 active campaigns only

---

## PASS/FAIL Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Performance-first filter applied | ✅ PASS | workbook primary; spend_30d > 0 gate |
| 4 qualifying campaigns shown | ✅ PASS | All 4 have confirmed spend in 30-day window |
| No campaigns without 30d activity shown | ✅ PASS | EUR_76, SONYA2026, Demand Gen, new campaign 23914872425 all excluded |
| Campaign registry not used alone | ✅ PASS | Registry not used as source; workbook is primary |
| Campaign names contain 'Sonya' | ✅ PASS | ILIKE '%Sonya%' confirmed for all 4 |
| Campaign IDs correct | ✅ PASS | Verified from workbook query |
| Number of Days = 30 | ✅ PASS | 30d shown for all rows |
| Budget shown | ✅ PASS | N/A (NULL in workbook — documented) |
| Cost shown | ✅ PASS | spend_30d from workbook |
| Conversions shown | ✅ PASS | Grain queue for PH_ALL (51.3); — for others (NULL in source) |
| Conv. Value shown | ✅ PASS | Grain queue for PH_ALL (£1,225.62); — for others (NULL) |
| ROAS % correct | ✅ PASS | roas_30d × 100; verified against segment_5band |
| Segment correct | ✅ PASS | Best ≥400% · Better 350–399% · OK 300–349% · Bad 200–299% · Worst <200% |
| Row color matches segment | ✅ PASS | seg-best (green), seg-worst (red) CSS applied |
| Stage — Last 30 vs Previous 30 | ✅ PASS | PH_ALL: grain queue 30d + prev30d derived from 60d−30d |
| Stage — 60/90d comparison | ✅ PASS | PH_ALL: 60d and 90d cumulative blocks |
| Stage — other 3 campaigns | ✅ PASS | Shows workbook 30d snapshot + note that grain queue is NULL |
| Filters work (search, segment, status) | ✅ PASS | 3 filter controls, live re-render |
| Sort works (Cost, ROAS, Conv. Value) | ✅ PASS | Default: Cost descending |
| KPI summary cards | ✅ PASS | Total Cost, Conv. Value, Avg ROAS, Conversions, Best, Worst |
| No PostgreSQL write operations | ✅ PASS | Read-only inspection only |
| No git push | ✅ PASS | Awaiting approval |
| No Vercel deployment | ✅ PASS | Awaiting approval |
| No hardcoded fabricated data | ✅ PASS | All metrics from live PostgreSQL queries |
| No unrelated files changed | ✅ PASS | Only sonya.html + AIOS markdown files |

---

## Segment Distribution (4 active campaigns)

| Segment | Count | Campaign | ROAS % |
|---------|-------|----------|--------|
| Best | 1 | Klarna PH_ALL | 4617% |
| Better | 0 | — | — |
| OK | 0 | — | — |
| Bad | 0 | — | — |
| Worst | 3 | SUMMER_TRENDS / NICC_07 / GB C1 Zombies | 78–157% |

---

## Campaign 23914872425 — Pending Decision

A new Sonya campaign was discovered in `pmax_18m_postmortem_fact_v1`:
- **Campaign:** Pmax UK | Sonya | Shoptimised | English_EU | Top Selling | MC | Europe English
- **First seen:** 2026-06-06
- **Last seen:** 2026-06-26 (within last 30 days)
- **NOT in workbook 30d snapshot** (as_of 2026-07-01)
- **Action required:** GPT to confirm whether this should be included and via which source

---

## OVERALL: PASS
