# GA-02 — Robots.txt Collection Pagination — Safe Implementation Plan
**Date:** 2026-10-06  
**Status:** PLAN ONLY — Nothing implemented  
**Author:** Claude Code (Step 2 analysis)  
**Preceding step:** `GA-02_discovery-report_2026-10-06.md`

---

## A. Current Rule (Verified Live 2026-10-06)

Fetched from `https://ledsone.co.uk/robots.txt`:

```
User-agent: *
...
Disallow: /*?page=*
...

User-agent: adsbot-google
...
Disallow: /*?page=*
...
```

Full relevant robots.txt content (both user-agent blocks shown in full):

```
# we use Shopify as our ecommerce platform

User-agent: *
Disallow: /*?q=*
Disallow: /services/login_with_shop
Disallow: /?filter/
Disallow: /a/downloads/-/*
Disallow: /admin
Disallow: /60277031118/checkouts
Disallow: /60277031118/orders
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /*?filter
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Disallow: /cdn/wpm/*.js
Disallow: /recommendations/products
Disallow: /*/recommendations/products
Disallow: /*?*srsltid
Disallow: /*?page=*                        ← THE RULE TO REPLACE
Disallow: /*?_pos*
Disallow: /*?pr_prod_strat=*
Disallow: /*?filter.p.m.custom.model=*
Disallow: /*?filter.p.m.custom.colour=*
Disallow: /*?filter.p.m.custom*
Disallow: /*.atom
Disallow: /blogs/new/tagged/

User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /orders
Disallow: /60277031118/checkouts
Disallow: /60277031118/orders
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /*?*srsltid
Disallow: /*?page=*                        ← THE RULE TO REPLACE
Disallow: /*?filter
Disallow: /*?_pos

User-agent: Nutch

User-agent: AhrefsBot
[AhrefsBot block — does NOT contain /*?page=* — no change needed here]
...

Sitemap: https://ledsone.co.uk/sitemap.xml
```

---

## B. Problem

`Disallow: /*?page=*` is a wildcard pattern that blocks **every URL containing `?page=`** anywhere in it. This means:
- `/collections/all?page=2` — **BLOCKED** (real products, unique content — should be crawled)
- `/collections/vintage-cables?page=3` — **BLOCKED** (real products, unique content — should be crawled)
- `/collections/all?page=2&section_id=template--24751307194754__...` — **BLOCKED** (Shopify AJAX rendering URL)

The site has 5,033 products with 24 products per page. Any collection with more than 24 products has crawlable page 2+ that Google cannot reach. This means products only visible on page 2+ are invisible to Google.

---

## C. Legitimate Pagination Pages Confirmed

Tested and verified (no noindex, real products):

| URL | Products Shown | Status |
|---|---|---|
| `/collections/all?page=2` | 48 products (of 5,033 total) | 200 OK — real products |
| `/collections/all?page=3` | 72 products visible (cumulative load-more count) | 200 OK — real products |
| `/collections/vintage-cables?page=2` | 36 products (of 147 total) | 200 OK — real products |

**None of these pages have a noindex meta tag. They are legitimate pages Google should be able to crawl.**

`/collections/led-modules?page=2` returned no products (collection only has 8 products — no page 2 exists). This is expected — Shopify returns empty results for out-of-range page numbers, not 404.

---

## D. Parameter Types Discovered

### Theme code analysis — `snippets/pagination.liquid`

The pagination snippet (line 126) generates the "Load More" link as:
```
{paginate.next.url}{pagination_ps}&section_id={section.id}
```

Where `pagination_ps` preserves `layout=` and `pagination=` parameters if present in the current URL.

| Parameter | Source | Purpose | Crawl Risk |
|---|---|---|---|
| `?page=N` | Shopify `paginate` Liquid | Page number — core pagination | **LOW — unique content per page** |
| `&layout=list` or `&layout=grid` | Theme preference | View mode | LOW — same products, different display only |
| `&pagination=load_more` etc | Theme preference | Pagination UI style | LOW — same products |
| `&section_id=template--...` | Theme `pagination.liquid` line 126 | Shopify AJAX section rendering | **MEDIUM — returns same content as clean URL, creates duplicate URL pairs** |
| `?sort_by=*` | Shopify sort | Product sort order | HIGH — creates duplicate sorted pages; already blocked by `/collections/*sort_by*` |
| `?filter.*` | Shopify Search & Discovery | Faceted filtering | HIGH — crawl explosion if combined with pagination |
| `?filter.p.m.custom*` | Custom metafield filters | Custom attribute filtering | HIGH — already partially blocked |
| `?q=*` | Shopify search | Site search | HIGH — already blocked |

