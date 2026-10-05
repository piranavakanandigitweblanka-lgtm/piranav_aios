# Task — ElectricalsOne.co.uk: Remove Fake Judge.me Star Rating

**Task assigned by:** Muguntha / management request
**User:** Piranav
**Date assigned:** 2026-10-05
**Expected effort:** 1–2 hours
**Priority:** URGENT

---

## Issue

Every ElectricalsOne product page sampled was displaying:

- 4.5 stars
- 10 reviews

This rating was visible to customers and potentially to Google's crawlers. However, the Judge.me app showed **0 genuine reviews** for these products. The displayed rating was not real.

## Required Outcome

1. Products with 0 genuine Judge.me reviews must display **no star rating**.
2. Products with genuine Judge.me reviews must display those reviews correctly.
3. The Google Rich Results Test must show **no fake aggregateRating** (4.5 / 10) after deployment.

## Scope Boundary

This task covers **Item 1 only** — the fake Judge.me rating.

Item 2 (duplicate products between ElectricalsOne and LEDSone) is **NOT part of this task**. No duplicate-product changes are authorised here.

## Verification Requirements

After deployment:

1. Open a live ElectricalsOne product with 0 genuine Judge.me reviews.
2. Confirm no fake 4.5-star / 10-review rating is visible.
3. Confirm Judge.me shows the correct empty-review state.
4. Test in an Incognito/private browser window.
5. Run the product URL through Google Rich Results Test.
6. Confirm no `aggregateRating` with `ratingValue: 4.5` / `reviewCount: 10` is present.

## Files Involved

| File | Location |
|---|---|
| Product template JSON | `shopify_projects/electricalsone-theme/templates/product.json` |
| Main product section | `shopify_projects/electricalsone-theme/sections/main-product.liquid` |
