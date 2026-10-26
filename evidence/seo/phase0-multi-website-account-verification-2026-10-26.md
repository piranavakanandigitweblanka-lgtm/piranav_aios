# Phase 0 — Multi-Website SEO URL Intelligence: Consolidated Account Verification
**Date:** 2026-10-26  
**Session:** sinrasu mode  
**Task:** Verify Shopify API, GSC, GA4, Spec Data, and GSC DB History access for all 10 target websites  
**Scope:** READ-ONLY discovery. No code changes, no Shopify writes, no credential changes.

---

## Verification Matrix

| # | Website | Shopify API | GSC Live API | GSC DB History | GA4 Live | Spec Data | Overall |
|---|---------|-------------|--------------|----------------|----------|-----------|---------|
| 1 | ledsone.co.uk | ✅ PASS 5,335 products | ✅ PASS (gsc_sync active) | ✅ PASS 2,072,632 web rows (from 2025-03-24) | ✅ PASS prop 408110563 (10,524 sessions) | ⚠️ BLOCKED (see note) | PARTIAL |
| 2 | ledsone.de | ✅ PASS 2,794 products | ✅ PASS (gsc_sync active) | ✅ PASS 531,990 web rows (from 2025-03-24) | ✅ PASS prop 462018160 (4,246 sessions) | ⚠️ BLOCKED | PARTIAL |
| 3 | ledsone.fr | ✅ PASS 1,150 products | ✅ PASS (gsc_sync active) | ✅ PASS 140,801 web rows (from 2025-03-24) | ❌ MISSING (no property ID in codebase) | ⚠️ BLOCKED | PARTIAL |
| 4 | ledsone.us | ✅ PASS 295 products | ❌ NOT VERIFIED (property sc-domain:ledsone.us not accessible via live API; HTTP 404) | ✅ PARTIAL 34,828 web rows in business DB (from 2025-09-16) — populated by separate mechanism | ❌ MISSING (no property ID) | ⚠️ BLOCKED | PARTIAL |
| 5 | electricalsone.co.uk | ✅ SHARED (runs on ledsone.myshopify.com — same store as ledsone_uk) | ❌ NOT ACCESSIBLE via live API (property not in gsc_sync; business DB data exists) | ✅ PARTIAL 247,069 web rows in business DB (from 2025-03-24) | ❌ MISSING | ⚠️ BLOCKED | PARTIAL |
| 6 | dcvoltage.co.uk | ❌ NO TOKEN (`SHOPIFY_DC_ADMIN_TOKEN` absent from .env entirely) | ✅ PARTIAL (gsc_sync has dcvoltage.co.uk added 2026-10-22; business DB has 28,024 web rows from 2025-06-04) | ✅ PARTIAL in business DB | ❌ MISSING | ⚠️ BLOCKED | PARTIAL |
| 7 | vintagelite.co.uk | ❓ UNKNOWN (no Shopify token known) | ✅ PASS (sc-domain:vintagelite.co.uk → HTTP 200, live API verified) | ✅ PASS 448,089 web rows in business DB (from 2025-03-24) | ❌ MISSING | ❓ UNKNOWN | PARTIAL |
| 8 | besbet.co.uk | ❓ UNKNOWN | ❌ NOT VERIFIED (sc-domain:besbet.co.uk → HTTP 404) | ✅ PARTIAL 71,543 web rows in business DB (from 2025-03-24) | ❓ UNKNOWN | ❓ UNKNOWN | PARTIAL |
| 9 | relicelectrical.ca/.com | ⚠️ UNKNOWN TOKEN (DB shows "Canada" site = 1,110 parent products in shopify_listings) | ❌ NOT VERIFIED (HTTP 404 for both .ca and .com sc-domain) | ❌ NOT IN business DB | ❌ MISSING | ❓ UNKNOWN | MISSING |
| 10 | homingmbh.de | ❌ THEME ONLY (Shopify CLI theme — no Shopify Admin API configured) | ❌ NOT VERIFIED (HTTP 404) | ❌ NOT IN business DB | ❌ MISSING | ❌ N/A | MISSING |

---

## Detailed Findings by Category

### Shopify API Access

