# Report: LEDSone US Phase 2B — Manual Shopify Admin Change Plan

**Date:** 2026-09-30
**Phase:** 2B — CHANGE PLAN ONLY. NO SHOPIFY CHANGES PERFORMED.
**Req ID:** LEDSONE-US-PHASE2B-CHANGEPLAN-2026-09-30
**Approved by:** GPT Brain (Phase 2B approval, 2026-09-30)
**Data source:** PostgreSQL `listings.shopify_listings` (sub_source = 245), synced 2026-09-30
**Canonical concepts approved:** Colour | Bulb Included | Pack Quantity | Cable Length

---

## HOW TO READ THIS PLAN

- **Product ID** = Shopify product ID. Use in Shopify Admin URL: `/admin/products/{id}`
- **Action** = what Piranav must do manually in Shopify Admin
- **Risk** = LOW (rename only, minimal variant impact) / MEDIUM (value change too) / HIGH (excluded — do not change)
- All changes must be made via Shopify Admin → Products → [Product] → Variants → Edit options
- Do NOT bulk-edit. Each product must be changed individually and verified.
- After each rename, Shopify may prompt to update variant URLs — accept the redirect offer.

---

## SECTION A — SAFE RENAMES

*Option name changes only. Values stay the same unless Section B specifies otherwise.*
*All changes here are explicitly approved. Low-risk for most; variant URL change noted where applicable.*

---

### A1 — `color` → `Colour` (~86 products)

The `color` option name is incorrect American-English casing inconsistent with the rest of the store. Rename to `Colour`. Values remain unchanged in this step (value normalization is a separate Section B task).

**⚠ URL Risk:** Renaming a Shopify variant option name does NOT automatically change variant URLs on most themes. However, confirm with Piranav before batch-executing. Test on 1 product first.

