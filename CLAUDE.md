# CLAUDE.md

SIXT booking funnel prototype. Vanilla HTML, CSS, and Web Components. Not production code — fast experimentation over perfect implementation.


## Quick start

```bash
npm install && npm run dev
```

Open `http://localhost:5173/prototype/pages/home.html` to browse the prototype.


## Tech stack

**Use:**
- Vanilla Web Components (Custom Elements + Shadow DOM) for all reusable UI
- `ox-` prefix for all custom element tag names (matches SIXT Storybook naming)
- HTML + CSS for page-level layout and composition
- Design tokens from `prototype/styles/tokens.css`
- Typography utility classes from `prototype/styles/typography.css`
- Lightweight page-level JavaScript for orchestration

**Never introduce:**
- Tailwind, PostCSS, or any CSS build tools
- React, Vue, or any JS framework
- Component libraries (shadcn, Radix, etc.)
- Web Component libraries (Lit, Stencil, Fast) — vanilla only
- Backend services, databases, or authentication


## Web Component pattern

Every component follows this exact structure. Copy it when creating new components.

```javascript
/* Component description
   API: <ox-example kind="primary" size="large" disabled>Label</ox-example> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
    /* Use tokens, never hardcode values */
  }
  :host([hidden]) { display: none; }
  /* Variants via :host([attribute]) selectors */
`);

class OxExample extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const kind = this.getAttribute('kind') || 'primary';
    this.shadowRoot.innerHTML = `
      <button class="example text-copy-medium-heavy">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('ox-example', OxExample);
```

### Key conventions

- Components live in `prototype/components/`, one `.js` file per component
- Shared constructable stylesheets in `prototype/components/shared/`:
  - `base-styles.js` — typography utility classes + icon utilities including `filled` attribute support (adopted by all components)
  - `layout-styles.js` — layout-shell horizontal centering (for full-width components)
  - `ox-icon-button-styles.js` — shared interaction styles for icon buttons
- Design tokens (CSS custom properties on `:root`) inherit into Shadow DOM automatically — never embed token values in component files
- All styling via `:host` and `:host([attribute])` selectors
- Typography classes applied inside shadow DOM templates (e.g. `class="text-copy-medium-heavy"`)
- Components own their typography internally — consumers should not need to pass typography classes
- Custom events use `{ bubbles: true, composed: true }` to cross shadow boundaries
- Light DOM coordinators (ox-protection-group, ox-choice-card-group) skip Shadow DOM intentionally — they manage child component state
- Register the element at bottom of file: `customElements.define('ox-name', ClassName)`
- Add the import to `prototype/components/index.js`


## Component inventory

All components are registered via `prototype/components/index.js`.

| Tag | File | Usage example |
|-----|------|---------------|
| `ox-badge` | ox-badge.js | `<ox-badge kind="brand" variant="solid" icon="star" preset="hot-offer-promo">Hot offer</ox-badge>` |
| `ox-banner` | ox-banner.js | `<ox-banner kind="info" icon="info" title="Heading" dismissible>Body text</ox-banner>` |
| `ox-booking-footer` | ox-booking-footer.js | `<ox-booking-footer><ox-link slot="link">Help</ox-link><span slot="copyright">&copy; Sixt 2026</span></ox-booking-footer>` |
| `ox-booking-header` | ox-booking-header.js | `<ox-booking-header location="Munich Airport" dates="Mar 26 – Mar 30" variant="step" step-title="Protection"></ox-booking-header>` |
| `ox-booking-overview` | ox-booking-overview.js | `<ox-booking-overview title="Your booking overview:"><ox-list-item icon="check">Item</ox-list-item></ox-booking-overview>` |
| `ox-button` | ox-button.js | `<ox-button kind="brand" size="large" variant="solid" icon="arrow_forward" href="./next.html">Continue</ox-button>` |
| `ox-carousel` | ox-carousel.js | `<ox-carousel cards-per-view="1" cards-per-view-md="2" gap="xs" prev-label="Previous" next-label="Next" dot-label="Go to slide {n}"><article>Slide</article></ox-carousel>` |
| `ox-chip` | ox-chip.js | `<ox-chip size="small" icon="tune" preset="dropdown" selected>Filters</ox-chip>` |
| `ox-choice-card` | ox-choice-card.js | `<ox-choice-card value="best-price" selected>Best price</ox-choice-card>` |
| `ox-choice-card-group` | ox-choice-card-group.js | `<ox-choice-card-group><ox-choice-card value="a">A</ox-choice-card></ox-choice-card-group>` |
| `ox-floating-button` | ox-floating-button.js | `<ox-floating-button size="medium" content="icon-only" icon="chevron_left" label="Previous"></ox-floating-button>` |
| `ox-icon-button` | ox-icon-button.js | `<ox-icon-button kind="primary" size="large" icon="close" label="Close"></ox-icon-button>` |
| `ox-link` | ox-link.js | `<ox-link href="#" kind="primary" underlined>Link text</ox-link>` |
| `ox-list-item` | ox-list-item.js | `<ox-list-item kind="primary" size="medium" icon="check" trailing-icon="info" trailing-label="More info">Label</ox-list-item>` |
| `ox-offer-banner` | ox-offer-banner.js | `<ox-offer-banner title="Headline" subtitle="Body" cta-text="Learn more" image="url" href="#"></ox-offer-banner>` |
| `ox-offer-card` | ox-offer-card.js | `<ox-offer-card variant="premium" title="BMW 3 Series" image="url" daily-price="71.27" specs="..."></ox-offer-card>` |
| `ox-offer-details` | ox-offer-details.js | `<ox-offer-details variant="default" title="Vehicle name" image="url"></ox-offer-details>` |
| `ox-price` | ox-price.js | `<ox-price kind="brand" size="large" currency="$" integer="71" decimal=".27" suffix="/ day"></ox-price>` |
| `ox-protection-card` | ox-protection-card.js | `<ox-protection-card option-id="smart" title="Smart" stars="2" deductible="€950"></ox-protection-card>` |
| `ox-protection-group` | ox-protection-group.js | `<ox-protection-group><ox-protection-card ...></ox-protection-card></ox-protection-group>` |
| `ox-radio-button` | ox-radio-button.js | `<ox-radio-button value="smart" checked disabled error></ox-radio-button>` |
| `ox-separator` | ox-separator.js | `<ox-separator orientation="horizontal" size="small" contrast="low"></ox-separator>` |
| `ox-text-button` | ox-text-button.js | `<ox-text-button kind="primary" size="large" icon="help_center" trailing-icon="arrow_forward" underlined>Label</ox-text-button>` |

