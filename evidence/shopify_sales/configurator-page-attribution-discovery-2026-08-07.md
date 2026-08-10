# Configurator Page — Attribution Discovery Evidence

**Task ID:** CONFIGURATOR-ATTRIBUTION-DISCOVERY-2026-08-07
**Date:** 2026-08-07
**Page:** led-sone-products-configurator
**Page URL:** https://ledsone.co.uk/pages/led-sone-products-configurator
**Checked by:** Claude Code AIOS — READ-ONLY discovery
**Status:** AMBER — Partial attribution path exists (GA4 organic); full multi-channel attribution unproven

---

## 1. Page Identity

| Field | Value | Evidence |
|---|---|---|
| Page handle | `led-sone-products-configurator` | `shopify_projects/ledsone-uk-theme/templates/page.config-pk.json` |
| Page URL/path | `https://ledsone.co.uk/pages/led-sone-products-configurator` | `evidence/shopify_sales/configurator-page-sales-2026-07-03.md` |
| Page title | Visually hidden: `led-sone-products-configurator` (H1 in custom HTML section) | `shopify_projects/ledsone-uk-theme/templates/page.config-pk.json` — custom_html_kH4tBY section |
| Page type (Shopify template) | Shopify PAGE — uses template `page.config-pk` | `shopify_projects/ledsone-uk-theme/templates/page.config-pk.json` |
| App rendered | `lighting-configurator` Shopify app (iframe mode), collection_handle=`bulb`, app_path=`/apps/lighting/configure` | `page.config-pk.json` — lighting_configurator_lighting_configurator_NP3cz3 block |
| GA4 URL path | `/pages/led-sone-products-configurator` | Inferred from store URL pattern; consistent with Shopify page handle |
| GA4 page_type bucket | `Content` (matches `landing_page LIKE '/pages/%'` SQL pattern) | `Staff-requirements-02/api/organic-revenue.js` — PAGE_TYPE_SQL |
| Other identifiers | Referenced in `layout/theme.liquid`, `config/settings_data.json`, `sections/mobile-stickybar.liquid`, `templates/index.json`, `templates/product.json` | Grep search results |

**Confirmed: This is a Shopify PAGE, NOT a product. It renders the lighting configurator app in an iframe.**

---

## 1B. Live Journey Scan — 2026-08-07 (THIS SESSION)

**Scope:** All orders within Shopify's 30-day attribution window (Jul 7–Aug 7, 2026)
**Method:** GraphQL `customerJourneySummary.moments` with `... on CustomerVisit { landingPage }` — checks EVERY touchpoint per order, not just first/last visit
**Query pattern:** Date-slice pagination (`created_at:>=X created_at:<=Y`, `sortKey: CREATED_AT, reverse: false`)

| Date Slice | Orders Checked | Configurator Hits | /pages/ URLs Found |
|---|---|---|---|
| Aug 6 (batch 1) | ~100 | 0 | /pages/discounts (x2), /pages/real-uk-customer-experiences (x1) |
| Jul 6–7 | 50 | 0 | /pages/pi (x1), /pages/real-uk-customer-experiences (x1), /pages/discounts (x1) |
| Jul 14 | 50 | 0 | /pages/discounts (x1) |
| Jul 20 | 50 | 0 | /pages/discounts (x2) |
| Jul 27 | 50 | 0 | /pages/discounts (x1) |
| **TOTAL** | **~300** | **0** | **Configurator page: NOT FOUND** |

**Key finding:** `/pages/` URLs DO appear in order journeys (e.g. `/pages/discounts` confirmed on multiple orders), proving the API can capture page-type URLs. The configurator page specifically never appeared.

**Confirmed Shopify VERDICT: The configurator page (`/pages/led-sone-products-configurator`) is NOT present in ANY order's customer journey moments within the 30-day attribution window. Zero orders are attributable to this page via Shopify data.**

---

## 2. Prior Investigation (Already Completed — 2026-07-03)

**File:** `evidence/shopify_sales/configurator-page-sales-2026-07-03.md`

This file represents a complete Shopify-level attribution investigation:

| Metric | Result |
|---|---|
| Date range | 2026-04-01 to 2026-07-03 (94 days) |
| Sessions (as landing page) | **264** |
| Monthly breakdown | Apr: 80, May: 97, Jun: 80, Jul (1–3): 4 |
| Orders with configurator in referrer | **0** |
| Revenue directly attributed | **£0** |
| Total store orders (same period) | 7,542 |
| Total store revenue | ~£264,000 |
| Customer journey spot-check | 23 orders — none touched configurator |

**Methods used (July 2026):**
- ShopifyQL `FROM sessions` — landing page URL filter
- ShopifyQL `FROM sales` — referrer attribution (all 28 referrer rows checked)
- GraphQL `customerJourneySummary` (firstVisit + lastVisit) for 23 sampled orders

