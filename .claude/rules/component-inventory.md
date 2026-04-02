# Component Inventory

All components are registered via `prototype/components/index.js`. Check each component file's header comment for the full attribute API.

| Tag | File | Usage example |
|-----|------|---------------|
| `ox-add-on-card` | ox-add-on-card.js | `<ox-add-on-card addon-id="gps" title="GPS" price="10.91" price-suffix="/ day" icon="directions_car" details="Description..." control-type="switch"></ox-add-on-card>` |
| `ox-badge` | ox-badge.js | `<ox-badge kind="brand" variant="solid" icon="star" preset="hot-offer-promo">Hot offer</ox-badge>` |
| `ox-banner` | ox-banner.js | `<ox-banner kind="info" icon="info" title="Heading" dismissible>Body text</ox-banner>` |
| `ox-booking-footer` | ox-booking-footer.js | `<ox-booking-footer><ox-link slot="link">Help</ox-link><span slot="copyright">&copy; Sixt 2026</span></ox-booking-footer>` |
| `ox-booking-header` | ox-booking-header.js | `<ox-booking-header location="Munich Airport" dates="Mar 26 – Mar 30" variant="step" step-title="Protection"></ox-booking-header>` |
| `ox-booking-overview` | ox-booking-overview.js | `<ox-booking-overview title="Your booking overview:"><ox-list-item icon="check">Item</ox-list-item></ox-booking-overview>` |
| `ox-booking-summary` | ox-booking-summary.js | `<ox-booking-summary vehicle-title="BMW 3 Series" vehicle-image="url" studio-bg="url" pickup-location="Munich Airport" pickup-date="Mar 26, 10:00" return-location="Munich Airport" return-date="Mar 30, 10:00" payment-label="Pay now" payment-badge="BEST PRICE"></ox-booking-summary>` |
| `ox-button` | ox-button.js | `<ox-button kind="brand" size="large" variant="solid" icon="arrow_forward" href="./next.html">Continue</ox-button>` |
| `ox-carousel` | ox-carousel.js | `<ox-carousel cards-per-view="1" cards-per-view-md="2" gap="xs" prev-label="Previous" next-label="Next" dot-label="Go to slide {n}"><article>Slide</article></ox-carousel>` |
| `ox-checkbox` | ox-checkbox.js | `<ox-checkbox value="age-23" checked disabled error></ox-checkbox>` |
| `ox-chip` | ox-chip.js | `<ox-chip size="small" icon="tune" preset="dropdown" selected>Filters</ox-chip>` |
| `ox-choice-card` | ox-choice-card.js | `<ox-choice-card value="best-price" selected>Best price</ox-choice-card>` |
| `ox-choice-card-group` | ox-choice-card-group.js | `<ox-choice-card-group><ox-choice-card value="a">A</ox-choice-card></ox-choice-card-group>` |
| `ox-combobox` | ox-combobox.js | `<ox-combobox label="Country" value="US" required dropdown-width="400px"></ox-combobox>` |
| `ox-dialog` | ox-dialog.js | `<ox-dialog heading="Title" subtitle="..." size="small|medium|full" open><div slot="body">...</div><div slot="footer">...</div></ox-dialog>` |
| `ox-floating-button` | ox-floating-button.js | `<ox-floating-button size="medium" content="icon-only" icon="chevron_left" label="Previous"></ox-floating-button>` |
| `ox-home-footer` | ox-home-footer.js | `<ox-home-footer></ox-home-footer>` |
| `ox-home-header` | ox-home-header.js | `<ox-home-header logo-src="../assets/logos/sixt_rent_the_car_on_dark.svg"></ox-home-header>` |
| `ox-home-ibe` | ox-home-ibe.js | `<ox-home-ibe action="./offer-list.html" location="Munich Airport" pickup-date="Mar 26" pickup-time="10:00" return-date="Mar 30" return-time="10:00"></ox-home-ibe>` |
| `ox-icon-button` | ox-icon-button.js | `<ox-icon-button kind="primary" size="large" icon="close" label="Close"></ox-icon-button>` |
| `ox-link` | ox-link.js | `<ox-link href="#" kind="primary" underlined>Link text</ox-link>` |
| `ox-list-item` | ox-list-item.js | `<ox-list-item kind="primary" size="medium" icon="check" trailing-icon="info" trailing-label="More info">Label</ox-list-item>` |
| `ox-navbar` | ox-navbar.js | `<ox-navbar heading="Title" subtitle="..." leading="back|close|none" collapsed no-sticky></ox-navbar>` |
| `ox-offer-banner` | ox-offer-banner.js | `<ox-offer-banner title="Headline" subtitle="Body" cta-text="Learn more" image="url" href="#"></ox-offer-banner>` |
| `ox-offer-card` | ox-offer-card.js | `<ox-offer-card variant="premium" title="BMW 3 Series" image="url" daily-price="71.27" specs="..."></ox-offer-card>` |
| `ox-offer-details` | ox-offer-details.js | `<ox-offer-details variant="default" title="Vehicle name" image="url"></ox-offer-details>` |
| `ox-payment-method` | ox-payment-method.js | `<ox-payment-method value="credit-card" label="Credit or debit card" trailing-icon="credit_card" selected><div slot="content">Expanded content</div></ox-payment-method>` |
| `ox-payment-method-group` | ox-payment-method-group.js | `<ox-payment-method-group><ox-payment-method value="credit-card" label="Credit or debit card"></ox-payment-method></ox-payment-method-group>` |
| `ox-price` | ox-price.js | `<ox-price kind="brand" size="large" currency="$" integer="71" decimal=".27" suffix="/ day"></ox-price>` |
| `ox-protection-card` | ox-protection-card.js | `<ox-protection-card option-id="smart" title="Smart" stars="2" deductible="€950"></ox-protection-card>` |
| `ox-protection-group` | ox-protection-group.js | `<ox-protection-group><ox-protection-card ...></ox-protection-card></ox-protection-group>` |
| `ox-radio-button` | ox-radio-button.js | `<ox-radio-button value="smart" checked disabled error></ox-radio-button>` |
| `ox-segmented-control` | ox-segmented-control.js | `<ox-segmented-control><button value="a">Label A</button><button value="b">Label B</button></ox-segmented-control>` |
| `ox-separator` | ox-separator.js | `<ox-separator orientation="horizontal" size="small" contrast="low"></ox-separator>` |
| `ox-stepper` | ox-stepper.js | `<ox-stepper value="0" min="0" max="5" disabled></ox-stepper>` |
| `ox-switch` | ox-switch.js | `<ox-switch checked disabled></ox-switch>` |
| `ox-text-button` | ox-text-button.js | `<ox-text-button kind="primary" size="large" icon="help_center" trailing-icon="arrow_forward" underlined>Label</ox-text-button>` |
| `ox-text-field` | ox-text-field.js | `<ox-text-field label="Email" type="email" autocomplete="email" required error error-text="Invalid entry" trailing-icon="help"></ox-text-field>` |
