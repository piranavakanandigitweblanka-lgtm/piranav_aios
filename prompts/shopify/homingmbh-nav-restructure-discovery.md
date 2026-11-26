# Prompt: Homingmbh Shopify — Navigation Restructure Existing Asset Discovery

---

## Category
shopify / navigation / discovery

## Purpose
Audit the existing navigation structure on a Dawn-based Shopify store to determine what changes are needed to implement a new menu architecture. Inventories the current live menu, reads all header/navigation Liquid and CSS files, cross-references required categories against existing collections, and identifies gaps — all read-only before any implementation.

## When to Use
- Before implementing any menu or navigation restructure on a Dawn-based Shopify theme
- When a client provides new navigation category requirements that must be mapped to existing collections
- As the discovery phase of a REQ task covering navigation restructure

---

## Prompt (reusable)

> Audit the existing navigation on this Shopify store (Dawn-based theme) before implementing any changes.
>
> Read-only tasks:
> 1. Fetch the current main-menu structure via Admin API (all items and sub-items to 3 levels)
> 2. Identify the live theme ID
> 3. Read these theme files: sections/header.liquid, snippets/header-mega-menu.liquid, snippets/header-dropdown-menu.liquid, snippets/header-drawer.liquid
> 4. Read these CSS files: assets/component-mega-menu.css, assets/component-menu-drawer.css, assets/component-list-menu.css
> 5. Identify which menu_type_desktop is currently active (dropdown / mega / drawer)
> 6. Cross-reference the required new navigation categories against existing collections
> 7. Identify: which collections already exist, which need renaming, which are gaps (no collection exists)
> 8. Report the implementation work required to achieve the new structure
>
> Do NOT modify any menu, collection, or theme file during discovery.
> Save all findings as AIOS evidence.

## Key Technical Constraints
- Dawn theme supports 3 menu types: `dropdown` (hover-triggered), `mega` (full-width panel), `drawer` (always-visible slide-in)
- Menu type is controlled by `section.settings.menu_type_desktop` in header.liquid schema
- Mega menu activates for items that have child links in the Shopify menu admin
- Mega menu grid: `repeat(6, minmax(0, 1fr))` — 6 columns max width
- All 17 Homingmbh collections use `productType EQUALS` smart rules — navigation changes require matching collection handles
- Dawn header-dropdown-menu.liquid has a custom hover JS patch added 2025-04-17 (see comment in file)
- `itemsCount` field does NOT exist on the Shopify `Menu` GraphQL type — omit it

## Expected Output
- Current menu structure (flat or nested)
- Theme nav type currently active
- Liquid file summary (mega menu capabilities, drawer capabilities)
- Required vs existing collection cross-reference table
- Gap analysis: missing collections, naming mismatches, empty collections
- Implementation plan summary

## First Used
2026-11-26 — Homingmbh DE store, Task HOMING-2026-11-26-005 (REQ-1 Navigation Restructure Discovery)
