# Validation — Requirement 04 — High-Traffic Product Stock Alert
**Date:** 2026-07-07
**Staff:** Hetheesha
**Store:** ledsone.fr

---

## Checklist

| Check | Status | Notes |
|---|---|---|
| Existing assets checked | ✅ PASS | No Req 04 assets existed before |
| Duplicate dashboard risk | ✅ PASS | None found across prompts/, evidence/, reports/, validation/ |
| GA4 availability checked | ✅ PASS | raw_data.ga4_landing_page_daily — 0 rows. NOT available. |
| Traffic metric correctly labelled | ✅ PASS | Column is "GSC Clicks (30d)" — NOT "Sessions" |
| GSC data confirmed | ✅ PASS | 25,198 rows for https://ledsone.fr/, data through 2026-07-03 |
| GSC 30-day product pages | ✅ PASS | 90 unique product pages with ≥1 click |
| Shopify inventory status | ⚠️ DOCUMENTED | Token expired — only 4/90 confirmed via UK warehouse bridge |
| Inventory limitation documented | ✅ PASS | Noted in banner, evidence, data mapping, and HTML report |
| Inventory join logic correct | ✅ PASS | listing_data (UK, handle→SKU) + inv_final_stock (UK warehouse) |
| Business logic invented | ✅ PASS | No — all rules from GPT spec |
| Action rules applied correctly | ✅ PASS | Out of Stock→Redirect, Low Stock→Monitor, In Stock→None, Unknown→Review Required |
| Stock qty threshold correct | ✅ PASS | >10 In Stock, 1–10 Low Stock, 0 Out of Stock |
| Standalone HTML report created | ✅ PASS | reports/hetheesa/hetheesha_requirement_4_high_traffic_stock_alert.html |
| Tab 4 in hetheesha.html updated | ✅ PASS | Replaced placeholder — full dashboard with R4 data array and JS |
| Tab label updated | ✅ PASS | "Not yet assigned" → "High-Traffic Stock Alert" |
| Table columns match spec | ✅ PASS | URL, Name, GSC Clicks, Impressions, Inventory Status, Stock Qty, Alt Product, Action |
| KPI cards present | ✅ PASS | Total, In Stock, Low Stock, Out of Stock, Review Required, Clicks, Impressions |
| Search + filter controls working | ✅ PASS | r4search, r4statusF, r4actionF — all wired to r4_render() |
| Sort by column working | ✅ PASS | r4_sort() on URL, Name, Clicks, Impressions, Status, Stock Qty, Action |
| Export CSV working | ✅ PASS | r4_exportCSV() — all 90 rows, correct filename |
| Row colour-coding correct | ✅ PASS | Green=In Stock, Yellow=Low Stock, Red=Out of Stock, Blue=Review Required |
| Evidence files saved | ✅ PASS | evidence/hetheesa/hetheesha_requirement_4_discovery_evidence.md + _data_mapping.md |
| Prompt captured | ✅ PASS | prompts/hetheesa/hetheesha_requirement_4_high_traffic_stock_alert_prompt.md |
| Production not modified | ✅ PASS | Read-only throughout — no Shopify or DB writes |
| Existing Req 1, 2, 3 still work | ✅ PASS | Only tab-panel-4 content and R4 JS data added |

---

## Known Limitations

| Limitation | Impact | Resolution |
|---|---|---|
| Shopify jedsz8-km token expired | 86/90 products show "Review Required" inventory | Re-authorize Shopify jedsz8-km MCP token → rerun inventory pull → update R4 data array |
| ledsone.fr listing_data has shopify_handle=NULL | Cannot join France product handles to UK SKUs | Requires Shopify API to fetch FR product handle→variant→SKU mapping |
| GA4 not available for ledsone.fr | Traffic metric is GSC Clicks not Sessions | Document in banner — correctly labelled. No action until GA4 is connected. |

---

## Overall Status: PASS ✅ (with documented inventory limitation)

**Reviewer:** Hetheesha / Piranav
**Next Action:** Re-authorize Shopify jedsz8-km → pull ledsone.fr inventory → update R4 data array in hetheesha.html Tab 4
