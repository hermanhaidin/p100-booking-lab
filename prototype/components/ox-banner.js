/* Banner component
   Flat 4-column grid: icon | body | actions | close.
   Container queries drive responsive stacking (≤600px / >600px).

   Attributes:
     kind        — primary (default), secondary, brand, info, accent,
                   success, warning, error
     icon        — Material Symbols icon name (filled, 24px)
     title       — bold heading text inside the body
     dismissible — shows a close button (hides banner on click)
     gradient    — brand-only; adds radial gradient background

   Slots:
     (default)        — body content (paragraphs, ox-list-item, etc.)
     title-trailing   — inline trailing element in the title row (e.g. ox-price);
                        auto-pushed to the trailing edge via margin-inline-start: auto
     actions          — wrap buttons in <div slot="actions">; recommended:
                        one small <ox-button> + up to three <ox-text-button>

   Auto-applied defaults (when kind is omitted on slotted children):
     actions buttons  — see ACTION_KIND_MAP below
     title-trailing   — ox-price kind matches banner accent color (PRICE_KIND_MAP)
     ox-list-item     — defaults to kind="primary" size="medium"

   Brand banners automatically set data-p100-theme="option-light" for dark styling.

   API: <ox-banner kind="info" icon="info" title="Notice" dismissible>
          <p>Body text</p>
          <ox-price slot="title-trailing" size="medium" currency="$" integer="12" decimal=".00"></ox-price>
          <div slot="actions"><ox-button size="small">Action</ox-button></div>
        </ox-banner> */

import { baseStyles } from './shared/base-styles.js';
import './ox-icon-button.js';

/* Neutral banners (primary/secondary/brand) use primary-colored prices;
   status banners propagate their kind so the price matches the accent. */
const PRICE_KIND_MAP = {
  primary: 'primary', secondary: 'primary', brand: 'primary',
  info: 'info', accent: 'accent', success: 'success',
  warning: 'warning', error: 'error',
};

/* Neutral banners get brand CTAs + primary text buttons;
   status banners propagate their kind to both button types. */
const ACTION_KIND_MAP = {
  primary:   { 'ox-button': 'brand', 'ox-text-button': 'primary' },
  secondary: { 'ox-button': 'brand', 'ox-text-button': 'primary' },
  brand:     { 'ox-button': 'brand', 'ox-text-button': 'primary' },
  info:      { 'ox-button': 'info',  'ox-text-button': 'info' },
  accent:    { 'ox-button': 'accent', 'ox-text-button': 'accent' },
  success:   { 'ox-button': 'success', 'ox-text-button': 'success' },
  warning:   { 'ox-button': 'warning', 'ox-text-button': 'warning' },
  error:     { 'ox-button': 'error', 'ox-text-button': 'error' },
};

