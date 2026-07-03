# Prompt — Shopify Unlisted Products Sales Report

**Category:** discovery
**Pattern name:** `shopify-unlisted-products-sales-report`
**First used:** 2026-07-03
**Task it solved:** UNLISTED-PRODUCTS-SALES-2026-04-01

---

## When to use this prompt
When you need to find out whether any UNLISTED (active but not published) Shopify products have generated sales in a given date range. Useful for auditing configurator component products, draft products, or hidden bundles.

Reusable for: any store where products are intentionally unlisted but may still be sold via direct link, draft orders, or admin.

---

## Full Prompt (as given 2026-07-03)

```
Check whether any of the unlisted products on ledsone.myshopify.com have made any sales from April 1 2026 to today.

These are products that are ACTIVE in Shopify but not published to the Online Store — used as components in the pendant/wall/table light configurator.

Steps:
1. Check piranav_aios repo for any prior unlisted products sales report first.
2. Resolve all unlisted product handles to Shopify product IDs using GraphQL productByHandle (batch in groups of 30).
3. Confirm each product's status is UNLISTED.
4. Query ShopifyQL FROM sales WHERE product_id IN (...) for all IDs — in batches if needed.
5. For any product with sales: retrieve the matching order(s) via GraphQL with full line-item detail (order ID, number, date, qty, unit price, customer country).
6. Check the three assembling-fee products specifically (service-fee-pendant-light-configurator, service-fee-wall-light-configurator, service-fee-table-light-configurator).
7. Save all findings to evidence/shopify_sales/ — include full product table (all 93), summary metrics, and any sales detail.
8. Document limitations (e.g. what UNLISTED means, how they can still be sold).
9. Mark PASS/FAIL.
```

---

## What this prompt produced

| Output | Value |
|---|---|
| Evidence file | `evidence/shopify_sales/unlisted-products-sales-2026-04-01-to-current.md` |
| Products checked | 93 |
| Products with sales | 1 — Copper Threaded Holder (`copper-threaded-holder`) |
| Sale detail | 1 order (#LED54539), 5 units, £27.45, GB customer, 2026-05-31 |
| Assembly fees sold | 0 — no configurator was completed with a fee in the period |
| Status | PASS |

## Reuse notes
- Batch GraphQL `productByHandle` calls in groups of ~30 to avoid timeout
- Batch ShopifyQL `WHERE product_id IN (...)` in groups matching the batch above
- `UNLISTED` = active but not published to Online Store channel — products can still sell via direct link or admin draft order
- Always cross-reference with configurator assembly-fee products as a secondary check
- The one sale found (Copper Threaded Holder) was likely placed via direct link or admin — not through the store front
- Always check repo for prior report before starting (Rule 5)
