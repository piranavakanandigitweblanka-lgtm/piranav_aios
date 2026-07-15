# Evidence — Theekshy Requirement 3 — Feed Optimisation Verification

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Verification Date:** 2026-07-15
**Verifier:** AIOS Execution Worker

---

## Campaign Scope Verification

| Campaign ID | Campaign Name (exact, from DB) | Status |
|---|---|---|
| 23714290257 | `Pmax UK \| Theekshy \| Shoptimised \| THEE_GEMS \| ORDERS>1 \| MCV \| UK` | VERIFIED ✅ |
| 23684837882 | `Pmax \| Theekshy \| Shoptimised \| THEE_MYSTERY\| Non-Converting \| MCV \| UK` | VERIFIED ✅ |

Query used: `SELECT campaign_id, campaign_name FROM google_ads.campaigns WHERE campaign_name ILIKE '%theekshy%'`
No unrelated campaigns included.

---

## Source Tables and Grains

| Table | Schema | Row Grain | Date Field | Latest Date | Join Key |
|---|---|---|---|---|---|
| `product_performance` | `google_ads` | product_item_id × campaign_id × date | `date` | 2026-07-15 | `product_item_id` |
| `shopify_listings` | `listings` | item_id × variant (site=UK, channel=LEDSone) | `updated_at` | 2026-07-15 | `item_id = product_item_id` |
| `merchant_products` | `google_ads` | product_id × feed record | `updated_at` (not available) | N/A | `product_id = product_item_id` |

---

## Latest Data Dates

| Source | Latest Date | Method |
|---|---|---|
| google_ads.product_performance | 2026-07-15 | MAX(date) WHERE campaign_id IN (...) AND date >= '2026-06-15' |
| listings.shopify_listings | 2026-07-15 (00:31 UTC) | MAX(updated_at) WHERE site='UK' AND channel='LEDSone' |
| google_ads.merchant_products | Not available | updated_at column does not exist in this table |

---

## Summary Stats (Full Feed)

Verified via SQL query (product_performance + LEFT JOIN shopify_listings + LEFT JOIN merchant_products):

| Metric | Dashboard Value (Initial) | Actual DB Value | Correct? |
|---|---|---|---|
| Total Products | 1,402 | 1,402 | ✅ PASS |
| Out of Stock (stock=0 OR GMC OOS) | 111 | **132** | ❌ FAIL — FIXED |
| Price Mismatches (GBP only) | 47 | **229** | ❌ FAIL — FIXED |
| Availability Mismatches | 10 | **107** | ❌ FAIL — FIXED |

Fixed: `totalSummary=[1402,132,229,107]` in `renderR3Kpis()`.

---

## R3_DATA Verification — Initial Build Defects

### Defect Type 1: Fabricated product identifiers
Many product IDs in the original R3_DATA (e.g., 55189234401282, 55189234368514, 54988891488578, 41862263193754, 55296943251522, etc.) **do not appear in the real Top 40 by spend** for the Theekshy campaigns. These were invented.

### Defect Type 2: Fabricated spend values
Original R3_DATA had costs inflated by 10–15x:
| Product ID | Fabricated Cost | Real Cost |
|---|---|---|
| 55794513674626 | £182.34 | £11.07 |
| 44853051982074 | £164.12 | £5.82 |
| 55116252905858 | £94.66 | £12.04 |
| 55219110707586 | £112.88 | £6.73 |

### Defect Type 3: Wrong product titles
Original R3_DATA used fabricated LED lighting product titles (LED Strip Lights, Floodlights, Panels, etc.). Real products in these campaigns are **vintage pendant lights, ceiling fittings, fabric cable, decking tiles** — not LED components.

### Defect Type 4: Wrong GMC currencies
Original R3_DATA incorrectly labelled these products as EUR:
| Product ID | Claimed Currency | Actual GMC Currency |
|---|---|---|
| 44853051982074 | EUR | GBP (£30.90) |
| 55121138155906 | EUR | GBP (£11.33) |
| 56724614742402 | EUR | GBP (£48.79) |
| 55262186242434 | EUR | GBP (£47.59) |

Only product 54855777878402 has a EUR/ES GMC record (no GB record exists for this product).

### Defect Type 5: Wrong GMC availability values
Original R3_DATA claimed:
- 55219110707586: `gmc_avail='out of stock'` → WRONG (actual: `in stock`, GMC price £23.19)
- 55219110674818: `gmc_avail='out of stock'` → WRONG (actual: `in stock`, price match ✅)

