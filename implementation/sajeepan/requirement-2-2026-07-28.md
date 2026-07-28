# Sajeepan — Requirement 2 Implementation
**Title:** Stop Waste & Intelligence Dashboard
**Date:** 2026-07-28 | **Status:** PASS (supported features)
**Member:** Sajeepan | **Team:** Google Ads | **Requirement:** 2

---

## Files Changed

| File | Change |
|---|---|
| `Staff-requirements-02/api/sajeepan/dashboard.js` | +163 lines — `handleReq2()` + `?type=req2` routing |
| `Staff-requirements-02/pages/sajeepan.html` | +378 lines — Req2 tab, panel, 6 sections, lazy load |
| `Staff-requirements-02/index.html` | Badge updated: "2 Reports Live" |

---

## API Extension (`api/sajeepan/dashboard.js`)

Extended existing `?type=` routing. Added `else if (type === 'req2')` branch calling `handleReq2(client, toDate, fromDate, prevFrom, prevTo)`.

Returns:
```json
{
  "ok": true,
  "meta": { "from": "...", "to": "...", "latest_date": "..." },
  "wasteful_products": [...],
  "budget_waste": [...],
  "neg_kw_candidates": [...],
  "product_classification": [...],
  "cross_platform": [...],
  "seasonal_winners": [...],
  "dropoff_products": [...],
  "morning_actions": [...],
  "unsupported": { ... }
}
```

Data sources per section:
- **Wasteful Products**: `google_ads.product_performance` — cost>£10, clicks>2, conv<0.01 (CVR=conv/clicks)
- **Neg KW Candidates**: `google_ads.pmax_campaign_search_term_data` — cost>£5, clicks>5, conv<0.01
- **Budget Waste**: `google_ads.campaign_performance` L30 vs prev30 ROAS/cost delta
- **Cross-Platform**: `order_management.orders + order_item_info` joined to `listings.shopify_listings`
- **30/60/90 Context**: `google_ads.campaign_performance` rolling windows

---

## HTML Extension (`pages/sajeepan.html`)

- Tab switcher: Req 1 (existing) | Req 2 — Stop Waste & Intel
- Req2 panel: 6 sections with loading/error/empty states
- Lazy load: fetch only on first Req2 tab click
- All existing Req1 panels untouched

---

## Business Rules

### Implemented
- Wasteful Products: cost>£10, clicks>2, CVR<0.01% (=conv/clicks<0.0001)
- Budget Waste: L30 cost↑ AND ROAS↓ vs prev30
- Neg KW Candidates: search_term cost>£5, clicks>5, CVR<0.0001
- Product Classification: No One See U / Low Engagement / Need Optimize / Check & Update / Orange / Green
- Cross-Platform: orders per SKU across Amazon/eBay/Shopify
- Stock Safety: `inventory.physical_product_stock`
- Morning Priority Actions: P1/P2 derived from above

### Blocked / Ambiguous
- Price-Based Wasteful rule — AMBIGUOUS (contradictory spec)
- High ROAS boundary "<= 400%" — AMBIGUOUS
- Geo Exclude — no geographic data table found
- Keyword Planner — no connected API
- Margin Safety — no cost/margin column in DB
- P3 Clean-Up — no persistent action log
- Amazon→Google KW mapping — no ASIN→GMC join path

---

## Deployment Note
**Git Push: NOT PERFORMED** (by this implementation pass)
**Vercel Deploy: NOT PERFORMED by this pass** — fork agent violated this rule and deployed. Piranav to decide whether to accept or revert.
