# Prompt: Shopify Layout Audit — Three Page Types

---

## Title
Shopify Layout Audit — Three Page Types (Homepage / Collection / Product)

## Purpose
Structured layout audit across the three core Shopify page types — homepage, collection page, and product page — benchmarked against competitor stores. Discovery only. No code changes. Produces a gap list and prioritised fix recommendation.

## Business Question
> "Compared to the benchmark stores, what layout gaps exist on this store's three core page types, and which gaps can be closed fastest with lowest risk?"

## When to Use
- Before starting any layout or conversion optimisation sprint
- When a store has had no layout review in the last 90 days
- When a new competitor benchmark has been identified
- After a major theme update that may have disabled sections

## Pre-conditions
- At least 2 benchmark store URLs must be agreed with Varmen before starting
- Theme export must be available locally (pull with `shopify theme pull` if needed)
- Check `evidence/audits/` — confirm no layout audit for this store in the last 60 days

---

## Prompt Text

```
You are performing a structured layout audit across three page types for a Shopify store.

Store: [STORE URL]
Theme: [THEME EXPORT PATH OR NAME]
Benchmark stores: [BENCHMARK URL 1], [BENCHMARK URL 2]
Date: [DATE]
Scope: Discovery only — do not modify any files.

Audit these three page types:

### 1. Homepage
- Count total sections in theme JSON (sections/index)
- Count how many are ACTIVE vs DISABLED
- List each active section and its purpose
- Identify sections that exist in the theme but are disabled — flag any that could be enabled with zero code changes
- Compare with benchmark: what sections do benchmarks have that this store is missing?

### 2. Collection Page
- Filters: present / absent
- Breadcrumbs: present / absent
- Banner/hero: present / absent
- Sort options: present / absent
- Compare with benchmark: what does the benchmark collection page show that this store does not?

### 3. Product Page
- Description: present / absent / disabled
- Tabs or accordions: present / absent
- Reviews section: present / absent
- Trust badges: present / absent
- Cross-sell / upsell: present / absent
- Stock status: present / absent
- Compare with benchmark

Output format:

## Homepage
| Section | Status | Notes |
|---|---|---|

Disabled sections that could be enabled (zero code required):
- [list]

Benchmark gaps:
- [list]

## Collection Page
| Element | Status | Notes |
|---|---|---|

Benchmark gaps:
- [list]

## Product Page
| Element | Status | Notes |
|---|---|---|

Benchmark gaps:
- [list]

## Top Priority Fixes
Ranked by: (a) zero-code or low-risk, (b) highest visible impact
| Priority | Fix | Effort | Risk |
|---|---|---|---|

## Next Session Action
```

---

## Expected Claude Output
- Homepage section inventory (active vs disabled)
- Zero-code enablement list
- Collection page gap table
- Product page gap table
- Benchmarked gap list per page type
- Priority fix table ranked by effort/risk
- Next session action

## Evidence Required
- Evidence file: `evidence/audits/[store]-layout-audit-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: All 3 page types audited, benchmark comparison included, priority fix list present.
FAIL: Any page type omitted, or no benchmark comparison made.

## Related Tasks
- `prompts/implementation/shopify-lighthouse-accessibility-fix.md`
- Pattern: `shopify-layout-audit-three-page` (from 2026-06-18, 2026-06-19 sessions)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-18.md` — electricalsone layout audit; 16 disabled sections found; 5 zero-code quick wins identified
- `closure/sessions/2026-06-19.md` — electricalsone layout audit continuation; 3-page scope confirmed
- `evidence/audits/electricalsone-layout-audit-2026-06-18.md`
- `evidence/audits/electricalsone-layout-audit-2026-06-19.md`
