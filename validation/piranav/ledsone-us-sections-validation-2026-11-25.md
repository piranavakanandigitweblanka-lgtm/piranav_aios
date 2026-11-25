# Validation — LEDSone US Homepage Sections
**Date:** 2026-11-25
**Validator:** Claude Code (static)
**Live browser test:** PENDING — Piranav to upload and verify

---

## Files Validated

### ld-hero.liquid
| Check | Result |
|---|---|
| Schema valid JSON | PASS |
| All settings referenced in Liquid | PASS |
| Image picker uses `image_url` filter correctly | PASS |
| No hardcoded translation keys | PASS |
| Responsive breakpoints: ≤1199, ≤989, ≤767, ≤479 | PASS |
| `disabled_on: header/footer` set | PASS |
| Preset defined | PASS |
| CSS loaded via `asset_url stylesheet_tag` | PASS |

### ld-hero.css
| Check | Result |
|---|---|
| All class names scoped under `.bls__ld-hero` | PASS |
| No global overrides | PASS |
| Theme padding helpers (spt/spb) included | PASS |
| Mobile tiles stack at ≤479px | PASS |
| Gold button, ghost button, tile hover states | PASS |

### category-navigation.liquid
| Check | Result |
|---|---|
| `display: none` removed (user edit) | PASS |
| Shows on desktop and mobile | PASS |
| Mobile overflow-x scroll preserved | PASS |
| Tag colour via inline style (user's original method) | PASS |

### snippets/header.liquid (h_layout4)
| Check | Result |
|---|---|
| `ldh4-menu-mobile-only` class added to correct div | PASS |
| `display: none` on desktop (≥1200px) | PASS |
| Visible again at ≤1199px | PASS |
| Mobile hamburger drawer unaffected | PASS |
| Other layouts (h_layout1–3, h_layout5–7) untouched | PASS |
| Style block added before `</header>` | PASS |

---

## Static Pass / Fail Summary

| File | Static Result | Live Test Required |
|---|---|---|
| `sections/ld-hero.liquid` | PASS | YES — image, tiles, buttons, mobile layout |
| `assets/ld-hero.css` | PASS | YES — hover states, responsive |
| `sections/category-navigation.liquid` | PASS | YES — desktop visibility confirmed |
| `snippets/header.liquid` | PASS | YES — desktop hides menu, mobile drawer works |

---

## Live Test Checklist (Piranav — after upload)
- [ ] ld-hero: Left copy panel renders correctly on desktop
- [ ] ld-hero: Right image + 2 tiles render correctly
- [ ] ld-hero: Stacks to 1 col on tablet, tiles stack on small mobile
- [ ] ld-hero: Gold button and ghost button hover work
- [ ] category-navigation: Visible on desktop (not hidden)
- [ ] category-navigation: Swipes horizontally on mobile
- [ ] header h_layout4: Horizontal-menu NOT visible on desktop ≥1200px
- [ ] header h_layout4: Hamburger menu opens drawer on mobile
- [ ] header h_layout4: Nav bar visible on tablet ≤1199px