const styles = new CSSStyleSheet();
styles.replaceSync(`
  /* --- Host & grid structure --- */
  :host {
    --banner-bg: var(--color-surface-secondary-container);
    --banner-fg: var(--color-content-primary);
    --banner-accent-fg: var(--color-content-primary);
    --banner-leading-icon-fg: var(--banner-accent-fg);
    --banner-icon-button-fg: var(--color-content-primary);
    align-items: center;
    background-color: var(--banner-bg);
    border-radius: var(--radius-lg);
    color: var(--banner-fg);
    column-gap: 0;
    container-type: inline-size;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    max-width: min(100%, 1440px);
    overflow: hidden;
    padding: var(--spacing-xs);
    position: relative;
    row-gap: 0;
    width: 100%;
  }

  :host([hidden]) { display: none; }

  :host > * {
    position: relative;
    z-index: 1;
  }

  /* --- Leading icon --- */
  .leading-icon {
    color: var(--banner-leading-icon-fg);
    display: block;
    font-size: 24px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
    grid-column: 1;
    grid-row: 1;
    height: 24px;
    margin-inline-end: var(--spacing-xs);
    width: 24px;
  }

  :host(:not([icon])) .leading-icon {
    display: none;
  }

  /* --- Body, title, description --- */
  .body {
    display: grid;
    gap: var(--spacing-4xs);
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
  }

  .title-row {
    align-items: baseline;
    color: var(--banner-accent-fg);
    column-gap: var(--spacing-4xs);
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--spacing-5xs);
  }

  .title-row:empty {
    display: none;
  }

  /* --- Title-trailing slot (e.g. price) --- */
  .title-trailing {
    margin-inline-start: auto;
  }

  .title {
    color: currentColor;
    margin: 0;
  }

  .description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4xs);
    margin: 0;
  }

  .description ::slotted(*) {
    margin: 0;
  }

  /* --- Actions slot --- */
  .actions-slot {
    align-items: center;
    column-gap: var(--spacing-xs);
    display: flex;
    flex-wrap: wrap;
    grid-column: 3;
    grid-row: 1;
    margin-inline-start: var(--spacing-xs);
    row-gap: var(--spacing-xs);
  }

  .actions-slot ::slotted(*) {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  /* --- Close button --- */
  .close-btn {
    --icon-button-fg: var(--banner-icon-button-fg);
    grid-column: 4;
    grid-row: 1;
    margin-inline-start: var(--spacing-xs);
  }

  /* Kind token mappings */
  :host([kind="primary"]),
  :host(:not([kind])) {
    --banner-bg: var(--color-surface-secondary-container);
    --banner-fg: var(--color-content-primary);
    --banner-accent-fg: var(--color-content-primary);
    --banner-icon-button-fg: var(--color-content-primary);
  }

  :host([kind="secondary"]) {
    --banner-bg: var(--color-surface-container);
    --banner-fg: var(--color-content-primary);
    --banner-accent-fg: var(--color-content-primary);
    --banner-icon-button-fg: var(--color-content-primary);
  }

  :host([kind="brand"]) {
    --banner-bg: var(--color-surface-container);
    --banner-fg: var(--color-content-primary);
    --banner-accent-fg: var(--color-content-primary);
    --banner-leading-icon-fg: var(--color-content-extended-brand);
    --banner-icon-button-fg: var(--color-content-primary);
  }

  :host([kind="brand"][gradient])::before {
    background: var(--radial-gradient-brand-top-leading);
    border-radius: inherit;
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  :host([kind="info"]) {
    --banner-bg: var(--color-content-extended-soft-info);
    --banner-accent-fg: var(--color-content-extended-strong-info);
    --banner-icon-button-fg: var(--color-content-extended-strong-info);
  }

  :host([kind="accent"]) {
    --banner-bg: var(--color-content-extended-soft-accent);
    --banner-accent-fg: var(--color-content-extended-strong-accent);
    --banner-icon-button-fg: var(--color-content-extended-strong-accent);
  }

  :host([kind="success"]) {
    --banner-bg: var(--color-content-extended-soft-success);
    --banner-accent-fg: var(--color-content-extended-strong-success);
    --banner-icon-button-fg: var(--color-content-extended-strong-success);
  }

  :host([kind="warning"]) {
    --banner-bg: var(--color-content-extended-soft-warning);
    --banner-accent-fg: var(--color-content-extended-strong-warning);
    --banner-icon-button-fg: var(--color-content-extended-strong-warning);
  }

  :host([kind="error"]) {
    --banner-bg: var(--color-content-extended-soft-error);
    --banner-accent-fg: var(--color-content-extended-error);
    --banner-icon-button-fg: var(--color-content-extended-error);
  }

  /* --- Responsive: narrow (≤600px) stacks actions below body --- */
  @container (max-width: 600px) {
    .leading-icon,
    .close-btn {
      align-self: start;
    }

    :host(:not([title])) .description {
      justify-content: center;
      min-height: 24px;
    }

    .actions-slot {
      grid-column: 2;
      grid-row: 2;
      justify-content: flex-start;
      margin-inline-start: 0;
      margin-top: var(--spacing-xs);
    }
  }

  /* --- Responsive: wide (>600px) keeps all elements in one row --- */
  @container (min-width: 601px) {
    .close-btn {
      align-self: center;
    }

    .actions-slot {
      justify-content: flex-end;
    }

    .actions-slot ::slotted(*) {
      flex-direction: row-reverse;
    }
  }
`);

