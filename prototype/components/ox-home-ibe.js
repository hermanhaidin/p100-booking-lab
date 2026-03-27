/* Home IBE (Internet Booking Engine) — search card with location, dates, and CTA.
   Self-contained white card with booking mode chips and search fields.
   Fields are styled spans (no ox-text-field yet).

   Attributes:
     action      — href for "Show cars" button (defaults to ./offer-list.html)
     location    — pickup location text
     pickup-date — pickup date display text
     pickup-time — pickup time display text
     return-date — return date display text
     return-time — return time display text

   Responsive layout:
     Desktop (≥1200): 5-col grid
     Tablet (900–1199): 3-col grid with reflow
     Mobile (<900): flex column, date fields hidden

   API: <ox-home-ibe action="./offer-list.html" location="Munich Airport"
          pickup-date="Mar 16" pickup-time="12:00 PM"
          return-date="Mar 20" return-time="12:00 PM"></ox-home-ibe> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-container);
    border-radius: var(--radius-lg);
    box-shadow: var(--elevation-large);
    display: block;
    overflow: hidden;
    padding: var(--spacing-xs);
    width: 100%;
  }

  :host([hidden]) { display: none; }

  /* --- Booking chips --- */
  .booking-chips {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3xs);
    margin-bottom: var(--spacing-xs);
  }

  .booking-link {
    margin-left: auto;
  }

  .booking-link-mobile {
    display: none;
    margin-left: 0;
  }

  /* --- Search grid --- */
  .search-grid {
    align-items: end;
    column-gap: var(--spacing-xs);
    display: grid;
    grid-template-columns: 2fr auto 1fr 1fr auto;
    row-gap: var(--spacing-2xs);
  }

  /* --- Fields --- */
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5xs);
  }

  .field-label {
    color: var(--color-content-primary);
  }

  .field-value {
    align-items: center;
    border: var(--stroke-sm) solid var(--color-content-tertiary);
    border-radius: var(--radius-md);
    color: var(--color-content-primary);
    display: flex;
    gap: var(--spacing-2xs);
    height: 52px;
    padding-inline: var(--spacing-2xs);
    white-space: nowrap;
  }

  .field-value .material-symbols-outlined {
    color: var(--color-content-primary);
    font-size: 24px;
  }

  .field-part-date .material-symbols-outlined {
    font-size: 24px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  }

  .pickup-icon-search {
    display: none;
  }

  .field-value-split {
    gap: 0;
    padding: 0;
  }

  .field-part {
    align-items: center;
    color: var(--color-content-primary);
    display: inline-flex;
    flex: 1 1 50%;
    height: 100%;
  }

  .field-part-date {
    gap: var(--spacing-2xs);
    padding: 0 var(--spacing-2xs);
  }

  .field-part-time {
    border-left: var(--stroke-sm) solid var(--color-content-tertiary);
    padding: 0 var(--spacing-2xs);
  }

  /* --- Utility elements --- */
  .search-return-location {
    align-self: end;
    height: 52px;
  }

  .corp-link {
    align-self: flex-start;
    grid-column: 1;
    grid-row: 2;
  }

  /* --- Desktop (≥1200) --- */
  @media (min-width: 1200px) {
    .show-cars-btn {
      min-width: 200px;
    }
  }

  /* --- Tablet (900–1199) --- */
  @media (min-width: 900px) and (max-width: 1199px) {
    .search-grid {
      grid-template-columns: 1fr 1fr auto;
    }

    .search-grid > .field:first-of-type {
      grid-column: 1 / span 2;
      grid-row: 1;
    }

    .search-return-location {
      grid-column: 3;
      grid-row: 1;
      justify-self: stretch;
      width: 100%;
    }

    .search-grid > .field:nth-of-type(2) {
      grid-column: 1;
      grid-row: 2;
    }

    .search-grid > .field:nth-of-type(3) {
      grid-column: 2;
      grid-row: 2;
    }

    .corp-link {
      grid-column: 1;
      grid-row: 3;
    }

    .show-cars-btn {
      grid-column: 3;
      grid-row: 2;
      justify-self: stretch;
      width: 100%;
    }
  }

  /* --- Mobile (<900) --- */
  @media (max-width: 899px) {
    .search-grid {
      align-items: stretch;
      display: flex;
      flex-direction: column;
      row-gap: var(--spacing-xs);
    }

    .booking-chips .booking-link {
      display: none;
    }

    .search-grid > .field:first-of-type {
      order: 1;
    }

    .search-grid > .field:first-of-type .field-label {
      display: none;
    }

    .pickup-icon-flight {
      display: none;
    }

    .pickup-icon-search {
      display: inline-flex;
    }

    .search-grid > .field:nth-of-type(2),
    .search-grid > .field:nth-of-type(3),
    .search-return-location {
      display: none;
    }

    .show-cars-btn {
      order: 2;
      width: 100%;
    }

    .booking-link-mobile {
      align-self: center;
      display: inline-flex;
      height: auto;
      order: 3;
    }

    .corp-link {
      align-self: center;
      grid-column: auto;
      grid-row: auto;
      order: 4;
    }
  }
