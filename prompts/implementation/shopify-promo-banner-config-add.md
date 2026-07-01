# Prompt: Shopify Promo Banner — Add Collection to CONFIG

---

## Title
Shopify Promo Banner — Add Collection to CONFIG

## Purpose
Add a new collection handle to the `var CONFIG` object inside a quantity-unlock promo banner snippet, so that products in the new collection display the banner and reveal the discount code when quantity threshold is reached.

## Business Question
> "Is the new collection correctly registered in the promo banner CONFIG so that eligible products display the banner and correct code, without affecting any existing collection's banner behaviour?"

## When to Use
- A new collection has been created and needs a quantity-discount banner
- A new promotion code has been issued for a specific product category
- An existing promo banner is being extended to cover a new collection

## Pre-conditions
- The new collection must already exist in Shopify Admin with the correct handle
- The discount code must be confirmed and active in Shopify Admin
- The quantity threshold (minimum quantity to unlock) must be agreed with Varmen
- The snippet file (`snippets/pk-discount-banner.liquid` or equivalent) must be read before editing
- `evidence/fixes/` must be checked — confirm the collection is not already registered

---

## Prompt Text

```
You are adding a new collection entry to a Shopify promo banner CONFIG object.

Theme: [THEME EXPORT PATH OR NAME]
Store: [STORE URL]
Snippet file: [SNIPPET PATH — e.g. snippets/pk-discount-banner.liquid]
New collection handle: [COLLECTION HANDLE]
New collection label: [DISPLAY LABEL — e.g. '2 abat-jour']
New discount code: [CODE — e.g. ABAT10]
Quantity threshold: [NUMBER — e.g. 2]

Step 1 — READ THE FILE
Read the full snippet file.
Find the `var CONFIG` object.
List all existing collection entries in the format:
| Handle | Label | Code | Threshold |
|---|---|---|---|

Step 2 — DUPLICATE CHECK
Is [COLLECTION HANDLE] already in the CONFIG? If YES, stop and report — do not add a duplicate.

Step 3 — CONFLICT CHECK
Is [DISCOUNT CODE] already used for a different collection? Report it but proceed unless Varmen has said to stop.

Step 4 — ADD ENTRY
Add the new entry to the CONFIG object in the same format as existing entries.
Additive only — do not modify or reorder any existing entries.

Change:
| File | Line | Change |
|---|---|---|

Step 5 — VERIFY
Read back the changed section of the CONFIG and confirm:
(a) New entry is syntactically correct (correct comma placement, matching quotes)
(b) No existing entries were modified
(c) The handle, label, and code match the brief exactly

Do not change:
- Any existing CONFIG entries
- The JS logic that reads CONFIG
- Any other snippet or section files
```

---

## Expected Claude Output
- Existing CONFIG entries table
- Duplicate check result
- Code conflict check result
- Change table (file, line, before/after)
- Read-back verification of the changed CONFIG section
- Risk level (GREEN — additive only is always GREEN)

## Evidence Required
- Evidence file: `evidence/fixes/promo-banner-config-[collection-handle]-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: New entry added with correct syntax. Existing entries unchanged. Duplicate check confirmed clean. Grep verification passed.
FAIL: Existing entry modified, incorrect handle/code used, or duplicate added.

## Related Tasks
- `prompts/validation/shopify-section-post-fix-verification.md`
- Pattern: `promo-banner-config-add-collection` (from 2026-06-18 session)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-18.md` — `abat-jour` collection added to `pk-discount-banner.liquid` CONFIG; additive only; GREEN risk
- `evidence/fixes/abat-jour-promo-banner-fix-2026-06-18.md`
