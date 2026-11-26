# Evidence: Homingmbh Shopify — Unmatched Product Analysis
**Task ID:** HOMING-2026-11-26-003
**Date:** 2026-11-26
**Store:** homingmbh.de
**Precursor tasks:** HOMING-2026-11-26-001 (435 products) · HOMING-2026-11-26-002 (17 collections)
**Executed by:** Claude Code (read-only — no products, tags, or collections modified)

---

## Context

Task 2 confirmed that **7 products are assigned to no collection** in Homingmbh DE.
All 17 collections use **productType EQUALS** conditions only. No tag, vendor, or title rules exist.
Therefore the only mechanism for a product to enter a collection is through its `productType` field value.

This task investigates each of the 7 products in full and produces a recommended correction for each.

---

## Full Product Detail — All 7 Unmatched Products

| Field | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| **Numeric ID** | 11293233185105 | 11293315432785 | 11293596713297 | 11293674176849 |
| **Title** | LED Netzteil IP20 Schaltnetzteil Trafo 5V / 12V / 24V ~1005 | LED Netzteil 5V IP20 Schaltnetzteil Trafo ~1006 | LED Netzteil 12V IP20 Schaltnetzteil Trafo ~1007 | LED Netzteil 24V IP20 Schaltnetzteil Trafo ~1008 |
| **Handle** | led-netzteil-ip20-schaltnetzteil-trafo-5v-12v-24v | led-netzteil-ip20-schaltnetzteil-trafo-5v | led-netzteil-ip20-schaltnetzteil-trafo-12v | led-netzteil-ip20-schaltnetzteil-trafo-24v |
| **Status** | ACTIVE | ACTIVE | ACTIVE | ACTIVE |
| **Vendor** | Homin | Homin | Homin | Homin |
| **Product Type** | Transformatoren & Netzteile | Transformatoren & Netzteile | Transformatoren & Netzteile | Transformatoren & Netzteile |
| **Tags** | IP20, Trafo | 5V, IP20, Trafo | 12V, IP20, Trafo | 24V, IP20, Trafo |

| Field | P5 | P6 | P7 |
|---|---|---|---|
| **Numeric ID** | 11305838510417 | 11305852076369 | 11305868558673 |
| **Title** | Konstantstrom-LED-Treiber-Transformator | Ø22cm Vintage Fluted Shell Ceiling Light \| E27 Urban Loft Ceiling Fixture | 12V DC Konstantspannungs-LED-Treibertransformator |
| **Handle** | konstantstrom-led-treiber-transformator | vintage-bauernhaus-deckenleuchte | 12v-dc-konstantspannungs-led-treibertransformator |
| **Status** | DRAFT | DRAFT | DRAFT |
| **Vendor** | homingmbh | homingmbh | homingmbh |
| **Product Type** | Switching Mode Power Supplies | Ceiling and Pendant Lights | Lighting Parts |
| **Tags** | _(none)_ | _(none)_ | _(none)_ |

---

## Collection Condition Reference

All 17 collections and their active productType rules (from HOMING-2026-11-26-002):

| Collection | Condition Type | Values Matched |
|---|---|---|
| Pendelleuchten | productType EQUALS | "Pendelleuchten" |
| Lampenschirme | productType EQUALS | "Lampenschirme" |
| Netzteile & LED-Treiber | productType EQUALS | "Netzteile & LED-Treiber" |
| Deckenleuchten & Spinnenlampen | productType EQUALS | "Deckenleuchten & Spinnenlampen" |
| Textilkabel & Kabelzubehör | productType EQUALS | "Textilkabel & Kabelzubehör" |
| Abzweigdosen & Verbinder | productType EQUALS | "Abzweigdosen & Verbinder" |
| Wandleuchten | productType EQUALS | "Wandleuchten" |
| Baldachine & Deckenrosetten | productType EQUALS | "Baldachine & Deckenrosetten" |
| Rohr- & Steampunk-Leuchten | productType EQUALS | "Rohr- & Steampunk-Leuchten" |
| Lampenfassungen | productType EQUALS | "Lampenfassungen" |
| Tisch- & Stehleuchten | productType EQUALS | "Tisch- & Stehleuchten" |
| Leuchtmittel | productType EQUALS | "Leuchtmittel" |
| Außenleuchten | productType EQUALS | "Außenleuchten" |
| Leuchten | productType IN ANY | Pendelleuchten, Deckenleuchten & Spinnenlampen, Wandleuchten, Rohr- & Steampunk-Leuchten, Tisch- & Stehleuchten, Außenleuchten |
| Lampenzubehör | productType IN ANY | Lampenschirme, Textilkabel & Kabelzubehör, Baldachine & Deckenrosetten, Lampenfassungen, Leuchtmittel |
| Elektro | productType IN ANY | Netzteile & LED-Treiber, Abzweigdosen & Verbinder |
| Home page | No conditions | Manually managed (1 product) |

