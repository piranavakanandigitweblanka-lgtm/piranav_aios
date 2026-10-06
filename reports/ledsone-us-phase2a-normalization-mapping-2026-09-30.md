# Report: LEDSone US Phase 2A — Variant Option Normalization Discovery

**Date:** 2026-09-30
**Phase:** 2A — DISCOVERY ONLY. NO SHOPIFY CHANGES. NO THEME IMPLEMENTATION.
**Req ID:** LEDSONE-US-PHASE2A-NORMALIZATION-2026-09-30
**Status:** COMPLETE — Pending GPT Brain approval of Section C (ambiguous mappings)
**Data source:** PostgreSQL `listings.shopify_listings` (sub_source = 245), synced 2026-09-30

---

## Full Normalization Mapping Table

| Current Option Name | Product Count | Representative Values | Interpreted Meaning | Proposed Canonical Name | Confidence | Notes |
|---|---|---|---|---|---|---|
| `color` | 107 | Black, Brushed Copper, Rustic Red… **but also:** Pack 1, With Bulb, 16.4ft, Type 1-6, "-" | MIXED: primarily colour but contaminated | `Colour` for ~90 clean products | **MEDIUM** | 17 products have non-colour values encoded inside this field — see Section C |
| `Colour` | 32 | Black, Brushed Copper, Rustic Red, Chrome, Cyan blue… | Colour / finish | `Colour` | **HIGH** | Already correct. Keep. |
| `Color` | 4 | Black, Brushed Silver, Rustic Red, White… | Colour (American spelling) | `Colour` | **HIGH** | Rename only |
| `Shade Colour` | 7 | Black, Brushed Copper, Brushed Silver, Chrome… | Lampshade colour | `Colour` | **MEDIUM** | See Section C — may want separate shade vs fixture filter |
| `Lamp Colour` | 1 | Black, Orange, Red, Yellow | Shade/lamp colour | `Colour` | **MEDIUM** | 1 product only |
| `Holder Colour` | 1 | Black, Black and Brass, Brass | Socket/holder finish | `Colour` or keep | **LOW** | Fixture hardware, not shade — different semantic meaning. See Section C |
| `Colur` | 1 | Black, Black Inner Gold, Brushed copper, Rustic Red | Colour (typo) | `Colour` | **HIGH** | Pure typo fix |
| `Farbe` | 1 | Schwarz, Gebürstetes Kupfer, Gebürstetes Silber, Rustikales Rot | German: Colour | `Colour` + translate values | **HIGH** | German contamination. Values also need translating. |
| `Schattenfarbe` | 1 | Blau, Gelb, Grau, Grün, Orange, Rot, Schwarz, Schwarzes Innenweiß, Weiß | German: Shade Colour | `Colour` + translate values | **HIGH** | German contamination. Values also need translating. |
| `style` | 2 | P1: Copper, Black, Yellow Brass / P2: With out Bulb, With Bulb | **MIXED: P1 = Colour; P2 = Bulb Included** | Cannot auto-map | **LOW** | Requires per-product decision — see Section C |
| `Title` | 82 | Default Title / With Bulb / Without Bulb | **MIXED: "Default Title" = no real variant; "With/Without Bulb" = Bulb Included** | `Bulb Included` only for With/Without Bulb products | **MEDIUM** | 82 products. Large impact. "Default Title" products must NOT receive a bulb filter. See Section C. |
| `Bulb` | 14 | No / Yes / With Bulb / Without Bulb | Bulb Included | `Bulb Included` | **HIGH** | Also needs value normalization — see Section E |
| `Required Bulb` | 9 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | |
| `Required the bulbs?` | 6 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | |
| `RequiredBulb` | 3 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | |
| `Required a Bulb?` | 3 | No / Yes / With Bulb / Without Bulb | Bulb Included (mixed values) | `Bulb Included` | **HIGH** name / **MEDIUM** values | Value inconsistency — see Section E |
| `Required a bulb?` | 1 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | Case inconsistency only |
| `Required the bulbs?-` | 1 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | Trailing dash typo |
| `Required Bulbs` | 2 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | |
| `Bulbs Required` | 1 | No / Yes | Bulb Included | `Bulb Included` | **HIGH** | |
| `Benötigt eine Glühbirne` | 1 | Ja / Nein | German: Bulb Included | `Bulb Included` + translate values | **HIGH** | German contamination |
| `Benötigt eine Glühbirne?` | 1 | Ja / Nein | German: Bulb Included | `Bulb Included` + translate values | **HIGH** | German contamination |
| `Benötigt die Glühbirnen?` | 1 | Ja / Nein | German: Bulb Included | `Bulb Included` + translate values | **HIGH** | German contamination |
| `Birne` | 1 | Mit Glühbirne / Ohne Glühbirne | German: Bulb Included | `Bulb Included` + translate values | **HIGH** | German contamination |
| `Brauchen Sie Glühbirnen?` | 1 | No / Yes | German name, English values | `Bulb Included` | **HIGH** | Mixed language — name is German, values are English |
| `Erforderlich eine glühbirne?` | 1 | No / Yes | German name, English values | `Bulb Included` | **HIGH** | Mixed language |
| `Pack` | 21 | **Cable products:** 3.28ft, 16.4ft, 32.8ft / **Lamp products:** 1 Pack, 2 Pack, 5 Pack | **MIXED: Cable Length (9 products) vs Pack Quantity (12 products)** | Split by product type | **MEDIUM** | Cannot apply single canonical name without product-type context — see Section C |
| `PACK` | 1 | 1 PACK, 2 PACK, 3 PACK, 5 PACK, 10 PACK | Pack Quantity | `Pack Quantity` | **HIGH** | Uppercase only. Product: E26 LED Edison Bulb. |
| `Pack ` *(trailing space)* | 1 | Pack of 1, Pack of 2, Pack of 5 | Pack Quantity | `Pack Quantity` | **HIGH** | Trailing space typo. Product: DIAMANTVALL Wire Cage Shade. |
| `Number of Pack` | 2 | P1: 3.28ft, 9.84ft (cable) / P2: Pack 1, Pack 2, Pack 3 (lamp) | **MIXED: Cable Length vs Quantity** | Split by product type | **MEDIUM** | Same ambiguity as `Pack` |
| `Pack Size` | 1 | 02, 03 | Pack Quantity (unusual format) | `Pack Quantity` | **MEDIUM** | Values need reformatting to "2 Pack" / "3 Pack". Product: Industrial Metal Cone Shade. |
| `size` *(lowercase)* | 1 | 1 Pack, 2 Pack | MISNAMED — actually Pack Quantity | `Pack Quantity` | **HIGH** | Product: GEOMETRY 3-Light. Values are quantity, not size. |
| `Size` *(uppercase)* | 4 | **Cable products:** 1M, 5M, 10M / **Fixture products:** 20cm, 30cm, 40cm, 50cm, 80cm | **MIXED: Cable Length (metres) vs Fixture Dimension (cm)** | Split by product type | **MEDIUM** | See Section C |
| `Length` | 2 | 3.28ft, 10ft, 16.4ft, 32.8ft | Cable Length | `Cable Length` | **HIGH** | Both fabric cable products. Clear. |
| `Type` | 3 | P1: Type 1–5 (abstract) / P2: 1 Pack, 2 Pack (quantity) / P3: "3 Way Round Base", "1 Way Round Base" (configuration) | **THREE DIFFERENT MEANINGS** | Cannot auto-map | **LOW** | See Section C — complete STOP |
| `Outlet` | 1 | 4 outlet, 5 outlet | Number of lamp heads on spider/chandelier | Not a catalogue filter | **N/A** | Product-specific. 1 product only. |
| `Required Terminal Box` | 1 | Yes / No | Conduit installation accessory | Not a catalogue filter | **N/A** | Product-specific. 1 product only. |

