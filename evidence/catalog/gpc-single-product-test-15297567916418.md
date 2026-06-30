# Evidence — Google Product Category Single Product Test

**Evidence ID:** GPC-TEST-001
**Date:** 2026-06-30
**Store:** LEDSone UK Ltd (ledsone.co.uk)
**Scope:** One product only — ID 15297567916418

---

## Pass / Fail Verdict

**PASS**

| Criterion | Result |
|---|---|
| Only one product updated | PASS |
| Correct product ID targeted | PASS — 15297567916418 |
| No other product touched | PASS — mutation scoped to single product GID |
| No title / SKU / variant / collection / pricing change | PASS — only metafield written |
| userErrors returned | PASS — empty array (no errors) |
| Post-update verification read confirms value | PASS |

---

## Before State (read before mutation)

| Field | Value |
|---|---|
| Product ID | 15297567916418 |
| Product GID | gid://shopify/Product/15297567916418 |
| Title | Industrial Cage Ceiling Light with Clear Glass Shade E27 ~6722 |
| Shopify Category | Home & Garden > Lighting > Lighting Fixtures > Ceiling Light Fixtures (hg-13-9-2) |
| Google Product Category metafield | **null** (not set) |

## After State (verification read post-mutation)

| Field | Value |
|---|---|
| Product ID | 15297567916418 |
| Product GID | gid://shopify/Product/15297567916418 |
| Title | Industrial Cage Ceiling Light with Clear Glass Shade E27 ~6722 (unchanged) |
| Shopify Category | Home & Garden > Lighting > Lighting Fixtures > Ceiling Light Fixtures (unchanged) |
| Google Product Category | **Home & Garden > Lighting Accessories > Lamp Shades** |
| Metafield ID | gid://shopify/Metafield/190324987724162 |
| Metafield Type | single_line_text_field |

---

## Metafield Format Confirmed

No metafield definition existed in the store for `google.google_product_category`.
Format used: `single_line_text_field` with full text taxonomy path.
API accepted this format without error — confirmed valid for future bulk updates.

---

## Mutation Used

```graphql
mutation SetGoogleProductCategory($id: ID!, $metafields: [MetafieldInput!]!) {
  productUpdate(product: { id: $id, metafields: $metafields }) {
    product {
      id
      title
      metafield(namespace: "google", key: "google_product_category") {
        id
        value
        type
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "id": "gid://shopify/Product/15297567916418",
  "metafields": [{
    "namespace": "google",
    "key": "google_product_category",
    "value": "Home & Garden > Lighting Accessories > Lamp Shades",
    "type": "single_line_text_field"
  }]
}
```

**API response — userErrors:** `[]` (none)
