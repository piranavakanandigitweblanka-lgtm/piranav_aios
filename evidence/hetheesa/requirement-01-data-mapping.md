---
title: Requirement 01 — Data Mapping Evidence
purpose: Document how revenue, SEO, and GSC data were joined for the dashboard
requirement_source: "What I Need to Improve SEO Performance - Hetheesa_.csv"
staff: Hetheesa
supporting_aios: Piranav
date: 2026-07-03
status: PASS — All 48 products mapped
---

# Data Mapping — Requirement 01

## Join Logic

### Step 1: Revenue Base (Shopify ShopifyQL)
Source: `FROM sales GROUP BY product_title, product_id ORDER BY gross_sales DESC`  
Output: 48 products with product_id, gross_sales, net_sales, orders

### Step 2: Product SEO Data (Shopify GraphQL)
Joined via: `gid://shopify/Product/{product_id}` → `nodes(ids: [...])`  
Fields: handle, onlineStoreUrl, seo.title, seo.description, images.altText  
URL construction: `https://ledsone.fr/products/{handle}`

### Step 3: GSC Data (PostgreSQL)
Joined via: `page = 'https://ledsone.fr/products/{handle}'`  
Table: `google_search_console.gsc_web_page`  
Match: string equality on product URL

## Complete Product Data Map

