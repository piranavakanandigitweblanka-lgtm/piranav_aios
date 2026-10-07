# GA-08 — Bulb Collection Tag Fixes

**Project:** LEDSone.co.uk  
**Task code:** GA-08  
**Owner:** Piranav + Thuwaraga  
**Status:** STEPS 1–3 COMPLETE + BEFORE/AFTER SCREENSHOTS CAPTURED — `low-wattage-bulbs` rule changed to `Low Wattage Bulb` tag (31 products confirmed). Remaining collections and full verification still OPEN.  
**Deadline (SL):** 6 Oct 2026  
**Folder:** `organic-discovery/06_GA-08_bulb_collection_tags/`  

---

## Task Summary

Audit and correct product tagging across 5 bulb collections on LEDSone.co.uk:

1. `low-wattage-bulbs` — remove all incorrectly included pendant fittings
2. `incandescent-bulbs` — remove all incorrectly included LED bulbs
3. `dimmable-led-bulbs` — add missing products with correct tag
4. `e14-base-bulb` — add 2 missing genuine E14 bulbs (add tag)
5. `e27-base-bulb` — review 1 product with B22 title but E27 tag

---

## Step 1 Discovery — Date: 2026-10-07

**Method:** Read-only PostgreSQL queries via `ledsone-db-mcp`.  
**No Shopify changes made.**

### Collection IDs (Shopify item_ids, sub_source 104)

| Handle | Shopify collection_id | Type | DB product count |
|---|---|---|---|
| low-wattage-bulbs | 677351195010 | Smart | 53 |
| incandescent-bulbs | 159254839392 | Smart | 4 |
| dimmable-led-bulbs | 394336076026 | Smart | 37 |
| e14-base-bulb | 160253870176 | Smart | 7 |
| e27-base-bulb | 159869304928 | Smart | 58+ (prior audit) |

All 5 collections are **Smart (tag-driven)**. Changes require adding or removing the controlling tag on each product — NOT manual collection edits.

---

## AUDIT RESULTS

---

### 1. low-wattage-bulbs

**DB count:** 53 products (task description said 51 — DB snapshot has 53 including 2 drafts)

**Finding: ALL 53 products are pendant lights or fittings — not a single bulb.**

Product types found:
- `Pendant Lighting` — majority
- `Spider Lights`
- `Multi_Outlet_Spider_Lamp_Lighting`
- `pendant lightss`

All products have tags: `Pendant Lights`, `Spider Pendant` etc.

**None** are low-wattage bulbs. The entire collection is incorrectly populated.

#### Full REMOVE list — low-wattage-bulbs (all 53)

