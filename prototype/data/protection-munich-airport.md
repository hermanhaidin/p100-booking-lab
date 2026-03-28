# Protection page content

## Metadata

- **Location**: `Munich Airport`
- **Dates**: `Mar 16 | 12:00 PM - Mar 20 | 12:00 PM`
- **Currency**: `USD`
- **Base total price**: passed in from offer-list via URL param (e.g. `$649.72` for BMW 3 Series Touring)

> **Note:** Protection package prices and the Basic deductible are computed at runtime from the base total price.
> Do not hardcode prices here — see Pricing logic in CLAUDE.md.


## Search context (header)

- **Location**: `Munich Airport`
- **Dates**: `Mar 16 | 12:00 PM – Mar 20 | 12:00 PM`
- **Language / currency**: `EN | $`
- **Account**: `Log in | Register`


## Page headline

- **Headline**: `Which protection package do you need?`
- **Top summary**:
    - Label: `Total: $649.72` (example; actual value passed from offer-list)
    - Text button: `Price details`
    - Primary CTA: `Continue`


## Info notice (banner)

- **Notice text**: `Drivers must have held their driver's license for at least 1 year(s) for this vehicle`


## Protection packages (radio buttons, none selected by default)

- **Package 1**
    - Option ID: `none`
    - Title: `No extra protection`
    - Deductible: `Deductible: up to full vehicle value`
    - Coverage:
        - `Collision damages, scratches, bumps & theft` — included
        - `Tire, windshield & windows` — included
        - `Interior damage (e.g. spills)` — NOT included
        - `Roadside help for common mobility issues (e.g. loss of keys)` — NOT included
    - Footer label: `Included`

- **Package 2**
    - Option ID: `basic`
    - Title: `Basic Protection`
    - Deductible: `Deductible: up to 2× total rental price` (computed at runtime)
    - Coverage:
        - `Collision damages, scratches, bumps & theft` — included
        - `Tire, windshield & windows` — included
        - `Interior damage (e.g. spills)` — NOT included
        - `Roadside help for common mobility issues (e.g. loss of keys)` — NOT included
    - Price per day: `5% of total rental price / day` (computed at runtime)

- **Package 3**
    - Option ID: `smart`
    - Title: `Smart Protection`
    - Discount badge: `−40% online discount`
    - Deductible: `No deductible`
    - Coverage:
        - `Collision damages, scratches, bumps & theft` — included
        - `Tire, windshield & windows` — included
        - `Interior damage (e.g. spills)` — included
        - `Roadside help for common mobility issues (e.g. loss of keys)` — included
    - Price per day: `7.5% of total rental price / day` (computed at runtime; displayed with strikethrough original at smartDaily / 0.6)

- **Package 4**
    - Option ID: `all-inclusive`
    - Title: `All Inclusive Protection`
    - Discount badge: `−50% online discount`
    - Deductible: `No deductible`
    - Coverage:
        - `Collision damages, scratches, bumps & theft` — included
        - `Tire, windshield & windows` — included
        - `Interior damage (e.g. spills)` — included
        - `Roadside help for common mobility issues (e.g. loss of keys)` — included
    - Price per day: `8.5% of total rental price / day` (computed at runtime; displayed with strikethrough original at allInclusiveDaily / 0.5)


## Booking overview

- **Section title**: `Your booking overview:`
- **Included items**:
    - `Third party insurance`
    - `24/7 Breakdown assistance`
    - `Tires suitable for winter`
    - `Unlimited kilometers`
    - `Booking option: Best price - Pay now, cancel and rebook for a fee`


## Footer

- **Links**: `Help`, `Rental information`, `SIXT for business`, `SIXT partners`, `SIXT Magazine`, `Privacy`, `Do not share or sell my personal information`, `Terms & conditions`, `Customers with disabilities`, `Cookie-Settings`
- **Copyright**: `© Sixt 2026`
