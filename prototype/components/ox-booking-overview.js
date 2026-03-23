/* Booking overview checklist sidebar
   Simple container: title + slotted list items.
   API: <ox-booking-overview title="Your booking overview:">
          <ox-list-item icon="check">Third party insurance</ox-list-item>
        </ox-booking-overview> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-secondary-container);
    border-radius: var(--radius-md);
    display: block;
    padding: var(--spacing-xs);
  }

  :host([hidden]) { display: none; }

  .title {
    margin: 0 0 var(--spacing-xs);
  }

  .list {
    display: grid;
    gap: var(--spacing-2xs);
  }

  ::slotted([hidden]) {
    display: none !important;
  }
`);

class OXBookingOverview extends HTMLElement {
  static observedAttributes = ['title'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Your booking overview:';

    this.shadowRoot.innerHTML = `
      <p class="title text-copy-large-heavy-tight">${title}</p>
      <div class="list" role="list"><slot></slot></div>`;
  }
}

customElements.define('ox-booking-overview', OXBookingOverview);