| # | Internal ID | item_id | Title | Product Type | Status |
|---|---|---|---|---|---|
| 1 | 344766 | 8070720520442 | 1/2/6 Head Cage Ceiling Pendant Lamp Swag Spider Hanging Light~5058 | Pendant Lighting | active |
| 2 | 344787 | 7983221932282 | 2 Head Cage Ceiling Pendant Lamp Swag Hanging Spider Light~4275 | Pendant Lighting | active |
| 3 | 345630 | 8053217886458 | 2 Head Lamp Ceiling Pendant Light Adjustable cord Shade~5034 | Pendant Lighting | active |
| 4 | 954581 | 15212824887682 | 2 Light Spider Pendant Hanging Lamp ~6507 | Pendant Lighting | active |
| 5 | 345761 | 7560399225082 | 2 Way Industrial Celling Hanging Lamp Pendant Light~3508 | Spider Lights | active |
| 6 | 345813 | 7560397947130 | 2-Light Silver Spider Indoor Pendant Light-Cage Design~3489 | Spider Lights | active |
| 7 | 345824 | 7502163738874 | 2-way Retro Industrial ceiling cable E27 Hanging lamp pendant light~3403 | Pendant Lighting | active |
| 8 | 346561 | 8109485031674 | 3 Head Multi-Color Flex Pendant Light ~5141 | Pendant Lighting | active |
| 9 | 346564 | 8010052993274 | 3 Head Swag Spider Pendant Light Multiple Color~4659 | Pendant Lighting | active |
| 10 | 1020508 | 15394929967490 | 3 Head Swag Spider Pendant Light ~6936 | Pendant Lighting | draft |
| 11 | 346604 | 8132266230010 | 3-Head Colourful Spider Pendant Light \| E27 \| UK ~5184 | Pendant Lighting | active |
| 12 | 355293 | 7500897976570 | 5 Head Ceiling Pendant for Any Room ~3397 | Pendant Lighting | active |
| 13 | 347250 | 8010056892666 | 5 Head Spider shape Multiple Colour pendant Light Flex Swag Hook ~4665 | Pendant Lighting | active |
| 14 | 347387 | 7928914182394 | 5 Way Chandelier Spider Ceiling Indoor Lamp Red~4158 | Pendant Lighting | active |
| 15 | 928922 | 15144754807170 | 5 Way Indoor Spider Lights Ceiling Hanging Pendant Lights~6300 | Spider Lights | active |
| 16 | 876009 | 14975177523586 | 5 Way Vintage Ceiling Spider Hanging Lights 2M ~6104 | Pendant Lighting | active |
| 17 | 347256 | 8103204356346 | 5-Way Industrial Hanging Pendant Spider Lights ~5126 | Pendant Lighting | active |
| 18 | 355291 | 7495216988410 | 8 Head Spider Light Industrial Pulley Pendant E27 Retro Ceiling Rose~1000 | Multi_Outlet_Spider_Lamp_Lighting | active |
| 19 | 347871 | 8010062004474 | 9 Light Ceiling Spider Pendant – Multi-Colour Swag Hook Plug-In Lighting ~4667 | Pendant Lighting | active |
| 20 | 668460 | 8620603638010 | Adjustable Pendant Light Holder ~5516 | Pendant Lighting | active |
| 21 | 358201 | 7430007030010 | Black Pendant Light Spider with Rubber Cable Metal Lamp Holder~1122 | Pendant Lighting | active |
| 22 | 359894 | 8012431884538 | Hanging Pendant Holder With Hook~4909 | Pendant Lighting | active |
| 23 | 357277 | 7105629159585 | Industrial 2-Way Pulley Spider Pendant Light E27 Dual Head~1125 | Pendant Lighting | active |
| 24 | 359233 | 7019566006433 | Industrial 8 Arm Spider Pendant Light E27 Adjustable Balloon Cage ~1179 | Pendant Lighting | active |
| 25 | 349395 | 5998487011489 | Industrial Black Spider Pendant \| 6 Way Ceiling Fixture~1775 | Spider Lights | active |
| 26 | 348854 | 7560397979898 | Industrial Geometric Cage Pendant Multi-Way E27l~3490 | Multi_Outlet_Spider_Lamp_Lighting | active |
| 27 | 770000 | 14877081567618 | Industrial One Bulb Ceiling Pendant Spider Light ~5604 | Pendant Lighting | active |
| 28 | 917610 | 15106577695106 | Industrial Retro LED Ceiling Light ~6310 | Pendant Lighting | active |
| 29 | 358748 | 7501640532218 | Industrial Spider Adjustable Multi Arm Pendant Light 5-Light E27~3399 | Pendant Lighting | active |
| 30 | 935237 | 15167355453826 | Industrial Spider Light Chandelier Kit ~6437 | Spider Lights | active |
| 31 | 348645 | 7019418648737 | Industrial Spider Pendant Light 6 Way Multi Drop E27 Matte Black~1181 | Pendant Lighting | active |
| 32 | 359834 | 7566367654138 | Industrial Spider Pendant Light 8-Way E27~3525 | Spider Lights | active |
| 33 | 354396 | 7632863691002 | Metal Ceiling Light Hanging Spider Pendant Lamp Retro Industrial~3679 | Spider Lights | active |
| 34 | 344736 | 8015418720506 | Modern 1/2 Head Black Spider Light Pendant Lamp Ceiling Fitting E27~4945 | Spider Lights | active |
| 35 | 357960 | 8062958928122 | Modern Black Pendant Light Adjustable Hanging Lamp ~5055 | Spider Lights | active |
| 36 | 354757 | 8100609065210 | Modern Black Spider Pendant Light~ 5114 | Spider Lights | active |
| 37 | 926229 | 15144403730818 | Modern Industrial 5-Light Pendant Ceiling Fixture ~6390 | Spider Lights | active |
| 38 | 355390 | 7541402534138 | Modern Spider Braided Pendant lamp Yellow Cone Shades Ceiling Lighting~3432 | pendant lightss | active |
| 39 | 897881 | 15039066210690 | Multi Fleming Spider Pendant Light Black ~6165 | Spider Lights | active |
| 40 | 355986 | 6635418910881 | Multi Outlet 8 Way Ceiling Pendant Light For 2m PVC Cable~1571 | Spider Lights | active |
| 41 | 349039 | 8062989926650 | Pendant Ceiling Lights for Living Room 2 Head Hanging Lights~5056 | Spider Lights | active |
| 42 | 357403 | 7094174810273 | Retro Loft Adjustable Antique Metal Pendant Ceiling Light ~1133 | Pendant Lighting | active |
| 43 | 357969 | 8100560994554 | Single Ceiling Pendant Lamp Swag Hanging Light ~ 5112 | Pendant Lighting | active |
| 44 | 357972 | 8166046662906 | Single Ceiling Pendant Lamp Swag Hanging Light ~5340 | Spider Lights | active |
| 45 | 358192 | 7993908166906 | Spider Ceiling Pendant Light 2m Fabric 3Core Cable E27 ~4483 | Spider Lights | active |
| 46 | 358204 | 7819052286202 | Spider Pendant Lamp 3 Way Hanging Brushed Copper Ceiling Lamp Lighting~4069 | Spider Lights | active |
| 47 | 348400 | 6999643979937 | Spider Pendant Light Matt Black E27 Industrial Cage 1–6~1187 | Pendant Lighting | draft |
| 48 | 358206 | 8010555457786 | Spider shape Single Colour pendant Light Flex Swag Hook 1M \| 2M ~4740 | Pendant Lighting | active |
| 49 | 925696 | 15143247839618 | Vintage Industrial 3-Light Pendant \| Metal & Gold Inner 21cm Shade ~6375 | Pendant Lighting | active |
| 50 | 855756 | 14924979175810 | Vintage Industrial Spider Ceiling Light Chandelier Pendant Lamp ~ 5762 | Pendant Lighting | active |
| 51 | 855882 | 14925041566082 | Vintage Industrial Spider Ceiling Light Chandelier Pendant Lamp ~ 5773 | Pendant Lighting | active |
| 52 | 357079 | 7059080216737 | Vintage Retro Ceiling Spider Hanging Lights 2M ~1166 | Pendant Lighting | active |
| 53 | 361357 | 7560398962938 | Yellow Brass 2 Way Retro Industrial Ceiling E27 Hanging Lamp Pendant Light~3505 | Multi_Outlet_Spider_Lamp_Lighting | active |

