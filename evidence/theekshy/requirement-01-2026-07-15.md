# Evidence Record — Theekshy Requirement 1

- **Title:** Campaign Optimisation Dashboard — Evidence Record
- **Task:** Build Req 1 into pages/theekshy.html
- **Date:** 2026-07-15
- **Member:** Theekshy
- **Team:** Google Ads
- **Requirement:** 1 — Campaign Optimisation
- **Source:** What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv
- **Objective:** Document all evidence gathered during implementation
- **Dashboard Tab:** Campaign Optimisation (Requirement 1)
- **Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
- **Store and Country:** LEDSone UK / United Kingdom
- **Date Range:** 2026-06-15 to 2026-07-14
- **Latest Data Date:** 2026-07-14
- **PostgreSQL Environment:** ledsone-db-mcp (read-only SELECT only)
- **PostgreSQL Sources:** google_ads schema (campaigns, campaign_performance, product_performance, merchant_products)
- **Tables or Views:** See PostgreSQL section below
- **Join Keys:** campaign_id (bigint), product_item_id::text = merchant_products.product_id
- **Files Changed:** Staff-requirements/pages/theekshy.html
- **Business Rules:** 6 rules per CSV
- **Evidence:** This file
- **Validation:** validation/theekshy/requirement-01-2026-07-15.md
- **Reviewer:** GPT / Piranav
- **Status:** PASS
- **Risks:** Action log empty; product title join partial
- **Next Action:** Vercel deployment approval
- **PASS / FAIL:** PASS

## Stage 1 — Requirement CSV Evidence

File found: `C:/Users/PC/Downloads/What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv`
Note: Exact filename in prompt was `(1)(1).csv` — closest match `(1).csv` used and confirmed correct.

CSV contains 4 requirements:
1. Campaign Optimisation (High priority)
2. Search Term Optimisation (High priority)
3. Feed Optimisation (Medium priority)
4. Stock Status (High priority)

Requirement 1 — Campaign Optimisation fields extracted:
- 6 conditions/thresholds (rows 14–20 of CSV)
- 19-column action log (row 23 of CSV)
- Review window rule: Next Review Date = Date Optimised + 14 days
- Sample rows: 2 rows (row 24–25) — treated as requirement examples only, NOT live data

Campaign label mapping from CSV samples:
- "Mystery – Performance Max" → authoritative name: Pmax | Theekshy | Shoptimised | THEE_MYSTERY| Non-Converting | MCV | UK
- "Gems – Performance Max" → authoritative name: Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK

## Stage 2 — AIOS Asset Search Evidence

Search: `find C:/Users/PC/Documents/piranav_aios -iname "*theekshy*"`

Results found:
- Staff-requirements/pages/theekshy.html (placeholder — safe to update)
- shopify_projects/ledsone-uk-theme/templates/page.Theekshy_NS.liquid (unrelated Shopify template)

No existing Theekshy AIOS folders found in: prompts/, evidence/, validation/, implementation/, capability/, closure/, deployment/
All 7 folders created fresh. No duplicate risk.

## Stage 3 — Existing Dashboard Evidence

Prior theekshy.html content: minimal placeholder (25 lines), badge "Pending", no data, no tabs.
Safe to replace entirely — no existing working functionality to preserve.

Design reference: sonya.html — CSS design system, tab nav pattern, KPI cards, badge styles, table layout adopted.

## Stage 4 — PostgreSQL Evidence (read-only)

### Schemas and tables inspected:
- `information_schema.tables` — searched for product/pmax/etl/workbook/passport/action/queue/truth/registry tables
- staging_ai schema: **does not exist** (0 rows returned)
- public schema ppc/product/optimis tables: **none found**
- google_ads.product_performance: **exists** — confirmed authoritative product-level source

### google_ads.product_performance columns:
id, date, campaign_id, ad_group_id, product_item_id (varchar), parent_id, variation_id, is_updated, merchant_id, impressions, clicks, conversions, conversion_value, cost, ctr, avg_cpc, created_at, updated_at

### Both campaigns confirmed in google_ads.campaigns:
- 23714290257: THEE_GEMS — ENABLED — £20 budget — tROAS 4.00 — PERFORMANCE_MAX
- 23684837882: THEE_MYSTERY — ENABLED — £10 budget — tROAS 2.50 — PERFORMANCE_MAX

### Latest data date: 2026-07-14
### Earliest data date: 2026-03-23

### 30-day campaign performance (2026-06-15 to 2026-07-14):
- THEE_GEMS: cost £293.22, clicks 946, imp 55,079, conv 31.04, cv £940.94, ROAS 3.21x → Monitor
- THEE_MYSTERY: cost £295.56, clicks 624, imp 40,520, conv 19.14, cv £651.73, ROAS 2.21x → Critical

### Product-level data:
- 60 daily rows retrieved for THEE_GEMS across 30 days
- 60+ daily rows retrieved for THEE_MYSTERY across 30 days
- Top 30 products by cost extracted per campaign (60 total embedded in dashboard)
- Product title join: merchant_products.product_id matches subset of product_item_ids; most large variant IDs return null title

### Duplicate row check: product_performance rows are per product_item_id per date — aggregated by SUM() in queries, no duplicate risk in embedded data

### Currency: GBP (LEDSone UK, merchant_id 5309914352)

### Optimisation event source:
- No cppc_* tables in staging_ai (schema absent)
- No action_log or optimisation_log tables found
- No AIOS records with prior optimisation events for Theekshy
- Result: action log shows empty state

## No-Write Confirmation
All PostgreSQL operations were SELECT-only. No INSERT, UPDATE, DELETE, ALTER, DROP, CREATE, TRUNCATE, GRANT, or REVOKE performed.

## Git Status
Git commit: Not performed
Git push: Not performed

## Deployment Status
Vercel deployment: Not performed
Approval required: Yes