`);

class OxHomeIbe extends HTMLElement {
  static observedAttributes = [
    'action', 'location',
    'pickup-date', 'pickup-time',
    'return-date', 'return-time',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._initChipSelection();
  }

  attributeChangedCallback() { this.render(); }

  _initChipSelection() {
    this.shadowRoot.addEventListener('click', (e) => {
      const chip = e.target.closest('ox-chip[data-chip]');
      if (!chip) return;
      const chips = this.shadowRoot.querySelectorAll('ox-chip[data-chip]');
      chips.forEach((c) => c.toggleAttribute('selected', c === chip));
    });
  }

  render() {
    const action = this.getAttribute('action') || './offer-list.html';
    const location = this.getAttribute('location') || '';
    const pickupDate = this.getAttribute('pickup-date') || '';
    const pickupTime = this.getAttribute('pickup-time') || '';
    const returnDate = this.getAttribute('return-date') || '';
    const returnTime = this.getAttribute('return-time') || '';

    this.shadowRoot.innerHTML = `
      <div class="booking-chips" role="tablist" aria-label="Booking mode">
        <ox-chip size="small" icon="directions_car" filled selected data-chip="cars">Cars</ox-chip>
        <ox-chip size="small" icon="local_shipping" filled data-chip="trucks">Trucks</ox-chip>
        <ox-chip size="small" icon="update" data-chip="subscription">Subscription</ox-chip>
        <ox-text-button kind="primary" size="small" underlined href="#" class="booking-link">View / edit my booking</ox-text-button>
      </div>

      <div class="search-grid">
        <label class="field">
          <span class="field-label text-copy-small-heavy">Pickup &amp; return</span>
          <span class="field-value text-copy-large-regular">
            <span class="material-symbols-outlined pickup-icon pickup-icon-flight" aria-hidden="true">flight</span>
            <span class="material-symbols-outlined pickup-icon pickup-icon-search" aria-hidden="true">search</span>
            ${location}
          </span>
        </label>

        <ox-text-button kind="primary" size="small" underlined href="#" class="corp-link">Apply corporate rate</ox-text-button>

        <ox-text-button kind="secondary" size="large" icon="add" class="search-return-location">Different return location</ox-text-button>

        <label class="field">
          <span class="field-label text-copy-small-heavy">Pickup date</span>
          <span class="field-value field-value-split text-copy-large-regular">
            <span class="field-part field-part-date">
              <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
              ${pickupDate}
            </span>
            <span class="field-part field-part-time">${pickupTime}</span>
          </span>
        </label>

        <label class="field">
          <span class="field-label text-copy-small-heavy">Return date</span>
          <span class="field-value field-value-split text-copy-large-regular">
            <span class="field-part field-part-date">
              <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
              ${returnDate}
            </span>
            <span class="field-part field-part-time">${returnTime}</span>
          </span>
        </label>

        <ox-button class="show-cars-btn" kind="brand" size="large" href="${action}">Show cars</ox-button>
        <ox-text-button kind="primary" size="small" underlined href="#" class="booking-link booking-link-mobile">View / edit my booking</ox-text-button>
      </div>`;
  }
}

customElements.define('ox-home-ibe', OxHomeIbe);
