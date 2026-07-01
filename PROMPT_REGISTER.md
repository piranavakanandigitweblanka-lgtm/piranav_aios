# PROMPT_REGISTER.md — piranav AIOS Prompt Register

---

## STANDING RULE — GPT Prompt Capture (effective 2026-07-01)

Every GPT prompt received for a reusable task **must be registered here** before the task is executed.
Full rule: `prompts/GPT_CAPTURE_RULE.md`

Add a row to this register each time a new prompt is saved. Update the row after the task is executed and evidence is filed.

---

## What This Is

Single authoritative register of all reusable Claude/GPT prompt patterns used in piranav's AIOS workspace. Every row represents a pattern that was used in at least one real work session. New patterns are added via `prompts/closure/capability-log-extraction.md`.

---

## How to Read This Table

| Column | Meaning |
|---|---|
| Date | Date the pattern was first used in a real session |
| Pattern Name | Kebab-case identifier matching the CAPABILITY LOG entry |
| Category | discovery / implementation / validation / documentation / closure / reusable |
| Template File | Path to prompt template, or PENDING if not yet created |
| Source Session | Closure log where this pattern was first recorded |
| Status | ACTIVE / PENDING / DEPRECATED |

**From 2026-07-01:** every row must also be linked to the task evidence file once the task is executed. If no evidence file exists yet, mark as PENDING in the Source Session column.

---

## Register