**Controlling tag to remove:** Determine which tag controls inclusion in this Smart collection (requires Shopify admin inspection — could be a product-type rule, not a tag rule). Since `low-wattage-bulbs` is Smart, the rule needs to be identified before removal action.

**⚠ INVESTIGATION NEEDED:** This Smart collection's rule was NOT inspected live. The tag/rule driving these pendants into `low-wattage-bulbs` is unknown. Must be confirmed in Shopify admin before any tag changes.

---

### 2. incandescent-bulbs

**DB count:** 4 products. ALL 4 are LED bulbs — the collection contains zero genuine incandescent bulbs.

#### Full REMOVE list — incandescent-bulbs (all 4)

| # | Internal ID | item_id | Title | product_type | Reason Incorrect |
|---|---|---|---|---|---|
| 1 | 345666 | 7849767436538 | 2 Pack LED E27/B22/E14 Dimmable Warm white 2700K Bulbs~4086 | Bulb_B22_Base B | Title and tags confirm LED; has `LED Bulb` tag |
| 2 | 358258 | 4417263632480 | E27 4W Dimmable Retro Filament LED Edison Decorative Bulb ~3239 | Bulb | Title says "LED"; has `LED Bulbs` tag |
| 3 | 350925 | 4417275887712 | LED B22 G95 4W Filament Dimmable Warm White 2700K Bulb~3080 | Bulb | Title starts "LED"; has `LED Bulbs` tag and `MODIncandescent Bulbs` tag |
| 4 | 350927 | 7834279215354 | LED Bayonet G95 Filament Vintage Bulb 4W B22 Edison Globe Vintage Bulb-4072 | Bulb | Title starts "LED"; has `LED Bulbs` tag and `MODIncandescent Bulbs` tag |

**Key finding:** Products 3 and 4 both have the tag `MODIncandescent Bulbs` (not `Incandescent Bulbs`). That tag appears to be the collection rule driver. Also, product 3 has a tag `Incandescent Bulbs` directly.

**⚠ TAG TO REMOVE:** `Incandescent Bulbs` (and possibly `MODIncandescent Bulbs`) from all 4 products.

---

### 3. dimmable-led-bulbs

**DB count:** 37 products currently in collection.  
**Missing (tagged but not in DB snapshot):** 11 products found.

