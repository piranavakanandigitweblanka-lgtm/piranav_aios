# Evidence: Homingmbh DE — Theme Integration Audit + Mega Menu Experiment
**Task ID:** HOMING-2026-11-26-008 / HOMING-2026-11-26-009
**Date:** 2026-11-26

---

## 1. Active Theme

| Field | Value |
|---|---|
| Live theme | `homingmbh staging` — `gid://shopify/OnlineStoreTheme/207642034513` |
| Working copy | `Piranav work homingmbh staging` — `gid://shopify/OnlineStoreTheme/212301218129` |
| Theme base | Custom build on Dawn framework |

---

## 2. Current Header Settings (both themes as of 2026-11-26)

```json
"menu": "main-menu",
"menu_type_desktop": "dropdown"
```

Integration requires changing to `"menu": "hauptnavigation"` and `"menu_type_desktop": "mega"`.

---

## 3. Theme Capability Confirmed

| Capability | Status |
|---|---|
| Dropdown menu (snippets/header-dropdown-menu.liquid) | Present — currently active |
| Mega menu (snippets/header-mega-menu.liquid) | Present — ready, not active |
| Mobile drawer (snippets/header-drawer.liquid) | Present — active on < 990px |
| Mega menu CSS (assets/component-mega-menu.css) | Present and unmodified |
| Hover-open JS on dropdown | Custom addition by Sharmi (2025-04-17) |

Integration requires zero Liquid code changes — settings change only.

---

## 4. Mega Menu 4-Row Experiment — Cancelled

**What was attempted:**
- Replace `grid-template-columns: repeat(6, 1fr)` with column-flow grid (`grid-auto-flow: column`, `grid-template-rows: repeat(4, auto)`, `grid-auto-columns: minmax(14rem, 20rem)`)
- Fix condensed override (`display: block` → `display: grid`)
- Target: working copy only, not live theme

**What happened:**
- CSS written successfully to working copy (pending state)
- `sed` command to update `header-group.json` blocked by auto-mode classifier
- Piranav cancelled experiment before `theme_commit` was called
- CSS reverted cleanly — working copy returned to baseline, `pending: []`

**Final state:**
- Working copy: clean — no pending changes, original CSS restored
- Live theme: untouched throughout
- Shopify menus/collections: untouched throughout

---

## 5. Integration Next Steps (pending Piranav)

To wire `Hauptnavigation` to the live theme:

**Option A — Theme Editor (no file editing):**
1. Shopify Admin → Online Store → Themes → homingmbh staging → Customize
2. Header section → Menu → change to `Hauptnavigation`
3. Desktop menu type → change to `Mega`
4. Save

**Option B — Working copy edit + publish:**
1. Edit `sections/header-group.json` on working copy: `"menu": "hauptnavigation"`, `"menu_type_desktop": "mega"`
2. `theme_commit` on working copy
3. Preview via Shopify preview link
4. Publish working copy to replace live theme (requires explicit Piranav approval)
