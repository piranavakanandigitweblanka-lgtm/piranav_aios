---
name: listing-issues-pdf-enhancement-2026-10-02
description: Evidence for PDF export enhancement — embedded images + Reported By banner — on Listing Management Issue Tracker
metadata:
  type: project
---

# Evidence — Listing Issues PDF Enhancement

**Date:** 2026-10-02  
**Project:** dm-dashboard  
**Feature:** Admin Listing Management Issue Tracker — PDF Export

---

## What Was Built

### 1. Prominent "Reported By" Banner in PDF
- Blue highlighted summary box at top of every exported PDF
- Shows: Reported By (16px bold), Department, Date Reported, Module
- Also bolded in the issue detail table row

### 2. Images Embedded in PDF Export
- Added `_img_to_data_url(storage_path, file_type)` helper in `listing_issues.py`
- Reads image file from disk → base64 encodes → returns `data:{mime};base64,...`
- `_render_issue_html()` now accepts `attachment_rows` parameter (raw DB rows)
- Builds `raw_map = {row["id"]: row}` for lookup
- Image MIME types (PNG/JPG/WebP/GIF) are embedded; other types (PDF, ZIP) show filename only
- `export_issue_pdf` endpoint passes `attachment_rows=list(attachments)` to renderer

---

## Files Changed

| File | Change |
|---|---|
| `backend/app/admin/listing_issues.py` | Added `_img_to_data_url()`, updated `_render_issue_html()` signature, updated `export_issue_pdf` |

---

## Git Commits

| Branch | Commit | Description |
|---|---|---|
| piranv-work | `5e243b2` | feat(listing-issues): embed images in PDF export + prominent Reported By |
| main | `2f6b29f` | Merge piranv-work → main |

---

## PDF Behaviour (Post-Deploy)

- Click "Export PDF" on any issue → new browser tab opens
- Ctrl+P → Save as PDF (browser print dialog — no automatic download)
- Reported By shown in blue banner at top
- Uploaded images (PNG/JPG/WebP) displayed inline in the Evidence section

---

## Previous Sessions (Context)

- Full Listing Issues tracker built in previous session (auth, CRUD, status workflow, file uploads, KPI cards, filters)
- Auth 401 image fix (AuthImage component + blob URLs) applied in same session
- Status modal all-statuses fix applied in same session

---

## Status: PASS