Check each component file's header comment for the full attribute API.


## Design tokens

Use `prototype/styles/tokens.css` and `prototype/styles/typography.css` as the source of truth. This repo is design-system-driven. Prefer reuse and consistency over ad-hoc styling.

### Core principle

1. Never hardcode design values when a token or typography utility already exists
2. Always prefer semantic tokens over raw values
3. Keep page CSS focused on layout/composition, not redefining shared style primitives

### Colors

Use semantic tokens from `tokens.css`. Do not use hex/rgb/hsl directly in component/page CSS.

**Text & icons**
- primary `--color-content-primary` — main text and icons
- secondary `--color-content-secondary` — muted text, dividers, strikethrough prices
- tertiary `--color-content-tertiary` — disabled fills, card strokes

**Surfaces**
- canvas `--color-surface-canvas` — page background
- container `--color-surface-container` — card background, text fields
- secondary-canvas `--color-surface-secondary-canvas` — alternate page background
- secondary-container `--color-surface-secondary-container` — secondary buttons, chips, default banners

**Brand**
- brand `--color-content-extended-brand` — primary CTA fill, promo prices, marketing labels
- soft-brand `--color-content-extended-soft-brand` — subtle brand background for badges and banners
- Text on brand fill: `--color-on-content-extended-on-brand` (white in prime theme)

**Status** — each has three intensities: soft (background), base (icon/text), strong (text on soft fill)
- success: `--color-content-extended-{soft-success, success, strong-success}`
- error: `--color-content-extended-{soft-error, error, strong-error}`
- warning: `--color-content-extended-{soft-warning, warning, strong-warning}`
- info: `--color-content-extended-{soft-info, info, strong-info}`

Use extended colors sparingly — keep SIXT's clean premium look.

**Overlays**
- hover `--color-overlay-hover`, pressed `--color-overlay-pressed`, dimming `--color-overlay-dimming`

**Theming** — default is prime light (`:root`). Other themes (prime dark, option, accent) activate via `data-p100-theme` attribute. Token values adapt automatically.

### Typography

Typography is utility-class based. Classes are defined in `typography.css` and made available inside Shadow DOM via the shared `baseStyles` constructable stylesheet.

**Required behavior:**
- In page HTML: apply text styling via classes from `typography.css` (e.g. `text-copy-large-regular`, `text-display-large-heavy-caps`)
- In Web Components: apply the same typography classes inside the shadow DOM `render()` template (e.g. `<span class="label text-copy-medium-heavy-tight">`)
- Components own their typography internally. Consumers should not need to pass typography classes.
- Font-size responsiveness is handled in `tokens.css`; do not recreate responsive font logic

**Prohibited outside `typography.css`** — do not set raw font declarations in component/page CSS:
- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `text-transform` (for typography intent)

Do not define new `.text-*` utility classes outside `prototype/styles/typography.css`.

**If a style is missing:** add/extend definitions in `prototype/styles/typography.css` first, then use that class.

### Spacing

Use `--spacing-{size}`:
- 5xs (2px), 4xs (4px), 3xs (8px), 2xs (12px), xs (16px)
- sm (20px), md (24px), lg (32px), xl (40px), 2xl (48px)
- 3xl–6xl (64–160px)

### Radius

Use `--radius-{size}`: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), pill (160px)

### Component sizes