---

## Section A — Canonical Filter Vocabulary

*Only concepts with sufficient product coverage and clean data to support a reliable filter.*

| Canonical Name | Meaning | Products Covered | Notes |
|---|---|---|---|
| **`Colour`** | Finish/shade colour of the fixture | ~145 products (after normalization) | Largest filter. Most impactful for shoppers. |
| **`Bulb Included`** | Whether a bulb is included with the product | ~120+ products (across all bulb option variants + Title With/Without Bulb) | Values must be standardised to `Yes` / `No` |
| **`Pack Quantity`** | How many units in the pack | ~25–30 products | Only for lamp/bulb/shade products. Cable length variants must NOT be included here. |
| **`Cable Length`** | Length of fabric electrical cable | ~15 products | Cable products only. Not applicable to lighting fixtures. |

**Excluded from canonical vocabulary (insufficient data or product-specific):**
- `Outlet` (1 product only)
- `Required Terminal Box` (1 product only)
- Physical fixture dimension / `Size` in cm (4 products — too few for a meaningful catalogue filter)
- `Type` as style variant (too ambiguous, too few products)

---

## Section B — Approved Candidate Mappings

*High-confidence mappings requiring only a rename in Shopify Admin. No restructuring.*

### B1 — Colour Mappings (High Confidence)

