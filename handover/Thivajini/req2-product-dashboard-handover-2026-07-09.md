# Thivajini — Req 2 Product Dashboard · Handover
## 2026-07-09

## What Was Built
Requirement 2: Product-Level KPI & Decision Dashboard inside `panel-2` of `thivajini.html`.
728 products from LEDSone FR (sub_source_id=233, merchant_id=5551466539) with segment classification.

## How to Use
1. Open `Staff-requirements/pages/thivajini.html` in a browser
2. Click "Product Performance / Req 2" tab
3. Use search, segment filter, availability filter, spend alert filter to drill down
4. Sort by ROAS, Spend, Sales, Clicks or Impressions
5. Click "Export CSV" for full data export (16 columns)

## Key Findings
- **13 Hero products** — ROAS ≥400% + ≥15 clicks → Scale these
- **124 Bleeding products** — ≥5 clicks, CVR<1%, 0 orders → Exclude from campaigns
- **314 Low Engagement** — Impressions but 0 clicks → Feed quality issue (title/image)
- **3 High Priority Cut** — Orders exist but ROAS<250% → Review attribution
- **Overall ROAS 203%** — Below target; driven heavily by Bleeding/Low Engagement volume

## Spend Alert
Any product with Spend > 25% of product price is flagged red.
Use "Spend Alert >25%" filter to isolate these.

## Next Steps
- GPT to review segment classification and action plan
- Piranav to approve before Vercel deployment
- Req 3 / Req 4 to be implemented in subsequent sprints

## Files
- `Staff-requirements/pages/thivajini.html` — dashboard (panel-2)
- `evidence/Thivajini/req2-product-dashboard-evidence-2026-07-09.md`
- `validation/Thivajini/req2-product-dashboard-validation-2026-07-09.md`
