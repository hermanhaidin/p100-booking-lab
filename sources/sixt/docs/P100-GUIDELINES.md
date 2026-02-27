# P100 design system

Design tokens and usage guidelines for P100 — the design system powering SIXT rent, share, ride, subscribe, van & truck, and SIXT one.

## Color tokens

### Metadata

- Type: `color`
- Figma representation: Variables
- Format: hex (`#RRGGBB`) or hex with alpha (`#RRGGBBAA`)
- Opacity notation "at X% opacity" means the value includes alpha channel
- Example: `colors/overlay/hover` = `#0000000D` (black at 5% = 0.05 alpha = 0D in hex)

---

### Theming

Three themes control color usage: `prime`, `option`, and `accent`. Each is distinguished by its background color.

- `prime`: light background (light mode) or dark background (dark mode) — the default theme
- `option`: dark background in both light and dark modes — creates a moody atmosphere
- `accent`: brand orange background — maximum attention and recognition

---

### Name origin

"Prime" and "Option" come from F1 tire compounds — the harder "Prime" tire and softer "Option" tire. Designers have flexibility with themes, similar to racing teams' tire strategy.

---

### Content colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/content/primary` | #1A1A1A | #FFFFFF | #FFFFFF | #FFFFFF | #1A1A1A | #1A1A1A |
| `colors/content/secondary` | #656A6F | #8D9299 | #8D9299 | #8D9299 | #1A1A1A | #1A1A1A |
| `colors/content/tertiary` | #D7DADC | #313234 | #313234 | #363739 | #1A1A1A | #1A1A1A |

**Usage**
- `primary`: primary text and icons color; background fill for selected chips, checkboxes, radio buttons; map marker color
- `secondary`: secondary text and icons color; strikethrough prices; dividers at [10%, 25%, 40%] opacity; checkboxes and radio buttons at 25% opacity; disabled text and icons at 30% opacity
- `tertiary`: opaque card strokes; disabled fill for secondary buttons

---

### On content colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/onContent/onPrimary` | #FFFFFF | #1A1A1A | #1A1A1A | #1A1A1A | #FFFFFF | #FFFFFF |
| `colors/onContent/onSecondary` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/onContent/onTertiary` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |

**Usage**
- `onPrimary`: foreground color for text and icons over primary fill e.g. in buttons and selected chips
- `onSecondary`: foreground color for text and icons over secondary fill
- `onTertiary`: foreground color for text and icons over tertiary fill

---

### Extended content colors

> Use sparingly to avoid visual clutter and retain SIXT's premium look.

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/contentExtended/softBrand` | #FFF2E8 | #410E00 | #410E00 | #410E00 | #D04000 | #D04000 |
| `colors/contentExtended/brand` | #FF5000 | #FF5000 | #FF5000 | #FF5000 | #FFFFFF | #FFFFFF |
| `colors/contentExtended/strongBrand` | #993000 | #993000 | #993000 | #993000 | #FFD6BF | #FFD6BF |
| `colors/contentExtended/softInfo` | #EAFBFF | #031D4B | #031D4B | #031D4B | #EAFBFF | #EAFBFF |
| `colors/contentExtended/info` | #0088FF | #0088FF | #0088FF | #0088FF | #0088FF | #0088FF |
| `colors/contentExtended/strongInfo` | #1658C7 | #559EC8 | #559EC8 | #559EC8 | #1658C7 | #1658C7 |
| `colors/contentExtended/softAccent` | #FCF6FF | #1C1755 | #1C1755 | #1C1755 | #FCF6FF | #FCF6FF |
| `colors/contentExtended/accent` | #6B5DFF | #6B5DFF | #6B5DFF | #6B5DFF | #6B5DFF | #6B5DFF |
| `colors/contentExtended/strongAccent` | #473CBA | #9288C9 | #9288C9 | #9288C9 | #473CBA | #473CBA |
| `colors/contentExtended/softSuccess` | #EAFFEC | #02270D | #02270D | #02270D | #EAFFEC | #EAFFEC |
| `colors/contentExtended/success` | #22C55E | #1AA04B | #1AA04B | #1AA04B | #22C55E | #22C55E |
| `colors/contentExtended/strongSuccess` | #17783C | #22C55E | #22C55E | #22C55E | #17783C | #17783C |
| `colors/contentExtended/softWarning` | #FFFEE0 | #3A2804 | #3A2804 | #3A2804 | #FFFEE0 | #FFFEE0 |
| `colors/contentExtended/warning` | #FFBC1F | #C88C18 | #C88C18 | #C88C18 | #FFBC1F | #FFBC1F |
| `colors/contentExtended/strongWarning` | #99690B | #FFBC1F | #FFBC1F | #FFBC1F | #99690B | #99690B |
| `colors/contentExtended/softError` | #FFF5F6 | #3B0002 | #3B0002 | #3B0002 | #FFF5F6 | #FFF5F6 |
| `colors/contentExtended/error` | #D70015 | #FF5556 | #FF5556 | #FF5556 | #D70015 | #D70015 |
| `colors/contentExtended/strongError` | #9F000C | #FF8A8E | #FF8A8E | #FF8A8E | #9F000C | #9F000C |

