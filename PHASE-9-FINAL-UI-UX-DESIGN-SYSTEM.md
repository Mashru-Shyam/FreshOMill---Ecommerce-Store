# Phase 9 — Final Storefront UI/UX Design System and Acceptance Plan

## Purpose

Phase 9 is the final implementation and visual-quality pass for the Fresh O Mill storefront. It brings every page, component, responsive view, and interaction into one professional design system, using the supplied reference images as the visual target.

The outcome is a complete, coherent storefront whose coded UI is ready for the later Shopify Admin content and configuration pass. Phase 9 covers the customer-facing design and interaction layer. Product records, final photography, policy copy, collection setup, checkout settings, shipping rates, payment methods, and other merchant-managed content remain Shopify Admin work.

## Design authority and exceptions

Use the supplied images as references in this order:

| Reference | Primary use |
|---|---|
| `01-homepage.png` | Homepage composition, hero, categories, best sellers, brand story, customer stories, service strip, footer |
| `02-store.png` | Store/collection hero, catalogue toolbar, category filters, product grid, pagination, service strip, footer |
| `03-product-and-cart.png` | Product detail, image gallery, variant selector, trust strip, product details, recommendations, cart drawer |
| `04-checkout.png` and `exec-7f1f9d85-4f98-4122-8f52-3293f9a22330.png` | Checkout structure and narrow checkout layout; final checkout branding and behavior remain subject to Shopify checkout capabilities/settings |
| `05-contact.png` and `exec-e461c8e7-4f21-4ccc-a9a2-b4b4b673f9dc.png` | Contact form, contact information, location/social area, responsive contact view |
| `06-sign-in.png` and `exec-9b5140e9-e6b1-44f6-86a9-8c1e0cf251df.png` | Sign-in and mobile storefront patterns; the email-code screen is a visual reference, not authorization to replace Shopify’s native authentication flow |
| `07-profile-and-orders.png` and `exec-64358e92-c9ce-4097-977c-1f7b5ef46bd2.png` | Customer profile, addresses, order history and narrow account view |
| `exec-bdeb16f0-5363-4f49-95b9-efe8eee7eea5.png` | Mobile store and filter-panel interaction |
| `exec-cca00d9e-0bce-4e3d-a7af-ca3ee7291383.png` | Narrow product detail and bottom cart presentation |

The announcement bar and header are governed by the user-approved direction, not by reference-image headers:

- Announcement bar: a readable, horizontally sliding set of announcement messages; compact desktop spacing and legible text; remains sticky with the header during scroll on every storefront page.
- Desktop header: the agreed desktop navigation and controls, identical across pages.
- Mobile header: show only the brand logo and title in the header. Use the agreed fixed bottom navigation for Home, Store, Search, Account, and Cart. Do not add desktop navigation links, search fields, visit-store button, or account/cart text labels to the mobile header unless the approved design is explicitly changed.
- Cart/account icons and cart count must remain visually consistent and fully visible across all pages and breakpoints.

If reference imagery conflicts with these four decisions, follow these decisions.

## Design principles

1. One design language: common colors, type, spacing, borders, radii, buttons, icon treatment, and component behavior across all templates.
2. Clear hierarchy: page title and key action are immediately identifiable; supporting details remain subordinate.
3. Product-first commerce: product image, name, pack size, availability, price, and action are consistently easy to scan.
4. Responsive by composition: reflow or simplify content deliberately instead of shrinking desktop layouts until they overflow.
5. Useful feedback: loading, success, error, disabled, empty, selected, and unavailable states are designed as part of each component.
6. Content-safe: long names, translated text, missing images, unusual prices, and empty data must not break the layout.
7. Accessible interaction: keyboard operation, focus visibility, semantics, contrast, touch target size, and status announcements are part of acceptance.

## Shared visual tokens

These are the Phase 9 target tokens. Reconcile existing CSS variables and component styles to these values rather than introducing more page-specific values.

