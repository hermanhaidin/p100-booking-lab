/* Booking header
   Responsive header with back button, logo, search context, step title, and utility nav.

   Attributes:
     back-href   — URL for the back arrow (mobile only, defaults to "#")
     location    — pickup location text for the search pill
     dates       — date/time range text for the search pill
     step-title  — heading shown in the title row (mobile only, step variant)
     variant     — "step" hides search row and shows title row on mobile;
                   omit for default (search visible)
     theme       — color theme (e.g. "option-light"); applied as data-p100-theme
                   on tablet+ only, stripped on mobile to keep default colors
     logo-src    — override logo path; auto-selects on_dark (themed) or on_light

   Responsive behavior (three breakpoints):
     Mobile (<650px):  back + utility icons row, search/title below, logo hidden
     Tablet (650-899): logo + search + utility nav; language as icon, login as text
     Desktop (≥900px): logo + search + full utility nav with all text labels

   Utility nav visibility:
     Mobile:         icons only (language + person)
     Compact tablet: language icon + login text (person icon hidden)
     Desktop:        all text buttons (icons hidden)

   API: <ox-booking-header
          back-href="./offer-list.html"
          location="Munich Airport"
          dates="Mar 16 | 12:00 PM - Mar 20 | 12:00 PM"
          step-title="Which protection package do you need?"
          variant="step"
          theme="option-light"
        ></ox-booking-header> */

import { baseStyles } from './shared/base-styles.js';
import { layoutStyles } from './shared/layout-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  /* --- Host --- */
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

  /* --- Search pill (location + dates + edit icon) --- */
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
    padding: var(--spacing-4xs) var(--spacing-xs);
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

  :host([variant="step"]) .search-row {
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
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-edit {
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

  .util-icon {
    display: none;
  }

  /* ---- Mobile (<650px) ---- */
  @media (max-width: 649px) {
    .shell {
      column-gap: var(--spacing-3xs);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      height: auto;
      padding-top: var(--spacing-xs);
      row-gap: var(--spacing-xs);
    }

    .back-btn {
      display: inline-flex;
      grid-column: 1;
      grid-row: 1;
      justify-self: start;
    }

    .logo-link { display: none; }

    .utility-nav {
      grid-column: 2;
      grid-row: 1;
      justify-self: end;
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
      max-width: none;
      min-height: 52px;
      min-width: 0;
      padding-inline: var(--spacing-2xs);
      width: 100%;
    }

    .filter-btn {
      display: inline-flex;
    }

    :host([variant="step"]) .title-row {
      display: block;
      grid-column: 1 / -1;
      grid-row: 2;
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
      max-width: 560px;
      min-width: 0;
      width: 100%;
    }
  }

  /* ---- Compact tablet (650-899): language icon, login text ---- */
  @media (min-width: 650px) and (max-width: 899px) {
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
    this.shadowRoot.adoptedStyleSheets = [baseStyles, layoutStyles, styles];
    this._mql = window.matchMedia('(max-width: 649px)');
    this._onBreakpoint = () => this._syncTheme();
  }

  connectedCallback() {
    this._syncTheme();
    this._mql.addEventListener('change', this._onBreakpoint);
    this.render();
  }

  disconnectedCallback() {
    this._mql.removeEventListener('change', this._onBreakpoint);
  }

  attributeChangedCallback(name) {
    if (name === 'theme') this._syncTheme();
    this.render();
  }

  /* Theme only applies on tablet+ (≥650px); mobile always uses default colors. */
  _syncTheme() {
    const theme = this.getAttribute('theme');
    if (theme && !this._mql.matches) {
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
    /* Auto-select dark/light logo based on whether a theme is set. */
    const defaultLogo = this.hasAttribute('theme')
      ? '../assets/logos/sixt_rent_the_car_on_dark.svg'
      : '../assets/logos/sixt_rent_the_car_on_light.svg';
    const logoSrc = this.getAttribute('logo-src') || defaultLogo;

    const searchBtnHtml = location || dates ? `
      <button type="button" class="search-btn" aria-label="Trip context">
        <span class="search-copy">
          ${location ? `<span class="search-location text-copy-small-heavy">${location}</span>` : ''}
          ${dates ? `<span class="search-dates text-copy-small-regular">${dates}</span>` : ''}
        </span>
        <span class="material-symbols-outlined search-edit" aria-hidden="true">edit</span>
      </button>` : '';

    const filterBtnHtml = `
      <ox-chip class="filter-btn" icon="filter_list" label="Open filters" size="large"></ox-chip>`;

    const titleRowHtml = stepTitle
      ? `<div class="title-row"><h1 class="text-title-medium-heavy-caps">${stepTitle}</h1></div>`
      : '';

    this.shadowRoot.innerHTML = `
      <div class="layout-shell shell">
        <ox-icon-button class="back-btn" icon="arrow_back_ios_new" label="Go back" href="${backHref}"></ox-icon-button>
        <a href="./home.html" class="logo-link" aria-label="Go to home">
          <img class="logo" src="${logoSrc}" alt="SIXT rent the car">
        </a>
        <div class="search-row">
          ${searchBtnHtml}
          ${filterBtnHtml}
        </div>
        <nav class="utility-nav" aria-label="Utility links">
          <ox-text-button class="util-text util-text-language" icon="language" href="#" filled>EN | $</ox-text-button>
          <ox-text-button class="util-text util-text-login" icon="person" href="#" filled>Log in | Register</ox-text-button>
          <ox-icon-button class="util-icon util-icon-language" icon="language" label="Language and currency" href="#"></ox-icon-button>
          <ox-icon-button class="util-icon util-icon-person" icon="person" label="Log in or register" href="#" filled></ox-icon-button>
        </nav>
        ${titleRowHtml}
      </div>`;
  }
}

customElements.define('ox-booking-header', OXBookingHeader);
