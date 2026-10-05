# CC-02 — Implementation Prompt

**Use this prompt when investigating and fixing conduit guide links.**

---

## Prompt

You are helping Piranav identify and fix broken links in the conduit guides on ledsone.co.uk.

**Task:** CC-02 — Conduit Guide Link Correction

**What is broken:**
- 4 links in conduit guides pointing to sold-out products
- 1 link in a conduit guide pointing to a page that no longer exists

**Step 1 — Discover**

Open all conduit guides on ledsone.co.uk and click every internal product/collection link.
Identify the 5 broken links. For each one, record:
- Which guide page it appears on (URL)
- The existing broken link URL
- The problem: "sold out" or "page unavailable"

Never guess — only record what you actually find.

**Step 2 — Find replacements**

For each broken link, find the correct replacement:
- For sold-out products: find the closest live, in-stock alternative
- For a missing page: find the correct live page it was meant to link to

Verify every replacement URL is live and in-stock before recording it.
Never invent a URL.
If no replacement can be found, write UNKNOWN and escalate to Muguntha.

**Step 3 — Update the Link Tracking Table**

Fill in task.md Link Tracking Table — no TBD values should remain after this step.

**Step 4 — Implement**

Update the 5 links in the conduit guides in Shopify.

**Step 5 — Verify**

Click each updated link on the live site.
Confirm it opens a live, in-stock page.
Save after screenshots to `after/`.
Record evidence in `evidence/`.

**Constraint:**
- Do not mark this task COMPLETED until all 5 links are verified live
