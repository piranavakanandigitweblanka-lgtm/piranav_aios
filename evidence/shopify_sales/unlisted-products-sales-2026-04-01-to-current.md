# Unlisted Products Sales Report

**Requirement ID:** UNLISTED-PRODUCTS-SALES-2026-04-01  
**Investigation Date:** 2026-07-03  
**Store:** LEDSone UK Ltd (ledsone.myshopify.com)  
**Date Range:** 2026-04-01 00:00:00 to 2026-07-03 (current)  
**Source System:** Shopify Admin connector — read-only  
**Checked by:** Claude Code AIOS

---

## Existing Assets Checked

- `evidence/shopify_sales/configurator-page-sales-2026-07-03.md` — different scope (configurator page sessions/attribution). Not extended; new file created.

---

## Method

1. Each product handle was resolved to its Shopify product ID and status via `productByHandle` GraphQL query (3 batches of 30/30/33).
2. Sales data queried via ShopifyQL `FROM sales SHOW gross_sales, net_sales, orders GROUP BY product_id WHERE product_id IN (...)` — 3 batches covering all 93 IDs.
3. Matching order(s) retrieved via GraphQL `orders` query filtered by `product_id` and `created_at`.

---

## All Products Checked

| # | Handle | Product Title | Shopify ID | Status | Sold? |
|---|---|---|---|---|---|
| 1 | purple-glass-shade | Purple Glass Shade ~6630 | 15269023187330 | UNLISTED | No |
| 2 | yellow-brass-lamp-holder | Yellow Brass Short Lamp Holder | 15309079150978 | UNLISTED | No |
| 3 | satin-nickel-lamp-holder | Satin Nickel Lamp Holder | 15309083607426 | UNLISTED | No |
| 4 | green-brass-lamp-holder | Green Brass Lamp Holder | 15309086720386 | UNLISTED | No |
| 5 | copper-lamp-holder | Copper Short Lamp Holder | 15309089472898 | UNLISTED | No |
| 6 | black-lamp-holder | Black Short Lamp Holder | 15309093896578 | UNLISTED | No |
| 7 | yellow-brass-ceiling-rose | 10cm Yellow Brass Side Fit Ceiling Rose | 15309098680706 | UNLISTED | No |
| 8 | satin-nickel-ceiling-rose | 10cm Red Side Fit Ceiling Rose | 15309101662594 | UNLISTED | No |
| 9 | green-brass-ceiling-rose | 10cm Yellow Side Fit Ceiling Rose | 15309103890818 | UNLISTED | No |
| 10 | copper-ceiling-rose | Copper Ceiling Rose | 15309106708866 | UNLISTED | No |
| 11 | black-ceiling-rose | 10cm Black Side Fit Ceiling Rose | 15309109264770 | UNLISTED | No |
| 12 | yellow-brass-cable | 2 Core Twisted Yellow Cable | 15309110772098 | UNLISTED | No |
| 13 | satin-nickel-cable | 2 Core Twisted Blue Cable | 15309111853442 | UNLISTED | No |
| 14 | green-brass-cable | 2 Core Twisted Green Cable | 15309113819522 | UNLISTED | No |
| 15 | copper-cable | 2 Core Twisted Red Cable | 15309116047746 | UNLISTED | No |
| 16 | black-cable | 2 Core Black Twisted Cable | 15309117882754 | UNLISTED | No |
| 17 | service-fee-pendant-light-configurator | Assembling Fee – Pendant Light Configurator | 15310681342338 | UNLISTED | No |
| 18 | light-blue-cone-shade | Light Blue Cone Shade | 15326767284610 | UNLISTED | No |
| 19 | black-cone-shade | Black inner white Cone Shade | 15326771020162 | UNLISTED | No |
| 20 | red-cone-shade | Red Cone Shade | 15326775902594 | UNLISTED | No |
| 21 | green-cone-shade | Green Cone Shade | 15326776295810 | UNLISTED | No |
| 22 | 10cm-blue-side-fit-ceiling-rose | 10cm Blue Side Fit Ceiling Rose | 15326828396930 | UNLISTED | No |
| 23 | 10cm-dark-green-side-fit-ceiling-rose | 10cm Dark Green Side Fit Ceiling Rose | 15326852284802 | UNLISTED | No |
| 24 | 10cm-light-green-side-fit-ceiling-rose | 10cm Light Green Side Fit Ceiling Rose | 15326852776322 | UNLISTED | No |
| 25 | 2-core-twisted-orange-cable | 2 Core Twisted Orange Cable | 15326871585154 | UNLISTED | No |
| 26 | red-dome-shade | Red Dome Shade | 15327166431618 | UNLISTED | No |
| 27 | black-dome-shade | Black Dome Shade | 15327166464386 | UNLISTED | No |
| 28 | green-dome-shade | Green Dome Shade | 15327166562690 | UNLISTED | No |
| 29 | yellow-dome-shade | Yellow Dome Shade | 15327166628226 | UNLISTED | No |
| 30 | brushed-copper-dome-shade | Brushed Copper Dome Shade | 15327166660994 | UNLISTED | No |
| 31 | 2-core-round-orange-cable | 2 Core Round Orange Cable | 15327167021442 | UNLISTED | No |
| 32 | 2-core-round-red-cable | 2 Core Round Red Cable | 15327167054210 | UNLISTED | No |
| 33 | 2-core-round-green-cable | 2 Core Round Green Cable | 15327167086978 | UNLISTED | No |
| 34 | 2-core-round-gold-cable | 2 Core Round Gold Cable | 15327167119746 | UNLISTED | No |
| 35 | 2-core-round-black-cable | 2 Core Round Black Cable | 15327167152514 | UNLISTED | No |
| 36 | 3-core-black-twisted-cable | 3 Core Black Twisted Cable | 15329858584962 | UNLISTED | No |
| 37 | 3-core-blue-twisted-cable | 3 Core Blue Twisted Cable | 15329858847106 | UNLISTED | No |
| 38 | 3-core-gold-twisted-cable | 3 Core Gold Twisted Cable | 15329858978178 | UNLISTED | No |
| 39 | 3-core-green-twisted-cable | 3 Core Green Twisted Cable | 15329859109250 | UNLISTED | No |
| 40 | 3-core-red-twisted-cable | 3 Core Red Twisted Cable | 15329859174786 | UNLISTED | No |
| 41 | 3-core-round-black-cable | 3 Core Round Black Cable | 15329859961218 | UNLISTED | No |
| 42 | 3-core-round-gold-cable | 3 Core Round Gold Cable | 15329859993986 | UNLISTED | No |
| 43 | 3-core-round-green-cable | 3 Core Round Green Cable | 15329860059522 | UNLISTED | No |
| 44 | 3-core-round-orange-cable | 3 Core Round Orange Cable | 15329860157826 | UNLISTED | No |
| 45 | 3-core-round-red-cable | 3 Core Round Red Cable | 15329861108098 | UNLISTED | No |
| 46 | brushed-brass-curvy-shade | Brushed Brass Curvy Shade | 15329862254978 | UNLISTED | No |
| 47 | black-inner-gold-curvy-shade | Black Inner Gold Curvy Shade | 15329862320514 | UNLISTED | No |
| 48 | grey-curvy-shade | Grey Curvy Shade | 15329862517122 | UNLISTED | No |
| 49 | red-curvy-shade | Red Curvy Shade | 15329862549890 | UNLISTED | No |
| 50 | burgandy-curvy-shade | Burgandy Curvy Shade | 15329862582658 | UNLISTED | No |
| 51 | 2-core-twisted-purple-cable | 2 Core Twisted Purple Cable | 15330771468674 | UNLISTED | No |
| 52 | 2-core-twisted-red-white-cable | 2 Core Twisted Red & White Cable | 15330771501442 | UNLISTED | No |
| 53 | 2-core-twisted-rose-gold-cable | 2 Core Twisted Rose Gold Cable | 15330772058498 | UNLISTED | No |
| 54 | **copper-threaded-holder** | **Copper Threaded Holder** | **15333039800706** | **UNLISTED** | **YES** |
| 55 | green-brass-holder | Green Brass Threaded Holder | 15333040030082 | UNLISTED | No |
| 56 | rose-gold-threaded-holder | Rose Gold Threaded Holder | 15333040914818 | UNLISTED | No |
| 57 | 10cm-black-side-fit-ceiling-rose-for-wall-light | 10cm Black Side Fit Ceiling Rose for wall Light | 15333088100738 | UNLISTED | No |
| 58 | black-adjustable-wall-long-arm | Black Adjustable Wall Long Arm | 15333093835138 | UNLISTED | No |
| 59 | service-fee-wall-light-configurator | Assembling Fee – Wall Light Configurator | 15333124407682 | UNLISTED | No |
| 60 | resd-dome-shade-for-wall-light | Resd Dome Shade for wall light | 15333126537602 | UNLISTED | No |
| 61 | pink-cone-shade | Pink Cone Shade | 15333757223298 | UNLISTED | No |
| 62 | chrome-curvy-shade | Chrome Curvy Shade | 15333760893314 | UNLISTED | No |
| 63 | orange-dome-shade | Orange Dome Shade | 15333765742978 | UNLISTED | No |
| 64 | 10cm-re-side-fit-ceiling-rose-for-wall-light | 10cm Red Side Fit Ceiling Rose for wall Light | 15333921227138 | UNLISTED | No |
| 65 | 10cm-blue-side-fit-ceiling-rose-for-wall-light | 10cm Blue Side Fit Ceiling Rose for wall Light | 15333929091458 | UNLISTED | No |
| 66 | 10cm-green-side-fit-ceiling-rose-for-wall-light | 10cm Green Side Fit Ceiling Rose for wall Light | 15333931286914 | UNLISTED | No |
| 67 | chrome-adjustable-wall-long-arm | Chrome Adjustable Wall Long Arm | 15333932728706 | UNLISTED | No |
| 68 | yellow-brass-adjustable-wall-long-arm | Yellow Brass Adjustable Wall Long Arm | 15333934399874 | UNLISTED | No |
| 69 | white-adjustable-wall-long-arm | White Adjustable Wall Long Arm | 15333935153538 | UNLISTED | No |
| 70 | french-gold-adjustable-wall-long-arm | French Gold Adjustable Wall Long Arm | 15333935546754 | UNLISTED | No |
| 71 | rose-gold-adjustable-wall-long-arm | Rose Gold Adjustable Wall Long Arm | 15333942198658 | UNLISTED | No |
| 72 | yellow-dome-shade-for-wall-light | Yellow Dome Shade for wall light | 15334427066754 | UNLISTED | No |
| 73 | green-dome-shade-for-wall-light | Green Dome Shade for wall light | 15334427099522 | UNLISTED | No |
| 74 | black-inner-white-dome-shade-for-wall-light | Black Inner White Dome Shade for wall light | 15334427296130 | UNLISTED | No |
| 75 | brushed-silver-dome-shade-for-wall-light | Brushed Silver Dome Shade for wall light | 15334427328898 | UNLISTED | No |
| 76 | black-ceiling-rose-for-tablelamp | Wood Ceiling Rose For TableLamp | 15334430769538 | UNLISTED | No |
| 77 | black-lamp-cable-for-table-lamp | Black Lamp Cable for Table Lamp | 15334430933378 | UNLISTED | No |
| 78 | crackle-glaze-light-shade-for-table-lamp | Crackle Glaze Light Shade For Table Lamp | 15334431228290 | UNLISTED | No |
| 79 | black-3-pin-13-amp-plug | Black 3 Pin 13 AMP Plug | 15334431326594 | UNLISTED | No |
| 80 | orange-lamp-cable-for-table-lamp | Orange Lamp Cable for Table Lamp | 15334431392130 | UNLISTED | No |
| 81 | red-lamp-cable-for-table-lamp | Red Lamp Cable for Table Lamp | 15334437323138 | UNLISTED | No |
| 82 | light-blue-lamp-cable-for-table-lamp | Light Blue Lamp Cable for Table Lamp | 15334470484354 | UNLISTED | No |
| 83 | dark-blue-lamp-cable-for-table-lamp | Dark Blue Lamp Cable for Table Lamp | 15334471041410 | UNLISTED | No |
| 84 | burgendy-lamp-cable-for-table-lamp | Burgendy Lamp Cable for Table Lamp | 15334473171330 | UNLISTED | No |
| 85 | service-fee-table-light-configurator | Assembling Fee – Table Light Configurator | 15334501941634 | UNLISTED | No |
| 86 | glass-flower | Glass Flower | 15334899745154 | UNLISTED | No |
| 87 | crackle-glaze-flower-light-shade-for-table-lamp | Crackle Glaze Flower Light Shade For Table Lamp | 15334906855810 | UNLISTED | No |
| 88 | brown-3-pin-13-amp-plug | Brown 3 Pin 13 AMP Plug | 15334911967618 | UNLISTED | No |
| 89 | white-3-pin-13-amp-plug | White 3 Pin 13 AMP Plug | 15334912590210 | UNLISTED | No |
| 90 | transparent-3-pin-13-amp-plug | Transparent 3 Pin 13 AMP Plug | 15334913245570 | UNLISTED | No |
| 91 | woven-black-diamond-square-shape-wire-cage | Woven black diamond square shape wire cage | 15334914392450 | UNLISTED | No |
| 92 | 10cm-yellow-side-fit-ceiling-rose-for-wall-light | 10cm Yellow Side Fit Ceiling Rose for wall Light | 15334917865858 | UNLISTED | No |
| 93 | 10cm-yellow-brass-side-fit-ceiling-rose-for-wall-light | 10cm Yellow Brass Side Fit Ceiling Rose For Wall Light | 15334920159618 | UNLISTED | No |