---

## Product-by-Product Analysis

---

### GROUP A — Transformatoren & Netzteile (P1–P4)

**Root cause: productType name mismatch**

These 4 products are LED power supplies / transformers — the same category as the 39 products already in the **Netzteile & LED-Treiber** collection. The only difference is the productType string:

- Existing 39 products: `productType = "Netzteile & LED-Treiber"`
- These 4 products: `productType = "Transformatoren & Netzteile"`

The collection rule requires an exact string match. `"Transformatoren & Netzteile" ≠ "Netzteile & LED-Treiber"` → excluded.

**Additional observation:** These 4 products carry tags `IP20`, `Trafo`, `5V/12V/24V` — not the standard `agent-work / batch / cat / dept / src / verified` tag structure. They were likely created before the tagging system was established, explaining the productType inconsistency.

---

### P1 — LED Netzteil IP20 Schaltnetzteil Trafo 5V / 12V / 24V ~1005

| Field | Value |
|---|---|
| ID | 11293233185105 |
| Status | ACTIVE |
| Product Type (current) | Transformatoren & Netzteile |
| Tags | IP20, Trafo |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | productType = "Transformatoren & Netzteile" does not match collection rule "Netzteile & LED-Treiber" |
| Root cause | productType mismatch — wrong type string on this product |
| Recommended fix | Change productType from "Transformatoren & Netzteile" → "Netzteile & LED-Treiber" |
| Safety | **SAFE** — productType change on a live product is non-destructive. Collection auto-populates via smart rule. No customer-facing URL changes. |
| Expected result | Product appears in Netzteile & LED-Treiber (40 products) and Elektro (56 products) |

---

### P2 — LED Netzteil 5V IP20 Schaltnetzteil Trafo ~1006

| Field | Value |
|---|---|
| ID | 11293315432785 |
| Status | ACTIVE |
| Product Type (current) | Transformatoren & Netzteile |
| Tags | 5V, IP20, Trafo |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | Same as P1 — productType mismatch |
| Root cause | productType mismatch |
| Recommended fix | Change productType → "Netzteile & LED-Treiber" |
| Safety | **SAFE** |
| Expected result | Same as P1 |

---

### P3 — LED Netzteil 12V IP20 Schaltnetzteil Trafo ~1007

| Field | Value |
|---|---|
| ID | 11293596713297 |
| Status | ACTIVE |
| Product Type (current) | Transformatoren & Netzteile |
| Tags | 12V, IP20, Trafo |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | Same as P1 — productType mismatch |
| Root cause | productType mismatch |
| Recommended fix | Change productType → "Netzteile & LED-Treiber" |
| Safety | **SAFE** |
| Expected result | Same as P1 |

---

### P4 — LED Netzteil 24V IP20 Schaltnetzteil Trafo ~1008

| Field | Value |
|---|---|
| ID | 11293674176849 |
| Status | ACTIVE |
| Product Type (current) | Transformatoren & Netzteile |
| Tags | 24V, IP20, Trafo |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | Same as P1 — productType mismatch |
| Root cause | productType mismatch |
| Recommended fix | Change productType → "Netzteile & LED-Treiber" |
| Safety | **SAFE** |
| Expected result | Same as P1 |