| Product ID | Product Title | Status | Current Values (sample) | Action |
|---|---|---|---|---|
| 10021660164379 | 11.41" Metal Shaded Farmhouse Pendant Light 1M Dimmable ~1002 | active | Blue, Brushed Brass, Chrome, Grey… | Rename `color` → `Colour` |
| 10021659541787 | 2 Set of 14in. Modern Metal Pendant Lamphade ~1028 | draft | Brushed Copper, Grey | Rename `color` → `Colour` |
| 10021659607323 | 2 Set of 14-Inch Modern Farmhouse Pendant LampShade ~1026 | active | Black, Brushed Copper, Rustic Red… | Rename `color` → `Colour` |
| 10420793770267 | 2-Pack Semi Flush Mount Ceiling Light ~1191 | active | Black, Blue, Brushed Copper… | Rename `color` → `Colour` |
| 10125293453595 | 21cm Indoor 1 Light Pendant Lamp Dome E26 ~1132 | active | Brushed Copper, Brushed Silver, Rustic red | Rename `color` → `Colour` |
| 10309379064091 | 2m Counterweight pendant light 21cm ~1189 | active | Black, Green, Orange, Red… | Rename `color` → `Colour` |
| 10128240115995 | 3 Bulb Hemp Pendant Light ~1153 | draft | Chrome, Satin Nikel | Rename `color` → `Colour` |
| 10128322461979 | 3 Light Adjustable Pendant Light ~1155 | active | Black Inner Gold, Brushed Copper… | Rename `color` → `Colour` |
| 10130779177243 | 3 Light Bar Pendant Light Metal ~1156 | active | Black, Green, Grey, Orange… | Rename `color` → `Colour` |
| 10179286565147 | 3 Light Cluster Pendant Lighting Metal ~1201 | active | Black, Brushed Copper, Rustic Red | Rename `color` → `Colour` |
| 10179281813787 | 3 set hanging light ~1200 | draft | Brushed Brass, Brushed Copper, Rose Gold… | Rename `color` → `Colour` |
| 10179259891995 | 3 set pendant lights ~1199 | draft | Blue, Grey, Orange, Red… | Rename `color` → `Colour` |
| 10196608483611 | Adjustable Metal Dome Bedside Wall Light Sconce ~1217 | active | Black, Brushed Copper, Rustic Red… | Rename `color` → `Colour` |
| 10334005494043 | Adjustable Metal Pendant Light Fixture ~1185 | active | Black, Black Inner Gold, Green… | Rename `color` → `Colour` |
| 10109930209563 | Adjustable Metal Pendant Light with On/Off Switch ~1138 | active | Black, Brushed copper, Green… | Rename `color` → `Colour` |
| 10254078148891 | Adjustable Pulley Funnel Pendant | active | Brushed Copper, Chrome, French Gold… | Rename `color` → `Colour` |
| 10109937811739 | Barn Plug-In Hanging Light Swag Lamp ~1041 | active | Black, Green, Orange, Red | Rename `color` → `Colour` |
| 10021660066075 | Ceiling Light Fixture With Pull System ~1005 | active | Brushed Copper, Rustic Red, Satin Nickel | Rename `color` → `Colour` |
| 10021658099995 | Ceiling Pendant Light Fixture ~1060 | active | Black, Brushed Silver, Orange… | Rename `color` → `Colour` |
| 10195674824987 | Counterweight Pulley Pendant Light | active | Black, Black Inner Gold, Green… | Rename `color` → `Colour` |
| 10109626646811 | Dome Wall Sconce with Adjustable Arm ~1125 | active | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10158842183963 | E26 Counterweight Farmhouse Pulley/V Industrial ~1163 | active | Black, Brushed Copper, Satin Nickel… | Rename `color` → `Colour` |
| 10128245129499 | Farmhouse 3 Light Hemp Hanging Lamp ~1154 | active | Black, Blue, Green, Orange… | Rename `color` → `Colour` |
| 10184613069083 | Farmhouse Lights ~1209 | active | Black, Brushed Copper | Rename `color` → `Colour` |
| 10122154836251 | Farmhouse Pendant Light Dome Shaded 21cm ~1146 | active | Black, Green, Orange, Red… | Rename `color` → `Colour` |
| 10124422840603 | Farmhouse Plug In Pendant Light ~1129 | active | Black Inner Gold, Brushed copper… | Rename `color` → `Colour` |
| 10054227558683 | Farmhouse Style Gooseneck Wall Light ~1146 | active | Black, Blue, Brushed Brass, Brushed Copper | Rename `color` → `Colour` |
| 10158875803931 | Flush Mount Ceiling Lamp ~1166 | draft | Bkack, Blue, Green, Grey… | Rename `color` → `Colour` + fix `Bkack`→`Black` (Section B) |
| 10021659345179 | Flush Mount Ceiling Light Fixture E26 Socket ~1010 | active | Black, Chrome, Rose Gold | Rename `color` → `Colour` |
| 10122162929947 | Gooseneck Light Wall Sconce ~1167 | active | Black, Blue, Green, Orange… | Rename `color` → `Colour` |
| 10109229891867 | Gooseneck Wall Light Fixtures with Flat Shade ~1121 | active | Brushed Copper, Yellow brass | Rename `color` → `Colour` |
| 10021657772315 | Harbor 11.81" Industrial Barn Farmhouse Light ~1065 | active | Black Inner Gold, Green, Orange… | Rename `color` → `Colour` |
| 10225768497435 | Harbor Lampshade Metal Easy Fit Replacement ~1219 | active | Black, Brushed Copper, Copper… | Rename `color` → `Colour` |
| 10128233529627 | Hemp Hanging Light ~1151 | draft | Brushed Brass, Brushed Copper, French Gold… | Rename `color` → `Colour` |
| 10128234053915 | Hemp Metal Hanging Light ~1152 | draft | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10109562028315 | Hemp Rope Hanging Light with Metal Shade ~1214 | active | Brushed Copper, Satin Nickel… | Rename `color` → `Colour` |
| 10158868201755 | Hemp rope hanging light ~1165 | draft | Blue, Brushed Brass, Brushed Copper… | Rename `color` → `Colour` |
| 10309356355867 | Indoor Heritage Scalloped Wall Sconce | active | Black, Brushed Copper | Rename `color` → `Colour` |
| 10108512698651 | Industrial Curvy Metal Plug In Pendant Light ~1119 | active | Black Inside Gold, Brushed Copper, Chrome… | Rename `color` → `Colour` |
| 10125102973211 | Industrial Farmhouse Pendant Light Fixture ~1149 | active | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10163698041115 | Industrial Flush Mount Light ~1212 | draft | Black, Brushed Copper, French gold… | Rename `color` → `Colour` |
| 10320815685915 | Industrial Metal Dome Pendant Light Fixture ~1186 | active | Black, Black Inner White, Orange, Red | Rename `color` → `Colour` |
| 10125113721115 | Industrial Metal Pendant Light - Adjustable E26 ~1150 | active | Blue, Green, Orange, Red, White | Rename `color` → `Colour` |
| 10320810606875 | Industrial Metal Pendant Light Fixture | draft | Black | Rename `color` → `Colour` |
| 10021659312411 | Industrial Pendant Light with E26 Base ~1012 | active | Blue, Brushed Brass, Chrome, Grey… | Rename `color` → `Colour` |
| 10160262185243 | Industrial Pendant Light ~1172 | draft | Black, Black Inner Gold, Black Inner White | Rename `color` → `Colour` |
| 10352613523739 | Industrial Plug in Wall Light with Adjustable Head | draft | Black Inner Gold, Chrome, French Gold… | Rename `color` → `Colour` |
| 10388624376091 | Industrial Semi Flush Mount Ceiling Light | draft | Black, Blue, Chrome, French Gold… | Rename `color` → `Colour` |
| 10021659377947 | Industrial Style Three Way Pendant Lighting ~1016 | active | Black, Black Inner Gold, Blue… | Rename `color` → `Colour` |
| 10021659902235 | Industrial Wall Sconce Adjustable Arm ~1015 | active | Black, Copper, Yellow brass | Rename `color` → `Colour` |
| 10021660033307 | Industrial Wall Sconce 8.66" Shade ~1006 | active | Black, Brushed Copper | Rename `color` → `Colour` |
| 10021660000539 | LEDSone Industrial Wall Sconce 8.66" ~1007 | active | Black, Brushed Brass, Brushed Copper, Rustic Red | Rename `color` → `Colour` |
| 10021659705627 | Ledsone 14in. Modern Farmhouse Pendant Lampshade ~1025 | active | Black, Brushed Copper, Rustic Red… | Rename `color` → `Colour` |
| 10021659574555 | Ledsone 14in. Modern Metal Pendant Lamphade ~1027 | draft | Brushed Copper, Grey | Rename `color` → `Colour` |
| 10021656854811 | Metal Adjustable Shaded Pendant Light ~1076 | active | Brushed Copper, Rustic Red, Satin Nickel | Rename `color` → `Colour` |
| 10109916021019 | Metal Ceiling Lamp Shades ~1139 | active | Black Inner Black, Black Inner Gold… | Rename `color` → `Colour` |
| 10108520792347 | Metal Cone Shade Ceiling Light Fixture ~1120 | active | Black, Black Inner Gold, Green… | Rename `color` → `Colour` |
| 10167309992219 | Metal Flush Mount Light Fixture E26 ~1179 | active | Black, Blue, Orange, Red, White | Rename `color` → `Colour` |
| 10122110599451 | Metal Hanging Light ~1145 | active | Black Inner Gold, Brushed Copper, Grey… | Rename `color` → `Colour` |
| 10169143001371 | Metal Low Ceiling Light Fixture ~1178 | active | Brushed Copper, Chrome, Green Brass | Rename `color` → `Colour` |
| 10119397572891 | Metal Pendant Hanging Light ~1143 | active | Black, Blue, Green, Orange… | Rename `color` → `Colour` |
| 10021659738395 | Modern Farmhouse Pulley Pendant ~1022 | active | Blue, Chrome, Grey, Rose Gold… | Rename `color` → `Colour` |
| 10021656887579 | Modern Hanging Pulley System Light Fixture | draft | Black, Blue, Brushed Copper, Orange… | Rename `color` → `Colour` |
| 10021659836699 | Modern Metal Semi Flush Ceiling Light ~1018 | active | Black, Blue, Grey, Rustic Red… | Rename `color` → `Colour` |
| 10163693781275 | Multiple Ajustable Spider Lamp ~1176 | active | Black, Blue, Brushed Copper, Chrome… | Rename `color` → `Colour` |
| 10180406116635 | Plug In Bedside Wall Light ~1202 | active | Black, Blue, Green, Orange… | Rename `color` → `Colour` |
| 10183141327131 | Plug In Wall Sconce With 13.12Ft Corded Switch ~1203 | active | Brushed Copper, Chrome, French Gold… | Rename `color` → `Colour` |
| 10109955375387 | Plug in Pendant Light with Metal Shade Switch ~1047 | active | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10209725186331 | Scalloped Hanging Light ~1181 | draft | Black, Brushed Brass, Brushed Copper… | Rename `color` → `Colour` |
| 10021656953115 | Shaded 2M Pulley Pendant Light ~1075 | draft | Black, Brushed Copper, Orange, Rustic Red… | Rename `color` → `Colour` |
| 10109560684827 | Shaded Rope Pendant Light Fixture ~1143 | active | Black, Brushed Copper | Rename `color` → `Colour` |
| 10162068521243 | Single Pendant Light With Metal Shade E26 ~1174 | active | Black, Brushed Copper, Rustic Red… | Rename `color` → `Colour` |
| 10163684606235 | Spider Pendant Light ~1175 | active | Chrome, Copper, Green Brass, Rose Gold… | Rename `color` → `Colour` |
| 10109957898523 | Swag 29cm Metal Plug in Pendant Light 4m ~1048 | active | Black Inner Gold, Brushed copper, Chrome… | Rename `color` → `Colour` |
| 10169507283227 | Swan Neck Wall Lights Indoor ~1180 | active | Chrome, Copper, French Gold, Rose Gold… | Rename `color` → `Colour` |
| 10195699630363 | Swivel Ceiling light | draft | Black, Blue, Brushed Copper, Green… | Rename `color` → `Colour` |
| 10254087422235 | Up and Down Adjustable Swag Pendant | draft | Black, Blue, Green, Orange… | Rename `color` → `Colour` |
| 10167192355099 | Vintage 30cm Dome Ceiling Light Metal ~1211 | draft | Black, Black inner White, Red, White | Rename `color` → `Colour` |
| 10109241295131 | Vintage style 3 Pack Metal Curvy Lamp Shades ~1123 | active | Black, Blue, Brushed Copper, Chrome… | Rename `color` → `Colour` |
| 10160312549659 | Wall Sconce For Bedroom Vintage ~1173 | active | Black, Black & Yellow Brass, Yellow Brass | Rename `color` → `Colour` |
| 10021657805083 | Wall Sconce With Cone Metal Shade ~1064 | active | Black Inner Gold, Brushed Copper… | Rename `color` → `Colour` |
| 10175853035803 | ceiling light semi flush ~1193 | draft | Black Inner White, Blue, Yellow Brass | Rename `color` → `Colour` |
| 10178329608475 | light shade ~1197 | draft | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10021660131611 | Ø 11.41 inch Easy Fit Metal Pendant Light Shade ~1003 | active | Black, Blue, Green, Grey… | Rename `color` → `Colour` |
| 10452202029339 | Ø 11.41 inch Metal Pendant Light Shades Replacement Easy Fit | active | Black Inner Gold, Brushed Copper, Chrome… | Rename `color` → `Colour` |
| 10196488061211 | Ø 15.74 in Large Metal Light Shade | active | Black, Black Inner Gold | Rename `color` → `Colour` |
| 10109932831003 | Ø15.74" Plug-in 13.12ft Pendant Swag Lamp ~1140 | active | Black, Black Inner Gold | Rename `color` → `Colour` |
| 10021660197147 | Ø8.6″ Metal Lamp Shades For Pendant Light E26 ~1001 | active | Black, Blue, Copper, Green Brass… | Rename `color` → `Colour` |

