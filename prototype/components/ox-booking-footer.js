/* Booking footer
   Legal links + copyright in a responsive shell.
   API: <ox-booking-footer theme="option-light">
          <ox-link slot="link">Help</ox-link>
          <ox-link slot="link">Privacy</ox-link>
          <span slot="copyright">&copy; Sixt 2026</span>
        </ox-booking-footer> */

import { baseStyles } from './shared/base-styles.js';
import { layoutStyles } from './shared/layout-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-canvas);
    display: block;
    margin-top: 0;
    padding-block: var(--spacing-xl);
  }

  :host([hidden]) { display: none; }

  .shell {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--spacing-xs);
    row-gap: var(--spacing-xs);
  }

  .copyright {
    color: var(--color-content-secondary);
    margin: 0;
  }

  @media (min-width: 900px) {
    .shell {
      align-items: start;
      column-gap: var(--spacing-xs);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .copyright {
      justify-self: end;
      white-space: nowrap;
    }
  }
`);

class OXBookingFooter extends HTMLElement {
  static observedAttributes = ['theme'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, layoutStyles, styles];
  }

  connectedCallback() {
    this._syncTheme();
    this.render();
  }

  attributeChangedCallback(name) {
    if (name === 'theme') this._syncTheme();
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
    this.shadowRoot.innerHTML = `
      <div class="layout-shell shell">
        <nav class="links text-copy-medium-heavy-tight" aria-label="Legal links">
          <slot name="link"></slot>
        </nav>
        <p class="copyright text-copy-medium-regular-tight">
          <slot name="copyright"></slot>
        </p>
      </div>`;
  }
}

customElements.define('ox-booking-footer', OXBookingFooter);
