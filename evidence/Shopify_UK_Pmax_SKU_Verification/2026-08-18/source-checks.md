# Source Checks — Shopify UK PMax SKU Verification
**Date:** 2026-08-18  
**Executor:** AIOS (Piranav)  
**Source File:** `Shopify_UK_Pmax_Selected_SKU_Details - New.csv` (Downloads folder)

---

## Data Sources Used

| Source | Purpose | Tool |
|---|---|---|
| `listings.shopify_listings` | Shopify UK listing status & active/draft/unlisted | ledsone-db-mcp |
| `order_management.order_item_info` + `orders` | Actual UK order counts by sub_source | ledsone-db-mcp |
| `order_management.sub_source` | Channel mapping (Amazon/eBay/Shopify sub_sources) | ledsone-db-mcp |
| `order_management.market_place` | Market ID mapping (23 = UK) | ledsone-db-mcp |

---

## Sub_source Channel Mapping (UK)

### Shopify UK Sub_sources
| ID | Name |
|---|---|
| 38 | LEDSONEUK |
| 104 | ledsone |
| 110 | ledsone_shopify |
| 112 | electricalsoneuk |
| 131 | ledsone_shopify |

### Amazon UK Sub_sources (from CSV accounts)
| ID | Name | CSV Account |
|---|---|---|
| 6 | amazon Dcvoltage | amazon Dcvoltage |
| 8 | amazon Ledsone | amazon Ledsone |
| 9 | amazon SRM Amazon | amazon SRM Amazon |

### eBay UK Sub_sources (from CSV accounts)
| ID | Name | CSV Account |
|---|---|---|
| 1 | led_sone | led_sone |
| 2 | re6865 | re6865 |
| 4 | so_926407 | so_926407 |
| 22 | electricalsone | electricalsone |
| 24 | coventrylights | coventrylights |
| 41 | vintageinterior | vintageinterior |

---

## Key SQL Queries Executed

### 1. Shopify UK Listing Status
```sql
SELECT sl.sku, sl.title, sl.status, sl.channel, sl.quantity, sl.created_at::date
FROM listings.shopify_listings sl
WHERE sl.site = 'UK' AND sl.is_child = 1
AND sl.sku IN (...)
ORDER BY sl.sku, sl.status;
```
Result: 200 rows returned (many duplicate entries per SKU across channels)

### 2. Shopify UK Actual Orders (All-time)
```sql
SELECT oii.item_sku,
  COUNT(DISTINCT o.order_id) as shopify_uk_orders,
  SUM(oii.item_quantity::int) as shopify_uk_units,
  MIN(o.order_date::date) as first_order,
  MAX(o.order_date::date) as last_order
FROM order_management.order_item_info oii
JOIN order_management.orders o ON o.id = oii.order_id
WHERE o.market_place = '23'
  AND o.sub_source_id IN (38, 104, 110, 112, 131)
  AND oii.item_sku IN (...)
GROUP BY oii.item_sku ORDER BY shopify_uk_orders DESC;
```
Result: 50 SKUs returned with orders > 0

### 3. Amazon UK Orders
```sql
WHERE o.market_place = '23' AND o.sub_source_id IN (6, 8, 9)
```

### 4. eBay UK Orders
```sql
WHERE o.market_place = '23' AND o.sub_source_id IN (1, 2, 4, 22, 24, 41)
```

---

## Critical Finding: Shopify UK Orders Column Incorrect

The CSV states `Shopify UK Orders = 0` for ALL 137 SKUs.

The DB confirms the following single (non-bundle) SKUs have actual Shopify UK orders:

