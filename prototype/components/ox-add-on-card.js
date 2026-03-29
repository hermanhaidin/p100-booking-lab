/* Add-on card component
   Selectable card with icon, title, price, details accordion, and switch/stepper control.
   The entire card is clickable to toggle selection. Details toggle and control area
   handle their own interactions without triggering card selection.

   Attributes:
     addon-id      — unique identifier (e.g. "additional-driver")
     title         — add-on name
     price         — numeric price value
     price-suffix  — price unit label (e.g. "/ day & driver", "/ one-time")
     icon          — material symbol name (e.g. "directions_car")
     details       — expandable description text
     selected      — boolean; toggles selection state
     expanded      — boolean; toggles details accordion
     disabled      — boolean; prevents interaction
     control-type  — "switch" (default) or "stepper"
     max-quantity  — max count for stepper (default 1)
     quantity      — current count for stepper (default 0)

   Events (bubbles, composed):
     addon-change — { addonId, selected, quantity }

   API: <ox-add-on-card addon-id="gps" title="GPS" price="10.91"
          price-suffix="/ day" icon="directions_car"
          details="Description text..." control-type="switch">
        </ox-add-on-card> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-container);
    border-radius: var(--radius-lg);
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) { display: none; }

  /* --- Selection border via ::after --- */
  :host::after {
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: inherit;
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
    transition: border-color 150ms ease, border-width 150ms ease;
    z-index: 2;
  }

  :host([selected])::after {
    border-color: var(--color-content-primary);
    border-width: var(--stroke-md);
  }

  /* --- Disabled state --- */
  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: auto;
  }

  :host([disabled])::after {
    border-color: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    border-width: var(--stroke-sm);
  }

  :host([disabled]) .card-main,
  :host([disabled]) .details-panel {
    opacity: 0.3;
  }

  :host([disabled]) .card-control {
    opacity: 1;
  }

  /* --- Card main grid --- */
  .card-main {
    align-items: start;
    column-gap: var(--spacing-xs);
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    padding: var(--spacing-xs);
    row-gap: var(--spacing-2xs);
  }

  .card-icon {
    align-self: start;
    color: var(--color-content-primary);
    font-size: 24px;
    font-variation-settings: 'FILL' 1;
    grid-column: 1;
    grid-row: 1;
    height: 24px;
    width: 24px;
  }

  .card-icon-svg {
    align-self: start;
    display: block;
    grid-column: 1;
    grid-row: 1;
    height: 24px;
    width: 24px;
  }

  .card-content {
    display: grid;
    gap: var(--spacing-xs);
    grid-column: 2;
    grid-row: 1;
    margin-top: 2px;
    min-width: 0;
  }

  .card-title {
    margin: 0;
  }

  .card-control {
    align-items: center;
    align-self: start;
    display: flex;
    grid-column: 3;
    grid-row: 1;
  }

  /* --- Details toggle --- */
  .details-toggle {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
  }

  /* >= 650px: Details on same row as title, before control */
  @media (min-width: 650px) {
    .card-main {
      grid-template-columns: 24px minmax(0, 1fr) auto auto;
      grid-template-rows: auto;
      row-gap: 0;
    }

    .card-icon {
      grid-row: 1 / -1;
    }

    .card-content {
      grid-column: 2;
      grid-row: 1 / -1;
    }

    .details-toggle {
      align-self: start;
      grid-column: 3;
      grid-row: 1;
      padding-bottom: 0;
    }

    .card-control {
      align-self: start;
      grid-column: 4;
      grid-row: 1;
    }
  }

  /* --- Details accordion panel --- */
  .details-panel {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 300ms ease, opacity 300ms ease;
    will-change: max-height, opacity;
  }

  .details-panel.is-expanded {
    max-height: 300px;
    opacity: 1;
  }

  .details-inner {
    background-color: var(--color-surface-secondary-container);
    margin: 0 var(--spacing-xs) var(--spacing-xs);
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
  }

  .details-text {
    color: var(--color-content-primary);
    margin: 0;
  }
