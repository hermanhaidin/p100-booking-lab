# Agent 4: Build offer components and migrate the offer-list page to Web Components

Branch: `refactor/offer-list-page` (create from main)

## Context

This repo is a design prototype for a car rental booking funnel being migrated to vanilla Web Components. The `ox-` prefix is used for all custom element tag names; class names use OX PascalCase (e.g. `OXOfferCard`).

Components already built and working (18 total):
`ox-separator`, `ox-badge`, `ox-price`, `ox-button`, `ox-icon-button`, `ox-text-button`, `ox-chip`, `ox-link`, `ox-list-item`, `ox-floating-button`, `ox-radio-button`, `ox-banner`, `ox-protection-card`, `ox-protection-group`, `ox-booking-overview`, `ox-booking-header`, `ox-booking-footer`

The protection page has already been fully migrated as a reference — study `prototype/pages/protection.html` and `prototype/scripts/pages/protection.js` to see how a migrated page works.

Infrastructure:
- `prototype/components/shared/base-styles.js` — shared constructable stylesheet
- `prototype/components/index.js` — central registry
- `prototype/styles/all.css` — CSS bundle for legacy + page styles
- Design tokens on `:root` inherit into Shadow DOM automatically

Follow the same component authoring pattern used by existing components in `prototype/components/`. Read any existing `ox-*.js` file for reference.

## Part 1: Build offer components (3 components)

For each component, read its existing CSS file in `prototype/styles/components/` AND how it's used in the inline `<script>` section of `prototype/pages/offer-list.html`. The inline script dynamically builds these components from parsed markdown data — study the `renderList()`, `renderOfferCard()`, `renderOfferDetails()` and related functions to understand the full HTML output and data flow.

### 1. `ox-offer-card.js` — source: `offer-card.css`
- Class: `OXOfferCard`
- Read `offer-card.css` (179 lines) AND the `renderOfferCard()` function in the offer-list inline script to understand the full structure.
- Attributes:
  - `variant` (default|premium|guaranteed — controls the radial gradient overlay on the top half)
  - `title` (vehicle name, e.g. "BMW 3 Series")
  - `subtitle` (e.g. "or similar luxury sedan")
  - `image` (vehicle image URL)
  - `active` (boolean — selected card state: brand-colored outline + downward triangle indicator)
  - `offer-index` (data attribute for identifying which offer this card represents)
- Content rendered from attributes: top section (title, subtitle), centered media (image), bottom section (pricing, included features)
- Slots: `badges` (named slot for badge elements in the top area), `bottom-badge` (named slot for badge in the bottom area, e.g. hot-offer-promo), `included` (named slot for included feature text with check icon), `pricing` (named slot for the price display)
- The card is wrapped in a clickable area. Emit a `offer-card-click` CustomEvent with `{ bubbles: true, composed: true, detail: { offerIndex } }` when clicked.
- Hover state: secondary-colored outline. Focus-visible: focus outline. Active state: brand-colored outline + triangle indicator pointing down below the card.
- The card uses a background image (dark gradient overlay + the vehicle/default image). The vehicle image floats in the center media area.
- Display: block

### 2. `ox-offer-details.js` — source: `offer-details.css`
- Class: `OXOfferDetails`
- This is the MOST COMPLEX component in this batch. Read `offer-details.css` (437 lines) AND the `renderOfferDetails()` / `renderOfferDetailsHtml()` functions in the inline script very carefully.
- The component has TWO rendering modes:
  - **Inline panel** (tablet/desktop >=650px): rendered inside the offer grid, spanning the full width below the selected card's row. Has a two-column layout: left media section + right booking section.
  - **Mobile sheet** (<650px): rendered as a full-screen overlay sheet that slides up from the bottom. The component itself doesn't handle the sheet/overlay — the page script manages that by placing the component into an overlay container.
- Attributes:
  - `variant` (default|premium|guaranteed — controls radial gradient on media section)
  - `title` (vehicle name)
  - `subtitle` (model description)
  - `image` (vehicle image URL)
  - `daily-integer`, `daily-decimal`, `daily-suffix` (daily price parts)
  - `total-integer`, `total-decimal`, `total-suffix` (total price parts)
  - `currency` (e.g. "$")
  - Any other data needed — study the renderOfferDetailsHtml function for the full set
- Internal sections:
  - **Media section**: background image with gradient overlay, vehicle image, title/subtitle, spec badges (from slots or attributes), included-features strip (green bar with checkmark + text)
  - **Booking section**: booking option radio cards (best price / stay flexible) using `ox-radio-button` or radio-choice-card pattern, pricing display, "Continue" button, close button
