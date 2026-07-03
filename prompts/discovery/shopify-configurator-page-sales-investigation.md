# Prompt — Shopify Configurator Page Sales Investigation

**Category:** discovery
**Pattern name:** `shopify-configurator-page-sales-investigation`
**First used:** 2026-07-03
**Task it solved:** CONFIGURATOR-SALES-2026-07-03

---

## When to use this prompt
When you need to find out whether a specific Shopify page (non-product, e.g. a configurator or landing page) is generating any sales or revenue, using Shopify's available attribution data (sessions, referrer, customer journey).

Reusable for: any LEDSone or Electricalsone page where the business question is "is this page driving sales?"

---

## Full Prompt (as given 2026-07-03)

```
Investigate whether the LEDSone configurator page is generating any sales.

Store: ledsone.myshopify.com
Page URL: https://ledsone.co.uk/pages/led-sone-products-configurator
Date range: April 1 2026 to today (July 3 2026)

Steps:
1. Check piranav_aios repo for any existing configurator sales evidence first.
2. Use ShopifyQL FROM sessions to get daily session counts where the configurator page is the landing page URL — for the full Apr 1 to Jul 3 range.
3. Use ShopifyQL FROM sales referrer attribution — list all referrer sources and names with order count and total sales.
4. Check if the configurator page appears anywhere in the referrer table.
5. Spot-check customer journey (firstVisit + lastVisit landing page) for recent orders to see if any touched the configurator.
6. Save all findings to evidence/shopify_sales/ with a clear PASS/FAIL and status of PROVEN / UNPROVEN.
7. Document any API limitations that prevent a definitive answer.
```

---

## What this prompt produced

| Output | Value |
|---|---|
| Evidence file | `evidence/shopify_sales/configurator-page-sales-2026-07-03.md` |
| Sessions found | 264 over 94 days (Apr 1 – Jul 3) |
| Sales attributed | £0 / 0 orders |
| Status | UNPROVEN — Shopify API only exposes first/last visit; mid-session visits not visible |
| Customer journey checked | 23 orders spot-checked — none touched configurator |
| Key limitation documented | `customerJourneySummary` shows first and last visit only; multi-touch funnel not available via API |

## Reuse notes
- Replace page URL with the target page for any other page investigation
- ShopifyQL `FROM sessions WHERE landing_page_url` is the correct filter for page-as-entry-point
- Shopify referrer attribution does NOT track intermediate page visits — always document this limitation
- For deeper funnel data, recommend GA4 or manual Shopify Admin → Analytics → Pages report
- Always check repo for prior report before starting (Rule 5)
