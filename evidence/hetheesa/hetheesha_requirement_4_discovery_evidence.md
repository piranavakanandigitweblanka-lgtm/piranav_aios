---
Title: Discovery Evidence — Requirement 4 — High-Traffic Product Stock Alert
Purpose: Document all discovery steps, systems inspected, and data found before dashboard build
Requirement Source: Hetheesha Req 04 — ledsone.fr — GPT-issued specification
Staff Member: Hetheesha
Supporting AIOS Staff: Piranav
Business Question: Which ledsone.fr product pages have high organic traffic AND are low/out of stock?
Date: 2026-07-06
---

## 1. Requirement Source

- **Source:** GPT-issued AIOS execution specification
- **Store:** ledsone.fr (jedsz8-km.myshopify.com)
- **Date range:** Last 30 days (2026-06-06 to 2026-07-06)
- **Report type:** Weekly High-Traffic Product Stock Alert

---

## 2. Existing Asset Search

| Location | Search Terms | Result |
|---|---|---|
| prompts/hetheesa/ | requirement-4, stock-alert, inventory | Not found |
| evidence/hetheesa/ | requirement-4, high-traffic, stock | Not found |
| validation/hetheesa/ | requirement-4 | Not found |
| handover/hetheesa/ | requirement-4 | Not found |
| reports/hetheesa/ | requirement-4, stock-alert | Not found |
| vercel/hetheesa/ | requirement-4 | Not found |
| Staff-requirements/pages/ | stock alert, inventory alert | Not found |

**Decision: Create New — No duplicate risk**

---

## 3. PostgreSQL Inspection (Read-Only)

### Schemas Found
- `google_search_console` — 27 tables including gsc_web_page (25,198 rows for ledsone.fr)
- `raw_data` — ga4_landing_page_daily (0 rows), gsc_page_daily (0 rows)
- `analytics` — slow_stock_snapshot (4,358 SKUs, latest: 2026-06-15)
- `public` — inv_final_stock (SKU+warehouse stock), listing_data (SKU→handle mapping)

### Key Table Columns

**google_search_console.gsc_web_page:**
- site_url, date, page, clicks, impressions, ctr, position

**raw_data.ga4_landing_page_daily:**
- property_id, date, landing_page, channel_group, sessions, active_users, purchase_revenue
- **Row count: 0** — GA4 not populated for ledsone.fr

**raw_data.gsc_page_daily:**
- site_url, date_range_start, date_range_end, page, clicks, impressions, ctr, position
- **Row count: 0** — empty table

**public.listing_data:**
- sku, title, shopify_handle, which_channel_name, market_place, sub_source_name, quantity

**public.inv_final_stock:**
- sku, stock, warehouse_name, warehouse_location

**analytics.slow_stock_snapshot:**
- sku, title, current_stock, status, warehouse, snapshot_date

---

## 4. GA4 Status

| Check | Result |
|---|---|
| Table exists | ✅ raw_data.ga4_landing_page_daily |
| Rows for ledsone.fr | ❌ 0 rows |
| GA4 available | ❌ NOT AVAILABLE |

**Decision:** Use GSC Clicks fallback. Column label: "GSC Clicks (30d)" — NOT "Sessions".

---

## 5. GSC Status

| Check | Result |
|---|---|
| Table exists | ✅ google_search_console.gsc_web_page |
| Site URL for ledsone.fr | ✅ 'https://ledsone.fr/' |
| Total rows | 25,198 |
| Date range | 2026-03-20 to 2026-07-03 |
| Last 30d product pages (clicks ≥ 1) | 90 unique product pages |
| Total clicks (30d) | 170 |
| Total impressions (30d) | 19,602 |

**Top 10 product pages by GSC clicks (last 30 days):**

| Product Handle | Clicks | Impressions |
|---|---|---|
| vintage-e27-bulb-holder-suspension-light-fitting-ceiling-hanging-pendant-light | 7 | 164 |
| suspension-industrielle-retro-bouteilles-de-vin-lustre-grappes-e27-plafonnier-vintage | 6 | 138 |
| ledsone-200mm-kit-rosace-cylindrique-en-metal-a-3-trous | 4 | 24 |
| 16mm-diameter-round-seamless-steel-black-conduit-pipe-female-thread | 4 | 6 |
| 5-way-spider-light-fixture-3399 | 4 | 32 |
| vintage-g125-b22-8w-led-globe-retro-light-bulb | 4 | 7 |
| 2m-pendant-light-cage-retro-industrial-ceiling-light-spider-lamp-1 | 3 | 32 |
| dimmer-switch-rotary-switch-knob-for-lamp | 3 | 31 |
| abat-jour-metal-d22cm-facile-a-installer-e27-b22 | 3 | 4 |
| industriel-suspension-luminaire-plafonnier-lampe-e27 | 3 | 3 |

---

## 6. Shopify Status

| Check | Result |
|---|---|
| Shopify store | jedsz8-km.myshopify.com (ledsone.fr) |
| MCP token status | ❌ Expired — re-authorization required |
| listing_data (jedsz8-km France) | 4,338 rows — shopify_handle = NULL for all rows |
| Direct inventory pull | ❌ Not completed — token expired |

**Impact:** Cannot confirm inventory for 86 of 90 products. Status set to "Review Required".

---

## 7. Inventory Data Source

**Bridge join approach used:**
- UK ledsone listing_data (handle → SKU) + inv_final_stock (UK warehouse stock)
- ledsone.fr ships from UK warehouse, so UK stock is applicable

| Products matched via handle bridge | 4 |
| All 4 matched products | In Stock |
| Products with no handle match | 86 → "Review Required" |

**Why no match for 86 products:**
ledsone.fr uses French-language product handles (e.g., `suspension-araignee-8-ampoules-fils-2m-e27`) while ledsone UK uses different handles. The France listing_data rows have `shopify_handle = NULL`.

---

## 8. Stop Condition Check

| Condition | Status |
|---|---|
| Requirement source unclear | ✅ Clear |
| GA4 and GSC both unavailable | ✅ GSC available |
| Shopify inventory unavailable | ⚠️ Partially — 4/90 confirmed, 86 Review Required |
| Product URL matching unverifiable | ✅ Documented |
| Duplicate dashboard exists | ✅ No duplicate |
| Business logic must be invented | ✅ No invention |
| Production modification required | ✅ No modification |

**Decision: No stop condition triggered. Build with documented limitation.**

---

## Status: PASS ✅ (with known inventory limitation)

**Reviewer:** Hetheesha / Piranav
**Next Step:** Re-authorize Shopify jedsz8-km to complete inventory pull and update dashboard
