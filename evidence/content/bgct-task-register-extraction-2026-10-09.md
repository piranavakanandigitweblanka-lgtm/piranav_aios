# Evidence — BGCT Task Register Extraction
**Date:** 2026-10-09
**Task:** Extract Task name, BGCT owner, Last updated date from 12 BGCT handbook .docx files into CSV

## Source
- Folder: `C:\Users\PC\Downloads\drive-download-20261009T051735Z-1-001`
- 12 .docx files — BGCT Technical Handbooks (Accessibility, CRO, Design, Theme Customisation, and 8 x Technical SEO)

## Output
- CSV saved to: `C:\Users\PC\Downloads\drive-download-20261009T051735Z-1-001\bgct_task_register.csv`
- Columns: Task name | BGCT link | BGCT owner | Last updated date

## Extracted Data

| Task name | BGCT owner | Last updated date |
|---|---|---|
| Accessibility_BGCT_Technical_Handbook_v1.0 | Kuberan | 11 June 2026 |
| Broken Links and Shopify 404 Redirects | Piranav | 11 June 2026 |
| Canonical Tag Audits & Fixes | Piranav | 11 June 2026 |
| CRO_Shopify_UIUX_BGCT_Technical_Handbook_v1.0 | Kuberan | 11 June 2026 |
| Design_and_Layout_BGCT_Technical_Handbook_v1.0 | Kuberan | 11 June 2026 |
| Fix Shopify Crawl Errors | Piranav | 11 June 2026 |
| Fix_Crawl_Errors_BGCT_Handbook | Piranav | (encoding error) |
| Hreflang Setup for Multilingual Shopify | Piranav | 11 June 2026 |
| Optimize Shopify robots.txt | Piranav | 11 June 2026 |
| Redirect Chains Cleanup | Piranav | 11 June 2026 |
| Shopify Sitemap Optimization | Piranav | 11 June 2026 |
| Theme_Customization_BGCT_Technical_Handbook_v1.0 | Kuberan | 11 June 2026 |

## Notes
- BGCT link column is blank — no URLs found inside docs. Piranav to add manually.
- Fix_Crawl_Errors_BGCT_Handbook.docx had a Unicode encoding error — date not extracted but owner confirmed as Piranav from visible text.
- `Fix Shopify Crawl Errors.docx` and `Fix_Crawl_Errors_BGCT_Handbook.docx` appear to be duplicates — flag for cleanup.