| Store Key | Domain | Token Env Var | Live Count | Status |
|-----------|--------|---------------|-----------|--------|
| ledsone_uk | ledsone.myshopify.com | SHOPIFY_UK_ADMIN_TOKEN | 5,335 | ✅ PASS |
| ledsone_de | ledsone-de.myshopify.com | SHOPIFY_ADMIN_TOKEN | 2,794 | ✅ PASS |
| ledsone_fr | jedsz8-km.myshopify.com | SHOPIFY_FR_ADMIN_TOKEN | 1,150 | ✅ PASS |
| ledsone_us | 2aakxr-1u.myshopify.com | SHOPIFY_US_ADMIN_TOKEN | 295 | ✅ PASS |
| dcvoltage | dcvoltage-2.myshopify.com | SHOPIFY_DC_ADMIN_TOKEN | — | ❌ TOKEN MISSING from .env |
| electricalsone | (shared ledsone_uk) | — | — | ✅ Shared — no separate token needed |
| vintagelite | Unknown | Unknown | — | ❓ Not configured |
| besbet | Unknown | Unknown | — | ❓ Not configured |
| relicelectrical | Unknown | Unknown | DB shows 1,110 Canada parents | ⚠️ Token unknown |
| homingmbh | N/A (theme only) | N/A | — | ❌ Admin API not applicable |

**Action needed:** Add `SHOPIFY_DC_ADMIN_TOKEN` to `.env`. Confirm token for dcvoltage-2.myshopify.com with Piranav.

### GSC Live API (service account: aios-ga4-reader@aios-ga4-reader.iam.gserviceaccount.com)

| Site | Format Tested | HTTP Result | Status |
|------|---------------|-------------|--------|
| ledsone.co.uk | via gsc_sync | Verified in prior sessions | ✅ PASS |
| ledsone.de | via gsc_sync | Verified in prior sessions | ✅ PASS |
| ledsone.fr | via gsc_sync | Verified in prior sessions | ✅ PASS |
| sc-domain:vintagelite.co.uk | sc-domain | HTTP 200 | ✅ PASS — new confirmation |
| https://vintagelite.co.uk/ | https | HTTP 404 | sc-domain format required |
| sc-domain:ledsone.us | sc-domain | HTTP 404 | ❌ NOT VERIFIED |
| sc-domain:besbet.co.uk | sc-domain + https | HTTP 404 | ❌ NOT VERIFIED |
| sc-domain:relicelectrical.ca | sc-domain + https | HTTP 404 | ❌ NOT VERIFIED |
| sc-domain:relicelectrical.com | sc-domain | HTTP 404 | ❌ NOT VERIFIED |
| sc-domain:homingmbh.de | sc-domain + https | HTTP 404 | ❌ NOT VERIFIED |
| sc-domain:electricalsone.co.uk | via business DB | 247K rows present | Business DB only |
| https://dcvoltage.co.uk/ | via gsc_sync (added 2026-10-22) | gsc_sync sync should be running | ⚠️ PARTIAL |

**Action needed:** Piranav must add service account email to Search Console for: ledsone.us, besbet.co.uk, relicelectrical.ca, homingmbh.de, electricalsone.co.uk (live API).

### GSC Business DB (google_search_console.page — MUST use `WHERE search_type='web'`)

| site_url | Web Rows | Earliest Date | Latest Date | Status |
|----------|----------|--------------|-------------|--------|
| sc-domain:ledsone.co.uk | 2,072,632 | 2025-03-24 | 2026-10-23 | ✅ FULL |
| https://ledsone.de/ | 531,990 | 2025-03-24 | 2026-10-23 | ✅ FULL |
| https://ledsone.fr/ | 140,801 | 2025-03-24 | 2026-10-23 | ✅ FULL |
| sc-domain:ledsone.us | 34,828 | 2025-09-16 | 2026-10-23 | ✅ USABLE (16 months) |
| sc-domain:electricalsone.co.uk | 247,069 | 2025-03-24 | 2026-10-23 | ✅ FULL |
| sc-domain:vintagelite.co.uk | 448,089 | 2025-03-24 | 2026-10-23 | ✅ FULL |
| https://besbet.co.uk/ | 71,543 | 2025-03-24 | 2026-10-23 | ✅ USABLE |
| https://dcvoltage.co.uk/ | 28,024 | 2025-06-04 | 2026-10-23 | ✅ USABLE |
| relicelectrical.ca/.com | 0 | — | — | ❌ NOT IN DB |
| homingmbh.de | 0 | — | — | ❌ NOT IN DB |

**Important:** All queries to business DB must add `AND search_type='web'` to avoid position inflation from image/video search types.

### GA4 Live API