**Documented API limitation:**
`customerJourneySummary` exposes FIRST and LAST visit only. Mid-session page visits (user lands elsewhere → visits configurator → buys) are NOT visible. This is a confirmed Shopify API structural limitation.

---

## 3. Existing Attribution Assets Found

### 3A. Shopify Attribution (UNPROVEN)

- **Asset:** ShopifyQL `FROM sessions` + `FROM sales` + GraphQL `customerJourneySummary`
- **Status:** Investigated. 0 orders attributed. UNPROVEN.
- **Limit:** First/last visit only. Intermediate configurator visits are invisible.
- **Evidence:** `evidence/shopify_sales/configurator-page-sales-2026-07-03.md`

### 3B. GA4 PostgreSQL Table — Organic Revenue (PARTIAL PATH PROVEN)

- **Asset:** `google_analytics.organic_landing_page_revenue` (PostgreSQL, host: 207.148.78.148:5432, db: ledsone)
- **Key columns:** `landing_page`, `session_default_channel_group`, `sessions`, `active_users`, `ecommerce_purchases`, `purchase_revenue`, `run_date`, `date_start`, `date_end`
- **Attribution logic:** GA4 session-scoped — revenue attributed to the session entry landing page via GA4 last non-direct click model
- **Coverage filter (current):** `session_default_channel_group = 'Organic Search'` ONLY
- **Existing API:** `Staff-requirements-02/api/organic-revenue.js` — 4 endpoints (`?type=overview`, `by-page`, `by-type`, `trend`)
- **Existing dashboard:** `Staff-requirements-02/pages/organic-revenue.html` (live at staff-requirements-02.vercel.app)
- **The `?type=by-page` endpoint already returns all landing pages with sessions, orders, revenue.** The configurator page URL (`/pages/led-sone-products-configurator`) would appear here IF any organic search sessions started on it.
- **Gap:** Only Organic Search channel. Configurator traffic includes Paid (Google Ads gclid confirmed on 2026-07-03), Direct, and other channels. The organic-only table misses those sessions.
- **Evidence:** `Staff-requirements-02/api/organic-revenue.js`, `Staff-requirements-02/docs/dashboard-organic-revenue.md`

### 3C. GA4 Data API Direct Access (AVAILABLE BUT UNUSED FOR THIS PAGE)

- **GA4 Property ID:** 479617728
- **Service Account:** ga4-mcp-reader@ledsone-ga4-mcp.iam.gserviceaccount.com
- **Credential file:** `source-map/ledsone-ga4-mcp-ba2b3b1db2dd.json`
- **API version:** google-analytics-data v1beta
- **Status:** Validated working (2026-07-07, 112 rows returned in Hetheesha Req 4)
- **Coverage:** ALL channels (Organic, Paid, Direct, Social, etc.) — not filtered to organic only
- **Capability:** Can query `landingPagePlusQueryString` or `pagePath` dimension filtered to `/pages/led-sone-products-configurator` with `sessions`, `ecommercePurchases`, `purchaseRevenue` metrics
- **Gap:** Not yet queried for the configurator page. This is the most complete available path but requires a live GA4 API call (not yet done in this READ-ONLY discovery).
- **Evidence:** `evidence/hetheesa/requirement-04-ga4-integration-validation.md`, `source-map/ledsone-ga4-mcp-ba2b3b1db2dd.json`

### 3D. Campaign-Level UTM Attribution (NOT PAGE-LEVEL)

- **Asset:** `staging_ai.cppc_workbook_product_performance_v1` + Shopify GraphQL customerJourney moments
- **Used by:** Thivajini attribution dashboard (`evidence/Thivajini/req2-attribution-dashboard-evidence-2026-07-09.md`)
- **Scope:** Campaign-to-order attribution (Google Ads UTM campaign → Shopify order). NOT page-level.
- **Conclusion:** Not directly applicable to configurator page attribution.

---

## 4. Attribution Chain Analysis

### Chain A — Shopify Referrer (UNPROVEN, investigated Jul 2026)

```
Page (led-sone-products-configurator)
→ Session landing page (ShopifyQL FROM sessions)
→ Shopify referrer attribution fields (FROM sales)
→ customerJourneySummary first/last visit
→ Order

Result: 0 orders found. API cannot capture mid-session visits.
```

### Chain B — GA4 Organic (PARTIAL — table exists, configurator query NOT YET RUN)

```
Page (/pages/led-sone-products-configurator)
→ GA4 session where landing page = this URL
→ session_default_channel_group = 'Organic Search'
→ google_analytics.organic_landing_page_revenue table
→ ecommerce_purchases + purchase_revenue

Status: Table exists. Configurator-specific row existence UNKNOWN (not queried — read-only discovery).
Risk: Organic-only filter may exclude most configurator traffic (paid/direct also present).
```