| From | To | Products | Action Required |
|---|---|---|---|
| `Color` | `Colour` | 4 | Rename in Shopify Admin |
| `Colur` | `Colour` | 1 | Rename (typo fix) |
| `Farbe` | `Colour` | 1 | Rename + translate values (Schwarz→Black, Gebürstetes Kupfer→Brushed Copper, etc.) |
| `Schattenfarbe` | `Colour` | 1 | Rename + translate values |

### B2 — Bulb Included Mappings (High Confidence)

| From | To | Products | Action Required |
|---|---|---|---|
| `Required Bulb` | `Bulb Included` | 9 | Rename |
| `Required the bulbs?` | `Bulb Included` | 6 | Rename |
| `RequiredBulb` | `Bulb Included` | 3 | Rename |
| `Required a bulb?` | `Bulb Included` | 1 | Rename (case fix) |
| `Required the bulbs?-` | `Bulb Included` | 1 | Rename (remove trailing dash) |
| `Required Bulbs` | `Bulb Included` | 2 | Rename |
| `Bulbs Required` | `Bulb Included` | 1 | Rename |
| `Brauchen Sie Glühbirnen?` | `Bulb Included` | 1 | Rename (German name, English values — safe) |
| `Erforderlich eine glühbirne?` | `Bulb Included` | 1 | Rename (German name, English values — safe) |
| `Benötigt eine Glühbirne` | `Bulb Included` | 1 | Rename + translate values (Ja→Yes, Nein→No) |
| `Benötigt eine Glühbirne?` | `Bulb Included` | 1 | Rename + translate values |
| `Benötigt die Glühbirnen?` | `Bulb Included` | 1 | Rename + translate values |
| `Birne` | `Bulb Included` | 1 | Rename + translate values (Mit Glühbirne→Yes, Ohne Glühbirne→No) |

### B3 — Pack Quantity Mappings (High Confidence, clean products only)

| From | To | Products | Action Required |
|---|---|---|---|
| `PACK` | `Pack Quantity` | 1 | Rename (uppercase) |
| `Pack ` *(trailing space)* | `Pack Quantity` | 1 | Rename (trim space) |
| `size` *(lowercase, GEOMETRY 3-Light only)* | `Pack Quantity` | 1 | Rename (misnamed field) |

### B4 — Cable Length Mappings (High Confidence)

| From | To | Products | Action Required |
|---|---|---|---|
| `Length` | `Cable Length` | 2 | Rename |

---

## Section C — Ambiguous Mappings

**⚠ STOP — These require GPT Brain decision before any normalization can proceed.**

---

### C1 — `color` field (107 products) — PARTIALLY AMBIGUOUS

**Problem:** 90 products use `color` correctly for colour values. But 17 products have non-colour values embedded inside the same option name:

| Product | `color` values used for | Correct fix |
|---|---|---|
| 3 Core Jute Fabric Covered Wire | Cable lengths (16.4ft, 32.8ft, 3.28ft) | Rename option to `Cable Length` |
| 3 Light 72.83" LED Multi Light Pendant | Pack 1/2/3 (quantity) | Rename option to `Pack Quantity` |
| 3 Shaded Cluster Pendant Light | "Black With Bulb", "Blue Without Bulb" etc. | Split into 2 separate options: `Colour` + `Bulb Included` |
| Cage Single Pendant / Single Cage Pendant | Pack 1/2/3 (quantity) | Rename to `Pack Quantity` |
| Natural Wood Table Lamp | Type 1–6 (abstract style) | Rename to `Type` (still ambiguous — see C3) |
| Pendant Light Cord Kit | "Pack 1/2/3 - With Bulb" (pack+bulb combined) | Split into 2 options |
| Rope hanging light 1m | "Without Bulb" / "With Bulb" | Rename to `Bulb Included` |
| Semi Flush Ceiling Light × 2 products | "1 Pack" / "2 Pack" (quantity) | Rename to `Pack Quantity` |
| Semi Recessed Light | "Copper Without Bulb", "Yellow Brass with Bulb" (colour+bulb combined) | Split into 2 options |
| Farmhouse Hanging Pendant | "3 Way Rectangle" (configuration) | Product-specific — see C4 |
| Adjustable Swing Arm Wall Sconce | Contains "-" (null/empty value) | Data quality issue — see Section E |
| light flush ~1194 | "1 Pack With Bulb", "2 Pack Without Bulb" (pack+bulb combined) | Split into 2 options |
| Swag Hanging Light | "Black - With Out Bulb", "Black - With Bulb" (colour+bulb combined) | Split into 2 options |
| 3 Shaded Cluster Pendant / Industrial Semi Flush / Semi Recessed | colour+bulb combined values | Split into 2 options |