**Additional `color` renames to non-Colour canonical names (see also Section C):**

| Product ID | Product Title | Status | Current Values | Action |
|---|---|---|---|---|
| 10196545831195 | Rope hanging light 1m E26 ~1216 | active | With Bulb, Without Bulb | Rename `color` → `Bulb Included` + normalize values to Yes/No |
| 10384904487195 | 3 Core Jute 18 AWG Fabric Covered Electrical Wire | active | 3.28ft, 16.4ft, 32.8ft | Rename `color` → `Cable Length` |

---

### A2 — Other Colour concept renames

| Product ID | Product Title | Status | Current Option | New Option | Notes |
|---|---|---|---|---|---|
| 10021923193115 | 5W Metal Caged Light Bulb Dimmable ~1093 | draft | `Color` | `Colour` | Also fix values: Rose gold→Rose Gold, black→Black (B section) |
| 10021657706779 | Industrial 3 Way Pendant Lighting Kitchen Island | active | `Color` | `Colour` | Also has Required Bulb → rename separately |
| 10021658198299 | 11.41" Shaded Metal Pendant Light ~1056 | active | `Shade Colour` | `Colour` | |
| 10109928079643 | 12.59" KUPOLVALL Easy Fit Metal Lamp Shades ~6531 | active | `Shade Colour` | `Colour` | |
| 10170916012315 | 3 Flush Mount Ceiling Light Fixture ~1181 | active | `Shade Colour` | `Colour` | Also has `Required the bulbs?` → rename separately |
| 10021658231067 | Hemp Rope Metal Pendant Light 11.41" Shaded ~1057 | active | `Shade Colour` | `Colour` | |
| 10021657739547 | Industrial Dome Pendant Light Shade, Metal ~1066 | active | `Shade Colour` | `Colour` | |
| 10021658329371 | Light Sconces For Wall With Metal Shade ~1049 | active | `Shade Colour` | `Colour` | |
| 10021657674011 | Vintage Metal Lamp Shade 8.3'' E26 ~1067 | active | `Shade Colour` | `Colour` | |
| 10471282868507 | Sloped Angled Ceilings Swivel Arm Semi Flush Light | active | `Holder Colour` | `Colour` | Values: Black, Black and Brass, Brass — keep as-is |
| 10173550035227 | 3 Metal Shaded Pendant Light ~1188 | active | `Colur` | `Colour` | Also fix value: Brushed copper→Brushed Copper; also has Bulb→rename separately |
| 10175863357723 | Swing Arm Lamp ~1195 | draft | `Farbe` | `Colour` | **Translate values** (see Section B) |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | draft | `Schattenfarbe` | `Colour` | **Translate values** (see Section B); also has `Benötigt eine Glühbirne?` → rename separately |

