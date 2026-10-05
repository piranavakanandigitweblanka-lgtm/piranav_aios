# ElectricalsOne.co.uk — Urgent Fixes Workstream

**Project:** ElectricalsOne.co.uk – Urgent SEO/Review Fixes
**Owner:** Piranav
**AIOS Root:** `C:\Users\PC\Documents\piranav_aios`
**Workstream Folder:** `electricalsone_urgent_fixes/`
**Created:** 2026-10-05

---

## Active Items

### Item 1 — Fake Judge.me Star Rating (ACTION REQUIRED)

Product pages were displaying a hard-coded 4.5-star / 10-review rating even though Judge.me had 0 genuine reviews. This misrepresents reviews to customers and creates an SEO/quality risk.

| Stage | Status |
|---|---|
| Root cause identified | COMPLETED |
| Fix implemented locally | COMPLETED |
| Shopify deployment | COMPLETED |
| Live product verification | COMPLETED |
| Google Rich Results Test | **PASS** — Review snippets removed, 5 items (was 6) |
| Task closure | **PASS** — 2026-10-05 |

See: `task/fake_judgeme_rating.md`, `investigation/root_cause.md`, `implementation/fix_record.md`

---

### Item 2 — Duplicate Products with LEDSone (NO ACTION YET)

**Investigation finding only. No implementation authorised.**

ElectricalsOne has 784 products. 733 overlap with LEDSone. 690 share SKUs. 196 have near-identical descriptions. This may cause keyword competition and split organic visibility.

**DO NOT change any of the following until a separate plan is approved:**
- Product URLs
- Descriptions
- Canonical tags
- Redirects
- Deindex settings
- Collections
- SEO metadata
- Product merging or deletion

A separate implementation plan will be created before any action is taken.

---

## Folder Structure

```
electricalsone_urgent_fixes/
├── README.md                          ← this file
├── task/
│   └── fake_judgeme_rating.md        ← task brief and requirements
├── investigation/
│   └── root_cause.md                 ← confirmed root cause
├── implementation/
│   └── fix_record.md                 ← what was changed and where
├── verification/
│   ├── live_verification.md          ← live product test checklist
│   └── rich_results_verification.md  ← Google Rich Results Test record
├── evidence/
│   └── README.md                     ← evidence register
├── prompts/
│   └── deployment_verification.md    ← reusable deployment/verify prompt
└── closure/
    └── closure_record.md             ← closure checklist and final status
```

---

## Related Existing AIOS Evidence

| Path | Content |
|---|---|
| `evidence/shopify/electricalsone/pdp-uiux/` | PDP UI/UX audit 2026-06-30 |
| `evidence/shopify/electricalsone/pdp-gallery-nav/` | Gallery nav fix 2026-07-01 |
| `evidence/audits/electricalsone-layout-audit-2026-06-19.md` | Layout audit |