| Rank | Product Code | Revenue (€) | Handle | Meta Title | Meta Desc | Alt Missing | GSC Impressions | CTR% |
|------|-------------|-------------|--------|-----------|----------|-------------|-----------------|------|
| 1 | ~1900 | 307.67 | ledsone-industrial-vintage-32cm-green-pendant-retro-metal-lamp-shade-e27-uk-holder | OK(56) | OK(157) | 0 | — | — |
| 2 | ~1541 | 288.84 | 5-way-spider-light-fixture-3399 | OK(49) | OK(138) | 2 | 398 | 0.51 |
| 3 | ~2153 | 165.00 | ledsone-luminaire-suspendu-vintage-trois-bras-avec-abat-jour-conique-plat | Missing | Missing | 10 | — | — |
| 4 | ~1647 | 163.11 | galvanised-conduit-metal-pipe-light-fittings-accessories-4646 | Missing | Missing | 0 | — | — |
| 5 | ~5543 | 138.12 | 20mm-galvanized-steel-conduit-lighting-box-fitting | OK(49) | OK(160) | 0 | — | — |
| 6 | ~1533 | 137.37 | 22cm-luminaire-abat-jour-en-metal-e27-b22 | OK(41) | OK(126) | 0 | — | — |
| 7 | ~1542 | 108.17 | multi-shade-2m-pendant-light | OK(58) | OK(152) | 2 | 3143 | 0.06 |
| 8 | ~1507 | 108.05 | industrial-vintage-ratio-2-head-hemp-spider-chandelier-e27-uk-holder | OK(55) | OK(160) | 10 | 244 | 0.40 |
| 9 | ~1528 | 101.33 | vintage-ceiling-pendant-light-lamp-shade-industrial-chandelier-spider-lamp | Missing | Missing | 2 | — | — |
| 10 | ~3646 | 100.83 | 1m-twisted-cable-e27-base-holder | Missing | Missing | 3 | — | — |
| 11 | ~2034 | 92.30 | applique-murale-led-reglable-e27-industrielle | OK(45) | OK(142) | 0 | — | — |
| 12 | ~1722 | 84.52 | bottle-shaped-led-pendant-light | Too Long(70) | Too Long(161) | 0 | — | — |
| 13 | ~1753 | 78.33 | industrial-style-led-ceiling-light-fixtures | OK(55) | Too Short(110) | 3 | — | — |
| 14 | ~1916 | 74.30 | suspension-ledsone-8-voies-forme-araignee-e27-reglable | Too Long(63) | OK(150) | 0 | 70 | 0.00 |
| 15 | ~1560 | 71.30 | vintage-industrial-metal-retro-ceiling-pendant-light-copper-shade | OK(56) | Too Long(161) | 8 | — | — |
| 16 | ~2161 | 68.30 | applique-murale-en-metal-avec-abat-jour-facile-a-installer | OK(46) | Too Long(162) | 0 | — | — |
| 17 | ~1544 | 64.77 | ledsone-suspension-industrielle-lustre-retro-plafonnier-metal | Too Long(67) | OK(147) | 2 | 71 | 0.00 |
| 18 | ~1642 | 46.12 | vintage-e27-bulb-holder-suspension-light-fitting-ceiling-2m-hanging-pendant-light-4907 | OK(51) | OK(142) | 7 | 100 | 1.00 |
| 19 | ~1774 | 43.93 | modern-blue-ceiling-light-shade-hanging-pendant-lamp-metal-dome-shade | OK(50) | OK(148) | 10 | — | — |
| 20 | ~1993 | 43.05 | ledsone-industriel-suspension-luminaire-retro-vintage | Too Long(69) | OK(157) | 10 | 30 | 7.14 |
| 21 | ~1894 | 42.72 | wall-scone | Too Long(62) | OK(154) | 10 | — | — |
| 22 | ~1917 | 42.13 | suspension-vintage-ledsone-5-lumieres-industriel-e27 | OK(51) | OK(147) | 1 | — | — |
| 23 | ~1918 | 37.57 | agunnaryd-pendant-lamp | Too Long(69) | OK(156) | 5 | — | — |
| 24 | ~1554 | 37.13 | swan-neck-wall-light-indoor-lamp | OK(59) | OK(144) | 10 | — | — |
| 25 | ~1828 | 36.36 | copper-ceiling-rose-light-pendant-for-cable | OK(56) | OK(156) | 2 | — | — |
| 26 | ~2115 | 33.65 | applique-murale-vintage-led-eclairage-retro-ajustable | OK(55) | Too Long(164) | 0 | — | — |
| 27 | ~1580 | 33.08 | 2-way-retro-vintage-chandelier-ceiling-spider-light-industrial-pendant-lamp-e27-4945 | Too Long(68) | Too Long(162) | 2 | 154 | 1.88 |
| 28 | ~1708 | 31.90 | applique-murale-industrielle-vintage-avec-motif-c-ne | OK(54) | OK(140) | 2 | — | — |
| 29 | ~2152 | 31.81 | industrial-vintage-retro-adjustable-ceiling-various-colours-pendant-light-with-e27-uk-holder | OK(59) | Too Long(166) | 10 | — | — |
| 30 | ~2018 | 29.00 | suspension-luminaire-industrielle-3-lampes-metal-noir-ledsone | OK(52) | OK(129) | 8 | — | — |
| 31 | ~5854 | 27.25 | vintage-retro-pendant-light-with-metal-shade | OK(60) | OK(158) | 5 | — | — |
| 32 | ~1630 | 25.83 | ancienne-suspension-lustre-plafonnier-araign-e-industriel | OK(51) | OK(138) | 4 | — | — |
| 33 | ~3645 | 24.97 | 2m-black-white-round-cable-e27-base-satin-nickel-holder | OK(32) | Too Short(119) | 2 | 176 | 1.31 |
| 34 | ~2024 | 24.40 | plafonnier-cage-cristal-verre-moderne-e27 | Too Long(66) | Missing | 0 | — | — |
| 35 | ~1990 | 23.41 | lot-de-3-abat-jours-vintage-suspension-industrielle-incurvee-e27 | OK(58) | OK(133) | 5 | — | — |
| 36 | ~1863 | 20.99 | dc24v-ip67-150w-waterproof-led-driver-power-supply-transformer | Too Long(62) | OK(150) | 3 | 108 | 0.00 |
| 37 | ~1742 | 18.66 | vintage-industrial-retro-metal-indoor-ceiling-light-flush-mount-retro-cone-shade-lamp-uk | Missing | Missing | 0 | — | — |
| 38 | ~1687 | 18.66 | suspension-lustre-suspension-lampe-suspension-plafonnier-industriel-2-t-tes | OK(54) | Too Long(161) | 10 | — | — |
| 39 | ~5539 | 17.47 | e27-lamp-holder-20mm-female-thread-conduit-ceiling-light-socket | Missing | Missing | 0 | — | — |
| 40 | ~1720 | 15.57 | indoor-wall-fitting-lounge-light-fittings | OK(37) | OK(146) | 10 | — | — |
| 41 | ~1689 | 15.23 | abat-jour-m-tal-pluton-plafonnier-suspension-luminaire-abat-jour | OK(48) | OK(155) | 0 | — | — |
| 42 | ~1545 | 15.07 | vintage-e27-bulb-holder-suspension-light-fitting-ceiling-hanging-pendant-light | OK(58) | Too Long(163) | 0 | 883 | 0.76 |
| 43 | ~1824 | 14.05 | vintage-ceiling-light-pendant-lamp-shade | Too Long(61) | Too Long(167) | 2 | — | — |
| 44 | ~1514 | 13.72 | ledsone-200mm-kit-rosace-cylindrique-en-metal-a-3-trous | OK(50) | OK(151) | 1 | 67 | 3.83 |
| 45 | ~2323 | 13.14 | abat-jour-plafond-m-tal-industriel-r-tro-26cm-ledsone | OK(50) | OK(152) | 10 | — | — |
| 46 | ~1673 | 9.17 | ampoules-led-ba-onnette-st64-b22-4w-dimmable-filament-edison-ampoules | OK(57) | OK(144) | 10 | — | — |
| 47 | ~3077 | 7.20 | 4w-t45-b22-led-dimmable-vintage-teardrop-spiral-filament-light-bulb-1 | OK(59) | OK(152) | 0 | — | — |
| 48 | ~3322 | 6.56 | 7w-280mamp-dc-20-27v-compact-constant-current-led-driver | Too Long(70) | OK(150) | 3 | — | — |

## Evidence Path
`C:\Users\PC\Documents\piranav_aios\evidence\hetheesa\requirement-01-data-mapping.md`

## Validation Result
PASS

## Reviewer
Piranav (AIOS worker)

## Status
PASS