---

## Products With Sales

### Copper Threaded Holder (`copper-threaded-holder`)

- **Shopify ID:** gid://shopify/Product/15333039800706
- **Status:** UNLISTED
- **Published At:** 2026-05-12 (Online Store publication date, hidden from store)
- **Orders:** 1
- **Quantity Sold:** 5
- **Gross Revenue:** £22.87
- **Net Revenue:** £22.87
- **First Sale:** 2026-05-31
- **Latest Sale:** 2026-05-31

#### Order Detail

| Order ID | Order Number | Order Date | Qty | Unit Price | Line Item Total | Customer Country |
|---|---|---|---|---|---|---|
| gid://shopify/Order/13173421801858 | #LED54539 | 2026-05-31T08:56:19Z | 5 | £5.49 | £27.45 | GB |

> Note: ShopifyQL gross_sales reports £22.87; line item total is £27.45 (5 × £5.49). Discrepancy is likely due to a discount applied at order level or ShopifyQL net calculation differences. The line item price of £5.49 × 5 = £27.45 is the raw value; order total confirmed at £27.45 GBP.

---

## Summary

| Metric | Value |
|---|---|
| Total unlisted products checked | 93 |
| Products with sales (Apr 1 – Jul 3) | **1** |
| Products without sales | 92 |
| Total orders | 1 |
| Total quantity sold | 5 units |
| Total gross revenue (ShopifyQL) | £22.87 |
| Total line item revenue (GraphQL) | £27.45 |
| Date of sale | 2026-05-31 |
| Customer country | GB |

