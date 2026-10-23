# LEDSone US 429 — Controlled Retest Validation Plan
**Req ID:** LEDSONE-US-429-2026-10-19
**Created:** 20 October 2026
**Status:** PENDING — controlled retest not yet run

---

## Why a controlled retest is needed

The original Screaming Frog crawl received 429 on all 117 URLs. Subsequent tests (GSC live test, PowerShell) returned 200 on the sample blog URL only, at a different time, from different tools. These tests do not:
- Confirm current status of the remaining 116 URLs
- Identify whether the 429 was rate-based or permanent
- Reproduce the original crawl conditions
- Capture response headers

A controlled retest, documented with timestamp, method, and headers, is required before any SEO actions are taken.

---

## Phase 1 — Google Search Console Live Test (immediate, low risk)

**Purpose:** Check 3–4 representative URLs via GSC URL Inspection.

| Step | Action | Record |
|---|---|---|
| 1 | Open GSC → URL Inspection | — |
| 2 | Test: `https://ledsone.us/products/180-vintage-wall-light-fixture` | HTTP status, indexability, date/time |
| 3 | Test: `https://ledsone.us/collections/living-room-lighting` | HTTP status, indexability, date/time |
| 4 | Test: `https://ledsone.us/pages/about-us` | HTTP status, indexability, date/time |
| 5 | Screenshot each result | Save to evidence folder |

**Pass criteria:** All 3 URLs return "URL available to Google" + HTTP 200 in live test.
**Fail criteria:** Any URL returns error, 429, or "URL not available."

**Limitation:** GSC Live Test is a single request at one moment. A pass does not confirm that a rapid-fire crawl would also receive 200. Do not draw site-wide conclusions from this test alone.

---

## Phase 2 — PowerShell Controlled Retest (same-session, low risk)

**Purpose:** Retest a sample of 4 URLs (blog, product, collection, page) with header capture.

**Required:** PowerShell with Invoke-WebRequest available.

**Script template (run manually — do not auto-execute):**

```powershell
$urls = @(
    "https://ledsone.us/blogs/news/halloween-lighting-ideas-2026",
    "https://ledsone.us/products/180-vintage-wall-light-fixture",
    "https://ledsone.us/collections/living-room-lighting",
    "https://ledsone.us/pages/about-us"
)

foreach ($url in $urls) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5
        Write-Host "$timestamp | GET | $($response.StatusCode) | $url"
        Write-Host "  Headers: $($response.Headers | ConvertTo-Json -Compress)"
    } catch {
        Write-Host "$timestamp | GET | ERROR: $($_.Exception.Message) | $url"
    }
    Start-Sleep -Seconds 5   # 1 request per 5 seconds — conservative
}
```

**Record for each URL:**
- Timestamp (exact date and time)
- HTTP method (GET)
- Status code returned
- Key response headers (especially: `Retry-After`, `X-RateLimit-*`, `CF-RAY`, `Server`, `Via`)
- Any error messages

**Pass criteria:** 200 for all 4 URLs with no 429.
**Fail criteria:** Any URL returns 429 or other error.
**Mixed criteria:** Some 200, some 429 — document which URL types are affected.

---

## Phase 3 — Screaming Frog Small Crawl (only if Phase 1 and 2 pass)

**Purpose:** Attempt to reproduce the original 429 under controlled conditions using Screaming Frog.

**Constraints (from PDF Evidence E and F):**
- Speed settings are **locked** in the current free/lite licence — cannot set 1 URL/s via the Speed panel.
- User-Agent settings are **locked** — cannot change the user-agent.
- HTTP Headers storage is **not configured** by default — must enable before crawling.

**Pre-crawl checklist:**
- [ ] Enable HTTP Header storage in SF configuration before starting
- [ ] Use a small seed list — paste only the 4 priority URLs, not the full 117
- [ ] Note the time crawl starts and ends
- [ ] Do not click Re-crawl All immediately after a previous crawl — allow a gap of at least 5 minutes
- [ ] Record the displayed crawl rate (URLs/s) from the SF status bar

**Record:**
- Crawl start timestamp
- Crawl end timestamp
- URLs crawled count
- Status codes for each URL
- SF displayed crawl rate
- Any 429 responses — capture URL, status, and response headers if available

**Pass criteria:** All 4 URLs return 200 in the SF crawl.
**Fail criteria:** Any URL returns 429 — this confirms rate limiting is still active with SF's request profile.
**Inconclusive:** If SF gives 200 in a small crawl but gave 429 at full site speed, the issue is likely rate-based at volume.

---

## Evidence to capture and save

For each phase, save results to:
- `evidence/shopify/ledsone-us/ledsone-us-429-retest-[YYYY-MM-DD].md` — new file per retest date
- Update the "Retest Status" and "Retest Date" columns in `reports/ledsone-us/ledsone-us-429-url-register-2026-10-19.md`
- Take screenshots of SF results if Phase 3 is run

---

## Decision table

| Result | Conclusion | Next action |
|---|---|---|
| 429 reproduced in Phase 2 at low speed | Rate limit is active and not just speed-related | Escalate to store owner to check Shopify/CDN bot-protection settings at time of original crawl |
| 429 reproduced only in Phase 3 (SF crawl) | Rate limit is SF crawl-speed or request-pattern specific | Advise on crawl speed; note for next scheduled SF crawl |
| All phases return 200 | Original 429 was likely transient or time-based | Document, monitor GSC Coverage, do not mark as fixed permanently |
| Mixed — product/collection 429, blog 200 | URL-type-specific rate limiting | Priority: test product URLs in GSC individually |
| Insufficient data (tests not run) | Cannot conclude | Complete Phase 1 before any SEO actions |

---

## Validation status

| Phase | Status | Completed by | Date |
|---|---|---|---|
| Phase 1 — GSC Live Test (blog URL) | DONE — 200 OK (PDF Evidence C) | Robesan/team | 2026-10-19 |
| Phase 1 — GSC Live Test (product URL `/products/180-vintage-wall-light-fixture`) | DONE — 200 OK, URL available to Google, indexing allowed. Product snippets + merchant listings: 1 valid item each (non-critical issues). Screenshot: see §9a note. | Piranav | 2026-10-20 ~10:52 |
| Phase 1 — GSC Live Test (collection URL `/collections/living-room-lighting`) | DONE — 200 OK, URL available to Google, crawl allowed, page fetch successful, indexing allowed. Conditional indexing notice present ("URL will be indexed only if certain conditions are met") — does NOT confirm current indexing. Screenshot verified. | Piranav | 2026-10-20 11:00 |
| Phase 2 — PowerShell (blog URL) | DONE — 200 OK (PDF Evidence I, J, K) | Robesan/team | 2026-10-19 |
| Phase 2 — PowerShell (product URL) | PENDING | Next person | — |
| Phase 2 — PowerShell (collection URL) | PENDING | Next person | — |
| Phase 3 — SF small crawl with headers | PENDING | Licensed SF operator or next session | — |

**Overall validation status: PHASE 1 COMPLETE — PHASE 2 + 3 PENDING**

Phase 1 GSC Live Tests now complete for blog, product, and collection URL types. All three returned 200 OK and "URL available to Google."

Do NOT mark the investigation as PASS. Phase 2 (PowerShell with header capture) and Phase 3 (SF small crawl) are required to determine whether the original 429 can be reproduced and what the root cause is. The task status remains **INVESTIGATION / CONTROLLED SCREAMING FROG RETEST PENDING**.