**Note on 27 vs 11 discrepancy:** The task register states "27 missing dimmable bulbs." This figure comes from a prior audit not yet documented in AIOS. The DB currently shows only 11 products tagged "Dimmable LED Bulbs" missing from the collection snapshot. The discrepancy is likely due to (a) products already added since the original audit, or (b) the original audit used a broader criteria. This cannot be resolved without the original GA-08 source document.

**⚠ BLOCKER: No GA-08 source documentation found. The "required dimmable bulb list" referenced in the task description does not exist in any AIOS file. Piranav must provide the source document or confirm the 11 found are the complete set.**

#### ADD list — dimmable-led-bulbs (11 products missing from DB snapshot, all have "Dimmable LED Bulbs" tag)

| # | Internal ID | item_id | Title | product_type | Physical Stock | Priority |
|---|---|---|---|---|---|---|
| 1 | 350910 | 4417265696864 | Vintage G95 Dimmable E27 8W Bulb Globe Screw Light Bulb ~3219 | E27 Base Bulb B | 835 | HIGH |
| 2 | 347233 | 4417276248160 | LED Vintage Bulb E27 T185 Tubular Filament 4W Screw Bulbs~3076 | E27 Base Bulb B | 644 | HIGH |
| 3 | 344780 | 7977105424634 | 10 Pack G95 E27 8W LED Globe Vintage LED Retro Light Bulbs~4159 | Bulb | not queried | MEDIUM |
| 4 | 347762 | 7977105064186 | 6 Pack G95 8W E27 Globe LED Lamp Bulb~4158 | Bulb | not queried | MEDIUM |
| 5 | 349905 | 4417265238112 | Dimmable A60 E27 6W Led Bulb Vintage Filament design~3223 | E27 Base Bulb B | -6 (oversold) | MEDIUM |
| 6 | 360029 | 7065160024225 | Vintage 4W Warm White LED Filament Bulb E27 Decorative Light ~1143 | Bulb | -1 | LOW |
| 7 | 360031 | 7065159762081 | Vintage LED 8W Soft Filament E27 Screw Decorative Industrial Light~1149 | Bulb | 0 | LOW |
| 8 | 357376 | 7065159729313 | Retro LED 8W Soft Filament E27 Screw Decorative Industrial Light~1150 | Bulb | 0 | LOW |
| 9 | 347865 | 7065159860385 | 8W Vintage LED Filament E27 Screw Bulb Decorative Industrial Light~1147 | Bulb | -3 | LOW |
| 10 | 347894 | 4417275953248 | A60 B22 4W Dimmable Light Bulb Vintage Filament Classic LED~3079 | Bulb_B22_Base B | -29 | LOW |
| 11 | 347855 | 7065159827617 | Vintage Ambient Angle LED Filament Bulb E27 8W Dimmable~1148 | Bulb | 0 | LOW |

**Action:** These products already have the `Dimmable LED Bulbs` tag. The Smart collection should auto-include them. The DB table is a snapshot — these products may already be live in Shopify. Verify in Shopify admin before adding any tags.

---

### 4. e14-base-bulb

**DB count:** 7 products currently in collection.  
**Products ~6941 and ~6742: BOTH confirmed missing.**

#### Product Analysis

| Product | Internal ID | item_id | Title | product_type | Tags | Missing Reason |
|---|---|---|---|---|---|---|
| ~6941 | 1020946 | 15395791700354 | 2 x LED Candle Bulbs E14 Screw SMD Indoor Decor Light Bulb ~6941 | Light Bulbs | NULL (no tags) | No `E14 Base Bulb` tag → Smart collection won't include it |
| ~6742 | 986078 | 15304819933570 | E14 3 Warm White LED 5W Candle Bulb ~6742 | NULL | AguBULB, Caraxes, DO NOT COPY SOB, Dracarys | No `E14 Base Bulb` tag → Smart collection won't include it |

Both products are genuine E14 candle/LED bulbs by title. Neither has the `E14 Base Bulb` tag.

**Action required:** Add `E14 Base Bulb` tag to both products.

**⚠ NOTE on ~6742:** Has `DO NOT COPY SOB` tag — flagged as a managed product. Verify with product team before tagging. The "DO NOT COPY" flag may indicate it is a vendor/supplier product with restricted management.

**Current e14-base-bulb collection (7 existing products — all confirmed correct E14 bulbs):**