### Defect Type 6: Wrong conditions triggered
Because of the wrong data:
- 55219110707586 was shown as "Availability Mismatch" → should be "Price Mismatch" (stock=51, GMC in stock, price £22.30 vs £23.19)
- 55219110674818 was shown as "Availability Mismatch" → should be "Incomplete Verification" (stock=256, GMC in stock, price match ✅)

---

## R3_DATA After Fix — Key Verified Products

| Rank | Product Item ID | Campaign | Real Cost | Real Condition | Verified From |
|---|---|---|---|---|---|
| 1 | 14958817739138 | THEE_GEMS | £18.39 | Incomplete Verification | PP: cost=18.39; SL: no price; MP: in stock £10.89 GBP |
| 2 | 55116252905858 | THEE_GEMS | £12.04 | Out of Stock | SL: stock=0, price=£6.85; MP: out of stock £6.85 |
| 3 | 55794513674626 | THEE_GEMS | £11.07 | Price Mismatch | SL: price=£19.34; MP: in stock £20.05 GBP |
| 4 | 54855778009474 | THEE_GEMS | £10.87 | Price Mismatch | SL: price=£19.10; MP: in stock £23.19 GBP |
| 5 | 55054387478914 | THEE_GEMS | £8.25 | Missing GMC Record | MP: no record found |
| 6 | 54855777878402 | THEE_GEMS | £8.14 | Currency Mismatch | MP: EUR/ES record only — no GB/GBP record |
| 10 | 14934484713858 | THEE_GEMS | £7.14 | Missing GMC Record | MP: no record found; SL: no price/stock |
| 17 | 55054387511682 | THEE_GEMS | £5.54 | Missing GMC Record | MP: no record found |
| 31 | 15145639412098 | THEE_GEMS | £3.71 | Availability Mismatch | SL: stock=0; MP: in stock |
| 39 | 15141041439106 | THEE_GEMS | £3.22 | Availability Mismatch | SL: stock=0; MP: in stock |

---

## Join Validation

| Join | Method | Verified |
|---|---|---|
| product_performance → shopify_listings | `item_id = product_item_id` (site=UK, channel=LEDSone) | ✅ |
| product_performance → merchant_products | `product_id = product_item_id` (GB preferred via DISTINCT ON + CASE WHEN country='GB') | ✅ |

### Duplicate Risk
`merchant_products`: Multiple records per product_id (different country/feed). Handled via `DISTINCT ON (product_id) ORDER BY CASE WHEN country='GB' THEN 0 ELSE 1 END`. Verified: product 54855777878402 has only EUR/ES record (no GB) — correctly flagged as Currency Mismatch.

### Unmatched Records (Top 40)
- No Shopify price/stock: 14958817739138, 7592071168250, 14934484713858, 5450415538337, 4528320741472, 8009169993978, 6024708358305, 14953877307778, 14958021968258, 14959226257794 (parent-level products — no variant rows with price/quantity)
- No GMC record: 55054387478914, 14934484713858, 55054387511682

---

## Requirement 1 Dependency

Query: `SELECT COUNT(*) FROM [action log tables] WHERE staff='theekshy'` → 0 results
Empty state correctly shown. No optimisation dates invented. Feed Review Date = Date Last Optimised + 7 days — architecture ready, not triggered.

---

## Price Comparison Verification

Formula: `Math.round(gmc_price * 100) === Math.round(shopify_price * 100) AND gmc_currency === 'GBP'`
Test cases verified:
- £5.25 vs £5.25 GBP → Yes ✅
- £19.34 vs £20.05 GBP → No (Price Mismatch) ✅
- £47.60 vs £47.59 GBP → No (Price Mismatch — £0.01 diff) ✅
- EUR record → Currency Mismatch ✅
- null price → Unable to Verify ✅

---

## No-Write Confirmation

- No INSERT/UPDATE/DELETE/ALTER/DROP/TRUNCATE executed
- No Shopify modifications
- No GMC modifications
- No Google Ads modifications
- No git commit or push
- No Vercel deployment

---

## Regression Check

- Panel 1 (Req 1): Read confirmed — untouched
- Panel 2 (Req 2): Read confirmed — all r2* functions untouched
- Tab navigation: r3ChartsBuilt flag additive only