| Token | Target |
|---|---|
| Primary forest green | `#0E552C` to `#176B36` for primary actions and strong brand areas |
| Secondary leaf green | `#287C2F` for selected states, accents, and status indicators |
| Deep heading green | `#07391E` |
| Body text | `#25342A` / `#435047` |
| Muted text | `#687169` |
| Main background | `#FFFEFB` or white |
| Soft green background | `#F1F8ED` |
| Soft warm background | `#FBF6E8` |
| Main border | `#DFE6DC` |
| Error | dark red text with a pale red surface and clear text label |
| Success | forest green text with pale green surface |
| Body type | theme sans-serif, consistent weight and line-height; avoid page-specific font changes |
| Page content width | maximum 1,440 px for commerce pages; 1,180 px for text pages; 1,240 px for cart |
| Desktop gutters | fluid 24–64 px based on available width |
| Mobile gutters | 16–20 px; never allow content to touch viewport edges |
| Spacing base | 4 px; common steps 4, 8, 12, 16, 20, 24, 32, 40, 48, 56 px |
| Control radius | 6–8 px |
| Card radius | 10–14 px |
| Pill radius | full radius, reserved for short filters/status badges |
| Control height | 44–52 px; small controls must still meet touch target guidance |
| Content elevation | subtle shadow only for floating/search or important raised panels |

Phase 9 should consolidate duplicated values into shared CSS custom properties in one global layer and document any justified exception directly in this file before implementation.

## Responsive behavior

Use the following viewport bands as review targets. Exact breakpoint values may follow the theme’s existing breakpoints when they produce equivalent behavior.

| View | Target composition |
|---|---|
| Wide desktop, 1200 px and above | Full content width; homepage best sellers 6 columns where image/text remain readable; store grid 4 columns; product page gallery and details side by side; cart summary alongside items |
| Desktop/tablet, 990–1199 px | Store/recommendations 3 columns; product detail may remain two columns only while controls retain usable widths; no header collisions |
| Tablet, 750–989 px | Header transitions to compact agreed layout; catalogue filters become an accessible collapsible panel; commerce grids use 2 columns; multi-column detail areas stack |
| Mobile, 360–749 px | Logo/title header plus fixed bottom navigation; announcement text stays readable and does not obscure header; cards in 2 columns when content fits; forms, account, cart, filters and product detail stack deliberately |
| Very narrow, below 360 px | Single-column product grids; forms and cart controls remain usable; no horizontal page overflow; long labels wrap or truncate with an accessible full name |

At every width, account for browser zoom, text enlargement, safe areas, sticky header offsets, fixed bottom-navigation clearance, and virtual keyboard overlap. Fixed UI must never cover page actions, form fields, drawer controls, or the footer’s last content.

## Global shell acceptance

### Announcement and header

- Announcement text is large enough to read at normal zoom, with reduced spacing between messages on wide screens.
- Slider advances without shifting the header height; reduced-motion preference pauses or simplifies animation.
- Announcement and header remain sticky together across home, collection, product, search, cart, contact, account, content, and 404 templates.
- Header has identical logo size, search size/position, nav treatment, account icon, cart icon, cart count, cart amount and action spacing on every desktop page.
- Cart count never clips at 0, 1, 2, 99, or a three-digit value; a long amount never pushes or clips neighboring controls.
- Header active-page indication is consistent and does not change control dimensions.
- Mobile header contains only logo and brand title. Bottom navigation is persistent, correctly highlighted, safe-area-aware, and does not obscure content.
- The cart drawer opens from every template, closes by close button, Escape and backdrop, traps/restores focus appropriately, and does not create unintended background scrolling.

### Page container and footer

- Commerce pages share the same maximum content width and fluid left/right gutters.
- Text pages use a comfortable reading width and paragraph line length.
- Footer begins at the same page edge, has balanced columns, aligned dividers, and no large blank area at the left or right.
- Footer columns stack in the documented order on mobile; accordions are keyboard accessible where used.
- Footer content does not exceed the viewport; email, address, social URLs, policy links, and copyright can wrap safely.
- Service strip spacing and icon sizes remain consistent wherever the strip is shown.

## Shared component rules

### Buttons and fields