| # | Internal ID | item_id | Title | product_type |
|---|---|---|---|---|
| 1 | 353633 | 4417265467488 | 2w Led Small Edison Screw Candle Bulb Dimmable ~3221 | Bulb |
| 2 | 350064 | 4417265631328 | 4W Dimmable E14 LED Candle Bulb Filament C35 vintage design ~3220 | Bulb |
| 3 | 350044 | 8053246034170 | E14 3W/5W LED Corn Bulb for Cooker Hood Energy-Efficient Light ~5038 | Bulb |
| 4 | 353658 | 8027138195706 | Industrial LED Corn Bulb 30W E14 Dimmable Aluminium~4994 | Bulb |
| 5 | 348972 | 8036006134010 | Mini Candle E14 LED Bulb Chandelier Light bulb~5014 | E14 Base Bulb B |
| 6 | 862150 | 14932339097986 | Retro E14 LED Flame Candle Bulb 12W Switchable Colour~5893 | Bulb |
| 7 | 350047 | 8053229879546 | Retro LED E14 Candle Flame Cool White Bulb chandelier Light~5036 | Bulb |

---

### 5. e27-base-bulb — Product ~1045

**Product:** "Vintage Amber LED Filament Bulb 4W B22~1045"  
**Internal ID:** 349851 | **item_id:** 7469126418682  
**Status:** active  
**product_type:** Bulb

**Collection membership (confirmed):**
- `e27-base-bulb` ✓ (IS in this collection)
- `b22-base-bulb` ✓ (also in this collection — correct for B22)
- `dimmable-led-bulbs` ✓

**Tags driving E27 inclusion:**
- `E27 Base Bulb` ✓ (tag present — Smart collection auto-includes)
- `E27 LED Bulbs` ✓
- `E27` ✓
- `BASEE27` ✓
- Also has: `B22 Base Bulb` ✓

**Why it's included in E27:** The Smart collection rule matches `E27 Base Bulb` tag. The product has this tag.

**Title says "B22"** — the title indicates the product is primarily a B22 (bayonet) fitting. However it also has E27 tags, suggesting either:
- (a) The product has dual-base variants (both B22 and E27 versions in the same Shopify listing), OR
- (b) The E27 tag was incorrectly added

**Assessment:** The title "Vintage Amber LED Filament Bulb 4W B22~1045" contains only "B22" — no E27 mention. The E27 tags may have been added in error. The product IS listed in task OD-A5 (Remove 7 wrong products from E27 and B22 bulb collections) which specifically targets incorrect collection membership.

**Recommended action:** HUMAN REVIEW — confirm whether ~1045 has genuine E27 variants. If B22-only: remove `E27 Base Bulb`, `E27 LED Bulbs`, `E27`, `BASEE27` tags. If dual-base: keep as-is.

---

## Collection-Level Summary

| Collection | DB Count | All Incorrect | Missing (DB snapshot) | Recommended Changes |
|---|---|---|---|---|
| low-wattage-bulbs | 53 | 53 (100%) | unknown | REMOVE all 53 (tag removal — rule needs identifying) |
| incandescent-bulbs | 4 | 4 (100%) | 0 identified | REMOVE all 4 (`Incandescent Bulbs` tag) |
| dimmable-led-bulbs | 37 | 0 | 11 (tagged, not in DB snapshot) | ADD 11 (tag already present — verify Shopify sync) |
| e14-base-bulb | 7 | 0 | 2 (~6941, ~6742) | ADD 2 (add `E14 Base Bulb` tag) |
| e27-base-bulb | 58+ | 1 uncertain (~1045) | 0 identified here | REVIEW ~1045 (OD-A5 scope) |

---

## Exact ADD List

| Collection | item_id | Title | Action |
|---|---|---|---|
| e14-base-bulb | 15395791700354 | 2 x LED Candle Bulbs E14 Screw SMD Indoor Decor Light Bulb ~6941 | ADD tag `E14 Base Bulb` |
| e14-base-bulb | 15304819933570 | E14 3 Warm White LED 5W Candle Bulb ~6742 | ADD tag `E14 Base Bulb` (⚠ check DO NOT COPY flag) |
| dimmable-led-bulbs | 4417265696864 | Vintage G95 Dimmable E27 8W Bulb Globe Screw Light Bulb ~3219 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 4417276248160 | LED Vintage Bulb E27 T185 Tubular Filament 4W Screw Bulbs~3076 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7977105424634 | 10 Pack G95 E27 8W LED Globe Vintage LED Retro Light Bulbs~4159 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7977105064186 | 6 Pack G95 8W E27 Globe LED Lamp Bulb~4158 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 4417265238112 | Dimmable A60 E27 6W Led Bulb Vintage Filament design~3223 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7065160024225 | Vintage 4W Warm White LED Filament Bulb E27 Decorative Light ~1143 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7065159762081 | Vintage LED 8W Soft Filament E27 Screw Decorative Industrial Light~1149 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7065159729313 | Retro LED 8W Soft Filament E27 Screw Decorative Industrial Light~1150 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7065159860385 | 8W Vintage LED Filament E27 Screw Bulb Decorative Industrial Light~1147 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 4417275953248 | A60 B22 4W Dimmable Light Bulb Vintage Filament Classic LED~3079 | Verify Shopify already includes (tag exists) |
| dimmable-led-bulbs | 7065159827617 | Vintage Ambient Angle LED Filament Bulb E27 8W Dimmable~1148 | Verify Shopify already includes (tag exists) |

