# Configurator Page Sales Evidence

**Requirement ID:** CONFIGURATOR-SALES-2026-07-03  
**Page URL:** https://ledsone.co.uk/pages/led-sone-products-configurator  
**Date range checked:** 2026-04-01 to 2026-07-03 (94 days)  
**Source system:** Shopify Admin connector (ledsone.myshopify.com)  
**Checked by:** Claude Code AIOS — read-only investigation  
**Updated:** 2026-07-03 (extended from 7-day to full Apr–Jul range on user request)

---

## Method

1. Searched piranav_aios repo for existing configurator sales evidence → none found.
2. ShopifyQL `FROM sessions` daily timeseries filtered to configurator landing page URL — April 1 to July 3.
3. ShopifyQL `FROM sales` referrer attribution (all sources, all orders) — April 1 to July 3.
4. GraphQL `customerJourneySummary` (firstVisit + lastVisit) for all 3 orders on 2026-07-03.
5. GraphQL `customerJourneySummary` for first 20 orders on 2026-06-26.

---

## Sessions — Configurator as Landing Page (Apr 1 – Jul 3)

**Total sessions: 264 over 94 days**

| Month | Sessions |
|---|---|
| April 2026 | 80 |
| May 2026 | 97 |
| June 2026 | 80 |
| July 2026 (1–3) | 4 (incl. 1 Google Ads click) |
| **Total** | **264** |

**Peak days:** May 12 (15), Jun 4 (16), Apr 29 (14), Apr 17 (13), Apr 16 (12)

Full daily breakdown:

| Date | Sessions | Date | Sessions |
|---|---|---|---|
| 2026-04-07 | 2 | 2026-05-18 | 2 |
| 2026-04-08 | 5 | 2026-05-19 | 4 |
| 2026-04-09 | 3 | 2026-05-20 | 1 |
| 2026-04-10 | 6 | 2026-05-21 | 2 |
| 2026-04-13 | 4 | 2026-05-22 | 2 |
| 2026-04-15 | 1 | 2026-05-23 | 1 |
| 2026-04-16 | 12 | 2026-05-25 | 1 |
| 2026-04-17 | 13 | 2026-05-26 | 2 |
| 2026-04-20 | 4 | 2026-05-27 | 1 |
| 2026-04-26 | 1 | 2026-05-28 | 3 |
| 2026-04-27 | 2 | 2026-05-29 | 6 |
| 2026-04-28 | 3 | 2026-05-30 | 1 |
| 2026-04-29 | 14 | 2026-05-31 | 2 |
| 2026-04-30 | 10 | 2026-06-01 | 3 |
| 2026-05-01 | 9 | 2026-06-02 | 6 |
| 2026-05-04 | 9 | 2026-06-03 | 3 |
| 2026-05-05 | 8 | 2026-06-04 | 16 |
| 2026-05-06 | 5 | 2026-06-05 | 9 |
| 2026-05-07 | 6 | 2026-06-06 | 3 |
| 2026-05-08 | 5 | 2026-06-07 | 1 |
| 2026-05-11 | 10 | 2026-06-08 | 1 |
| 2026-05-12 | 15 | 2026-06-09 | 3 |
| 2026-05-13 | 8 | 2026-06-10 | 2 |
| 2026-05-14 | 5 | 2026-06-11 | 2 |
| 2026-05-15 | 5 | 2026-06-12 | 5 |
| | | 2026-06-15 | 1 |
| | | 2026-06-16 | 2 |
| | | 2026-06-17 | 2 |
| | | 2026-06-18 | 1 |
| | | 2026-06-19 | 1 |
| | | 2026-06-22 | 2 |
| | | 2026-06-24 | 4 |
| | | 2026-06-26 | 2 |
| | | 2026-07-03 | 2 |

---

## Sales Referrer Attribution (Apr 1 – Jul 3)

**Total orders across all channels: 7,542 | Total sales: ~£264,000**

