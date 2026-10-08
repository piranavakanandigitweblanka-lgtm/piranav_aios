# Capability — DM Dashboard PDF Image Embed Pattern

## Date First Identified
2026-10-02

## Last Updated
2026-10-02

## Status
ACTIVE — Deployed to main branch (commit `2f6b29f`)

## Purpose
Embed images directly into Python-generated HTML-to-PDF exports as base64 data URLs, so that exported PDFs are self-contained (no external image dependencies).

## Business Problem Solved
PDF exports generated from HTML templates that reference image file paths (`<img src="/path/to/file">`) fail to display images when viewed outside the server context. Embedding images as base64 data URIs makes PDFs fully self-contained and portable.

## When To Use
- A DM Dashboard PDF export currently references images by file path
- PDFs are shared externally or downloaded and viewed offline
- Images are stored on disk (not at an external URL)

## When NOT To Use
- Images are very large (>5 MB each) — base64 increases encoded size by ~33%; large images inflate PDF size significantly
- Images are served from a CDN or external URL — base64 encoding is not applicable (use direct URL embedding instead)
- PDF generation library does not support base64 data URIs (test first)

## Required Inputs
- `storage_path` — the disk path to the image file
- `file_type` — the file extension (`png`, `jpg`, `webp`, `gif`)
- Access to the Python PDF generation backend file

## Source Task / Requirement
Listing Issues PDF Enhancement — Embedded Images + Reported By Banner
dm-dashboard, 2026-10-02

## Execution Steps

### Step 1 — Add `_img_to_data_url()` helper to the backend module
```python
def _img_to_data_url(storage_path: str, file_type: str) -> str:
    """Read an image from disk and return it as a base64 data URI."""
    mime_map = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
        "gif": "image/gif",
    }
    mime = mime_map.get(file_type.lower(), "application/octet-stream")
    try:
        with open(storage_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
        return f"data:{mime};base64,{encoded}"
    except FileNotFoundError:
        return ""  # return empty string; renderer will skip the image
```

### Step 2 — Fetch attachment rows in the export endpoint
Before rendering HTML, fetch the attachment DB rows for the issue:
```python
attachments = conn.execute(
    "SELECT id, storage_path, file_type FROM attachments WHERE issue_id = %s", (issue_id,)
).fetchall()
```

### Step 3 — Build the lookup map and pass to renderer
```python
raw_map = {row["id"]: row for row in attachments}
html = _render_issue_html(issue, attachment_rows=list(attachments))
```

### Step 4 — In the HTML renderer, embed images
```python
def _render_issue_html(issue, attachment_rows=None):
    html_parts = []
    if attachment_rows:
        for row in attachment_rows:
            ft = row["file_type"].lower()
            if ft in ("png", "jpg", "jpeg", "webp", "gif"):
                data_url = _img_to_data_url(row["storage_path"], ft)
                if data_url:
                    html_parts.append(f'<img src="{data_url}" style="max-width:100%">')
            else:
                html_parts.append(f'<p>Attachment: {row["storage_path"]}</p>')
    # ... rest of HTML rendering
```

### Step 5 — Test with a real attachment
Export a PDF that contains an image. Open without internet connection. Confirm image is visible.

## Evidence Required
- Git commit showing `_img_to_data_url()` added to the backend module
- PDF exported in test, confirming image is visible

## Evidence Path
`evidence/dm-dashboard/listing-issues-pdf-enhancement-2026-10-02.md`
Commits: piranv-work `5e243b2`, main `2f6b29f`

## Pass / Fail Rule
PASS: Exported PDF opens without network access and displays images correctly. File types outside the supported list (PDF, ZIP) are shown as filename-only.
FAIL: Images not visible in exported PDF, OR PDF size increases by >10× suggesting an issue with encoding.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Only works for images stored on the same server as the PDF generator — not for CDN URLs
- Base64 encoding increases image payload by approximately 33%
- Supported types: PNG, JPG, JPEG, WebP, GIF. Other types (PDF, ZIP) are shown as filename text
- If the disk file is moved after the DB path was recorded, the export silently shows no image (empty string return)

## Reuse Path
Add `_img_to_data_url()` to any DM Dashboard Python module that generates PDFs from HTML. The helper is module-level and requires no dependencies beyond `base64` (stdlib).

## Related Capabilities
None directly related in current capability library.

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-02 | Initial capability captured from Listing Issues PDF enhancement | `evidence/dm-dashboard/listing-issues-pdf-enhancement-2026-10-02.md` |
