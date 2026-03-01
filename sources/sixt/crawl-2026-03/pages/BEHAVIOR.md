# Booking funnel

## User flow

`home` → `offer-list` → `protection` → `add-ons` → `review-booking`


## Homepage

To reach the offer list, users select a pickup location and trip dates.

By default, the search context suggests `Munich Airport` and the nearest comfortable mid-week trip for that location (roughly two weeks out, Mon–Fri). Pickup and return time default to `12:00 PM`.

Users continue to the offer list by clicking `Show cars`.


## Offer list

To proceed to protection packages, users pick an offer (car) and click `Next` in the offer details view.

On wide screens (tablet + desktop), offer details appear below the selected offer with an accordion-style animation. On smartphones, offer details open as a full-screen bottom sheet (pushed up from the bottom edge).

In offer details, users choose whether to pay online now or later at pickup. Paying online unlocks lower prices for extras (mileage, protection, add-ons).


## Protection

By default, no protection bundle is selected.

To continue without protection, users must explicitly select the “no protection” option and click `Continue`.

The booking overview is sticky and stays visible while users scroll.


## Add-ons

By default, no add-ons are selected.

Users can select as many add-ons as they want. Once selected, an add-on appears in the booking overview.

The booking overview is sticky and stays visible while users scroll.

Users can proceed to review booking without selecting any add-ons by clicking `Continue`.


## Review your booking

### Logged out user

For logged-out users, most form fields are empty by default.

Payment methods are radio buttons, with none selected by default.

Only the flight number is optional.