# Conduit Accessories Website Build — Task Tracker

**Source document:** `01_source-tasks/Piranav_conduit_accessories_2026-10-01_v2.txt`
**Last updated:** 2026-10-05

---

## Approval Rules (from source doc v2)

| Work type | Approver |
|---|---|
| All site-wide website work (theme, collections, filters, structured data, stock message, pages) | **Muguntha** |
| Product facts and text inside templates (intro facts, specs, FAQ answers) | **Arudchelvi** (portfolio holder for Conduit Lighting) |
| Technical values (measurements, specs) | **Thurgesan** (verifies values Arudchelvi writes) |

**Standing rule:** Work on duplicate theme first. Send screenshots to Muguntha. Publish only after his OK.

---

## Step 1 — Duplicate Live Theme

| Field | Value |
|---|---|
| Deadline | 1 October 2026 (today) |
| Status | **DONE — confirmed 2026-10-02** |
| Evidence | `09_evidence/step-01-theme/step-01-theme-evidence.md` |
| Screenshot | `09_evidence/step-01-theme/photo_2026-10-02_14-45-39.jpg` |
| Confirmed | Draft theme "Conduit build 2026-10" in Shopify. Live theme unchanged. |
| How to check | All subsequent steps done on "Conduit build 2026-10" only |

---

## Step 2 — Variants Showing Sold Out When Stock Exists

| Field | Value |
|---|---|
| Deadline | Monday 5 October 2026 |
| Status | **DONE — investigation complete, proposal sent to Muguntha** |
| Evidence | `09_evidence/step-02-stock-investigation/PI-01.docx` |
| Working folder | `03_step-02-stock-investigation/` |

**What to do:**
- Several variants with ≤3 units in UK stock show as unavailable online
- Example SKUs: terminal box 2-way `PCGZ20MO` (3 units in location table, 88 in warehouse table), 3-way `PCGZ20MY`
- Same pattern on lamp holders and IP68 boxes
- Rows last updated ~4 May 2026 — stale feed may be the real cause, not a buffer rule
- **Find:** the rule or app setting hiding them (inventory sync buffer, safety stock, or app)
- **Write a proposal** and send to Muguntha — do NOT change the rule until he decides
- **Also tell Arudchelvi** — same buffer may hide stock on eBay and Amazon

**How to check:** After Muguntha's decision, a variant with 1–3 units can be added to basket.

---

## Step 3 — Collection Page Structure for Conduit Accessories

| Field | Value |
|---|---|
| Deadline | Friday 16 October 2026 |
| Status | Not started |
| Working folder | `04_step-03-collection-structure/` |
| Evidence | `09_evidence/step-03-collection-structure/` |
| Approver | Muguntha (structure); Arudchelvi (product placement) |

**What to build:**
- SEO title, meta description, H1, intro text, six-tile "Which fitting do I need" block, FAQs
- Reference: ask for collection page structure file if not received
- **7 sub-collections to create:**
  1. 20mm Conduit Fittings
  2. 20mm Conduit Boxes and Lids
  3. 16mm Lamp Pipe and Fittings
  4. 3/4 inch BSP Pipe Fittings
  5. M10 Lamp Threads and Reducers
  6. Conduit Lamp Holders and Roses
  7. Conduit Switches
- Keep each sub-collection to **one page** (robots.txt blocks page 2+)
- Add filters: System, Thread, Finish, Pack size, In stock — via product metafields

**How to check:** Each sub-collection shows all products on one page; six tiles link correctly.

---

## Step 4 — Link the Guides

| Field | Value |
|---|---|
| Deadline | Friday 9 October 2026 |
| Status | **In progress — URLs pending** |
| Working folder | `05_step-04-guides/` |
| Working doc | `05_step-04-guides/step-04-guides-working-doc.md` |
| Evidence | `09_evidence/step-04-guides/` |
| Approval | `10_approvals/step-04-guides/approval-status.md` |

**What to do:**
- Add a guides block on **Conduit Accessories** and **Conduit Lighting** collections
- Link to 5 articles (exact URLs from the blog — do NOT invent):
  1. The Ultimate Guide to Full 20mm Conduit Lighting Systems
  2. How to build your own conduit pipe wall light
  3. What Is Conduit Lighting?
  4. Industrial Pipe Lighting UK Conduit Light Kits Buying Guide
  5. Multi-Outlet Ceiling Roses

**How to check:** Each link opens the correct article.

---

## Step 5 — Structured Data

| Field | Value |
|---|---|
| Deadline | Friday 16 October 2026 |
| Status | Not started |
| Working folder | `06_step-05-structured-data/` |
| Evidence | `09_evidence/step-05-structured-data/` |
| Approver | Muguntha (template); Arudchelvi (values) |

**What to build:**
- **Collection pages:** CollectionPage, ItemList, BreadcrumbList, FAQPage — use jsonld folder files. Build ItemList from Liquid, not hard-coded.
- **Product pages:** Add aggregateRating from Judge.me (e.g. M20 to M10 reducer has 17 reviews but no rating in structured data). Add specs table fields as additionalProperty (see `product_template_example_5561.json`). Breadcrumb to follow sub-collection path: Home > Conduit Accessories > 20mm Conduit Fittings > product (not Home > ALL PRODUCTS > product).
- Only mark up questions visible on the page.

**How to check:** Google Rich Results Test passes for 1 collection + 3 product pages. Save screenshots for Muguntha.

---

## Step 6 — Stock Message

| Field | Value |
|---|---|
| Deadline | Friday 16 October 2026 (after Muguntha decides on Step 2) |
| Status | Not started — blocked on Muguntha's Step 2 decision |
| Working folder | `07_step-06-stock-message/` |
| Evidence | `09_evidence/step-06-stock-message/` |

**What to build:**
- ≤10 units: show exact number — e.g. "Only 4 left"
- >10 units: show "In stock"

**How to check:** A product with low stock shows the number on the duplicate theme.

---

## Step 7 — Compatibility Chart Page

| Field | Value |
|---|---|
| Start | Monday 19 October 2026 (after Thurgesan's measurements) |
| Status | Not started — waiting on Thurgesan's data |
| Working folder | `08_step-07-compatibility-chart/` |
| Evidence | `09_evidence/step-07-compatibility-chart/` |
| Approver | Muguntha (page); Arudchelvi (product facts); Thurgesan (data) |

**What to build:**
- New page: "Conduit Fittings Compatibility Chart"
- Table: 4 systems (20mm conduit, 16mm lamp pipe, 3/4 inch BSP, M10 lamp thread) vs components
- Columns: thread, pitch, outside diameter, inside diameter, what connects to what, adaptors between systems
- Real HTML table — mobile-friendly + printable PDF link
- Link from every conduit listing and both collections

**How to check:** Table reads on phone; every component listing links to it.

---

## Step 8 — Send to Muguntha

| Field | Value |
|---|---|
| When | After each step is complete on duplicate theme |
| Status | Ongoing — per step |
| Rule | Send screenshots of each step. Publish ONLY after Muguntha's OK. AI re-checks live pages afterwards. |

---

## Due Date Summary

| Date | Step |
|---|---|
| 1 Oct 2026 | Step 1 — Duplicate theme ✓ DONE |
| 5 Oct 2026 (Mon) | Step 2 — Stock investigation finding + proposal to Muguntha |
| 9 Oct 2026 (Fri) | Step 4 — Guides linked |
| 16 Oct 2026 (Fri) | Steps 3, 5, 6 |
| 19 Oct 2026 (Mon) | Step 7 begins (after Thurgesan's data) |

_Dates are suggested — Muguntha can change them._
