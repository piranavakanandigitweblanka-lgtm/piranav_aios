# Prompt: GA-02 — Robots.txt Collection Pagination Discovery

**Category:** discovery  
**Pattern name:** `shopify-robots-pagination-discovery`  
**Created:** 2026-10-06  
**Status:** ACTIVE

---

## When to Use

Use this prompt when investigating whether Shopify robots.txt rules are blocking collection pagination from Google crawling.

---

## Prompt Template

```
GA-02 — Robots.txt Collection Pagination STEP 1: DISCOVERY + AUDIT ONLY

Project: [store name]
Theme path: [shopify_projects/theme-name/]
AIOS root: [aios_root_path/]

GOAL: Discover whether robots.txt is blocking collection pagination URLs from being crawled by Google.

STEP 1 — READ EXISTING AIOS: Check [aios_root_path/organic-discovery/] for any existing GA-02 documentation.

STEP 2 — FETCH LIVE ROBOTS.TXT: Fetch [store-url]/robots.txt and look for:
- Disallow: /*?page=*
- Any other rules affecting collection URLs

STEP 3 — CONFIRM PAGINATION IN USE: Fetch [store-url]/collections/all and report:
- How many products are shown per page
- Whether pagination links exist
- What URL format pagination uses (exact href)

STEP 4 — INSPECT THEME FILES:
- Search [theme-path] for robots.liquid
- Check [theme-path]/layout/theme.liquid for canonical tag
- Check [theme-path]/snippets/seo-noindex.liquid for any noindex logic on pagination

STEP 5 — RISK REVIEW: Report findings as:
- Is Disallow: /*?page=* present? YES/NO
- Is pagination actively used with ?page= parameter? YES/NO
- Are there other blocking mechanisms (noindex, canonical)? YES/NO
- Which collections are most likely affected?

STEP 6 — AIOS AUTO-UPDATE:
- Create [aios_root_path/organic-discovery/XX_GA-02_robots-txt-pagination/task.md]
- Create evidence file with full discovery findings
- Update closure/README.md
- Update PROMPT_REGISTER.md
- Create validation file

FINAL RULE: STOP after discovery and report findings. Do NOT make any Shopify or theme changes.
```

---

## Notes

- `Disallow: /*?page=*` is a common Shopify default that inadvertently blocks collection pagination
- Shopify sets canonical_url on paginated pages to point to page 1 — but this only matters if Googlebot can crawl them
- No `robots.liquid` in theme = robots.txt is platform-generated; can be edited in Shopify Admin
- Confirmed on ledsone.co.uk 2026-10-06: `Disallow: /*?page=*` present, pagination active on `/collections/all?page=2`
