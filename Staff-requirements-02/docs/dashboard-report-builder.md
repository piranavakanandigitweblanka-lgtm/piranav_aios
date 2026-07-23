# Dashboard Report Builder Prompt

**Use this prompt when:** You want to build a new static HTML dashboard report similar to the Germany Sales Decline Dashboard. Copy the prompt below, fill in the `[PLACEHOLDERS]`, and paste into a new Claude Code session.

---

## PROMPT

```
I need to build a static HTML dashboard report. Here is the full context:

---

## 1. WHAT THIS REPORT IS FOR

[Describe the business question this report answers.
Example: "Show which products are out of stock in Germany and how much revenue we are losing."]

---

## 2. REPORT STRUCTURE

Report name: [e.g. "Amazon DE Out-of-Stock Products"]
Hub label: [e.g. "Report 1A"]
Output file: [e.g. pages/report-1a-amazon-de.html]
Dashboard folder: [e.g. Staff-requirements-02/my-dashboard/]

Tabs needed:
- Tab 1: [e.g. "OOS Products" — main data table]
- Tab 2: [e.g. "PPC Spend" — ad spend after OOS date]
[Remove Tab 2 if not needed]

---

## 3. DATABASE FILTERS (fill all that apply)

Marketplace / country filter:
  Table: order_management.orders
  Column: market_place
  Value: [e.g. 10 for Germany | 1 for UK | leave blank if all]

Channels / accounts to include:
  Table: order_management.orders
  Column: sub_source_id
  Values: [e.g. IN (6, 8) for Amazon DE | IN (1,4,22,27,28,222) for eBay DE | 108 for Shopify DE]

Order status filter:
  Always use: status = 'Completed'
  [Do NOT include Refunded or Cancelled]

Date range:
  [e.g. EXTRACT(YEAR FROM order_date) = 2025]
  [or: order_date BETWEEN '2025-01-01' AND '2025-12-31']

Stock / inventory filter:
  Table: inventory.local_inventory_current_stock_location_wise
  Join: inventory.products ip ON ip.sku = oli.real_sku
        JOIN local_inventory_current_stock_location_wise licsl ON licsl.inventory_id = ip.id
  Warehouse: WHERE licsl.warehouse_location = '[e.g. Germany | UK]'
  Stock condition: [licsl.stock = 0 for OOS | licsl.stock > 0 for in-stock]
  Join type: INNER JOIN (strict — excludes products with no warehouse row)

---

## 4. MAIN TABLE COLUMNS

[List the columns to show in the main data table.]
Example:
- SKU
- Product Image (from listings.amazon_listings.main_image_url)
- Product Title
- 2025 Qty Sold
- 2025 Revenue (€)
- Current DE Stock
- Last Order Date (OOS proxy)
- Days Out of Stock
- Est. Lost Sales (€)

---

## 5. KEY METRICS / KPI CARDS

[List 4–5 KPI cards to show at the top of the page.]
Example:
- Products Out of Stock (count of SKUs)
- 2025 Revenue (These SKUs)
- Est. Total Lost Sales
- Units Sold in 2025
- Avg Days Out of Stock

---

## 6. SECONDARY TAB (if applicable)

Tab type: [PPC Spend | Google Ads | Promoted Listings | leave blank if none]

Ad platform: [Amazon PPC | eBay Promoted Listings | Google Ads]

PPC date rule: Show spend ONLY for dates AFTER each SKU's last order date (OOS date).
  This isolates wasted spend — budget spent when there was no stock to fulfil orders.

PPC join path:
  [Amazon:  amazon_campaigns.performance_data.listing_sku = oos_sku
            JOIN amazon_campaigns.campaigns ON campaign_id WHERE sub_source IN (...) AND market_place = ...]
  [eBay:    ebay_campaigns.performance_data.ebay_listing_id::text = listings.ebay_listings.item_id
            WHERE ebay_listings.sub_source = campaign.sub_source AND sku != 'sku not assigneds'
            JOIN ebay_campaigns.campaigns WHERE marketplace_id = 'EBAY_DE' AND sub_source IN (...)]
  [Google:  google_ads.product_performance.product_item_id = listings.shopify_listings.item_id
            WHERE shopify_listings.sub_source = [108] AND merchant_id = [5351990695]]

PPC KPI cards:
- Total Ad Spend on OOS SKUs
- Total Clicks
- Ad Sales / Conversion Value
- Count of OOS SKUs with spend

PPC table columns:
  [Amazon: SKU | Account | PPC Spend (€) | Clicks | Impressions | Ad Sales (€) | Ad Orders | ACOS | ROAS]
  [eBay:   SKU | Account | Ad Fees (€) | Clicks | Impressions | Attributed Sales | Ad Sale Amount (€)]
  [Google: SKU | Spend (€) | Clicks | Impressions | Conversions | Conv. Value (€) | Avg CPC (€)]

---

## 7. SORTING & FILTERING

Default sort: [e.g. Est. Lost Sales descending | PPC Spend descending]
Search: Filter by SKU text input
Additional filters: [e.g. Status dropdown | Channel filter | Stock health filter]

---

## 8. LOST SALES FORMULA

Use this formula for estimated lost sales:
  (annual_sales_eur / 365) × days_oos

Where:
  annual_sales_eur = total 2025 revenue for this SKU on this channel
  days_oos = TODAY minus last_order_date

Note: This is a daily run-rate estimate. It does not account for seasonality.

---

## 9. DATA EMBEDDING METHOD

The report is a STATIC HTML file — all data embedded in the HTML as a JS array.
No server, no API calls at runtime.

Main data: embed as const DATA=[...]; or var DATA=[...]; in a <script> block
The JS renders table rows dynamically from this array.

For large datasets (300+ rows): write a Python script to:
  1. Run the SQL via DB tool, save result to file
  2. Read the file, process rows in Python
  3. Build new const DATA= line
  4. Read HTML file as lines array
  5. Find line starting with 'const DATA=' and replace that specific line
  6. Write HTML back

Do NOT use regex to replace DATA on a single 700KB line — it will fail.
Use the line-by-line replacement approach.

---

## 10. STYLE / LAYOUT REFERENCE

Base the styling on the Germany Sales Decline Dashboard:
  File: Staff-requirements-02/germany-sales-decline-dashboard/pages/report-1a-amazon-de.html

Key CSS variables to reuse:
  --navy, --gold, --accent, --accent-soft, --red, --warn, --good, --muted, --line

Standard components:
  - .kpis grid at top (KPI cards)
  - .tbox / .tbar / .scroll / table (main data table)
  - .tab-nav / .tab-pane (if two tabs needed)
  - .ppc-kpis / .ppc-note (PPC tab specific)
  - .mark badge + .kicker label in masthead
  - Back to Dashboard link → ../index.html

---

## 11. DEPLOYMENT

Deploy to Vercel after build:
  cd Staff-requirements-02/
  vercel --prod --yes

Then git add + commit + push.

---

## 12. CORRECTNESS CHECKLIST (run before deploying)

Before embedding data, verify each of these with a spot-check SQL query:

[ ] market_place filter is applied — query returns 0 rows without it vs correct count with it
[ ] status = 'Completed' only — run COUNT for Refunded to confirm they are excluded
[ ] INNER JOIN on warehouse row — confirm 0 products with stock > 0 appear in OOS list
[ ] OOS proxy (last_order_date) is reasonable — spot-check 2–3 SKUs manually
[ ] Lost sales formula gives sensible numbers — check top SKU manually
[ ] PPC date filter is applied — confirm spend_from_date > oos_date for all rows
[ ] Image URLs resolve — check 2–3 URLs in browser before embedding

---

## 13. AIOS DOCUMENTATION REQUIRED

After building, create:
1. closure/README.md entry for each report built
2. handover/piranav/[dashboard-name]-handover-[date].md
3. docs/[report-name].md in the dashboard folder (see Germany dashboard docs/ as template)
4. Git commit + push before session ends

---

## REFERENCE: GERMANY DASHBOARD (completed example)

Live URL: https://staff-requirements-02.vercel.app/germany-sales-decline-dashboard/
Source: Staff-requirements-02/germany-sales-decline-dashboard/
Docs: Staff-requirements-02/germany-sales-decline-dashboard/docs/
Build docs per report: see docs/README.md in that folder

Sub-source reference:
  Amazon Ledsone = 8 | Amazon Dcvoltage = 6
  eBay led_sone = 1 | huettenlampen = 28 | ledsonede = 27 | electricalsone = 22 | sunsone = 4 | homin_gmbh = 222
  Shopify ledsone-de = 108
  Germany market_place = 10
```

---

## HOW TO USE THIS PROMPT

1. Copy everything between the triple backticks above
2. Fill in all `[PLACEHOLDERS]` — remove sections that do not apply
3. Paste into a new Claude Code session
4. Claude will run the DB queries, build the Python rebuild scripts, generate the HTML, and deploy

## TIPS

- Always verify data with a spot-check SQL before accepting the build
- If the SQL result file is too large for context, Claude will save it to tool-results/ and process via Python script — this is expected
- The line-by-line HTML replacement (not regex) is the correct approach for large DATA arrays
- PPC spend tab is optional — remove Section 6 if not needed
- If you need cross-channel (Amazon + eBay + Shopify combined), use the FULL OUTER JOIN pattern from Report 2 docs