- Slots: `specs` (for spec badges like "5 seats", "Automatic"), `included` (for the included features strip text), or render these from attributes
- Close button: emit `offer-details-close` CustomEvent with `{ bubbles: true, composed: true }`
- Continue/Next button: emit `offer-details-next` CustomEvent with `{ bubbles: true, composed: true }`
- Booking option change: emit `offer-details-option-change` CustomEvent with `{ bubbles: true, composed: true, detail: { bookingOption } }` when the radio selection changes between "best-price" and "stay-flexible"
- Responsive CSS must be included in the shadow stylesheet — the component needs to handle the different layouts at different breakpoints
- Display: grid

### 3. `ox-offer-banner.js` — source: `offer-banner.css`
- Class: `OXOfferBanner`
- Read `offer-banner.css` (87 lines) — this is a promotional image card shown in the offer grid
- Attributes: `title`, `subtitle`, `cta-text` (call-to-action button label), `image` (background image URL), `href` (link destination)
- Renders as an `<a>` tag wrapping a full-bleed background image with gradient overlay, bottom-aligned text content, and a CTA pill button
- Hover: image zooms slightly (scale 1.05), outline appears
- Display: flex

## Part 2: Migrate the offer-list page

After building all 3 components:

1. **Update `prototype/components/index.js`** — add imports for the 3 new components.

2. **Rewrite `prototype/pages/offer-list.html`** to use Web Components:
   - Replace the individual CSS `<link>` tags in `<head>` with `<link rel="stylesheet" href="../styles/all.css">`
   - Add `<script type="module" src="../components/index.js"></script>`
   - Replace the booking-header BEM markup with `<ox-booking-header>` — note this page uses the DEFAULT variant (with search row showing location and dates), not the "step" variant. Set `location="Munich Airport"` and `dates="Mar 16 | 12:00 PM - Mar 20 | 12:00 PM"` and `theme="option-light"` and `back-href="./home.html"`.
   - Replace filter chips BEM markup with `<ox-chip>` elements
   - Replace the separator with `<ox-separator>`
   - Replace the booking-footer BEM markup with `<ox-booking-footer>` containing `<ox-link>` elements
   - Keep page-level layout: `<main class="offer-list-main">`, `layout-shell` wrappers, `offer-list-grid`, and `<link rel="stylesheet" href="../styles/pages/offer-list.css">`
   - The offer grid mount point (`#offer-list-grid`) stays — the page script populates it dynamically

3. **Extract the inline `<script>`** (~900 lines) into `prototype/scripts/pages/offer-list.js`:
   - Move the entire IIFE and all its logic into this external file
   - Reference from HTML: `<script type="module" src="../scripts/pages/offer-list.js"></script>`
   - Update the rendering functions to create Web Component elements instead of BEM HTML strings:
     - `renderOfferCard()` should create `<ox-offer-card>` elements, set attributes, and populate slots with `<ox-badge>` and `<ox-price>` elements
     - `renderOfferDetails()` should create `<ox-offer-details>` elements
     - The promo banner should use `<ox-offer-banner>`
   - Update event handling:
     - Listen for `offer-card-click` custom events instead of checking for `.offer-card-link[data-offer-index]` clicks
     - Listen for `offer-details-close` and `offer-details-next` events
     - Listen for `offer-details-option-change` events for booking option radio changes
   - Update DOM queries to work with Web Component tag names
   - **Keep all data fetching, parsing, and state management logic intact** — `fetchAndPrepareData()`, `parseOffers()`, `parseAssets()`, `parseBanner()`, price calculation helpers, URL param construction for navigation to protection.html
   - Keep the mobile sheet/overlay management (creating overlay + sheet elements, toggling `.is-open` classes, scroll locking)
   - Keep the header theme sync logic (`syncHeaderTheme`) — but update it to work with `<ox-booking-header>` (set the `theme` attribute instead of `data-p100-theme`)

4. **Verify the offer-list page works end-to-end:**
   - Page loads and fetches offer data from `../data/offer-list-content.md` and `../data/assets.md`
   - Offer cards render in the grid with correct images, titles, badges, and pricing
   - Promotional banner renders in the grid
   - Clicking a card on desktop/tablet shows the inline offer details panel below the card row
   - Clicking a card on mobile shows the full-screen sheet overlay
   - The selected card shows brand outline + triangle indicator
   - Offer details show correct vehicle info, spec badges, booking options
   - Switching between "Best price" and "Stay flexible" updates the pricing
   - Close button dismisses the details panel/sheet
   - "Continue" button navigates to protection.html with correct URL params
   - Filter chips render correctly (they're static for now, not functional)
   - Responsive layout works: 1 column on mobile, 2 on tablet, 3 on desktop
   - Header theme syncs correctly (option-light on desktop, prime-light on mobile)
   - Footer renders correctly
   - No console errors
   - Navigation back from protection page works

Commit with a message like: "Add offer components and migrate offer-list page to Web Components"

Do NOT merge to main — leave the branch for review.