`);

class OXAddOnCard extends HTMLElement {
  static observedAttributes = [
    'addon-id', 'title', 'price', 'price-suffix', 'icon', 'icon-src', 'details',
    'selected', 'expanded', 'disabled', 'control-type', 'max-quantity', 'quantity',
  ];

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
      this._syncSelected();
      return;
    }
    if (name === 'expanded') {
      this._syncExpanded();
      return;
    }
    if (name === 'quantity') {
      this._syncQuantity();
      return;
    }
    this.render();
    this._listen();
  }

  get _controlType() { return this.getAttribute('control-type') || 'switch'; }
  get _maxQuantity() { return parseInt(this.getAttribute('max-quantity'), 10) || 1; }
  get _quantity() { return parseInt(this.getAttribute('quantity'), 10) || 0; }

  _syncSelected() {
    const selected = this.hasAttribute('selected');
    const sw = this.shadowRoot.querySelector('ox-switch');
    if (sw) sw.toggleAttribute('checked', selected);
  }

  _syncExpanded() {
    const expanded = this.hasAttribute('expanded');
    const panel = this.shadowRoot.querySelector('.details-panel');
    if (panel) panel.classList.toggle('is-expanded', expanded);
    const toggle = this.shadowRoot.querySelector('.details-toggle');
    if (toggle) toggle.textContent = expanded ? 'Close details' : 'Details';
  }

  _syncQuantity() {
    const stepper = this.shadowRoot.querySelector('ox-stepper');
    if (stepper) stepper.setAttribute('value', String(this._quantity));
  }

  _fireChange() {
    const selected = this.hasAttribute('selected');
    const quantity = this._controlType === 'stepper' ? this._quantity : (selected ? 1 : 0);
    this.dispatchEvent(new CustomEvent('addon-change', {
      bubbles: true, composed: true,
      detail: {
        addonId: this.getAttribute('addon-id'),
        selected,
        quantity,
      },
    }));
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled')) return;

      /* Details toggle — expand/collapse only */
      if (e.target.closest('.details-toggle')) {
        e.stopPropagation();
        this.toggleAttribute('expanded');
        return;
      }

      /* Control area — let switch/stepper handle */
      if (e.target.closest('.card-control')) {
        e.stopPropagation();
        return;
      }

      /* Card body click — toggle selection */
      if (this._controlType === 'stepper') {
        if (this._quantity === 0) {
          this.setAttribute('quantity', '1');
          this.setAttribute('selected', '');
          const stepper = this.shadowRoot.querySelector('ox-stepper');
          if (stepper) stepper.setAttribute('value', '1');
        } else {
          this.setAttribute('quantity', '0');
          this.removeAttribute('selected');
          const stepper = this.shadowRoot.querySelector('ox-stepper');
          if (stepper) stepper.setAttribute('value', '0');
        }
      } else {
        this.toggleAttribute('selected');
        const sw = this.shadowRoot.querySelector('ox-switch');
        if (sw) sw.toggleAttribute('checked', this.hasAttribute('selected'));
      }
      this._fireChange();
    });

    /* Listen for child control change events */
    this.shadowRoot.addEventListener('change', (e) => {
      if (this.hasAttribute('disabled')) return;
      e.stopPropagation();

      if (e.target.matches?.('ox-switch')) {
        const checked = e.detail?.checked;
        this.toggleAttribute('selected', checked);
        this._fireChange();
        return;
      }

      if (e.target.matches?.('ox-stepper')) {
        const val = e.detail?.value ?? 0;
        this.setAttribute('quantity', String(val));
        this.toggleAttribute('selected', val > 0);
        this._fireChange();
      }
    });
  }

  _priceParts(amount) {
    if (amount == null) return null;
    const num = Number(amount);
    if (!Number.isFinite(num)) return null;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true,
    }).format(Math.abs(num));
    const [integer, decimal] = formatted.split('.');
    return { integer, decimal: `.${decimal}` };
  }

  render() {
    const addonId = this.getAttribute('addon-id') || '';
    const title = this.getAttribute('title') || '';
    const price = this.getAttribute('price');
    const priceSuffix = this.getAttribute('price-suffix') ?? '/ day';
    const icon = this.getAttribute('icon') || '';
    const iconSrc = this.getAttribute('icon-src') || '';
    const details = this.getAttribute('details') || '';
    const selected = this.hasAttribute('selected');
    const expanded = this.hasAttribute('expanded');
    const disabled = this.hasAttribute('disabled');
    const controlType = this._controlType;
    const maxQuantity = this._maxQuantity;
    const quantity = this._quantity;

    const parts = this._priceParts(price);
    const priceHtml = parts
      ? `<ox-price size="medium" currency="$" integer="${parts.integer}" decimal="${parts.decimal}" suffix="${priceSuffix}"></ox-price>`
      : '';

    let controlHtml = '';
    if (controlType === 'stepper') {
      controlHtml = `<ox-stepper value="${quantity}" min="0" max="${maxQuantity}" ${disabled ? 'disabled' : ''}></ox-stepper>`;
    } else {
      controlHtml = `<ox-switch ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}></ox-switch>`;
    }

    const toggleHtml = details
      ? `<ox-text-button class="details-toggle" size="large" underlined ${disabled ? 'disabled' : ''}>${expanded ? 'Close details' : 'Details'}</ox-text-button>`
      : '';

    const panelHtml = details
      ? `<div class="details-panel${expanded ? ' is-expanded' : ''}">
          <div class="details-inner">
            <p class="details-text text-copy-medium-regular">${details}</p>
          </div>
        </div>`
      : '';

    this.shadowRoot.innerHTML = `
      <div class="card-main">
        ${iconSrc
          ? `<img class="card-icon-svg" src="${iconSrc}" alt="" aria-hidden="true">`
          : `<span class="card-icon material-symbols-outlined" filled aria-hidden="true">${icon}</span>`}
        <div class="card-content">
          <span class="card-title text-copy-large-heavy-tight">${title}</span>
          ${priceHtml}
        </div>
        ${toggleHtml}
        <div class="card-control">
          ${controlHtml}
        </div>
      </div>
      ${panelHtml}`;
  }
}

customElements.define('ox-add-on-card', OXAddOnCard);
