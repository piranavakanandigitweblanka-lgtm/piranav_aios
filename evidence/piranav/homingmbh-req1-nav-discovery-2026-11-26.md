# Evidence: Homingmbh Shopify — REQ-1 Navigation Restructure Discovery (Full)
**Task ID:** HOMING-2026-11-26-005
**Requirement ID:** REQ-1
**Date:** 2026-11-26 (updated after document extraction)
**Store:** homingmbh.de (Homingmbh, Germany, EUR, Basic plan)
**Phase:** Discovery — read-only. No changes made.
**Recorded by:** Claude Code

---

## Source Documents

| # | Document | Location | Sheets / Sections Used |
|---|---|---|---|
| 1 | Homin GmbH (homingmbh.de) – Website Change Requirements.docx | `C:\Users\PC\Downloads\` | Full document — Section 3 REQ-1, REQ-2 through REQ-7, Acceptance Criteria |
| 2 | LEDSone DE Website Changes.xlsx | `C:\Users\PC\Downloads\` | Navigation (sheet1), Copy of Navigation (sheet2), Footer (sheet3) |

---

## 1. Document Overview

**Word document** — authored by Jefri (Germany Ads team), 26 Nov 2026. Audience: Tech/Development team.
- Reference site: ledsone.de
- Target site: homingmbh.de
- Platform: Shopify (both)
- Objective: Align Homin storefront with ledsone.de — navigation, homepage, reviews, product page changes.
- REQ-1 source cited: "LEDSone DE Website Changes – Navigation (PDF, 3 pages)" — referring to the Excel workbook provided.

**Excel workbook** — 3 sheets:
- **Navigation** — English-language full navigation specification with filter markers
- **Copy of Navigation** — partial German translation (Transformer + Wall Light fully translated; others incomplete)
- **Footer** — FAQ shipping content + review removal instruction

---

## 2. Combined Navigation Requirements — All 9 Categories

Structure: Mega menu (desktop) · Nested accordion (mobile) · All front-end labels must be German.

### Category 1 — Transformer (Transformatoren)

**Sub-group A — Normal Transformers:**

| Voltage Tier | Type Sub-items | Filter Values |
|---|---|---|
| 5V Transformers | Slim Transformer | — |
| 5V Transformers | Mini Transformers | — |
| 5V Transformers | Blue & Orange Case Transformers | — |
| 5V Transformers | Blue & White Case Transformers | 240W, 180W (Filter) |
| 5V Transformers | Black & White Case Transformers | 300W, 400W, 600W (Filter) |
| 12V Transformers | (same 5 types) | same filters |
| 24V Transformers | (same 5 types) | same filters |

**Sub-group B — IP67 Waterproof Transformer:**
- 12V Transformers
- 24V Transformers

**Filter rule (from acceptance criteria):** Blue & White Case → wattage filter values 240, 180. Black & White Case → wattage filter values 300, 400, 600. These are Shopify Search & Discovery filters, NOT separate collection pages.

### Category 2 — Wall Light (Wandleuchten)

| English Sub-item | German (from Copy of Navigation) |
|---|---|
| Hemp Rope Wall Light | Wandleuchte Hanfseil |
| Glass Wall Light | Glas Wandleuchte |
| Metal Wall Light | Wandleuchte Metall |
| Swan Neck Wall Light | Wandleuchte Schwanenhals |
| Outdoor Wall Light | Außenwandleuchte |
| Wooden Wall Light | Wandleuchte Holz |
| Cage Wall Light | Käfig Wandleuchte |

### Category 3 — Lamp Shade (Lampenschirme)

| English Sub-item | German |
|---|---|
| Metal Lampshade | **NOT TRANSLATED** — needs Jefri |
| Glass Lampshade | **NOT TRANSLATED** |
| Cage Lampshade | **NOT TRANSLATED** |
| Wirecage Lampshade | **NOT TRANSLATED** |

**Note:** Word doc lists as "Metal · Glass · Cage · Wirecage Lampshade" — Excel gives full names "Metal Lampshade" / "Glass Lampshade" etc. Excel is the more detailed source.

### Category 4 — Hemp Rope Light (Hanfseil-Beleuchtung)

| English Sub-item | German | Notes |
|---|---|---|
| Hemp Rope Wall Light | **NOT TRANSLATED** | Needs Jefri |
| Hemp Rope Pendant Light | **NOT TRANSLATED** | Needs Jefri |
| Hemp Rope Spider Light | **NOT TRANSLATED** | Needs Jefri |
| Outdoor Lighting | **NOT TRANSLATED** | Noted in F32 as a note/tag, not a separate menu item — confirm with Jefri |

**Note on "Outdoor Lighting" in F32:** This appears as a note in column F (same column used for "Filter" markers) in the Hemp Rope Light section. It may mean hemp rope products also include outdoor items, or it may be an annotation. NOT treated as a formal sub-category until Piranav/Jefri confirms.

### Category 5 — Bulbs (Leuchtmittel)

| Bulb Type | Sub-items | Filter |
|---|---|---|
| E27 Bulb | Normal Bulb | Filter (D34 marker) |
| E27 Bulb | Decorative Bulb (source typo: "Decrative Bulb") | — |
| E27 Bulb | Christmas Bulb | — |
| E27 Bulb | Design Bulb | — |
| B22 Bulb | (no sub-items in source) | — |
| E14 Bulb | (no sub-items in source) | — |
| G9 Bulb | (no sub-items in source) | — |

**German translations:** None — all bulb types and sub-items are untranslated in Copy of Navigation sheet. Word doc uses English only. All need Jefri confirmation.

**Note on "Filter" marker (D34):** E27 Normal Bulb has "Filter" in column D (same position as transformer type column). This may mean Normal Bulb is a filter value, not a separate collection. Ambiguous — needs clarification from Jefri.

**Source typo preserved:** "Decrative Bulb" (not "Decorative") — appears identically in both Navigation and Copy of Navigation sheets. Do not auto-correct; flag for Jefri.

### Category 6 — Connector

| English Sub-item | German |
|---|---|
| Cable Connector (Multi Colour) | **NOT TRANSLATED** |
| Cable Connector (White & Orange) | **NOT TRANSLATED** |
| Cable Connector (Waterproof) | **NOT TRANSLATED** |
| Cable Connector (Grey & Orange) | **NOT TRANSLATED** |

**No German label** in either sheet for the category header "Connector" — Word doc also uses English only. Full translation needed from Jefri.

### Category 7 — Lamp Holder

| English Sub-item | German |
|---|---|
| Metal Holder | **NOT TRANSLATED** |
| Ceramic Holder | **NOT TRANSLATED** |

**No German label** for "Lamp Holder" category header in either document. Likely maps to existing German productType "Lampenfassungen" — but NOT confirmed in source docs.

### Category 8 — Pipe Light (Rohrleuchten)

| English Sub-item | German |
|---|---|
| Wall Light | **NOT TRANSLATED** |
| Pendant Light | **NOT TRANSLATED** |
| Table Lamp | **NOT TRANSLATED** |

**Category header:** "Pipe Light (Rohrleuchten)" — German name in parentheses in both documents. Sub-item translations missing. Needs Jefri.

### Category 9 — Cable (Kabel)

| English Sub-item | German |
|---|---|
| 2Core Twisted Cable | **NOT TRANSLATED** |
| 2Core Round Cable | **NOT TRANSLATED** |
| 3Core Twisted Cable | **NOT TRANSLATED** |
| 3Core Round Cable | **NOT TRANSLATED** |

**Category header:** "Cable (Kabel)" — German in parens. Sub-item translations missing. Needs Jefri.

---

## 3. German Translation Gap Analysis

### Fully Translated (ready for implementation):
| Category | Sub-items translated |
|---|---|
| 1. Transformer (Transformatoren) | ✅ All — 5V/12V/24V Transformatoren, Schlank/Mini/Blaues orangefarbenes/Blau weißes/Schwarz Weiß Etui Transformatoren |
| 2. Wall Light (Wandleuchten) | ✅ All — Wandleuchte Hanfseil, Glas Wandleuchte, Wandleuchte Metall, Wandleuchte Schwanenhals, Außenwandleuchte, Wandleuchte Holz, Käfig Wandleuchte |

**Note on Cat 1 IP67:** "IP67 Waterproof Transformer" header remains in English in Copy of Navigation sheet — the voltage sub-items (12V/24V Transformatoren) are translated but the section header is NOT.

### Partially Translated (header only):
| Category | Status |
|---|---|
| 3. Lamp Shade (Lampenschirme) | Header = Lampenschirme ✅. All 4 sub-items still English. |
| 4. Hemp Rope Light (Hanfseil-Beleuchtung) | Header = Hanfseil-Beleuchtung ✅. All sub-items still English. |
| 5. Bulbs (Leuchtmittel) | Header = Leuchtmittel ✅. All E27/B22/E14/G9 and sub-types still English. |
| 8. Pipe Light (Rohrleuchten) | Header = Rohrleuchten ✅. Sub-items Wall Light/Pendant Light/Table Lamp still English. |
| 9. Cable (Kabel) | Header = Kabel ✅. All 4 cable types still English. |

### No Translation at All:
| Category | Status |
|---|---|
| 6. Connector | No German label in either document — full translation needed. |
| 7. Lamp Holder | No German label in either document — full translation needed. Existing collection is "Lampenfassungen" but this is NOT confirmed in source docs. |

**Total items needing Jefri translation confirmation before launch:** 23 sub-items + 2 category headers (Connector, Lamp Holder).

---

## 4. Filter Specification

Filters are implemented via **Shopify Search & Discovery** (not separate pages or collections).

| Category | Sub-item | Filter Type | Filter Values |
|---|---|---|---|
| 1. Transformer | Blue & White Case Transformers | Wattage | 240W, 180W |
| 1. Transformer | Black & White Case Transformers | Wattage | 300W, 400W, 600W |
| 5. Bulbs | E27 Normal Bulb | Marked "Filter" in source | Filter type/values not specified — needs clarification |

**Note:** The "Filter" marker for E27 Normal Bulb (D34) is in the same column as transformer type labels — it may be a structural marker meaning this bulb type is filterable, not that specific filter values are defined. Needs Jefri clarification.

---

## 5. Footer Requirements (from LEDSone DE Website Changes.xlsx — Footer sheet)

| Row | Instruction |
|---|---|
| A1 | FAQ section |
| A2 | Shipping: "Shipping Via DHL (90%) or GSL (5%)" — FAQ entry content |
| A16 | Review section |
| A17 | "Remove 2reviews" — action: remove 2 reviews from the display |

**Key observations:**
- FAQ is a footer section — the shipping content "Shipping Via DHL (90%) or GSL (5%)" is specific to Homingmbh (not ledsone.de).
- "Remove 2reviews" — which 2 reviews? This is not specified. Requires Piranav/Jefri to identify which reviews to remove (by ID, text, or platform).
- Footer spec is minimal — only shipping info and review removal instruction provided. No full footer layout spec.

---

## 6. Document Comparison — Word vs Excel

| Aspect | Word Document (REQ-1) | Excel (Navigation sheet) | Conflict / Note |
|---|---|---|---|
| Category count | 9 | 9 | Match ✓ |
| Category order | Same 1–9 | Same 1–9 | Match ✓ |
| Sub-items | Shorter (abbreviated) | Full names | Excel = authoritative for full names |
| Wall Light sub-items | "Hemp Rope · Glass · Metal · Swan Neck · Outdoor · Wooden · Cage Wall Light" | Each has "Wall Light" suffix (e.g. "Hemp Rope Wall Light") | Excel names are more precise |
| Lamp Shade sub-items | "Metal · Glass · Cage · Wirecage Lampshade" | Each has "Lampshade" suffix (e.g. "Metal Lampshade") | Excel names are more precise |
| Transformer filters | "wattage values 240 and 180 next to Blue & White Case; 300, 400, 600 next to Black & White Case" | E7=240, E8=180, E9=300, E10=400, E11=600 | Exact match ✓ |
| Filter implementation | "Shopify Search & Discovery, not separate pages" | "Filter" column marker | Match — word doc adds the implementation detail |
| IP67 structure | "IP67 Waterproof Transformer: 12V Transformers · 24V Transformers" under Cat 1 | Rows B8–B10: IP67 as separate sub-group with same voltage tiers | Match ✓ — IP67 is a parallel sub-group to Normal Transformers |
| Outdoor Lighting (Cat 4) | "Hemp Rope Wall Light · Hemp Rope Pendant Light · Hemp Rope Spider Light · Outdoor Lighting" | F32 = "outdoor lighting" (note column) | Conflict — Word doc lists Outdoor Lighting as a 4th sub-item; Excel puts it in note column. Needs Jefri clarification. |
| Lamp Holder German | No German in word doc | No German in copy sheet | Both missing |
| Connector German | No German in word doc | No German in copy sheet | Both missing |
| Footer | Not mentioned in Word doc | Footer sheet exists | Additional requirement in Excel only |

---

## 7. Existing vs Required Shopify Collections

**All 17 existing collections use `productType EQUALS` smart rules.**

### Top-Level Categories

| # | Required Category (English) | German Display Name | Existing Collection | Handle | Products | Status |
|---|---|---|---|---|---|---|
| 1 | Transformer | Transformatoren | Netzteile & LED-Treiber | `netzteile-und-led-treiber` | 39 | NAMING GAP — reuse with renamed label OR new collection. Piranav decision. |
| 2 | Wall Light | Wandleuchten | Wandleuchten | `wandleuchten` | 94 | DIRECT MATCH ✓ |
| 3 | Lamp Shade | Lampenschirme | Lampenschirme | `lampenschirme` | 111 | DIRECT MATCH ✓ |
| 4 | Hemp Rope Light | Hanfseil-Beleuchtung | — | none | 0 | MISSING — no collection, no products with this productType |
| 5 | Bulbs | Leuchtmittel | Leuchtmittel | `leuchtmittel` | 24 | DIRECT MATCH ✓ |
| 6 | Connector | (no German in source) | Abzweigdosen & Verbinder | `abzweigdosen-und-verbinder` | 16 | PARTIAL — cable junction boxes, may not cover all 4 connector types. Piranav decision. |
| 7 | Lamp Holder | Lampenfassungen (assumed) | Lampenfassungen | `lampenfassungen` | 32 | LIKELY MATCH — "Lampenfassungen" = lamp sockets/holders. NOT confirmed in source docs. |
| 8 | Pipe Light | Rohrleuchten | Rohr- & Steampunk-Leuchten | `rohr-und-steampunk-leuchten` | 14 | NAMING GAP — collection is broader (includes Steampunk). Menu label can be changed. |
| 9 | Cable | Kabel | Textilkabel & Kabelzubehör | `textilkabel-und-kabelzubehoer` | 48 | PARTIAL — collection is broader (all cable accessories). "Cable" label can be used. |

### Sub-Category Collections Required

**NONE of the required sub-categories have existing collections.** All subcategory-level items currently would map to the same parent collection. Creating sub-collections requires a product tagging/typing strategy.

| Category | Required Sub-collections | Currently Exists | Action Needed |
|---|---|---|---|
| Transformer | 5V / 12V / 24V Normal; 12V / 24V IP67; 5 type variants (Slim/Mini/B&O/B&W/Blk&W) | None | New collections required. Products need new productType or tag values. |
| Wall Light | Hemp Rope / Glass / Metal / Swan Neck / Outdoor / Wooden / Cage Wall Light | None | New collections required. |
| Lamp Shade | Metal / Glass / Cage / Wirecage Lampshade | None | New collections required. |
| Hemp Rope Light | Hemp Rope Wall / Pendant / Spider Light | None | No products exist — new collections are empty until stock added. |
| Bulbs | E27 Normal / Decorative / Christmas / Design; B22; E14; G9 | None | New collections required. |
| Connector | Multi Colour / White & Orange / Waterproof / Grey & Orange | None | New collections required. |
| Lamp Holder | Metal Holder / Ceramic Holder | None | New collections required. |
| Pipe Light | Wall Light / Pendant Light / Table Lamp | None | New collections required. |
| Cable | 2Core Twisted / Round; 3Core Twisted / Round | None | New collections required. |

**Total estimated new sub-collections required: 30+** (before confirming product coverage per sub-category)

---

## 8. Theme Navigation Capability (from prior discovery)

| Feature | Homingmbh Staging (Dawn) | Required by REQ-1 |
|---|---|---|
| Mega menu (desktop) | Supported — set `menu_type_desktop = mega` in Theme Editor | ✓ Required |
| Dropdown (desktop) | Currently active (default) | — |
| Mobile accordion/drawer | Supported — `header-drawer.liquid` | ✓ Required |
| 3-level depth | Supported (L1 → L2 → L3) | ✓ Required (category → subcategory → type) |
| Hover dropdown JS | Present — custom patch added 2025-04-17 | Available if needed |
| Mega menu columns | 6-column grid (CSS: `repeat(6, minmax(0, 1fr))`) | Sufficient for 9 categories |
| Sub-items require child links | Yes — mega panels only open if Shopify menu item has children | Menu must be rebuilt in Admin |

**Code change required:** None for the mega menu structure itself — switching from dropdown to mega menu only requires a Theme Editor setting change. All structural Liquid is already in place.

---

## 9. Decisions Requiring Piranav Approval

| # | Decision | Options | Blocker? |
|---|---|---|---|
| D1 | Transformer collection: reuse `netzteile-und-led-treiber` with label "Transformatoren", or create a new `transformatoren` collection? | A: reuse with renamed menu label (fastest); B: new collection with new productType | Blocks Cat 1 implementation |
| D2 | Confirm sub-collection scope: 30+ new sub-collections required. All need product tagging strategy. Is this in scope for this sprint? | A: implement all; B: top-level menu only first (phase approach) | Blocks all subcategory work |
| D3 | Hanfseil-Beleuchtung (Cat 4): Homin has 0 products with this type. Publish as empty placeholder, or exclude from first release? | A: empty collection (flag only); B: skip until stock added | Blocks Cat 4 implementation |
| D4 | Connector scope: "Abzweigdosen & Verbinder" (16 products) covers junction boxes. The spec lists cable connector sub-types. Is this the correct collection or is there a separate connector stock? | A: reuse `abzweigdosen-und-verbinder`; B: new connector collection | Blocks Cat 6 implementation |
| D5 | Lamp Holder = Lampenfassungen? The existing collection `lampenfassungen` (32 products) likely covers lamp holders but this is NOT stated in source docs. | A: confirm = Lampenfassungen; B: check productTypes to verify | Blocks Cat 7 implementation |
| D6 | "Outdoor Lighting" in Cat 4: Word doc shows it as a sub-item; Excel shows it as a note in column F. Is it a 4th menu item under Hemp Rope Light or just a tag/note? | Jefri to clarify | Blocks Cat 4 structure |
| D7 | E27 "Filter" marker: does "Filter" in D34 mean Normal Bulb is a Search & Discovery filter value, or just a label? What filter values apply? | Jefri to clarify | Blocks Cat 5 filters |
| D8 | German translations: 23 sub-items + 2 category headers (Connector, Lamp Holder) have no German translation in source docs. Jefri must confirm all before launch. | Jefri to provide | Blocks all untranslated items |
| D9 | Footer "Remove 2reviews": which 2 reviews? By text content, ID, or platform? | Jefri to identify | Blocks footer work |
| D10 | IP67 header translation: "IP67 Waterproof Transformer" is not translated in Copy of Navigation. Confirm German name. | Jefri to confirm | Blocks Cat 1 IP67 |
| D11 | 301 redirects: REQ-1 acceptance criteria requires 301 redirects for any collection URL that changes handle. If `rohr-und-steampunk-leuchten` → `rohrleuchten` etc., redirects must be added. Confirm this is in scope. | A: add redirects (required by spec); B: keep existing handles | Affects SEO |

---

## 10. Recommended Implementation Plan

### Phase 0 — Pre-implementation (AWAITING APPROVAL)
- Piranav approves decisions D1–D11
- Jefri confirms German translations for 23 missing sub-items + 2 headers
- Product audit: check if existing 435 products have productTypes matching the sub-category spec

### Phase 1 — Top-level collections (safe, low-risk)
1. Rename/relabel menu items to match 9 required categories (German labels)
2. Switch `menu_type_desktop` to `mega` in Theme Editor
3. Build top-level mega menu with 9 items (pointing to existing or new parent collections)
4. No code changes required — Theme Editor + Shopify Admin Navigation only

### Phase 2 — Sub-collections
1. Create sub-collections for categories with existing products (Transformers, Wall Light, Lamp Shade, Bulbs, Cable, Lamp Holder, Pipe Light, Connector)
2. Update product productTypes or tags to trigger sub-collection smart rules
3. Add sub-items to Shopify Admin Navigation menu (enabling mega menu panels)

### Phase 3 — Filters
1. Configure Shopify Search & Discovery for wattage filters on Transformer sub-collections
2. Configure any bulb-type filters per Jefri clarification

### Phase 4 — Hemp Rope Light
1. Only build after stock/products exist with matching productType
2. Create collection + add to menu when ready

### Phase 5 — German labels
1. Apply confirmed German translations to all menu items
2. Validate all labels on live staging

### Phase 6 — Footer
1. Update FAQ shipping info
2. Remove 2 specified reviews (once identified by Jefri)

---

---

## 11. Transformatoren Sub-Category Deep Dive (2026-11-26 — Discovery Task: HOMING REQ-1 Transformatoren)

**Source:** Live Shopify Admin GraphQL — all 39 products from `netzteile-und-led-treiber` collection retrieved.

### Collection Inventory — Full 17 Collections Re-confirmed

All 17 existing collections confirmed. No transformer sub-collections exist. Full list unchanged from Task 002 — no new collections have been created.

### Product-Level Analysis — All 39 Transformer Products

**Tags on ALL 39 products (identical):** `agent-work`, `batch:H-L62-1`, `cat:netzteile-und-led-treiber`, `dept:Elektro`, `src:shopify:108`, `verified`

No sub-category tags. No transformer-type tags. No voltage tags. No case-colour tags.

**ProductType on ALL 39 products:** `Netzteile & LED-Treiber` (identical for all — no sub-types).

### Voltage Distribution (from product titles)

| Voltage | Approximate Count | Example Products |
|---|---|---|
| 12V | ~15 | "12V LED Trafo 150W Slim", "12V 100W LED Treiber IP20", "12V LED-Transformator 15W", "LED Trafo 12V IP67 wasserdicht", "12V Mini LED Trafo Slim Netzteil" |
| 24V | ~6 | "LED Trafo 24V 300W IP20", "LED-Treiber 24V 10W IP67", "LED-Treiber 24V 45W IP67", "LED Netzteil 60W 24V 2.5A IP67" |
| 5V | 1 | "Industrie Netzteil 5V 60A 300W – Aluminium Schaltnetzteil" (SKU: 5IP20300) |
| Constant current (no fixed voltage) | ~17 | SKU prefix CC: CCBC*, CCGNN*, CCOR*, CCRD* — wattages 3–48W |

**Critical gap:** ~17 of 39 products (~44%) are **constant-current LED drivers** (CC prefix SKUs). These do not operate at a fixed voltage output and do not fit the 5V/12V/24V voltage-tier navigation structure. They are a distinct product category not represented in the navigation spec. Needs flagging to Piranav/Jefri.

### IP67 Waterproof Products (from titles)

| SKU | Title | Voltage |
|---|---|---|
| 12IP67100 | LED Trafo 12V IP67 wasserdicht – Schaltnetzteil | 12V |
| 24IP6710 | LED-Treiber 24V 10W IP67 wasserdicht – Schaltnetzteil | 24V |
| 24IP6745 | LED-Treiber 24V 45W IP67 wasserdicht – Netzteil AC 110–230V auf DC 24V | 24V |
| 24IP6760 | LED Netzteil 60W 24V 2.5A IP67 LED wasserdichte Stromversorgung | 24V |

**4 IP67 products confirmed**: 1×12V, 3×24V. No 5V IP67 product exists.

### Type Category Products (from titles / SKUs)

| Requirement Type | Evidence in Products | Count | Notes |
|---|---|---|---|
| Slim Transformer | Titles: "Slim Netzteil Treiber" (SKU 12ASIP20150/200/300); "Mini LED Trafo Slim Netzteil" (12MIP2015) | 4 | All 12V. Title says "Slim" explicitly. |
| Mini Transformers | Title: "12V Mini LED Trafo Slim Netzteil 15W-360W" (SKU 12MIP2015) | 1 | Same product mentions both Mini and Slim — overlap with Slim category |
| Blue & Orange Case | SKU prefix BO: "12V 100W LED Treiber IP20 Trafo" (12BO100) | 1 | BO = Blue Orange inferred from SKU. Title does not say "Blue & Orange Case". |
| Blue & White Case | SKU prefix CCBC: 9 products (CCBC3/5/9/12/18/24/36 + CCBKNWE40/5) | ~9 | BC = Blue & White Case inferred. All constant-current. Title does not confirm case colour. |
| Black & White Case | SKU prefix CCGNN/CCRD: products (CCGNNSWE24/48, CCGNNWE24/36/48, CCRDNWE50) | ~6 | GNN/RD = Black & White inferred. All constant-current. Title does not confirm. |

**Warning:** Case colour inferences (Blue & White = CCBC, Black & White = CCGNN) are based on SKU prefix pattern analysis only. Product titles do NOT state case colours. These mappings are UNCONFIRMED and require Jefri/Piranav verification before any collection or filter work is done.

### Transformatoren Collection Requirement vs Existing — Full Report

| Requirement | Type | Existing German Collection | Title | Handle | Products | Status |
|---|---|---|---|---|---|---|
| **Transformatoren** (top-level) | Collection | ⚠️ Naming gap | Netzteile & LED-Treiber | `netzteile-und-led-treiber` | 39 | NEEDS CONFIRMATION — closest match but German name differs |
| Normal Transformers | Menu grouping | ❌ No | — | — | — | MISSING — organisational group, not a collection |
| 5V Transformers | Collection | ❌ No | — | — | 1 product | MISSING — only 1 product matches; collection viable but thin |
| 12V Transformers | Collection | ❌ No | — | — | ~15 products | MISSING |
| 24V Transformers | Collection | ❌ No | — | — | ~6 products | MISSING |
| IP67 Waterproof Transformer | Menu grouping | ❌ No | — | — | — | MISSING — organisational group, not a collection |
| IP67 — 12V | Collection | ❌ No | — | — | 1 product (12IP67100) | MISSING — 1 product only |
| IP67 — 24V | Collection | ❌ No | — | — | 3 products | MISSING |
| Type > Slim Transformer | Collection | ❌ No | — | — | ~4 products (title-inferred) | MISSING — SKU/title evidence exists, no tag/type |
| Type > Mini Transformers | Collection | ❌ No | — | — | ~1 product (title-inferred) | MISSING — 1 product; overlaps Slim |
| Type > Blue & Orange Case | Collection | ❌ No | — | — | ~1 product (SKU-inferred) | MISSING — SKU pattern only, title unconfirmed |
| Type > Blue & White Case | Filter + Collection | ❌ No | — | — | ~9 products (SKU-inferred) | MISSING — SKU-inferred only; wattage filter values 240W/180W |
| Type > Black & White Case | Filter + Collection | ❌ No | — | — | ~6 products (SKU-inferred) | MISSING — SKU-inferred only; wattage filter values 300/400/600W |
| Wattage: 240W | Filter | N/A | — | — | — | FILTER — Shopify Search & Discovery, not a collection |
| Wattage: 180W | Filter | N/A | — | — | — | FILTER — Shopify Search & Discovery, not a collection |
| Wattage: 300W | Filter | N/A | — | — | — | FILTER — Shopify Search & Discovery, not a collection |
| Wattage: 400W | Filter | N/A | — | — | — | FILTER — Shopify Search & Discovery, not a collection |
| Wattage: 600W | Filter | N/A | — | — | — | FILTER — Shopify Search & Discovery, not a collection |

### Additional Finding — Constant Current Drivers Not in Spec

~17 products (~44% of the transformer collection) are constant-current LED drivers. They do not output a fixed 5V/12V/24V. They are not represented in the navigation specification. Options:
- Include in an existing voltage collection (incorrect technically)
- Create a separate "Konstantstrom-Treiber" collection
- Exclude from the new navigation until Jefri reviews

**This is a new unresolved gap — added as D12 in the decisions list.**

---

## Queryability
YES — this evidence file is the full combined analysis from both source documents plus the deep transformer product audit.

## Status
**DISCOVERY COMPLETE — OPEN (awaiting Piranav approval on D1–D12)**
