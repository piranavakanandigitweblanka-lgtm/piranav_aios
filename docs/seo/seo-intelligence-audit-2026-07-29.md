# AIOS SEO Data Discovery & Capability Audit
**Target:** ledsone.co.uk | **Date:** 2026-07-29 | **Analyst:** Claude Code (AIOS)

---

## SECTION 1 — PostgreSQL DATABASE

### Connection Status
**WORKING** ✓ — 18 schemas discovered, 3 directly SEO-relevant.

### Full Schema Inventory

| Schema | Tables | SEO Relevance |
|--------|--------|---------------|
| `google_search_console` | 7 | **PRIMARY — GSC data** |
| `google_analytics` | 2 | **PRIMARY — GA4 data** |
| `google_ads` | 21 | **PRIMARY — Paid + Search Terms** |
| `listings` | 16 | Product listings, SKUs |
| `inventory` | 7 | Stock data |
| `order_management` | 15 | Order history |
| `customers` | 3 | Customer data |
| `suppliers` | 15 | Supplier data |
| `accounting` | 5 | Financial data |
| `amazon_campaigns` | 5 | Amazon Ads |
| `amazon_fba` | 1 | Amazon fulfilment |
| `ebay_campaigns` | 6 | eBay Ads |
| `business_reports` | 3 | Business reporting |
| `employee_management` | 10 | Staff |
| `customer_service` | 8 | Support |
| `public` | 4 | System tables |
| `reports` | 0 | Empty |
| `staff` | 3 | Staff |

**No materialised views detected. No dedicated SEO views exist.**

---

## SECTION 2 — GOOGLE SEARCH CONSOLE (PostgreSQL)

### Connection Status
**WORKING** ✓ — GSC data is stored in PostgreSQL via sync pipeline.

### Tables Discovered

| Table | Rows | Purpose |
|-------|------|---------|
| `query` | 2,944,984 | Queries × date: clicks, impressions, CTR, position |
| `query_page` | 5,754,423 | Query + landing page combination (most granular) |
| `page` | 1,683,389 | Landing page level aggregation |
| `country` | 190,456 | Performance by country |
| `device` | 6,175 | Performance by device type |
| `overview` | 4,308 | Site-level daily totals |
| `appearance` | **0** | **EMPTY — Search Appearance data not populated** |

### Columns Available (query table)
`id`, `search_type`, `site_url`, `sub_source`, `date`, `query`, `row_hash`, `clicks`, `impressions`, `ctr`, `position`

### Properties in GSC

| Property |
|----------|
| `sc-domain:ledsone.co.uk` ✓ |
| `sc-domain:electricalsone.co.uk` |
| `sc-domain:ledsone.us` |
| `sc-domain:vintagelite.co.uk` |
| `https://ledsone.de/` |
| `https://ledsone.fr/` |
| `https://besbet.co.uk/` |
| `https://dcvoltage.co.uk/` |

### Date Range (ledsone.co.uk only)

| Metric | Value |
|--------|-------|
| Earliest Date | **2026-03-20** |
| Latest Date | **2026-07-26** |
| Total Duration | **~4.3 months** |
| Distinct Days | 129 |
| Records (ledsone.co.uk) | 1,290,036 |
| Search Types | web, image, news, video |

### Fields Available

| Field | Available |
|-------|-----------|
| Clicks | YES |
| Impressions | YES |
| CTR | YES |
| Average Position | YES |
| Queries | YES |
| Landing Pages | YES |
| Countries | YES |
| Devices | YES |
| Search Appearance | **NO — table empty** |
| Index Coverage | **NO — not in schema** |

### Monthly History Check

| Period | Available |
|--------|-----------|
| Last Month | YES |
| Last Quarter | YES |
| Last 12 Months | **NO** |
| Last 24 Months | **NO** |
| Last 36 Months | **NO** |

**Can GSC provide 36 months? NO — History starts 2026-03-20. Only ~4 months available.**

> **Gap:** GSC has a 16-month native retention window. Data prior to March 2026 was not imported. Pre-March 2026 history is permanently lost unless an earlier export exists.

---

## SECTION 3 — GOOGLE ANALYTICS 4 (PostgreSQL)

### Connection Status
**WORKING (Limited)** ⚠️ — GA4 data is stored in PostgreSQL but coverage is narrow.

