# CC-02 — Conduit Lighting Collection Description Link Fix
## Team Assignment Summary

**Prepared:** 2026-10-05  
**Prepared by:** Piranav  
**Task code:** CC-02  
**Status:** IN PROGRESS — 2 fixes ready to implement, 3 awaiting decision  

---

## Target

**Page:** https://ledsone.co.uk/collections/conduit-lighting  
**Location of problems:** The collection description — the HTML guide embedded below the product grid on the Conduit Lighting collection page. This is not a blog post. It is the collection description field in the Shopify admin.

---

## What Was Found

26 links were audited inside the collection description. 5 are broken:

- 4 links point to sold-out products (including 2 that also link to the wrong product type)
- 1 link returns a 404 (page no longer exists)

---

## Problem 1 — Saddle Mount Section: H3 Heading Links to Wrong, Sold-Out Product

- **Section:** Collection Description → "20mm Distance Saddle Mount Metal Bracket"
- **Affected element:** H3 section heading (clickable text link)
- **Current link:** `https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover`
- **Issue:** The heading text says "20mm Distance Saddle Mount Metal Bracket" but the link goes to a Circular Conduit Box Lid (~5548) — a different product entirely. ~5548 is also sold out (0 stock).
- **Note:** The image in the same section correctly links to the Saddle Mount product. Only the H3 heading link is broken.
- **Required action:** Replace the H3 heading link with: `https://ledsone.co.uk/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770` (20mm Saddle Mount variant of ~5554, in stock)
- **Status: READY TO IMPLEMENT**

---

## Problem 2 — Smooth 90° Bend Section: Both Images Link to Sold-Out Wall Light

- **Section:** Collection Description → "Smooth 90° Angle Bend" (also described as "90-Degree Bend (Smooth Angle)")
- **Affected element:** Two product images within the section — both link to the same URL
- **Current link:** `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170`
- **Issue:** The images show a smooth 90° bend fitting, but both links go to an Industrial Conduit Wall Light Kit (~5569) — a completely different product type. ~5569 is also sold out (0 stock).
- **Note:** The H3 heading of this section already correctly links to the right 90° elbow bend product (~5552, 161 in stock). Only the image links are broken.
- **Required action:** Replace both image links with: `https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` (~5552, 161 in stock)
- **Status: READY TO IMPLEMENT**

---

## Problem 3 — Sharp 90° Bend Section: Both Images Link to Sold-Out Wall Light

- **Section:** Collection Description → "Sharp 90° Angle Bend" (also described as "90-Degree Bend (Sharp Angle)")
- **Affected element:** Two product images within the section — both link to the same URL
- **Current link:** `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1`
- **Issue:** The images show a black sharp-angle bend fitting, but both links go to a Conduit Pipe Wall Light (~5588) — a completely different product type. ~5588 is also sold out (0 stock).
- **Note:** The images are hosted on the ledsone.co.uk CDN (not a third-party host), which suggests the correct black sharp-angle-bend product exists on the site. The correct product URL has not been confirmed.
- **Required action:** Confirm the correct product URL for the black sharp-angle-bend fitting. Do not implement until confirmed.
- **Muguntha / Piranav decision required:** What is the correct product URL for the black sharp-angle-bend fitting shown in this section?
- **Status: BLOCKED — awaiting URL confirmation**

---

## Problem 4 — Dimmer Switch Section: Heading and Image Both Link to Sold-Out Product

- **Section:** Collection Description → "Dimmer Rotary Switch"
- **Affected element:** H3 section heading (text link) + section image — both link to the same URL
- **Current link:** `https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp`
- **Issue:** ~5511 Dimmer Switch Rotary Knob is sold out (0 stock). No direct replacement dimmer switch was found in the current switches collection.
- **Required action:** Muguntha to confirm: is ~5511 being restocked? If not, a decision is needed on whether this section should be held or an alternative link used. Do not remove or replace until confirmed.
- **Muguntha decision required:** Is ~5511 Dimmer Switch Rotary Knob being restocked? If not, what is the preferred action — hold the section, or replace with a collection-level link?
- **Status: BLOCKED — awaiting Muguntha restock decision**

---

## Problem 5 — Bunker Bulkhead Section: Heading and Image Both Return 404

- **Section:** Collection Description → "Bunker Bulkhead Cage Wall Sconce Lamp Light"
- **Affected element:** H3 section heading (text link) + section image — both link to the same URL
- **Current link:** `https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light`
- **Issue:** The page returns 404. The product no longer exists at this URL.
- **Candidate replacement identified:** `https://ledsone.co.uk/collections/conduit-lighting/products/exposed-lighting` — ~6546 "Nautical Bulkhead Flush Mount Ceiling Light Wire Cage E27", IN STOCK, £25.49. This is the closest current product in the Conduit Lighting collection to the bunker/bulkhead style described.
- **Required action:** Muguntha / Piranav to confirm whether ~6546 matches the style and context of the removed product. Do not implement until visually confirmed.
- **Muguntha decision required:** Does the Nautical Bulkhead Flush Mount (~6546) at `/products/exposed-lighting` match the style intended for the Bunker Bulkhead section?
- **Status: BLOCKED — awaiting visual confirmation**

---

## Summary of Decisions Required

| Problem | Decision Required | For |
|---|---|---|
| 3 | Correct product URL for black sharp-angle-bend fitting | Muguntha / Piranav |
| 4 | Is ~5511 Dimmer Rotary Switch being restocked? | Muguntha |
| 5 | Does ~6546 Nautical Bulkhead Flush Mount match the removed product style? | Muguntha / Piranav |

---

## Evidence Location

All audit findings, the full link table (26 links), and detailed problem records are maintained in:

`organic-discovery/02_CC-02_conduit_guide_links/evidence/CC-02_Link_Audit.md`