---

### A3 — Bulb Included renames

| Product ID | Product Title | Status | Current Option | New Option | Value Change? |
|---|---|---|---|---|---|
| 10021658001691 | 11.41" Farmhouse Hemp Rope Metal Basket Pendant ~1062 | active | `Bulb` | `Bulb Included` | No — values already Yes/No |
| 10117605982491 | 3 Cage Black E26 Pendant Light ~1045 | active | `Bulb` | `Bulb Included` | No |
| 10124502728987 | 3 Light Industrial Wire Cage Hanging Lamp ~1168 | active | `Bulb` | `Bulb Included` | No |
| 10173550035227 | 3 Metal Shaded Pendant Light ~1188 | active | `Bulb` | `Bulb Included` | No (also rename Colur→Colour above) |
| 10196493205787 | 40cm Large Dome Shaded Hemp Rope Pendant Light | active | `Bulb` | `Bulb Included` | No |
| 10021657215259 | 8-Way Spider Light Cone Shade Pendant Light | draft | `Bulb` | `Bulb Included` | Yes — With Bulb→Yes, Without Bulb→No |
| 10184601370907 | Boho Chic Hanging Lamp ~1207 | draft | `Bulb` | `Bulb Included` | No |
| 10420857536795 | Cage Semi Flush Light | draft | `Bulb` | `Bulb Included` | No |
| 10119396294939 | Caged Flush Mount Ceiling Light ~1126 | active | `Bulb` | `Bulb Included` | No |
| 10184563458331 | Close to Ceiling Lights E27 Indoor Dimmable ~1206 | active | `Bulb` | `Bulb Included` | No |
| 10021659345179 | Flush Mount Ceiling Light Fixture E26 Socket ~1010 | active | `Bulb` | `Bulb Included` | No (also rename color→Colour above) |
| 10173624058139 | Mid-Century 3-Drop Dome Pendant Light ~1189 | active | `Bulb` | `Bulb Included` | No |
| 10034580259099 | Rope Pendant Light 1m Hemp Vintage Industrial ~1148 | active | `Bulb` | `Bulb Included` | Yes — With Bulb→Yes, Without Bulb→No |
| 10167192355099 | Vintage 30cm Dome Ceiling Light Metal ~1211 | draft | `Bulb` | `Bulb Included` | No (also rename color→Colour above) |
| 10196497891611 | 3 Pendant Ceiling Light Metal E26 | active | `Required Bulb` | `Bulb Included` | No |
| 10021657248027 | 5Way Vintage Industrial Ceiling Lamp Shade Chandelier | draft | `Required Bulb` | `Bulb Included` | No |
| 10021657313563 | Bulkhead Cage Wall Ceiling Mount Conduit Lighting | draft | `Required Bulb` | `Bulb Included` | No |
| 10021657575707 | Conduit Mount Ceiling Fixture ~1069 | draft | `Required Bulb` | `Bulb Included` | No |
| 10021657706779 | Industrial 3 Way Pendant Lighting Kitchen Island | active | `Required Bulb` | `Bulb Included` | No (also rename Color→Colour above) |
| 10021657641243 | Industrial Conduit Wall Light, Dimmable Metal E26 ~1068 | draft | `Required Bulb` | `Bulb Included` | No — **keep `Required Terminal Box` unchanged** |
| 10021657051419 | Metal Ceiling Light Hanging Spider Pendant Lamp | draft | `Required Bulb` | `Bulb Included` | No |
| 10021657379099 | Wall Mount Barn Light ~1073 | draft | `Required Bulb` | `Bulb Included` | No |
| 10021656822043 | Wire Cage Wall Sconce - Rustic Metal Farmhouse ~1078 | active | `Required Bulb` | `Bulb Included` | No (also rename Color→Colour above) |
| 10170916012315 | 3 Flush Mount Ceiling Light Fixture ~1181 | active | `Required the bulbs?` | `Bulb Included` | No (also rename Shade Colour→Colour above) |
| 10171005993243 | 3 bulb ceiling light fixture ~1182 | draft | `Required the bulbs?` | `Bulb Included` | No |
| 10159351431451 | 3-Light Flush Mount Ceiling Light ~1171 | draft | `Required the bulbs?` | `Bulb Included` | No |
| 10196537901339 | Black 3 tier Pendant Light for Kitchen Island ~1224 | active | `Required the bulbs?` | `Bulb Included` | No |
| 10386880135451 | Cylindrical Mesh Cluster Pendant | draft | `Required the bulbs?` | `Bulb Included` | No |
| 10403098558747 | DIAMANTBAR 3-Light Industrial Wire Cage Pendant ~1222 | active | `Required the bulbs?` | `Bulb Included` | No |
| 10119401734427 | TRADFRAME Black 3-Light Wire Cage Pendant ~1144 | active | `Required the bulbs?-` | `Bulb Included` | No |
| 10021657346331 | Bulkhead Shaded Ceiling Light Conduit ~1074 | draft | `RequiredBulb` | `Bulb Included` | No |
| 10021657444635 | E26 Conduit Mount Pipe Pendant Lighting | draft | `RequiredBulb` | `Bulb Included` | No — **keep `Size` unchanged** (Section D) |
| 10021657477403 | Exposed Conduit Hanging Light Fixture ~1071 | draft | `RequiredBulb` | `Bulb Included` | No — **keep `Size` unchanged** (Section D) |
| 10021657280795 | 5/ 4 Way Chandelier Spider Ceiling Indoor Lamp Red | draft | `Required a Bulb?` | `Bulb Included` | No — values already Yes/No |
| 10021657182491 | Black Retro Loft Spider 6 Way Ceiling Hanging Light | draft | `Required a Bulb?` | `Bulb Included` | Yes — With Bulb→Yes, Without Bulb→No |
| 10128332587291 | Flushmount Semi Circle Ceiling Light | draft | `Required a Bulb?` | `Bulb Included` | No |
| 10159330001179 | Hemp Rope Pendant Light ~1169 | draft | `Required a bulb?` | `Bulb Included` | No |
| 10021657084187 | Industrial vintage Retro 3 Head Hemp Spider Chandelier | draft | `Required Bulbs` | `Bulb Included` | No |
| 10021656920347 | Modern Multi Arm Ceiling Light Spider Lamp | draft | `Required Bulbs` | `Bulb Included` | No |
| 10119380697371 | 3 Bar Shadow Hanging Light ~1127 | draft | `Bulbs Required` | `Bulb Included` | No |
| 10405780095259 | 3-Way Hanging Cage Lighting | draft | `Benötigt die Glühbirnen?` | `Bulb Included` | Yes — Ja→Yes, Nein→No |
| 10158823604507 | 3-light pendant fixture ~1162 | draft | `Benötigt eine Glühbirne` | `Bulb Included` | Yes — Ja→Yes, Nein→No |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | draft | `Benötigt eine Glühbirne?` | `Bulb Included` | Yes — Ja→Yes, Nein→No (also rename Schattenfarbe→Colour above) |
| 10175863357723 | Swing Arm Lamp ~1195 | draft | `Birne` | `Bulb Included` | Yes — Mit Glühbirne→Yes, Ohne Glühbirne→No (also rename Farbe→Colour above) |
| 10171316502811 | 3 bulb bar pendant light ~1187 | draft | `Brauchen Sie Glühbirnen?` | `Bulb Included` | No — values are already No/Yes — **keep `Type` option unchanged** |
| 10159330558235 | Pendant Light Hemp Rope ~1170 | draft | `Erforderlich eine glühbirne?` | `Bulb Included` | No — values are already No/Yes |