| SKU | CSV Orders | DB Orders (All-time) | Last Order |
|---|---|---|---|
| WCCYSQGD2PK | 0 | **260** | 2026-08-05 |
| CRSF100BM | 0 | **124** | 2026-08-16 |
| WCCYSQCH2PK | 0 | **113** | 2026-08-07 |
| CRSF100GB | 0 | **100** | 2026-08-11 |
| CRSF100YB | 0 | **82** | 2026-07-09 |
| WCCYSQBM | 0 | **76** | 2026-06-19 |
| CRSF2003BM | 0 | **76** | 2026-08-08 |
| CRFF500BM | 0 | **70** | 2026-03-21 |
| PLTEBM | 0 | **68** | 2026-04-24 |
| PHUH2HETBM | 0 | **50** | 2026-06-28 |
| 12IP20400 | 0 | **42** | 2026-04-24 |
| CRSF100CH | 0 | **38** | 2026-07-28 |
| CRSF100CO | 0 | **30** | 2026-08-11 |
| PLADRR | 0 | **29** | 2026-08-16 |
| CRSF2003CO | 0 | **26** | 2026-08-03 |
| CRSF100SN | 0 | **25** | 2026-08-14 |
| ENC809 | 0 | **25** | 2026-08-09 |
| PLHIRR | 0 | **18** | 2026-01-28 |
| LDMST64B2286PK | 0 | **17** | 2025-11-28 |
| ENC3538 | 0 | **15** | 2026-07-08 |
| CRSF100BC | 0 | **15** | 2026-08-17 |
| CL3RBKAPK | 0 | **14** | 2025-10-31 |
| CKB6820PCBM | 0 | **12** | 2026-06-10 |
| LSHM400HE | 0 | **12** | 2026-08-16 |
| CRFF500CH | 0 | **11** | 2026-07-25 |
| ENC1315 | 0 | **9** | 2025-11-25 |
| PHUH1HETBM2PK | 0 | **8** | 2025-05-18 |
| CRSF100BB | 0 | **8** | 2026-04-21 |
| WCFRBM | 0 | **8** | 2026-06-08 |
| LDMT45E2745PK | 0 | **7** | 2026-02-26 |
| LDSHEAE2743PK | 0 | **7** | 2026-04-25 |
| CL3RBWAPK | 0 | **6** | 2026-05-09 |
| ENC4372 | 0 | **6** | 2026-05-09 |
| LDSG95DIE2743PK | 0 | **6** | 2026-01-08 |
| LSHM300HE | 0 | **6** | 2026-06-20 |
| CRSF2003BC | 0 | **5** | 2026-06-27 |
| CRFF500BC | 0 | **4** | 2025-11-14 |
| CL3RIVAPK | 0 | **4** | 2025-07-15 |
| ENC338 | 0 | **3** | 2026-08-09 |
| LSWE315BU | 0 | **3** | 2025-09-17 |
| ENC285 | 0 | **3** | 2026-02-08 |
| WSDM240BM | 0 | **2** | 2026-06-30 |
| ENC64 | 0 | **2** | 2025-02-10 |
| ENC903 | 0 | **2** | 2025-04-19 |
| TPOS1PRBSQ | 0 | **2** | 2026-08-17 |
| TPHTTN2PBRBM | 0 | **1** | 2026-04-14 |
| LSMCSQWYRE | 0 | **1** | 2024-02-24 |
| LSMCP1ULMC | 0 | **1** | 2023-12-12 |
| LDSG95DIE2745PK | 0 | **1** | 2024-08-20 |
| ENC3291 | 0 | **1** | 2025-08-17 |

**NOTE:** The DB query is all-time. The CSV may reference a specific measurement window. However, SKUs like WCCYSQGD2PK (last order 2026-08-05), ENC809 (last order 2026-08-09), and TPOS1PRBSQ (last order 2026-08-17 = TODAY) are clearly actively selling. The CSV data is stale or uses an undefined scope.

---

## Listing Status Mismatches

### "Not listed on Shopify UK" but IS listed:
| SKU (component/bundle) | Found In Listings | Status | Listed Since | Shopify Orders |
|---|---|---|---|---|
| LDSG95DIE2743PK | LEDSone active | active | 2024-01-28 | 6 |
| CRFF500BC (bundle CRFF500BC+PHWL1PBRBC3PK) | LEDSone, Electricalsone, Vintagelite | active | 2023-09-12 | 4 |
| LDMST64B224APK | Electricalsone | active | 2026-08-17 (TODAY) | 0 (just listed) |
| LSHM300HE (component of row 126 bundle) | LEDSone | active | 2025-03-21 | 6 |
| LSHM400HE (component bundles rows 5,9,21) | LEDSone | active | 2025-03-21 | 12 |
| LDMT45E2745PK | Not found active currently (may have been delisted) | — | — | 7 historic |

### "Listed, not selling" but status is DRAFT (not active):
| SKU | Status | Channel | Notes |
|---|---|---|---|
| ENC285 | draft | LEDSone | Main listing is draft — not publicly available |
| LSMCSQWYBL | draft | LEDSone | Only listing is draft |
| LDMST64B2286PK | draft | BesBet | Listed but draft only |
| LDSG95DIE2745PK | draft | BesBet | Listed but draft only |
| ENC9103 | one active, one draft | LEDSone | Active listing exists |

---

## Measurement Period Note

The CSV provides no date range for Amazon UK Revenue, eBay UK Revenue, or Shopify UK Orders. The figures appear to represent a specific time window (likely 30–90 days or a fixed range). The DB queries above are all-time. Amazon/eBay order count directions are consistent with CSV figures (CSV shows lower counts, consistent with a shorter window). The CSV's Shopify UK Orders = 0 is contradicted by DB for at least 35 single SKUs with recent orders.