| Site | Property ID | Test Result | Sessions (28d) | Status |
|------|-------------|-------------|----------------|--------|
| ledsone.co.uk (UK) | 408110563 | HTTP 200 | 10,524 organic | ✅ PASS |
| ledsone.de (DE) | 462018160 | HTTP 200 | 4,246 organic | ✅ PASS |
| ledsone.fr | Unknown | Not tested | — | ❌ MISSING |
| ledsone.us | Unknown | Not tested | — | ❌ MISSING |
| electricalsone.co.uk | Unknown | Not tested | — | ❌ MISSING |
| dcvoltage.co.uk | Unknown | Not tested | — | ❌ MISSING |
| vintagelite.co.uk | Unknown | Not tested | — | ❌ MISSING |
| besbet.co.uk | Unknown | Not tested | — | ❌ MISSING |
| relicelectrical | Unknown | Not tested | — | ❌ MISSING |
| homingmbh.de | Unknown | Not tested | — | ❌ MISSING |

**Action needed:** Piranav to provide GA4 property IDs for FR, US, electricalsone, dcvoltage, vintagelite, besbet. UK and DE confirmed working.

### Spec Data (listing_attributes)

**Discovery finding:** `listings.listing_attributes.reference_id` range is 1–22,782. `listings.shopify_listings.id` range is 344,704–1,053,630. **These ranges do not overlap** — the reference_id does NOT join to shopify_listings.id despite being documented that way.

`inventory.products.id` range is 1–45,305 — overlaps with reference_id range. **Correct join is likely `listing_attributes.reference_id = inventory.products.id`**, not `shopify_listings.id`.

Sites in shopify_listings (confirming which "sites" exist):
- UK: 11,510 parent products
- Germany: 2,904 parent products
- France: 1,174 parent products
- Canada: 1,110 parent products (= relicelectrical.ca presumably)
- US: 306 parent products

All spec data queries are BLOCKED until the correct join path (inventory.products) is confirmed. For US and Canada, spec attributes may also be sparse or absent.

---

## Blockers Requiring Piranav Action

| # | Blocker | Action Required |
|---|---------|----------------|
| B1 | `SHOPIFY_DC_ADMIN_TOKEN` missing from .env | Obtain DCvoltage Admin API token and add to .env |
| B2 | ledsone.us not verified in GSC | Add service account `aios-ga4-reader@aios-ga4-reader.iam.gserviceaccount.com` to ledsone.us in Search Console |
| B3 | besbet.co.uk not verified in GSC | Add service account to besbet.co.uk in Search Console |
| B4 | relicelectrical.ca/.com not verified in GSC | Add service account to both domains in Search Console |
| B5 | homingmbh.de not verified in GSC | Add service account to homingmbh.de in Search Console |
| B6 | GA4 property IDs for FR, US, electricalsone, dcvoltage, vintagelite, besbet missing | Share GA4 property IDs for remaining 6 sites |
| B7 | Spec data join path unconfirmed | Confirm: does listing_attributes.reference_id join to inventory.products.id? |
| B8 | Electricalsone Shopify sales channel | Confirm: is electricalsone purely running on ledsone_uk store, or does it have a separate Shopify store? |
| B9 | vintagelite / besbet / relicelectrical / homingmbh Shopify tokens | Confirm whether Admin API tokens exist for these stores or if they are not Shopify stores |

---

## Ready for Phase 1 (no blockers needed for initial build)

The following 5 sites have sufficient access to begin Phase 1 dashboard implementation:
1. **ledsone.co.uk** — Shopify ✅, GSC Live ✅, GA4 ✅, GSC DB ✅
2. **ledsone.de** — Shopify ✅, GSC Live ✅, GA4 ✅, GSC DB ✅
3. **ledsone.fr** — Shopify ✅, GSC Live ✅, GA4 ❌, GSC DB ✅ (usable without GA4)
4. **ledsone.us** — Shopify ✅, GSC DB ✅ (live GSC blocked), GA4 ❌
5. **vintagelite.co.uk** — GSC Live ✅, GSC DB ✅ (no Shopify token — GSC-only mode)

Remaining 5 sites can be added incrementally as blockers are resolved.

---

## Files Referenced
- `dm-dashboard/backend/app/core/shopify_client.py` — STORES dict (ledsone_uk, de, fr, us, dcvoltage)
- `dm-dashboard/backend/app/core/google_client.py` — get_gsc_access_token(), get_ga4_access_token()
- `dm-dashboard/backend/app/dev_tasks/blog_optimization/gsc_sync.py` — SYNC_SITES (uk, de, fr, dcvoltage, vintagelite)
- `dm-dashboard/backend/app/dashboard_pages/core_ga4_data.py` — GA4 property 462018160 (DE)
- `dm-dashboard/backend/app/dashboard_pages/ga4_seo_performance.py` — GA4 property 408110563 (UK)
- Business DB: `google_search_console.page` — 8 sites, ~5.7M total rows
- Business DB: `listings.shopify_listings` — UK/DE/FR/US/Canada products
- Business DB: `listings.listing_attributes` — reference_id joins to inventory.products (NOT shopify_listings)
