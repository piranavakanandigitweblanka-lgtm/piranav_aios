---
name: jackshan-r1-match-audit
description: Product-to-GSC match audit for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — Product GSC Match Audit

**Title:** Product GSC Match Audit  
**Purpose:** Document match counts and unmatched products  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**PASS / FAIL:** PASS

---

## Match Summary

| Metric | Count |
|---|---|
| CSV raw rows | 50 |
| CSV unique products | 50 |
| Valid product URLs (ledsone.co.uk/products/) | 50 |
| Invalid entries | 0 |
| Duplicate entries | 0 |
| Products matched to shopify_listings | 47 |
| Products matched to GSC data | 35 unique pages |
| Products with ≥1 GSC query | 35 |
| Products with no GSC data | 15 |
| Total Product URL × Query rows | 316 |

## Matching Strategy

Primary match: Exact normalized canonical product URL  
- Complete CSV URLs: matched by exact `https://ledsone.co.uk/products/{handle}` in GSC page column  
- Truncated CSV URLs: matched by `page LIKE 'https://ledsone.co.uk/products/{prefix}%'` in GSC  

## Products Not Matched to GSC (15)

These products were allocated in the CSV but had no GSC query data in the date range:

1. `ip68-waterproof-junction-box-case-...` — handle mismatch (CSV uses "case", DB/GSC uses "outdoor")
2. `ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shad...` — no "orange" variant exists
3. `fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with...` — no matching handle in DB
4. `copper-lamp-shade-cap-for-pendant-light-socket-holder-fitting` — no GSC data in period
5. `dc12v-15w-led-driver-power-supply-transformer` — no GSC data in period
6. `dc12v-60w-ip20-mini-universal-regulated-switching-led-transformer` — no GSC data in period
7. `red-wicker-rattan-lampshade-ceiling-pendant-light` — no GSC data in period
8. `b22-t185-60w-dimmable-vintage-light-filament-bulb` — no GSC data in period
9. `3-core-army-green-round-vintage-italian-braided-fabric-cable-flex-0-75mm-uk` — no GSC data in period
10. `retro-vintage-1cm-hole-barrel-cage-design-rattan-style-lamp-light-shades-4219` — no GSC data in period
11. `105mm-bracket-strap-brace-plate-with-accessories-ceiling-rose-light-fixing` — no GSC data in period
12. `fabric-hemp-flex-cable-kit-black-plug-in-pendant-lamp-light-e27-fitting-vintage-lamp` — no GSC data in period
13. `industrial-vintage-various-colours-ceiling-light-fitting-e27-pendant-holder` — no GSC data in period
14. `2pcs-bath-pedestal-rug-set-soft-non-slip-water-absorbent-mat-sets-5393` — no GSC data in period
15. Remaining unmatched product due to truncated prefix ambiguity

No fabricated values used for unmatched products. They are excluded from the table.
