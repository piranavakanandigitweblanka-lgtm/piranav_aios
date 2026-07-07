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
