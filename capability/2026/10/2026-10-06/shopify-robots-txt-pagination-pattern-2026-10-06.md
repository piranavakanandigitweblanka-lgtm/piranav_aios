# Capability — Shopify Robots.txt Pagination Fix Pattern

## Date First Identified
2026-10-06

## Last Updated
2026-10-06

## Status
CODE COMPLETE (local) — Live deployment pending. Implementation validation PASS (local).

## Purpose
Fix Shopify `robots.txt.liquid` to allow crawling of paginated collection pages while still blocking paginated URLs with filters, sort parameters, or section IDs appended.

## Business Problem Solved
A blanket `Disallow: /*?page=*` rule blocks ALL paginated URLs from crawling — including clean pagination like `/collections/all?page=2`. This prevents Google from discovering and indexing products on page 2, 3, etc., costing organic visibility. However, allowing ALL `?page=*` URLs would let crawlers index filtered/sorted variants (e.g. `?page=2&sort_by=price`) which creates duplicate content and wastes crawl budget. The fix threads the needle: allow clean pagination, block parameterised variants.

## When To Use
- Shopify store with more than one page of collection products
- Current `robots.txt` contains a blanket `Disallow: /*?page=*`
- SEO audit has identified crawl budget waste or unindexed paginated pages

## When NOT To Use
- If the store intentionally blocks all pagination (rare, e.g. infinite scroll with no crawlable pagination)
- If the `robots.txt.liquid` file uses a completely different rule structure — audit first

## Required Inputs
- Access to `templates/robots.txt.liquid` in the Shopify theme
- Confirmation that `User-agent: *`, `User-agent: Googlebot`, and `User-agent: adsbot-google` blocks all exist in the file

## Source Task / Requirement
GA-02 — Robots.txt Collection Pagination Fix
LEDSone UK, 2026-10-06

## Execution Steps

### Step 1 — Audit current robots.txt
Read `templates/robots.txt.liquid`. Find all instances of `Disallow: /*?page=*`.

### Step 2 — Replace the blanket rule with three targeted rules
For each User-agent block that contains `Disallow: /*?page=*`, replace it with:

```
Disallow: /*?page=*&*filter*
Disallow: /*?page=*&sort_by*
Disallow: /*?page=*&section_id*
```

**What these rules do:**
- `/*?page=*&*filter*` — blocks paginated filtered URLs (e.g. `?page=2&filter.v.availability=1`)
- `/*?page=*&sort_by*` — blocks paginated sorted URLs (e.g. `?page=2&sort_by=price-ascending`)
- `/*?page=*&section_id*` — blocks paginated section AJAX calls (e.g. `?page=2&section_id=collection-template`)

**What these rules allow:**
- `/collections/all?page=2` — ALLOWED (clean pagination, crawlable)
- `/collections/vintage-cables?page=3` — ALLOWED (clean pagination, crawlable)

### Step 3 — Apply to all three User-agent blocks
The same replacement must be applied in:
- `User-agent: *` block
- `User-agent: Googlebot` block
- `User-agent: adsbot-google` block

### Step 4 — Validate locally
Check:
- `?page=2` → no match against any of the 3 new rules → ALLOWED ✓
- `?page=2&filter.v.availability=1` → matches `/*?page=*&*filter*` → BLOCKED ✓
- `?page=2&sort_by=price-ascending` → matches `/*?page=*&sort_by*` → BLOCKED ✓
- `?page=2&section_id=...` → matches `/*?page=*&section_id*` → BLOCKED ✓

### Step 5 — Deploy and verify live
Run `shopify theme push` and confirm the live `/robots.txt` reflects the new rules.
After 1–4 weeks, check GSC Coverage for newly indexed paginated pages.

## Evidence Required
- Before: screenshot of live `robots.txt` showing `Disallow: /*?page=*`
- Local validation checklist (all 4 test cases PASS)
- After: screenshot of live `robots.txt` showing the 3 new rules

## Evidence Path
`validation/piranav/GA-02_implementation-validation_2026-10-06.md`
`validation/piranav/GA-02_plan-validation_2026-10-06.md`
`validation/piranav/GA-02_discovery-validation_2026-10-06.md`
`prompts/shopify/ga-02-robots-pagination-discovery.md`

## Pass / Fail Rule
PASS: All 4 test cases pass locally. Live deployment confirms new rules. GSC shows paginated pages becoming indexable.
FAIL: Clean pagination URLs still blocked, OR filter/sort URLs now crawlable.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- GSC indexing changes take 1–4 weeks to reflect — do not declare failure within the first week
- This fix targets Shopify's Liquid robots template only — if the store has a custom `robots.txt` (not `.liquid`), a different approach is needed
- If additional parameterised URL types exist (e.g. `?currency=`, `?variant=`), additional rules may be needed
- The three rules must appear in all three User-agent blocks — missing one block leaves a gap

## Reuse Path
Apply to any Shopify store where the `robots.txt.liquid` has a blanket `Disallow: /*?page=*`. Adjust the parameter patterns if the store uses non-standard filter/sort parameter names.

## Related Capabilities
None directly related in current capability library.

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-06 | Initial capability captured from GA-02 discovery and implementation | `validation/piranav/GA-02_implementation-validation_2026-10-06.md` |
