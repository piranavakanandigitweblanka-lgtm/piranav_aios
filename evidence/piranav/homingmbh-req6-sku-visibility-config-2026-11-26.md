# Evidence: Homingmbh Shopify — REQ-6 Remove SKU from Product Details
**Task ID:** HOMING-2026-11-26-004
**Requirement ID:** REQ-6
**Date:** 2026-11-26
**Store:** homingmbh.de (Homingmbh, Germany, EUR, Basic plan)
**Implemented by:** Piranav via Shopify Theme Editor
**Recorded by:** Claude Code

---

## Requirement

> Remove SKU from product detail page display on the Homingmbh storefront.
> SKU data must remain in Shopify Admin.
> No custom code changes.

---

## Implementation Method

**Tool used:** Shopify Theme Editor (Online Store → Themes → Customize)
**Template scope:** Default product template (only one product template exists in this store)
**Method:** Native Dawn theme toggle — no Liquid, CSS, or JS files modified.

---

## Configuration Applied

| Setting | Previous State | New State |
|---|---|---|
| Show item number (SKU) | ON (confirmed in screenshot 094922) | **OFF** ✓ |
| Show brand (vendor) | ON | **ON** ✓ |
| Show weight | ON | **ON** ✓ |

---

## Implementation Details

| Field | Value |
|---|---|
| Theme section | Default product template → Product information block |
| Code files changed | **None** — Theme Editor UI only |
| SKU data in Admin | **Preserved** — no SKU data was deleted or modified |
| Template affected | Default product (all products — only one template exists) |
| Other templates affected | None |
| Reversible | Yes — toggle back ON in Theme Editor at any time |
| Deployment method | Saved directly in Theme Editor — live immediately |

---

## What This Change Does

- **Hides** the SKU field from the product detail page on the customer-facing storefront (homingmbh.de)
- **Does not delete** any SKU data — SKUs remain fully intact in Shopify Admin, orders, and exports
- **Does not affect** vendor display (vendor remains visible — Show brand = ON)
- **Does not affect** weight display (weight remains visible — Show weight = ON)
- **Does not affect** any other product template, collection page, or search result

---

## Storefront Verification — CONFIRMED 2026-11-26

**Verified by:** Piranav — live browser check on homingmbh.de product page
**Verification date:** 2026-11-26

| Element | Expected | Observed | Result |
|---|---|---|---|
| Artikelnr. (SKU / item number) | Hidden | **Not visible** | ✓ PASS |
| Marke (vendor / brand — "Homin") | Visible | **Visible** | ✓ PASS |
| Versand & Rückgabe (shipping & returns) | Visible | **Visible** | ✓ PASS |
| Teilen (share button) | Visible | **Visible** | ✓ PASS |
| Product template scope | Default product only | **Only one template exists** | ✓ PASS |

---

## Screenshot Evidence — Filed 2026-11-26

**Original source:** `C:\Users\PC\OneDrive\Pictures\Screenshots\`
**Copied to:** `evidence/piranav/screenshots/`
**Originals preserved — not moved or renamed.**

| # | Original Filename | Copied Evidence Filename | Contents |
|---|---|---|---|
| 1 | `Screenshot 2026-11-26 094922.png` | `homingmbh-req6-before-sku-visible-094922.png` | **BEFORE state** — Produktdetails section showing Marke: Homin + Artikelnr.: WSHLBM+LDMST64E274 (SKU visible, red circle annotation marking it for removal) |
| 2 | `Screenshot 2026-11-26 095237.png` | `homingmbh-req6-theme-editor-config-095237.png` | **Theme Editor config** — homingmbh staging, Default product template (assigned to 100+ products), Product details table panel: Show brand (vendor) ON, Show item number (SKU) OFF, Show weight ON |
| 3 | `Screenshot 2026-11-26 095433.png` | `homingmbh-req6-after-sku-hidden-095433.png` | **AFTER state** — Live storefront product page: Produktdetails showing Marke: Homin only (Artikelnr. absent), Versand & Rückgabe visible, Teilen button visible |

### Screenshot 1 — BEFORE (094922)
Confirms SKU was previously visible on the storefront as `Artikelnr.: WSHLBM+LDMST64E274`. Red annotation marks the row targeted for removal.

### Screenshot 2 — Theme Editor Config (095237)
Confirms the exact Theme Editor settings applied:
- Template: **Default product** (assigned to 100+ products — only template in store)
- **Show brand (vendor): ON** (blue toggle)
- **Show item number (SKU): OFF** (grey toggle)
- **Show weight: ON** (blue toggle)
- Section heading: **Produktdetails**

### Screenshot 3 — AFTER / Live Storefront (095433)
Confirms post-change state on the live storefront:
- **Artikelnr. not present** — SKU row completely removed from Produktdetails
- **Marke: Homin** — vendor visible
- **Versand & Rückgabe** — accordion visible
- **Teilen** — share button visible

---

## Queryability
YES — this evidence file documents the full configuration state and confirmed storefront verification results.

## Status
**COMPLETE — PASS** ✓ (2026-11-26)
