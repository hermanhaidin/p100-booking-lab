/* Offer details — two-section panel for vehicle offer details
   Media section (hero, title, specs) + Booking section (options, pricing, CTA).
   Composes ox-choice-card-group + ox-choice-card for booking/mileage options.

   Layout: Renders only the card (media + booking). Page-level wrappers handle
   contextual placement (full-bleed background band, vertical spacing, etc.).

   Attributes:
     variant          — default | premium | guaranteed (gradient overlay)
     title            — vehicle name
     subtitle         — model description
     image            — vehicle image URL
     model-label      — "Premium brand" | "Or similar model" | "Guaranteed model"
     specs            — comma-separated, e.g. "5 seats,4 suitcases,Automatic"
     daily-integer, daily-decimal, daily-suffix — daily price parts
     total-integer, total-decimal, total-suffix — total price parts
     currency         — defaults to "$"
     included         — included features text (green strip, shown at ≤649px)
     flexible-addon-integer, flexible-addon-decimal, flexible-addon-suffix
     mileage-title, mileage-subtitle, mileage-included-label
     booking-option   — best-price | stay-flexible (current selection)

   Events (bubbles, composed):
     offer-details-close         — close button clicked
     offer-details-next          — continue/next button clicked
     offer-details-option-change — { bookingOption } — booking option radio changed

   API: <ox-offer-details variant="premium" title="BMW 3 Series"
          model-label="Premium brand" specs="5 seats,4 suitcases,Automatic" ...>
        </ox-offer-details> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --offer-details-media-min-height: 370px;
    background-color: var(--color-surface-container);
    border-radius: var(--radius-lg);
    box-shadow: var(--elevation-large);
    color: var(--color-content-primary);
    display: grid;
    grid-template-columns: 1fr;
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) { display: none; }

  /* Close / back buttons — ox-icon-button instances, absolutely positioned */
  .close-btn {
    position: absolute;
    right: var(--spacing-xs);
    top: var(--spacing-xs);
    z-index: 3;
  }

  .close-back { display: none; }
  .close-x-booking { display: none; }

  /* Media section */
  .media {
    background-color: var(--color-surface-container);
    background-image:
      linear-gradient(
        180deg,
        transparent 0%,
        transparent 70%,
        color-mix(in srgb, var(--color-global-black) 68%, transparent) 100%
      ),
      url("https://img.sixt.com/1600/6f09b0e8-6820-4ac0-bedd-5797e9814c18.jpg");
    background-position: center;
    background-size: cover;
    color: var(--color-global-white);
    display: flex;
    flex-direction: column;
    min-height: var(--offer-details-media-min-height);
    overflow: hidden;
    padding: var(--spacing-lg) var(--spacing-md);
    position: relative;
  }

  .media::before {
    content: "";
    height: 50%;
    inset: 0 0 auto;
    pointer-events: none;
    position: absolute;
  }

  :host([variant="default"]) .media::before,
  :host(:not([variant])) .media::before {
    display: none;
  }

  :host([variant="premium"]) .media::before {
    background: var(--radial-gradient-brand-top-trailing);
  }

  :host([variant="guaranteed"]) .media::before {
    background: var(--radial-gradient-gold-top-trailing);
  }

  .media-top {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xs);
    position: relative;
    text-align: center;
    z-index: 1;
  }

  .media-title, .media-subtitle { margin: 0; }

  .media-main {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-height: 220px;
    position: relative;
    z-index: 1;
  }

  .media-main img {
    aspect-ratio: 3 / 2;
    display: block;
    height: auto;
    max-width: none;
    object-fit: contain;
    width: 100%;
  }

  .media-bottom {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xs);
    margin-top: auto;
    position: relative;
    z-index: 1;
  }

  .model-badges {
    align-self: center;
    display: flex;
    gap: var(--spacing-3xs);
  }

  .specs {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3xs);
    justify-content: center;
    width: 100%;
  }

  .included-strip {
    align-items: center;
    background-color: var(--color-content-extended-success);
    color: var(--color-on-content-extended-on-success);
    display: none;
    gap: var(--spacing-3xs);
    justify-content: center;
    margin-inline: calc(-1 * var(--spacing-md));
    padding: var(--spacing-3xs) var(--spacing-xs);
    width: calc(100% + (var(--spacing-md) * 2));
  }

  .included-strip .material-symbols-outlined {
    color: var(--color-on-content-extended-on-success);
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  .included-strip > span {
    color: var(--color-on-content-extended-on-success);
  }

  /* Booking section — the host carries option-light (for the media hero),
     so prime-light tokens must be hardcoded here to prevent inheritance */
  .booking {
    --color-content-primary: #1A1A1A;
    --color-content-secondary: #656A6F;
    --color-content-tertiary: #D7DADC;
    --color-on-content-on-primary: #FFFFFF;
    --color-surface-container: #FFFFFF;
    --color-surface-secondary-container: #F4F5F6;
    --color-content-extended-success: #22C55E;
    --color-content-extended-soft-brand: #FFF2E8;
    --color-overlay-hover: #0000000D;
    --color-overlay-disabled: #FFFFFF57;
    align-content: start;
    background-color: var(--color-surface-container);
    color: var(--color-content-primary);
    display: grid;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
  }

  .section-title { margin: 0; }

  /* Choice card content overrides inside offer-details */
  .option-main {
    display: grid;
    row-gap: var(--spacing-4xs);
    min-width: 0;
  }

  .option-sub {
    color: var(--color-content-secondary);
    margin: 0;
  }

  /* Booking bottom */
  .booking-bottom {
    align-items: end;
    display: grid;
    gap: var(--spacing-sm);
  }

  .next-btn {
    width: 100%;
  }

  .desktop-price {
    display: grid;
    gap: 0;
  }

  .pricing-row {
    align-items: baseline;
    display: flex;
    gap: var(--spacing-3xs);
  }

  .price-total { margin: 0; }

  .price-link {
    align-self: flex-start;
  }

  .mobile-total { display: none; }

  .mobile-total-left {
    display: grid;
    justify-items: start;
    min-width: 0;
    row-gap: 0;
  }

  /* Responsive: mobile (< 650px) */
  @media (max-width: 649px) {
    :host {
      border-radius: 0;
    }

    .close-back {
      display: inline-flex;
      left: var(--spacing-xs);
      right: auto;
      top: var(--spacing-xs);
    }

    .close-x-media { display: none; }

    .media {
      min-height: 430px;
      padding: var(--spacing-2xl) var(--spacing-xs) 0;
    }

    .booking {
      gap: var(--spacing-xs);
      padding: var(--spacing-md) var(--spacing-xs) var(--spacing-lg);
    }

    .booking-bottom {
      align-items: stretch;
      gap: var(--spacing-xs);
      margin-top: auto;
    }

    .desktop-price { display: none; }

    .mobile-total {
      align-items: start;
      display: flex;
      justify-content: space-between;
      grid-row: 1;
    }

    .next-btn { grid-row: 2; }

    .included-strip {
      display: flex;
      margin-inline: calc(-1 * var(--spacing-xs));
      margin-top: calc(var(--spacing-sm) - var(--spacing-3xs));
      width: calc(100% + (var(--spacing-xs) * 2));
    }

  }

  /* Responsive: tablet and up (>= 900px) */
  @media (min-width: 900px) {
    .close-x-media { display: none; }
    .close-x-booking { display: inline-flex; }
  }

  /* Responsive: tablet (650px-1199px) */
  @media (min-width: 650px) and (max-width: 1199px) {
    .media { min-height: 440px; }

    .booking-bottom {
      align-items: center;
      grid-template-columns: 1fr 200px;
    }

    .next-btn {
      grid-column: 2;
      grid-row: 1;
      justify-self: end;
      width: 200px;
    }

    .desktop-price {
      grid-column: 1;
      grid-row: 1;
    }
  }

  /* Responsive: tablet landscape (900px-1199px) */
  @media (min-width: 900px) and (max-width: 1199px) {
    :host { grid-template-columns: 1fr 1.05fr; }
    .booking { position: relative; }

    .booking-bottom {
      align-items: stretch;
      grid-template-columns: 1fr;
    }

    .desktop-price { grid-column: 1; grid-row: 1; }
    .next-btn { grid-column: 1; grid-row: 2; width: 100%; }
  }

  /* Responsive: desktop (>= 1200px) */
  @media (min-width: 1200px) {
    :host { grid-template-columns: 1fr 1.05fr; }
    .booking { position: relative; grid-template-rows: auto auto auto auto 1fr auto; }
    .media-main { padding-inline: var(--spacing-md); }
    .media { min-height: 410px; }

    .booking-bottom {
      align-items: center;
      grid-template-columns: 1fr 214px;
      grid-row: 6;
      margin-top: 0;
    }

    .next-btn { grid-column: 2; grid-row: 1; }
    .desktop-price { grid-column: 1; grid-row: 1; }
  }
`);

class OXOfferDetails extends HTMLElement {
  static observedAttributes = [
    'variant', 'title', 'subtitle', 'image',
    'model-label', 'specs', 'min-age',
    'daily-integer', 'daily-decimal', 'daily-suffix',
    'total-integer', 'total-decimal', 'total-suffix',
    'currency', 'included',
    'flexible-addon-integer', 'flexible-addon-decimal', 'flexible-addon-suffix',
    'mileage-title', 'mileage-subtitle', 'mileage-included-label',
    'booking-option',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.setAttribute('data-p100-theme', 'option-light');
    this.render();
    this._listen();
  }

  attributeChangedCallback(name) {
    if (name === 'booking-option') {
      this._syncBookingSelection();
      return;
    }
    this.render();
  }

  _attr(name, fallback = '') {
    return this.getAttribute(name) ?? fallback;
  }

  _syncBookingSelection() {
    const value = this._attr('booking-option', 'best-price');
    const cards = this.shadowRoot.querySelectorAll('.booking-options ox-choice-card');
    for (const card of cards) {
      card.toggleAttribute('selected', card.getAttribute('value') === value);
    }
  }

  _esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _getSpecBadge(spec) {
    const seatMatch = spec.match(/^(\d+)\s+seats$/i);
    if (seatMatch) return { icon: 'person', label: `${seatMatch[1]} Seats` };

    const suitcaseMatch = spec.match(/^(\d+)\s+suitcases$/i);
    if (suitcaseMatch) return { icon: 'travel_luggage_and_bags', label: `${suitcaseMatch[1]} Suitcase(s)` };

    const bagsMatch = spec.match(/^(\d+)\s+bags$/i);
    if (bagsMatch) return { icon: 'travel_luggage_and_bags', label: `${bagsMatch[1]} Bag(s)` };

    if (/^automatic$/i.test(spec)) return { icon: 'hdr_auto', label: 'Automatic' };
    if (/^manual$/i.test(spec)) return { icon: 'auto_transmission', label: 'Manual' };
    if (/^electric$/i.test(spec)) return { icon: 'bolt', label: 'Electric' };
    if (/^hybrid$/i.test(spec)) return { icon: 'power', label: 'Hybrid' };
    if (/^\d+mi$/i.test(spec)) return { icon: 'battery_charging_full', label: spec };
    if (/^cables included$/i.test(spec)) return { icon: 'cable', label: 'Cables included' };
    if (/^minimum age/i.test(spec)) return { icon: 'id_card', label: spec };

    return { icon: 'info', label: spec };
  }

  _getModelPreset(modelLabel) {
    if (modelLabel === 'Premium brand') return 'premium-brand';
    if (modelLabel === 'Guaranteed model') return 'guaranteed-model';
    return 'similar-model';
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('offer-details-close', {
          bubbles: true, composed: true,
        }));
        return;
      }

      if (e.target.closest('[data-next]')) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('offer-details-next', {
          bubbles: true, composed: true,
        }));
      }
    });

    // Re-dispatch booking option change from inner choice-card-group
    this.shadowRoot.addEventListener('choice-change', (e) => {
      const group = e.target.closest('.booking-options');
      if (!group) return;
      e.stopPropagation();
      this.setAttribute('booking-option', e.detail.value);
      this.dispatchEvent(new CustomEvent('offer-details-option-change', {
        bubbles: true,
        composed: true,
        detail: { bookingOption: e.detail.value },
      }));
    });
  }

  render() {
    const title = this._attr('title');
    const subtitle = this._attr('subtitle');
    const image = this._attr('image');
    const currency = this._attr('currency', '$');

    const dailyInt = this._attr('daily-integer');
    const dailyDec = this._attr('daily-decimal');
    const dailySuf = this._attr('daily-suffix');
    const totalInt = this._attr('total-integer');
    const totalDec = this._attr('total-decimal');
    const totalSuf = this._attr('total-suffix');

    const flexInt = this._attr('flexible-addon-integer');
    const flexDec = this._attr('flexible-addon-decimal');
    const flexSuf = this._attr('flexible-addon-suffix');

    const mileageTitle = this._attr('mileage-title', 'Unlimited kilometers');
    const mileageSub = this._attr('mileage-subtitle', 'All kilometers are included in the price');
    const mileageLabel = this._attr('mileage-included-label', 'Included');

    const included = this._attr('included');
    const bookingOption = this._attr('booking-option', 'best-price');

    const modelLabel = this._attr('model-label');
    const specsRaw = this._attr('specs');
    const minAge = this._attr('min-age');
    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const isElectric = specs.some(s => /^electric$/i.test(s));
    const isHybrid = specs.some(s => /^hybrid$/i.test(s));

    let modelBadgesHtml = modelLabel
      ? `<ox-badge preset="${this._getModelPreset(modelLabel)}" icon="info">${this._esc(modelLabel)}</ox-badge>`
      : '';
    if (isElectric) {
      modelBadgesHtml += `<ox-badge preset="offer-spec" icon="bolt" filled>Electric</ox-badge>`;
    } else if (isHybrid) {
      modelBadgesHtml += `<ox-badge preset="offer-spec" icon="power" filled>Hybrid</ox-badge>`;
    }

    const detailSpecs = specs.filter(s => !/^(electric|hybrid)$/i.test(s));
    if (isElectric) {
      detailSpecs.push('Automatic');
      detailSpecs.push('Cables included');
    }
    if (minAge) {
      detailSpecs.push(`Minimum age of the youngest driver: ${minAge}`);
    }

    const specBadgesHtml = detailSpecs.map(spec => {
      const badge = this._getSpecBadge(spec);
      return `<ox-badge preset="offer-spec" icon="${this._esc(badge.icon)}" filled>${this._esc(badge.label)}</ox-badge>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <section class="media" aria-label="Vehicle details">
        <ox-icon-button class="close-btn close-back" icon="arrow_back_ios_new" label="Go back" data-close></ox-icon-button>
        <ox-icon-button class="close-btn close-x-media" icon="close" label="Close offer details" data-close></ox-icon-button>
        <div class="media-top">
          <p class="media-title text-title-medium-heavy-caps">${title}</p>
          <p class="media-subtitle text-copy-medium-regular">${subtitle}</p>
        </div>
        <div class="media-main">
          ${image ? `<img src="${image}" alt="${title}">` : ''}
        </div>
        <div class="media-bottom">
          <div class="model-badges">${modelBadgesHtml}</div>
          <div class="specs">${specBadgesHtml}</div>
          ${included ? `
          <div class="included-strip">
            <span class="material-symbols-outlined" aria-hidden="true">check</span>
            <span class="text-copy-small-heavy">${included}</span>
          </div>` : ''}
        </div>
      </section>
      <section class="booking" aria-label="Booking details">
        <ox-icon-button class="close-btn close-x-booking" icon="close" label="Close offer details" data-close></ox-icon-button>
        <p class="section-title text-copy-large-heavy-tight">Booking option</p>
        <ox-choice-card-group class="booking-options" role="radiogroup" aria-label="Booking option">
          <ox-choice-card value="best-price" ${bookingOption === 'best-price' ? 'selected' : ''} meta-text="Included" info>
            <span class="option-main">
              <span class="text-copy-large-heavy-tight">Best price</span>
              <span class="option-sub text-copy-small-regular">Free cancellation and rebooking within 24h</span>
            </span>
          </ox-choice-card>
          <ox-choice-card value="stay-flexible" ${bookingOption === 'stay-flexible' ? 'selected' : ''} price="${flexInt}${flexDec}" price-sign="+" price-currency="${currency}" price-suffix="${flexSuf}" badge-text="Popular" info>
            <span class="option-main">
              <span class="text-copy-large-heavy-tight">Stay flexible</span>
              <span class="option-sub text-copy-small-regular">Free cancellation and rebooking any time before pickup</span>
            </span>
          </ox-choice-card>
        </ox-choice-card-group>
        <p class="section-title text-copy-large-heavy-tight">Mileage</p>
        <ox-choice-card-group single aria-label="Mileage option">
          <ox-choice-card value="mileage" static selected meta-text="${mileageLabel}">
            <span class="option-main">
              <span class="text-copy-large-heavy-tight">${mileageTitle}</span>
              <span class="option-sub text-copy-small-regular">${mileageSub}</span>
            </span>
          </ox-choice-card>
        </ox-choice-card-group>
        <div class="booking-bottom">
          <ox-button class="next-btn" kind="brand" data-next>Next</ox-button>
          <div class="desktop-price">
            <div class="pricing-row">
              <ox-price class="price-total" size="large" currency="${currency}" integer="${dailyInt}" decimal="${dailyDec}" suffix="${dailySuf}" data-price="daily"></ox-price>
              <ox-price class="price-total" size="medium" regular kind="secondary" currency="${currency}" integer="${totalInt}" decimal="${totalDec}" suffix="${totalSuf}" data-price="total"></ox-price>
            </div>
            <ox-text-button class="price-link" underlined>Price details</ox-text-button>
          </div>
          <div class="mobile-total">
            <div class="mobile-total-left">
              <span class="text-title-small-heavy">Total</span>
              <ox-text-button class="price-link" underlined>Price details</ox-text-button>
            </div>
            <ox-price size="large" currency="${currency}" integer="${totalInt}" decimal="${totalDec}" data-price="mobile-total"></ox-price>
          </div>
        </div>
      </section>`;
  }
}

customElements.define('ox-offer-details', OXOfferDetails);
