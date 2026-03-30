# Review booking page content

## Metadata

- **Currency**: `USD`
- **Total price**: passed in from add-ons via URL param (e.g. `$1,171.07` for BMW 3 Series Touring with All Inclusive Protection + add-ons)

> **Note:** Total price and booking summary values are populated at runtime from URL params.
> Do not hardcode prices here — they flow from the prior funnel pages.


## Search context (header)

- **Location**: `Munich Airport`
- **Dates**: `Mar 16 | 12:00 PM – Mar 20 | 12:00 PM`
- **Language / currency**: `EN | $`
- **Account**: `Log in | Register`


## Page headline

- **Back link**: `‹` (links to add-ons page)
- **Headline**: `REVIEW YOUR BOOKING`
- **Top summary**:
    - Label: `Total: $1,171.07` (example; actual value from URL param)
    - Text button: `Price details`


## Driver details (form)

- **Section title**: `Driver details`

- **Field 1**
    - Label: `Email`
    - Input type: `email`
    - Autocomplete: `email`
    - Required: yes
    - Layout: full width

- **Field 2**
    - Label: `First name`
    - Input type: `text`
    - Autocomplete: `given-name`
    - Required: yes
    - Layout: half width (left)

- **Field 3**
    - Label: `Last name`
    - Input type: `text`
    - Autocomplete: `family-name`
    - Required: yes
    - Layout: half width (right)

- **Field 4** (composite — country code + phone number)
    - Country code:
        - Input type: `combobox`
        - Autocomplete: `tel-country-code`
        - Required: yes
        - Default: `🇺🇸 +1`
        - Most popular: `🇺🇸 United States +1`, `🇬🇧 United Kingdom +44`, `🇨🇭 Switzerland +41`, `🇪🇸 Spain +34`, `🇳🇱 Netherlands +31`, `🇮🇹 Italy +39`, `🇩🇪 Germany +49`, `🇫🇷 France +33`, `🇨🇦 Canada +1`, `🇧🇪 Belgium +32`, `🇦🇹 Austria +43`
        - Behavior: full alphabetical list shown on open; typing filters results
    - Phone number:
        - Label: `Phone number`
        - Input type: `tel`
        - Autocomplete: `tel-national`
        - Max length: 15
        - Required: yes
        - Layout: remaining width after country code

- **Age checkbox**
    - Label: `I am 23 years of age or older`
    - Input type: `checkbox`
    - Checked by default: yes

- **Date of birth** (visible only when age checkbox is unchecked)
    - Label: `Date of birth`
    - Input type: `text`
    - Autocomplete: `bday`
    - Format: `DD/MM/YYYY`
    - Required: yes (when visible)
    - Layout: half width (left)

- **Notice** (banner)
    - Icon: `info`
    - Text: `Drivers must have held their driver's license for at least 1 year(s) for this vehicle`


## Payment methods (radio tiles, none selected by default)

- **Section title**: `Payment methods`

- **Method 1**
    - ID: `credit-card`
    - Label: `Credit or debit card`
    - Trailing icons: card brand logos (Visa, Mastercard, Amex)
    - Expanded content (form fields):
        - Card number:
            - Label: `Card number`
            - Input type: `text`
            - Autocomplete: `cc-number`
            - Max length: 16 digits
            - Format: groups of 4 digits separated by spaces (e.g. `5168 1111 5168 1111`, auto-formatted)
            - Required: yes
            - Layout: full width
        - Cardholder name:
            - Label: `Cardholder name`
            - Input type: `text`
            - Autocomplete: `cc-name`
            - Required: yes
            - Layout: full width
        - Expiration date:
            - Label: `Expiration date`
            - Input type: `text`
            - Autocomplete: `cc-exp`
            - Format: `MM/YY` (slash is auto-inserted after two digits)
            - Required: yes
            - Layout: half width (left)
        - CVV:
            - Label: `CVV`
            - Input type: `text`
            - Autocomplete: `cc-csc`
            - Max length: 4
            - Required: yes
            - Trailing icon: `help` (tooltip)
            - Layout: half width (right)
    - Accepted card icons (in order):
        - `payment_american_express_color.svg` (custom SVG)
        - `payment_mastercard_color.svg` (custom SVG)
        - `payment_discover_color.svg` (custom SVG)
        - `payment_jcb_color.svg` (custom SVG)
        - `payment_visa_color.svg` (custom SVG)
        - `payment_diners_club_color.svg` (custom SVG)
    - Notice: `Please be aware that a credit or debit card must be presented at pickup to secure your rental. The renter needs to be the card holder.`

- **Method 2**
    - ID: `paypal`
    - Label: `PayPal`
    - Trailing icon: PayPal logo
    - Expanded content (text only):
        - `After clicking "Pay and book", you'll be redirected to PayPal to complete your payment. Please be aware that the renter needs to be the PayPal account holder. Additionally, a credit or debit card must be presented in the renter's name at pickup to secure the rental.`