---

### GROUP B — Vendor "homingmbh" DRAFT products (P5–P7)

**Root cause: English product types with no matching collection rule**

These 3 products were created under the vendor `homingmbh` (not `Homin`). Their product types are in English, while all collection rules use German product type strings. None of the 3 English type strings match any of the 17 collection rules.

Additionally, all 3 carry **zero tags** — they have never been processed by the agent-work tagging system.

---

### P5 — Konstantstrom-LED-Treiber-Transformator

| Field | Value |
|---|---|
| ID | 11305838510417 |
| Status | DRAFT |
| Product Type (current) | Switching Mode Power Supplies |
| Tags | _(none)_ |
| Product category | Constant-current LED driver / transformer — same functional category as P1–P4 |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | productType = "Switching Mode Power Supplies" (English) — no collection rule matches this string |
| Root cause | English productType used instead of German; also DRAFT status (not visible on storefront) |
| Recommended fix | (1) Change productType → "Netzteile & LED-Treiber" AND (2) Change vendor → "Homin" AND (3) Apply standard tag structure before publishing |
| Safety | **CONDITIONAL** — DRAFT, so no customer impact from type change. Do not publish until tags and vendor are corrected. |
| Expected result | Product enters Netzteile & LED-Treiber and Elektro once productType corrected and product published |

---

### P6 — Ø22cm Vintage Fluted Shell Ceiling Light | E27 Urban Loft Ceiling Fixture

| Field | Value |
|---|---|
| ID | 11305852076369 |
| Status | DRAFT |
| Product Type (current) | Ceiling and Pendant Lights |
| Tags | _(none)_ |
| Product category | Ceiling pendant light — Leuchten family |
| Most appropriate collection (option A) | **Deckenleuchten & Spinnenlampen** (currently 0 products — collection exists but is empty) |
| Most appropriate collection (option B) | **Pendelleuchten** (currently 0 products — collection exists but is empty) |
| Why excluded | productType = "Ceiling and Pendant Lights" (English) — no collection rule matches; both Deckenleuchten and Pendelleuchten collections have 0 products |
| Root cause | English productType; DRAFT status; no tags |
| Notes | This product could also fill one of the two empty collections. Title suggests it is a ceiling pendant → Deckenleuchten or Pendelleuchten. Requires Piranav confirmation on which German type is correct. |
| Recommended fix | (1) Confirm correct German productType: "Pendelleuchten" or "Deckenleuchten & Spinnenlampen" AND (2) Change productType to confirmed value AND (3) Change vendor → "Homin" AND (4) Apply standard tag structure before publishing |
| Safety | **CONDITIONAL — REQUIRES PIRANAV DECISION** on which collection (Pendelleuchten vs Deckenleuchten). Do not publish until confirmed. |
| Expected result | Product enters whichever German collection is selected, plus the parent Leuchten collection |

---

### P7 — 12V DC Konstantspannungs-LED-Treibertransformator

| Field | Value |
|---|---|
| ID | 11305868558673 |
| Status | DRAFT |
| Product Type (current) | Lighting Parts |
| Tags | _(none)_ |
| Product category | 12V DC LED driver transformer — same functional category as P1–P4 and P5 |
| Most appropriate collection | **Netzteile & LED-Treiber** → parent: **Elektro** |
| Why excluded | productType = "Lighting Parts" (English) — no collection rule matches |
| Root cause | English productType; DRAFT status; no tags |
| Recommended fix | (1) Change productType → "Netzteile & LED-Treiber" AND (2) Change vendor → "Homin" AND (3) Apply standard tag structure before publishing |
| Safety | **CONDITIONAL** — DRAFT, no customer impact. Do not publish until tags and vendor are corrected. |
| Expected result | Product enters Netzteile & LED-Treiber and Elektro once productType corrected and product published |

---

## Summary Recommendation Table

