# Requirement 02 — Collection Performance Dashboard: Data Collection Evidence
**Title:** Collection Performance Dashboard — Data Sources & Evidence  
**Purpose:** Record all data sources inspected, values obtained, and validation status  
**Requirement Source:** Hetheesha Req 02 — ledsone.fr  
**Business Question:** Are all Shopify collection pages optimised for SEO and generating organic traffic/revenue?  
**Date:** 2026-07-06  

---

## PostgreSQL Objects Checked

| Schema | Object | Type | Rows | Notes |
|---|---|---|---|---|
| raw_data | gsc_page_daily | TABLE | 0 | Empty — ledsone.fr GSC raw data not loaded here |
| raw_data | ga4_landing_page_daily | TABLE | 0 | Empty — ledsone.fr GA4 raw not loaded here |
| google_search_console | gsc_web_page | TABLE | 660,911 | **PRIMARY GSC SOURCE** — ledsone.fr data present (site_url = 'https://ledsone.fr/') |
| google_search_console | ga4_organic_landing_page_revenue | TABLE | 141,594 | GA4 data present BUT only for ledsone.co.uk property_id=408110563 — no ledsone.fr collections |
| analytics | (various) | TABLE | — | PostHog/segment data, not relevant |

---

## Shopify Sources

- **Store:** ledsone.fr (jedsz8-km.myshopify.com)
- **Collections fetched:** 66 total (50 page 1 + 16 page 2)
- **API:** Shopify Admin GraphQL — collections() with seo{}, metafields(namespace:custom)
- **FAQ Metafield:** custom.faq_schema — found on 2 collections only (lumiere-daraignee, decor-led)
- **Word count:** Computed from descriptionHtml after HTML tag stripping

---

## GA4 Sources

- **Status:** GA4 data (organic sessions, conversion rate, revenue) NOT available for ledsone.fr in connected PostgreSQL
- **Available GA4 data:** ledsone.co.uk only (property_id=408110563)
- **Impact on dashboard:** Organic Sessions, Conversion Rate, Revenue (30d) columns show "—" for all ledsone.fr collections
- **Columns affected:** Organic Sessions, Conversion Rate, Revenue (30d)

---

## GSC Sources

- **Source:** google_search_console.gsc_web_page
- **Domain:** site_url = 'https://ledsone.fr/'
- **Date range:** 2026-03-20 to 2026-07-03 (confirmed from DB)
- **Query window:** Last 90 days (CURRENT_DATE - 90 days)
- **Columns used:** page, clicks, impressions, ctr, position
- **ledsone.fr collection pages found in GSC:** 50 unique collection URLs with data

---

## Internal Links Analysis

- **Method:** Parsed descriptionHtml from all 66 collections for href="/collections/[handle]" and href="https://ledsone.fr/collections/[handle]"
- **Script:** Python regex on Shopify GraphQL JSON response
- **Findings:** Only 10 collections receive internal links (all with exactly 1 link, Yellow status)
- **Collections receiving 0 internal links:** 56 collections (Red status)

---

## Files Modified

- `Staff-requirements/pages/hetheesha.html` — Tab 2 updated with dashboard
- `evidence/hetheesa/requirement-02-data-collection.md` — This file
- `validation/hetheesa/requirement-02-validation.md` — Validation evidence
- `prompts/hetheesha/requirement-02-prompt.md` — Prompt capture

---

## Validation Status: PASS

- ✅ Existing assets checked (no Req 02 existed)
- ✅ PostgreSQL inspected (all relevant schemas reviewed)
- ✅ Shopify inspected (66 collections, all SEO fields)
- ✅ GSC inspected (ledsone.fr data confirmed in gsc_web_page)
- ✅ GA4 inspected (unavailable for ledsone.fr — documented)
- ✅ No placeholder values used
- ✅ No business logic invented
- ✅ Production not modified
- ✅ All GSC values from real SQL queries

**Reviewer:** AIOS Execution Worker (Claude)  
**Status:** PASS
