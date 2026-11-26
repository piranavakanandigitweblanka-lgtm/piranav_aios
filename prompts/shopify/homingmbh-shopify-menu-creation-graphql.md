# Prompt: Shopify Navigation Menu Creation via GraphQL API

**Category:** shopify / implementation
**Pattern Name:** `homingmbh-shopify-menu-creation-graphql`
**First used:** 2026-11-26 — Homingmbh DE — Hauptnavigation 31-node menu

---

## Prompt

You are a senior Shopify developer working on the [STORE] Shopify store via the Admin GraphQL API (2026-10).

Create a new navigation menu named `[MENU NAME]` with handle `[handle]`.

### Menu structure

[Insert full hierarchy: Top-level item → sub-items, with collection handles or exact URLs for each]

### Rules

1. Pre-flight: check all existing menus. Stop if the target handle already exists.
2. Build the full `menuCreate` mutation including all items and their children in a single call.
3. After creation, re-fetch the new menu by ID and verify: exact item count, all titles, all URLs.
4. Report: menu ID, item count per top-level category, any items omitted and why.

### Safety constraints

- Do not delete or modify any existing menus.
- Do not modify any collections, products, or theme files.
- Do not connect the new menu to the live theme.
- Use only collection handles that are confirmed to exist.

---

## Technical reference (Admin GraphQL 2026-10)

```graphql
# menuCreate — handle is required (String!)
mutation {
  menuCreate(input: {
    title: "Menu Name"
    handle: "menu-handle"
    items: [
      {
        title: "Top Level Item"
        url: "/collections/collection-handle"
        items: [
          { title: "Sub Item", url: "/collections/sub-collection-handle" }
        ]
      }
    ]
  }) {
    menu { id title handle items { id title url items { id title url } } }
    userErrors { field message }
  }
}

# Verify by ID (handle lookup does NOT work in Admin API 2026-10)
query {
  menu(id: "gid://shopify/Menu/MENU_ID") {
    id title handle
    items { id title url items { id title url } }
  }
}
```

### Known limits
- Native Shopify menus support 2 levels (item + sub-items only)
- `menu(handle: "...")` is NOT a valid query field — must use `menu(id: "...")`
- Tags containing colons must be quoted in search: `tag:"cat:some-tag-with-colon"`
