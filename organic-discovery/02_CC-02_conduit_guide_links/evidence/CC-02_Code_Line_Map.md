# CC-02 — Code Line Map

**Source:** Browser-rendered HTML of the Conduit Lighting collection description, captured 2026-10-05.  
**Important:** Line numbers below are **Generated HTML line numbers from the browser-rendered source copy** — NOT Shopify admin source-file line numbers. The stored Shopify body_html will NOT contain the `bis_size` browser-extension attributes shown in the raw code. The stored HTML will be clean. Workers should search by the **old URL string** to locate each line safely.  
**Target:** Collection Description of `https://ledsone.co.uk/collections/conduit-lighting`  

---

## Problem 1 — 20mm Distance Saddle Mount Metal Bracket

**Section:**
`Collection Description → 20mm Distance Saddle Mount Metal Bracket`

**Element:**
`<h3>` section heading — text link

**Current URL:**
`https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover`

**Generated HTML line:**
`Line 177`

**Current code (raw from browser source):**
```html
<h3 bis_size="..."><a href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover" bis_size="..." target="_blank">20mm Distance Saddle Mount Metal Bracket</a></h3>
```

**Clean version (what Shopify body_html likely stores):**
```html
<h3><a href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover" target="_blank">20mm Distance Saddle Mount Metal Bracket</a></h3>
```

**Search string for worker:**
```
circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover
```

**Occurrences of this URL in full description:** 1

**Replacement URL (APPROVED):**
```
https://ledsone.co.uk/collections/conduit-lighting/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770
```

**Worker action:**
Replace the `href` value on Line 177 (search for `circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover`).
Change it to the approved replacement URL above.
The anchor text `20mm Distance Saddle Mount Metal Bracket` remains unchanged.

**Status: READY TO IMPLEMENT**

---

**Note — Line 178 (same section, image link — DO NOT CHANGE):**
The image `<figure>` immediately below (Line 178) already links to the correct Saddle Mount product (`conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770`). Do not modify Line 178.

```html
<figure class="float-img-left" ...><a href="https://ledsone.co.uk/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770" target="_blank"> <img alt="20mm Saddle Mount Metal Bracket for securing conduit pipes." src="..."> </a></figure>
```

---

## Problem 2 — Smooth 90° Angle Bend — Image 1

**Section:**
`Collection Description → 90-Degree Bend (Smooth Angle Bend) → First image`

**Element:**
First `<a href>` within the `<figure>` on Line 193

**Current URL:**
`https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170`

**Generated HTML line:**
`Line 193` (both image links are on the same line within one `<figure>` block)

**Image identifier:**
`alt="Smooth 90-degree conduit bend, view 1."`
`src filename: smoothangel1.jpg`

**Current code (clean version):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170" target="_blank">
  <img alt="Smooth 90-degree conduit bend, view 1." src="https://blogger.googleusercontent.com/.../smoothangel1.jpg" class="two-col-img">
</a>
```

**Search string for worker:**
```
conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170
```

**Occurrences of this URL in full description:** 2 (both on Line 193 — both must be changed)

**Replacement URL (APPROVED):**
```
https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting
```

**Worker action:**
Replace BOTH occurrences of the old URL on Line 193 with the approved replacement URL.
Both `<img>` alt texts remain unchanged.

**Status: READY TO IMPLEMENT**

---

## Problem 2 — Smooth 90° Angle Bend — Image 2

**Section:**
`Collection Description → 90-Degree Bend (Smooth Angle Bend) → Second image`

**Element:**
Second `<a href>` within the same `<figure>` on Line 193

**Current URL:**
`https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170`

**Generated HTML line:**
`Line 193` (same line as Image 1 — both within one `<figure>` block)

**Image identifier:**
`alt="Smooth 90-degree conduit bend, view 2."`
`src filename: smooth angel2.jpg`

**Current code (clean version):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170" target="_blank">
  <img alt="Smooth 90-degree conduit bend, view 2." src="https://blogger.googleusercontent.com/.../smooth%20angel2.jpg" class="two-col-img">
</a>
```

**Replacement URL (APPROVED):**
```
https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting
```

**Worker action:**
Same action as Image 1 — both occurrences of the old URL are replaced in one edit of Line 193.

**Status: READY TO IMPLEMENT**

---

**Note — Line 192 (same section, heading link — DO NOT CHANGE):**
The `<p><b><a>` heading for the Smooth Angle Bend section (Line 192) already links to the correct product. Do not modify Line 192.

```html
<p><b><a href="https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting" target="_blank">90-Degree Bend (Smooth Angle Bend)</a></b></p>
```

---

## Problem 3 — Sharp 90° Angle Bend — Image 1

**Section:**
`Collection Description → 90-Degree Bend (Sharp Angle Bend) → First image`

**Element:**
First `<a href>` within the `<figure>` on Line 201

**Current URL:**
`https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1`

**Generated HTML line:**
`Line 201` (both image links are on the same line within one `<figure>` block)

**Image identifier:**
`alt="Sharp 90-degree conduit bend, view 1."`
`src: https://ledsone.co.uk/cdn/shop/files/1_1733142221_674da6cde9cd7.jpg`

**Current code (clean version):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1" target="_blank">
  <img height="200" width="200" alt="Sharp 90-degree conduit bend, view 1." src="https://ledsone.co.uk/cdn/shop/files/1_1733142221_674da6cde9cd7.jpg" class="two-col-img">
