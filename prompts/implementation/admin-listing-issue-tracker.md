---
name: admin-listing-issue-tracker
category: implementation
status: ACTIVE
created: 2026-10-02
---

# Prompt: Admin Listing Management Issue Tracker

## Purpose
Build a full Admin-only Issue Tracker page inside an existing React 19 + Vite / FastAPI dashboard.
Tracks problems reported by staff for a Listing Management tool, from creation through resolution.

## Reuse Context
Use this when building an Admin-only internal issue/bug management feature inside the DM Dashboard.
The pattern covers: strict admin-only auth, readable issue codes (LM-0001), full CRUD, file uploads,
status workflow with enforced transitions, history timeline, comments, and HTML-to-PDF export.

## Technical Constraints
- React 19 + Vite frontend on port 5199
- FastAPI backend on port 8499 (no --reload)
- Local PostgreSQL via psycopg3 connection pool (get_conn())
- Auth: JWT Bearer via localStorage dm_token — must call verify_strict_admin_token (NOT verify_admin_token which also allows dev)
- File uploads: local disk storage at backend/uploads/listing_issues/{issue_id}/
- PDF: HTMLResponse from backend, opened in new tab via window.open(), browser prints
- Schema: ensure_schema() called at startup with crash-proof try/except wrapper
- Frontend API calls: always use apiFetch() from src/lib/apiFetch.js

## Authorization Requirement
- admin → ALLOWED
- dev → DENIED (403)
- staff → DENIED (403)
- Use verify_strict_admin_token from app.core.auth — not verify_admin_token

## Key Files Created
- backend/app/admin/listing_issues.py
- frontend/src/admin/pages/ListingIssues.jsx
- Modified: backend/app/main.py, frontend/src/admin/AdminLayout.jsx, backend/app/core/auth.py

## Status Workflow
Pending → In Progress → Developer Fix Provided → Testing → Done
Also: In Progress ↔ Blocked, Testing → In Progress (re-open)

## Issue Code Format
LM-0001, LM-0002, LM-0003 (zero-padded 4 digits)

## Expected Output
- KPI cards (Total, Pending, In Progress, Dev Fix, Testing, Done)
- Search + multi-field filters
- Issue table with clickable rows
- Full issue detail view with attachments, developer update form, timeline, comments
- Create/Edit modals
- Status update modal with transition enforcement
- Single issue PDF export + filtered list PDF export
