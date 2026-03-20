/* Shared button component API
   Variant contract:
   - Kind: primary|secondary|brand|info|accent|success|warning|error|error-alt (default brand)
   - Variant: solid|outlined (default solid)
   - Size: small|large (default large)
   API: <ox-button kind="brand" size="large" variant="solid" icon="arrow_forward" disabled>Label</ox-button> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --button-bg: var(--color-content-extended-brand);
    --button-fg: var(--color-on-content-extended-on-brand);
    --button-on-fill-fg: var(--color-on-content-extended-on-brand);
    --button-outline-stroke: var(--button-bg);
    --button-outline-fg: var(--button-bg);
    --button-outline-hover-fg: var(--button-on-fill-fg);
    --button-solid-hover-overlay: var(--color-overlay-hover);
    --button-solid-active-bg: var(--button-bg);
    --button-solid-active-fg: var(--button-fg);
    --button-solid-active-overlay: var(--color-overlay-hover);
    --button-solid-active-scale: 0.94;
    --button-solid-active-content-opacity: 1;
    --button-outlined-hover-bg: var(--button-outline-stroke);
    --button-outlined-hover-fg: var(--button-outline-hover-fg);
    --button-outlined-hover-border: transparent;
    --button-outlined-hover-shadow: inset 0 0 0 9999px transparent;
    --button-outlined-active-bg: var(--button-outlined-hover-bg);
    --button-outlined-active-fg: var(--button-outlined-hover-fg);
    --button-outlined-active-border: var(--button-outlined-hover-border);
    --button-outlined-active-shadow: var(--button-outlined-hover-shadow);
    --button-outlined-active-scale: 0.94;
    --button-outlined-active-content-opacity: 1;
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  .btn {
    align-items: center;
    background-color: var(--button-bg);
    border: none;
    border-radius: var(--radius-md);
    box-shadow: inset 0 0 0 9999px transparent;
    color: var(--button-fg);
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-3xs);
    justify-content: center;
    min-width: 96px;
    outline: none;
    padding: 0 var(--spacing-xs);
    text-align: center;
    text-decoration: none;
    transition: box-shadow 150ms ease, background-color 150ms ease-in-out, border-color 150ms ease, color 150ms ease, transform 150ms ease-in-out;
    width: fit-content;
  }

  :host(:not([size])) .btn,
  :host([size="large"]) .btn {
    border-radius: var(--radius-md);
    height: 52px;
    min-width: 128px;
  }

  :host([size="small"]) .btn {
    border-radius: var(--radius-pill);
    height: 36px;
    min-width: 96px;
  }

  :host([icon]) .btn {
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-md);
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
  }

  :host(:not([size])) .icon,
  :host([size="large"]) .icon {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  :host([size="small"]) .icon {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  .label {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  :host([truncate]) .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Kind token mappings */
  :host([kind="primary"]) {
    --button-bg: var(--color-content-primary);
    --button-fg: var(--color-on-content-on-primary);
    --button-on-fill-fg: var(--color-on-content-on-primary);
    --button-outline-stroke: var(--color-content-primary);
    --button-outline-fg: var(--color-content-primary);
    --button-outline-hover-fg: var(--color-on-content-on-primary);
  }

  :host([kind="secondary"]) {
    --button-bg: var(--color-surface-secondary-container);
    --button-fg: var(--color-content-primary);
    --button-on-fill-fg: var(--color-on-content-on-primary);
    --button-outline-stroke: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    --button-outline-fg: var(--color-content-primary);
    --button-outline-hover-fg: var(--color-content-primary);
    --button-outlined-hover-bg: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
  }

  :host([kind="brand"]),
  :host(:not([kind])) {
    --button-bg: var(--color-content-extended-brand);
    --button-fg: var(--color-on-content-extended-on-brand);
    --button-on-fill-fg: var(--color-on-content-extended-on-brand);
    --button-outline-stroke: var(--color-content-extended-brand);
    --button-outline-fg: var(--color-content-extended-brand);
    --button-outline-hover-fg: var(--color-on-content-extended-on-brand);
  }

  :host([kind="info"]) {
    --button-bg: var(--color-content-extended-info);
    --button-fg: var(--color-on-content-extended-on-info);
    --button-on-fill-fg: var(--color-on-content-extended-on-info);
    --button-outline-stroke: var(--color-content-extended-strong-info);
    --button-outline-fg: var(--color-content-extended-strong-info);
    --button-outline-hover-fg: var(--color-on-content-extended-on-info);
  }

  :host([kind="accent"]) {
    --button-bg: var(--color-content-extended-accent);
    --button-fg: var(--color-on-content-extended-on-accent);
    --button-on-fill-fg: var(--color-on-content-extended-on-accent);
    --button-outline-stroke: var(--color-content-extended-strong-accent);
    --button-outline-fg: var(--color-content-extended-strong-accent);
    --button-outline-hover-fg: var(--color-on-content-extended-on-accent);
  }

  :host([kind="success"]) {
    --button-bg: var(--color-content-extended-success);
    --button-fg: var(--color-on-content-extended-on-success);
    --button-on-fill-fg: var(--color-on-content-extended-on-success);
    --button-outline-stroke: var(--color-content-extended-strong-success);
    --button-outline-fg: var(--color-content-extended-strong-success);
    --button-outline-hover-fg: var(--color-on-content-extended-on-success);
  }

  :host([kind="warning"]) {
    --button-bg: var(--color-content-extended-warning);
    --button-fg: var(--color-on-content-extended-on-warning);
    --button-on-fill-fg: var(--color-on-content-extended-on-warning);
    --button-outline-stroke: var(--color-content-extended-strong-warning);
    --button-outline-fg: var(--color-content-extended-strong-warning);
    --button-outline-hover-fg: var(--color-on-content-extended-on-warning);
  }

  :host([kind="error"]) {
    --button-bg: var(--color-content-extended-error);
    --button-fg: var(--color-on-content-extended-on-error);
    --button-on-fill-fg: var(--color-on-content-extended-on-error);
    --button-outline-stroke: var(--color-content-extended-error);
    --button-outline-fg: var(--color-content-extended-error);
    --button-outline-hover-fg: var(--color-on-content-extended-on-error);
  }

  :host([kind="error-alt"]) {
    --button-bg: var(--color-surface-secondary-container);
    --button-fg: var(--color-content-extended-error);
    --button-on-fill-fg: var(--color-on-content-extended-on-error);
    --button-outline-stroke: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    --button-outline-fg: var(--color-content-extended-error);
    --button-outline-hover-fg: var(--color-content-extended-error);
    --button-outlined-hover-bg: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
  }

  /* Solid interactions */
  :host(:not([variant="outlined"])) .btn:not(:disabled):not([aria-disabled="true"]):hover {
    box-shadow: inset 0 0 0 9999px var(--button-solid-hover-overlay);
  }

  :host(:not([variant="outlined"])) .btn:not(:disabled):not([aria-disabled="true"]):active {
    background-color: var(--button-solid-active-bg);
    box-shadow: inset 0 0 0 9999px var(--button-solid-active-overlay);
    color: var(--button-solid-active-fg);
    transform: scale(var(--button-solid-active-scale));
  }

  :host(:not([variant="outlined"])) .btn:not(:disabled):not([aria-disabled="true"]):active .label,
  :host(:not([variant="outlined"])) .btn:not(:disabled):not([aria-disabled="true"]):active .icon {
    opacity: var(--button-solid-active-content-opacity);
  }

  /* Outlined variant */
  :host([variant="outlined"]) .btn {
    background-color: transparent;
    border: var(--stroke-md) solid var(--button-outline-stroke);
    color: var(--button-outline-fg);
  }

  :host([variant="outlined"]) .btn:not(:disabled):not([aria-disabled="true"]):hover {
    background-color: var(--button-outlined-hover-bg);
    border-color: var(--button-outlined-hover-border);
    box-shadow: var(--button-outlined-hover-shadow);
    color: var(--button-outlined-hover-fg);
  }

  :host([variant="outlined"]) .btn:not(:disabled):not([aria-disabled="true"]):active {
    background-color: var(--button-outlined-active-bg);
    border-color: var(--button-outlined-active-border);
    box-shadow: var(--button-outlined-active-shadow);
    color: var(--button-outlined-active-fg);
    transform: scale(var(--button-outlined-active-scale));
  }

  :host([variant="outlined"]) .btn:not(:disabled):not([aria-disabled="true"]):active .label,
  :host([variant="outlined"]) .btn:not(:disabled):not([aria-disabled="true"]):active .icon {
    opacity: var(--button-outlined-active-content-opacity);
  }

  /* Disabled */
  :host(:not([variant="outlined"])) .btn:disabled {
    box-shadow: inset 0 0 0 9999px var(--color-overlay-disabled);
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  /* Focus ring */
  .btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }
`);

class OXButton extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'variant', 'icon', 'disabled', 'truncate', 'href'];

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
    const href = this.getAttribute('href');
    const disabled = this.hasAttribute('disabled');
    const size = this.getAttribute('size') || 'large';
    const typoClass = size === 'small' ? 'text-copy-medium-heavy-tight' : 'text-copy-large-heavy-tight';
    const tag = href ? 'a' : 'button';

    const iconHtml = icon
      ? `<span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const attrs = [];
    if (href) {
      attrs.push(`href="${href}"`);
      if (disabled) attrs.push('aria-disabled="true"');
    } else {
      attrs.push('type="button"');
      if (disabled) attrs.push('disabled');
    }

    this.shadowRoot.innerHTML = `
      <${tag} class="btn" ${attrs.join(' ')}>
        ${iconHtml}
        <span class="label ${typoClass}"><slot></slot></span>
      </${tag}>`;
  }
}

customElements.define('ox-button', OXButton);