---

### A4 — Pack Quantity renames (clean products only)

| Product ID | Product Title | Status | Current Option | New Option | Value Change? |
|---|---|---|---|---|---|
| 10021658591515 | E26 LED Edison Bulbs 8W Vintage Filament Bulbs ~1036 | active | `PACK` | `Pack Quantity` | Yes — 1 PACK→1 Pack, 2 PACK→2 Pack etc. (Section B) |
| 10177953136923 | DIAMANTVALL Easy-Fit Diamond Shape Wire Cage Light Shade ~1196 | active | `Pack ` *(trailing space)* | `Pack Quantity` | Yes — Pack of 1→1 Pack etc. (Section B) |
| 10171297005851 | GEOMETRY 3-Light Geometric Black Metal Hanging Ceiling Fixture ~1186 | active | `size` *(lowercase)* | `Pack Quantity` | No — values 1 Pack, 2 Pack already correct |

---

### A5 — Cable Length renames (clean products only)

| Product ID | Product Title | Status | Current Option | New Option | Value Change? |
|---|---|---|---|---|---|
| 10021659476251 | 18AWG 2 Core Hemp Rope Cable ~1030 | active | `Length` | `Cable Length` | Note: inconsistent spacing (3.28 ft vs 3.28ft) — see Section B |
| 10021659509019 | 2 Core Black 18 AWG Fabric Covered Electrical Wire ~1029 | active | `Length` | `Cable Length` | Note: 3.2ft may be typo for 3.28ft — verify before value edit |

---

### A6 — `style` individual renames

| Product ID | Product Title | Status | Current Option | New Option | Notes |
|---|---|---|---|---|---|
| 10109913661723 | E26 Medium Base Light Socket, Heat-Resistant ~1140 | active | `style` | `Colour` | Values: Black, Copper, Yellow Brass — clean colour values |
| 10171297005851 | GEOMETRY 3-Light Geometric Black Metal Hanging Ceiling Fixture ~1186 | active | `style` | `Bulb Included` | Values: With Bulb, With out Bulb → normalize values (Section B) |

---

## SECTION B — VALUE NORMALIZATION

*Changes to option values on products already listed in Section A. Apply at same time as rename.*

### B1 — Bulb Included: standardize to Yes / No

| Product ID | Product Title | Option (after rename) | Current Values | Correct Values |
|---|---|---|---|---|
| 10021657215259 | 8-Way Spider Light Cone Shade Pendant Light | `Bulb Included` | With Bulb, Without Bulb | Yes, No |
| 10034580259099 | Rope Pendant Light 1m Hemp Vintage Industrial ~1148 | `Bulb Included` | With Bulb, Without Bulb | Yes, No |
| 10021657182491 | Black Retro Loft Spider 6 Way Ceiling Hanging Light | `Bulb Included` | With Bulb, Without Bulb | Yes, No |
| 10196545831195 | Rope hanging light 1m E26 ~1216 | `Bulb Included` | With Bulb, Without Bulb | Yes, No |
| 10171297005851 | GEOMETRY 3-Light Geometric Black Metal Hanging Ceiling Fixture ~1186 | `Bulb Included` | With out Bulb, With Bulb | No, Yes |
| 10405780095259 | 3-Way Hanging Cage Lighting | `Bulb Included` | Ja, Nein | Yes, No |
| 10158823604507 | 3-light pendant fixture ~1162 | `Bulb Included` | Ja, Nein | Yes, No |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | `Bulb Included` | Ja, Nein | Yes, No |
| 10175863357723 | Swing Arm Lamp ~1195 | `Bulb Included` | Mit Glühbirne, Ohne Glühbirne | Yes, No |

### B2 — Colour: translate German values to English

| Product ID | Product Title | Current Values | English Translation |
|---|---|---|---|
| 10175863357723 | Swing Arm Lamp ~1195 | Gebürstetes Kupfer | Brushed Copper |
| 10175863357723 | Swing Arm Lamp ~1195 | Gebürstetes Silber | Brushed Silver |
| 10175863357723 | Swing Arm Lamp ~1195 | Rustikales Rot | Rustic Red |
| 10175863357723 | Swing Arm Lamp ~1195 | Schwarz | Black |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Blau | Blue |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Gelb | Yellow |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Grau | Grey |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Grün | Green |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Orange | Orange (no change) |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Rot | Red |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Schwarz | Black |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Schwarzes Innenweiß | Black Inner White |
| 10158853062939 | Swan Neck Barn Wall Light ~1164 | Weiß | White |