| Date | Pattern Name | Category | Template File | Source Session | Status |
|---|---|---|---|---|---|
| 2026-06-09 | `shopify-section-code-review` | discovery | `prompts/discovery/shopify-liquid-section-code-review.md` | `closure/sessions/2026-06-09.md` | ACTIVE |
| 2026-06-09 | `shopify-css-render-block-fix` | implementation | `prompts/implementation/shopify-css-render-blocking-fix.md` | `closure/sessions/2026-06-09.md` | ACTIVE |
| 2026-06-12 | `coupon-card-row-widget` | implementation | PENDING | `closure/sessions/2026-06-12.md` | PENDING |
| 2026-06-12 | `faq-schema-duplicate-fix` | implementation | PENDING | `closure/sessions/2026-06-12.md` | PENDING |
| 2026-06-15 | `shopify-seo-13-strategy-audit` | discovery | `prompts/discovery/shopify-seo-strategy-audit.md` | `closure/sessions/2026-06-15.md` | ACTIVE |
| 2026-06-16 | `shopify-breadcrumb-collection-audit` | discovery | PENDING | `closure/sessions/2026-06-16.md` | PENDING |
| 2026-06-16 | `shopify-lighthouse-accessibility-fix` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-16.md` | ACTIVE |
| 2026-06-17 | `lighthouse-menu-banner-link-discernible-text-fix` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-17.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-17 | `inp-eval-in-scroll-path` | discovery | PENDING | `closure/sessions/2026-06-17.md` | PENDING |
| 2026-06-17 | `inp-render-blocking-head-script` | implementation | PENDING | `closure/sessions/2026-06-17.md` | PENDING |
| 2026-06-18 | `promo-banner-config-add-collection` | implementation | `prompts/implementation/shopify-promo-banner-config-add.md` | `closure/sessions/2026-06-18.md` | ACTIVE |
| 2026-06-18 | `shopify-cli-theme-workflow` | implementation | `prompts/shopify-cli-theme-workflow.md` | `closure/sessions/2026-06-18.md` | ACTIVE — procedural guide; needs template format upgrade |
| 2026-06-19 | `shopify-layout-audit-three-page` | discovery | `prompts/discovery/shopify-layout-audit-three-page.md` | `closure/sessions/2026-06-19.md` | ACTIVE |
| 2026-06-22 | `shopify-mcp-token-expiry-fix` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `theme-block-verification-audit` | validation | `prompts/validation/shopify-section-post-fix-verification.md` | `closure/sessions/2026-06-22.md` | ACTIVE |
| 2026-06-22 | `ai-block-remediation-standard` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `search-grid-2026-audit` | discovery | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `srp-grid-2026` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-23 | `liquid-aria-label-strip-guard` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-23.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-23 | `visually-hidden-link-context-span` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-23.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-23 | `shopify-search-intent-upgrade-audit` | discovery | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-23 | `shopify-intent-layer-standalone-js` | implementation | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-23 | `shopify-standalone-intent-advisor-widget` | implementation | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-24 | `predictive-search-availability-filter-fix` | implementation | `prompts/implementation/shopify-predictive-search-field-fix.md` | `closure/sessions/2026-06-24.md` | ACTIVE |
| 2026-06-24 | `ledsone-404-light-premium-2026` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `gmc-sales-channel-exclusion-fix` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `search-form-comment-block-recovery` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `shopify-product-id-audit` | discovery | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-07-01 | `daily-session-closure` | closure | `prompts/closure/daily-session-closure.md` | _(formalised from START_HERE.md protocol)_ | ACTIVE |
| 2026-07-01 | `capability-log-extraction` | closure | `prompts/closure/capability-log-extraction.md` | _(formalised from session CAPABILITY LOG practice)_ | ACTIVE |
| 2026-07-01 | `gpt-prompt-capture-rule` | closure | `prompts/GPT_CAPTURE_RULE.md` | _(standing rule — Varmen instruction 2026-07-01)_ | PERMANENT RULE |
| 2026-07-01 | `shopify-pdp-gallery-nav-add` | implementation | `prompts/implementation/shopify-pdp-gallery-nav-add.md` | `evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md` | ACTIVE |
| 2026-07-01 | `shopify-pdp-gallery-nav-fix` | implementation | `prompts/implementation/shopify-pdp-gallery-nav-fix.md` | `evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md` | ACTIVE |
| 2026-07-01 | `aios-closure-evidence-template` | documentation | `prompts/documentation/aios-closure-evidence-template.md` | _(standing template — applies to all future closure tasks)_ | ACTIVE |

---

## Summary

| Category | Total Patterns | Templates Created | Pending Templates |
|---|---|---|---|
| discovery | 8 | 3 | 5 |
| implementation | 17 | 5 | 12 |
| validation | 1 | 1 | 0 |
| documentation | 0 | 0 | 0 |
| closure | 2 | 2 | 0 |
| reusable | 0 | 0 | 0 |
| standing rules | 1 | 1 | 0 |
| **TOTAL** | **29** | **12** | **17** |

---

## Duplicate Risk Assessment

| Risk | Patterns Affected | Status |
|---|---|---|
| `lighthouse-menu-banner-link-discernible-text-fix`, `liquid-aria-label-strip-guard`, and `visually-hidden-link-context-span` are all variants of the same parent pattern | 3 patterns → 1 template | RESOLVED — all 3 map to `shopify-lighthouse-accessibility-fix.md` |
| `shopify-cli-theme-workflow` exists as a procedural guide in `prompts/` root — not in `implementation/` subfolder | 1 file | LOW RISK — no duplicate content; location inconsistency only |
| No two templates cover the same task type | — | CLEAN |

---

## Next Session Action

Priority order for creating PENDING templates:

| Priority | Pattern Name | Why |
|---|---|---|
| HIGH | `shopify-breadcrumb-collection-audit` | Breadcrumb bugs are a recurring issue across LEDSone and Electricalsone |
| HIGH | `search-grid-2026-audit` | Search grid audit pattern applies to both stores |
| HIGH | `ai-block-remediation-standard` | AI-generated blocks are increasingly common — needs a standard |
| MEDIUM | `inp-eval-in-scroll-path` | INP is a Core Web Vital — high business impact |
| MEDIUM | `shopify-mcp-token-expiry-fix` | MCP token expiry disrupts sessions regularly |
| MEDIUM | `shopify-search-intent-upgrade-audit` | Large design project — needs a reusable audit phase |
| LOW | `coupon-card-row-widget` | Store-specific but reusable across LEDSone group |
| LOW | `gmc-sales-channel-exclusion-fix` | Quick fix; low complexity |
| LOW | `search-form-comment-block-recovery` | Edge case; low recurrence risk |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Assigned Staff | piranav |
| Coordinator / Reviewer | Varmen |
| Last Updated | 2026-07-01 |

---

## Status

ACTIVE — first version created 2026-07-01. Recovered from 10 sessions (2026-06-09 to 2026-06-24). 29 patterns registered, 12 templates created, 17 pending. GPT Capture Rule in force from 2026-07-01 — all future prompts must be registered here before execution.
