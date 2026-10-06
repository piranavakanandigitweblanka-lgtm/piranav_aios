# GA-01 — Remove Hidden Zero-Price and Promo Text from Product Template

**Status:** CODE FIX VERIFIED LIVE — Type A PASS 3/3. Type C admin-corrected. Type B app resolved. Type D (wrong compare prices) is a separate pending data task.
**Created:** 2026-10-06
**Theme:** ledsone-uk-theme

## Goal
Remove or conditionally render three strings that appear in the product page HTML/source but should not be present for products where they are irrelevant:
1. `Sale price 0.00` — accessibility label rendered even when no compare-at price exists
2. `LEDCL10%` — promo code hardcoded in DOM for all products, JS-hidden for non-matching
3. `SAVESJ15` — promo code hardcoded in DOM for all products, JS-hidden for non-matching

## Root Cause Files
- `snippets/price.liquid` → Sale price 0.00
- `snippets/pk-discount-banner.liquid` → LEDCL10% and SAVESJ15

## Evidence
- `evidence/GA-01_root-cause-investigation_2026-10-06.md`

## Proposed Fixes
See evidence file — Fix A (price.liquid) and Fix B (pk-discount-banner.liquid).

## Do NOT Apply Until Approved
