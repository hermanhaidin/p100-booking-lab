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

**Currency conversion (`review-booking.js`):**
- Static rate: 1 USD = 0.87 EUR (`EUR_RATE` constant)
- Used only in the Total block to show the EUR equivalent of the USD total

**Booking options (`offer-list.js`):**
- Stay flexible surcharge: +5% of daily price per day (added to both daily and total display)
- Limited mileage extra km charge: 0.5% of daily price per km

**Review booking — Pay now vs Stay flexible (`review-booking.js`):**

The `bookingOption` URL param (`"best-price"` or `"stay-flexible"`) controls two distinct layouts:

| Section | Best price | Stay flexible |
|---------|-----------|---------------|
| Payment methods | Shown | **Hidden** |
| Invoice address | **Hidden** | **Hidden** |
| Fine print | Full (cancellation policy + prepaid terms) | Short (deposit + consent only) |
| CTA button | "Pay and Book" | "Book" |
| Nudge location | Inside payment methods section | Between Price details and fine print |
| Nudge title | "No payment method on hand?" | "Want to save $XX.XX?" |
| Nudge CTA | "Switch to Pay Later" | "Switch to Pay Now" |
| Nudge body | "and have free cancellation included for just $XX.XX more." | "and save on your total." |

**Nudge price delta** — same dollar amount in both directions, calculated in `review-booking.js`:
```js
// offerDaily for stay-flexible already includes the +5% surcharge, so back-calculate base:
const baseDailyForNudge = bookingOption === "stay-flexible" ? offerDaily / 1.05 : offerDaily;
const flexibleSurcharge = baseDailyForNudge * 0.05 * rentalDays;
```

Form validation skips payment method, CC fields, invoice address, and state for `stay-flexible`.

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
