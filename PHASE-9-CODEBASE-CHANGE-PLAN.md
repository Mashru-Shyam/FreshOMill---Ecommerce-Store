# Phase 9 — Codebase Change Plan

## Goal

Implement the final Fresh O Mill design system across the Shopify theme: consistent spacing, page widths, typography, product cards, navigation, footer, interactions, and responsive behavior from wide desktop through narrow mobile. Use `PHASE-9-FINAL-UI-UX-DESIGN-SYSTEM.md` and the supplied reference images as acceptance criteria.

This document turns that design system into an implementation plan for the theme files already identified during the Phase 1–8 work. The first Phase 9 action is a complete inventory of live and legacy routes/assets so implementation does not overlook a template-specific override.

## Scope and review limitation

The theme codebase has not been freshly inventoried in this planning turn because the local file-inspection runner failed before commands started. The file mapping below is based on files and routes already identified and modified in the ongoing project work. Phase 9 implementation must begin by verifying the full `layout`, `templates`, `sections`, `snippets`, `assets`, `config`, and `locales` inventory inside the authorized project directory, then add any omitted live files to this plan before editing them.

No code changes are made by this plan. The known project integration points are `layout/theme.liquid`, `sections/header.liquid`, `snippets/header-row.liquid`, `snippets/header-actions.liquid`, the custom `fom-*` sections/snippets/assets, Shopify customer templates, password layout, and theme configuration/content. Existing old and `-v2` implementations must be checked for which one is live before removal or modification.

## Implementation order

### Step 0 — Source and route map

Inspect the complete project tree and document:

- Every page template and template suffix; map each route to its section sequence.
- Header group, announcement bar, mobile navigation, footer group, and any theme editor JSON definitions.
- All loaded stylesheets and scripts, including duplicate loads, order, page-scoped CSS, inline styles, and selectors affecting shared components.
- Both original and replacement components (`fom-product-main` / `fom-product-main-v2`, `fom-collection-main` / `fom-collection-main-v2`, `fom-search-main` / `fom-search-main-v2`, customer-story variants, cart variants, and old/new product-card snippets).
- Asset references, snippets/sections references, template handles, locale keys, and schema settings that can be edited in Admin.
- Native theme components that own cart drawer, predictive search, customer account, and product forms; avoid registering a second behavior over native components.

Deliverable: route-to-file matrix and shared-style load order appended to the Phase 9 completion record. Do not delete a legacy file until no template, section group, setting, or snippet refers to it.

### Step 1 — Shared design tokens and stylesheet ownership

Known files:

- `assets/fom-interface-lock.css`
- `assets/fom-layout-consistency.css`
- `assets/fom-product-card.css`
- `assets/fom-cart-experience.css`
- `assets/fom-search-v2.css`
- `assets/fom-customer-utility.css`
- `assets/fom-content-pages.css`
- Any theme base stylesheets discovered in Step 0
- `layout/theme.liquid`

Changes:

- Define one source of truth for colors, type scale, spacing steps, content widths, gutters, radii, borders, shadows, focus ring, header offsets, and responsive breakpoints.
- Resolve cascade ordering so design tokens and component styles load once in a predictable order.
- Remove duplicated overrides and old selector compatibility rules after confirming they are unused.
- Replace repeated inline spacing/style attributes in custom sections with shared component classes.
- Scope rules by component/template purpose; avoid global selectors such as `.rte`, `footer`, `.header`, or `button` unless the reset is intentional and audited.
- Ensure CSS layers do not depend on `:has()` where a stable component class/data attribute is practical; preserve fallbacks for supported browser ranges.
- Establish reduced-motion, focus-visible, minimum tap target, text wrapping, and safe-area rules centrally.

Acceptance: changing a shared token updates all relevant pages consistently; no template requires increasingly specific one-off fixes to regain the shared design.

### Step 2 — Global announcement, header, and mobile navigation

Known files:

- `sections/header.liquid`
- `snippets/header-row.liquid`
- `snippets/header-actions.liquid`
- `assets/fom-interface-lock.css`
- `assets/fom-layout-consistency.css`
- Mobile-navigation section/snippet and its CSS/JS discovered in Step 0
- Header/announcement section-group JSON discovered in Step 0