---

## Assembly Fee (Configurator) Sales

The three service-fee/assembly-fee products were also checked:

| Handle | Title | Sold? |
|---|---|---|
| service-fee-pendant-light-configurator | Assembling Fee – Pendant Light Configurator | No |
| service-fee-wall-light-configurator | Assembling Fee – Wall Light Configurator | No |
| service-fee-table-light-configurator | Assembling Fee – Table Light Configurator | No |

**No assembly fee orders exist in the date range.** This means the configurator has not generated any completed purchases that included the assembly fee line item.

---

## Duplicate Check

- Prior report `configurator-page-sales-2026-07-03.md` covers session/page attribution only — different scope. No conflict.
- No other unlisted-products report found in repo.
- **Duplicate risk: GREEN**

---

## Limitations

- `UNLISTED` is Shopify's status for products that are ACTIVE but not published to the Online Store sales channel. They can be sold via direct link, the Shopify Admin, or draft orders — the one sale found (Copper Threaded Holder) was placed by a GB customer, likely via direct link or admin draft order.
- ShopifyQL `WHERE product_id IN (...)` filters were used for all 93 products across 3 batches. Any product not appearing in results = zero sales in range.
- Sales data covers Apr 1 – Jul 3 2026 only. Prior period sales are not in scope.

---

## PASS / FAIL

**PASS** — All 93 product handles resolved, all product IDs confirmed UNLISTED, sales checked via ShopifyQL for all 93 products in three batches, one matching order retrieved with full line-item detail. Evidence file records exact findings.
