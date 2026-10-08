# Shopify Shipping Rate Update — Capability Notes

**Date:** 2026-08-11  
**Store:** LEDSone UK Ltd (ledsone.co.uk)  
**Requirement:** Bulk shipping rate update via Shopify MCP  
**Author:** Piranav (AIOS)

---

## What Was Done

- Queried all shipping zones and rates across the General profile using `deliveryProfiles` GraphQL API
- Identified 29 countries with active shipping rates
- Updated Standard shipping rates for 9 EU countries by +1.50 in their existing currency
- All updates executed live via `deliveryProfileUpdate` GraphQL mutation in a single API call

---

## Countries Updated

| Country | Method | Before | After |
|---------|--------|--------|-------|
| 🇫🇷 France | Standard International | €14.89 | €16.39 |
| 🇮🇹 Italy | Standard | €10.00 | €11.50 |
| 🇮🇪 Ireland | Standard | €7.00 | €8.50 |
| 🇩🇪 Germany | Standard (tier 1) | £6.49 | £7.99 |
| 🇩🇪 Germany | Standard (tier 2) | £8.49 | £9.99 |
| 🇩🇪 Germany | Standard (tier 3) | £10.49 | £11.99 |
| 🇧🇪 Belgium | Standard (paid) | €8.00 | €9.50 |
| 🇨🇿 Czechia | Standard | £7.45 | £8.95 |
| 🇳🇱 Netherlands | Standard | €10.00 | €11.50 |
| 🇵🇹 Portugal | Standard | £18.00 | £19.50 |
| 🇪🇸 Spain | Standard | €8.69 | €10.19 |

---

## What Was Skipped

- Belgium free rate (£0.00 Standard) — left unchanged intentionally
- Germany Economy International (€100.00) — not a Standard rate
- All non-Standard methods (Express, Standard International where named differently)

---

## GraphQL Mutation Used

```
deliveryProfileUpdate(id: DeliveryProfile/46748401760)
  → locationGroupsToUpdate (id: DeliveryLocationGroup/46797848672)
    → zonesToUpdate [per country zone ID]
      → methodDefinitionsToUpdate [per method definition ID]
        → rateDefinition.price { amount, currencyCode }
```

---

## Key IDs (General Profile)

| Resource | ID |
|----------|----|
| Delivery Profile | gid://shopify/DeliveryProfile/46748401760 |
| Location Group | gid://shopify/DeliveryLocationGroup/46797848672 |
| France Zone | gid://shopify/DeliveryZone/324810113274 |
| Italy Zone | gid://shopify/DeliveryZone/375056564474 |
| Ireland Zone | gid://shopify/DeliveryZone/184264163489 |
| Germany Zone | gid://shopify/DeliveryZone/324810244346 |
| Belgium Zone | gid://shopify/DeliveryZone/216166662305 |
| Czechia Zone | gid://shopify/DeliveryZone/271748661498 |
| Netherlands Zone | gid://shopify/DeliveryZone/324810047738 |
| Portugal Zone | gid://shopify/DeliveryZone/624977674626 |
| Spain Zone | gid://shopify/DeliveryZone/347710259450 |

---

## Capability Demonstrated

- Read all shipping zones and rates via Shopify Admin GraphQL
- Identify method definition IDs and rate definition IDs per zone
- Execute bulk multi-zone rate update in a single mutation
- Verify updated rates live by re-querying the API
- Scope updates correctly (Standard only, skip free rates, skip non-Standard methods)
