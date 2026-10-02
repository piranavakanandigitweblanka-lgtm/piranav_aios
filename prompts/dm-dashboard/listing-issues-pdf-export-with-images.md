---
name: listing-issues-pdf-export-with-images
description: Build or enhance a PDF export for the Listing Management Issue Tracker — embed uploaded images as base64 data URLs and show a prominent Reported By banner
metadata:
  type: feedback
---

## Prompt

You are enhancing the PDF export for the Admin Listing Management Issue Tracker inside the DM Dashboard (React 19 + Vite frontend, FastAPI backend, local PostgreSQL).

**What to build:**

1. **Prominent "Reported By" banner** at the top of every exported PDF:
   - Blue highlight box containing: Reported By (large bold), Department, Date Reported, Module
   - Also bold Reported By in the issue detail table below

2. **Embed uploaded images in the PDF:**
   - Read image files from disk on the backend (path stored in `listing_issue_attachments.storage_path`)
   - Convert to base64 data URLs using `base64.b64encode(path.read_bytes())`
   - Inject `<img src="data:{mime};base64,{data}">` inside the HTML before browser print
   - Only embed image types (PNG, JPG, WebP, GIF) — skip PDF/ZIP/CSV attachments

**Key files:**
- Backend: `backend/app/admin/listing_issues.py`
  - Add helper: `_img_to_data_url(storage_path, file_type) -> str | None`
  - Update `_render_issue_html(issue, attachments, history, comments, attachment_rows=None)`
  - Update `export_issue_pdf` endpoint to pass `attachment_rows=list(attachments)` (raw DB rows with storage_path)
- The PDF is rendered as `HTMLResponse` — browser prints to PDF via Ctrl+P, no PDF library needed

**Technical constraints:**
- Images are served via authenticated endpoints — browser `<img src>` would return 401
- Base64 embedding bypasses auth entirely — backend reads directly from disk
- `attachment_rows` is a list of raw DB rows; build a `raw_map = {row["id"]: row}` dict for O(1) lookup
- Max image embed size: respect existing 20MB upload limit; very large images may slow print

**Expected output:**
- PDF shows "Reported By" in a blue box at the top
- Uploaded images appear inline under the Evidence section
- Non-image attachments show filename only (no embed)
