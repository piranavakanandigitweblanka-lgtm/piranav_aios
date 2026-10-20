# Validation — S1-PIR-02 Conduit Filters + JSON-LD

**Date:** 2026-10-19  
**Validator:** Piranav  
**Task:** S1-PIR-02 Steps 3, 5, 6 — collection-meta-filters.liquid, breadcrumb.liquid, stock message

---

## Checklist

| Check | Expected | Actual | Pass/Fail |
|---|---|---|---|
| F4/F5/F6 settings visible in theme editor | Filter 4/5/6 label + metafield fields show in Customize | Confirmed by user screenshot | PASS |
| Pack filter (F5) buttons generated | Shows "1 pack / 2 pack / 3 pack / 5 pack / 10 pack" | Not yet verified post-fix upload | PENDING |
| Pack=10 filter | Clicking "10 pack" hides all non-10-pack cards | Not yet verified post-fix upload | PENDING |
| CollectionPage JSON-LD | `<script type="application/ld+json">` with `@type: CollectionPage` present on conduit-accessories | Not yet verified in browser source | PENDING |
| BreadcrumbList JSON-LD still works | Existing breadcrumb schema still renders correctly | Not broken — block added after existing schema | PASS |
| Stock countdown block | "Only N left" shows when stock ≤ threshold | Uses existing theme block — no code change | PASS |
| No Liquid syntax errors on save | Shopify theme editor accepts the file | User confirmed file saved to Shopify | PASS |
| No blank default schema errors | File saves without "default can't be blank" error | Fixed — blank defaults removed | PASS |

---

## Pending Validation (Piranav to complete)

1. Open conduit-accessories collection in browser → View Source → search `CollectionPage` → confirm present
2. In theme editor set Filter 5 Option Name = `Type` → visit collection → confirm Pack filter shows correct values
3. Select "10 pack" → confirm only 10-pack variant cards visible
4. Select "1 pack" → confirm only 1-pack variant cards visible

---

## Files Validated

| File | Change | Upload Status |
|---|---|---|
| `sections/breadcrumb.liquid` | CollectionPage JSON-LD added | Uploaded |
| `sections/collection-meta-filters.liquid` | F4/F5/F6 + variant option mode | Uploaded 2026-10-19 |
| `snippets/stock-message.liquid` | Redundant — to be deleted | Not deleted yet |

---

## Result

**PARTIAL PASS** — code changes saved, filter schema confirmed visible. Filter functionality pending upload + theme editor config verification.