### Chain C — GA4 All-Channel via Data API (MOST COMPLETE — NOT YET QUERIED)

```
Page (/pages/led-sone-products-configurator)
→ GA4 session (all channels)
→ GA4 Data API Property 479617728
→ Dimension: landingPagePlusQueryString = '/pages/led-sone-products-configurator'
→ Metrics: sessions, ecommercePurchases, purchaseRevenue
→ Revenue attribution (GA4 session-scoped)

Status: API access confirmed. Query not yet run (read-only discovery).
This is the most complete available path.
```

---

## 5. Available Sales Metrics (IF Attribution Proven)

The following metrics are available from existing sources IF the page-to-sales relationship is established:

**From `google_analytics.organic_landing_page_revenue` (organic only):**

| Metric | Field | Source |
|---|---|---|
| Session count | `sessions` | GA4 table |
| Active users | `active_users` | GA4 table |
| Order count | `ecommerce_purchases` | GA4 table |
| Revenue | `purchase_revenue` | GA4 table |
| Revenue per session | `purchase_revenue / sessions` | Calculated |
| Average order value | `purchase_revenue / ecommerce_purchases` | Calculated |
| Date coverage | `date_start`, `date_end` | GA4 table |
| Snapshot date | `run_date` | GA4 table |

**From GA4 Data API (all channels):**

Same metrics as above but across all `session_default_channel_group` values (Organic, Paid Search, Direct, Social, etc.)

**NOT available from any existing source:**
- Order-level line items (SKUs, quantities, per-item revenue)
- Gross sales / discounts / refunds / tax at page attribution level
- Net sales at page attribution level
- Currency (assumed GBP for ledsone.co.uk)
- These Shopify-level fields are not joinable to GA4 sessions without a customer-level bridge

---

## 6. Existing Dashboard Assets — Duplicate Risk

| New Asset (if built) | Existing Asset | Overlap | Risk | Recommendation |
|---|---|---|---|---|
| Configurator page revenue from GA4 | `organic-revenue.js` `?type=by-page` | HIGH — same table, same logic, `/pages/` URLs already included | HIGH | Query the EXISTING `?type=by-page` endpoint and filter to `/pages/led-sone-products-configurator` BEFORE building anything new |
| All-channel GA4 query for configurator | GA4 Data API (used in Hetheesha Req 4) | MEDIUM — same API, different dimensions/filters | LOW | Reuse existing credential and API pattern |
| Page-to-order Shopify attribution | Prior Jul 2026 investigation | EXACT DUPLICATE | HIGH | Do NOT repeat the Shopify investigation — it is documented as UNPROVEN |

**Duplicate risk: AMBER — existing `organic-revenue.js` `?type=by-page` already covers this page type. Check it first.**

---

## 7. Data Coverage Gaps

| Gap | Detail |
|---|---|
| GA4 table query not run | Whether `/pages/led-sone-products-configurator` appears in `google_analytics.organic_landing_page_revenue` is unknown — not queried in this read-only discovery |
| Organic-only filter | Current GA4 table excludes paid/direct traffic to configurator |
| Mid-session visits | Shopify API cannot capture visits to configurator mid-session (structural API limit) |
| Order-level metrics | No join exists between GA4 session and Shopify order line items |
| UTM tagging | No UTM parameters confirmed on links pointing to configurator (except one Google Ads gclid on 2026-07-03) |
| Date coverage of GA4 table | Start date of `google_analytics.organic_landing_page_revenue` unknown without DB query |

---

## 8. Evidence Paths

| Asset | Path |
|---|---|
| Prior Shopify investigation (Jul 2026) | `evidence/shopify_sales/configurator-page-sales-2026-07-03.md` |
| Investigation prompt template | `prompts/discovery/shopify-configurator-page-sales-investigation.md` |
| Theme template (page identity) | `shopify_projects/ledsone-uk-theme/templates/page.config-pk.json` |
| GA4 organic revenue API | `Staff-requirements-02/api/organic-revenue.js` |
| GA4 organic revenue dashboard docs | `Staff-requirements-02/docs/dashboard-organic-revenue.md` |
| GA4 credential | `source-map/ledsone-ga4-mcp-ba2b3b1db2dd.json` |
| GA4 API validation | `evidence/hetheesa/requirement-04-ga4-integration-validation.md` |
| Thivajini attribution dashboard | `evidence/Thivajini/req2-attribution-dashboard-evidence-2026-07-09.md` |
| This evidence file | `evidence/shopify_sales/configurator-page-attribution-discovery-2026-08-07.md` |
