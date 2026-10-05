# CC-02 — Conduit Guide Link Correction

**Task code:** CC-02  
**Owner:** Piranav  
**Approver:** Muguntha  
**Deadline:** 5 Oct 2026, 18:00 SL  
**Status:** IN PROGRESS — exact HTML code mapping complete. Problems 1 and 2 ready to implement. Problems 3–5 blocked pending decisions.

**Code Map:** `evidence/CC-02_Code_Line_Map.md`  
**Worker Fix Table:** `evidence/CC-02_Worker_Quick_Fix.md`  
**Correction:** Problem 4 and 5 headings are `<h4>` elements (not H3). Problem 5 images are plain `<img>` — NOT hyperlinks.  
**Source:** LEDSone Organic Discovery: Rules, Recommendations and Results Log — Section 2b, New tasks from 4 Oct 2026  

---

## Objective

Fix broken links in the conduit guides on ledsone.co.uk:

- 4 links that point to sold-out products
- 1 link that points to a page that no longer exists

Every conduit guide link must open a live, in-stock page after this task is complete.

---

## How it is checked live (from source document)

> "Every guide link opens a live, in-stock page."

---

## Link Tracking Table

These 5 links must be investigated, corrected and verified.

| # | Guide | Existing URL | Problem | Replacement URL | Verified |
|---|---|---|---|---|---|
| 1 | Conduit collection description — H3: "20mm Distance Saddle Mount Metal Bracket" | `/collections/conduit-lighting/products/circular-conduit-box-lid-black-20mm-conduit-lighting-metal-cover` | Sold out (~5548, 0 stock) + wrong product (Box Lid, not Saddle Mount) | `/products/conduit-pipe-fittings-accessories-l-tee-bend-saddle-mount-nipple?variant=53378250768770` (Saddle Mount variant ~5554, in stock) | NO |
| 2 | Conduit collection description — Images (×2) in smooth 90° bend section | `/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use/14847065719170` | Sold out (~5569, 0 stock) + wrong product type (wall light, not bend fitting) | `/collections/conduit-lighting/products/90-degree-male-20mm-elbow-metal-bend-conduit-fitting` (~5552, 161 in stock) | NO |
| 3 | Conduit collection description — Images (×2) in sharp 90° bend section | `/products/conduit-pipe-wall-light-vintage-industrial-indoor-e27-lamp-fitting-for-indoor-use-1` | Sold out (~5588, 0 stock) + wrong product type (wall light, not bend fitting) | UNKNOWN — Piranav to identify correct sharp-angle-bend product URL | NO |
| 4 | Conduit collection description — Dimmer Rotary Switch heading + image | `/products/dimmer-switch-rotary-switch-knob-for-lamp` | Sold out (~5511, 0 stock) | UNKNOWN — no replacement dimmer in stock. Escalate to Muguntha | NO |
| 5 | Conduit collection description — Bunker Bulkhead Cage Wall Sconce section | `/products/industrial-bunker-bulkhead-cage-wall-sconce-lamp-light` | 404 — page does not exist | `/collections/conduit-lighting/products/exposed-lighting` (~6546 Nautical Bulkhead Flush Mount, in stock £25.49) — Piranav to verify product match | NO |

**Rules:**
- Never guess replacement URLs
- Replacement URLs must be verified as live and in-stock before the link is updated
- Record the actual URL found, not a predicted one

---

## Investigation Steps

1. Open all conduit guides on ledsone.co.uk
2. Click every internal link
3. Identify the 4 sold-out product links and 1 unavailable page link
4. For each broken link:
   - Record the guide name and URL
   - Record the existing (broken) link URL
   - Record the problem (sold out / page unavailable)
   - Find the correct replacement (in-stock product or relevant live page)
   - Record the replacement URL
5. Update the Link Tracking Table above with real values

---

## Before Work Begins

Save screenshots of:
- Each affected guide page showing the broken link in context
- Each destination page showing "sold out" or 404 state

Save to `before/`

Filename convention:
```
before/CC-02_before_YYYYMMDD_HHMM_<guide-name>.png
before/CC-02_before_destination_YYYYMMDD_HHMM_<product-slug>.png
```

---

## After Implementation

Save screenshots of:
- Each updated guide page showing the corrected link
- Each destination page confirming it is live and in stock

Save to `after/`

Filename convention:
```
after/CC-02_after_YYYYMMDD_HHMM_<guide-name>.png
after/CC-02_after_destination_YYYYMMDD_HHMM_<product-slug>.png
```

---

## Evidence to Record

Save in `evidence/`:

- Completed Link Tracking Table (with all TBD fields filled)
- Date and time of each link change
- Who made the change
- Confirmation that each replacement URL was verified as live + in-stock before being used

---

## Completion Checklist

- [ ] All 5 broken links identified
- [ ] All 5 replacement URLs confirmed as live and in-stock
- [ ] All 5 links updated in the guides
- [ ] After screenshots captured for all 5
- [ ] Link Tracking Table fully completed (no TBD remaining)
- [ ] Evidence recorded
- [ ] Muguntha approval (if required)

---

## Completion Report

Created only after all checklist items above are confirmed.

File: `completion/CC-02_Completion_Report.docx`

---

## 14-Day Check

Date: CC-02 live date + 14 days  
Check: All 5 links still open live, in-stock pages  
Result: Worked / Partly worked / Did not work / UNKNOWN  

---

## Notes

- Do not update a link to a product that is low-stock unless confirmed it will remain in stock
- If a correct replacement cannot be found, record UNKNOWN and escalate to Muguntha — do not invent a URL
