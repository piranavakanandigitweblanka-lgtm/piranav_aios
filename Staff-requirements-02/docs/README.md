# Staff-Requirements-02 — Dashboard Docs

Build documentation for all dashboards under `Staff-requirements-02/pages/`.

---

## Dashboard Index

| File | Page | Title | Data Source |
|---|---|---|---|
| [dashboard-hetheesha.md](dashboard-hetheesha.md) | hetheesha.html | SEO Requirements — ledsone.fr | Static + Shopify GQL + GSC DB |
| [dashboard-jakshan.md](dashboard-jakshan.md) | jakshan.html | GSC Analysis & SEO Tracker — ledsone.co.uk | Live API → GSC DB |
| [dashboard-sajeepan.md](dashboard-sajeepan.md) | sajeepan.html | Google Ads PMax Performance — 6 campaigns | Live API → google_ads DB |
| [dashboard-sonya.md](dashboard-sonya.md) | sonya.html | Google Ads Campaign Dashboard — 5 tabs | Live API → google_ads + order_management DB |
| [dashboard-theekshy.md](dashboard-theekshy.md) | theekshy.html | Google Ads Campaign Optimisation — 4 sections | Live API → google_ads + inventory DB |
| [dashboard-thivajini.md](dashboard-thivajini.md) | thivajini.html | Google Ads + Shopify Attribution — ledsone FR | Live API → google_ads + Shopify GQL |
| [dashboard-report-builder.md](dashboard-report-builder.md) | — | Reusable prompt for building new reports | Template |

---

## Germany Sales Decline Dashboard

Separate docs folder at:
`germany-sales-decline-dashboard/docs/` — 6 individual report files (1A, 1B, 1C, 2, 3, 4)

---

## Data Architecture Patterns Used

| Pattern | Used by |
|---|---|
| **Static embedded** — `const DATA=[...]` in HTML, Python script rebuilds | Germany dashboard (R1A/1B/1C/R2/R3/R4) |
| **Live API + date range** — `fetch('/api/name/endpoint?from=&to=')` | Sonya, Theekshy, Thivajini, Jakshan |
| **Mixed** — static base data + live API enrichment | Hetheesha, Sajeepan |

## Common DB Schemas

| Schema | Contains |
|---|---|
| `google_ads` | `campaign_performance`, `campaigns`, `product_performance`, `merchant_products`, `asset_performance`, `pmax_campaign_search_term_data` |
| `google_search_console` | `page`, `query_page`, `gsc_web_page` |
| `order_management` | `orders`, `order_item_info`, `sub_source`, `source` |
| `inventory` | `products`, `local_inventory_current_stock_location_wise` |
| `listings` | `shopify_listings`, `amazon_listings`, `ebay_listings` |
| `suppliers` | `orders`, `order_items` |
| `amazon_campaigns` | `performance_data`, `campaigns` |
| `ebay_campaigns` | `performance_data`, `campaigns` |
