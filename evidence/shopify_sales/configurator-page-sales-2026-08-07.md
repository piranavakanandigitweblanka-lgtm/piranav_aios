# Configurator Page Sales Evidence

**Requirement ID:** CONFIGURATOR-SALES-2026-08-07
**Page URL:** https://ledsone.co.uk/pages/led-sone-products-configurator
**Date range checked:** 2026-04-01 to 2026-08-07 (129 days)
**Source system:** Shopify Admin connector (ledsone.myshopify.com)
**Checked by:** Claude Code AIOS — read-only investigation
**Updated:** 2026-08-07 (extended from Jul 2026 doc — same method, full date range refresh)
**Prior doc:** `evidence/shopify_sales/configurator-page-sales-2026-07-03.md`

---

## Method

1. Checked prior doc (`configurator-page-sales-2026-07-03.md`) — same 3-step method reused.
2. ShopifyQL `FROM sessions` daily timeseries filtered to configurator landing page URL — Apr 1 to Aug 7.
3. ShopifyQL `FROM sales` referrer attribution (all sources, all orders) — Apr 1 to Aug 7.
4. GraphQL `customerJourneySummary` (firstVisit + lastVisit + all moments) for 20 most recent orders (Aug 6).
5. Additional journey scan: 300 orders across Jul 7–Aug 7 checked via `moments` inline fragment (this session).

---

## Sessions — Configurator as Landing Page (Apr 1 – Aug 7)

**Total sessions: 399 over 129 days (~3.1/day average)**

| Month | Sessions |
|---|---|
| April 2026 | 83 |
| May 2026 | 119 |
| June 2026 | 127 |
| July 2026 | 55 |
| August 2026 (1–7) | 15 |
| **Total** | **399** |

**Peak days (top 10):**

| Date | Sessions | Note |
|---|---|---|
| 2026-06-04 | 33 | Highest single day |
| 2026-06-05 | 17 | |
| 2026-05-12 | 15 | |
| 2026-04-29 | 14 | |
| 2026-04-16 | 13 | |
| 2026-04-17 | 13 | |
| 2026-04-30 | 12 | |
| 2026-06-27 | 12 | |
| 2026-05-11 | 10 | |
| 2026-05-01 | 9 | |

Active days with sessions: 95 out of 129 total days (74%).

**Full daily breakdown:**

| Date | Sessions | Date | Sessions | Date | Sessions |
|---|---|---|---|---|---|
| 2026-04-07 | 2 | 2026-05-16 | 1 | 2026-06-27 | 12 |
| 2026-04-08 | 5 | 2026-05-18 | 2 | 2026-06-29 | 1 |
| 2026-04-09 | 3 | 2026-05-19 | 4 | 2026-06-30 | 1 |
| 2026-04-10 | 6 | 2026-05-20 | 1 | 2026-07-02 | 1 |
| 2026-04-13 | 4 | 2026-05-21 | 2 | 2026-07-03 | 6 |
| 2026-04-15 | 1 | 2026-05-22 | 3 | 2026-07-04 | 1 |
| 2026-04-16 | 13 | 2026-05-23 | 1 | 2026-07-05 | 2 |
| 2026-04-17 | 13 | 2026-05-24 | 1 | 2026-07-06 | 2 |
| 2026-04-20 | 4 | 2026-05-25 | 1 | 2026-07-07 | 1 |
| 2026-04-26 | 1 | 2026-05-26 | 2 | 2026-07-08 | 1 |
| 2026-04-27 | 2 | 2026-05-27 | 2 | 2026-07-10 | 2 |
| 2026-04-28 | 3 | 2026-05-28 | 3 | 2026-07-11 | 2 |
| 2026-04-29 | 14 | 2026-05-29 | 8 | 2026-07-12 | 2 |
| 2026-04-30 | 12 | 2026-05-30 | 1 | 2026-07-13 | 2 |
| 2026-05-01 | 9 | 2026-05-31 | 2 | 2026-07-14 | 3 |
| 2026-05-04 | 9 | 2026-06-01 | 4 | 2026-07-15 | 2 |
| 2026-05-05 | 8 | 2026-06-02 | 6 | 2026-07-16 | 1 |
| 2026-05-06 | 5 | 2026-06-03 | 4 | 2026-07-17 | 1 |
| 2026-05-07 | 6 | 2026-06-04 | 33 | 2026-07-18 | 3 |
| 2026-05-08 | 5 | 2026-06-05 | 17 | 2026-07-19 | 1 |
| 2026-05-11 | 10 | 2026-06-06 | 9 | 2026-07-20 | 4 |
| 2026-05-12 | 15 | 2026-06-07 | 3 | 2026-07-21 | 3 |
| 2026-05-13 | 8 | 2026-06-08 | 2 | 2026-07-22 | 3 |
| 2026-05-14 | 5 | 2026-06-09 | 3 | 2026-07-23 | 1 |
| 2026-05-15 | 5 | 2026-06-10 | 2 | 2026-07-26 | 2 |
| | | 2026-06-11 | 3 | 2026-07-29 | 6 |
| | | 2026-06-12 | 5 | 2026-07-30 | 2 |
| | | 2026-06-14 | 1 | 2026-07-31 | 1 |
| | | 2026-06-15 | 1 | 2026-08-02 | 4 |
| | | 2026-06-16 | 3 | 2026-08-03 | 4 |
| | | 2026-06-17 | 3 | 2026-08-05 | 5 |
| | | 2026-06-18 | 2 | 2026-08-06 | 2 |
| | | 2026-06-19 | 1 | | |
| | | 2026-06-20 | 1 | | |
| | | 2026-06-21 | 1 | | |
| | | 2026-06-22 | 2 | | |
| | | 2026-06-24 | 4 | | |
| | | 2026-06-26 | 3 | | |

