/* Choice card — reusable selectable card with radio control
   A card-like radio option for booking choices, mileage options, etc.
   Group coordination (mutual exclusivity, corner rounding) is handled
   by <ox-choice-card-group>.

   Attributes:
     value          — identifier (e.g. "best-price", "stay-flexible")
     selected       — boolean, visual + radio checked state
     static         — boolean, non-interactive display-only card (no radio)
     disabled       — boolean
     meta-text      — plain text in meta area (e.g. "Included")
     price          — numeric price amount (e.g. "12.00")
     price-sign     — sign prefix (e.g. "+", "−")
     price-suffix   — text after price (e.g. "/ day")
     price-currency — currency symbol (defaults to "$")
     badge-text     — badge label
     badge-kind     — badge color kind (defaults to "brand")
     badge-variant  — badge visual variant (defaults to "solid")
     badge-preset   — badge preset (overrides kind/variant when set)
     info           — boolean, shows trailing info icon button

   Slots:
     (default) — main content area (title, subtitle)
     meta      — trailing area escape hatch (renders alongside attribute-driven meta)

   Events (bubbles, composed):
     choice-select — { value } — fired on card click
     choice-info   — { value } — fired on info button click

   API: <ox-choice-card value="stay-flexible" price="12.00" price-sign="+"
          price-suffix="/ day" badge-text="Popular" info>
          <span class="text-copy-large-heavy-tight">Stay flexible</span>
        </ox-choice-card> */

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
    display: grid;
    gap: var(--spacing-4xs);
    padding: var(--spacing-xs);
    position: relative;
  }

  :host([hidden]) { display: none; }

  :host([static]) { cursor: default; }

  :host([disabled]) {
    border-color: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    cursor: not-allowed;
  }

  :host([disabled]) .main,
  :host([disabled]) .meta {
    opacity: 0.3;
  }

  :host([selected]) {
    border-color: var(--color-content-primary);
    box-shadow: inset 0 0 0 var(--stroke-sm) var(--color-content-primary);
    z-index: 1;
  }

  .row {
    align-items: center;
    column-gap: var(--spacing-xs);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  :host([static]) .row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  ox-radio-button {
    align-self: center;
  }

  .main {
    display: grid;
    row-gap: var(--spacing-4xs);
    min-width: 0;
  }

  .meta {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-2xs);
    justify-self: end;
    white-space: nowrap;
  }

  .mobile-meta {
    align-items: center;
    display: none;
    gap: var(--spacing-3xs);
  }

  @media (max-width: 649px) {
    .row { align-items: start; }
    ox-radio-button { align-self: start; }
    .meta { align-self: start; }
    .meta-value { display: none; }
    .mobile-meta { display: inline-flex; }
  }
`);

class OXChoiceCard extends HTMLElement {
  static observedAttributes = [
    'value', 'selected', 'static', 'disabled',
    'meta-text', 'price', 'price-sign', 'price-suffix', 'price-currency',
    'badge-text', 'badge-kind', 'badge-variant', 'badge-preset',
    'info',
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
      const radio = this.shadowRoot.querySelector('ox-radio-button');
      if (radio) {
        radio.toggleAttribute('checked', this.hasAttribute('selected'));
      }
      return;
    }
    if (name === 'disabled') {
      const radio = this.shadowRoot.querySelector('ox-radio-button');
      if (radio) {
        radio.toggleAttribute('disabled', this.hasAttribute('disabled'));
      }
      return;
    }
    this.render();
  }

  _listen() {
    this.addEventListener('click', (e) => {
      if (this.hasAttribute('static') || this.hasAttribute('disabled')) return;

      const value = this.getAttribute('value') || '';
      this.dispatchEvent(new CustomEvent('choice-select', {
        bubbles: true,
        composed: true,
        detail: { value },
      }));
    });
  }

  _listenInfo() {
    const btn = this.shadowRoot.querySelector('ox-icon-button');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('choice-info', {
        bubbles: true,
        composed: true,
        detail: { value: this.getAttribute('value') || '' },
      }));
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
    const isStatic = this.hasAttribute('static');
    const selected = this.hasAttribute('selected');
    const disabled = this.hasAttribute('disabled');
    const value = this.getAttribute('value') || '';

    const radioHtml = isStatic
      ? ''
      : `<ox-radio-button value="${value}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}></ox-radio-button>`;

    const metaText = this.getAttribute('meta-text');
    const metaTextHtml = metaText
      ? `<span class="text-copy-medium-heavy-tight">${metaText}</span>`
      : '';

    const badgeText = this.getAttribute('badge-text');
    let badgeHtml = '';
    if (badgeText) {
      const preset = this.getAttribute('badge-preset');
      const kind = this.getAttribute('badge-kind') || 'brand';
      const variant = this.getAttribute('badge-variant') || 'solid';
      const badgeAttrs = preset
        ? `preset="${preset}"`
        : `kind="${kind}" variant="${variant}"`;
      badgeHtml = `<ox-badge ${badgeAttrs}>${badgeText}</ox-badge>`;
    }

    const price = this.getAttribute('price');
    let priceHtml = '';
    if (price) {
      const parts = this._priceParts(price);
      if (parts) {
        const currency = this.getAttribute('price-currency') || '$';
        const sign = this.getAttribute('price-sign');
        const suffix = this.getAttribute('price-suffix');
        const signAttr = sign ? ` sign="${sign}"` : '';
        const suffixAttr = suffix ? ` suffix="${suffix}"` : '';
        priceHtml = `<ox-price size="medium" currency="${currency}" integer="${parts.integer}" decimal="${parts.decimal}"${signAttr}${suffixAttr}></ox-price>`;
      }
    }

    const infoHtml = this.hasAttribute('info')
      ? `<ox-icon-button kind="primary" icon="info" label="More information"></ox-icon-button>`
      : '';

    // Desktop trailing meta: all pieces; text + price wrapped in .meta-value (hidden on mobile)
    const metaParts = [];
    if (metaTextHtml) metaParts.push(`<span class="meta-value">${metaTextHtml}</span>`);
    if (badgeHtml) metaParts.push(badgeHtml);
    if (priceHtml) metaParts.push(`<span class="meta-value">${priceHtml}</span>`);
    if (infoHtml) metaParts.push(infoHtml);
    const metaInner = metaParts.join('');

    // Mobile value row: text + price shown below slot content
    const mobileParts = [];
    if (metaTextHtml) mobileParts.push(metaTextHtml);
    if (priceHtml) mobileParts.push(priceHtml);
    const mobileMetaHtml = mobileParts.length
      ? `<span class="mobile-meta">${mobileParts.join('')}</span>`
      : '';

    this.shadowRoot.innerHTML = `
      <div class="row">
        ${radioHtml}
        <span class="main"><slot></slot>${mobileMetaHtml}</span>
        <span class="meta">${metaInner}<slot name="meta"></slot></span>
      </div>`;

    this._listenInfo();
  }
}

customElements.define('ox-choice-card', OXChoiceCard);
