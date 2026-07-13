---
name: jackshan-r1-source-product-list-validation
description: Validation of the 50-product source CSV for Jackshan Requirement 1 correction
metadata:
  type: project
---

# Source Product List Validation — Jackshan Requirement 1

**Title:** Source Product List Validation  
**Purpose:** Prove the authoritative 50-product allocation list before querying GSC  
**Requirement Source:** Jackshan Product Allocation CSV  
**Staff Member:** Jackshan  
**Store:** ledsone.co.uk  
**Status:** COMPLETE  
**PASS / FAIL:** PASS (50 unique URLs confirmed)

---

## Source File

| Field | Value |
|-------|-------|
| File path | C:\Users\PC\Downloads\Jackshan Product Allocation - Sheet1.csv |
| Column name | URLs |
| Total rows (incl header) | 51 |
| Non-empty data rows | 50 |
| Duplicate URLs | 0 |
| Malformed URLs | 0 |
| URLs outside ledsone.co.uk | 0 |
| **Final eligible count** | **50** |

## URL Completeness

| Category | Count |
|----------|-------|
| Complete URLs (full handle) | 29 |
| Truncated URLs (end with … ellipsis) | 21 |

## Truncated URL Resolution

All 21 truncated URLs were resolved against `listings.shopify_listings` (channel=LEDSone, site=UK, is_parent=1) using LIKE prefix matching.

| Result | Count |
|--------|-------|
| Resolved to single unique handle | 17 |
| Resolved to multiple candidates (ambiguous) | 2 |
| Unresolvable — handle mismatch | 2 |
| Unresolvable — no matching handle in DB | 2 |

### Ambiguous Multi-Match Resolutions

- `pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-` → 4 variants found (black, green-brass, rose-gold, yellow-brass) → selected **corded-black** (first alphabetically)
- `tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light` → 2 variants found → selected **tiffany-style-...decorative-home** (without numeric suffix)

### Unresolvable URLs (4 total)

| CSV Truncated Prefix | Reason Unresolvable |
|---------------------|---------------------|
| ip68-waterproof-junction-box-case-for-electrical-cable-wire-connecto… | CSV says "case" but DB handle is "outdoor" — different products |
| ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shad… | No orange variant exists in DB (black/cyan/green/light-blue/white/yellow only) |
| ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-variation-lam… | CSV suffix "variation-lam" diverges from DB "lamp-holder" after "heat-bulb-" |
| fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with… | No matching handle in database |

These 4 products appear in the final report with keyword="No GSC data" and action="Data validation required".

## Final Count: 50 unique product rows confirmed
