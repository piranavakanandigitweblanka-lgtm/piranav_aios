# CC-02 — Affected Links

**Source:** CC-02_Link_Audit.md (audit date 2026-10-05)  
**Target page:** https://ledsone.co.uk/collections/conduit-lighting  
**Location of all problems:** Links embedded within the Conduit Lighting collection description (the long HTML guide below the product grid)  
**Total links audited:** 26  
**Total problems:** 5 (4 sold out + 1 × 404)  

---

## Affected Links Table

| Problem | Collection Description Section | Affected Element | Current Link | Destination Product / Page | Status | Required Action |
|---|---|---|---|---|---|---|
| **1** | **20mm Distance Saddle Mount Metal Bracket** | H3 section heading (clickable text link) | `https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | ~5548 Circular Conduit Box Lid | ❌ **SOLD OUT** (0 stock) + **wrong product** (heading says "Saddle Mount Bracket" but links to a Box Lid) | Replace H3 link with correct Saddle Mount product: `/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770` (Saddle Mount variant of ~5554, IN STOCK) — **READY TO IMPLEMENT** |
| **2** | **Smooth 90° Angle Bend** | Two product images within the section (both images link to same URL) | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170` | ~5569 Industrial 20mm Conduit Wall Light Kit | ❌ **SOLD OUT** (0 stock) + **wrong product type** (images show a bend fitting but link resolves to a finished wall light) | Replace both image links with the correct 90° elbow bend product: `/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` (~5552, 161 IN STOCK) — this is already the correct URL used by the H3 heading of the same section — **READY TO IMPLEMENT** |
| **3** | **Sharp 90° Angle Bend** | Two product images within the section (both images link to same URL) | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1` | ~5588 Conduit Pipe Wall Light | ❌ **SOLD OUT** (0 stock) + **wrong product type** (images show a black sharp-angle bend fitting but link resolves to a finished wall light) | Replacement URL unknown — images are hosted on ledsone.co.uk CDN suggesting the correct black sharp-angle-bend fitting exists on the site. Muguntha to confirm correct product URL. **BLOCKED — awaiting confirmation** |
| **4** | **Dimmer Rotary Switch** | Section heading (H3 text link) + section image (both link to same URL) | `https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp` | ~5511 Dimmer Switch Rotary Knob | ❌ **SOLD OUT** (0 stock). No replacement dimmer switch found in stock. | Muguntha to confirm: is ~5511 being restocked? If not, escalate decision on whether section should be held or a collection-level link used. **BLOCKED — awaiting Muguntha decision** |
| **5** | **Bunker Bulkhead Cage Wall Sconce Lamp Light** | Section heading (H3 text link) + section image (both link to same URL) | `https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | (no page) | ❌ **404 — page does not exist**. Product was removed or URL changed. | Candidate replacement identified: `https://ledsone.co.uk/collections/conduit-lighting/products/exposed-lighting` (~6546 Nautical Bulkhead Flush Mount Ceiling Light, IN STOCK, £25.49). Muguntha / Piranav to confirm whether ~6546 matches the style of the removed product before implementing. **BLOCKED — awaiting visual confirmation** |

---

## Location Notes

All 5 problems are in the **collection description** — the long HTML guide embedded below the product grid on `https://ledsone.co.uk/collections/conduit-lighting`. This is not a blog post or standalone page. It is the collection description field in the Shopify admin for the Conduit Lighting collection.

The guide is structured as sections, each covering one conduit component type (e.g. "Smooth 90° Angle Bend", "Dimmer Rotary Switch"). Each section contains:
- An H3 heading that is itself a hyperlink to a product
- One or two product images that are also hyperlinks

Problems 1, 4, and 5 affect the **H3 heading link** of their respective section (and in the case of Problem 4 and 5 also the image link — both point to the same broken URL).  
Problems 2 and 3 affect **image links only** — the H3 headings of those sections link to different (live) products.

---

## Additional Note — Problem 1 Mismatch

The H3 heading text for section "20mm Distance Saddle Mount Metal Bracket" currently links to a **Circular Conduit Box Lid** — a completely different product. This is both a sold-out link and a wrong-product link. The image within the same section correctly links to the Saddle Mount variant. The H3 heading link is the broken element.

---

## Problems Ready to Implement

| Problem | Action | Replacement URL | Stock |
|---|---|---|---|
| 1 | Replace H3 heading link in "20mm Distance Saddle Mount Metal Bracket" section | `https://ledsone.co.uk/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770` | IN STOCK |
| 2 | Replace both image links in "Smooth 90° Angle Bend" section | `https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` | 161 in stock |

## Problems Blocked — Awaiting Decision

| Problem | Blocked On | Decision Required |
|---|---|---|
| 3 | Correct product URL for black sharp-angle-bend fitting | Muguntha / Piranav to confirm URL |
| 4 | ~5511 restock status | Muguntha to confirm restock or authorise alternative |
| 5 | Visual match of ~6546 vs removed product | Muguntha / Piranav to confirm style match |