**Usage**
- `softBrand`: background fill for bordered badges, banners, and cards
- `brand`: background fill for main CTAs and prominent bordered badges; promotional prices; marketing labels color
- `strongBrand`: background fill for bordered badges used for hot offers
- `softInfo`: background fill for bordered badges, banners, and cards
- `info`: background fill for prominent bordered badges; informational text and icons color over `canvas` and `container`
- `strongInfo`: informational text and icons color over `softInfo` fill
- `softAccent`: background fill for bordered badges, banners, and cards
- `accent`: background fill for prominent bordered badges; accent text and icons color over `canvas` and `container`
- `strongAccent`: accent text and icons color over `softAccent` fill
- `softSuccess`: background fill for bordered badges, banners, cards, snackbars, and toasts; used in positive or success context
- `success`: background fill for prominent bordered badges; positive message text and icons color over `canvas` and `container`; used in positive or success context
- `strongSuccess`: positive message text and icons color over `softSuccess` fill; used in positive or success context
- `softWarning`: background fill for bordered badges, banners, cards, snackbars, and toasts; used in warning or medium caution context
- `warning`: background fill for prominent bordered badges; used in warning or medium caution context
- `strongWarning`: warning message text and icons color over soft warning fill; used in warning or medium caution context
- `softError`: background fill for bordered badges, banners, cards, snackbars, and toasts; used in error or extreme caution context
- `error`: background fill for prominent bordered badges; default error message text and icons color; used in error or extreme caution context
- `strongError`: error message text and icons color over `softError` fill; used in error or extreme caution context

---

### On extended content colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/onContentExtended/onBrand` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #1A1A1A | #1A1A1A |
| `colors/onContentExtended/onInfo` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/onContentExtended/onAccent` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/onContentExtended/onSuccess` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/onContentExtended/onWarning` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/onContentExtended/onError` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |

**Usage**
- `onBrand`: foreground color for text and icons over `brand` and `strongBrand` fill
- `onInfo`: foreground color for text and icons over `info` and `strongInfo` fill
- `onAccent`: foreground color for text and icons over `accent` and `strongAccent` fill
- `onSuccess`: foreground color for text and icons over `success` and `strongSuccess` fill
- `onWarning`: foreground color for text and icons over `warning` and `strongWarning` fill
- `onError`: foreground color for text and icons over `error` and `strongError` fill

---

### Surface colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/surface/canvas` | #FFFFFF | #1A1A1A | #1A1A1A | #1E1E1F | #FF5000 | #FF5000 |
| `colors/surface/secondaryCanvas` | #E9EBEE | #1E1E1F | #1E1E1F | #212223 | #D04000 | #D04000 |
| `colors/surface/container` | #FFFFFF | #212223 | #212223 | #212223 | #FF5000 | #FF5000 |
| `colors/surface/secondaryContainer` | #F4F5F6 | #272829 | #272829 | #2B2C2D | #D04000 | #D04000 |

**Usage**
- `canvas`: main background color; default page or viewport background color
- `secondaryCanvas`: secondary background color; alternative page or viewport background color
- `container`: default card background color; background color for text fields, protection package cards, add-on tiles
- `secondaryContainer`: secondary card background color; background color for secondary buttons, chips, default banners, and disabled text fields

