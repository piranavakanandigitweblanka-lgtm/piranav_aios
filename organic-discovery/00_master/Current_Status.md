# Organic Discovery — Current Status

**Last updated:** 2026-10-06 (GA-09 redirect CSV prepared)  

---

## Overall Project Status

**GA-09 CSV READY — Awaiting Piranav Manual Shopify Import**

**11 of 11 sold-out product pages resolved. CSV complete — ready for Shopify bulk import.**  
#5 resolved: orange dome exact match (116 units). #8 resolved: collection redirect to `/collections/led-modules` approved by Piranav.

**CC-02 — BLOG POST HTML VERIFIED 2026-10-06**

Blog post `pirana.html` verified: 4 incorrect links confirmed (Distance Saddle ×2, Dome Cover ×2 — all pointing to `circular-conduit-box-lid` URL). Replacement URLs provided by Piranav. Shopify blog post edit required. Collection description (separate page) has same issue — separate edit needed there too. Evidence: `CC-02_HTML_Verification_2026-10-06.md`.

---

## Task Status Summary

| Code | Task | Deadline | Status |
|---|---|---|---|
| **PI-01** | Stock-hiding rule investigation — proposal sent to Muguntha | 5 Oct 2026 | **BLOCKED** — awaiting Muguntha decision |
| **CC-01** | Conduit collection SEO: H1 added | 5 Oct 2026 | **VERIFICATION** — H1 confirmed by screenshots; SEO title/meta/name pending |
| **CC-02** | Fix conduit guide links | 5 Oct 2026 | **IN PROGRESS** — audit done, awaiting 3 answers from Piranav/Muguntha |
| **GA-09** | Redirect 11 sold-out pages — CSV ready, 10 validated | 6 Oct 2026 | **IN PROGRESS — CSV ready (10/11), import pending** |
| GA-01 | Remove hidden zero-price and promo text | 6 Oct 2026 | NOT STARTED |
| GA-02 | Fix robots.txt pagination crawling | 6 Oct 2026 | NOT STARTED |
| GA-08 | Correct bulb collection tags | 6 Oct 2026 | NOT STARTED |
| CC-04 | Remove 278 hidden zero-price strings (conduit) | 6 Oct 2026 | NOT STARTED |
| OD-A5 | Remove 7 wrong products from E27/B22 | 9 Oct 2026 | NOT STARTED |
| CC-06 | Conduit FAQ + schema | 9 Oct 2026 | NOT STARTED |
| PI-02 | Add conduit guide links | 9 Oct 2026 | NOT STARTED |
| CC-07 | Duplicate conduit collection decision | Decision 7 Oct | BLOCKED — Muguntha to decide |
| CC-03 | Conduit collection answer-first intro | 7 Oct 2026 | NOT STARTED |
| (others) | See Task Register | Various | NOT STARTED |

---

## Tasks Requiring Immediate Action

### CC-01 — VERIFICATION needed
To close CC-01 fully:
1. Open `https://ledsone.co.uk/collections/conduit-lightings`
2. Confirm H1 reads `Conduit Lighting & 20mm Conduit Light Fittings`
3. Confirm SEO title in browser tab
4. Confirm collection name
5. Confirm meta description status (was "TO BE DEFINED")
6. Get Muguntha approval
7. Then create `completion/CC-01_Completion_Report.docx`

### PI-01 — BLOCKED
Waiting for Muguntha's response on whether PCGZ20MO/PCGZ20MY are reserved or buffer-held.

---

## CC-02 — Next Steps (3 Questions Blocking Implementation)

1. **Sharp angle bend (Problem 3):** What is the correct product URL for the black sharp-angle-bend fitting? (images are on ledsone CDN suggesting product exists)
2. **Dimmer switch (Problem 4):** Is ~5511 being restocked? If not, remove section or link to `/collections/switches`?
3. **Bunker bulkhead (Problem 5):** Does ~6546 (Nautical Bulkhead Flush Mount) match the section style? If yes → use it. If no → identify the correct product.

Problems 1 and 2 have confirmed replacements and can be implemented immediately once Piranav approves.

Full audit: `organic-discovery/02_CC-02_conduit_guide_links/evidence/CC-02_Link_Audit.md`

---

## Next Active Task to Start (after CC-02 questions answered)

**GA-01** — Remove hidden zero-price text and promo codes from product template  
Deadline: 6 Oct 2026

---

## Completed Tasks

_None yet — CC-01 is VERIFICATION, PI-01 is BLOCKED._

---

## Overdue Tasks

| Code | Deadline | Status |
|---|---|---|
| CC-01 | 5 Oct 2026 | VERIFICATION — partially done |
| CC-02 | 5 Oct 2026 | NOT STARTED |
| PI-01 | 5 Oct 2026 | BLOCKED |
| GA-01 | 6 Oct 2026 | NOT STARTED |
| GA-02 | 6 Oct 2026 | NOT STARTED |
| GA-08 | 6 Oct 2026 | NOT STARTED |
| CC-04 | 6 Oct 2026 | NOT STARTED |
