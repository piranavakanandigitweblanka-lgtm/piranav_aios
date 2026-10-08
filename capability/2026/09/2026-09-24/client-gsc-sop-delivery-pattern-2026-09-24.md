# Capability — Client GSC SOP Delivery Pattern

## Date First Identified
2026-09-24

## Last Updated
2026-09-24

## Status
ACTIVE — Applied for Homingmbh (homingmbh.de), 2026-09-24

## Purpose
Deliver a Google Search Console SOP to a client and update the AIOS reference documentation to record the SOP delivery and content.

## Business Problem Solved
When Piranav sets up a client's GSC account and hands over ongoing monitoring, the client needs a written SOP they can follow independently. Without an SOP, clients contact Piranav repeatedly for basic GSC questions. An AIOS evidence record ensures the SOP is queryable and the client's GSC setup is traceable.

## When To Use
- A new client GSC account has been set up
- Piranav is handing over day-to-day GSC monitoring to the client or their team
- An AIOS record of the client's GSC setup is needed for future reference

## When NOT To Use
- For internal LEDSone staff (different SOP exists)
- When the GSC account is Piranav-managed long-term (no handover needed)

## Required Inputs
- Client name and GSC property URL
- Verified GSC access (service account or direct user access)
- Client contact email for the SOP recipient

## Source Task / Requirement
Homingmbh GSC SOP + AIOS Update
homingmbh.de, 2026-09-24

## Execution Steps

1. **Verify GSC property is set up** — confirm the property exists in GSC and data is flowing (impressions/clicks visible)

2. **Write the GSC SOP** covering:
   - How to log into GSC
   - Key reports to check weekly (Performance, Coverage, Core Web Vitals)
   - How to interpret impressions, clicks, CTR, position
   - What to flag to Piranav (coverage errors, penalty notices, traffic drops >20%)
   - How to submit a sitemap if needed

3. **Deliver SOP to client** via their preferred channel (email, shared doc, etc.)

4. **Create AIOS evidence file** at `evidence/[client]/gsc-sop-[YYYY-MM-DD].md` recording:
   - Client name, GSC property
   - Date SOP delivered
   - Recipient name and email (no personal data beyond role/name)
   - Summary of what the SOP covers

5. **Update AIOS source-map** if client's GSC property is a new data source

6. **Update AIOS docs reference** if a general GSC SOP template should be reused

## Evidence Required
- Confirmation that SOP was delivered (email sent, doc shared)
- Evidence file at `evidence/[client]/`

## Evidence Path
`validation/piranav/homingmbh-gsc-sop-2026-09-24.md`
`prompts/documentation/homingmbh-gsc-sop-aios-update.md`

## Pass / Fail Rule
PASS: SOP delivered to client. AIOS evidence file created. Source-map updated if new property added.
FAIL: SOP delivered but no AIOS evidence record. Or evidence exists but SOP was never confirmed as delivered.

## Owner / Reviewer
Owner: Piranav
Reviewer: Piranav (client relationship manager)

## Known Limits
- SOP content varies per client depending on their GSC access level and technical literacy — this capability documents the PROCESS, not the content
- Client GSC property data is not stored in Ledsone PostgreSQL — it exists in Google's systems only

## Reuse Path
Apply for each new client GSC handover. Create a new evidence file per client with the date. Cross-reference from the client's AIOS folder if one exists.

## Related Capabilities
- `shopify-customer-google-signin.md` — related client setup work (separate capability)

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-24 | Initial capability captured from Homingmbh GSC SOP | `validation/piranav/homingmbh-gsc-sop-2026-09-24.md` |
