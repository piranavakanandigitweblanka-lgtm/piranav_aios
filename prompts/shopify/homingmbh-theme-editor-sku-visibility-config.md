# Prompt: Homingmbh Shopify — Theme Editor Product Detail Visibility Configuration

---

## Category
shopify / configuration

## Purpose
Configure product detail page (PDP) visibility settings via the Shopify Theme Editor. Specifically controls whether SKU, vendor, and weight are displayed to customers on the storefront. No code changes required — settings are native Dawn theme controls.

## When to Use
- When a client wants to show or hide SKU, vendor, or weight on the product page
- For any Dawn-based Shopify theme where PDP display options are managed via Theme Editor
- Before any custom Liquid code is written — always check Theme Editor controls first

---

## Prompt (reusable)

> In Shopify Admin → Online Store → Themes → Customize → navigate to the Default product template.
> Under the product information block, locate the display toggles:
> - Show item number (SKU): ON / OFF
> - Show brand (vendor): ON / OFF
> - Show weight: ON / OFF
> Set each to the required value. Save. No code changes required.
> SKU data remains stored in Shopify Admin regardless of this display setting.
> Document the resulting configuration in AIOS evidence.

## Key Technical Constraints
- This is a Theme Editor UI change only — no Liquid, CSS, or JS files are modified
- Setting applies to the Default product template (all products unless template suffix overrides)
- SKU is hidden from storefront but NOT deleted from Shopify Admin data
- Change is immediately live on the storefront once saved in Theme Editor
- Reversible at any time via the same Theme Editor toggle

## Expected Output
- Configuration confirmation: which toggles are ON/OFF
- Storefront validation step (manual browser check recommended)

## First Used
2026-11-26 — Homingmbh DE store, Task HOMING-2026-11-26-004 (REQ-6)
