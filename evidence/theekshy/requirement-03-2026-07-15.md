# Evidence — Theekshy Requirement 3 — Feed Optimisation

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Date:** 2026-07-15

---

## Source Tables Confirmed

| Table | Schema | Result |
|---|---|---|
| `product_performance` | `google_ads` | Both campaigns confirmed (THEE_GEMS, THEE_MYSTERY) |
| `shopify_listings` | `listings` | UK/LEDSone variant rows confirmed |
| `merchant_products` | `google_ads` | GB-preferred records via ROW_NUMBER dedup |
| `asset_group_listing_group_filters` | `google_ads` | 0 rows for Theekshy campaigns — documented gap |

## Summary Stats (Full Feed · 2026-06-15 – 2026-07-15)

| Metric | Value |
|---|---|
| Total Products | 1,402 |
| Out of Stock (stock=0 OR GMC OOS) | 111 |
| Price Mismatches (GBP only) | 47 |
| Availability Mismatches | 10 |
| Latest Data Date | 2026-07-15 |

## Price Mismatches (Top 40, GBP)

| Product Item ID | Shopify | GMC | Diff |
|---|---|---|---|
| 55794513674626 | £19.34 | £27.91 | +£8.57 |
| 55102388437378 | £20.60 | £22.89 | +£2.29 |
| 54855778075010 | £19.10 | £23.19 | +£4.09 |
| 55112543961474 | £28.94 | £34.17 | +£5.23 |
| 41949494018298 | £18.43 | £24.95 | +£6.52 |

## Availability Mismatches (Top 40)

| Product Item ID | Shopify Stock | GMC Availability | Issue |
|---|---|---|---|
| 55219110707586 | 51 | out of stock | GMC stale |
| 55219110674818 | 256 | out of stock | GMC stale |
| 15141041439106 | 0 | in stock | GMC stale |
| 15145639412098 | 0 | in stock | GMC stale |

## Currency Mismatches (EUR in UK Campaign)

| Product Item ID | GMC Currency |
|---|---|
| 44853051982074 | EUR |
| 55121138155906 | EUR |
| 56724614742402 | EUR |
| 55262186242434 | EUR |

## Missing GMC Records (Spending With No GMC Coverage)

| Product Item ID | 30d Spend |
|---|---|
| 55054387478914 | £98.34 |
| 14934484713858 | £71.34 |
| 55054387511682 | £68.22 |

## Out of Stock + Active Spending

| Product Item ID | Stock | GMC | 30d Spend |
|---|---|---|---|
| 55116252905858 | 0 | out of stock | £94.66 |

## Dependency Checks

- **Req 1 action log:** 0 optimisation events → empty state shown (correct)
- **Date serial 46211:** Excel serial = 2026-07-08 — not displayed raw
- **CSV sample rows:** SKU-001/004/006 absent from R3_DATA — confirmed examples only