Changes:

- Make announcement slider and header one sticky stack on every route with measured offsets rather than guessed fixed heights.
- Tune desktop announcement font and message spacing, preserve readable motion, and honor reduced motion.
- Normalize exact desktop header DOM and action wrappers for cart/account/search on all templates. Remove cart-page-specific link/button markup differences.
- Set icon size, stroke, control box, labels, count badge anchor, amount typography, focus state, and minimum widths from shared tokens.
- Prevent count/amount clipping at 0, 1, two digits, three digits, localized currency, zoom and narrow desktops. Let labels wrap or use an accessible compact mode before controls collide.
- Implement the approved mobile header containing only logo and title. Keep search access within the fixed bottom navigation or a deliberate search view, not in the mobile header.
- Keep the five-item fixed bottom navigation (Home, Store, Search, Account, Cart) visible, active-state aware, safe-area aware, keyboard accessible, and clear of page content and drawers.
- Audit stacking contexts and scroll locks among sticky header, bottom navigation, predictive search, modal, cart drawer, filter sheet, and product media viewer.

Acceptance: same header geometry on home, catalogue, product, search, cart, contact, customer, content, policy, challenge and 404 routes. No item overlaps or clips at supported widths/zoom.

### Step 3 — Footer and service strip

Known files:

- Global footer section/group and footer snippet(s) discovered in Step 0
- `assets/fom-interface-lock.css`
- `assets/fom-layout-consistency.css`
- Service-strip section(s), including `sections/fom-service-strip.liquid`

Changes:

- Align footer to the global content shell; balance logo/description, link groups, store information and newsletter columns.
- Normalize column widths, divider positions, vertical rhythm, link line-height, icon sizes, social targets and legal row.
- Replace broad overrides that resize the native footer unexpectedly.
- On mobile, use the approved vertical/accordion pattern, preserve all links, and avoid a left blank gutter or squeezed text.
- Standardize service-strip item count/order, icons, separators and mobile wrapping across templates.
- Keep actual legal, social, contact, newsletter and payment content dynamic/editable; never render unsupported payment marks.

Acceptance: footer edges align with content gutters on desktop/mobile, all columns have intentional alignment, and every link is reachable and readable.

### Step 4 — Canonical product-card component and product discovery surfaces

Known files:

- `snippets/fom-unified-product-card.liquid`
- `snippets/fom-unified-sample-product-card.liquid`
- `snippets/fom-product-card.liquid` and legacy/sample equivalents
- `assets/fom-product-card.css`
- `sections/fom-featured-products-unified.liquid`
- `sections/fom-collection-main-v2.liquid`
- `sections/fom-search-main-v2.liquid`
- `sections/fom-product-recommendations.liquid`
- Any remaining featured, collection, search, predictive result or recommendation card files from Step 0

Changes:

- Confirm every real product listing renders the same canonical card. Remove duplicate markup after reference audit.
- Match Best Seller image, text and CTA proportions to the home reference. Align card heights, category, title line clamp, pack size, stock, price/compare price and full-width Add to Cart action.
- Keep add-to-cart integration native and consistent with the cart drawer; support unavailable, multi-variant, unavailable selected variant, missing image, discount, long title, long currency, and sample/demo states.
- Ensure sample cards are only rendered in intentional preview/empty configuration states and never impersonate live inventory.
- Normalize 6/4/3/2/1 column behavior by available width and card minimum width; test content-driven breakpoints rather than only viewport breakpoints.
- Ensure image aspect ratio, focal crop and loading dimensions avoid layout shift.

Acceptance: no listing surface has icon-only cards or a distinct card hierarchy; Best Sellers and All Products have the same card design and purchase behavior.

### Step 5 — Home and collection templates

Known files:

- Home sections: `fom-home-hero`, `fom-hero-trust`, `fom-category-grid`, `fom-featured-products-unified`, `fom-promotion`, `fom-benefits`, `fom-customer-stories-v2`, `fom-service-strip`
- Collection: `sections/fom-collection-main-v2.liquid`, `snippets/fom-collection-filters.liquid`, `assets/fom-collection-v2.css`
- Related templates and section-group configuration from Step 0