class OXBanner extends HTMLElement {
  static observedAttributes = ['kind', 'icon', 'title', 'dismissible'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  attributeChangedCallback() {
    this.render();
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('.close-btn');
      if (btn) this.hidden = true;
    });
  }

  /* Auto-set kind on slotted action buttons to match the banner's kind. */
  _applyActionDefaults() {
    const kind = this.getAttribute('kind') || 'primary';
    const map = ACTION_KIND_MAP[kind];
    if (!map) return;
    for (const tag of ['ox-button', 'ox-text-button']) {
      this.querySelectorAll(`[slot="actions"] ${tag}`).forEach(btn => {
        if (!btn.hasAttribute('kind') || btn.hasAttribute('data-banner-kind')) {
          btn.setAttribute('kind', map[tag]);
          btn.setAttribute('data-banner-kind', '');
        }
      });
    }
  }

  /* Auto-set kind on slotted ox-price to match the banner's accent color. */
  _applyPriceDefaults() {
    const kind = this.getAttribute('kind') || 'primary';
    const priceKind = PRICE_KIND_MAP[kind];
    if (!priceKind) return;
    this.querySelectorAll('[slot="title-trailing"] ox-price, ox-price[slot="title-trailing"]').forEach(price => {
      if (!price.hasAttribute('kind') || price.hasAttribute('data-banner-kind')) {
        price.setAttribute('kind', priceKind);
        price.setAttribute('data-banner-kind', '');
      }
    });
  }

  /* Default direct-child ox-list-items to kind="primary" size="medium". */
  _applyListItemDefaults() {
    this.querySelectorAll(':scope > ox-list-item').forEach(item => {
      if (!item.hasAttribute('kind')) item.setAttribute('kind', 'primary');
      if (!item.hasAttribute('size')) item.setAttribute('size', 'medium');
    });
  }

  render() {
    const kind = this.getAttribute('kind');
    if (kind === 'brand') {
      this.setAttribute('data-p100-theme', 'option-light');
    } else {
      this.removeAttribute('data-p100-theme');
    }

    const icon = this.getAttribute('icon');
    const title = this.getAttribute('title');
    const dismissible = this.hasAttribute('dismissible');

    const iconHtml = icon
      ? `<span class="leading-icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const hasTitleTrailing = this.querySelector('[slot="title-trailing"]');
    const titleTrailingSlot = hasTitleTrailing
      ? '<span class="title-trailing"><slot name="title-trailing"></slot></span>'
      : '';

    const titleHtml = (title || hasTitleTrailing)
      ? `<div class="title-row"><p class="title text-copy-large-heavy">${title || ''}</p>${titleTrailingSlot}</div>`
      : '';

    const closeHtml = dismissible
      ? `<ox-icon-button class="close-btn" icon="close" label="Dismiss"></ox-icon-button>`
      : '';

    const hasActions = this.querySelector('[slot="actions"]');
    const actionsHtml = hasActions
      ? '<div class="actions-slot"><slot name="actions"></slot></div>'
      : '';

    this.shadowRoot.innerHTML = `
      ${iconHtml}
      <div class="body">
        ${titleHtml}
        <div class="description"><slot></slot></div>
      </div>
      ${actionsHtml}
      ${closeHtml}`;

    this._applyActionDefaults();
    this._applyPriceDefaults();
    this._applyListItemDefaults();
  }
}

customElements.define('ox-banner', OXBanner);
