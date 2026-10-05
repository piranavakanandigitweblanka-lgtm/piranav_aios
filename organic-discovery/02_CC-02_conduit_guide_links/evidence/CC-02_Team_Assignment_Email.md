# CC-02 — Team Assignment Email (Updated with Exact Code Locations)

**Prepared:** 2026-10-05 (updated with exact HTML line mapping)  
**Status:** Draft — ready to send  

---

**Subject:** CC-02 – Conduit Lighting Collection Description Link Fixes

---

Hi Muguntha,

I've audited all 26 links in the **Conduit Lighting collection description** (the HTML guide below the product grid at `https://ledsone.co.uk/collections/conduit-lighting`).

5 links are broken. I've mapped the exact location of each one in the collection description HTML so the team can find and fix them directly.

---

## Problems 1 and 2 — Ready to implement

These two have confirmed in-stock replacements. Please confirm and the team can implement immediately.

---

### Problem 1 — 20mm Distance Saddle Mount Metal Bracket — H3 Heading

**Location in collection description:**
`20mm Distance Saddle Mount Metal Bracket section → H3 heading`

**Current code:**
```html
<h3><a href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover" target="_blank">20mm Distance Saddle Mount Metal Bracket</a></h3>
```

**Search string (to locate in HTML editor):**
```
circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover
```

**Issue:**
The heading links to a Circular Conduit Box Lid (~5548, sold out, 0 stock). This is also the wrong product — the section is about a Saddle Mount Bracket, not a Box Lid.

**Replace the href with:**
```
https://ledsone.co.uk/collections/conduit-lighting/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770
```
(20mm Saddle Mount variant of ~5554 — in stock)

**Occurrences to change:** 1

---

### Problem 2 — 90-Degree Bend (Smooth Angle Bend) — Both Images

**Location in collection description:**
`90-Degree Bend (Smooth Angle Bend) section → two product images`
(Note: the section heading already links to the correct product — only the images need changing)

**Current code (both images — same figure block, same line):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170" target="_blank">
  <img alt="Smooth 90-degree conduit bend, view 1." ...>
</a>
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170" target="_blank">
  <img alt="Smooth 90-degree conduit bend, view 2." ...>
</a>
```

**Search string (to locate in HTML editor):**
```
conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170
```

**Issue:**
Both image links go to a sold-out Industrial Wall Light Kit (~5569, 0 stock). Wrong product type — the images show a bend fitting, not a wall light.

**Replace ALL occurrences of the href with:**
```
https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting
```
(~5552 90° Elbow Bend — 161 in stock)

**Occurrences to change:** 2 (both image links — same search string, same figure block)

---

## Problems 3, 4, 5 — Decision required before implementing

**DO NOT change these links yet.** I need your input first.

---

### Problem 3 — 90-Degree Bend (Sharp Angle Bend) — Both Images

**Location:**
`90-Degree Bend (Sharp Angle Bend) section → two product images`

**Current code (both images — same figure block):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1" target="_blank">
  <img alt="Sharp 90-degree conduit bend, view 1." src="https://ledsone.co.uk/cdn/shop/files/1_1733142221_674da6cde9cd7.jpg" ...>
</a>
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1" target="_blank">
  <img alt="Sharp 90-degree conduit bend, view 2." src="https://ledsone.co.uk/cdn/shop/files/2_1733121691285_3.jpg..." ...>
</a>
```

**Search string:**
```
conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1
```

**Issue:**
Both links go to a sold-out wall light (~5588, 0 stock). Wrong product type. The images show a black sharp-angle bend fitting. The images are hosted on the ledsone.co.uk CDN (not Blogger), which suggests the correct product exists on the site.

> **Question for Muguntha:** What is the correct product URL for the black sharp-angle-bend fitting shown in this section?

**DO NOT CHANGE until URL is confirmed.**

---

### Problem 4 — Dimmer Rotary Switch — H4 Heading and Image

**Location:**
`Dimmer Rotary Switch section → H4 heading + section image`

**Current code — H4 heading:**
```html
<h4><span><a href="https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp" target="_blank">Dimmer Rotary Switch</a></span></h4>
```

**Current code — section image:**
```html
<figure class="float-img-left"><a href="https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp" target="_blank">
  <img alt="Metal Dimmer Rotary Switch knob." ...>
</a></figure>
```

**Search string:**
```
dimmer-switch-rotary-switch-knob-for-lamp
```

**Issue:**
~5511 Dimmer Rotary Knob is sold out (0 stock). No direct replacement found in the current switches collection.

> **Question for Muguntha:** Is ~5511 being restocked? If not, please advise the preferred action — hold the section as-is, or link to an alternative.

**Occurrences to change when approved:** 2 (H4 heading + image link)

**DO NOT CHANGE until decision confirmed.**

---

### Problem 5 — Bunker Bulkhead Cage Wall Sconce Lamp Light — H4 Heading

**Location:**
`Bunker Bulkhead Cage Wall Sconce Lamp Light section → H4 heading only`
(Note: the section images are plain `<img>` tags — they are NOT hyperlinks. Only the heading needs updating.)

**Current code — H4 heading:**
```html
<h4>3. <a href="https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light" target="_blank">Bunker Bulkhead Cage Wall Sconce Lamp Light</a></h4>
```

**Search string:**
```
industrial-bunker-bulkhead-cage-wall-sconce-lamp-light
```

**Issue:**
The link returns 404 — the product page no longer exists.

**Candidate replacement found:**
`https://ledsone.co.uk/collections/conduit-lighting/products/exposed-lighting`
(~6546 Nautical Bulkhead Flush Mount Ceiling Light Wire Cage E27 — in stock, £25.49)

> **Question for Muguntha:** Does the Nautical Bulkhead Flush Mount (~6546) match the style intended for the Bunker Bulkhead section? If yes, I'll use this as the replacement.

**Occurrences to change when approved:** 1 (H4 heading only)

**DO NOT CHANGE until confirmed.**

---

## Summary

| # | Section | Element | Search String | Status | Decision needed |
|---|---|---|---|---|---|
| 1 | 20mm Distance Saddle Mount Metal Bracket | H3 heading | `circular-conduit-box-lid-...` | ✅ Ready | Confirm to implement |
| 2 | 90-Degree Bend (Smooth Angle Bend) | Both images (×2) | `...for-indoor-use/14847065719170` | ✅ Ready | Confirm to implement |
| 3 | 90-Degree Bend (Sharp Angle Bend) | Both images (×2) | `...for-indoor-use-1` | 🔴 Blocked | Correct product URL? |
| 4 | Dimmer Rotary Switch | H4 heading + image | `dimmer-switch-rotary-switch-knob-for-lamp` | 🔴 Blocked | ~5511 restock status? |
| 5 | Bunker Bulkhead Cage Wall Sconce Lamp Light | H4 heading only | `industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | 🔴 Blocked | Does ~6546 match style? |

Please confirm Problems 1 and 2 to proceed, and advise on Problems 3, 4, and 5.

Screenshots and full audit records are maintained in the CC-02 task folder.

Thanks,
Piranav
