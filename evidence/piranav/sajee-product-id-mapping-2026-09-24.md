# Evidence: Sajee Product ID Mapping — 2026-09-24

## Summary

- **Input file:** New_Product_Assignments sajee.xlsx (Sheet: Under 25)
- **Input rows:** 99
- **Shopify source:** ledsone.myshopify.com (UK store, read-only)
- **API version:** 2024-10
- **Matching method:** GraphQL productVariants query by SKU (primary component first, then full composite SKU, then product number title search)
- **Date:** 2026-09-24

## Totals

| Status | Count |
|---|---|
| MATCHED | 99 |

## Validation

- [x] All 99 Excel rows appear in output
- [x] No SKU silently skipped
- [x] All MATCHED rows have verified Shopify Product ID
- [x] No Product ID guessed — all from API response
- [x] No Shopify mutations performed
- [x] No credentials appear in saved evidence

## Matching Strategy

1. **Pass 1:** GraphQL `productVariants` query using primary SKU component (first component before `+`)
2. **Pass 2:** For composite SKU DUPLICATE/TITLE_MISMATCH — try each component in order; pick first that returns single unique product
3. **Pass 3:** For remaining unresolved — try full composite SKU as exact variant SKU, then product number (~NNNN) title search

**Note on composite SKUs:** Many products in this list use composite SKUs (e.g., `CRSF100BM+PHSH2BMTBM+...`) representing assembled bundles. Shopify stores the full concatenated string as the variant SKU. Pass 3 full-SKU lookup resolved all remaining cases.

## Full Mapping

