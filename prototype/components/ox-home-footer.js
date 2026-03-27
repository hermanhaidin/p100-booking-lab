/* Home page footer — landing-page footer with link columns, app badges, and legal.
   Hardcoded content appropriate for prototype (fast experimentation).
   Sets data-p100-theme="option-light" for dark-background theming.

   Responsive layout:
     Mobile: 1-column links
     Tablet (650–899): 2-column links
     Desktop (≥900): 3-column links, legal as 2-col grid

   API: <ox-home-footer></ox-home-footer> */

import { baseStyles } from './shared/base-styles.js';
import { layoutStyles } from './shared/layout-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-canvas);
    color: var(--color-content-primary);
    display: block;
    margin-top: 0;
    padding-block: var(--spacing-xl);
  }

  :host([hidden]) { display: none; }

  .shell {
    width: 100%;
  }

  /* --- Top row: logo + social --- */
  .top {
    align-items: center;
    display: flex;
    gap: var(--spacing-xs);
    justify-content: space-between;
  }

  .brand-link {
    display: inline-flex;
    width: fit-content;
  }

  .brand-link img {
    display: block;
    height: 36px;
    width: auto;
  }

  .social {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-md);
  }

  /* --- Link columns --- */
  .columns {
    column-gap: var(--spacing-lg);
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin-top: var(--spacing-xl);
    row-gap: var(--spacing-xl);
  }

  .column p {
    color: var(--color-content-secondary);
    margin: 0 0 var(--spacing-sm);
  }

  .column ul {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* --- App badges --- */
  .badges {
    display: flex;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xl);
  }

  .badge-link {
    display: inline-flex;
  }

  .badge-link img {
    display: block;
    height: 40px;
    width: auto;
  }

  /* --- Legal --- */
  .legal {
    align-items: flex-start;
    color: var(--color-content-primary);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xl);
  }

  .legal-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .copyright {
    color: var(--color-content-secondary);
  }

  /* --- Tablet (650–899) --- */
  @media (min-width: 650px) and (max-width: 899px) {
    .columns {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  /* --- Desktop (≥900) --- */
  @media (min-width: 900px) {
    .columns {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .legal {
      align-items: start;
      column-gap: var(--spacing-xl);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .copyright {
      align-self: start;
      justify-self: end;
      white-space: nowrap;
    }
  }
`);

class OxHomeFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, layoutStyles, styles];
  }

  connectedCallback() {
    this.setAttribute('data-p100-theme', 'option-light');
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="layout-shell shell">
        <div class="top">
          <a href="#" class="brand-link" aria-label="SIXT homepage">
            <img src="../assets/logos/sixt_rent_the_car_on_dark.svg" alt="SIXT rent the car">
          </a>
          <div class="social" aria-label="Social links">
            <ox-icon-button kind="on-primary" icon-src="../assets/icons/logo_instagram.svg" label="Instagram" href="#"></ox-icon-button>
            <ox-icon-button kind="on-primary" icon-src="../assets/icons/logo_linkedin.svg" label="LinkedIn" href="#"></ox-icon-button>
          </div>
        </div>

        <div class="columns">
          <section class="column" aria-label="Our programs">
            <p class="text-copy-large-heavy-tight">Our programs</p>
            <ul class="text-copy-medium-heavy-tight">
              <li><ox-link href="#" kind="primary">SIXT+ Car Subscription</ox-link></li>
              <li><ox-link href="#" kind="primary">SIXT ride</ox-link></li>
              <li><ox-link href="#" kind="primary">Car rental deals</ox-link></li>
              <li><ox-link href="#" kind="primary">SIXT ONE rewards program</ox-link></li>
              <li><ox-link href="#" kind="primary">SIXT app</ox-link></li>
            </ul>
          </section>

          <section class="column" aria-label="SIXT for business">
            <p class="text-copy-large-heavy-tight">SIXT for business</p>
            <ul class="text-copy-medium-heavy-tight">
              <li><ox-link href="#" kind="primary">Register my business</ox-link></li>
              <li><ox-link href="#" kind="primary">Travel agencies</ox-link></li>
              <li><ox-link href="#" kind="primary">Business Car Rental</ox-link></li>
              <li><ox-link href="#" kind="primary">Business car alternatives</ox-link></li>
            </ul>
          </section>

          <section class="column" aria-label="About us">
            <p class="text-copy-large-heavy-tight">About us</p>
            <ul class="text-copy-medium-heavy-tight">
              <li><ox-link href="#" kind="primary">SIXT group</ox-link></li>
              <li><ox-link href="#" kind="primary">SIXT Magazine</ox-link></li>
              <li><ox-link href="#" kind="primary">SIXT News</ox-link></li>
              <li><ox-link href="#" kind="primary">Investor Relations</ox-link></li>
              <li><ox-link href="#" kind="primary">Careers</ox-link></li>
              <li><ox-link href="#" kind="primary">Regine Sixt Children's Aid Foundation</ox-link></li>
            </ul>
          </section>
        </div>

        <div class="badges" aria-label="App downloads">
          <a href="#" class="badge-link" aria-label="Download on the App Store">
            <img src="../assets/utils/app_store_black_en.svg" alt="Download on the App Store">
          </a>
          <a href="#" class="badge-link" aria-label="Get it on Google Play">
            <img src="../assets/utils/google_play_en.svg" alt="Get it on Google Play">
          </a>
        </div>

        <div class="legal" aria-label="Legal links">
          <div class="legal-links text-copy-medium-heavy-tight">
            <ox-link href="#" kind="primary">Help</ox-link>
            <ox-link href="#" kind="primary">Rental information</ox-link>
            <ox-link href="#" kind="primary">SIXT for business</ox-link>
            <ox-link href="#" kind="primary">SIXT partners</ox-link>
            <ox-link href="#" kind="primary">SIXT Magazine</ox-link>
            <ox-link href="#" kind="primary">Privacy</ox-link>
            <ox-link href="#" kind="primary">Do not share or sell my personal information</ox-link>
            <ox-link href="#" kind="primary">Terms &amp; conditions</ox-link>
            <ox-link href="#" kind="primary">Customers with disabilities</ox-link>
            <ox-link href="#" kind="primary">Cookie-Settings</ox-link>
          </div>
          <span class="copyright text-copy-medium-regular-tight">&copy; Sixt 2026</span>
        </div>
      </div>`;
  }
}

customElements.define('ox-home-footer', OxHomeFooter);