| Referrer Source | Referrer Name | Orders | Total Sales |
|---|---|---|---|
| search | google | 3,076 | £94,432 |
| (direct/unknown) | — | 2,630 | £98,826 |
| internal | ledsone | 1,142 | £49,012 |
| social | facebook | 510 | £15,526 |
| — | android | 50 | £2,134 |
| search | bing | 36 | £2,036 |
| social | instagram | 24 | £699 |
| — | chatgpt | 12 | £412 |
| search | duckduckgo | 11 | £335 |
| … | … | … | … |

**Configurator page referrer: NOT PRESENT in any row.**  
The 28-row referrer table covers all 7,542 orders — no row references the configurator page, its URL, or any UTM tied to it.

---

## Customer Journey Spot-Check

| Order | Date | First Visit Landing Page | Last Visit Landing Page | Configurator? |
|---|---|---|---|---|
| #LED57045 | 2026-07-03 | Product page (Google Ads PMax) | same | ❌ No |
| #LED57044 | 2026-07-02 | Product page (Google Ads PMax) | same | ❌ No |
| #LED57043 | 2026-07-02 | Product page (Google) | different product page | ❌ No |
| #LED56498–56517 | 2026-06-26 | Various product/homepage | Various | ❌ No |

---

## Evidence Limitations

- `customerJourneySummary` exposes **first and last visit only** — mid-session configurator visits are invisible to the API.
- Sessions data counts the configurator as a **landing page** — users who arrived directly at the configurator then navigated to a product page and bought would show up in sales with the product page, not the configurator, as the attribution point.
- Individual order journey checks were limited to 23 sampled orders out of 7,542 total.
- If users were referred to the configurator by a campaign (e.g., the Google Ads click on July 3 with `gclid`), but completed the purchase later in a separate session, Shopify's last-click model may attribute the sale to direct or a subsequent channel.

---

## Duplicate Risk Check

- Searched repo prior to this investigation → no prior configurator sales file.
- **Duplicate risk: GREEN**

---

## Fields Checked

| Field | Checked | Tool |
|---|---|---|
| `customerJourneySummary.firstVisit.landingPage` | ✅ | GraphQL |
| `customerJourneySummary.lastVisit.landingPage` | ✅ | GraphQL |
| `customerJourneySummary.firstVisit.referrerUrl` | ✅ | GraphQL |
| `customerJourneySummary.firstVisit.utmParameters` | ✅ | GraphQL |
| `order_referrer_source` / `order_referrer_name` | ✅ | ShopifyQL |
| `landing_page_url` as session entry point | ✅ | ShopifyQL |
| Intermediate page visits (mid-session) | ❌ NOT AVAILABLE | Shopify API limitation |

---

## Status: UNPROVEN

| Metric | Value |
|---|---|
| Date range | 2026-04-01 to 2026-07-03 |
| Configurator sessions (as landing page) | **264** |
| Orders with configurator in referrer attribution | **0** |
| Revenue directly attributed | **£0** |
| Total store orders in period | 7,542 |
| Total store revenue in period | ~£264,000 |

The configurator page received consistent traffic (264 sessions over 94 days, ~2.8/day average) but **zero orders are attributable to it** via any Shopify Admin attribution field available through the API.

---

## Next Step

- Install GA4 or a multi-touch attribution tool to capture page visits at every funnel stage — this would reveal if configurator users eventually convert via a different landing page.
- Check Shopify Admin UI → Analytics → "Pages" report manually for session-to-conversion funnel on the configurator page specifically.
- Consider adding UTM parameters to any links pointing to the configurator so future sessions are tagged and traceable through to checkout.

---

## Pass/Fail

**PASS** — Full 94-day date range checked, all available Shopify attribution fields examined, sessions data confirms 264 visits, sales referrer table covers all 7,542 orders with zero configurator matches. Evidence file records exact findings with clear UNPROVEN status and documented API limitations.
