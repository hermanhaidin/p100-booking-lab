# Data & Content

## Data files

Content data lives in `prototype/data/`. Each page's data is self-contained in a single markdown file.

**Naming convention:**
- `{page}-{location-slug}.md` for location-specific pages (e.g. `offer-list-munich-airport.md`)
- `{page}.md` for global pages (e.g. `home.md`)

**Current data files:**

| File | Page |
|------|------|
| `home.md` | Home |
| `offer-list-munich-airport.md` | Offer list |
| `protection-munich-airport.md` | Protection |
| `add-ons-munich-airport.md` | Add-ons |
| `review-booking.md` | Review booking |

**Offer list data structure** — each file contains:
- Metadata (studio background URL)
- Search context (location, dates, currency)
- Page headline and quick filters
- Offers with inline image URLs, specs, pricing, badges
- Banner with image, title, subtitle, CTA
- Footer disclaimer and links

**Current scope:** Single happy path — Munich Airport, Mar 16–20, USD. Pick-up location and trip dates are not yet configurable in the UI.

**Multi-location support (planned):** To add a new location:
1. Create `offer-list-{location-slug}.md` with location-specific offers and images
2. Update the `data-content-src` attribute in the HTML to point to the new file
3. Each file is fully self-contained — no shared asset maps needed

## Pricing logic

All prices in the funnel are derived at runtime from the selected offer's daily price and total price. **Never hardcode price values in HTML or data files** — they are computed from these formulas.

**Booking options (`offer-list.js`):**
- Stay flexible surcharge: +5% of daily price per day (added to both daily and total display)
- Limited mileage extra km charge: 0.5% of daily price per km

**Protection packages (`protection.js`)** — calculated from the total rental price passed via URL param:

| Package | Daily price | Displayed discount |
|---------|------------|-------------------|
| Basic | 5% of total | — |
| Smart | 7.5% of total | −40% (original shown as `smartDaily / 0.6`) |
| All Inclusive | 8.5% of total | −50% (original shown as `allInclusiveDaily / 0.5`) |

- Basic deductible: 2× total rental price

## Creating new pages

1. Copy `prototype/base.html` as your starting point — adjust relative paths for pages in `prototype/pages/` (e.g. `../styles/all.css`, `../components/index.js`)
2. Create page-specific CSS in `prototype/styles/pages/{page-name}.css`
3. Create page script in `prototype/scripts/pages/{page-name}.js`
4. Add `<link rel="stylesheet" href="../styles/pages/{page-name}.css">` and `<script type="module" src="../scripts/pages/{page-name}.js"></script>` to the HTML
5. Reference `offer-list.html` and `protection.html` as examples of the correct pattern