### B3 — Pack Quantity: standardize to "N Pack" format

| Product ID | Product Title | Current Values | Correct Values |
|---|---|---|---|
| 10021658591515 | E26 LED Edison Bulbs 8W ~1036 | 1 PACK, 2 PACK, 3 PACK, 5 PACK, 10 PACK | 1 Pack, 2 Pack, 3 Pack, 5 Pack, 10 Pack |
| 10177953136923 | DIAMANTVALL Wire Cage Light Shade ~1196 | Pack of 1, Pack of 2, Pack of 5 | 1 Pack, 2 Pack, 5 Pack |

### B4 — Colour: fix typos in values

Apply at same time as the `color`→`Colour` rename on these specific products:

| Product ID | Product Title | Typo Value | Correct Value |
|---|---|---|---|
| 10158875803931 | Flush Mount Ceiling Lamp ~1166 | Bkack | Black |
| 10021923193115 | 5W Metal Caged Light Bulb Dimmable ~1093 | Rose gold, black | Rose Gold, Black |
| 10173550035227 | 3 Metal Shaded Pendant Light ~1188 | Brushed copper | Brushed Copper |
| 10128240115995 | 3 Bulb Hemp Pendant Light ~1153 | Satin Nikel | Satin Nickel |
| 10128233529627 | Hemp Hanging Light ~1151 | Satin Nikel | Satin Nickel |
| 10109229891867 | Gooseneck Wall Light Fixtures with Flat Shade ~1121 | Yellow brass | Yellow Brass |
| 10021659902235 | Industrial Wall Sconce Adjustable Arm ~1015 | Yellow brass | Yellow Brass |
| 10109930209563 | Adjustable Metal Pendant Light ~1138 | Brushed copper, Brushed silver | Brushed Copper, Brushed Silver |
| 10021658099995 | Ceiling Pendant Light Fixture ~1060 | brushed Copper, Black inner Gold, Black inner White | Brushed Copper, Black Inner Gold, Black Inner White |
| 10124422840603 | Farmhouse Plug In Pendant Light ~1129 | Brushed copper | Brushed Copper |
| 10125293453595 | 21cm Indoor 1 Light Pendant Lamp Dome ~1132 | Rustic red | Rustic Red |
| 10021659312411 | Industrial Pendant Light with E26 Base ~1012 | Rose gold | Rose Gold |
| 10158868201755 | Hemp rope hanging light ~1165 | (none flagged) | — |
| 10163698041115 | Industrial Flush Mount Light ~1212 | French gold | French Gold |
| 10021658231067 | Hemp Rope Metal Pendant Light ~1057 (Shade Colour) | (values are clean) | — |
| 10021657739547 | Industrial Dome Pendant Light Shade ~1066 (Shade Colour) | Black inner Gold | Black Inner Gold |
| 10021657739547 | Industrial Dome Pendant Light Shade ~1066 | Gray | Grey *(optional — both are used across store; decide on one standard)* |

---

## SECTION C — CONTEXT-SPLIT PRODUCTS

*Products where the option name covers two different meanings. Renamed based on actual values — not a bulk rename.*

### C1 — `Pack` → `Cable Length` (fabric cable products)

Values are cable lengths in feet. Rename Pack to Cable Length for these products only.

