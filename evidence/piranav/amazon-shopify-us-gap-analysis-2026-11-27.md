# Evidence: Amazon vs Shopify US Gap Analysis

**Date:** 2026-11-27  
**Session:** AIOS-2026-11-27-001  
**Status:** PASS  

---

## What Was Done

Full cross-platform gap analysis comparing Amazon USA (and North America neighbour markets) active listings against Shopify USA (sub_source 245) to identify products missing from Shopify.

---

## Step-by-Step Findings

### 1. Amazon USA Marketplace Confirmed
- Marketplace ID: `ATVPDKIKX0DER`
- 5 seller accounts (amz_token_id: 5, 6, 7, 9, 10)
- North America Unified Account: US + Canada + Mexico (+ Brazil on token 9)

### 2. Shopify USA Detail (sub_source: 245)
| Metric | Value |
|---|---|
| Total listings | 1,655 |
| Active | 1,100 |
| Draft | 555 |
| Total stock | 98,355 units |
| Active price range | $3.89 – $122.40 |
| Active avg price | ~$42.16 USD |

### 3. Amazon USA Detail
| Metric | Value |
|---|---|
| Active SKUs (merchant) | 1,845 |
| Discoverable SKUs | 1,735 |
| Buyable SKUs | 326 |
| Total shipped orders | 41,538 |
| Revenue (shipped) | $898,033.89 USD |
| Avg seller feedback | 1.67 / 5 ⚠️ |
| Returns | 17,266 (~42% of shipped) |

### 4. Gap Count (Amazon US vs Shopify US)
| Metric | Count |
|---|---|
| Amazon US active SKUs | 2,844 |
| Already on Shopify US | 481 |
| **Gap (Amazon only)** | **2,363** |

### 5. Neighbour Market Gap
| Market | Amazon Active SKUs | On Shopify US | Gap |
|---|---|---|---|
| Canada | 1,144 | 34 | 1,110 |
| Mexico | 89 | 3 | 86 |

Unique to neighbour (not on Amazon US either):
- Canada: **984 SKUs**
- Mexico: **71 SKUs**

### 6. Total Gap: 3,438 SKUs

### 7. Gap by Product Type
| Product Type | Gap SKUs | Avg Price | Total Stock |
|---|---|---|---|
| LIGHT_FIXTURE | 1,502 | $99.04 | 66,135 |
| LAMPSHADE | 1,073 | $51.39 | 51,320 |
| ELECTRONIC_WIRE | 282 | $35.03 | 8,202 |
| LIGHT_BULB | 238 | $52.12 | 11,899 |
| LIGHT_BULB_SOCKET | 145 | $38.12 | 4,358 |
| MOUNT_BRACKET | 84 | $49.78 | 2,893 |
| TRANSFORMER | 75 | $51.79 | 1,442 |
| POWER_SUPPLY | 17 | $66.87 | 229 |
| HOME_LIGHTING_ACCESSORY | 11 | $54.03 | 280 |
| Others | 11 | — | 282 |
| **TOTAL** | **3,438** | — | **146,783** |

---

## Output Files

| File | Description |
|---|---|
| `reports/amazon-shopify-us-gap-full-export-2026-11-27.csv` | Full 3,438-row gap export — sku, title, price, product_type, amazon_markets, status, total_stock |

---

## SQL Queries Used

```sql
-- Core gap query
SELECT COUNT(DISTINCT amz.sku) FROM listings.amazon_listings amz
WHERE amz.site = 'US'
  AND amz.status IN ('Active','Buyable','Discoverable')
  AND amz.sku IS NOT NULL AND amz.sku != ''
  AND NOT EXISTS (
    SELECT 1 FROM listings.shopify_listings sh
    WHERE sh.sub_source = 245 AND sh.sku = amz.sku
  );
-- Result: 2,363
```

---

## Queryability

YES — all findings reproducible from ledsone DB via ledsone-db-mcp. Full export saved as CSV in `reports/`.
