# GA-02 — Fix Robots.txt Collection Pagination Crawling

**Status:** COMPLETE — Live verified 2026-10-06  
**Created:** 2026-10-06  
**Theme:** ledsone-uk-theme  
**Deadline:** 6 Oct 2026

## Goal

Remove or replace the `Disallow: /*?page=*` rule in robots.txt that blocks all Shopify collection pagination URLs from being crawled by Google.

## Discovery Findings (2026-10-06)

See `evidence/GA-02_discovery-report_2026-10-06.md` for full findings.

**Key finding:** `Disallow: /*?page=*` in ledsone.co.uk/robots.txt blocks ALL collection pagination URLs (e.g. `/collections/all?page=2`). This prevents Google from discovering products that appear only on page 2+ of collections.

## Root Cause

- Shopify platform-generated robots.txt includes `Disallow: /*?page=*`
- This was intended to prevent crawling of parameter-based duplicate URLs (e.g. sort, filter)
- Side effect: also blocks `?page=` pagination which IS unique content

## Proposed Fix (Step 2 Plan — 2026-10-06)

See `evidence/GA-02_implementation-plan_2026-10-06.md` for full plan.

**In both `User-agent: *` and `User-agent: adsbot-google`, remove:**
```
Disallow: /*?page=*
```

**Replace with:**
```
Disallow: /*?page=*&*filter*
Disallow: /*?page=*&sort_by*
Disallow: /*?page=*&section_id*
```

**Implementation method:** Create `templates/robots.txt.liquid` in theme (most reliable), OR edit via Shopify Admin → Online Store → Preferences.

**Rollback:** Delete `robots.txt.liquid` — Shopify auto-reverts to original rules instantly.

## CORRECTION — Implementation is an EDIT, not CREATE

The file `templates/robots.txt.liquid` **already exists** in the theme. The implementation is an EDIT to this file — replace 3 lines. See `evidence/GA-02_pre-implementation-verification_2026-10-06.md` for exact steps.

## Do NOT Implement Until Approved

Pre-implementation verification complete as of 2026-10-06. Awaiting Piranav/GPT approval.