### Existing rules that already handle related concerns

| Rule | What it blocks | Still effective after fix? |
|---|---|---|
| `/collections/*sort_by*` | Sort URLs in collection path | YES ✓ |
| `/*/collections/*sort_by*` | Sort URLs with locale prefix | YES ✓ |
| `/*?filter` | URLs where query string starts with `filter` | YES — but does NOT block `?page=2&filter.*` |
| `*/collections/*filter*&*filter*` | Multiple filter combinations | YES ✓ |
| `/*?filter.p.m.custom*` | Custom metafield filter params | YES ✓ |

**Gap:** `/*?filter` only blocks URLs where the FIRST query parameter is `filter`. It does NOT block `/collections/all?page=2&filter.v.availability=1` because the first param is `page`, not `filter`.

---

## E. Proposed Replacement Rules

### Remove (in BOTH User-agent: * and User-agent: adsbot-google)
```
Disallow: /*?page=*
```

### Add (in BOTH User-agent: * and User-agent: adsbot-google)
```
Disallow: /*?page=*&*filter*
Disallow: /*?page=*&sort_by*
Disallow: /*?page=*&section_id*
```

### Rationale for each new rule

**`Disallow: /*?page=*&*filter*`**
- Blocks pagination combined with any filter parameter
- Prevents crawl explosion from paginated filter result pages
- Example blocked: `/collections/all?page=2&filter.v.availability=1`
- Example blocked: `/collections/vintage-cables?page=3&filter.p.product_type=LED+Cable`

**`Disallow: /*?page=*&sort_by*`**
- Blocks pagination combined with sort parameters
- Belt-and-suspenders: sort is already blocked by `/collections/*sort_by*`, but that only catches sort_by in the path, not as query param
- Example blocked: `/collections/all?page=2&sort_by=price-ascending`

**`Disallow: /*?page=*&section_id*`**
- Blocks Shopify AJAX section rendering URLs that contain both `page=` and `section_id=`
- These return identical content to the clean `?page=N` URL
- Prevents Google indexing duplicate content pairs (`?page=2` vs `?page=2&section_id=...`)
- Example blocked: `/collections/all?page=2&section_id=template--24751307194754__product-grid`

---

## F. URLs That Would Be Allowed After Fix

