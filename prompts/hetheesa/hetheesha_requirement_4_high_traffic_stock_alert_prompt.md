---
Title: Prompt Capture — Requirement 4 — High-Traffic Product Stock Alert
Purpose: Rule 12 permanent GPT prompt capture
Requirement Source: Hetheesha Req 04 — ledsone.fr — GPT-issued specification
Staff Member: Hetheesha
Supporting AIOS Staff: Piranav
Business Question: Which high-traffic ledsone.fr product pages are low or out of stock, and what action is needed to prevent SEO traffic loss?
Date: 2026-07-06
---

## Prompt Summary

Build a weekly High-Traffic Product Stock Alert dashboard for ledsone.fr.

**Scope:** All product pages, all categories, last 30 days, weekly Monday delivery.

**Required Columns:**
1. Product URL
2. Product Name
3. Weekly Organic Sessions (or GSC Clicks fallback)
4. Inventory Status
5. Stock Qty
6. Suggested Alternative Product
7. Suggested Alternative URL
8. Action Needed

**Inventory Rules:**
- Out of Stock: stock_qty = 0
- Low Stock: stock_qty between 1 and 10
- In Stock: stock_qty > 10

**Traffic Metric Rule:**
- Primary: GA4 Organic Sessions (if available)
- Fallback: GSC Clicks — clearly labelled as "GSC Clicks (30d)", NOT "Sessions"

**Action Rules:**
- Out of Stock + high organic traffic → Redirect / Update Internal Links
- Low Stock → Monitor Closely
- In Stock → None
- Stock unknown → Review Required

---

## Execution Notes

**Date of execution:** 2026-07-06
**Existing assets found:** None (first execution)
**Duplicate risk:** None

### Traffic Data
- **GA4 status:** `raw_data.ga4_landing_page_daily` — 0 rows. GA4 NOT available for ledsone.fr.
- **GSC status:** `google_search_console.gsc_web_page` — 25,198 rows for `https://ledsone.fr/`, data from 2026-03-20 to 2026-07-03. ✅ USED.
- **Final metric:** GSC Clicks (30d) — labelled correctly, not "sessions"
- **30-day GSC result:** 90 unique product pages with ≥1 click, 170 total clicks, 19,602 impressions

### Inventory Data
- **Shopify (jedsz8-km.myshopify.com):** Token expired — re-authorization required for full inventory pull
- **PostgreSQL `listing_data` (jedsz8-km France):** 4,338 rows — `shopify_handle` = NULL for all rows (not mapped)
- **PostgreSQL bridge join:** UK ledsone listing_data (handle→SKU) + `inv_final_stock` (UK warehouse stock) → 4 products matched via shared handle
- **slow_stock_snapshot:** SKU-level warehouse snapshot (2026-06-15) — no URL/handle field, not joinable without Shopify
- **Inventory coverage:** 4 confirmed In Stock, 86 Review Required (Shopify re-auth needed)

### Known Limitation
jedsz8-km France listing_data has `shopify_handle = NULL` for all 4,338 rows. Shopify API re-authorization is required to get complete ledsone.fr product-level inventory. Until then, 86/90 products show "Review Required" inventory status.

**Status:** PASS (with documented limitation)

---

## V2 Prompt Capture — 2026-07-07

### V2 Specification (GPT-issued)

**Key V2 Changes:**
- Inventory must be at **variant level** (not product level)
- Each variant = one row in the dashboard
- New columns: **Variant SKU** (index 2), **Variant Name** (index 3), **Alt SKU** (index 8)
- New stock thresholds: **≥30=In Stock, 1–29=Low Stock, 0=Out of Stock** (V1 was >10/1-10/0)
- Alternative product logic: **SKU family discovery** (not hardcoded) → same family on different page with qty≥30, else same product_type
- KPIs count **variant rows**, not product pages
- Filter search includes **Variant SKU**
- Return to GPT: 10-point summary

### V2 Execution Summary

| Point | Detail |
|---|---|
| 1. Inventory source | PostgreSQL `listing_data` (jedsz8-km) — Priority 2 Shopify sync |
| 2. Variant implementation | 12-element row schema: [url, productName, sku, variantName, clicks, impressions, invStatus, stockQty, altSku, altProduct, altUrl, action] |
| 3. SKU grouping | Families: PC16FT (conduit), LHPOE27 (lamp holder), PCBS16T10BM (reducer), PCGZ20NL (nipple) |
| 4. Alternative logic | SKU family → same product_type with qty≥30 at different URL |
| 5. Products checked | 109 GSC product pages (2026-06-07 to 2026-07-07) |
| 6. Variants confirmed | 15 variants across 4 products (296 SKU overlaps bridge) |
| 7. Alternatives found | 1 (LHPOE27CH/0 → LHTOE27YB/433) |
| 8. Alternatives missing | 14 confirmed variants (all In Stock or Low Stock — no redirect needed) |
| 9. Files updated | hetheesha.html (Tab 4), standalone HTML report, discovery_evidence.md, data_mapping.md, validation.md, prompt.md |
| 10. Status | PASS ✅ — V2 variant-level dashboard deployed with documented RR limitation |

**Status:** PASS ✅ (V2 variant-level implementation complete)
