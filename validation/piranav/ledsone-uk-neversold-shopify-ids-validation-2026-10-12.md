# Validation: ledsone-uk Never-Sold Shopify Parent IDs — 2026-10-12

**Date:** 2026-10-12  
**Validator:** Piranav  
**Output File:** `reports/daily/ledsone-uk-neversold-shopify-ids-2026-10-12.csv`

---

## Checks

| Check | Result | Detail |
|---|---|---|
| Row count | PASS | 81 products in input → 81 rows in output (header excluded) |
| Site filter correct | PASS | Used `listing_url LIKE '%ledsone.co.uk%'` — confirmed ledsone.co.uk URLs in output |
| Parent ID vs variant ID | PASS | Verified via `shopify_listings_parent_child_mapping` join — product URL format `/products/[handle]/[product_id]` confirmed |
| Spot check row 1 | PASS | PCTE1510WH → `15381730853250` → `https://ledsone.co.uk/products/electrical-cable-trunking-end-cap/15381730853250` ✓ |
| Spot check row 13 | PASS | SWPC1GWHBR → `15269012668802` → `https://ledsone.co.uk/products/swich/15269012668802` ✓ |
| Active status filter | PASS | `status = 'active'` applied — archived/draft excluded |
| Missing products flagged | PASS | Row 50 (no active listing) and Row 70 (no SKU) both flagged in `notes` column |
| CSV format | PASS | Comma-separated, UTF-8 BOM, opens correctly in Excel |
| Committed to git | PASS | Commit `1c490c2` on `piranavakanandigitweblanka-lgtm/piranav_aios` main |

---

## Exceptions

| Row | SKU | Reason |
|---|---|---|
| 50 | LSGL3L150AR+RPM40WH_HIT | No active listing found in DB for ledsone.co.uk |
| 70 | (none) | Vintage G125 4W E27 — no SKU in source CSV, cannot look up |

---

## Result: PASS (79/81 products matched)