</a>
```

**Search string for worker:**
```
conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1
```

**Occurrences of this URL in full description:** 2 (both on Line 201 — both must be changed when approved)

**Replacement URL:**
```
UNKNOWN — DO NOT CHANGE YET. Awaiting Muguntha/Piranav confirmation of correct black sharp-angle-bend product URL.
```

**Status: BLOCKED — awaiting URL confirmation**

---

## Problem 3 — Sharp 90° Angle Bend — Image 2

**Section:**
`Collection Description → 90-Degree Bend (Sharp Angle Bend) → Second image`

**Element:**
Second `<a href>` within the same `<figure>` on Line 201

**Current URL:**
`https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1`

**Generated HTML line:**
`Line 201`

**Image identifier:**
`alt="Sharp 90-degree conduit bend, view 2."`
`src: https://ledsone.co.uk/cdn/shop/files/2_1733121691285_3.jpg?v=1733122202`

**Current code (clean version):**
```html
<a href="https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1" target="_blank">
  <img height="200" width="200" alt="Sharp 90-degree conduit bend, view 2." src="https://ledsone.co.uk/cdn/shop/files/2_1733121691285_3.jpg?v=1733122202&width=823" class="two-col-img">
</a>
```

**Replacement URL:**
```
UNKNOWN — DO NOT CHANGE YET. Same as Image 1.
```

**Status: BLOCKED — awaiting URL confirmation**

---

**Note — Line 200 (same section, heading link — DO NOT CHANGE):**
The `<p><b><a>` heading for the Sharp Angle Bend section (Line 200) links to `conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple` (the ~5554 fittings bundle — LIVE). This may also need review but is not part of the original CC-02 scope. Do not change it in this task.

---

## Problem 4 — Dimmer Rotary Switch — H4 Heading

**Section:**
`Collection Description → Dimmer Rotary Switch → H4 heading`

**Element:**
`<h4>` section heading — text link (inside `<span>`)
**Note: This is an H4, not H3.**

**Current URL:**
`https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp`

**Generated HTML line:**
`Line 277`

**Current code (clean version):**
```html
<h4><span><a href="https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp" target="_blank">Dimmer Rotary Switch</a></span></h4>
```

**Search string for worker:**
```
dimmer-switch-rotary-switch-knob-for-lamp
```

**Occurrences of this URL in full description:** 2 (Line 277 heading + Line 278 image — both must be changed when approved)

**Replacement URL:**
```
UNKNOWN — DO NOT CHANGE YET. Awaiting Muguntha decision on whether ~5511 is being restocked or an alternative action.
```

**Status: BLOCKED — awaiting Muguntha decision**

---

## Problem 4 — Dimmer Rotary Switch — Image

**Section:**
`Collection Description → Dimmer Rotary Switch → Section image`

**Element:**
`<figure>` image link

**Current URL:**
`https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp`

**Generated HTML line:**
`Line 278`

**Image identifier:**
`alt="Metal Dimmer Rotary Switch knob."`

**Current code (clean version):**
```html
<figure class="float-img-left"><a href="https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp" target="_blank">
  <img alt="Metal Dimmer Rotary Switch knob." src="https://blogger.googleusercontent.com/.../Untitled%20design%20(7).jpg" class="float-img-left">
</a></figure>
```

**Replacement URL:**
```
UNKNOWN — DO NOT CHANGE YET. Same decision as H4 heading.
```

**Status: BLOCKED — awaiting Muguntha decision**

---

## Problem 5 — Bunker Bulkhead Cage Wall Sconce Lamp Light — H4 Heading

**Section:**
`Collection Description → Bunker Bulkhead Cage Wall Sconce Lamp Light → H4 heading`

**Element:**
`<h4>` section heading — text link (numbered "3.")
**Note: This is an H4, not H3. The section images are plain `<img>` tags — they are NOT hyperlinks.**

**Current URL:**
`https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light`

**Generated HTML line:**
`Line 318`

**Current code (clean version):**
```html
<h4>3. <a href="https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light" target="_blank">Bunker Bulkhead Cage Wall Sconce Lamp Light</a></h4>
```

**Search string for worker:**
```
industrial-bunker-bulkhead-cage-wall-sconce-lamp-light
```

**Occurrences of this URL in full description:** 1 (H4 heading only)

**Section images (Lines 324, 327, 333) — NOT hyperlinks:**
The three images in the Bunker Bulkhead section (alt texts: "Bunker Bulkhead Cage Standard Wall Light", "Bunker Bulkhead Cage with Terminal Box for wall or ceiling", "Bunker Bulkhead Cage Ceiling Sconce Lamp Light in various colors") are plain `<img>` tags with no `<a>` wrapper. They are not hyperlinks. Only the H4 heading link needs to be updated.

**Candidate replacement URL:**
```
https://ledsone.co.uk/collections/conduit-lighting/products/exposed-lighting
```
(~6546 Nautical Bulkhead Flush Mount Ceiling Light Wire Cage E27, IN STOCK, £25.49)

**Replacement URL:**
```
PENDING VISUAL CONFIRMATION — DO NOT CHANGE YET. Muguntha / Piranav to confirm whether ~6546 matches the intended style.
```

**Status: BLOCKED — awaiting visual confirmation**

---

## Source Note

The HTML source used for this mapping was the browser-rendered page source pasted in the Piranav AIOS session on 2026-10-05. The `bis_size` attributes visible in the raw code are injected by a browser extension and will NOT be present in the Shopify collection body_html field. Workers should search for the **URL string** (not the full tag) to locate each link in the clean Shopify admin HTML editor.
