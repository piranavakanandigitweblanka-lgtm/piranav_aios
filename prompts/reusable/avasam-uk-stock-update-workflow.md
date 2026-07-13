# Workflow: Update Avasam CSV UK Stock from ledsone-db-mcp

## Purpose
Update column C (UK stock) in the Avasam stock CSV file using live data from the `ledsone-db-mcp` database. Run this whenever a new Avasam stock CSV is generated.

## Trigger
- A new `evidence/avasam/avasam_stock_YYYY-MM-DD.csv` has been created
- Column A = Avasam ProductId (SKU), Column B = Avasam current stock, Column C = UK stock (to update)

---

## Step 1 — Query all UK stock from DB

Use `ledsone-db-mcp` → `execute_sql`:

```sql
SELECT p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK';
```

> Result will be large (~43k rows). Save the tool output file path.

---

## Step 2 — Parse and update CSV (Python)

```python
import csv, json

# Load DB result (saved tool output file)
result_file = r"<path-to-tool-output>.txt"
with open(result_file, encoding='utf-8') as f:
    data = json.load(f)

rows_db = data['data']['rows']

# Build lookup from BOTH sku AND sku_original (covers ENC codes + combo SKUs)
stock_map = {}
for r in rows_db:
    val = int(r['uk_stock'])
    stock_map[r['sku']] = val
    if r['sku_original'] and r['sku_original'] != r['sku']:
        stock_map[r['sku_original']] = val

# Read CSV (comma-separated, UTF-8 BOM)
csv_path = r"evidence/avasam/avasam_stock_YYYY-MM-DD.csv"
with open(csv_path, newline='', encoding='utf-8-sig') as f:
    rows = list(csv.reader(f))

updated = 0
not_found = []

for row in rows[1:]:
    if not row or not row[0].strip():
        continue
    sku = row[0].strip()
    if sku in stock_map:
        while len(row) < 3:
            row.append('')
        row[2] = str(stock_map[sku])
        updated += 1
    else:
        not_found.append(sku)

print(f"Updated: {updated}, Not found: {len(not_found)}")

# Write to temp first (avoids permission error if file is open in Excel)
out_path = r"C:\Users\PC\AppData\Local\Temp\claude\avasam_updated.csv"
with open(out_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
```

Then copy temp → original:
```bash
cp "C:\Users\PC\AppData\Local\Temp\claude\avasam_updated.csv" "<csv_path>"
```

> **Note:** Close the CSV in Excel before copying or you'll get a "Device or resource busy" error.

---

## Step 3 — Commit and push

```bash
git add evidence/avasam/avasam_stock_YYYY-MM-DD.csv
git commit -m "[AIOS] Avasam stock YYYY-MM-DD — UK stock col C updated from ledsone-db-mcp (NNNN/TTTT matched)"
git push
```

---

## Key Notes

| Detail | Value |
|--------|-------|
| DB table (products) | `inventory.products` — columns: `id`, `sku`, `sku_original` |
| DB table (stock) | `inventory.local_inventory_current_stock_location_wise` — columns: `inventory_id`, `warehouse_location`, `stock` |
| UK filter | `warehouse_location = 'UK'` |
| Dual lookup | Match CSV SKU against both `sku` (ENC codes) AND `sku_original` (combo SKUs) |
| Typical match rate | ~98–99% (a few bundle SKUs may not exist in DB) |
| CSV format | Comma-separated, UTF-8 BOM (`utf-8-sig`) |

---

## Example prompt to run this workflow

> "Update UK stock in col C of `evidence/avasam/avasam_stock_2026-07-13.csv` from ledsone-db-mcp"