- Primary action is solid forest green with white text; secondary action is white/transparent with green border; destructive action is clearly red and is never styled like a primary checkout action.
- Button height, radius, font and hover/focus/disabled states are shared.
- Form controls have persistent labels; placeholder text is not the only label.
- Required, invalid, pending, and success states are visible and announced to assistive technology.
- Tap targets are at least 44 by 44 px where practical; tightly paired quantity buttons still remain individually targetable.

### Product card — canonical design

The homepage Best Seller card is the source of truth for every product tile in Best Sellers, All Products, search, recommendations, and related-product areas.

- Product image uses one consistent 4:5 frame, neutral pale surface, full image visibility per product media intent, and no stretching.
- Information order: category/type, product name, pack size/variant, availability, current price and optional compare-at price, then full-width Add to Cart action.
- Every card in the same row has aligned title, price and button baselines despite different title lengths.
- Product title clamps predictably without concealing the product’s identity; full product title remains available to screen readers.
- Out-of-stock cards have a clear status and disabled action; products with multiple variants link to or open a clear option-selection flow.
- Cards remain usable at 2 columns and narrow one-column fallback; action text and prices do not collide.
- Do not mix icon-only action cards with full-width action cards on the same storefront.

### Status and empty states

Define consistent success, warning, error, unavailable, loading, no-results, no-orders, empty-cart, and no-address states. Each has a clear title/message, a next action where appropriate, and no reliance on color alone.

## Page-by-page Phase 9 checklist

### 1. Home

- Hero proportions, text width, image crop, buttons, and trust indicators follow `01-homepage.png` at wide and narrow sizes.
- Category tiles share image proportions and caption alignment.
- Best Seller cards use the canonical component; all cards align and actions work for available, unavailable, and multi-variant products.
- Brand-story/value area, decorative art and customer-story section have controlled overflow and balanced spacing.
- Customer Stories displays exactly three stories at a time on desktop; arrows and pagination work; mobile presents one story per view with working swipe/controls and visible active state.
- Footer and service strip match the global shell.

### 2. Store / collection / All Products

- Collection hero aligns to common content width and accommodates both short and long collection titles/descriptions.
- Category filter, availability, price, and available Shopify filters operate and retain active state with sorting and pagination.
- Mobile filters open in a usable drawer/panel with apply, clear, close, selected count, and focus/scroll behavior.
- Product grid uses the canonical Best Seller card and adapts 4 → 3 → 2 → 1 columns at the agreed widths.
- Search, product count, sort control, active chips, pagination, no products, and no filtered matches are visually coherent.
- Repeated filters and long category names do not expand or overflow the sidebar.

### 3. Product detail

- Gallery, thumbnail selection, variant selection, pack size, stock status, price/compare price, quantity and add-to-cart update correctly together.
- A selected unavailable variant cannot be added; a purchasable variant can.
- Quantity cannot drop below one; keyboard entry, upper stock limits and invalid values are handled.
- Gallery handles one image, many images, no image, non-image media, narrow screens, and high-resolution images.
- Details tabs/accordions expose selected state and work by keyboard; recommendations use canonical cards.
- Sticky purchase controls, if present, do not cover information or mobile bottom navigation.

### 4. Cart drawer and cart page

- Drawer and cart page show consistent product title, variant, quantity, remove action, pricing, discount and totals.
- Quantity update, remove, clear, checkout, continue shopping, free-shipping progress, and empty cart all work.
- Progress meter clamps at 0 and 100 percent; threshold text and actual Admin shipping policy must agree before launch.
- Long titles, multiple discounts, zero-priced items, subscription/custom properties, unavailable items, and large item counts do not break rows or totals.
- Cart drawer has clear focus, close affordance, scrollable items, fixed/visible summary action, and mobile full-screen/sheet behavior where appropriate.
- Do not promise tax, shipping, delivery time or free delivery inaccurately; final amounts are identified as estimates until checkout when appropriate.

### 5. Checkout boundary

