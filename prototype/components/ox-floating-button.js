/* Shared floating-button component API
   - Sizes: small|medium|large
   - Content modes: icon-only|text-only|icon-text
   - No kind variants; background uses surface-container token
   API: <ox-floating-button size="medium" content="icon-only" icon="chevron_left" label="Previous">Label</ox-floating-button> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --floating-button-height: 36px;
    --floating-button-width: auto;
    --floating-button-icon-size: 24px;
    --floating-button-padding-left: 0;
    --floating-button-padding-right: 0;
    --floating-button-gap: 0;
    --floating-button-active-scale: 0.94;
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  .btn {
    align-items: center;
    background-color: var(--color-surface-container);
    border: none;
    border-radius: var(--radius-pill);
    box-shadow: var(--elevation-small);
    color: var(--color-content-primary);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: var(--floating-button-gap);
    height: var(--floating-button-height);
    justify-content: center;
    min-width: var(--floating-button-width);
    outline: none;
    padding: 0 var(--floating-button-padding-right) 0 var(--floating-button-padding-left);
    transition: transform 120ms ease, box-shadow 120ms ease;
    width: var(--floating-button-width);
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
    font-size: var(--floating-button-icon-size);
    height: var(--floating-button-icon-size);
    width: var(--floating-button-icon-size);
  }

  .label { white-space: nowrap; }

  /* Size */
  :host(:not([size])),
  :host([size="small"]) { --floating-button-height: 36px; }
  :host([size="medium"]) { --floating-button-height: 40px; }
  :host([size="large"]) { --floating-button-height: 48px; }

  /* Content: icon-only */
  :host([content="icon-only"]) {
    --floating-button-width: var(--floating-button-height);
    --floating-button-padding-left: 0;
    --floating-button-padding-right: 0;
    --floating-button-gap: 0;
  }

  :host([content="icon-only"][size="small"]),
  :host([content="icon-only"]:not([size])) {
    --floating-button-icon-size: 16px;
  }

  :host([content="icon-only"][size="medium"]),
  :host([content="icon-only"][size="large"]) {
    --floating-button-icon-size: 24px;
  }

  /* Content: text-only */
  :host([content="text-only"]) {
    --floating-button-width: auto;
    --floating-button-gap: 0;
  }

  :host([content="text-only"][size="small"]),
  :host([content="text-only"]:not([size])),
  :host([content="text-only"][size="medium"]) {
    --floating-button-padding-left: var(--spacing-2xs);
    --floating-button-padding-right: var(--spacing-2xs);
  }

  :host([content="text-only"][size="large"]) {
    --floating-button-padding-left: var(--spacing-xs);
    --floating-button-padding-right: var(--spacing-xs);
  }

  /* Content: icon-text */
  :host([content="icon-text"]) {
    --floating-button-width: auto;
  }

  :host([content="icon-text"][size="small"]),
  :host([content="icon-text"]:not([size])),
  :host([content="icon-text"][size="medium"]) {
    --floating-button-padding-left: var(--spacing-3xs);
    --floating-button-padding-right: var(--spacing-2xs);
  }

  :host([content="icon-text"][size="large"]) {
    --floating-button-padding-left: var(--spacing-2xs);
    --floating-button-padding-right: var(--spacing-xs);
  }

  :host([content="icon-text"][size="small"]),
  :host([content="icon-text"]:not([size])) {
    --floating-button-gap: var(--spacing-2xs);
    --floating-button-icon-size: 16px;
  }

  :host([content="icon-text"][size="medium"]),
  :host([content="icon-text"][size="large"]) {
    --floating-button-gap: var(--spacing-2xs);
    --floating-button-icon-size: 24px;
  }

  /* Interactions */
  .btn:not(:disabled):not([aria-disabled="true"]):hover {
    box-shadow: var(--elevation-small), inset 0 0 0 9999px var(--color-overlay-hover);
  }

  .btn:not(:disabled):not([aria-disabled="true"]):active {
    box-shadow: var(--elevation-small), inset 0 0 0 9999px var(--color-overlay-hover);
    transform: scale(var(--floating-button-active-scale));
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    background-color: var(--color-content-tertiary);
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.3;
  }

  .btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }
`);

class OXFloatingButton extends HTMLElement {
  static observedAttributes = ['size', 'content', 'icon', 'label', 'disabled'];

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
    const icon = this.getAttribute('icon');
    const label = this.getAttribute('label') || '';
    const content = this.getAttribute('content') || 'icon-only';
    const disabled = this.hasAttribute('disabled');
    const typoClass = 'text-copy-medium-heavy-tight';

    const iconHtml = icon
      ? `<span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const labelHtml = content !== 'icon-only'
      ? `<span class="label ${typoClass}"><slot></slot></span>`
      : '';

    const ariaLabel = content === 'icon-only' ? `aria-label="${label}"` : '';

    this.shadowRoot.innerHTML = `
      <button type="button" class="btn" ${disabled ? 'disabled' : ''} ${ariaLabel}>
        ${iconHtml}
        ${labelHtml}
      </button>`;
  }
}

customElements.define('ox-floating-button', OXFloatingButton);
