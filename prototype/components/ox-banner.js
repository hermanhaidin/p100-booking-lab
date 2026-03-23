/* Banner component
   Flat grid: icon | body | actions | close.
   Container queries drive responsive stacking.
   API: <ox-banner kind="info" icon="info" title="Notice" dismissible>
          <p>Body text</p>
          <div slot="actions"><ox-button size="small">Action</ox-button></div>
        </ox-banner> */

import { baseStyles } from './shared/base-styles.js';
import { iconButtonStyles } from './shared/ox-icon-button-styles.js';

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
    margin-top: 2px;
    width: 24px;
  }

  :host(:not([icon])) .leading-icon {
    display: none;
  }

  .body {
    display: grid;
    gap: var(--spacing-3xs);
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

  .title-row + .description {
    margin-top: calc(-1 * var(--spacing-4xs));
  }

  .description {
    margin: 0;
  }

  .actions-slot {
    align-items: center;
    column-gap: var(--spacing-3xs);
    display: flex;
    flex-wrap: wrap;
    grid-column: 3;
    grid-row: 1;
    margin-inline-start: var(--spacing-xs);
    row-gap: var(--spacing-3xs);
  }

  .close-btn {
    --icon-button-fg: var(--banner-icon-button-fg);
    align-items: center;
    border-radius: var(--radius-sm);
    color: var(--banner-icon-button-fg);
    display: inline-flex;
    grid-column: 4;
    grid-row: 1;
    height: 48px;
    justify-content: center;
    margin-block: calc(-1 * var(--spacing-3xs));
    margin-inline: var(--spacing-xs) calc(-1 * var(--spacing-3xs));
    min-height: 48px;
    min-width: 48px;
    width: 48px;
  }

  .close-icon {
    color: currentColor;
    display: block;
    font-size: 24px;
    height: 24px;
    width: 24px;
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
      align-items: center;
      display: flex;
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
    .leading-icon {
      margin-top: 0;
    }

    .close-btn {
      align-self: center;
    }

    .actions-slot {
      justify-content: flex-end;
    }
  }
`);

class OXBanner extends HTMLElement {
  static observedAttributes = ['kind', 'icon', 'title', 'dismissible'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, iconButtonStyles, styles];
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
      ? `<button type="button" class="close-btn icon-btn" aria-label="Dismiss">
           <span class="close-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">close</span>
         </button>`
      : '';

    this.shadowRoot.innerHTML = `
      ${iconHtml}
      <div class="body">
        ${titleHtml}
        <div class="description"><slot></slot></div>
      </div>
      <div class="actions-slot"><slot name="actions"></slot></div>
      ${closeHtml}`;
  }
}

customElements.define('ox-banner', OXBanner);