---

## Sales Referrer Attribution (Apr 1 – Aug 7)

**Total orders across all channels: 10,545 | Total gross sales: ~£340,370**

| Referrer Source | Referrer Name | Orders | Gross Sales |
|---|---|---|---|
| search | google | 4,306 | £107,011 |
| (direct/unknown) | — | 3,399 | £109,464 |
| internal | ledsone | 1,882 | £65,073 |
| social | facebook | 703 | £18,394 |
| — | android | 71 | £2,336 |
| search | bing | 51 | £2,680 |
| social | instagram | 35 | £1,145 |
| — | chatgpt | 13 | £312 |
| search | duckduckgo | 13 | £339 |
| — | googlesyndication | 9 | £318 |
| search | yahoo! | 8 | £144 |
| indirect | google | 7 | £672 |
| — | shop | 6 | £104 |
| — | trustpilot | 5 | £139 |
| search | ecosia | 4 | £157 |
| … (21 more rows, all ≤4 orders each) | … | … | … |

**Configurator page referrer: NOT PRESENT in any of the 35 referrer rows.**
All 10,545 orders across the 129-day period are accounted for — zero reference the configurator page URL, its handle, or any UTM tied to it.

---

## Customer Journey Spot-Check (Aug 6 — 20 most recent orders)

| Order | Value | First Visit | Last Visit | Configurator in any moment? |
|---|---|---|---|---|
| #LED60048 | £15.18 | /collections/industrial-vintage-lighting (Google) | same | ❌ No |
| #LED60047 | £6.28 | /products/plasterboard-wall-plugs... (Google) | shop.app checkout | ❌ No |
| #LED60046 | £63.19 | /products/vintage-multi-head-pendant... (Facebook) | /collections/latest-pendent-shade | ❌ No |
| #LED60045 | £39.99 | / (direct) | / (direct) | ❌ No |
| #LED60044 | £20.21 | / (direct) | / (direct) | ❌ No |
| #LED60043 | £21.87 | /products/electrical-cable-3-core... (Google) | shop.app checkout | ❌ No |
| #LED60042 | £16.23 | /collections/premium-lighting/products/round-hemp... (Google) | same | ❌ No |
| #LED60041 | £72.65 | /products/copper-vintage-metal-dome... (unknown) | same | ❌ No |
| #LED60040 | £4.18 | /products/black-bakelite-lamp-holder... (Google) | same | ❌ No |
| #LED60039 | £11.79 | /products/round-hemp-fabric-pendant... (Google) | /products/a60-e27-4w-led-filament... | ❌ No |
| #LED60038 | £11.84 | /products/small-cylinder-glass-shade (Google) | /products/modern-drum-lampshade... | ❌ No |
| #LED60037 | £21.65 | /products/ceiling-rose-hook-plate... (Google) | shop.app checkout | ❌ No |
| #LED60036 | £52.14 | /collections/lights-parts/products/modern-vintage... (Google) | shop.app checkout | ❌ No |
| #LED60035 | £75.34 | /collections/lights-parts/products/3-pcs-single... (Google) | same | ❌ No |
| #LED60034 | £44.28 | /products/industrial-flex-fitting (Google) | same | ❌ No |
| #LED60033 | £6.58 | /products/yellow-brass-ceiling... (unknown) | shop.app checkout | ❌ No |
| #LED60032 | £74.72 | /products/light-bulb-holder-vintage... (unknown) | same | ❌ No |
| #LED60031 | £63.96 | /collections/lights-parts/products/wall-lamp-holder... (Google) | /products/vintage-retro-industrial-chrome... | ❌ No |
| #LED60030 | £15.73 | /products/2m-4m-fabric-flex... (Google) | /products/e27-plug-in-hanging... | ❌ No |
| #LED60029 | £14.65 | /collections/premium-lighting/products/6-pack-4w... (Google) | /collections/lights-parts/products/4w-t45... | ❌ No |

