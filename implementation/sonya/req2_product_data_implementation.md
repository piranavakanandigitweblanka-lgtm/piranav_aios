# Sonya Requirement 2 — Implementation Report

**Title:** Product Data Tab Implementation  
**Task:** sonya-requirement-2-product-data-60-days  
**Date:** 2026-07-10  
**Member:** Piranav  
**Team:** Google Ads Team

---

## Architecture Decision

**Pattern:** Static embedded JS arrays (matching existing Req3/Req4 pattern in sonya.html)

No server-side rendering, no API, no credential exposure. All data embedded as JS constants at build time.

**Build tool:** `build_req2.py` Python script (scratchpad)

---

## Data Sources

| Constant | Source | Entries |
|----------|--------|---------|
| `PROD_PERF_MAP` | google_ads.product_performance + campaigns (60d Sonya) | 6,235 |
| `PROD_META_MAP` | listings.shopify_listings (filtered to TREND_ROWS VIDs) | 4,786 |
| `PROD_STOCK_MAP` | inventory.products + physical_product_stock | 7,723 |
| `PROD_DATE_FROM` / `PROD_DATE_TO` | Derived from MAX(date) in product_performance | 2026-05-12 / 2026-07-10 |

**CSV Data:** Reuses `TREND_ROWS` (already embedded, 5,778 rows, Req3 build)

---

## SQL Queries Used

### 60-day Sonya performance
```sql
WITH as_of AS (SELECT MAX(date) AS d FROM google_ads.product_performance),
sonya_camps AS (SELECT campaign_id FROM google_ads.campaigns WHERE campaign_name ILIKE '%sonya%')
SELECT pp.variation_id::text AS vid,
  SUM(pp.impressions)::int AS imp, SUM(pp.clicks)::int AS clk,
  ROUND(SUM(pp.cost),2) AS cost, ROUND(SUM(pp.conversions),4) AS conv,
  ROUND(SUM(pp.conversion_value),2) AS cv
FROM google_ads.product_performance pp
CROSS JOIN as_of
JOIN sonya_camps sc ON sc.campaign_id = pp.campaign_id
WHERE pp.date >= as_of.d - 59 AND pp.date <= as_of.d AND pp.variation_id IS NOT NULL
GROUP BY pp.variation_id ORDER BY cost DESC
```

### Listing metadata
```sql
WITH sonya_vids AS (
  SELECT DISTINCT pp.variation_id::text AS vid FROM google_ads.product_performance pp
  JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
  WHERE c.campaign_name ILIKE '%sonya%' AND pp.variation_id IS NOT NULL
)
SELECT DISTINCT ON (sl.item_id) sl.item_id::text AS vid, sl.sku,
  sl.main_image_url AS img, sl.listing_url AS url,
  COALESCE(sl.price::numeric,0)::numeric(10,2) AS price, sl.title
FROM listings.shopify_listings sl
JOIN sonya_vids sv ON sv.vid = sl.item_id::text
WHERE sl.main_image_url IS NOT NULL AND sl.main_image_url != ''
ORDER BY sl.item_id, sl.price::numeric DESC NULLS LAST
```

### Stock
```sql
SELECT inv.sku, SUM(pps.quantity)::int AS stock
FROM inventory.products inv
JOIN inventory.physical_product_stock pps ON pps.inventory = inv.id
GROUP BY inv.sku
```

---

## Files Changed

| File | Change |
|------|--------|
| `Staff-requirements/pages/sonya.html` | Panel-2 placeholder replaced; PROD_PERF_MAP, PROD_META_MAP, PROD_STOCK_MAP, PROD_DATE_FROM/TO, and all p* JS functions injected before </script> |
| `evidence/sonya/req2_product_data_evidence.md` | Created |
| `validation/sonya/req2_product_data_validation.md` | Created |
| `implementation/sonya/req2_product_data_implementation.md` | Created (this file) |
| `closure/sonya/req2_product_data_closure.md` | Created |

---

## JS Functions Added

- `pGetSegment(imp,clk,cost,conv,cv)` — 8-rule segment classifier
- `pGetStage(seg)` — stage mapping (Trend List / Opportunity List / Monitor)
- `pGetSegClass(seg)` — CSS badge class
- `pRender()` — renders 300 rows/page from pActiveData into #pTbody
- `pUpdateKpis()` — updates 9 KPI cards
- `pApplyFilters()` — filters TREND_ROWS by search/segment/stage/match
- `pExportCSV()` — exports visible data as CSV
- `showTab` override (R2) — initialises tab on first open, chained after R4/R3

---

## File Size

| Before | After |
|--------|-------|
| 729,233 chars / 7,067 lines | 2,702,867 chars / 18,324 lines |

Increase: ~1.97MB (PROD_PERF_MAP + PROD_META_MAP + PROD_STOCK_MAP + JS functions)
