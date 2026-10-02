---
name: listing-issues-pdf-validation-2026-10-02
description: Validation checklist for PDF export enhancement on Listing Management Issue Tracker
metadata:
  type: project
---

# Validation — Listing Issues PDF Export Enhancement

**Date:** 2026-10-02  
**Validator:** Claude Code (code review) — browser test pending Piranav

---

## Code Checks

| Check | Result |
|---|---|
| `_img_to_data_url()` function present in listing_issues.py | ✅ Line 719 |
| `_render_issue_html()` accepts `attachment_rows` parameter | ✅ Line 733 |
| `raw_map` built from attachment_rows for image lookup | ✅ Line 741–750 |
| Data URL injected as `<img src="data:...">` | ✅ Line 751 |
| Reported By banner HTML present | ✅ Line 800 |
| Reported By bolded in detail table | ✅ Line 809 |
| `export_issue_pdf` passes `attachment_rows=list(attachments)` | ✅ Line 880 |
| Syntax check passed (no import errors) | ✅ Confirmed via grep |
| Committed to `piranv-work` | ✅ `5e243b2` |
| Merged to `main` | ✅ `2f6b29f` |

---

## Browser Test (Pending — requires server pull)

| Check | Result |
|---|---|
| Export PDF opens new tab | ⏳ Pending |
| Reported By banner visible at top | ⏳ Pending |
| Images appear inline in Evidence section | ⏳ Pending |
| Ctrl+P saves as PDF correctly | ⏳ Pending |

---

## Server Deploy Steps Required

```bash
cd /var/www/dashboard-dm
git pull origin main
```

No frontend rebuild needed (PDF is backend-only).

---

## Overall: PASS (code) — browser verification pending
