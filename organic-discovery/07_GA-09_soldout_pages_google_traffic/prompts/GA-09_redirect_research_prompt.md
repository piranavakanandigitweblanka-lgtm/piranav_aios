# GA-09 — Redirect Research Prompt

**Registered:** 2026-10-06  
**Purpose:** Find the closest in-stock replacement for each sold-out product on ledsone.co.uk and prepare a Shopify bulk redirect CSV.  
**Reusable:** Yes — for any future sold-out redirect research task on Shopify stores.

---

## Prompt

You are preparing a Shopify URL redirect CSV for a LEDSone store.

A list of sold-out product URLs has been provided. For each:

1. Verify the sold-out product is live but out of stock (HTTP 200, sold-out button).
2. Use the Shopify Admin API (read-only) to find the closest in-stock replacement product.
3. Validate the replacement: same category, same customer intent, genuinely in stock (totalInventory > 0 via API).
4. Record confidence: HIGH / MEDIUM / LOW / NO SAFE REDIRECT.
5. Only include HIGH and MEDIUM confidence replacements in the CSV.
6. For LOW / NO SAFE REDIRECT products, create a manual review file with options.
7. Output the CSV in Shopify bulk format: `Redirect from,Redirect to` (relative paths only).
8. Do not make any Shopify changes — output CSV only.

**Data sources (in priority order):**
1. Shopify Admin API GraphQL — `productByHandle` and `products(query: ...)` — authoritative stock data
2. Live site WebFetch — verify sold-out status and page titles
3. Business database — if product catalogue data is available

**Key validation questions per redirect:**
- Is the destination genuinely relevant (same purpose, same customer intent)?
- Is the destination currently in stock (API-confirmed)?
- Is the destination not another sold-out product?
- Would a customer from Google reasonably expect this destination?
- Is the price range comparable?

**Files to produce:**
- `GA-09_Decision_Table.md` — full reasoning per product
- `GA-09_Shopify_URL_Redirects.csv` — Shopify import format
- `GA-09_Manual_Review.md` — excluded products with options
- Evidence files in `evidence/01_source_verification/`, `02_replacement_validation/`, `03_restock_check/`, `04_final_validation/`

**Important constraints:**
- Do NOT redirect to generic unrelated collections
- Do NOT redirect to another sold-out product
- Do NOT redirect products with URL/title mismatches without investigating the intent first
- Do NOT make Shopify changes — CSV only
