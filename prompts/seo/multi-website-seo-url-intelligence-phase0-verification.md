# Prompt: Multi-Website SEO URL Intelligence — Phase 0 Account Verification

**Category:** seo  
**Registered:** 2026-10-26  
**Status:** EXECUTED — evidence at `evidence/seo/phase0-multi-website-account-verification-2026-10-26.md`

---

## Prompt

You are a read-only discovery agent verifying API and data access for a multi-website SEO URL Intelligence Dashboard. The dashboard will be built inside the DM Dashboard (React 19 + Vite frontend, Python/FastAPI backend, Neon Postgres).

**Task:** For each of the following 10 websites, verify access to Shopify Admin API, Google Search Console (GSC) live API, GSC historical data in the business Postgres database, Google Analytics 4 (GA4) live API, and product spec data in the listings database.

**Target websites:**
1. ledsone.co.uk
2. ledsone.de
3. ledsone.fr
4. ledsone.us
5. electricalsone.co.uk
6. dcvoltage.co.uk
7. vintagelite.co.uk
8. besbet.co.uk
9. relicelectrical.ca / relicelectrical.com
10. homingmbh.de

**For each website, determine:**
- Shopify: Is a token configured in `shopify_client.py` STORES dict and `.env`? Run a live product count to confirm.
- GSC live: Does the service account (`aios-ga4-reader@aios-ga4-reader.iam.gserviceaccount.com`) have verified access? Test sc-domain and https formats.
- GSC DB: Is data present in `google_search_console.page` in the business DB? Filter by `search_type='web'` for accurate row counts and date ranges.
- GA4: Is a property ID configured in the codebase? Test live API connectivity.
- Spec data: Does `listings.listing_attributes` contain rows for this site via the correct join key? (Note: reference_id joins to inventory.products, NOT to shopify_listings.)

**Constraints:**
- READ-ONLY. No code changes, no Shopify writes, no credential changes, no DB writes.
- Never print or expose token values, private key contents, or service account JSON.
- Report variable names and masked emails only.

**Output:** A consolidated verification matrix covering all 10 websites, a list of blockers requiring Piranav action, and a list of sites ready for Phase 1 implementation.

---

## Key Technical Context

- Shopify stores configured in: `dm-dashboard/backend/app/core/shopify_client.py` → STORES dict
- GSC/GA4 token: `dm-dashboard/backend/app/core/google_client.py` → get_gsc_access_token(), get_ga4_access_token()
- GSC sync sites: `dm-dashboard/backend/app/dev_tasks/blog_optimization/gsc_sync.py` → SYNC_SITES
- Business DB GSC: schema `google_search_console`, table `page` — must filter `AND search_type='web'`
- GA4 property IDs in codebase: UK = 408110563, DE = 462018160 (others unknown)
- Spec data join: `listing_attributes.reference_id = inventory.products.id` (NOT shopify_listings.id — ID ranges don't overlap)
- Electricalsone runs on ledsone.myshopify.com (shared store, confirmed via CDN URLs in GSC data)
