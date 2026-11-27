# Prompt: LEDSone FR — Google Ads Conversion Tracking Investigation

**Category:** discovery
**Pattern Name:** `ledsone-fr-google-ads-conversion-investigation`
**First Used:** 2026-11-27
**Status:** ACTIVE

---

## Purpose

Investigate and configure Google Ads purchase conversion tracking for a Shopify store (ledsone.fr). Covers: conversion action audit, Tag Assistant purchase event testing on the thank-you page, hit card inspection, Shopify order cross-verification, and outstanding issue identification.

---

## Prompt Template

```
Review Google Ads conversion tracking for [store]:

1. List all conversion actions — identify primary vs secondary, active vs removed.
2. Check if any purchase conversion actions are removed or misconfigured — re-enable if appropriate.
3. Connect Tag Assistant to [store thank-you page URL with test order].
4. Record all tags fired: tag IDs, hit types, parameters (value, currency, transaction_id, page_location).
5. Cross-verify conversion value against actual Shopify order: subtotal vs shipping vs total.
6. Note payment status of test order — flag if unpaid.
7. Record all outstanding warnings in the Google Ads account.
8. Produce findings table: confirmed / pending / outstanding.
```

---

## Key Technical Notes

- InfinitePixel conversion tag fires to `AW-[account ID]` — verify account ID matches the client account
- Tag Assistant hit cards ≠ confirmed duplicate counting — requires parameter analysis to confirm
- Shopify Bank Deposit orders may be unpaid at time of thank-you page — clarify conversion policy with business owner
- "Purchase goal — Needs attention" = primary conversion action misconfiguration — investigate in Goals > Conversions
- Re-enabling a Removed conversion action → status becomes "Awaiting conversions" — normal, not an error
- InfinitePixel fires product subtotal (not order total including shipping) — verify this is intended behaviour

---

## Results — First Run (ledsone.fr, 2026-11-27)

| Metric | Value |
|---|---|
| Tags on site | GT-NCTTCV3C, G-G9NQ5L3Q6V |
| InfinitePixel account | AW-16922105395 |
| Test order subtotal | €56.79 |
| Test order total | €65.78 (unpaid — Bank Deposit) |
| Conversion value fired | €56.79 (subtotal, not total) |
| Re-enabled action | Purchase(infinitePixel)29183 |
| Account warnings | "Needs attention" on Purchase goal + payment method banner |

---

## Evidence

`evidence/piranav/ledsone-fr-google-ads-conversion-setup-2026-11-27.md`
`reports/ledsone-fr/LEDSone_FR_Google_Ads_Conversion_Setup_Trainee_Report_27Nov2026.docx`
