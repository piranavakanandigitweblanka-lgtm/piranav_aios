# Evidence — LEDSone US Homepage Sections Build
**Date:** 2026-11-25
**Project:** shopify_projects/ledsone us
**Session type:** Shopify Liquid section development
**Status:** PASS (local — upload to theme manually)

---

## Tasks Completed

### 1. ld-hero.liquid + ld-hero.css — NEW
**Files:**
- `shopify_projects/ledsone us/sections/ld-hero.liquid`
- `shopify_projects/ledsone us/assets/ld-hero.css`

**What it does:**
- 2-column hero section matching ledsone-us-homepage-preview/index.html exactly
- Left: dark panel (`#17150F`) — eyebrow (gold), heading, body text, 2 CTA buttons (gold filled + ghost outline)
- Right: image picker (hover zoom) + 2 tiles (navy + cream/paper)
- All content editable in theme editor: eyebrow, heading, body, btn1/btn2 labels+URLs, photo+link, tile1/tile2 kicker/title/sub/url
- Responsive: 2-col desktop → stacked tablet (≤989px, photo above copy) → mobile (smaller type, tiles stack at ≤479px)

**CSS tokens used (from preview):**
- `--night: #17150F`, `--gold: #E0B464`, `--navy: #1C2B5A`, `--paper: #F4F2EE`, `--sand: #EDE7DC`, `--brown: #7A5414`, `--muted: #5B5B5B`

**Breakpoints:** ≤1199px, ≤989px, ≤767px, ≤479px

---

### 2. category-navigation.liquid — USER EDITED (display:none removed)
**File:** `shopify_projects/ledsone us/sections/category-navigation.liquid`

**Change:** User manually commented out `display: none` and `background: #f8f8f8` on `.category-nav-bar` — section now visible on both desktop and mobile.

**Current state:** Original structure preserved, user's manual edit kept.

---

### 3. snippets/header.liquid — h_layout4 horizontal-menu desktop hide
**File:** `shopify_projects/ledsone us/snippets/header.liquid`

**Change:**
- Added class `ldh4-menu-mobile-only` to the `col-header-center` div wrapping `section 'horizontal-menu'` in h_layout4
- Added `<style>` block before `</header>`:
  ```css
  .h_layout4 .ldh4-menu-mobile-only { display: none; }
  @media (max-width: 1199px) {
    .h_layout4 .ldh4-menu-mobile-only { display: block; }
  }
  ```
- Result: horizontal-menu nav bar hidden on desktop (≥1200px), visible on mobile/tablet — hamburger drawer still works

**Only h_layout4 affected. All other layouts untouched.**

---

## Files Created / Modified Today

| File | Action | Status |
|---|---|---|
| `sections/ld-hero.liquid` | Created | Local — upload to theme |
| `assets/ld-hero.css` | Created | Local — upload to theme |
| `sections/category-navigation.liquid` | User edited (display:none removed) | Local — upload to theme |
| `snippets/header.liquid` | Modified (ldh4-menu-mobile-only) | Local — upload to theme |

---

## Files Reverted / Deleted This Session

| File | Reason |
|---|---|
| `sections/ld-subnav.liquid` | Created then reverted — user chose category-navigation.liquid approach instead |
| `assets/ld-subnav.css` | Same as above |
| `category-navigation.liquid` | Rebuilt twice (Option A, Option B) — user reverted both times, then manually edited original |

---

## Design Source
- `C:\Users\PC\Downloads\piranav-handover-ledsone-us\piranav-handover-ledsone-us\ledsone-us-homepage-preview\index.html`
- `C:\Users\PC\Downloads\piranav-handover-ledsone-us\piranav-handover-ledsone-us\design\Homepage-desktop-html\Main.dc.html`

---

## Upload Checklist (Piranav)
- [ ] `sections/ld-hero.liquid`
- [ ] `assets/ld-hero.css`
- [ ] `sections/category-navigation.liquid`
- [ ] `snippets/header.liquid`
