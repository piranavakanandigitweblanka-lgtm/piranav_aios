# Closure — SEO Intelligence Dashboard

## Title
Piranav — LEDSone SEO Intelligence Dashboard (Live Multi-Source Reporting)

## Date
2026-08-03 (updated 2026-08-06 — Phase 1 weekly KPI enhancement)

## Member
Piranav

## Team
SEO / Digital Marketing Intelligence

## Requirement
Build a live SEO intelligence dashboard for ledsone.co.uk that combines Google Search Console, Google Ads, and SEMrush data in a single browser SPA. Auto-generate alerts from live data. Refresh SEMrush data weekly via cloud agents. Monitor KPIs on a weekly basis with 18-month historical visibility (management enhancement — 2026-08-06).

## Status
**COMPLETE — PASS**

---

## Deliverable Map

| ID | Deliverable | Status |
|---|---|---|
| SEO-2026-08-03-01 | Executive Overview — GSC + Ads + SEMrush KPIs in one tab | ✅ PASS |
| SEO-2026-08-03-02 | SEO Alerts panel — auto-generated severity alerts | ✅ PASS |
| SEO-2026-08-03-03 | Backlinks Health section — dual-axis time series chart | ✅ PASS |
| SEO-2026-08-03-04 | SEMrush Rankings sub-tab — top 50 keywords with badges | ✅ PASS |
| SEO-2026-08-03-05 | SEMrush Pages sub-tab — top 50 pages by traffic | ✅ PASS |
| SEO-2026-08-03-06 | Cloud agent — Backlinks weekly refresh (Monday 3am UTC) | ✅ PASS |
| SEO-2026-08-03-07 | Cloud agent — Keywords weekly refresh (Monday 3am UTC) | ✅ PASS |
| SEO-2026-08-03-08 | Cloud agent — Pages weekly refresh (Monday 3am UTC) | ✅ PASS |
| SEO-2026-08-03-09 | Technical reference + blueprint docs | ✅ PASS |
| SEO-2026-08-06-01 | Weekly KPI Summary — 7 cards with WoW % + green/amber/red status | ✅ PASS |
| SEO-2026-08-06-02 | Weekly Comparison Table — all KPIs current vs previous week | ✅ PASS |
| SEO-2026-08-06-03 | Executive Insights — auto-generated biggest increase/decline/action | ✅ PASS |
| SEO-2026-08-06-04 | Enhanced SEO Alerts — WoW-triggered alerts for 5 KPIs | ✅ PASS |
| SEO-2026-08-06-05 | 18-Month KPI Trend Charts — 7 charts (GSC + SEMrush) | ✅ PASS |
| SEO-2026-08-06-06 | Date presets extended — 7d and 18m added to filter bar | ✅ PASS |
| SEO-2026-08-06-07 | New API endpoint — gsc-weekly (26-week rolling window) | ✅ PASS |
| SEO-2026-08-06-08 | CTR added to gsc-monthly API response | ✅ PASS |

---

## Architecture

```
Ledsone DB (GSC + Ads, live) ──┐
                                ├──→ api/seo.js (Vercel Serverless) ──→ pages/seo.html (SPA)
Neon DB (SEMrush, weekly) ─────┘
         ↑
SEMrush MCP → Cloud Agents (Monday 3am UTC)

Executive Overview loads 9 API calls in parallel:
  gsc-monthly    → monthly clicks/impressions/CTR/position (GSC)
  gsc-weekly     → last 26 weeks clicks/impressions/CTR/position/kw_top3/kw_top10 (GSC) [NEW]
  position-dist  → keyword position bucket distribution
  ads-monthly    → Google Ads spend + ROAS
  data-quality   → data source coverage summary
  semrush/history     → 36-month SEMrush organic history
  semrush/competitors → competitor monthly traffic
  semrush/backlinks-history → 24-month backlinks trend
  semrush/backlinks → latest backlink snapshot
```

## Production URL
https://staff-requirements-02.vercel.app/pages/seo.html

## Files
- `Staff-requirements-02/api/seo.js` — all API routes (9 exec endpoints, gsc-weekly added 2026-08-06)
- `Staff-requirements-02/pages/seo.html` — 7-tab SPA (weekly KPI + 18m trends added 2026-08-06)
- `Staff-requirements-02/pages/seo-docs.html` — Data Guide (updated 2026-08-06)
- `Staff-requirements-02/index.html` — dashboard index card (updated 2026-08-06)
- `docs/seo-dashboard-technical.md` — full technical reference
- `docs/seo-dashboard-blueprint.md` — simple blueprint

---

## Business Impact

- Replaces 4 separate tools with one dashboard
- Auto-alerts surface ranking and backlink issues without manual analysis
- Weekly cloud agents eliminate manual SEMrush data entry
- MoM comparison tables give marketing team instant trend visibility
- **2026-08-06 enhancement:** Management can monitor all 7 SEO KPIs week-on-week without opening any external tool — WoW % change, trend status, and auto-generated recommended action are computed from live data on every page load
- 18-month historical KPI trend charts provide long-term visibility that was previously unavailable

---

## Open Items

None — all deliverables complete. Cloud agents running on schedule.

## Known Limitations

| Limitation | Notes |
|---|---|
| Vercel Hobby — no auto-deploy | Must run `vercel --prod` after any code change |
| GSC data is ~50% of true total | Ledsone DB stores partial GSC data — known upstream limitation |
| SEMrush data is ≤7 days old | Cloud agents run weekly, not daily |
| GSC history starts Mar 2026 | Clicks/Impressions/CTR/Position 18m charts will show only ~4 months until Sep 2027 when 18 months of data exists |
| Organic Revenue / Orders / Sessions | Not available — Shopify MCP failed, GA4 limited to 2-month aggregate |
| CWV blocked by Cloudflare | ledsone.co.uk returns 403 to Google Lighthouse — needs WAF whitelist of Chrome-Lighthouse UA |

---

## Evidence
evidence/piranav/seo-dashboard-evidence-2026-08-03.md

## Validation
validation/piranav/seo-dashboard-validation-2026-08-03.md

## Capability
capability/piranav/seo-dashboard-2026-08-03.md

## Implementation
implementation/piranav/seo-dashboard-2026-08-03.md
