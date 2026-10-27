# Validation — Avasam UK Stock Update 2026-10-27

## Checklist

| Check | Result |
|---|---|
| Input CSV found at specified path | PASS |
| Input CSV row count = 2,656 data rows | PASS |
| Output row count = input row count (2,656) | PASS |
| Original SKU column unchanged | PASS |
| Original Quantity column unchanged | PASS |
| All stock values from UK warehouse only (`warehouse_location = 'UK'`) | PASS |
| Both `sku` and `sku_original` matching attempted | PASS |
| Unmatched rows explicitly flagged (not set to zero) | PASS |
| Ambiguous rows explicitly flagged | PASS |
| No DB credentials in output CSV | PASS |
| Output file saved to `evidence/avasam/` | PASS |
| Evidence file saved | PASS |
| Prompt saved before execution (Rule 1) | PASS |
| PROMPT_REGISTER updated | PASS |

## Counts

| Metric | Value |
|---|---|
| Total input rows | 2,656 |
| Unique input SKUs | 2,656 |
| DB products scanned | 45,314 |
| Matched | 2,605 (98.1%) |
| Unmatched | 26 (1.0%) |
| Ambiguous | 25 (0.9%) |
| Zero stock (confirmed) | 812 |
| Positive stock | 1,793 |
| Unavailable/unverified | 51 |

## Match Rate
98.1% — **PASS** (threshold: ≥95%)

## Notes
- 26 unmatched SKUs are almost all complex bundle combinations (+ separator SKUs) not stored as single products in inventory.products. Three worth investigating: ENC3548, SWGS1GBL1, PHSF1PWR40WH???
- 25 ambiguous SKUs matched different product IDs via sku vs sku_original — left blank with AMBIGUOUS status. Piranav should review these.
- ENC3493 input Quantity = -1 (negative Avasam stock) — DB shows UK stock = 0. Preserved as-is.

## Session Result
**PASS**
