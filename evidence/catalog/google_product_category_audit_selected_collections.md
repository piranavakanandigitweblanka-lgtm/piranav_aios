# Evidence — Google Product Category Audit (Selected Collections)

**Audit ID:** GPC-AUDIT-EASY-FIT-SHADES-2026-06-30
**Date:** 2026-06-30
**Store:** LEDSone UK Ltd (ledsone.co.uk)
**Collection audited:** `easy-fit-shades` (provided by Piranav)
**Method:** Shopify Admin GraphQL API — read-only query, no data modified
**Report location:** `docs/shopify/catalog/google_product_category_audit_selected_collections.md`

---

## Pass / Fail Verdict

**PASS**

### Criteria check

| Criterion | Result |
|---|---|
| Covers only provided collection data | PASS — only `easy-fit-shades` queried |
| No full-store audit performed | PASS — single collection fetched by handle |
| No Shopify data changed | PASS — read-only GraphQL query used |
| Clearly marks Assigned / Missing / Needs Verification | PASS — all 125 products marked with status |
| No category IDs guessed | PASS — "Not Set" recorded where metafield is null |
| No duplicate report created | PASS — checked existing assets; no prior GPC audit found |

---

## Data Source

**GraphQL query used:**

```graphql
query EasyFitShadesAudit($handle: String!, $after: String) {
  collectionByHandle(handle: $handle) {
    id
    title
    handle
    products(first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          handle
          productType
          category {
            id
            name
            fullName
          }
          variants(first: 1) {
            edges {
              node { sku }
            }
          }
          metafield(namespace: "google", key: "google_product_category") {
            value
            type
          }
        }
      }
    }
  }
}
```

**Variables:** `{ "handle": "easy-fit-shades" }`
**Pages fetched:** 3 (pagination with endCursor)
**Validation:** Passed `validate_graphql_codeblocks` before execution

---

## Key Findings

### Finding 1 — Google Product Category: 0 / 125 set (Critical)
The `google.google_product_category` metafield returns `null` on every product in this collection.
No Google Product Category is assigned to any product.
This will cause the entire collection to fail Google Merchant Center feed submission.

### Finding 2 — Shopify Category mismatches (18 products)
18 products carry a Shopify taxonomy category that is inconsistent with "Lamp Shades":

| Issue | Count | Example product IDs |
|---|---|---|
| `Home & Garden > Decor` | 1 | 7691129651450 |
| `Home & Garden > Lighting` (too broad) | 1 | 7691129749754 |
| `Home & Garden > Lighting > Lamps` | 1 | 8090725712122 |
| `Home & Garden > Lighting > Lighting Fixtures` | 6 | 8021898854650, 7455207784698, 7455207653626, 7452903604474, 7452903145722, 7452902588666 |
| `Home & Garden > Lighting > Lighting Fixtures > Ceiling Light Fixtures` | 3 | 15297567916418, 8173292093690, (additional from page 1) |
| Null (no category) | 2 | 14934485369218, 14919938539906 |
| Uncategorized | 1 | 7702867443962 |

### Finding 3 — Possible duplicate SKUs (3 pairs)
- SKU `LSRP260SN+RPR44WH`: products 4572385869920 (~2321) and 4572385771616 (~2323)
- SKU `WCB6BB+RPR44WH`: products 4536806408288 (~2432) and 4536806375520 (~2433)
- SKU `WCVCBM+RPR44WH`: products 4417293221984 (~2850) and 4417288470624 (~2911)

These are out-of-scope for this audit but noted for catalog hygiene.

---

## Scope Boundary

This audit strictly covers products returned by the `easy-fit-shades` collection query.
No other collections were fetched. No product data was written or updated.
Category IDs are taken verbatim from the Shopify API — none were inferred or guessed.