### Tables Discovered

| Table | Rows | Purpose |
|-------|------|---------|
| `organic_landing_page_revenue` | 265,740 | Organic sessions + revenue by landing page |
| `traffic_source_revenue` | 13,943 | Sessions + revenue by source/medium (all channels) |

### Columns Available (organic_landing_page_revenue)
`property_id`, `run_date`, `date_start`, `date_end`, `landing_page`, `session_default_channel_group`, `sessions`, `active_users`, `ecommerce_purchases`, `purchase_revenue`

### GA4 Property

| Property ID | Records |
|-------------|---------|
| `408110563` | 265,740 |

### Date Range

| Table | Earliest | Latest | Distinct Periods |
|-------|----------|--------|-----------------|
| `organic_landing_page_revenue` | **2026-03-12** | **2026-07-26** | 44 report windows |
| `traffic_source_revenue` | **2026-03-12** | **2026-07-27** | 45 report windows |

> **Critical note:** These tables store aggregate report exports (date_start / date_end windows), NOT daily rows. The 265,740 records represent landing-page level data within those report windows. Only 2 distinct calendar months exist when grouped by month.

### Monthly Data Sample (Organic Landing Page)

| Month | Sessions | Users | Purchases | Revenue (£) | Landing Pages |
|-------|----------|-------|-----------|-------------|---------------|
| 2026-04 | 602,719 | 512,117 | 17,924 | £637,089 | 6,978 |
| 2026-03 | 478,898 | 408,817 | 14,566 | £522,550 | 7,003 |

### Fields Available

| Field | Available |
|-------|-----------|
| Organic Sessions | YES |
| Active Users | YES |
| New Users | **NO — not in schema** |
| Engaged Sessions | **NO — not in schema** |
| Revenue | YES |
| Transactions / Purchases | YES |
| Orders | YES (via ecommerce_purchases) |
| Conversion Rate | **NO — not stored, derived only** |
| Landing Pages | YES |
| Source / Medium | YES (traffic_source_revenue) |
| Default Channel Group | YES |
| Device | **NO — not in schema** |
| Country | **NO — not in schema** |

### Monthly History Check

| Period | Available |
|--------|-----------|
| Last Month | YES |
| Last Quarter | **PARTIAL — only March–July 2026** |
| Last 12 Months | **NO** |
| Last 24 Months | **NO** |
| Last 36 Months | **NO** |

**Can GA4 provide 36 months? NO — Data starts 2026-03-12. Only ~4.5 months available.**

> **Gap:** GA4 can hold up to 14 months natively. Prior months were never imported. No daily granularity — data is period-aggregate exports only. Missing: new users, engaged sessions, device, country, conversion rate dimensions.

---

## SECTION 4 — GOOGLE ADS (PostgreSQL)

### Connection Status
**WORKING** ✓ — 21 tables, highly structured.

### Accounts in System

| Account | Market | Currency | Campaign Data From | Campaign Data To |
|---------|--------|----------|--------------------|-----------------|
| LEDSone (4503486236) | UK | GBP | **2020-02-13** | 2026-07-29 |
| ledsone.de (9031058245) | DE | EUR | 2023-09-01 | 2026-07-29 |
| Electricalsone New | UK | GBP | 2024-05-29 | 2026-07-29 |
| Vintagelite | UK | GBP | 2024-01-01 | 2025-07-02 |
| Besbet Ltd | UK | GBP | 2024-01-03 | 2026-04-11 |
| LEDSone FR | FR | EUR | 2025-08-01 | 2026-07-29 |
| DC Voltage | UK | GBP | 2026-03-29 | 2026-07-29 |
| Ledsone (US) | US | USD | 2025-10-28 | 2026-07-29 |

### Table Date Ranges

| Table | Earliest | Latest | Records | Notes |
|-------|----------|--------|---------|-------|
| `campaign_performance` | 2020-02-13 | 2026-07-29 | 52,728 | Full 6+ year history |
| `product_performance` | 2024-07-04 | 2026-07-29 | 10,304,054 | 2 years |
| `campaign_search_term_data` | 2025-10-01 | 2026-07-28 | 3,030,652 | 10 months only |
| `pmax_campaign_search_term_data` | 2026-06-01 | 2026-07-28 | 835,760 | 2 months only |
| `asset_performance` | 2025-08-01 | 2026-07-29 | 220,213 | 12 months |
| `asset_group_product_group_performance` | — | — | 181,186 | — |
| `keyword_performance` | 2025-01-20 | **2025-09-17** | 578 | **STOPPED — very sparse** |
| `merchant_products` | — | — | 516,658 | Feed snapshot |
| `campaigns` | — | — | 803 | Reference |
| `keywords` | — | — | 6,003 | Reference |