Changes:

- Compare each section’s actual live markup and CSS with the reference’s proportions, content width, edge spacing, image crop, section rhythm, heading scale and card gutters.
- Use one section gutter and consistent vertical spacing while preserving intended background transitions.
- Confirm category links reflect real collections once configured; empty, missing and long collection titles remain deliberate.
- Correct mobile collection hero, filter entry point, filter sheet, result toolbar, active filters, sorting, product count, pagination and grid.
- Keep filter controls compatible with Shopify native filter objects; do not promise filters that are unavailable until Admin Search & Discovery is configured.

Acceptance: home and collection pages reproduce reference hierarchy at desktop/mobile without unnecessary whitespace, content crowding or inconsistent card scale.

### Step 6 — Product and cart experience

Known files:

- `sections/fom-product-main-v2.liquid`
- `assets/fom-product-page-v2.css`
- `assets/fom-product-page-v2.js`
- `sections/fom-product-recommendations.liquid`
- `sections/fom-cart-main-v2.liquid`
- `assets/fom-cart-experience.css`
- `assets/fom-cart-page-v2.js`
- Native cart drawer section/snippets/scripts discovered in Step 0

Changes:

- Compare product image/gallery geometry and text panel layout to image 03; keep desktop two-column and mobile stacked composition.
- Bind variant change to selected ID, price, compare price, availability, image where variant media exists, quantity limits, and add button.
- Use theme-native product form/cart events; avoid a custom submit flow that bypasses drawer refresh, cart count updates, or accessibility announcements.
- Implement gallery keyboard/touch behavior and no-image/media fallback. Ensure tabs/accordions and review/source/nutrition content do not disappear when data is absent.
- Cart page/drawer should share item row rules, image size, variant, quantity, remove, subtotal/discount/total, delivery progress, and empty state.
- Verify quantity updates do not reload unnecessarily if native sections can update; show recoverable errors if network updates fail.
- Clamp progress and derive thresholds from a single configurable source; reconcile with Admin shipping settings before launch.
- Test long titles, multiple discounts, custom line properties, large cart, zero stock after adding, and mobile drawer/body scroll.

Acceptance: product-to-cart action updates drawer, header count, quantities and totals consistently; cart page matches drawer content and reference hierarchy.

### Step 7 — Search and account/utility routes

Known files:

- Search: `sections/fom-search-main-v2.liquid`, `snippets/fom-search-filters.liquid`, `assets/fom-search-v2.css`, `assets/fom-search-discovery.js`
- Customer: `sections/fom-customer-portal.liquid`, `snippets/fom-address-fields.liquid`, `assets/fom-customer-utility.css`, `assets/fom-customer-utility.js`
- Contact/404: `sections/fom-contact-page.liquid`, `sections/fom-utility-404.liquid`
- `layout/password.liquid`
- All `templates/customers/*`, `templates/search.json`, contact/page/404 templates, and policy templates discovered in Step 0

Changes:

- Predictive search should use the theme’s native component where available. Remove custom duplicate enhancement if it competes with native keyboard selection, ARIA active descendant, or localization. If retained as fallback, initialize only where native predictive search does not exist.
- Preserve query, filters, sort, page and product-only result type across search operations. Add a clear loading/error/no-result state and avoid emitting empty non-product tiles.
- Compare account auth to image 06 but preserve Shopify’s real account authentication. Design login/register/recovery/activation/reset/error states without claiming email code sign-in unless supported/configured.
- Compare profile/orders/address screens to image 07. Avoid promising editable profile fields if Shopify customer-account surface does not expose them; make links/actions match actual platform capabilities.
- Validate address country/province selector behavior, delete confirmation, address pagination, order status labels, money values, missing shipping address and no-order states.
- Contact form must preserve inputs on validation error, show success feedback, and use correct current contact information/links.
- Ensure the 404, password, policy, challenge/CAPTCHA and page templates all have the correct shell, adequate spacing and no hidden controls.

Acceptance: all routes are reachable and functional, forms retain meaningful values/states, and layouts remain consistent with the shared system.

### Step 8 — Content pages, blog, policies and footer routes

Known files:

