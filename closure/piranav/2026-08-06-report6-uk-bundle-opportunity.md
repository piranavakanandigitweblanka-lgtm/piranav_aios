# AIOS Closure — Report 6: UK Bundle Opportunity

**Requirement ID:** GERMANY-REPORT-6
**Date:** 2026-08-06
**Prepared by:** Piranav (AIOS)
**Status:** PASS

---

## Objective

Implement a new "UK Bundle Opportunity" report inside the existing Germany Sales Decline Dashboard identifying UK bundle SKUs not currently in Germany but buildable from existing DE stock.

---

## Business Question

Which UK bundle SKUs do not currently exist in Germany, and which of those have all component SKUs available in German warehouse stock?

---

## Files Created

| File | Path |
|---|---|
| API | `Staff-requirements-02/api/germany/uk-bundle-opportunity.js` |
| Report HTML | `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-6-uk-bundle-opportunity.html` |
| Documentation | `Staff-requirements-02/germany-sales-decline-dashboard/docs/report-6-uk-bundle-opportunity.md` |
| Evidence | `evidence/piranav/2026-08-06-report6-uk-bundle-opportunity.md` |
| Closure | `closure/piranav/2026-08-06-report6-uk-bundle-opportunity.md` |

---

## Files Modified

| File | Change |
|---|---|
| `Staff-requirements-02/germany-sales-decline-dashboard/index.html` | Added Report 6 card; count updated 5→6 |

---

## Asset Path

`Staff-requirements-02/germany-sales-decline-dashboard/pages/report-6-uk-bundle-opportunity.html`

Accessible via hub: `germany-sales-decline-dashboard/index.html` → Report 6 card

---

## Evidence Path

`evidence/piranav/2026-08-06-report6-uk-bundle-opportunity.md`

---

## GitHub Path

Branch: `main`
Committed as part of implementation batch — `Staff-requirements-02/`

---

## Reviewer

Piranav

---

## Queryability Result

All data is live from PostgreSQL. Auto-poll every 5 seconds. No localStorage state. CSV export available. SKU search, filter pills (All / Ready for Review / Missing Components) operational. Pagination at 100 rows/page.

---

## Key Metrics Delivered

| Metric | Value |
|---|---|
| Total UK bundle SKUs | 23,247 |
| Already in Germany | 10,059 (43%) |
| Not in Germany | 13,188 (57%) |
| Ready for Review (all components in DE) | 467 |
| Missing ≥1 component | 12,721 |

---

## Known Limitations

- Does not calculate build quantity — analysis only
- Does not recommend creating bundles
- `amazon_listings` has no `all_list` column — `site` filter only
- Component check is exact SKU match only (no bundle sub-prefix expansion)
- Stock is point-in-time; restock orders not factored

---

## Next Step

- Business review of 467 ready bundles
- Prioritise by UK sales velocity for highest-impact DE bundles
- Build quantity analysis (Phase 2)

---

## PASS / FAIL

**PASS** — All PASS criteria met:
- ✓ Existing assets inspected
- ✓ Existing APIs inspected
- ✓ New API justified and created
- ✓ Existing dashboard architecture extended
- ✓ No duplicate business logic
- ✓ Documentation created
- ✓ Evidence created
- ✓ AIOS closure created
- ✓ Queryability maintained
- ✓ Git-ready implementation
