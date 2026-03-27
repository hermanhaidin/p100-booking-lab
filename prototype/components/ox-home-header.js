/* Home page header — transparent nav bar overlay for hero sections.
   Uses dual-render pattern: both ox-text-button and ox-icon-button rendered
   for each utility action; CSS toggles visibility per breakpoint.

   Attributes:
     logo-src — brand logo path (defaults to ../assets/logos/sixt_rent_the_car_on_dark.svg)

   Responsive behavior:
     Desktop (≥900px):  hamburger + logo + 4 text buttons
     Tablet (650–899):  hamburger + logo + 3 icon buttons + login text button
     Mobile (<650px):   hamburger + logo + 4 icon buttons

   API: <ox-home-header logo-src="../assets/logos/sixt_rent_the_car_on_dark.svg"></ox-home-header> */

import { baseStyles } from './shared/base-styles.js';
import { layoutStyles } from './shared/layout-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background: transparent;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }

  :host([hidden]) { display: none; }

  .shell {
    align-items: center;
    display: flex;
    gap: var(--spacing-sm);
    height: 64px;
    justify-content: space-between;
  }

  .brand-group {
    align-items: center;
    display: flex;
    gap: var(--spacing-2xs);
  }

  .brand-link {
    display: inline-flex;
    text-decoration: none;
  }

  .brand-link:focus-visible {
    border-radius: var(--radius-sm);
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .brand-logo {
    display: block;
    height: var(--spacing-lg);
    max-width: 200px;
    width: auto;
  }

  /* --- Utility nav --- */
  .utility-nav {
    align-items: center;
    display: inline-flex;
    flex-wrap: nowrap;
    gap: var(--spacing-md);
  }

  /* Default (desktop): text buttons visible, icon buttons hidden */
  .util-icon { display: none; }

  /* ---- Tablet (650–899): first 3 as icon, login as text ---- */
  @media (min-width: 650px) and (max-width: 899px) {
    .util-text-help,
    .util-text-bookings,
    .util-text-language { display: none; }

    .util-icon-help,
    .util-icon-bookings,
    .util-icon-language { display: inline-flex; }

    .util-icon-language { order: 0; }
    .util-icon-bookings { order: 1; }
    .util-icon-help     { order: 2; }
    .util-text-login    { order: 3; }
  }

  /* ---- Mobile (<650): all as icon ---- */
  @media (max-width: 649px) {
    .utility-nav {
      justify-content: flex-end;
    }

    .util-text { display: none; }

    .util-icon-help,
    .util-icon-bookings,
    .util-icon-language,
    .util-icon-login { display: inline-flex; }
  }
`);

class OxHomeHeader extends HTMLElement {
  static observedAttributes = ['logo-src'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, layoutStyles, styles];
  }

  connectedCallback() {
    this.setAttribute('data-p100-theme', 'option-light');
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  render() {
    const logoSrc = this.getAttribute('logo-src')
      || '../assets/logos/sixt_rent_the_car_on_dark.svg';

    this.shadowRoot.innerHTML = `
      <div class="layout-shell shell">
        <div class="brand-group">
          <ox-icon-button size="large" icon="menu" label="Open menu"></ox-icon-button>
          <a href="./home.html" class="brand-link" aria-label="SIXT homepage">
            <img class="brand-logo" src="${logoSrc}" alt="SIXT rent the car">
          </a>
        </div>
        <nav class="utility-nav" aria-label="Utility links">
          <ox-text-button class="util-text util-text-help" icon="help_center" href="#" filled>Help</ox-text-button>
          <ox-text-button class="util-text util-text-bookings" icon="directions_car" href="#" filled>Manage bookings</ox-text-button>
          <ox-text-button class="util-text util-text-language" icon="language" href="#" filled>EN | $</ox-text-button>
          <ox-text-button class="util-text util-text-login" icon="person" href="#" filled>Log in | Register</ox-text-button>
          <ox-icon-button class="util-icon util-icon-help" icon="help_center" label="Help" href="#" filled></ox-icon-button>
          <ox-icon-button class="util-icon util-icon-bookings" icon="directions_car" label="Manage bookings" href="#" filled></ox-icon-button>
          <ox-icon-button class="util-icon util-icon-language" icon="language" label="Language and currency" href="#" filled></ox-icon-button>
          <ox-icon-button class="util-icon util-icon-login" icon="person" label="Log in or register" href="#" filled></ox-icon-button>
        </nav>
      </div>`;
  }
}

customElements.define('ox-home-header', OxHomeHeader);