---

## Extended Journey Scan (Jul 7 – Aug 7 — 300 orders via moments)

Ran `customerJourneySummary.moments` across every touchpoint for ~300 orders spanning the full 30-day Shopify attribution window. Covered date slices: Jul 6–7, Jul 14, Jul 20, Jul 27, Aug 6.

| Date Slice | Orders | Configurator Hits | /pages/ URLs Found |
|---|---|---|---|
| Aug 6 (~100 orders) | ~100 | 0 | /pages/discounts (x2), /pages/real-uk-customer-experiences (x1) |
| Jul 6–7 (50 orders) | 50 | 0 | /pages/pi (x1), /pages/real-uk-customer-experiences (x1), /pages/discounts (x1) |
| Jul 14 (50 orders) | 50 | 0 | /pages/discounts (x1) |
| Jul 20 (50 orders) | 50 | 0 | /pages/discounts (x2) |
| Jul 27 (50 orders) | 50 | 0 | /pages/discounts (x1) |
| **TOTAL** | **~300** | **0** | **Configurator: NOT FOUND** |

Note: `/pages/discounts` and other `/pages/` URLs DO appear in order moments — confirming the API captures page-type URLs. The configurator page specifically never appeared.

---

## Evidence Limitations

- `customerJourneySummary.moments` is capped at 15 touchpoints per order — journeys longer than 15 steps may truncate earlier visits.
- Sessions data counts the configurator as a **landing page only** — users who arrived directly at the configurator then navigated to a product page and bought show in sales under the product page, not the configurator.
- Extended scan covered ~300 of ~3,200 orders in the 30-day window (~9% sample).
- GA4 attribution (all-channel, session-scoped) has NOT been queried — this remains the only unvalidated path.
- Shopify's attribution window is 30 days. Orders placed more than 30 days after a configurator visit are permanently untrackable via this method.

---

## Duplicate Risk Check

- Prior doc: `evidence/shopify_sales/configurator-page-sales-2026-07-03.md` — same method, Apr 1–Jul 3.
- This doc extends the date range to Aug 7 and adds the extended `moments` journey scan.
- **Duplicate risk: GREEN** — this is an intentional extension of the prior doc.

---

## Fields Checked

| Field | Checked | Tool |
|---|---|---|
| `customerJourneySummary.firstVisit.landingPage` | ✅ | GraphQL |
| `customerJourneySummary.lastVisit.landingPage` | ✅ | GraphQL |
| `customerJourneySummary.firstVisit.source` | ✅ | GraphQL |
| `customerJourneySummary.firstVisit.referrerUrl` | ✅ | GraphQL |
| `customerJourneySummary.moments[*].landingPage` | ✅ | GraphQL (300 orders) |
| `order_referrer_source` / `order_referrer_name` | ✅ | ShopifyQL |
| `landing_page_url` as session entry point | ✅ | ShopifyQL |
| GA4 session-level attribution (all channels) | ❌ NOT YET RUN | Next step |

---

## Status: UNPROVEN

| Metric | Jul 2026 doc | This doc (Aug 2026) |
|---|---|---|
| Date range | Apr 1 – Jul 3 (94 days) | Apr 1 – Aug 7 (129 days) |
| Configurator sessions (as landing page) | 264 | **399** |
| Orders with configurator in referrer | 0 | **0** |
| Revenue directly attributed | £0 | **£0** |
| Total store orders in period | 7,542 | **10,545** |
| Total store gross sales | ~£264,000 | **~£340,370** |
| Orders journey-checked (moments) | 23 | **~320** |
| Configurator hits in any journey moment | 0 | **0** |

The configurator page received consistent traffic (399 sessions over 129 days, ~3.1/day average) but **zero orders are attributable to it** via any Shopify Admin attribution field or journey moment available through the API.

---

## Next Step

- Run GA4 Data API query (Property 479617728) with `pagePath = /pages/led-sone-products-configurator` to get all-channel session and revenue attribution — this is the only remaining unvalidated path.
- Consider adding UTM parameters to any links pointing to the configurator so future sessions are traceable through to checkout.

---

## Pass/Fail

**PASS** — Full 129-day date range checked via ShopifyQL sessions + sales referrer (all 10,545 orders). Extended journey scan via `moments` across 300 orders in the 30-day attribution window. Configurator page: 0 orders, 0 revenue attributable via Shopify. Evidence file records exact findings with UNPROVEN status and documented API limitations. GA4 path remains as the outstanding unvalidated attribution route.
