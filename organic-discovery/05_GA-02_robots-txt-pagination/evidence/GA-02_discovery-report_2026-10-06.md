# GA-02 — Robots.txt Collection Pagination — Discovery Report
**Date:** 2026-10-06  
**Status:** DISCOVERY COMPLETE — Fix not implemented  
**Tester:** Claude Code (automated page fetch + theme file inspection)  
**Task brief:** STEP 1 — DISCOVERY + AUDIT ONLY. No Shopify or theme changes made.

---

## 1. Live robots.txt — Key Findings

**Fetched from:** https://ledsone.co.uk/robots.txt

Relevant blocking rules confirmed:

```
User-agent: *
Disallow: /*?q=*
Disallow: /*?sort_by*
Disallow: /*+*
Disallow: /*%2B*
Disallow: /*%2b*
Disallow: /*?page=*          ← BLOCKS ALL COLLECTION PAGINATION
Disallow: /policies/
Disallow: /*/account
...
Sitemap: https://ledsone.co.uk/sitemap.xml

User-agent: adsbot-google
...
Disallow: /*?page=*          ← ALSO BLOCKS FOR ADSBOT
```

**The `Disallow: /*?page=*` rule is a wildcard pattern.** It matches ANY URL containing `?page=` anywhere — including:
- `/collections/all?page=2`
- `/collections/led-strip-lights?page=3`
- `/collections/all?page=2&section_id=template--24751307194754__product-grid`

---

## 2. Pagination Confirmed Active

**Tested URL:** `https://ledsone.co.uk/collections/all`

Result: 24 products shown with a pagination "Load More" / next page button using the following URL format:

```
/collections/all?page=2&section_id=template--24751307194754__product-grid
```

This confirms Shopify IS using `?page=` parameter for collection pagination. The full URL includes `section_id` too, but the blocking rule `/*?page=*` matches any URL that begins with `?page=` as a query parameter — both bare `?page=2` and `?page=2&section_id=...` are blocked.

---

## 3. Theme Files — robots.liquid

**Search result:** No `robots.liquid` file exists in the theme.

This means robots.txt is generated entirely by Shopify's platform. To customise it, either:
- Use the Shopify Admin → Online Store → Preferences → robots.txt editor (if available)
- Create a `robots.liquid` template in the theme to override the default

---

## 4. Theme Files — Canonical and Noindex Tags

**`layout/theme.liquid` line 53:**
```liquid
<link rel="canonical" href="{{ canonical_url }}">
```

Shopify sets `canonical_url` to the base collection URL (no `?page=` parameter) for paginated pages. This means Google sees a canonical pointing to page 1 — but because the pages are already disallowed in robots.txt, Google never crawls them to see the canonical.

**`snippets/seo-noindex.liquid`:**
- Only adds `noindex` for `template contains 'search'` pages
- Only adds client-side `noindex` for URLs with `srsltid` parameter (Google Shopping referral)
- Does NOT add `noindex` for `?page=` URLs

Conclusion: there is no server-side noindex being applied to pagination pages. The robots.txt disallow is the only blocking mechanism.

---

## 5. SEO Impact Assessment

| Factor | Finding | Impact |
|---|---|---|
| robots.txt blocks `?page=` | YES — `Disallow: /*?page=*` confirmed | HIGH — Google cannot crawl any page 2+ |
| Pagination is actively used | YES — `/collections/all?page=2` confirmed with content | HIGH — real products are behind the pagination |
| Theme adds noindex to pagination | NO | N/A |
| Canonical points to page 1 | YES (Shopify default) | MEDIUM — even if crawled, Googlebot would defer to page 1 |
| Sitemap includes pagination URLs | NOT confirmed | Unknown — sitemaps typically only include page 1 URLs |

**Risk level: HIGH.** Products appearing only on page 2+ of any collection are invisible to Google. Collections with more than 24 products are likely affected.

---

## 6. Collections Most at Risk

Any collection with more than 24 products will have a page 2. Examples most likely affected:
- `/collections/all` — confirmed has 24+ products
- `/collections/led-strip-lights` — likely large collection
- `/collections/led-modules`, `/collections/led-drivers`, etc.

---

## 7. Fix Options Identified

| Option | Description | Risk | Effort |
|---|---|---|---|
| **A — Allow pagination in robots.txt** | Remove or replace `Disallow: /*?page=*` with more specific disallow rules (allow pagination, keep blocking sort/filter) | LOW — standard SEO fix | LOW — Shopify Admin edit |
| **B — Create robots.liquid** | Override full robots.txt with custom template that allows collection pagination | MEDIUM — must replicate all existing rules carefully | MEDIUM — theme file creation |
| **C — Do nothing** | Leave pagination blocked | NONE — but SEO stays impaired | NONE |

**Recommended approach (pending Piranav approval):** Option A — edit robots.txt in Shopify Admin to:
- Remove `Disallow: /*?page=*`
- Add targeted disallows for non-content `?page=` usages if any

---

## 8. Discovery Conclusion

`Disallow: /*?page=*` in ledsone.co.uk robots.txt blocks all collection pagination from Google crawling. Shopify is actively using `?page=` for paginated collection pages. No server-side noindex exists for these pages. This is a confirmed SEO issue — products on page 2+ of large collections cannot be discovered by Google.

**No changes made. Discovery only.**

**GA-02 status: OPEN — fix not yet implemented.**
