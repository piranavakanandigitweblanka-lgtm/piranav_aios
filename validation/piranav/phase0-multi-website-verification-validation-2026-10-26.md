# Validation — Phase 0 Multi-Website SEO URL Intelligence Account Verification
**Date:** 2026-10-26  
**Task:** Phase 0 read-only account verification across 10 websites

---

## Tests Executed

| Test | Method | Result |
|------|--------|--------|
| Shopify live count — ledsone_uk | Python requests → /admin/api/2024-10/products/count.json | ✅ PASS — 5,335 |
| Shopify live count — ledsone_de | Same | ✅ PASS — 2,794 |
| Shopify live count — ledsone_fr | Same | ✅ PASS — 1,150 |
| Shopify live count — ledsone_us | Same | ✅ PASS — 295 |
| Shopify live count — dcvoltage | Same | ❌ FAIL — SHOPIFY_DC_ADMIN_TOKEN absent from .env |
| GSC live — sc-domain:vintagelite.co.uk | GET /webmasters/v3/sites/{url} | ✅ PASS — HTTP 200 |
| GSC live — sc-domain:besbet.co.uk | Same | ❌ HTTP 404 not verified |
| GSC live — sc-domain:relicelectrical.ca | Same | ❌ HTTP 404 not verified |
| GSC live — sc-domain:relicelectrical.com | Same | ❌ HTTP 404 not verified |
| GSC live — sc-domain:homingmbh.de | Same | ❌ HTTP 404 not verified |
| GSC live — https://vintagelite.co.uk/ | Same | ❌ HTTP 404 (sc-domain format required) |
| GA4 live — UK prop 408110563 | POST /v1beta/properties/408110563:runReport | ✅ PASS — 10,524 organic sessions |
| GA4 live — DE prop 462018160 | Same | ✅ PASS — 4,246 organic sessions |
| GSC DB — row counts by site + search_type | SQL on google_search_console.page | ✅ PASS — 8 sites confirmed |
| listing_attributes join to shopify_listings | SQL id range comparison | ❌ MISMATCH — ranges don't overlap |
| listing_attributes join to inventory.products | SQL id range comparison | ✅ Ranges overlap (la: 1–22782, inv.products: 1–45305) |
| shopify_listings site values | SELECT DISTINCT site | ✅ UK, Germany, France, Canada, US confirmed |
| SHOPIFY_DC_ADMIN_TOKEN env var check | grep .env | ❌ Variable absent entirely |
| All SHOPIFY env vars present | grep .env | UK, DE (SHOPIFY_ADMIN_TOKEN), FR, US, UK_ALTTEXT — all ✅ |

---

## Pass / Fail Summary

| Category | Sites PASS | Sites FAIL/MISSING | Notes |
|----------|-----------|-------------------|-------|
| Shopify API | 4 (UK, DE, FR, US) | 1 token missing (dcvoltage), 5 unknown | electricalsone = shared UK |
| GSC Live | 4 (UK, DE, FR via gsc_sync; vintagelite NEW ✅) | 5 not verified | ledsone.us has business DB data but no live API |
| GSC Business DB | 8 sites present | 2 absent (relicelectrical, homingmbh) | Must filter search_type='web' |
| GA4 Live | 2 (UK, DE) | 8 unknown/missing property IDs | — |
| Spec Data | BLOCKED all sites | reference_id join to inventory.products unconfirmed | No spec data available yet |

---

## Session Validation: PASS (Phase 0)

Phase 0 objective met: full verification matrix produced, blockers identified, 5 sites confirmed ready for Phase 1.
