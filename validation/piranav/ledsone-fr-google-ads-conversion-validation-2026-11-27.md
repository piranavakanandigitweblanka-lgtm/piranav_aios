# Validation: LEDSone FR Google Ads Conversion Setup — 2026-11-27

**Task:** Investigate and partially configure Google Ads conversion tracking for ledsone.fr
**Result:** OPEN — provisional progress, monitoring required

---

## Checks

| Check | Result |
|---|---|
| `Purchase(infinitePixel)29183` re-enabled | PASS |
| Tag firing on thank-you page confirmed via Tag Assistant | PASS |
| Tags identified: GT-NCTTCV3C, G-G9NQ5L3Q6V | PASS |
| InfinitePixel fires to AW-16922105395 confirmed | PASS |
| Conversion value matched product subtotal (€56.79) | OBSERVED — not validated as correct |
| Fresh post-change attributed conversion confirmed | FAIL — not yet proven, monitor 24–48h |
| Purchase goal "Needs attention" warning resolved | FAIL — outstanding |
| Duplicate hit investigation completed | FAIL — pending |
| Unpaid order conversion policy confirmed | FAIL — requires business confirmation |
| Google Ads payment method warning resolved | FAIL — separate billing issue |
| Word report copied to `reports/ledsone-fr/` | PASS |
| Original Word file preserved in Downloads | PASS |
| Evidence file created | PASS |
| Prompt file created | PASS |
| Validation file created | PASS (this file) |
| PROMPT_REGISTER updated | PENDING |
| Closure entry written | PENDING |

---

## Overall Validation

**OPEN** — Configuration step completed (re-enable). Tag firing confirmed via Tag Assistant. Attribution, policy questions, and account warnings unresolved. Re-validate after 24–48h monitoring period.

---

## Re-validation Trigger

Return to this task when:
- Google Ads conversion column shows attributed conversions from ledsone.fr (post re-enable)
- "Purchase goal — Needs attention" warning investigated and resolved
- Business confirms unpaid order conversion policy
