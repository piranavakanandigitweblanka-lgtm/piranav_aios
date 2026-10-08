# Capability — Theekshy Requirement 3 — Feed Optimisation

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Date:** 2026-07-15

---

## Capability Demonstrated

### Google Ads / GMC Feed Analysis

- Three-table join: `product_performance` + `shopify_listings` + `merchant_products` for variant-level feed health
- GMC deduplication via ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY CASE WHEN country='GB' THEN 0 ELSE 1 END)
- Price mismatch detection (GBP only, ROUND-safe comparison)
- Availability mismatch detection (Shopify stock vs GMC availability field)
- Currency mismatch identification (EUR records in UK PMax campaigns)
- Missing GMC record detection for actively-spending products
- Out-of-stock + active spend identification
- Transparent handling of empty eligibility data (asset_group_listing_group_filters)

### Dashboard Engineering

- 11-level condition precedence engine in vanilla JS
- Lazy Chart.js initialisation with `r3ChartsBuilt` flag
- Multi-filter system (Campaign, Condition, Status, Availability, Search)
- Real-time KPI updates on filter change
- Status badge system: Critical / Paused / Monitor / Healthy / Incomplete Verification
- Empty state rendering for dependency-missing sections

### Data Integrity

- Excel date serial conversion (46211 = 2026-07-08)
- CSV sample rows excluded from live data
- Limitation banners for all 4 known data gaps — no false confidence
- SELECT-only database access

### Reusable Patterns

| Pattern | Reuse Context |
|---|---|
| GMC dedup with country preference | Any UK/DE/FR multi-feed analysis |
| Condition precedence engine (array-based) | Any feed health or product status dashboard |
| Lazy Chart.js tab init | Any multi-tab Chart.js dashboard |
| Availability mismatch detection | Any Shopify + GMC reconciliation |
| Limitation banner template | Any dashboard with known data gaps |
| Filter + search + reset (R3 namespace) | Any filterable product table |