### Fields Available

| Field | Available |
|-------|-----------|
| Campaigns | YES |
| Search Terms | YES (10 months Search / 2 months PMax) |
| Keywords | YES (reference only — performance stopped Sep 2025) |
| Conversions | YES |
| Conversion Value | YES |
| Landing Pages | YES (via product/asset performance) |
| ROAS | Derivable (conv_value / cost) |
| Cost | YES |
| Clicks | YES |
| Impressions | YES |
| Campaign History (36 months) | **YES for campaign_performance** |

### Monthly History Check (LEDSone UK)

| Period | Campaign Performance | Search Terms |
|--------|---------------------|--------------|
| Last Month | YES | YES |
| Last Quarter | YES | YES |
| Last 12 Months | YES | YES |
| Last 24 Months | YES | NO |
| Last 36 Months | YES | NO |

**Can Google Ads provide 36 months? PARTIAL — Campaign-level YES (from 2020). Search term level NO (10 months only).**

---

## SECTION 5 — SEMRUSH

### Connection Status
**WORKING** ✓ — API connected, reports executing successfully.

### Historical Coverage for ledsone.co.uk (UK database)

| Period | Organic Keywords | Organic Traffic Est. |
|--------|-----------------|---------------------|
| Jun 2026 | 12,333 | 8,536/mo |
| Jan 2026 | 14,404 | 12,893/mo |
| Jun 2025 | 9,380 | 14,291/mo |
| Jan 2025 | 7,123 | 9,679/mo |
| Jun 2024 | 6,869 | 7,032/mo |
| Jan 2024 | 6,860 | 5,003/mo |
| Jun 2023 | 3,684 | 1,697/mo |
| Jan 2023 | 4,096 | 2,809/mo |
| Jan 2022 | 1,238 | 889/mo |
| Jan 2021 | 596 | 75/mo |
| **First data** | **Aug 2015** | — |

### Sample Current Keywords (July 2026)

| Keyword | Position | Volume | Traffic | KD | Intent |
|---------|----------|--------|---------|-----|--------|
| ledsone | 1 | 590 | 472 | 41 | Navigational |
| e27 led bulb | 7 | 4,400 | 96 | 19 | Commercial |
| spider lights | 1 | 720 | 95 | 9 | Commercial |
| retro light shades | 2 | 590 | 77 | 8 | Commercial |
| wiring and connectors | 2 | 2,900 | 69 | 31 | Commercial |

### Metrics Available

| Metric | Available |
|--------|-----------|
| Organic Traffic Estimate | YES |
| Organic Keywords | YES |
| Keyword History | YES (monthly from 2015) |
| Ranking History | YES (monthly positions) |
| Backlinks | YES (toolkit available) |
| Referring Domains | YES (toolkit available) |
| Authority Score | YES (domain_rank) |
| Visibility | YES (rank + keyword counts) |
| Competitors | YES (toolkit available) |
| Top Pages | YES (resource_organic_unique) |
| Keyword Positions | YES |
| Search Volume | YES |
| Keyword Difficulty | YES |
| Keyword Intent | YES |
| SERP Features (50+ types) | YES |
| AI Overview Keywords | YES |

### Monthly History Check

| Period | Available |
|--------|-----------|
| Last Month | YES |
| Last Quarter | YES |
| Last 12 Months | YES |
| Last 24 Months | YES |
| Last 36 Months | **YES** |

**Can SEMrush provide 36 months? YES — Monthly data available from Aug 2015 for ledsone.co.uk.**

---

## SECTION 6 — SHOPIFY

### Connection Status
**FAILED** ✗ — Socket closed unexpectedly. Error: `"The socket connection was closed unexpectedly."`

**All Shopify fields — Products, Collections, Orders, Revenue, Inventory, SKUs, URLs — UNAVAILABLE via direct API at time of audit.**

