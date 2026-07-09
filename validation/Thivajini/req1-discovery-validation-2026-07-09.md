# Thivajini Req 1 — Validation Record
## Google Ads vs Shopify Revenue Reconciliation — LEDSone FR

**Title:** Discovery Validation  
**Purpose:** Record validation result of data source discovery for Req 1  
**Requirement source:** Thivajini — recurring weekly reconciliation, flags variance  
**Team member:** Thivajini  
**Business question:** Does Google Ads conversion value match Shopify UTM-attributed revenue weekly?  
**Validation date:** 2026-07-09  
**Validated by:** Claude Code — read-only PostgreSQL  

---

## Validation Checklist

| Item | Required | Result |
|------|----------|--------|
| Existing AIOS assets checked | ✅ | No existing reconciliation dashboard found |
| PostgreSQL schemas inspected read-only | ✅ | public, raw_data, staging_ai, analytics, cppc_intelligence |
| Google Ads conversion value source identified | ✅ | `public.ppc_etl_performance_data` — sub_source_id=233 |
| Shopify UTM attribution source identified | ❌ | No production UTM data found in any table |
| GA4 source/medium data available | ❌ | `raw_data.ga4_source_medium_daily` exists but 0 rows |
| Weekly comparison feasibility proved | ❌ | Blocked — Shopify side missing |
| Variance calculation documented | ✅ | Formula documented, pending data |
| Duplicate dashboard risk checked | ✅ | No duplicate found |
| Evidence saved | ✅ | See evidence file |
| GPT has enough info to approve build | PARTIAL | Enough to decide on data gap remediation path |

---

## Stop Conditions Hit

1. **Shopify UTM attribution fields missing** — `public.shopify_transactions` has no utm_source, no gclid, no landing_site
2. **GA4 data table empty** — `raw_data.ga4_source_medium_daily` has 0 rows (pipeline not active)
3. **Order truth pilot is STAGING only** — `cppc_order_truth_pilot` has 100 rows, all utm_source=NULL

---

## PostgreSQL Sources Checked

| Table | Schema | Rows | utm_source | Google Ads data | Result |
|-------|--------|------|-----------|-----------------|--------|
| ppc_etl_performance_data | public | 139,225 (FR) | N/A | ✅ sales, spend, orders | GOOGLE ADS SOURCE CONFIRMED |
| shopify_transactions | public | multiple | ❌ absent | ❌ | SHOPIFY SOURCE MISSING |
| order_transaction | public | multiple | ❌ absent | ❌ | AMAZON TABLE, NOT SHOPIFY |
| ga4_source_medium_daily | raw_data | 0 | ✅ in schema | ✅ in schema | DATA NOT LOADED |
| cppc_order_truth_pilot | staging_ai | 100 | ✅ schema, NULL data | ✅ schema, NULL data | STAGING PILOT ONLY |
| marketing_sales_truth_ledger | staging_ai | unknown | ❌ absent | ❌ | NO ATTRIBUTION |

---

## Validation Result

**BLOCKED**

Cannot validate reconciliation because the Shopify UTM revenue side has no production data source.

---

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** BLOCKED — Shopify UTM data gap must be resolved before build  
**Next validation:** After data gap is remediated and data source confirmed  