| URL | Currently | After Fix |
|---|---|---|
| `/collections/all?page=2` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/all?page=3` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/vintage-cables?page=2` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/led-strip-lights?page=2` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/all?page=2&layout=list` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/all?page=2&layout=grid` | ❌ BLOCKED | ✅ ALLOWED |
| `/collections/all?page=2&pagination=load_more` | ❌ BLOCKED | ✅ ALLOWED |

---

## G. URLs That Would Be Blocked After Fix

| URL | Block Rule |
|---|---|
| `/collections/all?page=2&filter.v.availability=1` | `/*?page=*&*filter*` |
| `/collections/all?page=3&filter.p.product_type=LED+Strip` | `/*?page=*&*filter*` |
| `/collections/all?page=2&sort_by=price-ascending` | `/*?page=*&sort_by*` |
| `/collections/all?page=2&section_id=template--24751307194754__...` | `/*?page=*&section_id*` |
| `/collections/all?sort_by=price-ascending` (no page) | Existing: `/collections/*sort_by*` |
| `/collections/all?filter.v.availability=1` (no page) | Existing: `/*?filter` |

---

## H. Why the Rules Are Safe

1. **No clean pagination URL is blocked.** The three new rules all require an additional `&param` in the URL — a clean `?page=N` URL with no other parameters passes all three rules.

2. **Sort URLs remain blocked.** Both the existing `/collections/*sort_by*` rule and the new `/*?page=*&sort_by*` rule protect against sorted pages.

3. **Filter combinations remain blocked.** The new `/*?page=*&*filter*` rule closes the gap in the existing `/*?filter` rule (which only blocked filter as the first param, not as a second param after `page=`).

4. **Section_id AJAX URLs are blocked.** This prevents Google from seeing duplicate content pairs where `?page=2` and `?page=2&section_id=...` would produce identical HTML.

5. **Existing rules are unchanged.** The 30+ other Disallow rules remain in place. Only `/*?page=*` is removed and replaced with three targeted rules.

6. **AhrefsBot block is unchanged.** AhrefsBot's block does not contain `/*?page=*` — no change needed.

---

## I. Shopify Admin Implementation Location

Shopify robots.txt can be customised in two ways:

### Method 1 — Theme robots.txt.liquid template (Recommended — most control)

1. Go to: **Shopify Admin → Online Store → Themes → [Active theme] → Edit code**
2. In the `templates/` folder, create a new file named: `robots.txt.liquid`
3. Write the complete robots.txt content using Liquid, substituting the new rules
4. Shopify will serve the theme file instead of the platform-generated default

Notes:
- This completely replaces the auto-generated robots.txt
- Must include ALL desired rules (copy from live robots.txt, then edit the two `/*?page=*` lines)
- Use `{{ 'robots.txt' | asset_url }}` is NOT how this works — the file itself IS served as robots.txt
- Content-type is automatically set to `text/plain` by Shopify for `robots.txt.liquid`

### Method 2 — Shopify Admin Preferences (If available on plan)

1. Go to: **Shopify Admin → Online Store → Preferences**
2. Scroll to "Search engine robots instructions" section (if visible)
3. Edit the robots.txt field directly

Note: This UI option may not be available on all Shopify plans. Method 1 (theme file) is universally available.

---

## J. Verification Plan (After Implementation)

| Step | Action | Pass Criteria |
|---|---|---|
| 1 | Fetch `https://ledsone.co.uk/robots.txt` | Old `Disallow: /*?page=*` gone. Three new rules present. |
| 2 | Test with Google Search Console URL Inspection | `/collections/all?page=2` → "Allowed to crawl" (not "Blocked by robots.txt") |
| 3 | Test blocked URLs in GSC URL Inspection | `/collections/all?page=2&section_id=...` → "Blocked by robots.txt" |
| 4 | Request indexing on 2-3 page-2 collection URLs in GSC | Google accepts the request (confirmation it's no longer blocked) |
| 5 | Monitor GSC Coverage report over 2–4 weeks | New "Crawled - currently not indexed" or "Indexed" entries for `?page=` URLs |
| 6 | Check crawl budget in GSC → Settings → Crawl Stats | No unexpected spike in crawl activity (sign of filter URL explosion) |

---

## K. Rollback Plan

Since the change is made either in the Admin or in a theme file:

### If using robots.txt.liquid (Method 1):
1. Go to Shopify Admin → Online Store → Themes → Edit code
2. Delete the `robots.txt.liquid` file from `templates/`
3. Shopify immediately reverts to its auto-generated robots.txt (which includes the original `/*?page=*` rule)
4. Verify at `https://ledsone.co.uk/robots.txt` — should revert within seconds

### If using Admin Preferences editor (Method 2):
1. Go to Shopify Admin → Online Store → Preferences
2. Restore the original `Disallow: /*?page=*` line in both user-agent blocks
3. Verify at `https://ledsone.co.uk/robots.txt`

**Rollback time: < 2 minutes in either case. No deploy required.**

---

## Risk Summary

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| Crawl explosion from paginated filter pages | LOW-MEDIUM | HIGH | `/*?page=*&*filter*` rule blocks these |
| Google indexing section_id duplicate URLs | LOW (Googlebot follows links, may prefer clean URL) | MEDIUM | `/*?page=*&section_id*` rule blocks these |
| Googlebot crawl budget spike | LOW | MEDIUM | New rules limit to clean pagination only |
| Accidental block of legitimate URLs | VERY LOW | HIGH | Each rule requires a second `&` parameter — clean `?page=N` is never blocked |
| Rollback failure | NEGLIGIBLE | — | Rollback removes theme file; auto-generation restores original rules instantly |

---

## Status

**PLAN COMPLETE. Nothing implemented. Awaiting Piranav/GPT approval to proceed with implementation.**