- **Method 3**
    - ID: `apple-pay`
    - Label: `Apple Pay`
    - Trailing icon: Apple Pay mark
    - Expanded content (text only):
        - `By selecting "Pay and book", you'll complete your payment securely through Apple Pay. Please be aware that a credit or debit card must be presented in the renter's name at pickup to secure the rental.`

- **Pay Later prompt** (always visible below all methods)
    - Link text (red): `No payment method on hand?`
    - Helper text: `Switch to Pay Later and have free cancellation included for just $ 0.00 more.`
    - Trailing icon: `info`


## Invoice address (form)

- **Section title**: `Invoice address`

- **Field 1**
    - Label: `Company (optional)`
    - Input type: `text`
    - Autocomplete: `organization`
    - Required: no
    - Layout: full width

- **Field 2**
    - Label: `Country`
    - Input type: `combobox`
    - Autocomplete: `country-name`
    - Required: yes
    - Default: `🇺🇸 United States`
    - Shows flag icon + country name
    - Layout: full width

- **Field 3**
    - Label: `Street address`
    - Input type: `text`
    - Autocomplete: `street-address`
    - Required: yes
    - Layout: full width

- **Field 4**
    - Label: `Zip`
    - Input type: `text`
    - Autocomplete: `postal-code`
    - Max length: 10
    - Required: yes
    - Layout: half width (left)

- **Field 5**
    - Label: `City`
    - Input type: `text`
    - Autocomplete: `address-level2`
    - Required: yes
    - Layout: half width (right)

- **Field 6**
    - Label: `State`
    - Input type: `combobox`
    - Autocomplete: `address-level1`
    - Required: yes
    - Layout: full width
    - Visible only when country is `United States`


## Flight number

- **Section title**: `Flight number`
- **Info text**: `Add your flight number so we can track delays and have your car ready when you land. No need to worry or call ahead if your flight is running late.`
- **Field**:
    - Label: `Flight number (optional)`
    - Input type: `text`
    - Autocomplete: `off`
    - Max length: 10
    - Required: no
    - Layout: full width


## Booking summary (sidebar)

> **Note:** All sidebar values are populated from URL params at runtime.
> Example values shown below for reference only.

- **Vehicle card**
    - Title: `BMW 3 Series Touring`
    - Subtitle: `or similar | GWAR`
    - Image: (from URL param)

- **Pickup and return**
    - Pickup label: `Pickup`
    - Pickup location: `Munich Airport`
    - Pickup date: `Mon, Mar 16, 2026 | 12:00 PM`
    - Return label: `Return`
    - Return location: `Munich Airport`
    - Return date: `Fri, Mar 20, 2026 | 12:00 PM`

- **Payment option**
    - Label: `Pay now`
    - Badge: `BEST PRICE`
    - Helper: `Lowest price available for your rental`

- **What's included**
    - `Third party insurance`
    - `24/7 Breakdown assistance`
    - `Tires suitable for winter`
    - `Unlimited kilometers`
    - `All Inclusive Protection - No deductible`
    - `1 Child seat`
    - `Refuelling/recharging service`
    - `1 Additional driver`
    - `Comfort features`


## Total + fine print

- **Section title**: `Total`
- **Subhead**: `Amount you will pay`
- **Primary amount**: `$1,171.07` (USD, from URL param)
- **Secondary amount**: `€992.01` (EUR equivalent, computed at runtime)
- **Link**: `Price details`

- **Deposit note**: `Refundable deposit: An additional € 500 security deposit will be blocked on your card at the pickup counter and released within a few days of the vehicle's return.`

- **Prepaid info heading**: `IMPORTANT INFORMATION about your PREPAID reservation:`
- **Prepaid info text**: `Prepaid rates are subject to the following cancellation, rebooking, and no-show policies. Please note that the charges listed below will never exceed the total prepaid amount:`
- **Policies**:
    - `Booking cancellation: An amount of $98.24 will be charged to cancel the booking (possible until the agreed pickup time). Any remaining prepaid amount over $98.24 will be refunded.`
    - `No show: No refund will be issued in case of failure to pick up your vehicle (no show) or cancellation after scheduled pick up time.`
    - `No refund for unused rental days: No refund or credit will be issued for any unused rental days (due to late pickup or early return) once the vehicle has been picked up.`

- **Consent text**: `I have read and accept the Rental Information, the Terms and Conditions, and the Privacy Policy and acknowledge that I am booking a prepaid rate, where the total reservation rental price is immediately charged to the payment method I provide.`

- **Marketing text**: `After completing your reservation, we may send you information about our own similar services by email and text message. You can object to this at any time free of charge by sending an email to sixtcard@sixt.com`

- **Primary CTA**: `Pay and Book` (full width, brand button)


## Validation

- **Required field error message**: `Invalid entry or required field`
- **Error styling**: red border on field + red error icon + message text below field
- All fields marked `Required: yes` above show this error when empty on form submission


## Footer

- **Links**: `Help`, `Rental information`, `SIXT for business`, `SIXT partners`, `SIXT Magazine`, `Privacy`, `Do not share or sell my personal information`, `Terms & conditions`, `Customers with disabilities`, `Cookie-Settings`
- **Copyright**: `© Sixt 2026`
