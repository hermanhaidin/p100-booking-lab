/* Shared list-item component API
   - Structure: icon + label + optional trailing icon-button
   - Kinds mirror text-button/icon-button token semantics
   - Size modifiers control icon geometry + spacing only
   API: <ox-list-item kind="primary" size="medium" icon="check" trailing-icon="info" trailing-label="More info">Label text</ox-list-item> */

import { baseStyles } from './shared/base-styles.js';

const TYPO_MAP = {
  small: 'text-copy-small-regular',
  medium: 'text-copy-medium-regular',
  large: 'text-copy-large-regular',
};

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --list-item-fg: var(--color-content-primary);
    --list-item-leading-icon-color: var(--list-item-fg);
    --list-item-trailing-action-color: var(--list-item-fg);
    display: grid;
    align-items: start;
    color: var(--list-item-fg);
    column-gap: 0;
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  :host([hidden]) { display: none; }

  .leading-icon {
    color: var(--list-item-leading-icon-color);
    display: block;
    flex: 0 0 auto;
  }

  .label {
    color: currentColor;
    min-width: 0;
  }

  .trailing-btn {
    align-items: center;
    align-self: start;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--list-item-trailing-action-color);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    margin: calc(-1 * var(--spacing-3xs));
    outline: none;
    padding: 0;
    transition: opacity 120ms ease, color 120ms ease;
  }

  .trailing-btn:not(:disabled):hover .trailing-icon { transform: scale(1.08); }
  .trailing-btn:not(:disabled):active { opacity: 0.6; }

  .trailing-btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .trailing-icon {
    color: currentColor;
    display: block;
    transition: transform 120ms ease;
  }

  /* Small */
  :host([size="small"]) .leading-icon {
    font-size: 16px;
    height: 16px;
    margin-right: var(--spacing-2xs);
    margin-top: 1px;
    width: 16px;
  }

  :host([size="small"]) .label { margin-right: var(--spacing-2xs); }

  :host([size="small"]) .trailing-btn {
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    width: 36px;
  }

  :host([size="small"]) .trailing-icon {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  /* Medium */
  :host(:not([size])) .leading-icon,
  :host([size="medium"]) .leading-icon {
    font-size: 16px;
    height: 16px;
    margin-right: var(--spacing-xs);
    margin-top: 2px;
    width: 16px;
  }

  :host(:not([size])) .label,
  :host([size="medium"]) .label { margin-right: var(--spacing-xs); }

  :host(:not([size])) .trailing-btn,
  :host([size="medium"]) .trailing-btn {
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    width: 36px;
  }

  :host(:not([size])) .trailing-icon,
  :host([size="medium"]) .trailing-icon {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  /* Large */
  :host([size="large"]) .leading-icon {
    font-size: 24px;
    height: 24px;
    margin-right: var(--spacing-xs);
    width: 24px;
  }

  :host([size="large"]) .label { margin-right: var(--spacing-xs); }

  :host([size="large"]) .trailing-btn {
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    width: 36px;
  }

  :host([size="large"]) .trailing-icon {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  /* Kind tokens */
  :host([kind="primary"]),
  :host(:not([kind])) { --list-item-fg: var(--color-content-primary); }
  :host([kind="secondary"]) { --list-item-fg: var(--color-content-secondary); }
  :host([kind="brand"]) { --list-item-fg: var(--color-content-extended-brand); }
  :host([kind="info"]) { --list-item-fg: var(--color-content-extended-strong-info); }
  :host([kind="accent"]) { --list-item-fg: var(--color-content-extended-strong-accent); }
  :host([kind="success"]) { --list-item-fg: var(--color-content-extended-strong-success); }
  :host([kind="warning"]) { --list-item-fg: var(--color-content-extended-strong-warning); }
  :host([kind="error"]) { --list-item-fg: var(--color-content-extended-error); }

  :host([kind="on-primary"]) { --list-item-fg: var(--color-on-content-on-primary); }
  :host([kind="on-secondary"]) { --list-item-fg: var(--color-on-content-on-secondary); }
  :host([kind="on-brand"]) { --list-item-fg: var(--color-on-content-extended-on-brand); }
  :host([kind="on-info"]) { --list-item-fg: var(--color-on-content-extended-on-info); }
  :host([kind="on-accent"]) { --list-item-fg: var(--color-on-content-extended-on-accent); }
  :host([kind="on-success"]) { --list-item-fg: var(--color-on-content-extended-on-success); }
  :host([kind="on-warning"]) { --list-item-fg: var(--color-on-content-extended-on-warning); }
  :host([kind="on-error"]) { --list-item-fg: var(--color-on-content-extended-on-error); }
`);

class OXListItem extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'icon', 'trailing-icon', 'trailing-label'];

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
    const trailingIcon = this.getAttribute('trailing-icon');
    const trailingLabel = this.getAttribute('trailing-label') || '';
    const size = this.getAttribute('size') || 'medium';
    const typoClass = TYPO_MAP[size] || TYPO_MAP.medium;

    const iconHtml = icon
      ? `<span class="leading-icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const trailingHtml = trailingIcon
      ? `<button type="button" class="trailing-btn" aria-label="${trailingLabel}">
           <span class="trailing-icon material-symbols-outlined" aria-hidden="true">${trailingIcon}</span>
         </button>`
      : '';

    this.shadowRoot.innerHTML = `
      ${iconHtml}
      <span class="label ${typoClass}"><slot></slot></span>
      ${trailingHtml}`;
  }
}

customElements.define('ox-list-item', OXListItem);