- `sections/fom-content-page.liquid`
- `assets/fom-content-pages.css`
- Blog/article templates and section snippets discovered in Step 0
- Shopify policy templates/layouts

Changes:

- Do not infer “About”, FAQ, shipping or returns content from handles alone if a merchant-authored page may use a different handle. Route by explicit template/page setting, stable metafield/section selection, or predictable Admin template assignment after agreement.
- Use page content dynamically; remove generic shipping/refund claims unless their text is confirmed and Admin policy agrees.
- Confirm FAQ implementation does not duplicate Admin page content or show static stale answers alongside authored content.
- Ensure the side navigation only lists existing/assigned pages and all links resolve.
- Normalize blogs/articles, rich text, embedded media, long tables and policy headings using the same content width and typography.

Acceptance: every page link has a corresponding page/policy; content comes from one authoritative source and remains merchant-editable.

### Step 9 — Checkout boundary and Admin handoff

Known files: theme checkout branding settings/assets if applicable; final checkout largely resides in Shopify Admin/editor.

Changes:

- Align cart messaging and checkout expectations to the actual shipping threshold, rates, tax configuration and payment methods.
- Only use checkout branding exposed by Shopify; avoid implementing storefront CSS that cannot reach Shopify checkout.
- Define a handoff matrix of each missing Admin data source and the exact page/component it populates: products, variants, collections, Search & Discovery filters, menus, page handles/content, policies, shipping, payments, customer accounts, checkout branding, footer social/newsletter/payment content, domain/market settings.

Acceptance: no code UI claims conflict with actual merchant configuration. Mark the code UI done only when the remaining work is Admin-only and clearly itemized.

## Cross-device and interaction review matrix

Review each route at minimum at 1440 px, 1024 px, 768 px, 390 px and 320–359 px widths, plus 200% zoom and enlarged text. For each route, record:

- Header/announcement dimensions, stickiness and count overflow.
- Content max width and side gutters.
- Heading and body line breaks; no overlap or awkward single-word lines.
- Grid columns, image crop, card height, CTA alignment and usable touch targets.
- Sticky/fixed elements, safe areas, page scroll, modal/drawer stacking and focus behavior.
- Loading, success, error, empty, unavailable and long-content states relevant to that route.
- Keyboard-only use and reduced-motion behavior.

Required routes: home, all-products collection, category collection, product, search initial/results/no-result, cart drawer empty/populated, cart page empty/populated, checkout actual Shopify view, login, registration, recovery/reset, account, orders, addresses, contact, About, FAQ, shipping/returns/policies, blog/article, password, challenge and 404.

## Risk controls for implementation

- Inspect before edit: recent work introduced parallel `-v2` sections, new shared CSS, older implementations and legacy files. Do not modify a similarly named file until theme routing confirms whether it is live.
- One owner per shared component: header, card, cart drawer, footer and service strip should each have a canonical markup/style owner.
- Avoid broad global CSS patches as the primary fix. Prefer component classes and shared tokens.
- Avoid hardcoded page paths where Shopify route objects or section settings can resolve them. Confirm page handles during Admin setup.
- Avoid hardcoded shipping threshold, contact data, categories or product facts once merchant data is ready; connect to centralized settings/dynamic Shopify data.
- Preserve accessibility and theme editor operation while consolidating components.
- Keep edits inside `D:\04_Projects\FreshOMIll Project`. Reference files are read-only in `D:\04_Projects\FreshOMill Website\Main Document FreshOMill`.

## Completion record template

At implementation close, append:

| Item | Result |
|---|---|
| Inventory and route matrix complete | Pass / Fail |
| Desktop reference comparison | Pass / Fail |
| Tablet view comparison | Pass / Fail |
| Mobile/narrow view comparison | Pass / Fail |
| Header and announcement consistent | Pass / Fail |
| Product card consistent across all listings | Pass / Fail |
| Cart/product/search/account/contact interactions | Pass / Fail |
| Accessibility and edge-case matrix | Pass / Fail |
| P0/P1 issues remaining | None / list |
| P2 issues remaining | None / list |
| Shopify Admin tasks remaining | None / list |
| Deviations from references and reasons | None / list |