---

## Exact REMOVE List

| Collection | item_id | Title | Tag to remove |
|---|---|---|---|
| incandescent-bulbs | 7849767436538 | 2 Pack LED E27/B22/E14 Dimmable Warm white 2700K Bulbs~4086 | `Incandescent Bulbs` |
| incandescent-bulbs | 4417263632480 | E27 4W Dimmable Retro Filament LED Edison Decorative Bulb ~3239 | `Incandescent Bulbs` |
| incandescent-bulbs | 4417275887712 | LED B22 G95 4W Filament Dimmable Warm White 2700K Bulb~3080 | `Incandescent Bulbs` (and `MODIncandescent Bulbs`) |
| incandescent-bulbs | 7834279215354 | LED Bayonet G95 Filament Vintage Bulb 4W B22 Edison Globe Vintage Bulb-4072 | `Incandescent Bulbs` (and `MODIncandescent Bulbs`) |
| low-wattage-bulbs | (all 53 above) | See full REMOVE list in Section 1 | ⚠ Rule must be confirmed in Shopify admin first |

---

## Products Requiring Manual Review Before Action

| Product | item_id | Issue | Decision needed from |
|---|---|---|---|
| ~1045 (e27-base-bulb) | 7469126418682 | Title says B22 but has E27 tags; in both collections | Thuwaraga / Product team |
| ~6742 (e14 missing) | 15304819933570 | Has `DO NOT COPY SOB` flag | Product team |
| dimmable 11 products | various | DB snapshot may be stale — Shopify may already show them | Verify in Shopify admin first |
| low-wattage-bulbs rule | 677351195010 | Smart collection rule driving pendant inclusion unknown | Inspect in Shopify admin |

---

## Important: What Was NOT Found

- **No GA-08 source document exists in AIOS.** The task register says "27 missing dimmable bulbs" but no list was found. DB found 11. Piranav must confirm if additional products are missing or if some were already fixed.
- **The "~27 missing dimmable" count cannot be verified** without the original audit source.

---

## Step 2 — Low Wattage Threshold Discovery (2026-10-07)

**Full evidence:** `evidence/GA-08_low-wattage-threshold-discovery_2026-10-07.md`

### Root Cause of low-wattage-bulbs Problem — CONFIRMED

The Smart collection rule is: **`Tag includes: Spider Pendant`** (+ inventory > 30).

Every product tagged `Spider Pendant` with 30+ stock enters `low-wattage-bulbs`. All 53 products have this tag. This is a misconfigured rule — `Spider Pendant` has nothing to do with wattage. The collection has **never** contained low-wattage bulbs under this rule.

### No Explicit LEDSone Definition Found

Searched: AIOS docs, knowledge base, tag table, collection condition logs. **No document, tag, or rule defines what "Low Wattage" means for LEDSone bulbs.**

### LEDSone Wattage Tag System

Two systems:
- `WATT{n}W` = actual LED consumption (WATT2W, WATT4W, WATT8W, WATT60W, etc.)
- `FILTWATT-{n}W` = incandescent-equivalent (FILTWATT-40W, FILTWATT-60W)

Note: Some energy-saving GLS products carry multiple WATT tags because they are sold in multiple wattages within one listing.

### Wattage Distribution (single-variant bulb products)

| Wattage | Single-variant bulb products | Category |
|---|---|---|
| 1W | 1 | Low wattage |
| 2W | 1 | Low wattage |
| 3W | 1 | Low wattage |
| **4W** | **31** | **Low wattage — DOMINANT tier** |
| 5W | 2 | Low wattage (borderline) |
| 7W | 2 | Mid-range |
| **8W** | **15** | Mid-range (60W equiv brightness) |
| 9W | 2 | Mid-range |
| 12W | 5 | Higher |
| 15W–25W | 3 | Higher |
| **40W** | **3** | Incandescent — NOT low wattage |
| **60W** | **10** | Incandescent — NOT low wattage |

