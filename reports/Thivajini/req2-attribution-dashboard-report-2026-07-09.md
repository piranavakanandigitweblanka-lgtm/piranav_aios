# Thivajini Req 2 — Attribution Dashboard Report
## Weekly Google Ads vs Shopify UTM Cross-Check · LEDSone FR
### 2026-07-09

**Status:** LOCAL BUILD COMPLETE — awaiting GPT approval  
**PASS/FAIL:** PASS (data integrity) — deployment blocked until GPT approves

---

## Executive Summary

The Weekly Google Ads vs Shopify UTM Attribution Cross-Check dashboard has been built for Thivajini (LEDSone FR). 14 weeks of data (2026-04-06 to 2026-07-08) have been collected from two confirmed sources: Google Ads campaign-level conversion data from PostgreSQL and Shopify UTM-attributed order revenue from the Shopify Admin API.

**Key finding:** Of 28 campaign-week rows with data, 4 PASS (0.95x–1.05x ratio), 7 require REVIEW, and 12 show FAIL divergence. The wide divergences are largely explained by structural differences in how Google Ads and Shopify attribute conversions (conversion windows, multi-touch, micro-conversions).

---

## Results Summary

| Metric | Value |
|--------|-------|
| Weeks analysed | 14 (2026-04-06 → 2026-07-08) |
| Campaigns tracked | 3 (Topsell, All Products, Best Sellers) |
| Shopify google_ads attributed orders | 66 |
| Shopify UTM revenue (total) | €5,059 |
| PASS rows | 4 |
| REVIEW rows | 7 |
| FAIL rows | 12 |
| Incomplete data rows | 5 |

## Structural Notes

1. **Conversion window mismatch:** Google Ads uses a 30-day click conversion window. A Shopify order on week N may be credited to week N-1 or earlier in Google Ads.

2. **All Products mapping unconfirmed:** Campaign `23533025729` ("Pmax FR | Thivajini | Klarna | Imp_Click | MCV") is inferred to map to `pmax_allproduct` UTM. No direct join table confirms this.

3. **Thresholds not approved:** PASS 0.95x–1.05x / REVIEW 0.80x–1.20x / FAIL outside that range — proposed only. Thivajini must approve before operational use.

4. **Closest PASS weeks:** 2026-04-27 Topsell (0.97x), 2026-05-11 All Products (0.97x), 2026-04-06 All Products (1.05x) — 3 clean weeks suggest methodology is viable.

---

## Recommended Next Actions

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | GPT reviews dashboard and approves / rejects | GPT |
| P1 | Thivajini confirms attribution ratio thresholds | Thivajini |
| P1 | Confirm All Products ↔ pmax_allproduct mapping via tech team | Tech |
| P2 | Deploy to Vercel if GPT approves | Claude / Piranav |
| P3 | Extend to product-level KPI dashboard (Req 2 product view) | Next session |

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** LOCAL BUILD — DO NOT DEPLOY WITHOUT GPT APPROVAL