> **Note:** Product and order data may exist in `order_management` (15 tables) and `inventory` (7 tables) schemas in PostgreSQL. These were not fully audited for SEO-specific fields in this session.

---

## SECTION 7 — KEYWORD LEVEL DATA

| Requirement | Available | Source |
|-------------|-----------|--------|
| Keyword | YES | GSC query / SEMrush |
| Monthly Clicks | YES | GSC query (4 months only) |
| Monthly Impressions | YES | GSC query (4 months only) |
| Monthly Position | YES | GSC query / SEMrush (36 months) |
| Monthly CTR | YES | GSC query (4 months only) |
| Landing Page | YES | GSC query_page / SEMrush |
| Ranking History | YES | SEMrush (monthly, 36 months) |
| Keyword Intent | YES | SEMrush |
| Search Volume | YES | SEMrush |
| Difficulty | YES | SEMrush |

**Keyword-level data overall: PARTIAL — 36-month ranking history via SEMrush only. Click / impression / CTR data limited to 4 months via GSC.**

---

## SECTION 8 — PRODUCT LEVEL DATA

| Requirement | Available | Source |
|-------------|-----------|--------|
| Product ID | YES | Google Ads merchant_products (516k records) |
| SKU | YES | Google Ads merchant_products |
| URL | YES | Google Ads merchant_products |
| Organic Sessions | YES (4 months) | GA4 organic_landing_page_revenue |
| Organic Revenue | YES (4 months) | GA4 |
| Orders | YES (4 months) | GA4 |
| Keywords | YES | GSC query_page (4 months) / SEMrush |
| Average Position | YES | GSC (4 months) |
| CTR | YES | GSC (4 months) |
| Impressions | YES | GSC (4 months) |
| Clicks | YES | GSC (4 months) |
| Monthly History (36 months) | **NO** | No single source covers 36 months at product level |

**Product-level data: PARTIAL — All fields exist but only 4 months of historical coverage.**

---

## SECTION 9 — LANDING PAGE DATA

| Requirement | Available | Source |
|-------------|-----------|--------|
| Landing Page | YES | GA4 / GSC / SEMrush |
| Sessions | YES (4 months) | GA4 organic_landing_page_revenue |
| Revenue | YES (4 months) | GA4 |
| Orders | YES (4 months) | GA4 |
| Keywords | YES (4 months) | GSC query_page |
| CTR | YES (4 months) | GSC |
| Position | YES (4 months) | GSC / SEMrush |
| Monthly History (36 months) | **NO** | Not available in any source |

**Landing page data: PARTIAL — Fields present, 4-month depth only.**

---

## SECTION 10 — AI READINESS (Schema & Content Signals)

These require live site crawl or structured data extraction — not available via current data connections.

| Signal | Status | Reason |
|--------|--------|--------|
| Product Schema | **Not Available** | No crawl tool connected |
| FAQ Schema | **Not Available** | No crawl tool connected |
| Review Schema | **Not Available** | No crawl tool connected |
| Breadcrumb Schema | **Not Available** | No crawl tool connected |
| Organisation Schema | **Not Available** | No crawl tool connected |
| Internal Linking | **Not Available** | No crawl tool connected |
| Content Depth | **Not Available** | No crawl tool connected |
| Entity Coverage | **Not Available** | No crawl tool connected |
| Topical Authority | **Partially Available** | SEMrush topic/intent data available |
| Structured Data | **Not Available** | No crawl tool connected |
| EEAT Signals | **Not Available** | No crawl tool connected |
| Helpful Content | **Not Available** | No crawl tool connected |

---

## SECTION 11 — FINAL GAP ANALYSIS