### Key Internal Signal: `vintage-bulbs-4w` Collection

LEDSone already has a Smart collection `vintage-bulbs-4w` (12 products, controlling tag: `Vintage bulbs 4W`) specifically for 4W vintage LED filament bulbs. This is LEDSone's own precedent confirming **4W = a distinct low-wattage tier**.

Additionally, 20 WATT4W bulb products exist that are NOT yet in `vintage-bulbs-4w`.

### Inferred Threshold (MEDIUM confidence — needs Thuwaraga confirmation)

> **Low Wattage Bulbs = LED bulbs with actual consumption ≤ 5W**

- **≤4W (strict):** **31 products** (DB-verified 2026-10-07) — directly aligns with `vintage-bulbs-4w` precedent
- **< 5W (strictly below 5W):** **33 products** (DB-verified 2026-10-07) — adds WATT2W (1) and WATT3W (1) products
- Previous estimate of ~34 corrected to **33** by DB extraction

8W is NOT low wattage: an 8W LED replaces a 60W incandescent — standard household brightness.  
60W/40W incandescent bulbs are NOT low wattage in LED terms.

### Proposed New Collection Rule

Replace: `Tag includes: Spider Pendant` + `inventory > 30`  
With: `Tag includes: WATT4W` (or `any of WATT2W, WATT3W, WATT4W, WATT5W` for broader scope)

OR: Create a new `Low Wattage Bulb` tag and apply it to the qualifying products.

### Questions for Thuwaraga Before Any Change

1. Threshold: ≤4W or ≤5W? (or other?)
2. Should `low-wattage-bulbs` overlap with `vintage-bulbs-4w` or replace it?
3. Are the real 60W incandescent filament bulbs considered "low wattage" in LEDSone's context?
4. New tag `Low Wattage Bulb` vs using existing `WATT4W` as the Smart collection rule?
5. Collection purpose: customer-facing SEO (e.g. "low energy bulbs") or internal merchandising?

---

## Step 3 — Sub-5W Bulb Extraction (2026-10-07)

**Full evidence:** `evidence/GA-08_sub5W-bulb-extraction_2026-10-07.md`  
**Validation:** `validation/piranav/GA-08_sub5W-extraction-validation_2026-10-07.md`

### Result: 33 products strictly below 5W (WATT2W + WATT3W + WATT4W)

| Wattage | Count |
|---|---|
| WATT2W | 1 |
| WATT3W | 1 |
| WATT4W | 31 |
| **Total** | **33** |

Previous estimate was ~34 — actual is **33**. The difference of 1 is due to a multi-variant energy-saving GLS product that has WATT3W + WATT5W tags. It was correctly excluded because it also has a high-watt tag (WATT5W = not strictly below 5W).

**94% of sub-5W products are 4W vintage filament LED** — all shapes (T45, ST64, G80, G95, G125, T185, C35, A60) and all bases (E27, B22, E14).

**Full product list:** See `evidence/GA-08_sub5W-bulb-extraction_2026-10-07.md` — all 33 products with internal IDs, Shopify item_ids, handles, product types, and base types.

**Flag:** Product ~1045 (internal_id 349851) appears in this list and carries both B22 and E27 tags — already logged for product team review.

---

## Step 4 — Before/After Screenshot Evidence (2026-10-07)

**Screenshots captured:** Shopify admin — `low-wattage-bulbs` collection rule change.

| Screenshot | File | What it shows |
|---|---|---|
| BEFORE | `evidence/screenshots/GA-08_before_tag_update_2026-10-07.png` | Rule = `Spider Pendant` + inventory > 30. Count = 53 pendants. |
| AFTER | `evidence/screenshots/GA-08_after_tag_update_2026-10-07.png` | Rule = `Low Wattage Bulb` + inventory > 30. Count = 31 actual bulbs. |

**Manifest:** `evidence/screenshots/Screenshot_Manifest.md`

**What the AFTER screenshot confirms:**
- The `low-wattage-bulbs` Smart collection rule has been changed from `Spider Pendant` to `Low Wattage Bulb`
- Collection now shows 31 products — all vintage LED filament bulbs
- The ≤4W threshold was applied (31 = WATT4W count from DB extraction)
- The 2W and 3W products (2 total from DB) may lack the `Low Wattage Bulb` tag or may be below the inventory > 30 threshold — requires live check

