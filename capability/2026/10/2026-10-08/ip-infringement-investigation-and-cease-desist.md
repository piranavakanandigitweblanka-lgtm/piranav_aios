# Capability — IP Infringement Investigation & Cease and Desist Generation

**Capability ID:** CAP-LEGAL-001  
**Created:** 2026-10-08  
**Status:** ACTIVE  
**Category:** Legal / Brand Protection

---

## What This Capability Does

Given a suspected infringing website URL, Claude Code can:

1. Fetch and compare the infringing site against our own brand assets (ledsone.co.uk / ledsone.de)
2. Confirm whether the site is ours or a third party
3. Identify all applicable legal claims with strength ratings
4. Produce a **formal Cease & Desist letter** as a print-to-PDF HTML file
5. Produce a full **IP Infringement Analysis & Action Plan** as a print-to-PDF HTML file
6. Log all evidence, prompt, validation, and closure entries into AIOS

---

## Where It Lives

| File | Path |
|---|---|
| Prompt template | `prompts/legal/ledsone-ip-cease-and-desist.md` |
| First evidence file | `evidence/legal/lidsone-ip-infringement-2026-10-08.md` |
| First C&D output | `ledsone-cease-and-desist.html` |
| First action plan output | `ledsone-ip-action-plan.html` |

---

## How to Trigger It

Tell Claude:
> "A website [URL] is using our logo / brand identity. Investigate and produce a C&D letter and action plan as PDFs."

Or use the prompt template at `prompts/legal/ledsone-ip-cease-and-desist.md` directly.

---

## Legal Claims It Identifies

| Claim | Jurisdiction |
|---|---|
| Copyright infringement (logo) | UK + EU (Directive 2001/29/EC) |
| Passing off / Trade dress | UK common law |
| Unfair commercial practice | EU (Directive 2005/29/EC) |
| E-Commerce Directive breach (no VAT/address) | EU (Article 5, Directive 2000/31/EC) |

---

## Output Format

Both output files are **HTML → PDF** via browser Ctrl+P. No third-party tool required.

| Document | Audience | Contents |
|---|---|---|
| `ledsone-cease-and-desist.html` | External — sent to infringer | Formal legal notice, 7-day deadline, demands, consequences |
| `ledsone-ip-action-plan.html` | Internal | Site comparison, claims table, 5-step action plan, trademark recommendation |

---

## First Use

- **Date:** 2026-10-08  
- **Infringing site:** lidsone.com  
- **Outcome:** C&D + action plan produced. Physical evidence capture and send pending Piranav.  
- **Closure:** `closure/README.md — 2026-10-08 Lidsone IP Infringement Investigation`

---

## Notes

- Always archive the infringing site on Wayback Machine before sending any notice — they may remove the logo quickly
- If LEDSone trademark is registered (UK IPO / EUIPO), add the registration number to the C&D — significantly strengthens the legal position
- Shopify IP report (fast takedown): shopify.com/legal/report-ip
- WHOIS lookup: who.is/whois/[domain]
