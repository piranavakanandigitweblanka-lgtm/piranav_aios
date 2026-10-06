# CC-02 — HTML Verification Report

**Verification date:** 2026-10-06  
**Href corrections applied:** 2026-10-06  
**Source HTML file:** `C:\Users\PC\Desktop\pirana.html`  
**Source page:** `https://ledsone.co.uk/blogs/new/in-depth-guide-to-the-essential-components-of-the-20mm-conduit-lighting-system`  
**Verified by:** Claude Code (sinrasu mode)  
**Note:** This blog post is a DIFFERENT page from the collection description audited in CC-02_Link_Audit.md (which covers `https://ledsone.co.uk/collections/conduit-lighting`). Both pages contain the same broken URLs.

---

## Verification Result Summary

| Section | Element | Current href | Expected href | Status |
|---|---|---|---|---|
| 20mm Distance Saddle Mount Metal Bracket | H3 heading link (L52) | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` | **FAIL** |
| 20mm Distance Saddle Mount Metal Bracket | Image link (L64) | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` | **FAIL** |
| Conduit 20mm Metal Dome Cover | H3 heading link (L140) | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` | **FAIL** |
| Conduit 20mm Metal Dome Cover | Image link (L153) | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` | **FAIL** |

**Incorrect links found: 4 of 4**  
**Fixed in local HTML (pirana.html): 4 of 4** ✓  
**Old URL remaining in file: 0** ✓  
**Shopify edit still required: YES** — pirana.html is the local copy; the live blog post has not been updated yet

---

## Exact HTML Snippets

### Distance Saddle — H3 Heading (Line 52–53)

```html
<h3 style="clear: both; text-align: left;"><span style="text-align: left;"><a
    href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover"
    target="_blank">20mm Distance Saddle Mount Metal Bracket</a></span></h3>
```

**Should be:**
```html
<h3 style="clear: both; text-align: left;"><span style="text-align: left;"><a
    href="https://ledsone.co.uk/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation"
    target="_blank">20mm Distance Saddle Mount Metal Bracket</a></span></h3>
```

---

### Distance Saddle — Image Link (Lines 63–67)

```html
<div style="clear: both; text-align: center;" class="separator"><a style="margin-left: 1em; margin-right: 1em;"
    href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover"
    target="_blank"><img
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg42IoidgdOuDccavb_u8n2Hy7_..."
        data-original-width="3000" data-original-height="1000" border="0"></a></div>
```

**Should be:**
```html
href="https://ledsone.co.uk/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation"
```

---

### Dome Cover — H3 Heading (Lines 139–141)

```html
<h3 style="text-align: left;"><a
    href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover"
    target="_blank">Conduit 20mm Metal Dome Cover</a></h3>
```

**Should be:**
```html
<h3 style="text-align: left;"><a
    href="https://ledsone.co.uk/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size"
    target="_blank">Conduit 20mm Metal Dome Cover</a></h3>
```

---

### Dome Cover — Image Link (Lines 152–156)

```html
<div style="clear: both; text-align: center;" class="separator"><a style="margin-left: 1em; margin-right: 1em;"
    href="https://ledsone.co.uk/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover"
    target="_blank"><img
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0u27bHE7GHq7osOELuROMEbSkb9OQKjNE5Asj0qvtPKZU_..."
        data-original-width="3000" data-original-height="1000" border="0"></a></div>
```

**Should be:**
```html
href="https://ledsone.co.uk/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size"
```

---

## Previously Fixed Links Check

### Fisherman Caged Product

The H4 heading "Nautical Fisherman Wire Cage Light" (Line 292) has **no hyperlink** — it is a plain `<h4>` with no `<a>` tag. The image nearby (Lines 288–291, 303–306) links to `https://ledsone.co.uk/collections/conduit-lighting` (the main collection page), not a specific product.

**Status: No cleanup needed.** The heading is not a link. The image goes to the collection page — acceptable.

---

### E27 Lamp Holder

The E27 lamp holder section has two links:
- H3 heading (Line 175): `https://ledsone.co.uk/collections/conduit-lamp-holder` — links to the lamp holder collection ✓
- Image (Line 188): `https://ledsone.co.uk/collections/conduit-lamp-holder` — same collection ✓
- Second image (Line 193): `https://ledsone.co.uk/collections/conduit-lamp-holder/products/e27-lamp-holder-20mm-female-thread-conduit-ceiling-light-socket` — specific product ✓

**Status: No cleanup needed.** All E27/lamp-holder links point to live ledsone URLs.

---

## Local HTML — Before / After

| Line | Section | Before | After |
|---|---|---|---|
| 52 | Distance Saddle heading | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `…/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` ✓ |
| 64 | Distance Saddle image | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `…/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` ✓ |
| 140 | Dome Cover heading | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `…/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` ✓ |
| 153 | Dome Cover image | `…/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | `…/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` ✓ |

**File saved to:** `C:\Users\PC\Desktop\pirana.html`  
**No other content changed.** Heading text, paragraphs, images, styling, and all other hrefs untouched.

---

## Required Shopify Edits — Blog Post

The following 4 href values must be updated in the blog post body HTML:

**Page to edit:** `https://ledsone.co.uk/blogs/new/in-depth-guide-to-the-essential-components-of-the-20mm-conduit-lighting-system`

**Search string to find (all 4 occurrences):**
```
circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover
```

**Replacements (by section):**

| Occurrence | Context text | Replace with |
|---|---|---|
| 1 | H3 heading: "20mm Distance Saddle Mount Metal Bracket" | `/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` |
| 2 | Image below Distance Saddle heading | `/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation` |
| 3 | H3 heading: "Conduit 20mm Metal Dome Cover" | `/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` |
| 4 | Image below Dome Cover heading | `/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size` |

**IMPORTANT:** Do NOT use find-and-replace-all. The two sections need different destination URLs. Replace occurrences 1–2 with the Saddle URL, and occurrences 3–4 with the Dome Cover URL.

---

## Replacement URLs — Verification Status

**NOTE:** The expected URLs were provided by Piranav. They have NOT been independently verified via Shopify API in this session. Before implementing, confirm these handles are live and in stock:

- `/products/20mm-black-metal-distance-saddles-for-conduit-pipe-installation`
- `/products/20mm-conduit-dome-cover-conduit-fitting-20mm-nominal-size`

The second URL (`20mm-conduit-dome-cover...`) was listed as ✓ LIVE in CC-02_Link_Audit.md (Row #15), confirming it exists.  
The first URL (`20mm-black-metal-distance-saddles...`) was NOT in the original CC-02 audit — verify before use.

---

## Important Scope Note

This verification covers `pirana.html` (the **blog post**). The original CC-02 audit covered the **collection description** at `https://ledsone.co.uk/collections/conduit-lighting`. Both pages contain the same `circular-conduit-box-lid` error for the same two sections (Distance Saddle + Dome Cover), but they are separate Shopify pages and must be edited separately.