| Row | Excel Title | Excel SKU | Shopify Product ID | Shopify Title | Status | Notes |
|---|---|---|---|---|---|---|
| 2 | 12W E27 LED Light Bulbs 1160 Lumens ~6911 | LDCWA60HE2712 | 15383386620290 | 12W E27 LED Light Bulbs 1160 Lumens ~6911 | MATCHED |  |
| 3 | 13A UK 3 Pin Plug Rewirable Fused Mains Plug 250V~ | SPPGUK3PTR | 15338513531266 | 13A UK 3 Pin Plug Rewirable Fused Mains Plug 250V~ | MATCHED | Duplicate SKU resolved by title match | SKU maps to 2 produc |
| 4 | 15 x 10mm Cable Trunking Internal Corner Elbow 5 P | PCIC2516WH5PK | 15391574000002 | 15 x 10mm Cable Trunking Internal Corner Elbow 5 P | MATCHED |  |
| 5 | 16A 220V Inline Rocker On/Off Switch White / Heavy | SWHBSP1OSWH | 15288186438018 | 16A 220V Inline Rocker On/Off Switch White / Heavy | MATCHED |  |
| 6 | 2 Core Fabric Lamp Cable Inline Rocker Switch 16A  | CL2TAG+SWHBPB1OSWB | 15329296744834 | 2 Core Fabric Lamp Cable Inline Rocker Switch 16A  | MATCHED | Resolved via full composite SKU match |
| 7 | 20mm AA90 Degree PVC Pipe Fitting Elbow Coupling C | PCEL9020WH3PK | 15391572394370 | 20mm AA90 Degree PVC Pipe Fitting Elbow Coupling C | MATCHED |  |
| 8 | 20mm Conduit Ceiling Rose Kit Black Metal Back Box | PCBM20MX+PCDO20WH+PCBSM2FWH+RW1FG2PK | 15374741209474 | 20mm Conduit Ceiling Rose Kit Black Metal Back Box | MATCHED | Resolved via full composite SKU match |
| 9 | 24.5cm Flower Shaped Glass Ceiling Light / Floral  | ENC9464 | 15269308006786 | 24.5cm Flower Shaped Glass Ceiling Light / Floral  | MATCHED |  |
| 10 | 4/6 Pcs UK 3 Pin 13 AMP Plug Fused Fitted Mains 25 | SPPGUK3PBM4PK | 15291487322498 | 4/6 Pcs UK 3 Pin 13 AMP Plug Fused Fitted Mains 25 | MATCHED |  |
| 11 | 7W (60W eqv) E27 A60 GLS Bulb 560 Lumens Non Dimma | LDCWA60HE277 | 15383397433730 | 7W (60W eqv) E27 A60 GLS Bulb 560 Lumens Non Dimma | MATCHED |  |
| 12 | 7W LED Spotlight Bulb GU10 ~6862 | LPMC50CW7W5PK | 15372355764610 | 7W LED Spotlight Bulb GU10 ~6862 | MATCHED |  |
| 13 | 90 Degree PVC Conduit Fitting Elbow ~6886 | PCELC9025WH5PK | 15379896238466 | 90 Degree PVC Conduit Fitting Elbow ~6886 | MATCHED |  |
| 14 | 9W (60W eqv) 806lm E27 LED Bulb A60 GLS 6400K ~691 | LDCWA60HE279 | 15383413195138 | 9W (60W eqv) 806lm E27 LED Bulb A60 GLS 6400K ~691 | MATCHED |  |
| 15 | 9W GU10 LED Downlight Module Cool White 6400K COB  | LPMP50CW9W | 15333783798146 | 9W GU10 LED Downlight Module Cool White 6400K COB  | MATCHED |  |
| 16 | Adjustable Vintage Brass Wall Sconce Smoked Grey G | CRSF100YB+WSLS155YB+LSGLULSG | 15293722722690 | Adjustable Vintage Brass Wall Sconce Smoked Grey G | MATCHED | Resolved via full composite SKU match |
| 17 | Antique Copper Conduit Swan Neck Wall Light ~6915 | ENC10324 | 15384135041410 | Antique Copper Conduit Swan Neck Wall Light ~6915 | MATCHED |  |
| 18 | Cable Raceway L Connector ~6906 | PCFC1510WHAPK | 15381735997826 | Cable Raceway L Connector ~6906 | MATCHED |  |
| 19 | Cable Trunking System with Self Adhesive Cover ~68 | PCUPVC1625WH | 15380989608322 | Cable Trunking System with Self Adhesive Cover ~68 | MATCHED |  |
| 20 | Compact Reusable Wire Connector Terminal Block ~69 | CO432AGY | 15381172257154 | Compact Reusable Wire Connector Terminal Block ~69 | MATCHED |  |
| 21 | Compact Reusable Wire Splicing Connector ~6899 | CODH622AGY | 15381088338306 | Compact Reusable Wire Splicing Connector ~6899 | MATCHED |  |
| 22 | Conduit Box Lid with Screws ~6895 | PCM412WHAPK | 15380541276546 | Conduit Box Lid with Screws ~6895 | MATCHED |  |
| 23 | Conduit Spacer Bar Clips ~6894 | PCD20WH5PK | 15380529676674 | Conduit Spacer Bar Clips ~6894 | MATCHED |  |
| 24 | Electrical Cable Trunking End Cap ~6904 | PCTE1510WH | 15381730853250 | Electrical Cable Trunking End Cap ~6904 | MATCHED |  |
| 25 | Electrical Terminal Conduit Boxes ~6893 | PCTL4204WH3PK | 15380514963842 | Electrical Terminal Conduit Boxes ~6893 | MATCHED |  |
| 26 | Foundry Fabric Wall Fixture Easy Fit E27  ~6846 | ENC10176 | 15368303280514 | Foundry Fabric Wall Fixture Easy Fit E27  ~6846 | MATCHED |  |
| 27 | Globe Ribbed Ribbed Amber Glass Semi-Flush Ceiling | CRSFM110080BM+LHSHE27YB+LSGLST150AR | 15392506380674 | Globe Ribbed Ribbed Amber Glass Semi-Flush Ceiling | MATCHED | Resolved via full composite SKU match |
| 28 | GULDNÄT Small Crystal Cylindrical Lampshade ~6868 | WCBTC100FG2PK+RPR44WH2PK | 15373038485890 | GULDNÄT Small Crystal Cylindrical Lampshade ~6868 | MATCHED | Resolved via full composite SKU match |
| 29 | Heavy Duty Masonry Fixings for Brick Concrete ~689 | RWHX08BTOR | 15378839306626 | Heavy Duty Masonry Fixings for Brick Concrete ~689 | MATCHED |  |
| 30 | Industrial Black Pendant Light  Adjustable E27 Bul | CRSF100BM+PHSH2BMTBM+SPUPBM+LDMG80E274 | 15312314302850 | Industrial Black Pendant Light  Adjustable E27 Bul | MATCHED | Resolved via full composite SKU match |
| 31 | Industrial Black Pendant Light E27 Metal Ceiling L | CRSF100BM+PHRB1PBR30BM+LSAFT200BG | 15322553713026 | Industrial Black Pendant Light E27 Metal Ceiling L | MATCHED | Resolved via full composite SKU match |
| 32 | Industrial Crystal Ceiling Light Shade Metal Easy  | WCBSF90FG+RPR44WH | 15326357651842 | Industrial Crystal Ceiling Light Shade Metal Easy  | MATCHED | Resolved via full composite SKU match |
| 33 | Industrial Curvy Black Pendant Light E27 Adjustabl | ENC9725 | 15312219242882 | Industrial Curvy Black Pendant Light E27 Adjustabl | MATCHED |  |
| 34 | Industrial Plug In Wall Light with E27 Cage & Swit | ENC10055 | 15344949920130 | Industrial Plug In Wall Light with E27 Cage & Swit | MATCHED |  |
| 35 | Industrial Wall Light E27 G95 LED Elbow Arm Wall S | ENC10159 | 15358782865794 | Industrial Wall Light E27 G95 LED Elbow Arm Wall S | MATCHED |  |
| 36 | Industrial Wooden Wall Light with E27 Bulb & Toggl | ENC9734 | 15312470540674 | Industrial Wooden Wall Light with E27 Bulb & Toggl | MATCHED |  |
| 37 | LED A60H B22 7W Cool White 6400K Non-Dimmable Bulb | LDCWA60HB227 | 15100091007362 | LED A60H B22 7W Cool White 6400K Non-Dimmable Bulb | MATCHED | Duplicate SKU resolved by title match | SKU maps to 2 produc |
| 38 | LED Bayonet A95 22W Energy Saving Bulb ~6909 | LDCWA95B2222 | 15382093365634 | LED Bayonet A95 22W Energy Saving Bulb ~6909 | MATCHED |  |
| 39 | LED Ceiling Light Panel ~6864 | LLRO168CW8W | 15372357960066 | LED Ceiling Light Panel ~6864 | MATCHED |  |
| 40 | LED Conduit 20mm/ 25mm White PVC Female Conduit Ad | PCCO25WH5PK | 15381000651138 | LED Conduit 20mm/ 25mm White PVC Female Conduit Ad | MATCHED |  |
| 41 | LED Conduit Couplers for Electrical Connections ~6 | PCCPL20WH5PK | 15380514865538 | LED Conduit Couplers for Electrical Connections ~6 | MATCHED |  |
| 42 | LED E27 A60 Light Bulb 7W  600Lumens Decoration Bu | LDCWA60HB227 | 15382116532610 | LED E27 A60 Light Bulb 7W  600Lumens Decoration Bu | MATCHED | Duplicate SKU resolved by title match | SKU maps to 2 produc |
| 43 | LED Inspection Conduit Elbow with Cover ~6888 | PCTELC25WH5PK | 15379900105090 | LED Inspection Conduit Elbow with Cover ~6888 | MATCHED |  |
| 44 | M16 Female Threaded Lamp Pipe 250mm Hollow Lightin | PC16FT250BA | 15395189490050 | M16 Female Threaded Lamp Pipe 250mm Hollow Lightin | MATCHED |  |
| 45 | M20 Female Thread Ceiling Rose 100mm Conduit Penda | CRSFM210080CH+CBSF95 | 15348210041218 | M20 Female Thread Ceiling Rose 100mm Conduit Penda | MATCHED | Resolved via full composite SKU match |
| 46 | M8 Plasterboard Fixings Wall Screws Set ~6889 | RWHX08BXGY | 15378840158594 | M8 Plasterboard Fixings Wall Screws Set ~6889 | MATCHED |  |
| 47 | Metal Ceiling Rose 100mm M10 Pendant Canopy Kit ~6 | CRSFM110080BM | 15348209549698 | Metal Ceiling Rose 100mm M10 Pendant Canopy Kit ~6 | MATCHED |  |
| 48 | Modern Ceiling Pendant Light Shade Easy Fit Ribbed | LSGL14010CL+RPM40WH | 15326195581314 | Modern Ceiling Pendant Light Shade Easy Fit Ribbed | MATCHED | Resolved via full composite SKU match |
| 49 | Modern Ceiling Pendant Light Shade Ribbed Glass Ea | LSGLULSG+RPM40WH | 15332772381058 | Modern Ceiling Pendant Light Shade Ribbed Glass Ea | MATCHED | Resolved via product number + title match (6798) |
| 50 | Modern Clear Glass Pendant Light with Black Metal  | CRSF100BM+PHTC1PBRBM+LSGL9015CL | 15287119020418 | Modern Clear Glass Pendant Light with Black Metal  | MATCHED | Resolved via full composite SKU match |
| 51 | Moroccan Pendant Light Shade – French Gold Crystal | WCBTC140FG+RPR44WH | 15313956110722 | Moroccan Pendant Light Shade – French Gold Crystal | MATCHED | Resolved via full composite SKU match |
| 52 | Natural Wooden Wall Light E27 LED Rustic Indoor Sc | WLWOFTWO+CBSF70+CBSFBM+LDSST64E274 | 15319626023298 | Natural Wooden Wall Light E27 LED Rustic Indoor Sc | MATCHED | Resolved via full composite SKU match |
| 53 | Ø13cm H15.5 Mini Tiered Beehive Ribbed Glass Shade | LSGL3L150AR+RPM40WH_HIT | 15389786145154 | Ø13cm H15.5 Mini Tiered Beehive Ribbed Glass Shade | MATCHED | Resolved via product number title search (6926) |
| 54 | Pendant Light With Inner On Off Switch ~6885 | CRSF100BM+PHSW1PBRBM+LSFT255BD | 15379889389954 | Pendant Light With Inner On Off Switch ~6885 | MATCHED | Resolved via full composite SKU match |
| 55 | Plug In GU10 Wall Light Adjustable Spotlight with  | ENC10056 | 15349401223554 | Plug In GU10 Wall Light Adjustable Spotlight with  | MATCHED |  |
| 56 | Push Fit UPVC Plumbing Pipe ~6905 | PCUPVCD202WH | 15381733638530 | Push Fit UPVC Plumbing Pipe ~6905 | MATCHED |  |
| 57 | PVC Cable Raceway Connector ~6930 | PCTJ2516WHAPK | 15382138683778 | PVC Cable Raceway Connector ~6930 | MATCHED |  |
| 58 | PVC Pipe T-Shaped 3 Way Coupling Connector ~6887 | PCTEL20WH5PK | 15379898630530 | PVC Pipe T-Shaped 3 Way Coupling Connector ~6887 | MATCHED |  |
| 59 | Retro Purple Glass Ceiling Light Semi Flush E27 In | PLHNBM+LSGLBT200PU+LDMST64E274 | 15297532985730 | Retro Purple Glass Ceiling Light Semi Flush E27 In | MATCHED | Resolved via full composite SKU match |
| 60 | Ribbed Amber Glass Pendant Shade ~6847 | LSGLST148AR+RPM40WH | 15368303673730 | Ribbed Amber Glass Pendant Shade ~6847 | MATCHED | Resolved via product number title search (6847) |
| 61 | Ribbed Glass Pendant Easy Fit Lampshade 14cm E27 ~ | LSGL100145BL+RPM40WH | 15366507659650 | Ribbed Glass Pendant Easy Fit Lampshade 14cm E27 ~ | MATCHED | Resolved via full composite SKU match |
| 62 | Ribbed Glass Pendant Shade E27 Easy Fit Lampshade  | LSGLLN14020AR+RPM40WH | 15370562503042 | Ribbed Glass Pendant Shade E27 Easy Fit Lampshade  | MATCHED | Resolved via full composite SKU match |
| 63 | Round Rocker Switch 10A ON Off Panel Mount for Jun | PCFL20YB+SWCRD16BM+RW12CO2PK | 15306010296706 | Round Rocker Switch 10A ON Off Panel Mount for Jun | MATCHED | Resolved via full composite SKU match |
| 64 | Round Rocker Switch 10A ON Off Panel Mount for Jun | PCFL20SN+SWCRD16BM+RW12CH2PK | 15306011738498 | Round Rocker Switch 10A ON Off Panel Mount for Jun | MATCHED | Resolved via full composite SKU match |
| 65 | Round Rocker Switch 10A ON Off Panel Mount for Jun | PCFL20CO+SWCRD16BM+RW12CO2PK | 15306050175362 | Round Rocker Switch 10A ON Off Panel Mount for Jun | MATCHED | Resolved via full composite SKU match |
| 66 | Solid Timber Ceiling Pendant Light Fitting ~6858 | TPBP1SHRWO | 15370555851138 | Solid Timber Ceiling Pendant Light Fitting ~6858 | MATCHED |  |
| 67 | Spotlight Bulb 9W GU10 ~6863 | LPMC50CW9WAPK | 15372357697922 | Spotlight Bulb 9W GU10 ~6863 | MATCHED |  |
| 68 | Vintage Black Ceiling Light with White Crackle Gla | ENC9467 | 15288722030978 | Vintage Black Ceiling Light with White Crackle Gla | MATCHED |  |
| 69 | Vintage Brass Wall Sconce Adjustable Clear Glass W | ENC9574 | 15293724885378 | Vintage Brass Wall Sconce Adjustable Clear Glass W | MATCHED |  |
| 70 | Vintage Brass Wall Sconce with Amber Glass Shade E | ENC9550 | 15293716693378 | Vintage Brass Wall Sconce with Amber Glass Shade E | MATCHED |  |
| 71 | Vintage Brass Wall Sconce with Amber Glass Shade E | ENC9549 | 15293716791682 | Vintage Brass Wall Sconce with Amber Glass Shade E | MATCHED |  |
| 72 | Vintage Crystal Cage Table Lamp E27 Bedside Desk L | TPHTTF2PBRBM+WCBTC120FG | 15349432680834 | Vintage Crystal Cage Table Lamp E27 Bedside Desk L | MATCHED | Resolved via full composite SKU match |
| 73 | Vintage Crystal Table Lamp E27 Wooden Base Bedside | TPHTTF2PBRBM+WCCYSP160GD | 15361622540674 | Vintage Crystal Table Lamp E27 Wooden Base Bedside | MATCHED | Resolved via full composite SKU match |
| 74 | Vintage Cylinder Pendant Light Shade ~6799 | LSGL12010AR2PK+RPM40WH2PK | 15332789223810 | Vintage Cylinder Pendant Light Shade ~6799 | MATCHED | Resolved via full composite SKU match |
| 75 | Vintage Glass Table Lamp with Wooden Base E27 ~668 | TPHTTN2PBRBM+LSGLWB125TN | 15286318072194 | Vintage Glass Table Lamp with Wooden Base E27 ~668 | MATCHED | Resolved via full composite SKU match |
| 76 | Vintage Hammered Pendant Light 26cm E27 ~6827 | CRSF100SN+PHHT1PBRCH+LSRP260SN | 15361606582658 | Vintage Hammered Pendant Light 26cm E27 ~6827 | MATCHED | Resolved via full composite SKU match |
| 77 | Vintage Industrial Tea Brown Glass Pendant Light w | ENC9561 | 15293721805186 | Vintage Industrial Tea Brown Glass Pendant Light w | MATCHED |  |
| 78 | Vintage Semi Flush Ceiling Light 20cm White Glass  | ENC9465 | 15288721637762 | Vintage Semi Flush Ceiling Light 20cm White Glass  | MATCHED |  |
| 79 | Vintage Semi Flush Ceiling Light E27 Frosted Glass | CRSF100WH+LHNSE27WH+LSGL12010FC | 15375332770178 | Vintage Semi Flush Ceiling Light E27 Frosted Glass | MATCHED | Resolved via full composite SKU match |
| 80 | Vintage Style Table Lamp with E27 Bulb Holder ~682 | TPHTTN2PBRBM+LSMCSQWYRE | 15349451653506 | Vintage Style Table Lamp with E27 Bulb Holder ~682 | MATCHED | Resolved via full composite SKU match |
| 81 | Waterproof LED Sign Backlight Modules ~6838 | IMAC9820WWCPK | 15367230554498 | Waterproof LED Sign Backlight Modules ~6838 | MATCHED |  |
| 82 | Weatherproof Outdoor Electric Box Cover ~6908 | WJ2GMP2BM | 15381172814210 | Weatherproof Outdoor Electric Box Cover ~6908 | MATCHED | Duplicate SKU resolved by title match | SKU maps to 2 produc |
| 83 | Wire Terminal Block Reusable Connector ~6901 | COTL6624GY | 15381171569026 | Wire Terminal Block Reusable Connector ~6901 | MATCHED |  |
| 84 | Wooden Base Table Lamp with Crackle Glass Shade &  | TPHTTN2PBRBM+LSGLWS180YC | 15297582989698 | Wooden Base Table Lamp with Crackle Glass Shade &  | MATCHED | Resolved via full composite SKU match |
| 85 | Vintage Black & Gold Hammered Metal Pendant Light  | ENC9252 | 15269728747906 |  Vintage Black & Gold Hammered Metal Pendant Light | MATCHED |  |
| 86 | 3 Head Chrome GU10 Ceiling Spotlight with Pull Cha | ENC9659 | 15302600425858 | 3 Head Chrome GU10 Ceiling Spotlight with Pull Cha | MATCHED |  |
| 87 | 3 Light Glass Pendant Ceiling Light ~6922 | ENC10233 | 15388397830530 | 3 Light Glass Pendant Ceiling Light ~6922 | MATCHED |  |
| 88 | 3 Light Pendant Ceiling Light E27 Tea Brown Glass  | ENC9580 | 15295497470338 | 3 Light Pendant Ceiling Light E27 Tea Brown Glass  | MATCHED |  |
| 89 | Antique Brass 3-Light Cluster Pendant ~6916 | ENC10278 | 15384662507906 | Antique Brass 3-Light Cluster Pendant ~6916 | MATCHED |  |
| 90 | Crystal Pendant Light French Gold E27 Hanging Lamp | CRSF100FG+PHHT1PBRFG+WCBSF90FG | 15326861263234 | Crystal Pendant Light French Gold E27 Hanging Lamp | MATCHED | Resolved via full composite SKU match |
| 91 | Decorative LED Sign Lighting Module ~6839 | IMDC7714BGRNPK | 15367235371394 | Decorative LED Sign Lighting Module ~6839 | MATCHED |  |
| 92 | Glass Minimalist Ceiling Light E27 ~6845 | ENC10173 | 15368302854530 | Glass Minimalist Ceiling Light E27 ~6845 | MATCHED |  |
| 93 | Industrial Black Gold Wall Sconce E27 Adjustable L | CRSF100BM+WSAFT200BG | 15334428311938 | Industrial Black Gold Wall Sconce E27 Adjustable L | MATCHED | Resolved via full composite SKU match |
| 94 | Industrial Black Pendant Light E27 Gold Inner Shad | CRSF100BM+LSACY195BG | 15326866997634 | Industrial Black Pendant Light E27 Gold Inner Shad | MATCHED | Resolved via full composite SKU match |
| 95 | Industrial Loft Pendant Light Fixtures ~6800 | ENC10011 | 15333766103426 | Industrial Loft Pendant Light Fixtures ~6800 | MATCHED |  |
| 96 | Vintage Industrial Copper Wall Light Amber Glass E | WSNWBC+WJ018RB3PBM+LSGLBC160AR+LDMST64E2 | 15317344092546 | Vintage Industrial Copper Wall Light Amber Glass E | MATCHED | Resolved via full composite SKU match |
| 97 | Vintage Multi Head Pendant Adjustable E27 Ribbed G | ENC10232 | 15370284466562 | Vintage Multi Head Pendant Adjustable E27 Ribbed G | MATCHED |  |
| 98 | Vintage Wall Sconce Light E27 Glass Shade Chrome U | CRSF120CH+WSUSHE27CH+LSGLDC160AS | 15372658246018 | Vintage Wall Sconce Light E27 Glass Shade Chrome U | MATCHED | Resolved via product number + title match (6866) |
| 99 | Vintage Wall Sconce Light E27 Glass Shade Yellow B | CRSF120YB+WSUSHE27YB+LSGLSC1508CL | 15372659720578 | Vintage Wall Sconce Light E27 Glass Shade Yellow B | MATCHED | Resolved via product number title search (6867) |
| 100 | Wooden Wall Light E27 Amber Glass Sconce Indoor Vi | WLWOHTBM+LSGL12010AR+CBSF75 | 15319688511874 | Wooden Wall Light E27 Amber Glass Sconce Indoor Vi | MATCHED | Resolved via full composite SKU match |

## Files Created

- `evidence/piranav/sajee-product-id-mapping-2026-09-24.csv` — full mapping data
- `evidence/piranav/sajee-product-id-mapping-2026-09-24.md` — this evidence file

## Safety Confirmation

- Shopify data was NOT modified (read-only GraphQL queries only)
- No credentials appear in any saved file
- All work performed inside approved subfolder: `piranav_aios/`