/* Payment method radio tile with expandable content
   Selectable tile with radio control, label, trailing icon, and expandable slot.
   API: <ox-payment-method value="credit-card" label="Credit or debit card"
          trailing-icon="credit_card" selected>
          <div>Expanded content...</div>
        </ox-payment-method> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-container);
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: 0;
    box-shadow: inset 0 0 0 0 transparent;
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    padding: var(--spacing-xs);
    position: relative;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  :host([hidden]) { display: none; }

  :host([selected]) {
    border-color: var(--color-content-primary);
    box-shadow: inset 0 0 0 var(--stroke-sm) var(--color-content-primary);
    z-index: 1;
  }

  .row {
    align-items: center;
    display: grid;
    gap: var(--spacing-xs);
    grid-template-columns: auto 1fr auto;
  }

  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trailing {
    align-items: center;
    display: inline-flex;
  }

  .trailing-img {
    height: 24px;
    width: auto;
  }

  .expanded {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    padding-top: 0;
    transition: max-height 300ms ease, opacity 200ms ease, padding-top 200ms ease;
  }

  :host([selected]) .expanded {
    max-height: 600px;
    opacity: 1;
    padding-top: var(--spacing-xs);
  }
`);

class OxPaymentMethod extends HTMLElement {
  static observedAttributes = ['value', 'selected', 'label', 'trailing-icon', 'trailing-icon-src'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  attributeChangedCallback(name) {
    if (name === 'selected') {
      const radio = this.shadowRoot.querySelector('ox-radio-button');
      if (radio) {
        radio.toggleAttribute('checked', this.hasAttribute('selected'));
      }
      return;
    }
    this.render();
  }

  _listen() {
    this.addEventListener('click', (e) => {
      /* Don't fire for clicks inside expanded content form fields */
      const path = e.composedPath();
      const isInsideExpanded = path.some(
        (el) => el instanceof HTMLElement && (
          el.tagName === 'OX-TEXT-FIELD' ||
          el.tagName === 'OX-COMBOBOX' ||
          el.tagName === 'INPUT' ||
          el.tagName === 'BUTTON'
        )
      );
      if (isInsideExpanded) return;

      this.dispatchEvent(new CustomEvent('payment-select', {
        bubbles: true,
        composed: true,
        detail: { value: this.getAttribute('value') || '' },
      }));
    });
  }

  render() {
    const value = this.getAttribute('value') || '';
    const selected = this.hasAttribute('selected');
    const label = this.getAttribute('label') || '';
    const trailingIcon = this.getAttribute('trailing-icon');
    const trailingIconSrc = this.getAttribute('trailing-icon-src');

    let trailingHtml = '';
    if (trailingIconSrc) {
      trailingHtml = `<span class="trailing"><img class="trailing-img" src="${trailingIconSrc}" alt=""></span>`;
    } else if (trailingIcon) {
      trailingHtml = `<span class="trailing"><span class="material-symbols-outlined" aria-hidden="true">${trailingIcon}</span></span>`;
    }

    this.shadowRoot.innerHTML = `
      <div class="row">
        <ox-radio-button value="${value}" ${selected ? 'checked' : ''}></ox-radio-button>
        <span class="label text-copy-medium-heavy">${label}</span>
        ${trailingHtml}
      </div>
      <div class="expanded">
        <slot></slot>
      </div>`;
  }
}

customElements.define('ox-payment-method', OxPaymentMethod);
