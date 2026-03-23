/* Banner component
   Flat grid: icon | body | actions | close.
   Container queries drive responsive stacking.
   Actions slot reverses button order at >600px (DOM order 1,2,3 → visual 3,2,1)
   so the primary CTA sits rightmost in wide banners, leftmost in narrow ones.
   Recommended actions: one small pill <ox-button> + up to three <ox-text-button>.
   Button kind defaults (auto-applied when kind is omitted):
     primary/secondary/brand → brand <ox-button>, primary <ox-text-button>
     info/accent/success/warning/error → matching kind for both
   API: <ox-banner kind="info" icon="info" title="Notice" dismissible>
          <p>Body text</p>
          <div slot="actions"><ox-button size="small">Action</ox-button></div>
        </ox-banner> */

import { baseStyles } from './shared/base-styles.js';
import './ox-icon-button.js';

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

  .close-btn {
    --icon-button-fg: var(--banner-icon-button-fg);
    grid-column: 4;
    grid-row: 1;
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

  _applyListItemDefaults() {
    this.querySelectorAll(':scope > ox-list-item').forEach(item => {
      if (!item.hasAttribute('kind')) item.setAttribute('kind', 'primary');
      if (!item.hasAttribute('size')) item.setAttribute('size', 'medium');
    });
  }

  render() {
    const icon = this.getAttribute('icon');
    const title = this.getAttribute('title');
    const dismissible = this.hasAttribute('dismissible');

    const iconHtml = icon
      ? `<span class="leading-icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const titleHtml = title
      ? `<div class="title-row"><p class="title text-copy-large-heavy">${title}</p></div>`
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
    this._applyListItemDefaults();
  }
}

customElements.define('ox-banner', OXBanner);