**GPT Brain decision required:** For the ~5 products where colour and bulb are encoded as a single combined value (e.g., "Black With Bulb"), this CANNOT be fixed by renaming alone. It requires restructuring the product's variant options in Shopify Admin (adding a second option dimension). This is a higher-risk change that could affect variant URLs and inventory records.

---

### C2 — `Title` field (82 products) — REQUIRES FILTERING

**Problem:** Shopify uses "Title" as the default option name for single-variant products. Values break into:
- `Default Title` → single-variant products with no meaningful option. Filter must be excluded.
- `With Bulb` / `Without Bulb` → products where the only variant dimension is bulb inclusion. These should map to `Bulb Included`.

**GPT Brain decision required:** How to handle the 82 `Title` products in S&D filter configuration — S&D cannot filter on "Title" as a group across only some products.

---

### C3 — `Type` field (3 products) — THREE DIFFERENT MEANINGS

| Product | `Type` values | Actual meaning |
|---|---|---|
| 3 bulb bar pendant light ~1187 | Type 1, Type 2, Type 3, Type 4, Type 5 | Abstract design/style variants (unknown without product images) |
| LED Dimmable E26 Light Bulb Globe G95 ~1033 | 1 Pack, 2 Pack, 3 Pack, 5 Pack, 6 Pack, 10 Pack | Pack quantity |
| Modern Adjustable Pendant with Wire Cage ~1122 | 3 Way Rectangular Base, 3 Way Round Base, 1 Way Round Base | Number of pendant heads from one canopy — configuration |

**GPT Brain decision required:** Cannot normalize `Type` to a single canonical name. Each product needs individual assessment. The bulb product's `Type` = Pack Quantity. The pendant's `Type` = a unique configuration filter. The bar pendant's abstract types cannot be determined from data alone.

---

### C4 — `Pack` and `Size` for cable vs fixture products

**Problem:**
- `Pack` (21 products): 9 fabric cable products use it for cable length in feet. 12 lamp/fixture products use it for quantity.
- `Size` (4 products): 2 cable products use it for cable length in metres (1M, 5M, 10M). 2 fixture products (conduit pendants) use it for fixture arm length in cm (20–80cm).

**GPT Brain decision required:** 
1. Should cable length (ft and m across different products) be normalized to a single `Cable Length` canonical name, and if so, should values be converted to a consistent unit?
2. Should fixture arm dimension (cm) be kept as `Fixture Size` or excluded from catalogue filters entirely (only 2 products)?

---

### C5 — `style` field (2 products)

| Product | `style` values | Actual meaning |
|---|---|---|
| E26 Medium Base Light Socket ~1140 | Copper, Black, Yellow Brass | Colour/finish |
| GEOMETRY 3-Light ~1186 | With out Bulb, With Bulb | Bulb Included |

**GPT Brain decision required:** 2 products with completely different meanings for the same option name. Each needs individual renaming to different canonical names.

---

### C6 — `Shade Colour` vs `Colour` (7 products)

**Problem:** `Shade Colour` uses colour values (Black, Brushed Copper, etc.) identical to the `Colour` field. Semantically it refers specifically to the lampshade, whereas `Colour` on other products refers to the overall fixture finish.

**GPT Brain decision required:** Should `Shade Colour` be merged into `Colour` (simpler filter, broader match) or kept separate (allows more precise filtering by shade colour vs fixture colour)? Both are defensible.

---

### C7 — `Holder Colour` (1 product)

Values: Black, Black and Brass, Brass. This refers to the E27/E26 lamp holder/socket finish, not the shade. Only 1 product.

**GPT Brain decision required:** Merge into `Colour` (simpler) or keep separate or exclude from filter (1 product is too few for a filter group to be useful)?

---

## Section D — Unmapped Attributes

*Should remain unchanged or excluded from catalogue filters.*

| Option Name | Reason |
|---|---|
| `Outlet` (1 product, 4/5 outlet) | Product-specific spider light configuration. Not a useful catalogue filter. |
| `Required Terminal Box` (1 product, Yes/No) | Conduit installation accessory. Not a catalogue filter. |
| `Type` values representing abstract "Type 1–5" (1 product) | Meaningless without product images/descriptions. Cannot be a filter. |
| Fixture arm dimension in cm (2 conduit pendant products) | 2 products only — too few for a filter. |

