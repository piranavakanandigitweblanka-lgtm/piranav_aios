# GA-08 — Screenshot Manifest

**Collection:** Low Wattage Bulbs (`low-wattage-bulbs`)  
**Store:** LEDSone UK  
**Date:** 2026-10-07

---

| File | Status | Date | What it shows | Source |
|---|---|---|---|---|
| `before/GA-08_before_tag_update_2026-10-07.png` | BEFORE | 2026-10-07 | Smart collection rule = `Spider Pendant` + inventory > 30. Collection items = 53 — all pendant lights, zero actual bulbs. | `C:\Users\PC\Downloads\Screenshot 2026-10-07 114847.png` |
| `after/GA-08_after_tag_update_2026-10-07.png` | AFTER | 2026-10-07 | Smart collection rule = `Low Wattage Bulb` + inventory > 30. Collection items = 31 — all actual LED bulbs, no pendants. | `C:\Users\PC\Downloads\Screenshot 2026-10-07 114951.png` |

---

## What Changed (confirmed from screenshots)

| Field | Before | After |
|---|---|---|
| Collection rule tag | `Spider Pendant` | `Low Wattage Bulb` |
| Collection item count | 53 | 31 |
| Products shown | Pendant lights, spider fittings | Vintage LED filament bulbs |
| Inventory condition | `> 30` | `> 30` (unchanged) |

---

## Notes

- The AFTER screenshot confirms the threshold chosen was the `Low Wattage Bulb` tag (not `WATT4W` directly).
- 31 products in the AFTER collection — consistent with the DB extraction result of 31 WATT4W products (the ≤4W threshold was applied, not <5W).
- The 2W and 3W products (2 total) are not visible in the after count — they may lack the `Low Wattage Bulb` tag or may be filtered by the inventory > 30 condition.
- Final live verification should confirm all expected products are present.
