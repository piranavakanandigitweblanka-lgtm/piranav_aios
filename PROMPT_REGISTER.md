# PROMPT_REGISTER.md — piranav AIOS Prompt Register

---

## STANDING RULE — GPT Prompt Capture (effective 2026-07-01)

Every GPT prompt received for a reusable task **must be registered here** before the task is executed.
Full rule: `prompts/GPT_CAPTURE_RULE.md`

Add a row to this register each time a new prompt is saved. Update the row after the task is executed and evidence is filed.

---

## What This Is

Single authoritative register of all reusable Claude/GPT prompt patterns used in piranav's AIOS workspace. Every row represents a pattern that was used in at least one real work session. New patterns are added via `prompts/closure/capability-log-extraction.md`.

---

## How to Read This Table

| Column | Meaning |
|---|---|
| Date | Date the pattern was first used in a real session |
| Pattern Name | Kebab-case identifier matching the CAPABILITY LOG entry |
| Category | discovery / implementation / validation / documentation / closure / reusable |
| Template File | Path to prompt template, or PENDING if not yet created |
| Source Session | Closure log where this pattern was first recorded |
| Status | ACTIVE / PENDING / DEPRECATED |

**From 2026-07-01:** every row must also be linked to the task evidence file once the task is executed. If no evidence file exists yet, mark as PENDING in the Source Session column.

---

## Register