---

### Glass material colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/glass/clear` | #FFFFFF at 1% opacity | #000000 at 1% opacity | #000000 at 1% opacity | #000000 at 1% opacity | #FF5000 at 1% opacity | #FF5000 at 1% opacity |
| `colors/glass/ultraThin` | #FFFFFF at 13% opacity | #000000 at 13% opacity | #000000 at 13% opacity | #000000 at 13% opacity | #FF5000 at 13% opacity | #FF5000 at 13% opacity |
| `colors/glass/thin` | #FFFFFF at 34% opacity | #000000 at 34% opacity | #000000 at 34% opacity | #000000 at 34% opacity | #FF5000 at 34% opacity | #FF5000 at 34% opacity |
| `colors/glass/regular` | #FFFFFF at 55% opacity | #000000 at 55% opacity | #000000 at 55% opacity | #000000 at 55% opacity | #FF5000 at 55% opacity | #FF5000 at 55% opacity |
| `colors/glass/thick` | #FFFFFF at 78% opacity | #000000 at 78% opacity | #000000 at 78% opacity | #000000 at 78% opacity | #FF5000 at 78% opacity | #FF5000 at 78% opacity |

**Usage**
- `clear`: 1% opacity glass-like cards; fully transparent
- `ultraThin`: 13% opacity glass-like cards
- `thin`: 34% opacity glass-like cards
- `regular`: 55% opacity glass-like cards
- `thick`: 78% opacity glass-like cards

---

### Overlay colors

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/overlay/hover` | #000000 at 5% opacity | #FFFFFF at 5% opacity | #FFFFFF at 5% opacity | #FFFFFF at 5% opacity | #000000 at 5% opacity | #000000 at 5% opacity |
| `colors/overlay/pressed` | #000000 at 8% opacity | #000000 at 8% opacity | #000000 at 8% opacity | #000000 at 8% opacity | #000000 at 8% opacity | #000000 at 8% opacity |
| `colors/overlay/disabled` | #FFFFFF at 34% opacity | #000000 at 34% opacity | #000000 at 34% opacity | #000000 at 34% opacity | #FF5000 at 34% opacity | #FF5000 at 34% opacity |
| `colors/overlay/focus` | #FF5000 | #FF5000 | #FF5000 | #FF5000 | #1A1A1A | #1A1A1A |
| `colors/overlay/shimmer` | #E9EBEE | #313234 | #313234 | #363739 | #FF7B51 | #FF7B51 |
| `colors/overlay/secondaryShimmer` | #D7DADC | #3B3C3E | #3B3C3E | #414244 | #FF9F7F | #FF9F7F |
| `colors/overlay/dimming` | #000000 at 21% opacity | #000000 at 34% opacity | #000000 at 21% opacity | #000000 at 34% opacity | #000000 at 21% opacity | #000000 at 34% opacity |

**Usage**
- `hover`: background fill overlay for buttons, chips, actionable list items when hovered
- `pressed`: background fill overlay for buttons, chips, actionable list items when pressed
- `disabled`: background fill overlay for buttons, chips when disabled
- `focus`: focus ring color upon keyboard navigation or voice over; switch/toggle tint when "on" state
- `shimmer`: main shimmer mask over `canvas`, `container` and `secondaryContainer`
- `secondaryShimmer`: secondary shimmer mask over `secondaryCanvas` and `secondaryContainer`
- `dimming`: dimming overlay when modals are present

---

### Headline accent colors

> Used for "SIXT share" and "SIXT subscribe". Fallback to primary text color for brand overrides like Jaguar-Landrover, BMW, Arval.

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/headline/lilac` | #F6E3FF | #F6E3FF | #F6E3FF | #F6E3FF | #F6E3FF | #F6E3FF |
| `colors/headline/blue` | #BFF2FF | #BFF2FF | #BFF2FF | #BFF2FF | #BFF2FF | #BFF2FF |
| `colors/headline/green` | #ABFFB2 | #ABFFB2 | #ABFFB2 | #ABFFB2 | #ABFFB2 | #ABFFB2 |
| `colors/headline/yellow` | #FFFBAB | #FFFBAB | #FFFBAB | #FFFBAB | #FFFBAB | #FFFBAB |