| Requirement | Available | Source | Missing | Action Needed |
|-------------|-----------|--------|---------|---------------|
| 36-month GSC clicks/impressions | **NO** | GSC (PostgreSQL) | 32 months | Backfill GSC history via API; GSC retains 16 months natively |
| 36-month GA4 organic sessions | **NO** | GA4 (PostgreSQL) | 32 months | Import GA4 to BigQuery; backfill from BigQuery export |
| GA4 daily granularity | **NO** | GA4 (PostgreSQL) | No daily rows | Change pipeline to store daily GA4 rows, not aggregate exports |
| GA4 new users / engaged sessions | **NO** | GA4 (PostgreSQL) | Fields absent | Add dimensions to GA4 pipeline export |
| GA4 device & country dimensions | **NO** | GA4 (PostgreSQL) | Tables absent | Create ga4_device and ga4_country tables in pipeline |
| 36-month search term data | **NO** | Google Ads | Only 10 months | Extend search term import back to 2023 |
| GSC Search Appearance | **NO** | GSC (PostgreSQL) | Table empty | Fix appearance table pipeline sync |
| GSC Index Coverage | **NO** | GSC (PostgreSQL) | Not in schema | Add GSC Index Coverage API endpoint to pipeline |
| Keyword performance (Ads) | **PARTIAL** | Google Ads | Stopped Sep 2025 | Investigate why keyword_performance pipeline stopped; re-enable |
| Shopify API | **NO** | Shopify MCP | Connection failed | Fix Shopify MCP connection; verify store token |
| Product-level 36m history | **NO** | All sources | Only 4 months | Solve GSC + GA4 backfill first |
| AI / Schema signals | **NO** | None | No crawl source | Connect Screaming Frog, Sitebulb, or custom crawler |
| SEMrush backlinks | **Not verified** | SEMrush | Not yet queried | Execute backlinks report (toolkit available) |
| Conversion rate (GA4) | **Derived only** | GA4 | Not stored | Add session_conversion_rate to pipeline calculation |

---

## SECTION 12 — FINAL READINESS SCORES

| Source | Score | Verdict |
|--------|-------|---------|
| **Database (PostgreSQL)** | 7/10 | Strong structure. 18 schemas, well-organised. Missing views, materialised aggregates, and several SEO dimension tables. |
| **GA4** | 3/10 | Connected. Only 4.5 months. Aggregate periods only (no daily rows). Missing 6 dimensions. No backfill. |
| **GSC** | 4/10 | Connected. 7 tables, 5.7M records. Only 4.3 months. Appearance table empty. No index coverage. No pre-March 2026 data. |
| **SEMrush** | 9/10 | Fully connected. 36+ months of monthly history. Keywords, positions, intent, SERP features, competitor data all accessible. |
| **Google Ads** | 6/10 | Campaign-level data from 2020 (6+ years). Search terms only 10 months. Keyword performance pipeline stopped Sep 2025. PMax search terms only 2 months. |
| **Shopify** | 0/10 | Connection failed. No data available. |
| **AI Readiness** | 1/10 | No crawl tool connected. Only topical signals via SEMrush. |
| **Overall SEO Intelligence Readiness** | **4/10** | Infrastructure and SEMrush are solid. Critical blocker is historical depth — GSC and GA4 cover only ~4 months each, making a 36-month Organic SEO Intelligence Warehouse impossible without backfill. SEMrush provides the 36-month estimated traffic view; it cannot substitute for actual click/session data. |

---

## PRIORITY ACTIONS BEFORE WAREHOUSE BUILD

| Priority | Action | Impact |
|----------|--------|--------|
| 1 — CRITICAL | Fix GA4 pipeline: switch from aggregate exports to daily rows. Add device, country, new users, engaged sessions dimensions. | Unlocks daily granularity and full dimension coverage |
| 2 — CRITICAL | Backfill GSC: use GSC API to pull all available history (~16 months back to ~Jul 2025). Import into PostgreSQL. | Adds 12 months of click/impression/query data |
| 3 — CRITICAL | Fix Shopify MCP connection. Verify store token / network route. | Unlocks product, order, SKU, URL data |
| 4 — HIGH | Fix GSC appearance table — pipeline returning 0 rows. | Enables rich result and SERP feature tracking |
| 5 — HIGH | Re-enable keyword_performance pipeline (stopped Sep 2025, only 578 rows). | Restores paid keyword-level performance data |
| 6 — HIGH | Extend campaign_search_term_data back to 2023 minimum. | Extends search intent history to 36 months |
| 7 — MEDIUM | Add GSC Index Coverage API endpoint to pipeline schema. | Enables crawl health monitoring |
| 8 — MEDIUM | Connect a site crawler (Screaming Frog / Sitebulb / custom). | Required for all AI readiness signals |
| 9 — LOW | Execute SEMrush backlinks report and verify historical range. | Confirms link data availability |
| 10 — LOW | Add derived conversion_rate column to GA4 pipeline. | Removes manual calculation requirement |