- Checkout remains Shopify-controlled. Apply only branding and settings available within the store’s Shopify plan and checkout editor.
- Match logo, color, typography, button language and reassurance text to the reference where Shopify supports them.
- Review customer/contact details, delivery address, delivery method, payment method, order summary, errors, loading and confirmation states in Shopify’s actual checkout.
- Ensure free-shipping message/threshold, delivery charge, taxes, return statements and contact information are consistent with store configuration.
- Treat payment marks/logos as real only when supported by active payment providers; do not display fictitious methods.

### 6. Search and discovery

- Header predictive results are keyboard accessible and show a bounded, scrollable list with image, title, price and view-all action.
- Debouncing, rapid query changes, no suggestions, network failure, Escape, outside click and mobile keyboard behavior are handled.
- Search page preserves query, sort and active filters; filters and sorting do not lose the search term.
- Product-only results do not render non-product records as blank product cards.
- Initial search, no-results and filtered-empty states give useful next steps.

### 7. Customer and utility pages

- Sign-in, create account, recovery, password reset, activation, account dashboard, addresses, order list and order details share the same field/button/card system.
- Required customer account mode is confirmed in Admin; do not replace Shopify authentication with a custom passwordless flow unless specifically configured and supported.
- Account states cover validation, authentication errors, success, no orders, no addresses, pagination, long address, international phone, and small screens.
- Contact form supports success/error states; contact details and social links are correct and clickable.
- 404, password page, policy, CAPTCHA/challenge and system templates remain readable and consistent.

### 8. Informational pages, blog and policies

- About, FAQ, shipping, returns/refunds, privacy, terms, contact, blog index and article pages share consistent breadcrumbs, title, reading width, typography and link styles.
- FAQ accordions are keyboard accessible and support long answers.
- Dynamic Shopify policy pages render their Admin-authored content without duplicated stale policy text.
- Page navigation links resolve to existing handles; missing pages do not create dead links.
- Rich text supports headings, lists, links, tables, images, captions and embedded content without overflow.

### 9. Global final polish

- Remove conflicting, duplicate, dead or page-scoped overrides that reintroduce header, card, footer, or drawer differences.
- Verify all Liquid sections/snippets are connected to intended templates and every referenced asset exists.
- Use semantic landmarks/headings, labels, meaningful image alt text and decorative-image hiding.
- Confirm contrast, visible focus, keyboard navigation, reduced-motion behavior, screen-reader status updates and readable text enlargement.
- No horizontal page scrolling at supported widths except intentionally scrollable tables, galleries or tab strips.
- Check slow network, image loading, JavaScript disabled/failure paths and repeated submission behavior.
- Avoid content flash, cumulative layout jumps, double click submissions, stale totals, and overlays behind sticky/fixed navigation.
- Keep non-essential animation subtle and honor `prefers-reduced-motion`.

## Edge-case matrix

Every component should be reviewed against relevant rows in this matrix.

| Edge case | Required result |
|---|---|
| Missing product/category image | Stable image frame with intentional placeholder; no broken-image icon or layout collapse |
| Very long product/page/category title | Wrap or clamp consistently; never overlap price, buttons, controls or adjacent columns |
| Extremely long price or currency format | Price remains readable; action does not shrink below usable width; no clipping |
| Product with one/default variant | Correct variant ID and price are submitted |
| Product with many variants | Options remain discoverable and usable on mobile; sold-out options are disabled clearly |
| Zero inventory / continue selling disabled | Clear out-of-stock state and no add action |
| Continue selling when out of stock | UI follows actual variant availability configuration |
| Cart empty / one item / many items | Correct empty state, item count, scroll behavior and stable summary |
| Cart update rejected or network unavailable | Show recoverable feedback; do not imply update succeeded |
| Free-delivery threshold reached/exceeded | Progress stops at 100%; message and checkout configuration agree |
| Search with no match / special characters / rapid edits | No broken request UI; useful fallback and stable results |
| No filters available from Shopify | Hide empty filter shell and keep result grid full width |
| Filter and sort combination / page change | Query and active filter state are preserved or reset intentionally with explanation |
| Customer with no orders/address | Clear empty state with next action |
| Very long/international address | Wrap safely and retain edit/delete action visibility |
| Form server validation or rate limit | Error is visible, associated with form, and entered values are retained where supported |
| Sticky header + drawer + bottom nav overlap | Correct stacking, scroll lock, focus and visible close/checkout action |
| 200% zoom / large text / keyboard open | Controls and essential actions remain visible and operable |
| Reduced-motion preference | Sliders/carousels do not force motion; user can operate static controls |
| JavaScript unavailable | Core navigation, forms, product links and Shopify form submissions remain usable |

