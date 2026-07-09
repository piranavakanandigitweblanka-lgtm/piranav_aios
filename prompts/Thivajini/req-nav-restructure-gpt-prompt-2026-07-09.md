# Thivajini — Requirement Navigation Restructure · GPT Prompt Capture
## 2026-07-09

**Task:** Restructure thivajini.html from a single-dashboard page into a requirement-based tabbed layout.

**Instruction received:**
- Add horizontal requirement navigation tabs below the header
- Move all existing content (Req 1: Attribution Cross-Check) into Requirement 1 tab
- Add Requirement 2 placeholder (Product-Level Performance / Winner-Loser Classification)
- Add placeholder slots for Requirement 3 and 4
- Only one requirement visible at a time — tab switching via JS, no reload
- DO NOT remove Requirement 1 content or break calculations
- DO NOT deploy to Vercel without GPT approval
- Update AIOS files: prompts, evidence, validation, handover, reports

**File modified:**
`Staff-requirements/pages/thivajini.html`

**Changes made:**
1. Title updated: "Thivajini — Requirements Dashboard · LEDSone FR · Google Ads"
2. Masthead updated: H1 = "Thivajini", kicker = "Google Ads · LEDSone FR · AIOS"
3. Tab nav added: 4 tabs (Req 1 active, Req 2 clickable, Req 3/4 disabled placeholders)
4. Req 1 section: all existing content wrapped in `<section id="req-1" class="req-section active">`
5. Req 2 section: professional placeholder card with metrics list and classification labels
6. `switchReq(num, btn)` JS function added for tab switching
7. Footer updated

**Status:** LOCAL ONLY — DO NOT DEPLOY
