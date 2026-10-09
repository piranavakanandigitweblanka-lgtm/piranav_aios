# BGCT Website UI/UX Documentation Pack

**Status:** DRAFT — Pending review by Sajeesan (Technical Reviewer) and Tamil Selvan (Queryability Reviewer)
**Created:** 2026-10-09
**Owner:** Piranav (Website Tec team)
**Coordinator:** Sathees
**Technical Reviewer:** Sajeesan / assigned senior developer
**Queryability Reviewer:** Tamil Selvan / assigned reviewer
**Business Validator:** Relevant domain owner

---

## Purpose

This documentation pack translates every task in the BGCT Website UI/UX workbook into four practical, self-contained resources that a Team Leader can review, execute, and validate without verbal explanation:

1. **Best Practice** — recommended approach with rationale, user problem addressed, device considerations, exceptions, and trade-offs
2. **Guidelines** — decision rules, priority, user journey context, escalation conditions, and approval requirements
3. **Checklist** — individual observable checks with tool, expected behaviour, PASS/FAIL criteria, severity, and evidence
4. **Tutorial** — step-by-step instructions, tool references, how to interpret results, troubleshooting, and rollback guidance

---

## Source Workbook

| Field | Value |
|---|---|
| File | `Website UI_UX Tasks  BGCT.xlsx` |
| Location | `C:\Users\PC\Downloads\` (read-only — not modified) |
| Worksheets | 4 (see below) |
| Total tasks | 28 |

---

## Worksheets and Task Count

| # | Worksheet | Tasks | Folder |
|---|---|---|---|
| 1 | Conversion Optimization (CRO) | 10 | `01-conversion-optimization-cro/` |
| 2 | Design & Layout | 8 | `02-design-and-layout/` |
| 3 | Accessibility | 4 | `03-accessibility/` |
| 4 | Theme Customization | 6 | `04-theme-customization/` |

---

## Folder Structure

```
docs/bgct-ui-ux/
├── README.md                              ← This file (index + coverage matrix)
├── 01-conversion-optimization-cro/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
├── 02-design-and-layout/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
├── 03-accessibility/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
└── 04-theme-customization/
    ├── best-practice.md
    ├── guidelines.md
    ├── checklist.md
    └── tutorial.md