| Product ID | Product Title | Status | Values | Action |
|---|---|---|---|---|
| 10021659050267 | 18 AWG Core Twisted Fabric Cable 0.75mm Brown | active | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021659279643 | 2 Core Twisted Hemp 0.75mm Fabric Cable ~1008 | active | 3.28 ft, 16.40 ft, 32.81 ft, 9.84ft | Rename `Pack` → `Cable Length` |
| 10021659181339 | 3.28/16.40/32.81 ft 3 Core Round Black 0.75mm ~1021 | active | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021659246875 | 3.28/16.40/32.81 ft 2 Core Twisted Fabric ~1017 | active | 3.28ft, 16.4ft, 32.8ft, 9.84ft | Rename `Pack` → `Cable Length` |
| 10021659017499 | 3.28/16.40/32.81 ft 3 Core Fabric Cable Gold | active | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021659083035 | 3.28/16.40/32.81 ft 3 Core Twisted Electric Cable | active | **13.28ft**, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` — ⚠ **verify 13.28ft is not a typo for 3.28ft** |
| 10021659115803 | 3.28/16.40/32.81 ft 3 core Round Braided Fabric Gold ~1024 | draft | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021659148571 | 3.28/16.40/32.81 ft 3 core Round Cloth Covered Wire ~1023 | active | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021658984731 | 3.28/16.40/32.81 ft Lighting Cable 3 Core Twisted Fabric | active | 3.28ft, 16.4ft, 32.8ft | Rename `Pack` → `Cable Length` |
| 10021659214107 | 3.28/16.40/32.81 ft 2 Core Twisted Cable Shiny Pink ~1019 | active | 3.28ft, 16.4ft, 32.8ft, 9.84 ft | Rename `Number of Pack` → `Cable Length` |

### C2 — `Pack` → `Pack Quantity` (bulb and lamp products)

Values are quantity units. Rename Pack to Pack Quantity for these products only.

| Product ID | Product Title | Status | Values | Action | Value Notes |
|---|---|---|---|---|---|
| 10021658788123 | 4W E14 Candle Light Bulbs C35 ~1034 | active | 1 Pack, 2 Pack, 3 Pack, 5 Pack, 10 Pack | Rename `Pack` → `Pack Quantity` | Values clean |
| 10021658460443 | 4W T185 E26 Warm White Filament Light Bulb ~1052 | active | Pack 1, Pack 2, Pack 5 | Rename `Pack` → `Pack Quantity` | Normalize to 1 Pack, 2 Pack, 5 Pack |
| 10021658427675 | 4W T45 Tubular E26 Edison Dimmable ~1053 | active | 1 Pack, 2 Pack, 3 Pack | Rename `Pack` → `Pack Quantity` | Values clean |
| 10021923193115 | 5W Metal Caged Light Bulb Dimmable ~1093 | draft | 1 Pack, 2 Pack, 3 Pack, 6 Pack | Rename `Pack` → `Pack Quantity` | Values clean (also rename Color→Colour, A section) |
| 10021658755355 | E26 4W G95 Dimmable LED Vintage Filament Bulb ~1032 | active | 1 Pack, 2 Pack, **3 pack**, 5 Pack, 6 Pack, 10 Pack | Rename `Pack` → `Pack Quantity` | Fix 3 pack→3 Pack, 6 pack→6 Pack |
| 10021660262683 | G80 E26 4W LED Edison Dimmable Bulbs ~1000 | active | Pack 1, Pack 2, Pack 3, Pack 5, Pack 6 | Rename `Pack` → `Pack Quantity` | Normalize to 1 Pack, 2 Pack, 3 Pack, 5 Pack, 6 Pack |
| 10021658624283 | St64 E26 Led Light Bulbs 4W ~1035 | active | 1 Pack, 5 Pack, 10 Pack | Rename `Pack` → `Pack Quantity` | Values clean |
| 10021658165531 | T185 4W Led Spiral Filament Warm White ~1058 | active | 1 Pack, 3 Pack, 5 Pack | Rename `Pack` → `Pack Quantity` | Values clean |
| 10021658132763 | T45 4W Spiral LED E26 Bulb ~1059 | active | 1 Pack, 2 Pack, 3 Pack | Rename `Pack` → `Pack Quantity` | Values clean |
| 10125373014299 | Strain Relief Piece, Threaded Cord Grip ~1133 | active | 1 Pcs, 5 Pcs, 10 Pcs, 50 Pcs, 100 Pcs | Rename `Pack` → `Pack Quantity` | Note: values use "Pcs" — decide whether to normalize to Pack format |
| 10046075797787 | Outdoor Post Light Black Pillar Light ~1109 | draft | Pack 1, Pack 2, Pack 3 | Rename `Number of Pack` → `Pack Quantity` | Normalize to 1 Pack, 2 Pack, 3 Pack |

### C3 — `Size` → `Cable Length` (cable products)

| Product ID | Product Title | Status | Values | Action |
|---|---|---|---|---|
| 10021659443483 | 14-Gauge Cloth Covered Electrical Wire White ~1031 | active | 1M, 5M, 10M | Rename `Size` → `Cable Length` |
| 10021659410715 | Flexible Twisted Electrical Wire Cable ~1134 | active | 1M, 5M, 10M | Rename `Size` → `Cable Length` |

### C4 — `color` values that are pack quantities → rename to `Pack Quantity`

Three draft pendant products where `color` was misused for pack quantity:

| Product ID | Product Title | Status | Current Values | Action |
|---|---|---|---|---|
| 10475929960731 | 3 Light 72.83" LED Multi Light Pendant | draft | Pack 1, Pack 2, Pack 3 | Rename `color` → `Pack Quantity` + normalize to 1 Pack, 2 Pack, 3 Pack |
| 10409270608155 | Cage Single Pendant Light | draft | Pack 1, Pack 2, Pack 3 | Rename `color` → `Pack Quantity` + normalize to 1 Pack, 2 Pack, 3 Pack |
| 10405805195547 | Single Cage Pendant Light | draft | Pack 1, Pack 2, Pack 3 | Rename `color` → `Pack Quantity` + normalize to 1 Pack, 2 Pack, 3 Pack |

### C5 — `Pack Size` → `Pack Quantity` (verify values first)

| Product ID | Product Title | Status | Current Values | Action | Risk |
|---|---|---|---|---|---|
| 10108503294235 | Industrial Metal Cone Shade Pendant Light ~1118 | active | 02, 03 | Rename `Pack Size` → `Pack Quantity` + fix values to 2 Pack, 3 Pack | MEDIUM — verify with Piranav that 02/03 mean 2-pack and 3-pack before executing |

---

## SECTION D — EXCLUDED PRODUCTS

*Do NOT change these products. Any change requires separate GPT Brain escalation.*

### D1 — 6 Combined-Value Products (Colour+Bulb or Pack+Bulb encoded in one value)

These products encode two variant dimensions into one option value (e.g., "Black With Bulb"). Fixing requires adding a new Shopify option dimension — not a rename. **DO NOT TOUCH.**

| Product ID | Product Title | Status | Option | Problematic Values |
|---|---|---|---|---|
| 10174161944859 | 3 Shaded Cluster Pendant Light ~1190 | draft | `color` | "Black Gold Inner With bulb", "Blue With out bulb"… |
| 10109366534427 | Industrial Semi Flush Light Fixture ~1145 | active | `color` | "Brushed Copper With Bulb", "Black Without Bulb"… |
| 10183998079259 | Semi Recessed Light ~1205 | active | `color` | "Copper Without Bulb", "Yellow Brass with Bulb"… |
| 10195721191707 | Swag Hanging Light | draft | `color` | "Black - With Bulb", "Black - With Out Bulb" |
| 10175856836891 | light flush ~1194 | draft | `color` | "1 Pack With Bulb", "2 Pack Without Bulb"… |
| 10209714635035 | Pendant Light Cord Kit ~1180 | draft | `color` | "Pack 1- With Bulb", "Pack 2- With Bulb"… |

### D2 — `Type` option products (DO NOT NORMALIZE per Phase 2B approval)

| Product ID | Product Title | Status | Option | Values | Reason |
|---|---|---|---|---|---|
| 10171316502811 | 3 bulb bar pendant light ~1187 | draft | `Type` | Type 1–5 | Abstract variants — meaning unclear without product images |
| 10021658689819 | LED Dimmable E26 Light Bulb Globe G95 ~1033 | active | `Type` | 1 Pack, 2 Pack… | Approved: do not normalize |
| 10109232447771 | Modern Adjustable Pendant Lighting Wire Cage ~1122 | active | `Type` | 3 Way Round Base… | Configuration — do not normalize |

*Note: 3 bulb bar pendant (10171316502811) also has `Brauchen Sie Glühbirnen?` → this IS renamed to `Bulb Included` per Section A3 above. Only the `Type` option is excluded.*

### D3 — `Default Title` products (82 products — DO NOT FILTER)

Products using Shopify's default `Title` option name with value `Default Title` are single-variant products with no meaningful option. Do not rename, do not add to any filter group.

Products with `Title` = "With Bulb"/"Without Bulb" are also excluded from automated change at this stage — too many (82 total in the group) and require per-product verification.

### D4 — `color` with non-colour, non-mappable values

| Product ID | Product Title | Status | `color` Values | Reason Excluded |
|---|---|---|---|---|
| 10108250521883 | Natural Wood Table Lamp with E27 Holder ~1112 | draft | Type 1, Type 2…Type 6 | Abstract types — meaning unknown |
| 10119361626395 | Farmhouse Hanging Pendant Lighting ~1142 | active | 3 Way Rectangle | Configuration value — single value only |
| 10108255142171 | Industrial Multi Directional Single Ceiling Light ~1113 | active | Single Head Flush Mount | Configuration — not a colour |
| 10309450826011 | Industrial Metal Wall Light Fixture | draft | Black+, Green+, Orange+… | Non-standard values with "+" suffix — meaning unclear |
| 10416468263195 | Adjustable Swing Arm Wall Sconce | active | "-" among colours | Null/empty value present — clean null first |
| 10367160025371 | Industrial Plug-In Wall Sconce with Adjustable | draft | "-" among colours | Null/empty value present — clean null first |
| 10122160963867 | pulley pendant light ~1213 | active | Shade 7 (22cm) | Size/model value in colour field — single value only |

### D5 — `Pack` with ambiguous values "1" / "2" (outdoor products)

| Product ID | Product Title | Status | Values | Reason |
|---|---|---|---|---|
| 10046136549659 | 18W Outdoor Wall Light with Sensor | draft | 1, 2 | Ambiguous — could be quantity or mounting type. Verify before acting. |
| 10046097522971 | Outdoor Wall Light 12W Waterproof LED Up Down ~1110 | draft | 1, 2 | Same ambiguity. |

### D6 — `Size` for fixture arm length (conduit pendants — too few for filter)

| Product ID | Product Title | Status | Values | Reason |
|---|---|---|---|---|
| 10021657444635 | E26 Conduit Mount Pipe Pendant Lighting | draft | 30cm, 50cm, 80cm | Only 2 products with fixture size — insufficient for catalogue filter. Keep `Size` unchanged. `RequiredBulb` IS renamed (Section A3). |
| 10021657477403 | Exposed Conduit Hanging Light Fixture ~1071 | draft | 20cm, 30cm, 40cm | Same. Keep `Size` unchanged. `RequiredBulb` IS renamed (Section A3). |

---

## SECTION E — HIGH-RISK CHANGES

| Change | Risk Level | Why | Mitigation |
|---|---|---|---|
| Renaming any variant option on **active** products | MEDIUM | Shopify changes variant option names in product URLs (e.g., `?variant=XXX&option1=Black`) — existing indexed URLs may redirect but not guaranteed | Test on 1 active product first. Check Google Search Console for indexed variant URLs before batch-executing. |
| Renaming `color` on 86+ active products at once | HIGH | Large scope — if a mistake is made, hard to reverse quickly | Execute in batches of 10–15. Verify each batch in browser before continuing. |
| Value changes (Section B) | MEDIUM | Changing a variant value renames the variant — affects order history display and any saved cart URLs | Do not change values on products with recent orders. Check order history first for active products. |
| German value translation (Farbe/Schattenfarbe products) | LOW-MEDIUM | Both products are `draft` status — no live SEO risk | Safe to do — verify product doesn't have live Shopify orders before value change. |
| `Pack Size` → `Pack Quantity` on Industrial Metal Cone Shade ~1118 (active) | MEDIUM | Values "02"/"03" are unusual — must verify meaning before changing to "2 Pack"/"3 Pack" | Confirm with Piranav before executing. |
| `style` → `Colour` on E26 Light Socket ~1140 (active) | LOW | Single active product. Clean colour values. | Safe. |
| 13.28ft value in 3 Core Twisted Cable product | LOW-MEDIUM | May be a data entry typo for 3.28ft — if corrected to 3.28ft, an existing variant may disappear | Verify in Shopify Admin before correcting. |

---

## SHOPIFY ADMIN EXECUTION GUIDE

**Recommended execution order:**

1. Start with all `draft` status products first — lower risk, no live SEO or orders impact.
2. Then tackle `active` products in small batches (10–15 max per session).
3. For each product: Products → [Product] → Variants → Edit option names.
4. After renaming, scroll down and confirm variant list still shows correctly.
5. After Section A complete, run Section B value normalization.
6. Do NOT execute Section C until Section A is fully complete and verified.
7. Do NOT touch Section D products.

**Verify after each batch:**
- Open a collection page and confirm filter sidebar shows `Colour` and `Bulb Included` filter groups
- Confirm no filter group is still named `color` or `Required Bulb`
- Confirm no duplicate filter groups (e.g., both `Colour` and `color` appearing)

---

## SUMMARY COUNTS

| Section | Products | Status Mix | Action |
|---|---|---|---|
| A — `color` → `Colour` | 86 | Mixed active/draft | Rename option name |
| A — `color` → other canonical | 2 | active | Rename to Bulb Included / Cable Length |
| A — Other Colour renames | 13 | Mixed | Rename option name |
| A — Bulb Included renames | 45 | Mixed | Rename option name |
| A — Pack Quantity (clean) | 3 | Mixed | Rename option name |
| A — Cable Length (clean) | 2 | active | Rename option name |
| A — style individual | 2 | active | Rename per product |
| B — Value normalization | ~20 | Mixed | Change values |
| C — Context-split renames | 23 | Mixed | Individual rename by context |
| D — Excluded | 19+ | — | DO NOT CHANGE |
| **Total unique products affected** | **~165** | — | — |
| **Total excluded** | **~105** (Title group) + 19 specific | — | — |

---

## NEXT STEP AFTER EXECUTION

Once all Section A, B, C changes are complete in Shopify Admin:
1. Shopify Search & Discovery app → configure filter groups using canonical names
2. Map `Colour` filter to product option `Colour`
3. Map `Bulb Included` filter to product option `Bulb Included`
4. Map `Pack Quantity` filter to product option `Pack Quantity` (bulb/accessory collections only)
5. Map `Cable Length` filter to product option `Cable Length` (cable collection only)
6. Create `collection.catalogue.json` template — Phase 3
