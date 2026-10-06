# GA-09 — Sold-Out Product Pages Still Receiving Google Traffic

**Code:** GA-09  
**Owner:** Piranav  
**Approver:** Muguntha  
**Deadline:** 6 October 2026, 18:00 SL  
**Status:** IN PROGRESS — redirects validated, CSV prepared, awaiting Piranav manual Shopify import  

---

## Objective

11 product pages on ledsone.co.uk are sold out but still receiving Google traffic.  
Estimated revenue at risk: **£165.19/week**  
Protect that traffic by redirecting each sold-out URL to the closest relevant in-stock product.

---

## Source URLs

1. `/products/12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights`
2. `/products/zip-ties-releasable-heavy-duty-reusable-cable-ties-wraps`
3. `/products/multi-shade-2m-pendant-light`
4. `/products/g4-cob-chip-2w-220v-240v-led-light-replace-halogen-bulb-5035`
5. `/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade`
6. `/products/led-decorative-outdoor-wall-light-up-down-lights`
7. `/products/3w-e27-light-bulb-energy-saving-lamp-warm-white-globe`
8. `/products/12v-ir-remote-controller`
9. `/products/green-retro-metal-pendant-lampshade-ceiling-light-shade-easy-fit`
10. `/products/turkish-moroccan-style-table-lamp-mosaic-glass-bedside-desk-table-lamp`
11. `/products/240v-to-12v-power-supply-universal-adapter`

---

## Data Sources Used

- Shopify Admin API — ledsone.myshopify.com (read-only, authoritative stock data)
- Live page fetch — all 11 URLs verified on 2026-10-06
- Business database — checked (product table only, no catalogue data available)
- SEMrush — unavailable (no API units)
- GSC — not queried (no access from AIOS); Google traffic priority marked "Needs GSC check"

---

## Output Files

| File | Description |
|---|---|
| `GA-09_Decision_Table.md` | Full 11-product decision table |
| `GA-09_Shopify_URL_Redirects.csv` | Shopify bulk import CSV (9 confirmed redirects) |
| `GA-09_Manual_Review.md` | 2 products not safe to redirect — reasons and options |
| `evidence/01_source_verification/` | Live page check results |
| `evidence/02_replacement_validation/` | Shopify API stock verification |
| `evidence/03_restock_check/` | Restock investigation |
| `evidence/04_final_validation/` | Final redirect validation |

---

## Implementation Status

**CSV prepared — awaiting Piranav's manual Shopify import and post-import verification.**

9 redirects in CSV. 2 products excluded (Manual Review / No Safe Redirect).

**NO SHOPIFY CHANGES MADE — CSV prepared for Piranav's manual import.**

---

## Completion Criteria

- [ ] Piranav imports CSV into Shopify (Navigation → URL Redirects → Import)
- [ ] All 9 redirects verified live (old URL → new URL, HTTP 301)
- [ ] Before/after screenshots captured
- [ ] GA-09 marked COMPLETED in Task Register
- [ ] 14-day check scheduled (2026-10-20)