---

## Section E — Data Quality Issues

### E1 — Typos in Option Names

| Typo | Correct | Products |
|---|---|---|
| `Colur` | `Colour` | 1 |
| `Required the bulbs?-` (trailing dash) | `Bulb Included` | 1 |
| `Pack ` (trailing space) | `Pack Quantity` | 1 |

### E2 — Inconsistent Capitalization / Spelling

| Variants | Should be | Products |
|---|---|---|
| `color` / `Color` / `Colour` | `Colour` | 107 / 4 / 32 |
| `Required Bulb` / `RequiredBulb` / `Required a Bulb?` / `Required a bulb?` | `Bulb Included` | 9/3/3/1 |
| `Pack` / `PACK` / `Pack ` / `Number of Pack` | `Pack Quantity` | 21/1/1/2 |
| `Size` / `size` | Context-dependent | 4/1 |
| `Bulb` / `Required Bulbs` / `Bulbs Required` | `Bulb Included` | 14/2/1 |

### E3 — Inconsistent Option Values (same concept, different format)

| Option | Value variants | Should be standardised to |
|---|---|---|
| Bulb Included (across all bulb options) | `Yes`/`No`, `With Bulb`/`Without Bulb`, `Ja`/`Nein`, `Mit Glühbirne`/`Ohne Glühbirne` | `Yes` / `No` |
| Pack Quantity | `1 Pack`, `Pack 1`, `1 PACK`, `Pack of 1` | `1 Pack` (consistent format) |
| Colour values | `Brushed copper` / `Brushed Copper` / `brushed Copper`, `Rustic red` / `Rustic Red` / `Rustc Red`, `Satin Nikel` / `Satin Nickel`, `Bkack` / `Black`, `BlacK Inner Gold` | All need case normalization + typo fixes |
| Cable Length | `3.28ft` / `3.28 ft` / `3.2ft` / `3.28/16.40/32.81 ft` (in product title) | `3.28 ft` (consistent spacing) |

### E4 — Language Contamination (German products in US sub_source)

| Option Name | Product | Language |
|---|---|---|
| `Farbe` | Swing Arm Lamp ~1195 | German option name + German values |
| `Schattenfarbe` + `Benötigt eine Glühbirne?` | Swan Neck Barn Wall Light ~1164 | Fully German |
| `Birne` | 1 product | German |
| `Brauchen Sie Glühbirnen?` | 3 bulb bar pendant ~1187 | German name + English values |
| `Erforderlich eine glühbirne?` | Pendant Light Hemp Rope ~1170 | German name + English values |
| `Benötigt eine Glühbirne` / `Benötigt die Glühbirnen?` | 2 products | German |

**Total: ~7 products with German-language option contamination in the US store.**

### E5 — Embedded Multi-Concept Values (cannot be fixed by rename alone)

These products encode 2 concepts inside a single option value. Fixing them requires adding a new variant dimension in Shopify Admin:

| Product | Embedded values | What they mean |
|---|---|---|
| 3 Shaded Cluster Pendant | "Black Gold Inner With bulb", "Blue Without Bulb" | Colour × Bulb Included |
| Industrial Semi Flush Fixture | "Brushed Copper With Bulb", "Black Without Bulb" | Colour × Bulb Included |
| Semi Recessed Light | "Copper Without Bulb", "Yellow Brass with Bulb" | Colour × Bulb Included |
| Swag Hanging Light | "Black - With Bulb", "Black - With Out Bulb" | Colour × Bulb Included |
| light flush ~1194 | "1 Pack With Bulb", "2 Pack Without Bulb" | Pack × Bulb Included |
| Pendant Light Cord Kit | "Pack 1- With Bulb", "Pack 2- With Bulb" | Pack × Bulb Included |

### E6 — Null / Empty Values

| Product | Option | Value | Issue |
|---|---|---|---|
| Adjustable Swing Arm Wall Sconce | `color` | "-" | Null/empty value encoded as dash. Should be removed. |

### E7 — Unusual Value Formats

| Product | Option | Values | Issue |
|---|---|---|---|
| Industrial Metal Cone Shade ~1118 | `Pack Size` | "02", "03" | Numeric strings instead of "2 Pack" / "3 Pack" |

---

## Section F — Shopify Change Plan