| Date | Pattern Name | Category | Template File | Source Session | Status |
|---|---|---|---|---|---|
| 2026-10-20 | `bot-20261019-locale-hreflang-investigation` | investigation | `prompts/seo/BOT-20261019-locale-hreflang-investigation-prompt.md` | `closure/README.md — 2026-10-20 BOT-20261019-ORGANIC-EXC-03` | ACTIVE — Read-only investigation: Polish/Dutch/Spanish Shopify Markets locale URLs appearing in UK GSC. Self-canonicals confirmed working (theme.liquid line 53). Custom hreflang in seo-noindex.liquid is fully commented out. Shopify Markets auto-generates hreflang using language-only codes (pl/nl/es). /pl/ UK data: 5 clicks, 14.6K impressions, position 26.2 (28-day to 2026-10-20). Root cause: OPEN — language-only codes vs en-GB/x-default gap not confirmed. No production changes. Evidence: `BOT-20261019-locale-hreflang/01_investigation/BOT-20261019-investigation-2026-10-20.md` |
| 2026-10-20 | `ledsone-us-429-investigation` | investigation | `prompts/seo/ledsone-us-429-investigation-prompt.md` | `closure/README.md — 2026-10-20 LEDSONE-US-429-2026-10-19` | ACTIVE — Traceable investigation of Screaming Frog 429 vs GSC/PowerShell 200 discrepancy. 117 URLs affected. Sample URL blog: halloween-lighting-ideas-2026. Verified: 429 in original SF crawl, 200 in GSC Live Test + PS HEAD/GET/SF-UA. Cause not confirmed. Speed + UA settings locked in free SF licence. Original response headers not stored. Evidence: `evidence/shopify/ledsone-us/ledsone-us-429-investigation-2026-10-19.md`. URL register: `reports/ledsone-us/ledsone-us-429-url-register-2026-10-19.md`. Validation: INCOMPLETE — product/collection URLs not yet retested. |
| 2026-10-15 | `promotion-automation-exclusion-incident` | incident | `prompts/dm-dashboard/promotion-automation-exclusion-incident.md` | `closure/README.md — 2026-10-15 PROMO-INC-01` | ACTIVE — Production incident: accidental seeder run inserted permanent exclusions. Investigation queries, safe recovery SQL (timestamp+actor-scoped DELETE in transaction), prevention plan (preview endpoint + confirm modal + seed_batch_id column). App DB on Contabo — MCP cannot reach. Evidence: `evidence/dm-dashboard/promotion-automation-exclusion-incident-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase2c-account-filter-csv-export` | implementation | `prompts/dm-dashboard/promotion-automation-phase2c-account-filter-csv-export.md` | `closure/README.md — 2026-10-15 PROMO-02-C Phase 2C` | ACTIVE — UK account selector (LEDSone UK/VintageLite UK/Electricalsone UK verified from DB), fix Unknown store via sub_source JOIN, GET /accounts, GET /export/csv (25 cols, formula injection, UTF-8 BOM). 10 new tests T13–T22. 141 suite PASS. Evidence: `evidence/dm-dashboard/promotion-automation-phase2c-account-filter-csv-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase2b-shopify-eligibility` | implementation | `prompts/dm-dashboard/promotion-automation-phase2b-shopify-eligibility.md` | `closure/README.md — 2026-10-15 PROMO-02-B Phase 2B` | ACTIVE — Shopify-only SKU eligibility engine. 4 endpoints: GET /snapshot, POST /evaluate, GET /eligible-skus, POST /seed-exclusions. sub_source_id=104 confirmed. Velocity classification (fast/medium/low). Discount recs: fast=CONFLICT_UNRESOLVED, medium/low=APPROVED. Section A always BLOCKED_MISSING_DATA. 12 unit tests. 131 total pass. Build clean. Evidence: `evidence/dm-dashboard/promotion-automation-phase2b-shopify-eligibility-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase1d-policy` | discovery | `prompts/dm-dashboard/promotion-automation-phase1d-policy.md` | `closure/README.md — 2026-10-15 PROMO-01-D Phase 1D` | ACTIVE — Policy extracted from Nishani_Promotion_Multi_Channel.docx (395 paras). All 5 score sections documented with point allocations + binary rules. 5 intents confirmed. Discount conflict confirmed (Fast movers only — marked NOT APPROVED FOR EXECUTION). D1 RESOLVED. D2/D3 re-verified NOT FOUND. 19 rules ready, 8 blocked. Evidence: `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase1c-discovery` | discovery | `prompts/dm-dashboard/promotion-automation-phase1c-discovery.md` | `closure/README.md — 2026-10-15 PROMO-01-C Phase 1C` | ACTIVE — Verified exact dashboard_pages location, page registration pattern (import + app.include_router in main.py), TOOLS array in taskRegistry.js, ADMIN_ITEMS + filterAdminItems in AdminLayout.jsx, make_admin_task_auth vs make_task_auth, access_grants table, useGrantedTasks hook. Permission key: tools.PromotionAutomation. Auth: make_admin_task_auth. File list: promotion_automation.py + promotion_automation_db.py + PromotionAutomation.jsx + 3 existing file changes. Evidence: `evidence/dm-dashboard/promotion-automation-phase1c-discovery-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase1b-discovery` | discovery | `prompts/dm-dashboard/promotion-automation-phase1b-discovery.md` | `closure/README.md — 2026-10-15 PROMO-01-B Phase 1B` | ACTIVE — Git sync (fast-forward merge origin/main into piranv-work, HEAD 1b56766→087d807, 114 files, no conflicts) + full repo structure + UAM trace (make_task_auth vs make_admin_task_auth, access_grants table, roles: dev/admin/staff, key convention: tools.PascalCase). Blockers D1-D4 unchanged. Evidence: `evidence/dm-dashboard/promotion-automation-phase1b-discovery-2026-10-15.md` |
| 2026-10-15 | `promotion-automation-phase1-discovery` | discovery | `prompts/dm-dashboard/promotion-automation-phase1-discovery.md` | `closure/README.md — 2026-10-15 PROMO-01 Phase 1 Discovery` | ACTIVE — Read-only discovery for DM Dashboard Promotion Automation page. Key findings: policy doc Nishani_Promotion_Multi_Channel.docx NOT FOUND (BLOCKER); n8n removed; ScheduledSnapshot + make_task_auth patterns reusable; business DB confirmed (listings, inventory, order_management schemas); landed cost + review/return rate data NOT in DB (2 blockers); 7 decisions required before Phase 1 implementation. Evidence: `evidence/dm-dashboard/promotion-automation-phase1-discovery-2026-10-15.md` |
| 2026-10-19 | `shopify-collection-filter-variant-option-mode` | implementation | `prompts/shopify/shopify-collection-filter-variant-option-mode.md` | `closure/README.md — 2026-10-19 S1-PIR-02` | ACTIVE — Fix client-side collection filter when filter value is a variant option (not product metafield). Add `filter_5_option_name` schema setting + option index lookup in product loop + per-variant data attribute rendering. Prevents "select Pack=10 shows all packs" bug. Evidence: `evidence/shopify/s1-pir-02-conduit-filters-jsonld-stock-2026-10-19.md` |
| 2026-10-14 | `ledsone-uk-collection-html-size-optimization` | implementation | `prompts/shopify/ledsone-uk-collection-html-size-optimization.md` | `closure/README.md — 2026-10-14 LEDSone UK Collection HTML Optimization` | ACTIVE — Slim `productinfo` JSON in `product-item.liquid`: replace `product.variants \| json` (30+ fields) with minimal Liquid-built JSON (9 fields only). Estimated ~650KB saving on conduit-lighting. Evidence: `evidence/shopify/ledsone-uk-collection-html-optimization-2026-10-14.md`. Validation: `validation/piranav/ledsone-uk-collection-html-optimization-validation-2026-10-14.md` |
| 2026-10-09 | `conduit-fbt-summary-bar-alignment` | implementation | `prompts/shopify/conduit-fbt-summary-bar-alignment.md` | `closure/README.md — 2026-10-09 Conduit Task 10 FBT Summary Bar Fix` | ACTIVE — Fix flex summary bar where total + CTA button wrap on desktop. Solution: `flex-wrap: nowrap`, `flex-direction: row`, `justify-content: space-between`, `align-items: center`, `width: 100%` on container; `flex-shrink: 0` on total label. Mobile: `flex-direction: column`, full-width button. No HTML/JS/Liquid changes. Evidence: `validation/piranav/conduit-task10-fbt-new-section-validation-2026-10-09.md` |
| 2026-10-09 | `conduit-fbt-new-section-implementation` | implementation | `prompts/shopify/conduit-fbt-new-section-implementation.md` | `closure/README.md — 2026-10-09 Conduit Task 10 FBT New Section` | ACTIVE — Build `sections/frequently-bought-together.liquid`: current product + metafield products, checkboxes, combined total, multi-item `/cart/add.js`. Self-gating on blank metafield. No changes to existing FBT snippet. Evidence: `conduit-stock-price-cards/02_implementation/CONDUIT-TASK10-fbt-new-section-implementation-2026-10-09.md` |
| 2026-10-09 | `conduit-fbt-metafield-discovery` | discovery | `prompts/shopify/conduit-fbt-metafield-discovery.md` | `closure/README.md — 2026-10-09 Conduit Task 10 FBT Metafield Discovery` | ACTIVE — Discovery: trace FBT render chain (template → section → custom_liquid block → snippet), document collection-rule logic, confirm metafield `custom.related_products` Liquid access, design metafield-first with collection fallback implementation. No code changes — discovery only. Evidence: `conduit-stock-price-cards/01_discovery/CONDUIT-TASK10-fbt-metafield-discovery-2026-10-09.md` |
| 2026-10-09 | `bgct-ui-ux-doc-pack` | documentation | `prompts/ui-ux/bgct-ui-ux-doc-pack-prompt.md` | `closure/README.md — 2026-10-09 BGCT UI/UX Documentation Pack` | ACTIVE — Build a 4-resource Website UI/UX documentation pack (Best Practice, Guidelines, Checklist, Tutorial) from an Excel workbook for Team Leader handover. Covers 28 tasks across 4 worksheets: Conversion Optimization, Design & Layout, Accessibility, Theme Customization. Evidence: `evidence/piranav/bgct-ui-ux-docpack-2026-10-09.md` |
| 2026-10-09 | `bgct-technical-seo-doc-pack` | documentation | `prompts/seo/bgct-technical-seo-doc-pack-prompt.md` | `closure/README.md — 2026-10-09 BGCT Technical SEO Documentation Pack` | ACTIVE — Build a 4-resource Technical SEO documentation pack (Best Practice, Guidelines, Checklist, Tutorial) from an Excel workbook for Team Leader handover. Covers 29 tasks across 4 worksheets: Site Structure & Crawlability, On-Page SEO, Performance (Core Web Vitals), Shopify-Specific SEO. Evidence: `evidence/piranav/bgct-technical-seo-docpack-2026-10-09.md` |
| 2026-10-09 | `conduit-structured-data-discovery` | discovery | `prompts/shopify/conduit-structured-data-discovery.md` | `closure/README.md — 2026-10-09 Conduit Task 7 Structured Data` | ACTIVE — Discovery: inspect theme JSON-LD for Shopify collection page. Audits theme.liquid, breadcrumb section, main-collection-product, product-faq-ui snippet, both collection templates. Compares main vs duplicate. Identifies missing schemas. Produces implementation design for ItemList + BreadcrumbList snippets. Evidence: `conduit-stock-price-cards/01_discovery/CONDUIT-TASK7-structured-data-discovery-2026-10-09.md` |
| 2026-10-08 | `claude-code-operating-model` | docs | `docs/aios-claude-code-operating-model.md` | Piranav — direct instruction 2026-10-08 | ACTIVE — Standing rule. 17 operating rules covering: scope, GPT coordinator model, existing asset first, prompt rule, execution, evidence, validation, capability check, always/conditional assets, PROMPT_REGISTER, closure, queryability, git, production safety, memory, final AIOS test. Supersedes any informal understanding of Claude Code's role. |
| 2026-10-08 | `capability-document-update-governance` | closure | `prompts/closure/capability-log-extraction.md` (Part 2) | `closure/README.md — 2026-10-08 Capability Governance` | ACTIVE — 5-way classification (NEW/EXTEND/UPDATE/NO CHANGE/REVIEW REQUIRED), 9 automatic trigger conditions, REUSE→EXTEND→UPDATE→MERGE→CREATE decision order, date preservation rule, 7-question queryability test, INDEX update rule, evidence rule, and Capability Update Check closure block. Extends existing capability-log-extraction.md. Daily closure format extended in daily-session-closure.md. |
| 2026-10-08 | `ledsone-ip-cease-and-desist` | legal | `prompts/legal/ledsone-ip-cease-and-desist.md` | `closure/README.md — 2026-10-08 Lidsone IP Infringement` | ACTIVE — Investigate infringing site, compare logos, identify legal claims (copyright/passing off/EU unfair competition/E-Commerce Directive), produce C&D letter + IP action plan as print-to-PDF HTML files. Evidence: `evidence/legal/lidsone-ip-infringement-2026-10-08.md` |
| 2026-10-07 | `conduit-1-2-stock-price-cards` | discovery/implementation | `prompts/shopify/conduit-1-2-stock-price-cards.md` | `closure/README.md — 2026-10-07 Conduit 1–2 Stock Price Cards Discovery` | ACTIVE — Root causes: (1) product-item.liquid uses product.available (true if any variant available); fix = count available variants. (2) price.liquid "from" check uses target==product but target is always a variant on collection cards; fix = check variant==nil. (3) price__sale div always rendered; fix = wrap outer div in compare_at_price > 0 guard. Files to change: product-item.liquid + price.liquid only. |
| 2026-10-07 | `avasam-uk-stock-update-workflow` | reusable | `prompts/reusable/avasam-uk-stock-update-workflow.md` | `closure/README.md — 2026-10-07 Avasam Stock Update` | ACTIVE — 1,523/1,546 matched (98.5%). Two-batch approach: full DB scan Batch 1 + targeted IN clause Batch 2. stock_map keyed by both sku and sku_original. Output: `evidence/avasam/avasam_stock_2026-10-07.csv` |
| 2026-10-07 | `shopify-bulb-collection-tag-audit` | discovery | `organic-discovery/06_GA-08_bulb_collection_tags/prompts/GA-08-bulb-collection-audit.md` | `closure/README.md — 2026-10-07 GA-08 Bulb Collection Step 1 + Wattage Threshold Discovery` | ACTIVE — Step 1: 5 collection audit (all 53 low-wattage products are pendants; 4 incandescent are LED; 11 dimmable missing from DB; ~6941/~6742 missing E14 tag; ~1045 B22/E27 review). Step 2: Wattage threshold — root cause confirmed: `Spider Pendant` rule. No LEDSone definition. Inferred: ≤4W or ≤5W LED. `vintage-bulbs-4w` is key precedent. Needs Thuwaraga confirmation. |
| 2026-10-06 | `shopify-robots-pagination-discovery` | discovery | `prompts/shopify/ga-02-robots-pagination-discovery.md` | `closure/README.md — 2026-10-06 GA-02 Robots.txt Collection Pagination Discovery` | ACTIVE — PLAN COMPLETE. Remove `Disallow: /*?page=*`, replace with 3 rules: `/*?page=*&*filter*`, `/*?page=*&sort_by*`, `/*?page=*&section_id*`. Impl: `templates/robots.txt.liquid`. Awaiting approval. |
| 2026-10-12 | `dm-dashboard-repeat-customer-ads-exclusion-step2-implementation` | implementation | `prompts/dm-dashboard/repeat-customer-ads-exclusion-step2-implementation.md` | `closure/README.md — 2026-10-12 RC-01 Repeat Customer Step 2` | ACTIVE — Build: `admin_repeat_customer.py` (ScheduledSnapshot, GET/POST/export), `RepeatCustomers.jsx` (threshold selector, KPIs, table, CSV export), main.py wiring, AdminLayout.jsx nav+panel, taskRegistry.js TOOLS entry. Auth: tools.AdminRepeatCustomers. Build-verified. Runtime validation pending. |
| 2026-10-12 | `muguntha-budget-rule-alert-step2-implementation` | implementation | `prompts/dm-dashboard/muguntha-budget-rule-alert-step2-implementation.md` | `closure/README.md — 2026-10-12 MUGA-BRAS Step 2` | COMPLETE — Backend: muguntha_budget_alerts.py (rule engine, schema, 6-hr ScheduledSnapshot, 6 admin endpoints). Frontend: BudgetAlerts.jsx + AdminLayout wired. Tests: 38/38 pass. Safety: no Google Ads writes, all env-var only, admin-auth on all endpoints. |
| 2026-10-14 | `muga-bras-campaign-status-verification-and-filters` | implementation | `prompts/dm-dashboard/muga-bras-campaign-status-verification-and-filters.md` | `closure/README.md — 2026-10-14 MUGA-BRAS Filters` | COMPLETE — `_ACCOUNT_COUNTRY` dict, `_build_campaign_status_map()` helper, `GET /campaign-statuses` endpoint. BudgetAlerts.jsx: country/owner/campaignStatus filters, CampaignStatusBadge, clear/reset, alert count. Tests: 70/70 pass (+15 new). |
| 2026-10-12 | `muguntha-budget-rule-alert-discord-notifications` | implementation | `prompts/dm-dashboard/muguntha-budget-rule-alert-step2-implementation.md` | `closure/README.md — 2026-10-12 MUGA-BRAS Discord` | COMPLETE (code only) — _send_discord(), _discord_alert_text(), notified_discord + notify_discord_error schema columns, independent notification call site. Tests: 55/55 pass. Live Discord delivery not yet verified — requires DISCORD_BOT_TOKEN + MUGUNTHA_DISCORD_CHANNEL_ID in backend/.env and server restart. |
| 2026-10-12 | `muguntha-budget-rule-alert-step1-discovery` | discovery | `prompts/dm-dashboard/muguntha-budget-rule-alert-step1-discovery.md` | `closure/README.md — 2026-10-12 Muguntha Budget Rule Alert Step 1` | ACTIVE — Step 1 discovery: Google Ads data from Postgres (no live API); ROAS = (conversion_value / cost) * 100 in admin_dm_campaign.py; column discrepancy cost vs cost_micros flagged; no Telegram/email integration exists; 7 decisions required from Muguntha before Step 2. Evidence: `evidence/dm-dashboard/muguntha-budget-rule-alert-step1-discovery-2026-10-12.md` |
| 2026-10-06 | `dm-dashboard-repeat-customer-ads-exclusion-step1-discovery` | discovery | `prompts/dm-dashboard/repeat-customer-ads-exclusion-step1-discovery.md` | `closure/README.md — 2026-10-06 RC-01 Repeat Customer Step 1` | ACTIVE — read-only discovery: customer data, order count, Google Ads attribution, Customer Match readiness. Key finding: email null in business DB for Shopify UK; must extend ORDERS_QUERY to add `customer { id email }`. |
| 2026-10-14 | `rc-02-product-data-discovery` | discovery | `prompts/dm-dashboard/rc-02-product-data-discovery.md` | `closure/README.md — 2026-10-14 RC-02 Product Data Discovery` | ACTIVE — RC-02 Step 1 discovery: line-item fields confirmed (product_id, variant_id, SKU, title, qty), variant.title needs adding, product images from listings.shopify_listings.main_image_url, gross-qty convention, single compute pass for all 3 datasets, one new snapshot table. Stage B ready. |
| 2026-10-14 | `rc-02-b1-backend-implementation` | implementation | `prompts/dm-dashboard/rc-02-b1-backend-implementation.md` | `closure/README.md — 2026-10-14 RC-02 B1 Backend` | ACTIVE — Build admin_repeat_customer_products.py: single-pass Shopify UK scan with lineItems, 3 datasets (customer_products, product_summary at T3+T4, products_bought_together at T3+T4), image enrichment from listings.shopify_listings, ScheduledSnapshot scope=admin-repeat-customer-products, 4 endpoints. main.py restored missing router imports post-merge. Tests: 33/33 PASS (6 fixed in B2). Import PASS. Vite build PASS. Runtime B3 pending. |
| 2026-10-14 | `rc-02-b2-frontend-implementation` | implementation | `prompts/dm-dashboard/rc-02-b2-frontend-implementation.md` | `closure/README.md — 2026-10-14 RC-02 B2 Frontend` | ACTIVE — Four-tab RepeatCustomers.jsx: Customers (existing preserved + View Products), Customer Products (Tab 2, per-customer product list), Product Summary (Tab 3, threshold-aware aggregate), Bought Together (Tab 4, co-purchase pairs). Single threshold selector. Lazy load. Refresh Customers + Refresh Products buttons. All 33 B1 tests pass. Vite PASS. Browser test B3 pending. |
| 2026-10-14 | `rc-02-b3-product-summary-drilldown` | implementation | `prompts/dm-dashboard/rc-02-b3-product-drilldown.md` | `closure/README.md — 2026-10-14 RC-02 B3 Product Drill-Down` | ACTIVE — Clickable customer counts in Product Summary tab. New backend: customer_order_counts in snapshot, _get_product_customers() helper, GET /product-summary/{product_id}/customers endpoint. New frontend: ProductCustomerDrillDown panel (inline below table), pagination, View Products link. 49/49 tests PASS. Vite PASS. |
| 2026-10-05 | `electricalsone-fake-judgeme-rating-deploy-verify` | implementation | `electricalsone_urgent_fixes/prompts/deployment_verification.md` | `closure/README.md — 2026-10-05 ElectricalsOne Fake Judge.me Rating Fix` | ACTIVE — deploy updated theme, verify no fake 4.5/10 rating, Google Rich Results Test. Judge.me block `review_data` changed from `sample_data` to `""`. |
| 2026-10-01 | `conduit-sold-history-phase1` | implementation | `prompts/dm-dashboard/conduit-sold-history-phase1.md` | `closure/README.md — 2026-10-01 Conduit Sold Phase 1` | ACTIVE — 2 files created, 2 modified. Admin page: /api/admin/conduit-sold, 4 collections, Apr-Sep 2026 via Shopify UK API. |
| 2026-10-02 | `conduit-sold-phase2-stock-alert` | discovery | `prompts/dm-dashboard/conduit-sold-phase2-stock-alert.md` | `closure/README.md — 2026-10-02 Conduit Sold Phase 2A Gap Verification` | ALL 4 GAPS RESOLVED. PCBSF in PG mirror. Join path confirmed. 288 unique conduit SKUs. Alt-warehouse via product_mapping.alternative_inventory_id. Phase 2 implementation may begin. |
| 2026-10-02 | `conduit-sold-phase2b-backend` | implementation | `prompts/dm-dashboard/conduit-sold-phase2b-backend.md` | `closure/README.md — 2026-10-02 Conduit Sold Phase 2B Backend` | BACKEND COMPLETE. New file admin_conduit_stock.py. 3 PostgreSQL queries, no Shopify API. 288 SKUs, 4 types, 5-min cache. All 8 validation checks PASS. READY FOR FRONTEND DESIGN. |
| 2026-10-02 | `conduit-sold-phase2c-frontend` | implementation | `prompts/dm-dashboard/conduit-sold-phase2c-frontend.md` | `closure/README.md — 2026-10-02 Conduit Sold Phase 2C Frontend` | FRONTEND WRITTEN. Component Stock 5th tab added to ConduitSold.jsx. Summary cards, combinable filters, SKU table, expandable component rows with BOTTLENECK badge. Browser test pending. |
| 2026-10-02 | `listing-issues-pdf-export-with-images` | implementation | `prompts/dm-dashboard/listing-issues-pdf-export-with-images.md` | `evidence/dm-dashboard/listing-issues-pdf-enhancement-2026-10-02.md` | COMPLETE. _img_to_data_url() embeds images as base64 data URLs. Reported By blue banner at PDF top. Merged main commit 2f6b29f — server pull required to deploy. |
| 2026-09-30 | `ledsone-us-catalogue-debug-fix` | implementation | `prompts/shopify/ledsone-us-catalogue-debug-fix.md` | `closure/README.md — 2026-09-30 LEDSone US Phase 4 Debug` | ACTIVE — 3 root causes fixed: ?view=catalogue missing (404), DOM attr lost after renderSectionFilter replaces section (filter break), CSS not preloaded (unstyled inject). |
| 2026-09-30 | `ledsone-us-phase3-catalogue-template` | implementation | `prompts/shopify/ledsone-us-phase3-catalogue-template.md` | `closure/README.md — 2026-09-30 LEDSone US Phase 3` | ACTIVE — template created: `shopify_projects/ledsone us/templates/collection.catalogue.json`. 7 sections, filter_by_dynamic active, no hardcoded data. |
| 2026-09-30 | `ledsone-us-phase2b-shopify-change-plan` | discovery | `prompts/shopify/ledsone-us-phase2b-shopify-change-plan.md` | `closure/README.md — 2026-09-30 LEDSone US Phase 2B` | ACTIVE — change plan complete: ~165 products across Sections A–E. Report: `reports/ledsone-us-phase2b-shopify-change-plan-2026-09-30.md` |
| 2026-09-30 | `germany-report7-wlg-date-filter` | implementation | `prompts/implementation/germany-report7-wlg-date-filter.md` | `closure/README.md — 2026-09-30` | ACTIVE |
| 2026-06-09 | `shopify-section-code-review` | discovery | `prompts/discovery/shopify-liquid-section-code-review.md` | `closure/sessions/2026-06-09.md` | ACTIVE |
| 2026-06-09 | `shopify-css-render-block-fix` | implementation | `prompts/implementation/shopify-css-render-blocking-fix.md` | `closure/sessions/2026-06-09.md` | ACTIVE |
| 2026-06-12 | `coupon-card-row-widget` | implementation | PENDING | `closure/sessions/2026-06-12.md` | PENDING |
| 2026-06-12 | `faq-schema-duplicate-fix` | implementation | PENDING | `closure/sessions/2026-06-12.md` | PENDING |
| 2026-06-15 | `shopify-seo-13-strategy-audit` | discovery | `prompts/discovery/shopify-seo-strategy-audit.md` | `closure/sessions/2026-06-15.md` | ACTIVE |
| 2026-06-16 | `shopify-breadcrumb-collection-audit` | discovery | PENDING | `closure/sessions/2026-06-16.md` | PENDING |
| 2026-09-07 | `seo-keyword-gap-semrush-neon-weekly` | implementation | `prompts/implementation/seo-keyword-gap-semrush-neon-weekly.md` | `closure/sessions/2026-09-07-seo-keyword-gap.md` | ACTIVE — updated 2026-09-21 with egress workaround note |
| 2026-09-09 | `sajeepan-r3-gap-repair` | implementation | `prompts/sajeepan/r3-gap-repair-prompt.md` | `closure/README.md — 2026-09-09 Sajeepan R3` | ACTIVE |
| 2026-09-10 | `ai-brief-full-extension-pattern` | implementation | `prompts/implementation/ai-brief-full-extension-pattern.md` | `closure/README.md — 2026-09-10 Kamsi Pipeline Parity` | ACTIVE |
| 2026-09-14 | `seo-skills-tab-build-prompt` | implementation | `prompts/implementation/seo-skills-tab-build-prompt.md` | `closure/README.md — 2026-09-14 SEO Skills Tab` | ACTIVE |
| 2026-09-15 | `unified-daily-task-hub-pattern` | implementation | `prompts/implementation/unified-daily-task-hub-pattern.md` | `closure/README.md — 2026-09-15 Unified Task Hub` | ACTIVE |
| 2026-09-24 | `shopify-sku-product-id-mapping` | implementation | `prompts/implementation/shopify-sku-product-id-mapping.md` | `closure/README.md — 2026-09-24 Sajee Product ID Mapping` | ACTIVE |
| 2026-09-21 | `semrush-backlinks-neon-upsert` | implementation | `prompts/implementation/semrush-backlinks-neon-upsert.md` | `closure/README.md — 2026-09-21 SEO Backlinks Agent` | ACTIVE |
| 2026-09-17 | `sales2026-uk-admin-discovery` | discovery | `prompts/implementation/sales2026-uk-admin-discovery.md` | `closure/README.md — 2026-09-17` | ACTIVE |
| 2026-09-17 | `sales2026-uk-grand-total-page` | implementation | `prompts/implementation/sales2026-uk-grand-total-page.md` | `closure/README.md — 2026-09-17` | ACTIVE |
| 2026-09-17 | `sales2026-total-tab-uk-de-fr` | implementation | `prompts/implementation/sales2026-total-tab-uk-de.md` | `closure/README.md — 2026-09-17` | ACTIVE |
| 2026-09-16 | `thivajini-req1-dynamic-campaign` | implementation | `prompts/Thivajini/req1-dynamic-campaign-system-prompt.md` | `closure/README.md — 2026-09-16 Thivajini Req1` | ACTIVE |
| 2026-09-16 | `sajeepan-title-optimization-audit` | discovery | `prompts/sajeepan/title-optimization-feasibility-audit-prompt.md` | `closure/README.md — 2026-09-16 Sajeepan Audit` | ACTIVE |
| 2026-09-21 | `shopify-uk-nonsale-instock-listing-fetch` | implementation | `prompts/implementation/shopify-uk-nonsale-instock-listing-fetch.md` | `closure/README.md — 2026-09-21` | ACTIVE |
| 2026-09-21 | `shopify-uk-dormant-listing-fetch` | implementation | `prompts/implementation/shopify-uk-dormant-listing-fetch.md` | `closure/README.md — 2026-09-21` | ACTIVE |
| 2026-09-22 | `sales2026-uk-shopify-actuals-tab` | implementation | `prompts/implementation/sales2026-uk-shopify-actuals-tab.md` | `closure/README.md — 2026-09-22` | ACTIVE |
| 2026-09-22 | `mahima-r2-removal-ai-brief-scope-fix` | implementation | `prompts/mahima/r2-removal-ai-brief-scope-fix.md` | `closure/README.md — 2026-09-22` | ACTIVE |
| 2026-09-23 | `dm-campaign-filter-dropdown-pattern` | implementation | `prompts/piranav/dm-campaign-filter-dropdown-pattern.md` | `closure/README.md — 2026-09-23` | ACTIVE |
| 2026-09-16 | `ux-fix-tracker-action-list-pattern` | implementation | `prompts/hetheesha/ux-fix-tracker-action-list-pattern.md` | `closure/README.md — 2026-09-16 Hetheesha UX Overhaul` | ACTIVE |
| 2026-09-18 | `sajeepan-r4-feed-optimization-advanced-filters` | implementation | `prompts/sajeepan/r4-feed-optimization-advanced-filters.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-24 | `shopify-customer-google-signin` | implementation | `prompts/implementation/shopify-customer-google-signin.md` | `closure/README.md — 2026-09-24 Homingmbh Google Sign-In` | ACTIVE |
| 2026-09-24 | `client-gsc-sop-aios-update` | documentation | `prompts/documentation/homingmbh-gsc-sop-aios-update.md` | `closure/README.md — 2026-09-24 Homingmbh GSC SOP` | ACTIVE |
| 2026-09-18 | `sukirtha-r6-oos-draft-exclusion` | implementation | `prompts/sukirtha/r6-oos-draft-exclusion.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-18 | `sukirtha-ai-brief-variety-cap` | implementation | `prompts/sukirtha/ai-brief-variety-cap.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-16 | `ai-brief-multi-requirement-data-pattern` | implementation | `prompts/hetheesha/ai-brief-multi-requirement-data-pattern.md` | `closure/README.md — 2026-09-16 Hetheesha UX Overhaul` | ACTIVE |
| 2026-09-08 | `sajeepan-system-workflow-gpt-brief` | reference | `prompts/sajeepan-system-workflow-gpt-brief.md` | N/A | ACTIVE — paste into GPT to brief it on Sajeepan's full system before any review or build task |
| 2026-09-25 | `sajeepan-nonsale-product-scope-discovery` | discovery | `prompts/sajeepan/nonsale-product-scope-discovery.md` | `closure/README.md — 2026-09-25 Level 4C Design` | ACTIVE |
| 2026-09-25 | `ads-product-scope-system-page-design` | implementation | `prompts/sajeepan/ads-product-scope-system-page-design.md` | `closure/README.md — 2026-09-25 Level 4C Design` | ACTIVE |
| 2026-09-25 | `sajeepan-ads-scope-level6a-lifetime-scope` | implementation | `prompts/dm-dashboard/sajeepan-ads-scope-level6a-lifetime-scope.md` | `evidence/sajeepan/sajeepan-ads-scope-level6a-lifetime-verification-2026-09-25.md` | ACTIVE |
| 2026-09-18 | `done-task-exclusion-window-fix` | implementation | `prompts/implementation/done-task-exclusion-window-fix.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-18 | `sajeepan-r3-oos-filter-pagination-fix` | implementation | `prompts/sajeepan/r3-oos-filter-pagination-fix.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-25 | `sajeepan-nonsale-product-scope-discovery` | discovery | `prompts/sajeepan/nonsale-product-scope-discovery.md` | `evidence/sajeepan/sajeepan-nonsale-product-scope-discovery-2026-09-25.md` | ACTIVE — discovery complete: 2,118 Ads products, 716 non-sale, 1,402 sale. Signal: shopify_listings.compare_price |
| 2026-09-18 | `gsc-live-sync-build` | implementation | `prompts/implementation/gsc-live-sync-build.md` | `closure/README.md — 2026-09-18` | ACTIVE |
| 2026-09-21 | `semrush-organic-snapshot-neon-daily` | implementation | `prompts/implementation/semrush-organic-snapshot-neon-daily.md` | `closure/README.md — 2026-09-21 SEMrush Snapshot` | ACTIVE |
| 2026-09-28 | `energy-label-modal-responsive-fix` | implementation | `prompts/shopify/energy-label-modal-responsive-fix.md` | `closure/README.md — 2026-09-28 ledsone_de Energy Label` | ACTIVE |
| 2026-06-16 | `shopify-lighthouse-accessibility-fix` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-16.md` | ACTIVE |
| 2026-06-17 | `lighthouse-menu-banner-link-discernible-text-fix` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-17.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-17 | `inp-eval-in-scroll-path` | discovery | PENDING | `closure/sessions/2026-06-17.md` | PENDING |
| 2026-06-17 | `inp-render-blocking-head-script` | implementation | PENDING | `closure/sessions/2026-06-17.md` | PENDING |
| 2026-06-18 | `promo-banner-config-add-collection` | implementation | `prompts/implementation/shopify-promo-banner-config-add.md` | `closure/sessions/2026-06-18.md` | ACTIVE |
| 2026-09-21 | `semrush-organic-pages-upsert` | implementation | `prompts/implementation/semrush-organic-pages-upsert.md` | `closure/README.md — 2026-09-21 SEO Organic Pages Scheduled` | ACTIVE |
| 2026-06-18 | `shopify-cli-theme-workflow` | implementation | `prompts/shopify-cli-theme-workflow.md` | `closure/sessions/2026-06-18.md` | ACTIVE — procedural guide; needs template format upgrade |
| 2026-06-19 | `shopify-layout-audit-three-page` | discovery | `prompts/discovery/shopify-layout-audit-three-page.md` | `closure/sessions/2026-06-19.md` | ACTIVE |
| 2026-06-22 | `shopify-mcp-token-expiry-fix` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `theme-block-verification-audit` | validation | `prompts/validation/shopify-section-post-fix-verification.md` | `closure/sessions/2026-06-22.md` | ACTIVE |
| 2026-06-22 | `ai-block-remediation-standard` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `search-grid-2026-audit` | discovery | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-22 | `srp-grid-2026` | implementation | PENDING | `closure/sessions/2026-06-22.md` | PENDING |
| 2026-06-23 | `liquid-aria-label-strip-guard` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-23.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-23 | `visually-hidden-link-context-span` | implementation | `prompts/implementation/shopify-lighthouse-accessibility-fix.md` | `closure/sessions/2026-06-23.md` | ACTIVE — covered by lighthouse-accessibility-fix template |
| 2026-06-23 | `shopify-search-intent-upgrade-audit` | discovery | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-23 | `shopify-intent-layer-standalone-js` | implementation | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-23 | `shopify-standalone-intent-advisor-widget` | implementation | PENDING | `closure/sessions/2026-06-23.md` | PENDING |
| 2026-06-24 | `predictive-search-availability-filter-fix` | implementation | `prompts/implementation/shopify-predictive-search-field-fix.md` | `closure/sessions/2026-06-24.md` | ACTIVE |
| 2026-06-24 | `ledsone-404-light-premium-2026` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `gmc-sales-channel-exclusion-fix` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `search-form-comment-block-recovery` | implementation | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-06-24 | `shopify-product-id-audit` | discovery | PENDING | `closure/sessions/2026-06-24.md` | PENDING |
| 2026-07-01 | `daily-session-closure` | closure | `prompts/closure/daily-session-closure.md` | _(formalised from START_HERE.md protocol)_ | ACTIVE |
| 2026-07-01 | `capability-log-extraction` | closure | `prompts/closure/capability-log-extraction.md` | _(formalised from session CAPABILITY LOG practice)_ | ACTIVE |
| 2026-07-01 | `gpt-prompt-capture-rule` | closure | `prompts/GPT_CAPTURE_RULE.md` | _(standing rule — Piranav instruction 2026-07-01)_ | PERMANENT RULE |
| 2026-07-01 | `shopify-pdp-gallery-nav-add` | implementation | `prompts/implementation/shopify-pdp-gallery-nav-add.md` | `evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md` | ACTIVE |
| 2026-07-01 | `shopify-pdp-gallery-nav-fix` | implementation | `prompts/implementation/shopify-pdp-gallery-nav-fix.md` | `evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md` | ACTIVE |
| 2026-07-01 | `aios-closure-evidence-template` | documentation | `prompts/documentation/aios-closure-evidence-template.md` | _(standing template — applies to all future closure tasks)_ | ACTIVE |
| 2026-09-23 | `aios-reference-folder-import` | documentation | `prompts/documentation/aios-reference-folder-import.md` | `closure/README.md` — 2026-09-23 GSC import session | ACTIVE |
| 2026-09-30 | `ledsone-us-theme-discovery` | discovery | `prompts/shopify/ledsone-us-theme-discovery.md` | `evidence/shopify/ledsone-us/2026-09-30-catalogue-discovery.md` | ACTIVE |
| 2026-09-30 | `ledsone-us-product-variant-data-discovery` | discovery | `prompts/shopify/ledsone-us-product-variant-data-discovery.md` | `evidence/shopify/ledsone-us/2026-09-30-catalogue-discovery.md` | ACTIVE |
| 2026-09-30 | `ledsone-us-phase2a-normalization-discovery` | discovery | `prompts/shopify/ledsone-us-phase2a-normalization-discovery.md` | `reports/ledsone-us-phase2a-normalization-mapping-2026-09-30.md` | ACTIVE |
| 2026-10-05 | `pi-01-stock-hiding-investigation` | discovery | `prompts/piranav/pi-01-stock-hiding-investigation.md` | `evidence/piranav/pi-01-stock-hiding-proposal-2026-10-05.md` | ACTIVE |
| 2026-10-12 | `ledsone-uk-shopify-parent-id-lookup-via-db` | shopify | `prompts/shopify/ledsone-uk-shopify-parent-id-lookup-via-db.md` | `evidence/shopify/ledsone-uk-neversold-shopify-id-lookup-2026-10-12.md` | ACTIVE |

