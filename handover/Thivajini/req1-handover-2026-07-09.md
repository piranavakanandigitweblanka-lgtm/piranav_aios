# Thivajini Req 1 — Handover Record
## Google Ads vs Shopify Revenue Reconciliation — LEDSone FR

**Title:** Req 1 Handover — Discovery Complete, Status Page Built, Build Blocked  
**Purpose:** Handover state so next session can resume without re-discovery  
**Team member:** Thivajini  
**Date:** 2026-07-09  
**Status:** BLOCKED — Shopify UTM data gap

---

## What Was Done

1. Searched all AIOS folders for existing reconciliation assets — none found
2. Inspected 6 PostgreSQL schemas read-only
3. Confirmed Google Ads conversion value source: `public.ppc_etl_performance_data` (sub_source_id=233 = LEDSone FR)
4. Found Shopify UTM attribution is MISSING from all production tables
5. Found GA4 source/medium table exists but has zero rows
6. Documented all findings, stop conditions, alternative paths
7. Created evidence, validation, prompt, handover, report files
8. **Built blocked-status page: `Staff-requirements/pages/thivagini.html`** — shows Req 1 data readiness status, no fake numbers, includes all sources, fields required, next actions, evidence links

## What Is Blocked

- Weekly reconciliation cannot be built until Shopify UTM revenue data is available
- GA4 ETL pipeline must be activated for ledsone.fr OR a Shopify order UTM ETL must be built
- DO NOT build HTML dashboard until GPT approves and data source is confirmed

## Files Created / Updated

| File | Path | Status |
|------|------|--------|
| Staff page (blocked status) | `Staff-requirements/pages/thivagini.html` | ✅ UPDATED |
| Discovery evidence | `evidence/Thivajini/req1-discovery-evidence-2026-07-09.md` | ✅ Created |
| Validation record | `validation/Thivajini/req1-discovery-validation-2026-07-09.md` | ✅ Created |
| GPT prompt capture | `prompts/Thivajini/req1-gpt-discovery-prompt-2026-07-09.md` | ✅ Created |
| Handover | `handover/Thivajini/req1-handover-2026-07-09.md` | ✅ This file |
| Discovery report | `reports/Thivajini/req1-discovery-report-2026-07-09.md` | ✅ Created |

## Next Session Resume Instructions

When GPT approves and data gap is resolved:
1. Confirm which Shopify revenue source to use (GA4 ETL or Shopify order UTM ETL)
2. Confirm sub_source_id=233 = LEDSone FR with tech team
3. Verify Shopify/GA4 revenue data is loaded and queryable
4. Run both sides of the reconciliation SQL and validate results are real
5. Build full reconciliation HTML dashboard (weekly table, 13-week rolling, colour-coded PASS/REVIEW/FAIL)
6. Save report to `reports/Thivajini/` 
7. Update `Staff-requirements/pages/thivagini.html` status from BLOCKED → LIVE

## Google Ads SQL (ready when Shopify side is resolved)

```sql
SELECT
  DATE_TRUNC('week', date) AS week_start,
  ROUND(SUM(sales)::numeric, 2) AS google_ads_conversion_value,
  ROUND(SUM(spend)::numeric, 2) AS google_ads_spend,
  ROUND(SUM(orders)::numeric, 2) AS google_ads_conversions
FROM public.ppc_etl_performance_data
WHERE source = 3
  AND sub_source_id = 233
  AND record_type = 'campaign'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week_start DESC;
```

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