```

---

## Task-by-Task Coverage Matrix

| ID | Task Name | Sheet | Best Practice | Guidelines | Checklist | Tutorial |
|---|---|---|---|---|---|---|
| CRO-1 | Cart Flow Improvements | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-2 | Checkout Flow Improvements | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-3 | Trust Signals: Reviews | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-4 | Trust Signals: Badges | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-5 | Trust Signals: Guarantees | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-6 | Sticky Headers | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-7 | Floating Cart | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-8 | Quick View | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-9 | Upsell UI | CRO | ✅ | ✅ | ✅ | ✅ |
| CRO-10 | Cross-sell UI | CRO | ✅ | ✅ | ✅ | ✅ |
| DL-1 | Homepage Layout Improvements | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-2 | Collection Page Layout Improvements | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-3 | Product Page Layout Improvements | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-4 | Mobile Responsiveness Fixes | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-5 | CTA Placement | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-6 | CTA Design | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-7 | Typography Consistency | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| DL-8 | Color Consistency | Design & Layout | ✅ | ✅ | ✅ | ✅ |
| ACC-1 | Color Contrast Fixes | Accessibility | ✅ | ✅ | ✅ | ✅ |
| ACC-2 | Keyboard Navigation | Accessibility | ✅ | ✅ | ✅ | ✅ |
| ACC-3 | ARIA Label Improvements | Accessibility | ✅ | ✅ | ✅ | ✅ |
| ACC-4 | Microsoft Clarity | Accessibility | ✅ | ✅ | ✅ | ✅ |
| TC-1 | Liquid Template Edits | Theme Customization | ✅ | ✅ | ✅ | ✅ |
| TC-2 | Custom Sections | Theme Customization | ✅ | ✅ | ✅ | ✅ |
| TC-3 | Custom Blocks | Theme Customization | ✅ | ✅ | ✅ | ✅ |
| TC-4 | Navigation Menu Restructuring | Theme Customization | ✅ | ✅ | ✅ | ✅ |
| TC-5 | Footer Redesigns | Theme Customization | ✅ | ✅ | ✅ | ✅ |
| TC-6 | Header Redesigns | Theme Customization | ✅ | ✅ | ✅ | ✅ |

**Coverage: 28/28 tasks — 100%**

---

## Claims and Items Flagged for Human Review

| Ref | Claim / Item | Flag | Reviewer Action |
|---|---|---|---|
| CRO-3 | "Reviews with customer photos convert significantly higher" | UNVERIFIED CLAIM — Widely cited in CRO literature but not proven by a specific study for all store types. | Accept as general guidance; do not cite as proven fact in business reporting. |
| CRO-9/10 | "Upsell/cross-sell ROI" | REQUIRES BUSINESS VALIDATION — Conversion impact of upsell/cross-sell is store-specific. | Business validator to confirm which products are appropriate for upsell pairing. |
| DL-5 | "Add to Cart above the fold on all devices" | DEVICE-DEPENDENT — On small mobile screens with long variant selectors, this may not always be achievable without UX trade-offs. | Developer to confirm feasibility per device breakpoint. |
| ACC-1 | WCAG AA 4.5:1 ratio | CONFIRMED — Official W3C WCAG 2.1 standard. | No action needed. |
| ACC-4 | Microsoft Clarity 30-day data retention | VERIFY — Data retention policies can change. Confirm in Clarity documentation before relying on it for audits. | Check current Clarity data retention settings before planning audits. |
| TC-1–TC-3 | All Liquid code examples | REVIEW REQUIRED — Developer (Sajeesan) must review before team-wide use. | Sajeesan reviews all Liquid examples before team rollout. |

---

## Existing AIOS Assets Checked

| Asset | Location | Decision |
|---|---|---|
| `docs/shopify/ledsone_co_uk_ui_pending_audit.md` | `docs/shopify/` | Existing — ledsone-specific UI audit. BGCT pack is task-standard documentation. No duplication. Recommend cross-referencing. |
| `evidence/shopify/electricalsone/pdp-uiux/` | `evidence/shopify/` | Existing — PDP fix evidence for Electricalsone. Not equivalent to BGCT task documentation. |
| `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `prompts/implementation/` | Existing — specific lighthouse fix prompt. Different scope. No duplication. |
| `docs/ai-tools/ui-ux-pro-max-skill/` | `docs/ai-tools/` | Existing — AI skill documentation. Different purpose. No duplication. |

---

## Known Limitations

- All documents are DRAFT status. Liquid code examples in Tutorial files require Sajeesan's review before team use.
- Microsoft Clarity is categorised in the "Accessibility" worksheet by the workbook. It is technically a CRO/analytics tool. This categorisation is preserved as-is from the source — it has been noted but not changed.
- CRO claims about conversion uplift percentages are not cited because no authoritative source is provided in the workbook. Claims are presented as best practice guidance, not proven metrics.
- Theme Customization tutorials assume Shopify OS 2.0 (Dawn-family themes). Legacy themes may differ.

---

## Recommended Next Action

1. Sajeesan to review Liquid code examples in all Tutorial files.
2. Tamil Selvan to confirm each task is findable by exact name via this README.
3. Sathees to approve as coordinator before promoting to team use.
4. After approval: update status from DRAFT to APPROVED in each file header.
5. Recommend cross-referencing `docs/shopify/ledsone_co_uk_ui_pending_audit.md` from this index.

---

## Related AIOS Assets

| Asset | Path |
|---|---|
| Evidence | `evidence/piranav/bgct-ui-ux-docpack-2026-10-09.md` |
| Validation | `validation/piranav/bgct-ui-ux-docpack-validation-2026-10-09.md` |
| Prompt | `prompts/ui-ux/bgct-ui-ux-doc-pack-prompt.md` |
| Closure | `closure/README.md` — session 2026-10-09 |