Not covered by `tokens.css` — use these canonical values:
- Large button: height 52px, min-width 128px
- Small/pill button: height 36px, min-width 96px
- Text field: height 52px
- Badge: height 24px
- Checkbox/radio control: 24px
- Switch/toggle: 56x32px, knob 24px
- Dialog width: full-width on mobile, 560px on desktop
- Icons: 16px (small), 24px (default), 32px (large)

### Elevation

- `--elevation-small` — buttons, chips
- `--elevation-medium` — cards, dropdowns, tooltips
- `--elevation-large` — dialogs, drawers, sheets

### Stroke

- sm (1px) — dividers, card borders
- md (2px) — button strokes
- lg (3px) — focus rings, active fields
- xl (4px) — heavy separators

### Layout breakpoints

- xs: up to 649px — mobile, 6 cols, 16px margin
- sm: 650–899px — portrait tablet, 12 cols, 32px margin
- md: 900–1199px — landscape tablet, 12 cols, 32px margin
- lg: 1200–1599px — laptop, 12 cols, 80px margin
- xl: 1600px+ — desktop, 12 cols, centered, max-width 1440px

Use media queries for layout/composition changes. Do not use them to rebuild typography utilities.


## Project structure

- `sources/` — original crawled websites (read-only, never modify)
- `prototype/` — working booking flow prototype
  - `prototype/base.html` — shared HTML boilerplate, starting point for new pages
  - `prototype/components/` — Web Component definitions
  - `prototype/components/shared/` — shared constructable stylesheets
  - `prototype/scripts/pages/` — page-level orchestration scripts
  - `prototype/styles/tokens.css` — design tokens
  - `prototype/styles/typography.css` — text utility classes
  - `prototype/styles/components/` — legacy CSS component contracts (being replaced by Web Components)
  - `prototype/styles/pages/` — page-specific layout CSS
  - `prototype/data/` — content data files (markdown)
  - `prototype/assets/` — images, logos, custom SVGs
- `experiments/` — isolated redesign explorations (optional)

### Icons

Material Symbols loaded via Google Fonts CDN in `prototype/base.html`. Always start new pages from `base.html`.

- Default icon style is **outlined** (FILL 0)
- Add the `filled` boolean attribute to switch to filled style (FILL 1) — CSS-driven, no per-component JS
- Custom SVGs live in `prototype/assets/icons/`, use `{category}-{name}.svg` naming
- Icon utilities available inside Web Components via the shared `baseStyles`


## Data files

Content data lives in `prototype/data/`. Each page's data is self-contained in a single markdown file.

### Naming convention

- `{page}-{location-slug}.md` for location-specific data (e.g. `offer-list-munich-airport.md`)
- `{page}-assets.md` for page-specific image URLs not yet embedded in content files (e.g. `home-assets.md`)

### Offer list data structure

Each offer-list file is self-contained with:
- Metadata (studio background URL)
- Search context (location, dates, currency)
- Page headline and quick filters
- Offers with inline image URLs, specs, pricing, badges
- Banner with image, title, subtitle, CTA
- Footer disclaimer and links

### Current scope

The prototype mocks a single happy path: Munich Airport, fixed dates (Mar 16–20), USD currency. Pick-up location and trip dates are not yet configurable in the UI.

### Multi-location support (planned)

To add a new location:
1. Create `offer-list-{location-slug}.md` with location-specific offers and images
2. Update the `data-content-src` attribute in the HTML to point to the new file
3. Each file is fully self-contained — no shared asset maps needed


## Creating new pages

1. Copy `prototype/base.html` as your starting point
2. Add `<link rel="stylesheet" href="../styles/all.css">` for global styles
3. Add `<script type="module" src="../components/index.js"></script>` for all Web Components
4. Create page-specific CSS in `prototype/styles/pages/{page-name}.css`
5. Create page script in `prototype/scripts/pages/{page-name}.js`
6. Use Web Components — do NOT use old CSS contract classes from `prototype/styles/components/`
7. Reference `offer-list.html` and `protection.html` as examples of the correct pattern


## Migration status

| Page | Status | Notes |
|------|--------|-------|
| home | Done | Web Components + ox-carousel |
| offer-list | Done | Web Components |
| protection | Done | Web Components |
| add-ons | Not built | Reference in `sources/sixt/crawl-2026-03/states/add-ons-*` |
| review-booking | Not built | Reference in `sources/sixt/crawl-2026-03/states/review-booking-*` |

When building new pages, always use Web Components. All existing pages have been migrated.


## Operating model

GitHub + Vercel auto-deploy on push to main. Branch-based work encouraged for experiments.

When instructions conflict, follow this priority:
1. User request in chat
2. This CLAUDE.md
3. README.md


## Practical enforcement for agents

When editing styles:
1. Reuse existing token + typography utilities first
2. If missing, extend shared system files (`tokens.css` or `typography.css`) intentionally
3. Keep page/component CSS scoped to structure, states, and layout
4. Avoid introducing raw visual constants that bypass the system
5. In Web Components, apply typography classes inside the shadow DOM `render()` template
6. When migrating from plain HTML to Web Components, remove any external negative-margin or typography overrides that the component now handles internally