**PHASE 2A IS DISCOVERY ONLY. The following is a description of changes required — NOT an execution plan.**

### F1 — Simple Renames (low risk — no variant URLs affected if Shopify handles correctly)

- Rename `Color` → `Colour` (4 products)
- Rename `Colur` → `Colour` (1 product)
- Rename `Required Bulb`, `RequiredBulb`, `Required the bulbs?`, `Required a bulb?`, `Required the bulbs?-`, `Required Bulbs`, `Bulbs Required` → `Bulb Included` (total: 24 products)
- Rename German bulb names → `Bulb Included` (6 products)
- Rename `PACK`, `Pack ` → `Pack Quantity` (2 products)
- Rename `size` (lowercase, GEOMETRY product) → `Pack Quantity` (1 product)
- Rename `Length` → `Cable Length` (2 products)

**⚠ Risk:** Renaming a Shopify variant option name changes the variant's URL structure. Any saved links, Google-indexed URLs, or external references to variant URLs will break. Shopify does create redirects in some cases but this must be verified per-store.

### F2 — Rename + Value Translation (German products)

- For 7 German-language products: rename option name to English canonical, translate values (Ja→Yes, Nein→No, Schwarz→Black, etc.)
- These are mostly `draft` products — lower risk, but must be verified.

### F3 — Context-Split Renames (medium risk)

For `Pack` and `Size` options that cover both cable and fixture products:
- Identify cable products → rename `Pack` to `Cable Length`
- Identify fixture/lamp products → rename `Pack` to `Pack Quantity`
- Requires product-by-product action in Shopify Admin, not a bulk rename

### F4 — Structural Restructuring (high risk — requires GPT Brain approval)

For 6 products with colour+bulb or pack+bulb combined into single values:
- Add a second option dimension (e.g., add `Bulb Included` as a new option)
- Remove bulb encoding from colour/pack values
- This affects variant count, variant IDs, inventory assignments, and potentially Shopify POS / order history
- **Must not be done without explicit GPT Brain approval and a per-product plan**

---

## Section G — Risks

| Risk | Severity | Affected Area |
|---|---|---|
| Renaming variant option names changes variant URLs | HIGH | SEO, external links, Google index |
| Restructuring combined-value variants (colour+bulb) changes variant IDs | HIGH | Inventory, orders, Shopify analytics |
| German-language products in US sub_source suggest multi-market sync error | MEDIUM | Data integrity — these products may be appearing in US collections unintentionally |
| 82 `Title`-named products — if S&D creates a "Title" filter group, it will expose "Default Title" as a filter value | MEDIUM | UX — shoppers would see "Default Title" as a filter option |
| `color` field has 107 products — largest single option — mixed contamination means bulk rename will produce wrong canonical names for ~17 products | HIGH | Filter accuracy |
| `Pack` for cable products: renaming to `Pack Quantity` would mislabel cable lengths as quantities | MEDIUM | Filter accuracy for cable category |
| `Type` field — 3 completely different product meanings — bulk rename is impossible | MEDIUM | Data integrity |
| Value inconsistency in Bulb options (`Yes`/`No` vs `With Bulb`/`Without Bulb`) — Shopify S&D will create separate filter values for each format | HIGH | Filter UX — shoppers will see both "Yes" and "With Bulb" as separate filter choices |

---

## Summary for GPT Brain

**HIGH-CONFIDENCE MAPPINGS (safe to approve):** 29 option names across ~50 products can be renamed without ambiguity. See Section B.

**AMBIGUOUS — REQUIRES GPT BRAIN DECISION (7 items):**
1. `color` field — 17 products with non-colour values mixed in. Some need restructuring (not just rename).
2. `Title` field — 82 products. Only those with `With/Without Bulb` values should map to `Bulb Included`.
3. `Type` field — 3 products, 3 different meanings. Each needs individual treatment.
4. `Pack` / `Size` field — cable length vs quantity split. Needs product-type logic.
5. `style` field — 2 products, 2 different meanings.
6. `Shade Colour` — merge into `Colour` or keep separate?
7. `Holder Colour` — merge into `Colour` or exclude?

**DATA RESTRUCTURING REQUIRED (high risk — 6 products):** Products with colour+bulb or pack+bulb encoded inside single variant values. Cannot be fixed by rename alone. Requires new option dimension in Shopify Admin.

**DISCOVERY STATUS: PASS**
Sufficient data collected for GPT Brain to approve or reject each proposed mapping.
Implementation cannot begin until GPT Brain approves Section B and makes decisions on Section C.
