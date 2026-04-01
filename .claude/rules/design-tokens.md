# Design Tokens

Use `prototype/styles/tokens.css` and `prototype/styles/typography.css` as the source of truth.

### Core principle

1. Never hardcode design values when a token or typography utility already exists
2. Always prefer semantic tokens over raw values
3. Keep page CSS focused on layout/composition, not redefining shared style primitives

## Colors

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

## Typography

Typography is utility-class based. Classes are defined in `typography.css` and made available inside Shadow DOM via the shared `baseStyles` constructable stylesheet.

**Required behavior:**
- In page HTML: apply text styling via classes from `typography.css` (e.g. `text-copy-large-regular`, `text-display-large-heavy-caps`)
- In Web Components: apply the same typography classes inside the shadow DOM `render()` template (e.g. `<span class="label text-copy-medium-heavy-tight">`)
- Components own their typography internally. Consumers should not need to pass typography classes.
- Font-size responsiveness is handled in `tokens.css`; do not recreate responsive font logic

**Prohibited outside `typography.css`** — do not set raw font declarations in component/page CSS:
- `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`

Do not define new `.text-*` utility classes outside `prototype/styles/typography.css`.

**If a style is missing:** add/extend definitions in `prototype/styles/typography.css` first, then use that class.

## Spacing

Use `--spacing-{size}`:
- 5xs (2px), 4xs (4px), 3xs (8px), 2xs (12px), xs (16px)
- sm (20px), md (24px), lg (32px), xl (40px), 2xl (48px)
- 3xl–6xl (64–160px)

## Radius

Use `--radius-{size}`: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), pill (160px)

## Component sizes

Not covered by `tokens.css` — use these canonical values:
- Large button: height 52px, min-width 128px
- Small/pill button: height 36px, min-width 96px
- Text field: height 52px
- Badge: height 24px
- Checkbox/radio control: 24px
- Switch/toggle: 56x32px, knob 24px
- Dialog width: full-width on mobile, 560px on desktop
- Icons: 16px (small), 24px (default), 32px (large)

## Elevation

- `--elevation-small` — buttons, chips
- `--elevation-medium` — cards, dropdowns, tooltips
- `--elevation-large` — dialogs, drawers, sheets

## Stroke

- sm (1px) — dividers, card borders
- md (2px) — button strokes
- lg (3px) — focus rings, active fields
- xl (4px) — heavy separators

## Layout breakpoints

- xs: up to 649px — mobile, 6 cols, 16px margin
- sm: 650–899px — portrait tablet, 12 cols, 32px margin
- md: 900–1199px — landscape tablet, 12 cols, 32px margin
- lg: 1200–1599px — laptop, 12 cols, 80px margin
- xl: 1600px+ — desktop, 12 cols, centered, max-width 1440px

Use media queries for layout/composition changes. Do not use them to rebuild typography utilities.

## Enforcement in Web Components

When editing styles:
1. Reuse existing token + typography utilities first
2. If missing, extend shared system files (`tokens.css` or `typography.css`) intentionally
3. Keep page/component CSS scoped to structure, states, and layout
4. Avoid introducing raw visual constants that bypass the system
5. In Web Components, apply typography classes inside the shadow DOM `render()` template
6. When migrating from plain HTML to Web Components, remove any external negative-margin or typography overrides that the component now handles internally
