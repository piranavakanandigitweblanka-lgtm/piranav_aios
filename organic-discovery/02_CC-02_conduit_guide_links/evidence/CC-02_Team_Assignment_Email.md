# CC-02 — Team Assignment Email

**Prepared:** 2026-10-05  
**Status:** Draft — ready to send  

---

**Subject:** CC-02 – Conduit Lighting Collection Description Link Fixes

---

Hi Muguntha,

I've completed an audit of the links inside the **Conduit Lighting collection description** on ledsone.co.uk. The collection description is the HTML guide embedded below the product grid at:

https://ledsone.co.uk/collections/conduit-lighting

Out of 26 links checked, 5 are broken. These are not blog post links — they are links embedded directly within the collection description content. Details are below.

---

## Broken Links Found

| # | Section in Collection Description | Affected Element | Current Link (broken) | Issue |
|---|---|---|---|---|
| 1 | 20mm Distance Saddle Mount Metal Bracket | H3 heading — text link | `.../circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | Sold out (0 stock) + wrong product — heading says "Saddle Mount Bracket" but link goes to a Circular Box Lid |
| 2 | Smooth 90° Angle Bend | Both product images in the section | `.../conduit-pipe-wall-light-vintage-indoor.../14847065719170` | Sold out (0 stock) + wrong product type — images show a bend fitting but link goes to a completed wall light kit |
| 3 | Sharp 90° Angle Bend | Both product images in the section | `.../conduit-pipe-wall-light-vintage-indoor...-1` | Sold out (0 stock) + wrong product type — images show a black sharp-angle bend but link goes to a completed wall light |
| 4 | Dimmer Rotary Switch | H3 heading + image | `.../dimmer-switch-rotary-switch-knob-for-lamp` | Sold out (0 stock) — ~5511 Dimmer Switch Rotary Knob. No replacement currently in stock. |
| 5 | Bunker Bulkhead Cage Wall Sconce Lamp Light | H3 heading + image | `.../industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | 404 — page no longer exists |

---

## What We Can Fix Now

**Problems 1 and 2 have confirmed in-stock replacements and are ready to implement.**

**Problem 1 — Saddle Mount section heading**
Replace the H3 heading link with the correct Saddle Mount product:
`https://ledsone.co.uk/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770`
(20mm Saddle Mount variant — in stock)

**Problem 2 — Smooth 90° Bend section images (×2)**
Replace both image links with the correct 90° elbow bend product:
`https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting`
(~5552 — 161 in stock)

Please confirm and I will implement both immediately.

---

## What Needs Your Decision

**Problem 3 — Sharp 90° Bend section images (×2)**
The images in this section show a black sharp-angle bend fitting, but both links go to a sold-out wall light. The section images are hosted on the ledsone.co.uk CDN, which suggests the correct black sharp-angle-bend product exists on the site.

> **Question for Muguntha:** What is the correct product URL for the black sharp-angle-bend fitting shown in this section?

---

**Problem 4 — Dimmer Rotary Switch**
~5511 Dimmer Switch Rotary Knob is sold out with no current in-stock replacement found.

> **Question for Muguntha:** Is ~5511 being restocked? If not, please advise the preferred action — hold the section as-is until restock, or use a collection-level link.

---

**Problem 5 — Bunker Bulkhead Cage Wall Sconce**
The current link returns 404. The product has been removed or the URL has changed.

A possible replacement has been identified:
`https://ledsone.co.uk/collections/conduit-lighting/products/exposed-lighting`
(~6546 Nautical Bulkhead Flush Mount Ceiling Light Wire Cage E27, IN STOCK, £25.49)

> **Question for Muguntha:** Does the Nautical Bulkhead Flush Mount (~6546) match the style intended for the Bunker Bulkhead section? If yes, I will use this as the replacement.

---

## Summary of Actions

| Problem | Status | Next Step |
|---|---|---|
| 1 — Saddle Mount heading | Ready | Piranav implements on confirmation |
| 2 — Smooth 90° bend images | Ready | Piranav implements on confirmation |
| 3 — Sharp 90° bend images | Blocked | Muguntha to confirm correct product URL |
| 4 — Dimmer switch | Blocked | Muguntha to confirm restock or alternative decision |
| 5 — Bunker bulkhead | Blocked | Muguntha / Piranav to confirm ~6546 matches |

---

Screenshots and full audit records are maintained in the CC-02 task folder.

Please let me know your decisions on Problems 3, 4, and 5, and I will proceed.

Thanks,
Piranav