**GA-08 Status after this step:** `low-wattage-bulbs` fix is visually confirmed. Remaining items still OPEN — see Next Steps below.

---

## Step 5 — Incandescent Bulbs Discovery (2026-10-07)

**Full evidence:** `evidence/GA-08_incandescent-bulbs-discovery_2026-10-07.md`

### Root Cause of incandescent-bulbs Problem — CONFIRMED

The Smart collection rule is `Tag includes: Incandescent Bulbs` + inventory condition (likely > 30).

13 active products have the `Incandescent Bulbs` tag. Only 4 are in the collection — all 4 are LED. The 9 genuine 40W/60W incandescent products have lower stock and are filtered out by the inventory condition. The collection is showing the wrong products for a structural reason identical to `low-wattage-bulbs`.

### No Explicit LEDSone Definition

No document defines "Incandescent Bulbs" for LEDSone. Inferred from WATT tag system:
> Genuine incandescent = `WATT40W` or `WATT60W` actual wattage (not just FILTWATT equivalent)

### 4 Incorrect LED Products (currently in collection — must be removed)

| # | Shopify ID | Title | Why wrong |
|---|---|---|---|
| 1 | 7849767436538 | 2 Pack LED E27/B22/E14 Dimmable Warm white 2700K Bulbs~4086 | LED energy-saving pack, no wattage tags |
| 2 | 4417263632480 | E27 4W Dimmable Retro Filament LED Edison Decorative Bulb ~3239 | 4W LED, title says LED |
| 3 | 4417275887712 | LED B22 G95 4W Filament Dimmable Warm White 2700K Bulb~3080 | 4W LED actual; WATT60W is equiv only |
| 4 | 7834279215354 | LED Bayonet G95 Filament Vintage Bulb 4W B22~4072 | 4W LED actual; WATT40W is equiv only |

### Correct Product Set: 11 genuine incandescent bulbs

- 9 have `Incandescent Bulbs` tag already (not all appear in collection — see stock verification)
- 2 are missing the tag entirely (~3245, ~4063) — both IN STOCK (82 and 117 units)
- ~1666 technology: **RESOLVED — CONFIRMED GENUINE INCANDESCENT** (SKU prefix `ICSC35E1460`; product_type entry error)

### Stock Verification Result (2026-10-07)

**Full evidence:** `evidence/GA-08_incandescent-stock-verification_2026-10-07.md`

| Product | Stock | Tag correct? | In collection? |
|---|---|---|---|
| ~3235 B22 T130 60W | -15 (OOS) | ✅ | NO — OOS |
| ~3073 B22 G125 40W | -7 (OOS) | ✅ | NO — OOS |
| ~3231 B22 T45 60W | 0 (OOS) | ✅ | NO — OOS |
| ~1666 C35 E14 60W | 0 (OOS) | ✅ | NO — OOS |
| ~3245 E27 G80 60W | 82 ✓ | ❌ MISSING | NO — missing tag |
| ~3070 E27 T130 60W | 49 ✓ | ✅ | NO — ⚠️ investigate |
| ~3237 E27 T185 60W | 335 ✓ | ✅ | NO — ⚠️ investigate |
| ~3236 T130 E27 60W | 49 ✓ | ✅ | NO — ⚠️ investigate |
| ~1668 T185 E27 60W | -3 (OOS) | ✅ | NO — OOS |
| ~3232 T45 E27 60W | 70 ✓ | ✅ | NO — ⚠️ investigate |
| ~4063 C35 60W | 117 ✓ | ❌ MISSING | NO — missing tag |

**⚠️ New blocker:** 4 products (~3070, ~3237, ~3236, ~3232) have the correct tag AND stock > 30 but are still not in the collection. The Shopify Smart collection rule must have additional conditions not yet identified. **Inspect in Shopify admin before implementing.**

---

## Next Steps (Step 6 — Remaining Implementation)

1. **Thuwaraga confirms wattage threshold** (≤4W, ≤5W, or other)
2. **Piranav confirms dimmable count** (11 found vs 27 claimed — source doc needed)
3. Confirm ~6742 `DO NOT COPY` flag with product team
4. Confirm ~1045 B22/E27 dual-base question with product team
5. Implement approved tag changes in Shopify (no changes until all above resolved)
6. Verify live collection counts post-change
7. Screenshot before/after for evidence
8. Update this task to COMPLETED

---

## No Shopify Changes Made

This document records Step 1 Discovery only. Zero product tags or collection rules were modified.
