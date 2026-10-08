# Conduit Stock + Price Cards — Project Overview

**Created:** 2026-10-07
**Current status:** DISCOVERY COMPLETE — IMPLEMENTATION NOT STARTED

---

## Project Details

| Field | Value |
|---|---|
| Project | Conduit Lighting — Conduit 1–2: Real stock labels + "From" prices on cards |
| Owner | Piranav |
| Collection page | https://ledsone.co.uk/collections/conduit-lighting |
| Deadline | Thu 8 Oct 2026 18:00 SL |
| Scope | Theme fix: `snippets/product-item.liquid` and `snippets/price.liquid` |

---

## Relationship to Existing Projects

This task is related to `conduit-accessories-build/` (Step 6 — Stock message is in scope there) but is architecturally distinct. The fixes are in global theme snippets (`product-item.liquid`, `price.liquid`) that affect all collection pages, not conduit-specific templates only.

---

## Parts

| Part | Name | Status |
|---|---|---|
| 1 | Fix incorrect "In Stock" label — partial/no stock products | Not started |
| 2 | Show "From" prefix when option prices differ + remove zero-price sale HTML | Not started |

---

## Folder Map

| Folder | Purpose |
|---|---|
| `00_project-overview/` | This file |
| `01_discovery/` | Discovery report — file audit, root cause analysis, architecture |
| `02_implementation/` | Implementation work (not started) |
| `03_validation/` | Validation evidence (not started) |
| `99_closure/` | Closure records |
