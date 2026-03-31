/* Booking summary sidebar card — review-booking page
   Rich card showing vehicle, pickup/return details, payment option, and included items.
   Desktop: full vertical card. Mobile: compact bar with expandable details.

   Attributes:
     vehicle-title    — vehicle name
     vehicle-subtitle — "or similar | GWAR"
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
          vehicle-subtitle="or similar | GWAR"
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

  /* Vehicle hero image area */
  .vehicle-hero {
    align-items: center;
    background-color: var(--color-global-black);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    min-height: 180px;
    padding: var(--spacing-xs);
    position: relative;
  }

  .vehicle-img {
    display: block;
    max-height: 140px;
    max-width: 100%;
    object-fit: contain;
    position: relative;
  }

  .vehicle-info {
    padding: var(--spacing-xs);
  }

  .vehicle-title, .vehicle-subtitle {
    margin: 0;
  }

  .vehicle-subtitle {
    color: var(--color-content-secondary);
  }

  .divider {
    border: 0;
    border-top: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    margin: 0;
  }

  .section {
    padding: var(--spacing-xs);
  }

  .section-heading {
    margin: 0 0 var(--spacing-3xs);
  }

  .location-row {
    display: flex;
    gap: var(--spacing-3xs);
  }

  .location-row + .location-row {
    margin-top: var(--spacing-3xs);
  }

  .location-label {
    margin: 0;
  }

  .location-info p {
    margin: 0;
  }

  .pay-row {
    align-items: center;
    display: flex;
    gap: var(--spacing-3xs);
  }

  .pay-helper {
    color: var(--color-content-secondary);
    margin: var(--spacing-4xs) 0 0;
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
    gap: var(--spacing-3xs);
    grid-template-columns: 60px 1fr auto;
    padding: var(--spacing-xs);
  }

  .compact-img {
    height: 40px;
    object-fit: contain;
    width: 60px;
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
    align-items: center;
    background: none;
    border: 0;
    color: var(--color-content-primary);
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-4xs);
    padding: 0;
  }

  .compact-arrow {
    font-size: 16px;
    transition: transform 200ms ease;
  }

  :host([expanded]) .compact-arrow {
    transform: rotate(180deg);
  }

  /* --- Responsive --- */
  @media (max-width: 899px) {
    .compact-bar {
      display: grid;
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

    const heroBgStyle = studioBg
      ? `background-image: url('${studioBg}');`
      : '';

    this.shadowRoot.innerHTML = `
      <!-- Compact bar (mobile only) -->
      <div class="compact-bar">
        <img class="compact-img" src="${vehicleImage}" alt="">
        <div class="compact-info">
          <span class="compact-title text-copy-medium-heavy-tight">${vehicleTitle}</span>
          <span class="compact-subtitle text-copy-small-regular">${vehicleSubtitle}</span>
        </div>
        <div class="compact-trailing">
          <span class="compact-price text-copy-large-heavy-tight">${totalPrice}</span>
          <button type="button" class="compact-toggle text-copy-small-heavy">
            Details <span class="material-symbols-outlined compact-arrow">expand_more</span>
          </button>
        </div>
      </div>

      <!-- Full content (always visible on desktop, toggle on mobile) -->
      <div class="full">
        <div class="vehicle-hero" style="${heroBgStyle}">
          <img class="vehicle-img" src="${vehicleImage}" alt="${vehicleTitle}">
        </div>
        <div class="vehicle-info">
          <p class="text-copy-large-heavy-tight vehicle-title">${vehicleTitle}</p>
          <p class="text-copy-small-regular vehicle-subtitle">${vehicleSubtitle}</p>
        </div>
        <hr class="divider">
        <div class="section">
          <p class="section-heading text-copy-medium-heavy-tight">Pickup and return</p>
          <div class="location-row">
            <div class="location-info">
              <p class="location-label text-copy-small-heavy">Pickup</p>
              <p class="text-copy-medium-regular">${pickupLocation}</p>
              <p class="text-copy-small-regular">${pickupDate}</p>
            </div>
          </div>
          <div class="location-row">
            <div class="location-info">
              <p class="location-label text-copy-small-heavy">Return</p>
              <p class="text-copy-medium-regular">${returnLocation}</p>
              <p class="text-copy-small-regular">${returnDate}</p>
            </div>
          </div>
        </div>
        <hr class="divider">
        <div class="section">
          <div class="pay-row">
            <span class="text-copy-medium-regular">${paymentLabel}</span>
            ${paymentBadge ? `<ox-badge kind="brand" variant="solid">${paymentBadge}</ox-badge>` : ''}
          </div>
          <p class="text-copy-small-regular pay-helper">Lowest price available for your rental</p>
        </div>
        <hr class="divider">
        <div class="section">
          <p class="section-heading text-copy-medium-heavy-tight">What's included</p>
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
