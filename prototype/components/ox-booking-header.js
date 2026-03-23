/* Booking header
   Responsive header with back button, logo, search context, step title, and utility nav.
   Variants: default (search visible) | step (search hidden, title row on mobile).
   API: <ox-booking-header
          back-href="./offer-list.html"
          location="Munich Airport"
          dates="Mar 16 | 12:00 PM - Mar 20 | 12:00 PM"
          step-title="Which protection package do you need?"
          variant="step"
          theme="option-light"
          logo-src="../assets/logos/sixt_rent_the_car_on_dark.svg"
        ></ox-booking-header> */

import { baseStyles } from './shared/base-styles.js';
import { iconButtonStyles } from './shared/ox-icon-button-styles.js';
import { layoutStyles } from './shared/layout-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-canvas);
    color: var(--color-content-primary);
    display: block;
  }

  :host([hidden]) { display: none; }

  .shell {
    align-items: center;
    display: flex;
    gap: var(--spacing-xs);
    height: 64px;
  }

  /* Logo */
  .logo-link {
    display: inline-flex;
    text-decoration: none;
  }

  .logo-link:focus-visible {
    border-radius: var(--radius-sm);
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .logo {
    display: block;
    height: 32px;
    width: 56px;
  }

  /* Back + filter buttons: hidden on tablet+, shown on mobile */
  .back-btn,
  .filter-btn {
    display: none;
  }

  /* Search row: contents on tablet+, grid row on mobile */
  .search-row {
    display: contents;
  }

  /* Title row: hidden by default */
  .title-row {
    display: none;
  }

  .title-row h1 {
    margin: 0;
  }

  /* IBE search button */
  .search-btn {
    align-items: center;
    background-color: var(--color-surface-secondary-container);
    border: 0;
    border-radius: var(--radius-pill);
    box-shadow: inset 0 0 0 9999px transparent;
    color: var(--color-content-primary);
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-2xs);
    justify-content: space-between;
    max-width: 420px;
    min-height: 44px;
    min-width: 280px;
    padding: var(--spacing-4xs);
    padding-inline: var(--spacing-xs);
    text-align: left;
    transition: box-shadow 150ms ease;
  }

  .search-btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .search-btn:is(:hover, :active) {
    box-shadow: inset 0 0 0 9999px var(--color-overlay-hover);
  }

  :host([variant="step"]) .search-btn {
    display: none;
  }

  .search-copy {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .search-location,
  .search-dates {
    color: var(--color-content-primary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-edit {
    color: var(--color-content-primary);
    flex: 0 0 auto;
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  /* Utility nav */
  .utility-nav {
    align-items: center;
    display: inline-flex;
    flex-wrap: nowrap;
    gap: var(--spacing-md);
  }

  .util-text {
    align-items: center;
    color: var(--color-content-primary);
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-3xs);
    text-decoration: none;
  }

  .util-text:visited { color: var(--color-content-primary); }

  .util-text:focus-visible {
    border-radius: var(--radius-sm);
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .util-text-icon {
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  }

  .util-text-label {
    overflow-wrap: normal;
    white-space: nowrap;
  }

  .util-icon {
    align-items: center;
    border-radius: var(--radius-sm);
    color: var(--color-content-primary);
    display: none;
    height: 48px;
    justify-content: center;
    min-height: 48px;
    min-width: 48px;
    text-decoration: none;
    width: 48px;
  }

  .util-icon:visited { color: var(--color-content-primary); }

  .util-icon-person .util-icon-glyph {
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  }

  .util-icon-glyph {
    color: currentColor;
    display: block;
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  /* ---- Mobile (<650px) ---- */
  @media (max-width: 649px) {
    :host {
      --color-content-primary: var(--color-global-sixt-anthracite);
      --color-surface-canvas: var(--color-global-white);
      --color-surface-secondary-container: color-mix(in srgb, var(--color-global-white) 96%, var(--color-global-black) 4%);
      background-color: var(--color-global-white);
      color: var(--color-global-sixt-anthracite);
    }

    .shell {
      align-items: center;
      column-gap: var(--spacing-3xs);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      height: auto;
      padding-bottom: 0;
      padding-top: var(--spacing-xs);
      row-gap: var(--spacing-xs);
    }

    .back-btn {
      align-items: center;
      border-radius: var(--radius-sm);
      color: var(--color-content-primary);
      display: inline-flex;
      grid-column: 1;
      grid-row: 1;
      height: 48px;
      justify-content: center;
      justify-self: start;
      margin: -12px;
      min-height: 48px;
      min-width: 48px;
      text-decoration: none;
      width: 48px;
    }

    .back-icon {
      color: currentColor;
      display: block;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .logo-link { display: none; }

    .utility-nav {
      gap: var(--spacing-2xs);
      grid-column: 2;
      grid-row: 1;
      justify-self: end;
      margin-left: 0;
    }

    .util-text { display: none; }
    .util-icon { display: inline-flex; }

    .search-row {
      align-items: center;
      column-gap: var(--spacing-3xs);
      display: grid;
      grid-column: 1 / -1;
      grid-row: 2;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .search-btn {
      background-color: color-mix(in srgb, var(--color-global-white) 96%, var(--color-global-black) 4%);
      border-radius: var(--radius-md);
      color: var(--color-global-sixt-anthracite);
      height: 52px;
      margin-right: 0;
      max-width: none;
      min-height: 52px;
      min-width: 0;
      padding-inline: var(--spacing-2xs);
      width: 100%;
    }

    .filter-btn {
      align-items: center;
      background-color: color-mix(in srgb, var(--color-global-white) 96%, var(--color-global-black) 4%);
      border-radius: var(--radius-md);
      color: var(--color-global-sixt-anthracite);
      display: inline-flex;
      height: 52px;
      justify-content: center;
      min-height: 52px;
      min-width: 52px;
      width: 52px;
    }

    .filter-icon {
      color: currentColor;
      display: block;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    :host([variant="step"]) .title-row {
      display: block;
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .search-location,
    .search-dates,
    .search-edit {
      color: var(--color-global-sixt-anthracite);
    }
  }

  /* ---- Tablet+ (>=650) ---- */
  @media (min-width: 650px) {
    .shell {
      gap: var(--spacing-md);
    }

    .utility-nav {
      margin-left: auto;
    }

    .search-btn {
      flex: 1 1 auto;
      margin-left: 0;
      margin-right: 0;
      max-width: 560px;
      min-width: 0;
      width: 100%;
    }
  }

  /* ---- Compact tablet (650-899): language icon, login text ---- */
  @media (min-width: 650px) and (max-width: 899px) {
    .utility-nav {
      gap: var(--spacing-2xs);
    }

    .util-text-language {
      display: none;
    }

    .util-text-login {
      order: 1;
    }

    .util-icon-language {
      display: inline-flex;
      order: 0;
    }

    .util-icon-person {
      display: none;
    }
  }
`);

class OXBookingHeader extends HTMLElement {
  static observedAttributes = [
    'back-href', 'location', 'dates', 'step-title',
    'variant', 'theme', 'logo-src',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, iconButtonStyles, layoutStyles, styles];
  }

  connectedCallback() {
    this._syncTheme();
    this.render();
  }

  attributeChangedCallback(name) {
    if (name === 'theme') this._syncTheme();
    this.render();
  }

  _syncTheme() {
    const theme = this.getAttribute('theme');
    if (theme) {
      this.setAttribute('data-p100-theme', theme);
    } else {
      this.removeAttribute('data-p100-theme');
    }
  }

  render() {
    const backHref = this.getAttribute('back-href') || '#';
    const location = this.getAttribute('location') || '';
    const dates = this.getAttribute('dates') || '';
    const stepTitle = this.getAttribute('step-title') || '';
    const logoSrc = this.getAttribute('logo-src') || '../assets/logos/sixt_rent_the_car_on_dark.svg';

    const searchBtnHtml = location || dates ? `
      <button type="button" class="search-btn" aria-label="Trip context">
        <span class="search-copy">
          ${location ? `<span class="search-location text-copy-small-heavy">${location}</span>` : ''}
          ${dates ? `<span class="search-dates text-copy-small-regular">${dates}</span>` : ''}
        </span>
        <span class="material-symbols-outlined search-edit" aria-hidden="true">edit</span>
      </button>` : '';

    const filterBtnHtml = `
      <button type="button" class="filter-btn icon-btn" aria-label="Open filters">
        <span class="filter-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">filter_list</span>
      </button>`;

    const titleRowHtml = stepTitle
      ? `<div class="title-row"><h1 class="text-title-medium-heavy-caps">${stepTitle}</h1></div>`
      : '';

    this.shadowRoot.innerHTML = `
      <div class="layout-shell shell">
        <a href="${backHref}" class="back-btn icon-btn" aria-label="Go back">
          <span class="back-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">arrow_back_ios_new</span>
        </a>
        <a href="./home.html" class="logo-link" aria-label="Go to home">
          <img class="logo" src="${logoSrc}" alt="SIXT rent the car">
        </a>
        <div class="search-row">
          ${searchBtnHtml}
          ${filterBtnHtml}
        </div>
        <nav class="utility-nav" aria-label="Utility links">
          <a href="#" class="util-text util-text-language text-copy-medium-heavy-tight">
            <span class="material-symbols-outlined util-text-icon" aria-hidden="true">language</span>
            <span class="util-text-label">EN | $</span>
          </a>
          <a href="#" class="util-text util-text-login text-copy-medium-heavy-tight">
            <span class="material-symbols-outlined util-text-icon" aria-hidden="true">person</span>
            <span class="util-text-label">Log in | Register</span>
          </a>
          <a href="#" class="util-icon util-icon-language icon-btn" aria-label="Language and currency">
            <span class="util-icon-glyph icon-btn-icon material-symbols-outlined" aria-hidden="true">language</span>
          </a>
          <a href="#" class="util-icon util-icon-person icon-btn" aria-label="Log in or register">
            <span class="util-icon-glyph icon-btn-icon material-symbols-outlined" aria-hidden="true">person</span>
          </a>
        </nav>
        ${titleRowHtml}
      </div>`;
  }
}

customElements.define('ox-booking-header', OXBookingHeader);