---

## Summary

| Category | Total Patterns | Templates Created | Pending Templates |
|---|---|---|---|
| discovery | 8 | 3 | 5 |
| implementation | 17 | 5 | 12 |
| validation | 1 | 1 | 0 |
| documentation | 0 | 0 | 0 |
| closure | 2 | 2 | 0 |
| reusable | 0 | 0 | 0 |
| standing rules | 1 | 1 | 0 |
| **TOTAL** | **29** | **12** | **17** |

---

## Duplicate Risk Assessment

| Risk | Patterns Affected | Status |
|---|---|---|
| `lighthouse-menu-banner-link-discernible-text-fix`, `liquid-aria-label-strip-guard`, and `visually-hidden-link-context-span` are all variants of the same parent pattern | 3 patterns → 1 template | RESOLVED — all 3 map to `shopify-lighthouse-accessibility-fix.md` |
| `shopify-cli-theme-workflow` exists as a procedural guide in `prompts/` root — not in `implementation/` subfolder | 1 file | LOW RISK — no duplicate content; location inconsistency only |
| No two templates cover the same task type | — | CLEAN |

---

## Next Session Action

Priority order for creating PENDING templates:

| Priority | Pattern Name | Why |
|---|---|---|
| HIGH | `shopify-breadcrumb-collection-audit` | Breadcrumb bugs are a recurring issue across LEDSone and Electricalsone |
| HIGH | `search-grid-2026-audit` | Search grid audit pattern applies to both stores |
| HIGH | `ai-block-remediation-standard` | AI-generated blocks are increasingly common — needs a standard |
| MEDIUM | `inp-eval-in-scroll-path` | INP is a Core Web Vital — high business impact |
| MEDIUM | `shopify-mcp-token-expiry-fix` | MCP token expiry disrupts sessions regularly |
| MEDIUM | `shopify-search-intent-upgrade-audit` | Large design project — needs a reusable audit phase |
| LOW | `coupon-card-row-widget` | Store-specific but reusable across LEDSone group |
| LOW | `gmc-sales-channel-exclusion-fix` | Quick fix; low complexity |
| LOW | `search-form-comment-block-recovery` | Edge case; low recurrence risk |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Assigned Staff | piranav |
| Coordinator / Reviewer | Piranav |
| Last Updated | 2026-07-01 |

---

## Status

ACTIVE — first version created 2026-07-01. Recovered from 10 sessions (2026-06-09 to 2026-06-24). 29 patterns registered, 12 templates created, 17 pending. GPT Capture Rule in force from 2026-07-01 — all future prompts must be registered here before execution.

| 2026-10-15 | `promotion-automation-phase1e-data-investigation` | discovery | `prompts/dm-dashboard/promotion-automation-phase1e-data-investigation.md` | PROMO-01-E (closure 2026-10-15) | ACTIVE |
| 2026-10-15 | `promotion-automation-phase2a-foundation` | implementation | `prompts/dm-dashboard/promotion-automation-phase2a-foundation.md` | PROMO-02-A (closure 2026-10-15) | ACTIVE |

| STEP-1-AUDIT | Promotion Automation Step 1 — Full system audit against 48 policy requirements | `prompts/dm-dashboard/promotion-automation-step1-audit.md` | 2026-10-15 |
