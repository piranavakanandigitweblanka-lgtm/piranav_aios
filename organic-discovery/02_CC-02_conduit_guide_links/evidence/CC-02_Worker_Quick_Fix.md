# CC-02 — Worker Quick Fix Table

**Target:** Collection Description of `https://ledsone.co.uk/collections/conduit-lighting`  
**How to use:** Open the Shopify collection description HTML editor. Use the Search String column to find each link. Replace the Current URL with the Replacement URL. Save. Verify live.  
**Line numbers:** Generated HTML line numbers from browser-rendered source (2026-10-05). Search by URL string — do not rely on line numbers alone.

---

## Quick Fix Table

| Problem | Section | Element | Gen. HTML Line | Search String | Current URL | Replacement URL | Occurrences | Status |
|---|---|---|---:|---|---|---|---:|---|
| **1** | 20mm Distance Saddle Mount Metal Bracket | `<h3>` heading | 177 | `circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `https://ledsone.co.uk/collections/conduit-lighting/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770` | 1 | ✅ **READY** |
| **2a** | 90-Degree Bend (Smooth Angle Bend) | Image 1 (`alt="...view 1."`) | 193 | `conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170` | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170` | `https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` | 2 total on line | ✅ **READY** |
| **2b** | 90-Degree Bend (Smooth Angle Bend) | Image 2 (`alt="...view 2."`) | 193 | _(same URL — same search, same line)_ | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170` | `https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` | 2 total on line | ✅ **READY** |
| **3a** | 90-Degree Bend (Sharp Angle Bend) | Image 1 (`alt="...view 1."`, CDN src) | 201 | `conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1` | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1` | **TBD — DO NOT CHANGE** | 2 total on line | 🔴 BLOCKED |
| **3b** | 90-Degree Bend (Sharp Angle Bend) | Image 2 (`alt="...view 2."`, CDN src) | 201 | _(same URL — same search, same line)_ | `https://ledsone.co.uk/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1` | **TBD — DO NOT CHANGE** | 2 total on line | 🔴 BLOCKED |
| **4a** | Dimmer Rotary Switch | `<h4>` heading (inside `<span>`) | 277 | `dimmer-switch-rotary-switch-knob-for-lamp` | `https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp` | **TBD — DO NOT CHANGE** | 2 total (L277+L278) | 🔴 BLOCKED |
| **4b** | Dimmer Rotary Switch | `<figure>` image (`alt="Metal Dimmer Rotary Switch knob."`) | 278 | _(same URL — same search)_ | `https://ledsone.co.uk/products/dimmer-switch-rotary-switch-knob-for-lamp` | **TBD — DO NOT CHANGE** | 2 total (L277+L278) | 🔴 BLOCKED |
| **5** | Bunker Bulkhead Cage Wall Sconce Lamp Light | `<h4>` heading only *(images NOT linked)* | 318 | `industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | `https://ledsone.co.uk/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | **TBD — DO NOT CHANGE** | 1 | 🔴 BLOCKED |

---

## Worker Steps for Problems 1 and 2 (READY NOW)

### Step 1 — Open Shopify admin
Go to `Online Store → Collections → Conduit Lighting` and open the collection description in the HTML editor (click `<>` / Source code button).

### Step 2 — Fix Problem 1
Search for:
```
circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover
```
Replace the entire `href` value with:
```
https://ledsone.co.uk/collections/conduit-lighting/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770
```
Expected: 1 occurrence.

### Step 3 — Fix Problem 2 (both images, same line)
Search for:
```
conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170
```
Replace ALL occurrences of the `href` value with:
```
https://ledsone.co.uk/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting
```
Expected: 2 occurrences on the same line (both in the smooth bend figure block).

### Step 4 — Verify
Save the collection. Open `https://ledsone.co.uk/collections/conduit-lighting` in browser.
- Scroll to "20mm Distance Saddle Mount Metal Bracket" → click H3 heading → confirm Saddle Mount product page opens, in stock.
- Scroll to "90-Degree Bend (Smooth Angle Bend)" → click each image → confirm 90° elbow bend product page opens, in stock.

### Step 5 — Screenshot
Capture before and after screenshots per CC-02 task.md naming convention:
```
before/CC-02_before_YYYYMMDD_HHMM_saddle-mount.png
before/CC-02_before_YYYYMMDD_HHMM_smooth-bend-images.png
after/CC-02_after_YYYYMMDD_HHMM_saddle-mount.png
after/CC-02_after_YYYYMMDD_HHMM_smooth-bend-images.png
```

---

## Important — Do NOT Change These Lines

| Line | Element | URL | Reason |
|---|---|---|---|
| 178 | Figure image under Saddle Mount H3 | `...saddle-mount-nipple?variant=53378250768770` | Already correct — in stock |
| 192 | `<p><b><a>` heading for Smooth Bend section | `...90-degree-male-20mm-elbow-metal-bend-conduit-fitting` | Already correct — in stock |
| 200 | `<p><b><a>` heading for Sharp Bend section | `...conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple` | Live — out of CC-02 scope |
| 324, 327, 333 | Images in Bunker Bulkhead section | (none — not hyperlinks) | Plain `<img>` tags, no href |

---

## Correction Note — Element Types

Previous audit documentation referred to Problem 4 as "H3 heading" and Problem 5 as "H3 heading". 

The actual HTML confirms:
- **Problem 4 heading:** `<h4>` (inside `<span>`) — Line 277
- **Problem 5 heading:** `<h4>` (prefixed with "3. ") — Line 318

The section heading for Problems 1–3 uses `<h3>`. The section headings for Problems 4 and 5 use `<h4>`.
