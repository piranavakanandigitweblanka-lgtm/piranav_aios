---
name: jackshan-r1-rule-tests
description: Rule boundary tests for Recommended Action logic — Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — Recommended Action Rule Tests

**Title:** Rule Boundary Tests  
**Purpose:** Verify correct implementation of recommended action rules  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**PASS / FAIL:** PASS

---

## Rule Implementation

```python
def get_action(clicks, impressions):
    if clicks >= 2:
        return 'Rewrite meta tags + re-optimize keywords'
    elif clicks == 1:
        return 'Rewrite meta tags + re-optimize keywords'
    elif clicks == 0 and impressions >= 100:
        return 'Check intent mismatch — do not optimize'
    else:
        return 'Do not optimize'
```

## Rule Boundary Tests

| Test | Clicks | Impressions | Expected Action | Actual Action | PASS/FAIL |
|------|--------|-------------|-----------------|---------------|-----------|
| A | 2 | 50 | Rewrite meta tags + re-optimize keywords | Rewrite meta tags + re-optimize keywords | PASS |
| B | 1 | 200 | Rewrite meta tags + re-optimize keywords | Rewrite meta tags + re-optimize keywords | PASS |
| C | 0 | 100 | Check intent mismatch — do not optimize | Check intent mismatch — do not optimize | PASS |
| D | 0 | 99 | Do not optimize | Do not optimize | PASS |
| E | 0 | 0 | Do not optimize | Do not optimize | PASS |
| F | 0 | 163 | Check intent mismatch — do not optimize | Check intent mismatch — do not optimize | PASS |

## High-Impression Threshold Verification

- Threshold: 100 impressions (exactly as specified)
- At impressions = 99: "Do not optimize" ✓
- At impressions = 100: "Check intent mismatch — do not optimize" ✓
- At impressions = 101: "Check intent mismatch — do not optimize" ✓

## Data Results

- Rows with clicks >= 2: 0
- Rows with clicks = 1: 0
- Rows with clicks = 0 and impressions >= 100: 1 (query: "beach slipper", impressions: 163)
- Rows with clicks = 0 and impressions < 100: 315
- Data validation required: 0

No CTR, average position, meta-title length, or other metrics were used in recommendation calculation.
