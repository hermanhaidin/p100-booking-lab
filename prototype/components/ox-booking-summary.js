/* Booking summary sidebar card — review-booking page
   Rich card showing vehicle, pickup/return details, payment option, and included items.
   Desktop: full vertical card. Mobile: compact bar with expandable details.

   Attributes:
     vehicle-title    — vehicle name
     vehicle-subtitle — "or similar"
     vehicle-image    — car image URL
     studio-bg        — dark studio background image URL
     pickup-location  — pickup location name
     pickup-date      — pickup date/time string
     return-location  — return location name
     return-date      — return date/time string
     payment-label    — e.g. "Pay now"
     payment-badge    — e.g. "BEST PRICE"
     total-price      — primary price display e.g. "$1,171.07"
     total-secondary  — secondary currency display e.g. "€992.01"
     expanded         — boolean, toggles mobile detail view

   API: <ox-booking-summary
          vehicle-title="BMW 3 Series Touring"
          vehicle-subtitle="or similar"
          vehicle-image="https://example.com/car.png"
          studio-bg="https://img.sixt.com/..."
          pickup-location="Munich Airport"
          pickup-date="Mon, Mar 16, 2026 | 12:00 PM"
          return-location="Munich Airport"
          return-date="Fri, Mar 20, 2026 | 12:00 PM"
          payment-label="Pay now"
          payment-badge="BEST PRICE"
          total-price="$1,171.07"
          total-secondary="€992.01"
        >
          <ox-list-item icon="check">Third party insurance</ox-list-item>
        </ox-booking-summary> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-secondary-container);
    border-radius: var(--radius-lg);
    display: block;
    overflow: hidden;
  }

  :host([hidden]) { display: none; }

  /* Vehicle header — compact thumb + text */
  .vehicle-header {
    align-items: center;
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
  }

  .vehicle-thumb {
    align-items: center;
    background-color: var(--color-global-black);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: var(--radius-sm);
    display: flex;
    flex-shrink: 0;
    height: 52px;
    justify-content: center;
    overflow: hidden;
    width: 64px;
  }

  .vehicle-thumb-img {
    display: block;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  .vehicle-text {
    min-width: 0;
  }

  .vehicle-title, .vehicle-subtitle {
    margin: 0;
  }

  .vehicle-subtitle {
    color: var(--color-content-secondary);
  }

  ox-separator {
    margin: 0 var(--spacing-xs);
  }

  .section {
    padding: var(--spacing-xs);
  }

  .section-heading {
    margin: 0 0 var(--spacing-xs);
  }

  /* Timeline pickup/return */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .timeline-item {
    display: flex;
    gap: var(--spacing-3xs);
  }

  .timeline-track {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 24px;
  }

  .timeline-icon {
    color: var(--color-content-primary);
    font-size: 24px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
    height: 24px;
    width: 24px;
  }

  .timeline-line {
    background-color: var(--color-content-primary);
    flex: 1;
    margin-block: var(--spacing-5xs);
    margin-bottom: calc(-1 * var(--spacing-xs) + var(--spacing-5xs));
    min-height: var(--spacing-3xs);
    width: var(--stroke-sm);
  }

  .timeline-content p {
    margin: 0;
  }

  .timeline-label {
    color: var(--color-content-secondary);
  }

  .timeline-item:last-child .timeline-content {
    padding-bottom: 0;
  }

  .pay-row {
    align-items: baseline;
    display: flex;
    gap: var(--spacing-3xs);
  }

  .pay-badge {
    color: var(--color-content-extended-brand);
  }


  .included-list {
    display: grid;
    gap: var(--spacing-2xs);
  }

  /* --- Compact bar (mobile) --- */
  .compact-bar {
    align-items: center;
    cursor: pointer;
    display: none;
    gap: var(--spacing-xs);
    grid-template-columns: 64px 1fr auto;
    padding: var(--spacing-xs);
  }

  .compact-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .compact-title, .compact-subtitle {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-subtitle {
    color: var(--color-content-secondary);
  }

  .compact-trailing {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4xs);
  }

  .compact-toggle {
    pointer-events: none;
  }

  /* --- Responsive --- */
  @media (max-width: 899px) {
    .compact-bar {
      display: grid;
    }

    .vehicle-header {
      display: none;
    }

    .vehicle-sep {
      display: none;
    }

    .full {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 300ms ease, opacity 200ms ease;
    }

    :host([expanded]) .full {
      max-height: 1200px;
      opacity: 1;
    }
  }

  @media (min-width: 900px) {
    .compact-bar {
      display: none;
    }

    .full {
      max-height: none;
      opacity: 1;
    }
  }
`);

class OxBookingSummary extends HTMLElement {
  static observedAttributes = [
    'vehicle-title', 'vehicle-subtitle', 'vehicle-image', 'studio-bg',
    'pickup-location', 'pickup-date', 'return-location', 'return-date',
    'payment-label', 'payment-badge', 'total-price', 'total-secondary',
    'expanded',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.compact-bar')
      ?.addEventListener('click', () => this.#toggle());
  }

  attributeChangedCallback() { this.render(); }

  #toggle() {
    if (this.hasAttribute('expanded')) {
      this.removeAttribute('expanded');
    } else {
      this.setAttribute('expanded', '');
    }
  }

  render() {
    const vehicleTitle    = this.getAttribute('vehicle-title') || '';
    const vehicleSubtitle = this.getAttribute('vehicle-subtitle') || '';
    const vehicleImage    = this.getAttribute('vehicle-image') || '';
    const studioBg        = this.getAttribute('studio-bg') || '';
    const pickupLocation  = this.getAttribute('pickup-location') || '';
    const pickupDate      = this.getAttribute('pickup-date') || '';
    const returnLocation  = this.getAttribute('return-location') || '';
    const returnDate      = this.getAttribute('return-date') || '';
    const paymentLabel    = this.getAttribute('payment-label') || '';
    const paymentBadge    = this.getAttribute('payment-badge') || '';
    const totalPrice      = this.getAttribute('total-price') || '';
    const totalSecondary  = this.getAttribute('total-secondary') || '';

    const thumbBgStyle = studioBg
      ? `background-image: url('${studioBg}');`
      : '';

    // Parse "$1,171.07" → { currency: "$", integer: "1,171", decimal: ".07" }
    const priceMatch = totalPrice.match(/^([^0-9]*)([0-9,]+)(\.[0-9]+)?$/);
    const priceCurrency = priceMatch ? priceMatch[1] : '';
    const priceInteger  = priceMatch ? priceMatch[2] : totalPrice;
    const priceDecimal  = priceMatch ? (priceMatch[3] || '') : '';

    this.shadowRoot.innerHTML = `
      <!-- Compact bar (mobile only) -->
      <div class="compact-bar">
        <div class="vehicle-thumb" style="${thumbBgStyle}">
          <img class="vehicle-thumb-img" src="${vehicleImage}" alt="">
        </div>
        <div class="compact-info">
          <span class="compact-title text-copy-large-heavy-tight">${vehicleTitle}</span>
          <span class="compact-subtitle text-copy-small-regular">${vehicleSubtitle}</span>
        </div>
        <div class="compact-trailing">
          <ox-price size="large" currency="${priceCurrency}" integer="${priceInteger}" decimal="${priceDecimal}"></ox-price>
          <ox-text-button class="compact-toggle" size="small" underlined trailing-icon="${this.hasAttribute('expanded') ? 'expand_less' : 'expand_more'}">Details</ox-text-button>
        </div>
      </div>

      <!-- Full content (always visible on desktop, toggle on mobile) -->
      <div class="full">
        <div class="vehicle-header">
          <div class="vehicle-thumb" style="${thumbBgStyle}">
            <img class="vehicle-thumb-img" src="${vehicleImage}" alt="${vehicleTitle}">
          </div>
          <div class="vehicle-text">
            <p class="text-copy-large-heavy-tight vehicle-title">${vehicleTitle}</p>
            <p class="text-copy-small-regular vehicle-subtitle">${vehicleSubtitle}</p>
          </div>
        </div>
        <ox-separator class="vehicle-sep" contrast="low"></ox-separator>
        <div class="section">
          <p class="section-heading text-copy-large-heavy-tight">Pickup and return</p>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-track">
                <span class="material-symbols-outlined timeline-icon">store</span>
                <div class="timeline-line"></div>
              </div>
              <div class="timeline-content">
                <p class="text-copy-small-regular timeline-label">Pickup</p>
                <p class="text-copy-medium-heavy">${pickupLocation}</p>
                <p class="text-copy-medium-regular">${pickupDate}</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-track">
                <span class="material-symbols-outlined timeline-icon">store</span>
              </div>
              <div class="timeline-content">
                <p class="text-copy-small-regular timeline-label">Return</p>
                <p class="text-copy-medium-heavy">${returnLocation}</p>
                <p class="text-copy-medium-regular">${returnDate}</p>
              </div>
            </div>
          </div>
        </div>
        <ox-separator contrast="low"></ox-separator>
        <div class="section">
          <div class="pay-row section-heading">
            <span class="text-copy-large-heavy-tight">${paymentLabel}</span>
            ${paymentBadge ? `<span class="pay-badge text-copy-small-heavy-caps">${paymentBadge}</span>` : ''}
          </div>
          <ox-list-item size="medium" icon="check">${paymentLabel === 'Stay flexible' ? 'Rebooking any time before pickup' : 'Lowest price available for your rental'}</ox-list-item>
        </div>
        <ox-separator contrast="low"></ox-separator>
        <div class="section">
          <p class="section-heading text-copy-large-heavy-tight">What's included</p>
          <div class="included-list"><slot></slot></div>
        </div>
      </div>
    `;

    // Re-attach compact bar click listener after render
    this.shadowRoot.querySelector('.compact-bar')
      ?.addEventListener('click', () => this.#toggle());
  }
}

customElements.define('ox-booking-summary', OxBookingSummary);