**Usage**
- `lilac`: highlight color for specific words or phrases in headlines
- `blue`: highlight color for specific words or phrases in headlines
- `green`: highlight color for specific words or phrases in headlines
- `yellow`: highlight color for specific words or phrases in headlines

---

### Loyalty program colors

> SIXT customers who joined the "SIXT one" loyalty program get status tiers by earning status points.

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/loyalty/silver` | #D9D9D9 | #D9D9D9 | #D9D9D9 | #D9D9D9 | #D9D9D9 | #D9D9D9 |
| `colors/loyalty/gold` | #C88C18 | #C88C18 | #C88C18 | #C88C18 | #C88C18 | #C88C18 |
| `colors/loyalty/platinum` | #9288C9 | #9288C9 | #9288C9 | #9288C9 | #9288C9 | #9288C9 |
| `colors/loyalty/diamond` | #559EC8 | #559EC8 | #559EC8 | #559EC8 | #559EC8 | #559EC8 |

**Usage**
- `silver`: loyalty program silver tier
- `gold`: loyalty program gold tier
- `platinum`: loyalty program platinum tier
- `diamond`: loyalty program diamond tier

---

### Global colors

> Some colors stay the same no matter what.

| Token | Prime Light | Prime Dark | Option Light | Option Dark | Accent Light | Accent Dark |
|-------|-------------|------------|--------------|-------------|--------------|-------------|
| `colors/global/black` | #000000 | #000000 | #000000 | #000000 | #000000 | #000000 |
| `colors/global/sixtAnthracite` | #1A1A1A | #1A1A1A | #1A1A1A | #1A1A1A | #1A1A1A | #1A1A1A |
| `colors/global/white` | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| `colors/global/sixtOrange` | #FF5000 | #FF5000 | #FF5000 | #FF5000 | #FF5000 | #FF5000 |

**Usage**
- `black`: background fill in loyalty program landing pages and banners; when UI element should always stay black
- `sixtAnthracite`: SIXT logo wordmark in partner products; when UI element should always stay SIXT anthracite
- `white`: background fill at 12% opacity in offer detail badges e.g. "5 seats", "Automatic"; also text and icons color in same badges; when UI element should always stay white
- `sixtOrange`: SIXT logo swoosh in partner products; when UI element should always stay SIXT orange


## Gradient tokens

### Metadata

- Type: `gradient`
- Figma representation: Color styles
- Format: two-stop radial gradients
- Size: 100% × 100% of container
- Stops:
  - Inner (10%): base color at 30% opacity
  - Outer (100%): transparent (`colors/glass/clear`)
- Position: determined by gradient name (TopLeading = top-left, TopTrailing = top-right)
- Web: CSS `radial-gradient(100% 100% at [position], [color] 10%, transparent 100%)`

---

### Radial gradients

| Token | Position | Base Color | Use |
|-------|----------|------------|-----|
| `radialGradient/brandTopLeading` | top-left (0% 0%) | `colors/contentExtended/brand` at 30% opacity | Decorative background accent |
| `radialGradient/brandTopTrailing` | top-right (100% 0%) | `colors/contentExtended/brand` at 30% opacity | Decorative background accent |
| `radialGradient/infoTopLeading` | top-left (0% 0%) | `colors/contentExtended/info` at 30% opacity | Decorative background accent |
| `radialGradient/infoTopTrailing` | top-right (100% 0%) | `colors/contentExtended/info` at 30% opacity | Decorative background accent |
| `radialGradient/accentTopLeading` | top-left (0% 0%) | `colors/contentExtended/accent` at 30% opacity | Decorative background accent |
| `radialGradient/accentTopTrailing` | top-right (100% 0%) | `colors/contentExtended/accent` at 30% opacity | Decorative background accent |
| `radialGradient/successTopLeading` | top-left (0% 0%) | `colors/contentExtended/success` at 30% opacity | Decorative background accent |
| `radialGradient/successTopTrailing` | top-right (100% 0%) | `colors/contentExtended/success` at 30% opacity | Decorative background accent |
| `radialGradient/silverTopLeading` | top-left (0% 0%) | `colors/loyalty/silver` at 30% opacity | Loyalty tier background accent |
| `radialGradient/silverTopTrailing` | top-right (100% 0%) | `colors/loyalty/silver` at 30% opacity | Loyalty tier background accent |
| `radialGradient/goldTopLeading` | top-left (0% 0%) | `colors/loyalty/gold` at 30% opacity | Loyalty tier background accent |
| `radialGradient/goldTopTrailing` | top-right (100% 0%) | `colors/loyalty/gold` at 30% opacity | Loyalty tier background accent |
| `radialGradient/platinumTopLeading` | top-left (0% 0%) | `colors/loyalty/platinum` at 30% opacity | Loyalty tier background accent |
| `radialGradient/platinumTopTrailing` | top-right (100% 0%) | `colors/loyalty/platinum` at 30% opacity | Loyalty tier background accent |
| `radialGradient/diamondTopLeading` | top-left (0% 0%) | `colors/loyalty/diamond` at 30% opacity | Loyalty tier background accent |
| `radialGradient/diamondTopTrailing` | top-right (100% 0%) | `colors/loyalty/diamond` at 30% opacity | Loyalty tier background accent |


## Typography tokens

### Metadata

- Type: `textStyle` (composite)
- Figma representation: Text styles
- Properties: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textTransform
- fontSize:
    - Web: use `rem` value (1rem = 16px base)
    - iOS/Android: use px value as `pt`/`sp`
- lineHeight:
  - Values 1.0, 1.2, 1.5 are ratios (multiply by fontSize to get px)
  - Example: `display/large/heavy` with fontSize 60px and lineHeight 1.0 → 60px
- letterSpacing:
  - Web: use `em` value (scales with font size)
  - iOS/Android: use px value as `pt`/`sp` (based on mobile font size)
- textTransform:
    - Check the Text Transform column for each token
    - Apply `text-transform: uppercase` in CSS (or equivalent in iOS/Android) where specified
    — This property cannot be tokenized in Figma

---

### Text roles

Three text roles: `display`, `title`, and `copy`.

---

### Display text

> Hero headlines for landing pages. Uppercase is the default style.

| Token | Family | Weight | Line Height | Letter Spacing | Text Transform | Use |
|-------|--------|--------|-------------|----------------|----------------|-----|
| `display/large/heavy` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.025em) | None | h1 hero headlines |
| `display/large/heavyCaps` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.025em) | Uppercase | h1 hero headlines (default) |
| `display/large/regular` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.025em) | None | h1 hero headlines (lighter weight) |
| `display/large/regularCaps` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.025em) | Uppercase | h1 hero headlines (lighter weight) |
| `display/medium/heavy` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.0313em) | None | h2 section headlines |
| `display/medium/heavyCaps` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.0313em) | Uppercase | h2 section headlines (default) |
| `display/medium/regular` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.0313em) | None | h2 section headlines (lighter weight) |
| `display/medium/regularCaps` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.0313em) | Uppercase | h2 section headlines (lighter weight) |
| `display/small/heavy` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.0375em) | None | h3 subsection headlines |
| `display/small/heavyCaps` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1.5px (0.0375em) | Uppercase | h3 subsection headlines (default) |
| `display/small/regular` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.0375em) | None | h3 subsection headlines; large social proof quotes |
| `display/small/regularCaps` | Helvetica Now Text | Regular (400) | 1.0 | 1.5px (0.0375em) | Uppercase | h3 subsection headlines (lighter weight) |

---

### Title text

> Smaller headlines when display feels too large. Used for section breaks and mobile app titles.

| Token | Family | Weight | Line Height | Letter Spacing | Text Transform | Use |
|-------|--------|--------|-------------|----------------|----------------|-----|
| `title/large/heavy` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1px (0.03em) | None | Mobile app screen titles; campaign headlines |
| `title/large/heavyCaps` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1px (0.03em) | Uppercase | Mobile app screen titles; campaign headlines (default) |
| `title/large/regular` | Helvetica Now Text | Regular (400) | 1.0 | 1px (0.03em) | None | Large titles (lighter weight) |
| `title/large/regularCaps` | Helvetica Now Text | Regular (400) | 1.0 | 1px (0.03em) | Uppercase | Large titles (lighter weight) |
| `title/medium/heavy` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1px (0.036em) | None | h3 landing page headlines |
| `title/medium/heavyCaps` | Helvetica Now Display | Cn Blk (900) | 1.0 | 1px (0.036em) | Uppercase | h3 landing page headlines (default) |
| `title/medium/regular` | Helvetica Now Text | Regular (400) | 1.0 | 1px (0.036em) | None | h3 landing page headlines (lighter weight) |
| `title/medium/regularCaps` | Helvetica Now Text | Regular (400) | 1.0 | 1px (0.036em) | Uppercase | h3 landing page headlines (lighter weight) |
| `title/small/heavy` | Helvetica Now Text | Bold (700) | 1.2 | 0.25px (0.0125em) | None | USP text; section headlines; date picker labels; large price integers |
| `title/small/heavyCaps` | Helvetica Now Text | Bold (700) | 1.2 | 0.25px (0.0125em) | Uppercase | Car category titles |
| `title/small/regular` | Helvetica Now Text | Regular (400) | 1.2 | 0.25px (0.0125em) | None | USP text; large price integers (lighter weight) |
| `title/small/regularCaps` | Helvetica Now Text | Regular (400) | 1.2 | 0.25px (0.0125em) | Uppercase | Car category titles (lighter weight) |

---

### Copy text

> Body text, component labels, and smaller UI elements.

| Token | Family | Weight | Line Height | Letter Spacing | Text Transform | Use |
|-------|--------|--------|-------------|----------------|----------------|-----|
| `copy/xLarge/heavy` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0055em) | None | Social proof quotes |
| `copy/xLarge/heavyCaps` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0055em) | Uppercase | Social proof quotes |
| `copy/xLarge/heavyTight` | Helvetica Now Text | Bold (700) | 1.2 | 0.12px (0.0055em) | None | Social proof quotes (compact) |
| `copy/xLarge/regular` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0055em) | None | Social proof quotes |
| `copy/xLarge/regularCaps` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0055em) | Uppercase | Social proof quotes |
| `copy/xLarge/regularTight` | Helvetica Now Text | Regular (400) | 1.2 | 0.12px (0.0055em) | None | Social proof quotes (compact, default) |
| `copy/large/heavy` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0075em) | None | Body text in help/SEO pages |
| `copy/large/heavyCaps` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0075em) | Uppercase | Button labels; banner titles |
| `copy/large/heavyTight` | Helvetica Now Text | Bold (700) | 1.2 | 0.12px (0.0075em) | None | Button labels; banner titles; section headlines; map markers; picker selections |
| `copy/large/regular` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0075em) | None | Text field input; body text in help/SEO pages |
| `copy/large/regularCaps` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0075em) | Uppercase | Body text (uppercase variant) |
| `copy/large/regularTight` | Helvetica Now Text | Regular (400) | 1.2 | 0.12px (0.0075em) | None | Accordion labels; search results; picker options |
| `copy/medium/heavy` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0086em) | None | Snackbars; tooltips; checklists; checkbox/radio labels; medium prices |
| `copy/medium/heavyCaps` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.0086em) | Uppercase | Medium labels |
| `copy/medium/heavyTight` | Helvetica Now Text | Bold (700) | 1.2 | 0.12px (0.0086em) | None | Small button labels; selected chip labels; date picker days |
| `copy/medium/regular` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0086em) | None | Snackbars; tooltips; checklists; checkbox/radio labels; medium prices |
| `copy/medium/regularCaps` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.0086em) | Uppercase | Medium labels |
| `copy/medium/regularTight` | Helvetica Now Text | Regular (400) | 1.2 | 0.12px (0.0086em) | None | Unselected chip labels |
| `copy/small/heavy` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.01em) | None | Small price integers |
| `copy/small/heavyCaps` | Helvetica Now Text | Bold (700) | 1.5 | 0.12px (0.01em) | Uppercase | Marketing badge labels |
| `copy/small/heavyTight` | Helvetica Now Text | Bold (700) | 1.2 | 0.12px (0.01em) | None | Badge labels; text field labels |
| `copy/small/regular` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.01em) | None | Sublabels; hints; error messages; small checklists; legal text |
| `copy/small/regularCaps` | Helvetica Now Text | Regular (400) | 1.5 | 0.12px (0.01em) | Uppercase | Legal text headings |
| `copy/small/regularTight` | Helvetica Now Text | Regular (400) | 1.2 | 0.12px (0.01em) | None | Bottom navigation labels |

---

### Responsive sizing

> Font sizes scale with viewport width. iOS and Android use mobile sizes only.

| Token | Mobile (320...649px) | Tablet (650...1199px) | Desktop (1200...2560px) |
|-------|----------------------|-----------------------|-------------------------|
| `display/large/*` | 60px (3.75rem) | 68px (4.25rem) | 72px (4.5rem) |
| `display/medium/*` | 48px (3rem) | 56px (3.5rem) | 60px (3.75rem) |
| `display/small/*` | 40px (2.5rem) | 46px (2.875rem) | 50px (3.125rem) |
| `title/large/*` | 34px (2.125rem) | 36px (2.25rem) | 40px (2.5rem) |
| `title/medium/*` | 28px (1.75rem) | 28px (1.75rem) | 30px (1.875rem) |
| `title/small/*` | 20px (1.25rem) | 22px (1.375rem) | 24px (1.5rem) |
| `copy/xLarge/*` | 22px (1.375rem) | 22px (1.375rem) | 22px (1.375rem) |
| `copy/large/*` | 16px (1rem) | 16px (1rem) | 16px (1rem) |
| `copy/medium/*` | 14px (0.875rem) | 14px (0.875rem) | 14px (0.875rem) |
| `copy/small/*` | 12px (0.75rem) | 12px (0.75rem) | 12px (0.75rem) |


## Size tokens

### Metadata

- Type: `dimension`
- Figma representation: Variables
- Web: use `rem` value for spacing/radius/stroke (1rem = 16px base)
- iOS/Android: use px value as `pt`/`sp` for spacing/radius/stroke
- Blur: uses `px` (30px for `blur/glass`)
- Cross-platform rendering: same numeric values used across platforms (16px → 16pt/16dp), but physical sizes may vary slightly due to platform rendering differences; visual appearance is prioritized over mathematical precision

---

### Spacing

> Distance between elements e.g. icon and text, paddings, margins. In Figma used in auto-layout.

| Token | Value | Use |
|-------|-------|-----|
| `spacing/5xs` | 2px (0.125rem) | Vertical gap between label and sublabel in accordions, list items, checkboxes, radio buttons |
| `spacing/4xs` | 4px (0.25rem) | Vertical gap between title and description in banners, alert dialogs; vertical gap between text field label, input, and hint |
| `spacing/3xs` | 8px (0.5rem) | Horizontal gap between icon and label in buttons, chips; horizontal gap between stacked badges or filter chips |
| `spacing/2xs` | 12px (0.75rem) | Horizontal padding in text fields; vertical padding in list items with large text; vertical gap between stacked large buttons |
| `spacing/xs` | 16px (1rem) | Padding in banners, snackbars; horizontal padding in small pill chips; horizontal gap between control and label in checkboxes, radio buttons; vertical gap between form text fields |
| `spacing/sm` | 20px (1.25rem) | Intermediate between `xs` and `md` |
| `spacing/md` | 24px (1.5rem) | Padding in alert dialogs; horizontal gap between offer tiles in list column layout (screens >1199px) |
| `spacing/lg` | 32px (2rem) | Padding in marketing campaign cards |
| `spacing/xl` | 40px (2.5rem) | Intermediate between `lg` and `2xl` |
| `spacing/2xl` | 48px (3rem) | Padding in dialogs on screens wider than 600px |
| `spacing/3xl` | 64px (4rem) | Intermediate between `2xl` and `4xl` |
| `spacing/4xl` | 80px (5rem) | Padding in large landing page sections (e.g. bento grid sections with section headlines) |
| `spacing/5xl` | 96px (6rem) | Extra large section padding |
| `spacing/6xl` | 160px (10rem) | Maximum section padding |

---

### Radius

> Corner radius of buttons, cards, text fields and other UI elements.

| Token | Value | Use |
|-------|-------|-----|
| `radius/xs` | 4px (0.25rem) | Corner radius of checkbox control |
| `radius/sm` | 8px (0.5rem) | Corner radius of tooltip |
| `radius/md` | 12px (0.75rem) | Corner radius of large buttons, chips, snackbars, text fields |
| `radius/lg` | 16px (1rem) | Corner radius of banners, offer list tiles in offer list, marketing campaign cards |
| `radius/xl` | 24px (1.5rem) | Corner radius of alert dialog, dialog, bottom sheet |
| `radius/pill` | 160px (10rem) | Corner radius of small pill-shaped buttons, chips, badges; corner radius of segmented control |

---

### Stroke

> Stroke width, 1px is default for dividers.

| Token | Value | Use |
|-------|-------|-----|
| `stroke/sm` | 1px (0.0625rem) | Default divider in a list; default selectable card stroke; default text field stroke |
| `stroke/md` | 2px (0.125rem) | Default stroke in buttons |
| `stroke/lg` | 3px (0.1875rem) | Default focus ring stroke, also in text fields when typing |
| `stroke/xl` | 4px (0.25rem) | Heavy stroke for emphasized separation between sections |

---

### Blur

> Background blur effect applied to glass-like cards.

| Token | Value | Use |
|-------|-------|-----|
| `blur/glass` | 30px | Background blur for glass material effects; combine with `colors/glass/*` tokens for frosted glass appearance |


## Shadow tokens

### Metadata

- Type: `shadow` (composite)
- Figma representation: Effect styles
- Each elevation token uses two shadow layers for depth
- Shadow values: `offset-x offset-y blur spread color`
- Color: `#000000` at various opacities (e.g. 10%, 8%)
- All shadows use 0 spread radius and 0 horizontal offset

---

### Elevation tokens

| Token | Layer 1 | Layer 2 | Use |
|-------|---------|---------|-----|
| `elevation/small` | 0 2px 6px 0 #000000 at 10% opacity | 0 1px 4px 0 #000000 at 8% opacity | Subtle elevation for buttons, chips, or floating UI elements that need minimal depth |
| `elevation/medium` | 0 4px 14px 0 #000000 at 10% opacity | 0 2px 10px 0 #000000 at 8% opacity | Standard elevation for cards, dropdowns, tooltips, or modals that need moderate depth |
| `elevation/large` | 0 12px 40px 0 #000000 at 10% opacity | 0 8px 32px 0 #000000 at 8% opacity | Heavy elevation for dialogs, drawers, or prominent floating panels that need maximum depth and separation from background |


## Breakpoint tokens

### Metadata

- Type: `dimension`
- Figma representation: Layout guide styles
- Layout types:
  - `Stretch`: layout spans full viewport width; uses margin for edge spacing
  - `Center`: layout has max-width and is centered
- Column width:
  - `Auto`: stretches to viewport width (used in Stretch layouts)
  - Pixel value (e.g. 98px, 90px): fixed column width
- Gutter is the spacing between columns

**Note**: The tables below show Figma layout guide properties. Only the viewport ranges (min/max) should be tokenized in JSON; grid properties (columns, margin, gutter, layout type, column width) are Figma-specific configuration

---

### Web layout guide

> Maximum content width is capped at 1440px on screens wider than 1600px.

| Token | Range | Columns | Margin | Gutter | Layout Type | Column Width | Use |
|-------|-------|---------|--------|--------|-------------|--------------|-----|
| `layout/xs` | 320...649px | 6 | 16px | 12px | Stretch | Auto | Smartphones |
| `layout/sm` | 650...899px | 12 | 32px | 16px | Stretch | Auto | Portrait-oriented tablets |
| `layout/md` | 900...1199px | 12 | 32px | 16px | Stretch | Auto | Landscape-oriented tablets |
| `layout/lg` | 1200...1599px | 12 | 80px | 24px | Stretch | Auto | Small laptops |
| `layout/xl` | 1600...2560px | 12 | 0px | 24px | Center | 98px | Desktop monitors |
