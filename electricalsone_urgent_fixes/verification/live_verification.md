# Live Verification — Fake Judge.me Star Rating Fix

**Status:** PENDING
**To be completed after Shopify deployment**

---

## Pre-Verification Checklist

- [ ] Confirm the correct ElectricalsOne Shopify theme was updated.
- [ ] Confirm `shopify theme push` completed without errors.
- [ ] Wait 2–3 minutes after deployment before testing (CDN cache propagation).

---

## Deployment Record

| Field | Value |
|---|---|
| Store | electricalsone.co.uk |
| Theme name | (fill after deployment) |
| Theme ID | (fill after deployment) |
| CLI command used | `shopify theme push --theme <ID>` |
| Deployment date/time | PENDING |
| Deployed by | (fill) |
| Deployment result | PENDING |
| Shopify errors/warnings | PENDING |

---

## Live Product Test

Test on a product known to have **0 genuine Judge.me reviews**.

| Field | Value |
|---|---|
| Product URL | (fill after deployment) |
| Test date/time | PENDING |
| Browser | (fill) |
| Incognito/private window used | (fill) |

### Checks

| Check | Expected | Result |
|---|---|---|
| Fake 4.5-star rating visible | NOT visible | PENDING |
| "10 reviews" text visible | NOT visible | PENDING |
| Judge.me widget shows correct empty state | YES | PENDING |
| Page hard-refreshed before checking | YES | PENDING |

---

## Source / DOM Inspection

After deployment, check the live page source or DOM for:

| String | Expected | Found |
|---|---|---|
| `review_data` | Should not appear as `sample_data` | PENDING |
| `sample_data` | Should not appear | PENDING |
| `4.5` (in rating context) | Should not appear | PENDING |
| `10 reviews` | Should not appear | PENDING |
| `aggregateRating` | Only present if real reviews exist | PENDING |
| `ratingValue` | Only present if real reviews exist | PENDING |
| `reviewCount` | Only present if real reviews exist | PENDING |

---

## Genuine Review Functionality Test

Verify that real reviews still display correctly on products that have them.

| Field | Value |
|---|---|
| Product URL with real reviews | (fill) |
| Real reviews visible | PENDING |
| Star rating matches actual count | PENDING |

---

## Evidence to Capture

| Item | Filename | Status |
|---|---|---|
| After-fix product page screenshot | `after-fix-product-page.png` | PENDING |
| Judge.me zero-review state screenshot | `judgeme-zero-reviews.png` | PENDING |
| Deployment result (terminal/CLI) | `deployment-result.png` | PENDING |

Save evidence to: `electricalsone_urgent_fixes/evidence/`