| # | ID | Title (short) | Status | Current Type | Root Cause | Recommended Collection | Recommended Fix | Safety |
|---|---|---|---|---|---|---|---|---|
| P1 | 11293233185105 | LED Netzteil 5V/12V/24V ~1005 | ACTIVE | Transformatoren & Netzteile | Type mismatch | Netzteile & LED-Treiber | Change productType → "Netzteile & LED-Treiber" | ✅ SAFE |
| P2 | 11293315432785 | LED Netzteil 5V ~1006 | ACTIVE | Transformatoren & Netzteile | Type mismatch | Netzteile & LED-Treiber | Change productType → "Netzteile & LED-Treiber" | ✅ SAFE |
| P3 | 11293596713297 | LED Netzteil 12V ~1007 | ACTIVE | Transformatoren & Netzteile | Type mismatch | Netzteile & LED-Treiber | Change productType → "Netzteile & LED-Treiber" | ✅ SAFE |
| P4 | 11293674176849 | LED Netzteil 24V ~1008 | ACTIVE | Transformatoren & Netzteile | Type mismatch | Netzteile & LED-Treiber | Change productType → "Netzteile & LED-Treiber" | ✅ SAFE |
| P5 | 11305838510417 | Konstantstrom-LED-Treiber-Transformator | DRAFT | Switching Mode Power Supplies | English type; no tags | Netzteile & LED-Treiber | (1) Type → "Netzteile & LED-Treiber" (2) Vendor → "Homin" (3) Add standard tags | ⚠️ CONDITIONAL |
| P6 | 11305852076369 | Ø22cm Vintage Ceiling Light | DRAFT | Ceiling and Pendant Lights | English type; no tags; ambiguous category | **Piranav to decide:** Pendelleuchten OR Deckenleuchten & Spinnenlampen | (1) Confirm German type (2) Apply type (3) Vendor → "Homin" (4) Add tags | ⚠️ REQUIRES DECISION |
| P7 | 11305868558673 | 12V DC LED-Treibertransformator | DRAFT | Lighting Parts | English type; no tags | Netzteile & LED-Treiber | (1) Type → "Netzteile & LED-Treiber" (2) Vendor → "Homin" (3) Add standard tags | ⚠️ CONDITIONAL |

---

## Implementation Plan (AWAITING PIRANAV APPROVAL)

### Phase 1 — Safe, immediate (4 ACTIVE products, type-only fix)
Change productType on P1–P4 from `"Transformatoren & Netzteile"` → `"Netzteile & LED-Treiber"`.
- Effect: All 4 immediately appear in Netzteile & LED-Treiber and Elektro collections.
- Netzteile & LED-Treiber grows from 39 → 43 products.
- Elektro grows from 55 → 59 products.
- No other changes required. No tags to add. No publishing action.

### Phase 2 — DRAFT products (requires decision on P6 first)
For P5 and P7: Change productType → `"Netzteile & LED-Treiber"`, change vendor → `"Homin"`, apply standard tag structure (`agent-work`, `batch:H-L62-1`, `cat:netzteile-und-led-treiber`, `dept:Elektro`, `src:*`, `verified`). Do NOT publish — keep DRAFT until Piranav confirms ready.

For P6: **Piranav must decide** whether this ceiling light belongs to `"Pendelleuchten"` or `"Deckenleuchten & Spinnenlampen"`. Both collections are currently empty. This product would be the first in either. After Piranav confirms, apply same workflow as P5/P7.

---

## Post-Fix Expected State

| Collection | Before | After Phase 1 | After Phase 1+2 |
|---|---|---|---|
| Netzteile & LED-Treiber | 39 | 43 | 45 (DRAFT excluded until published) |
| Elektro | 55 | 59 | 61 (DRAFT excluded until published) |
| Pendelleuchten OR Deckenleuchten | 0 | 0 | 0 (DRAFT excluded until published + P6 decision) |
| Unassigned products | 7 | 3 (P5, P6, P7 remain DRAFT) | 0 (after publish) |

---

## Queryability
YES — this evidence file is fully self-contained. All decisions, root causes, and recommendations are documented here without requiring API access.

## Status
**AWAITING PIRANAV APPROVAL** — read-only investigation complete. No changes have been made.
