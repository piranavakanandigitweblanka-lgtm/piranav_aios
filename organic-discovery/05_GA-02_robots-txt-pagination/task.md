# GA-02 — Fix Robots.txt Collection Pagination Crawling

**Status:** DISCOVERY COMPLETE — Fix not yet implemented  
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

## Fix Options (not yet decided)

1. **Shopify Admin robots.txt editor** — override the `Disallow: /*?page=*` rule to allow `/collections/*/page=*` specifically
2. **Theme robots.liquid** — create a custom `robots.liquid` template to override Shopify's default robots.txt
3. **Allow all, then disallow non-essential** — rebuild robots.txt rules more granularly

## Do NOT Implement Until Approved

Discovery only as of 2026-10-06. Implementation requires separate task brief.