## Phase 9 workflow and deliverables

1. Inventory the live templates, sections, snippets, style sheets, JavaScript, and their routes. Identify duplicate or legacy implementations that can override shared components.
2. Build a route/component matrix covering home, collection, product, search, cart/drawer, checkout boundary, contact, customer templates, content, blog/article, policy, password, challenge and 404.
3. Compare each live page to the relevant supplied reference at wide desktop, tablet, standard mobile, and narrow mobile sizes. Record differences before editing.
4. Consolidate tokens and common component rules. Fix the shell first: announcement/header, mobile bottom navigation, page container, service strip and footer.
5. Correct canonical product cards and commerce flows, then template layouts, followed by utility/content pages.
6. Review interaction and edge-case states with realistic long/missing/empty data. Confirm accessibility and reduced-motion treatment.
7. Revisit every route after shared CSS changes; one page’s fix must not create a regression on another template.
8. Close Phase 9 with this document’s checklist marked pass/fail, a concise list of unresolved Shopify Admin inputs, and a final coded UI change summary.

Phase 9 must not be considered complete while any P0/P1 visual or functional item below remains open.

### Priority definitions

- **P0 — launch blocker:** broken navigation, add-to-cart/checkout path, unreadable/clipped header/cart count, unusable mobile layout, false price/availability/shipping promise, inaccessible critical form/action.
- **P1 — major visual/functional issue:** mismatch in canonical card design, inconsistent header/footer, key reference layout materially off, broken filters/search/account/contact flow, content hidden by sticky/fixed UI.
- **P2 — polish:** small spacing, border, icon alignment, animation or low-impact typography discrepancy.

## Phase 9 acceptance criteria

Phase 9 is complete only when all statements below are true:

- Every storefront route has a consistent header, announcement behavior, footer, content width, type hierarchy, spacing and responsive behavior.
- Mobile uses the approved logo/title-only header and fixed five-item bottom navigation.
- Announcement text slider is readable, tightly spaced on large screens, and sticks with the header.
- Product cards match the homepage Best Seller pattern across all product listings.
- Supplied desktop, mobile, product/cart, filter, checkout, contact and account references are represented in the matching templates and states.
- Core commerce and customer interactions work for success, error, empty, unavailable and loading states.
- No P0 or P1 issues remain; P2 items are resolved or explicitly documented with a reason.
- No horizontal overflow or obscured primary action appears at the target viewports and zoom conditions.
- Storefront code does not contain placeholder final policies, invented product data, unsupported payment promises, or stale links presented as live content.
- Remaining work can be listed as Shopify Admin configuration/content only.

## Shopify Admin handoff after Phase 9

The following are deliberately outside the coded design system and should be completed together after Phase 9:

- Product catalogue, variants, inventory, final product photography, descriptions, categories/types, compare-at pricing and availability.
- Collections and menu assignments for the category navigation and homepage sections.
- Shopify Search & Discovery filter configuration and merchandising order.
- Final About/FAQ/shipping/returns page content and policy texts; ensure their handles match links.
- Actual free-shipping threshold and delivery rate configuration; keep it consistent with the UI.
- Payment provider configuration and only the payment marks actually accepted.
- Customer account mode, notifications, password/invitation emails and account settings.
- Contact page content confirmation, store address/hours, email/WhatsApp/social destinations.
- Checkout branding/settings, tax behavior, markets, domain and legal/compliance content.
- Footer menus, social links, newsletter destination and subscription messaging.

## Final record

At the end of Phase 9, append the completion date, route/view coverage, pass/fail status for each acceptance criterion, known deviations from references, unresolved P2 items, and the consolidated Shopify Admin handoff list. Do not mark UI/UX complete based only on a desktop homepage review.
