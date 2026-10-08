# Phase 2 catalog readiness

## Coding readiness

- The product template reads real Shopify product, variant, price, compare-at price, availability, inventory policy, weight, unit price, media, collection, rating, and metafield data.
- Missing images use a placeholder and missing optional metafields do not create empty tabs.
- Unverified ratings remain hidden.
- Long product and variant names wrap instead of overflowing their containers.
- Sold-out variants remain selectable for inspection but disable purchasing and display the sold-out state.
- Quantity inputs use each variant's minimum, maximum, increment, and tracked inventory limit.
- Related products are limited to four records on this page rather than loading the catalog.
- The existing collection section paginates `collection.products` at 24 products when infinite loading is enabled, or at the merchant-selected 8–36 products per page when standard pagination is enabled. It does not render a 250+ product catalog in one Liquid loop.
- The native grid includes empty-filter recovery, responsive one/two/auto-fill column behavior, and standard product cards that receive complete Shopify product objects for title, sale-price, and availability handling.

## Deferred confirmation

Runtime confirmation for 250+ products, browser behavior, Liquid parsing, Shopify section rendering, and cart synchronization remains intentionally deferred because project rules prohibit validation, preview, Shopify CLI, browser-check, and test commands. This is a verification dependency, not missing Phase 2 coding.

## Admin dependencies

- Create the approved metafield definitions.
- Add verified product data and photography.
- Configure locations, inventory tracking, and continue-selling policy.
- Import products as drafts first.
- Review products individually before publication.
- Use a separate inventory CSV for multi-location quantities.
