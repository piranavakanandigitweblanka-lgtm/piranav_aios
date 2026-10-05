# Prompt — ElectricalsOne Fake Judge.me Rating: Deploy and Verify

**Category:** Shopify Theme Deployment + Verification
**Prompt ID:** ES-URGFIX-01
**Created:** 2026-10-05
**Reusable by:** Any future session or executor

---

## Context

The ElectricalsOne.co.uk Shopify theme `templates/product.json` has been updated locally. The Judge.me app block setting `review_data` has been changed from `"sample_data"` to `""` on all three instances.

The code fix is complete. Deployment and verification have not yet been done.

**ITEM 2 (duplicate products with LEDSone) is NOT part of this task. Do not make any changes related to duplicate products, URLs, descriptions, collections, or SEO metadata.**

---

## Executor Instructions

### Step 1 — Confirm git commit

Before deploying, confirm that `shopify_projects/electricalsone-theme/templates/product.json` has been committed to git.

Run:
```
git status
git log --oneline -5
```

If not committed, commit it first (AIOS Rule 2).

### Step 2 — Identify the correct ElectricalsOne theme

Run:
```
shopify theme list
```

Confirm you are targeting the **live/published** ElectricalsOne theme, not a development/staging theme. Record the theme ID.

### Step 3 — Deploy the updated theme

Run from `shopify_projects/electricalsone-theme/`:
```
shopify theme push --theme <ELECTRICALSONE_THEME_ID>
```

Record:
- Theme ID used
- Date/time
- Output/result
- Any errors or warnings

### Step 4 — Wait for propagation

Wait 2–3 minutes after deployment before testing.

### Step 5 — Live product test (0 genuine reviews)

1. Open an ElectricalsOne product with 0 genuine Judge.me reviews in an Incognito/private browser window.
2. Hard-refresh the page (Ctrl+Shift+R).
3. Confirm:
   - No 4.5-star rating is visible.
   - No "10 reviews" is visible.
   - Judge.me shows the correct empty state (or no widget at all).
4. Take a screenshot → save as `after-fix-product-page.png`

### Step 6 — Judge.me review state confirmation

Check the Judge.me admin to confirm the product genuinely has 0 reviews.
Take a screenshot → save as `judgeme-zero-reviews.png`

### Step 7 — Genuine review test

On a product that **does** have genuine Judge.me reviews:
- Confirm real reviews still display correctly.
- Confirm the star rating matches the actual review data.

### Step 8 — Google Rich Results Test

1. Open: https://search.google.com/test/rich-results
2. Paste the live product URL (same product with 0 genuine reviews).
3. Run the test.
4. Check the output for `aggregateRating`.
5. Confirm there is **no** `aggregateRating` with `ratingValue: 4.5` or `reviewCount: 10`.
6. Take a screenshot → save as `google-rich-results-test.png`

### Step 9 — Record results

Update the following AIOS files with actual results:

- `verification/live_verification.md`
- `verification/rich_results_verification.md`
- `evidence/README.md` — update status of each evidence item
- `closure/closure_record.md` — update checklist and set final status

### Step 10 — Report outcome

Report:
- Deployment: COMPLETED / FAILED
- Live product test: PASS / FAILED
- Google Rich Results: PASS / FAILED
- Any issues found

---

## Pass Criteria

The task is PASS only if ALL of the following are confirmed:

1. Deployment completed without errors.
2. Live product with 0 genuine reviews shows no fake 4.5/10 rating.
3. Google Rich Results Test shows no fake `aggregateRating`.
4. Evidence screenshots saved.
5. AIOS closure record updated.

## Fail Criteria

- Fake rating still visible after deployment.
- Google Rich Results Test shows `ratingValue: 4.5` / `reviewCount: 10`.
- Deployment errors not resolved.
- Genuine reviews broken on products that have them.
