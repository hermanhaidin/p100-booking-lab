/* Shared text-button component API
   - Kind names mirror token semantics: primary|secondary|brand|info|accent|success|warning|error + on-* variants
   - Underline interaction targets label only, never icons
   - Touch target exceeds content height; negative vertical margins collapse layout footprint.
     Small: 36px target, -8px margin. Large: 48px target, -12px margin.
   - trailing-icon: icon after the label (e.g. arrow_forward)
   - truncate: clips label text with ellipsis
   - href: renders as <a> instead of <button> for navigation
   - disabled: disables interaction
   API: <ox-text-button kind="primary" size="large" icon="help_center" underlined>Label</ox-text-button>
        <ox-text-button kind="brand" trailing-icon="arrow_forward" href="./next.html">Continue</ox-text-button> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --text-button-fg: var(--color-content-primary);
    --text-button-hit-height: 48px;
    --text-button-v-margin: -12px;
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  :host([size="small"]) {
    --text-button-hit-height: 36px;
    --text-button-v-margin: -8px;
  }

  :host(:not([size])),
  :host([size="large"]) {
    --text-button-hit-height: 48px;
    --text-button-v-margin: -12px;
  }

  .btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 0;
    color: var(--text-button-fg);
    cursor: pointer;
    display: inline-flex;
    gap: 0;
    justify-content: flex-start;
    margin: var(--text-button-v-margin) 0;
    min-height: var(--text-button-hit-height);
    min-width: 0;
    outline: none;
    padding: 0;
    text-align: left;
    text-decoration: none;
    text-underline-offset: var(--spacing-4xs);
    transition: opacity 150ms ease, color 150ms ease, text-decoration-color 150ms ease;
    width: fit-content;
  }

  .btn:visited { color: var(--text-button-fg); }

  .label {
    min-width: 0;
    text-decoration: none;
    text-decoration-thickness: var(--stroke-sm);
    white-space: nowrap;
  }

  :host([truncate]) .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([truncate]) .btn {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([icon]) .btn,
  :host([trailing-icon]) .btn { gap: var(--spacing-3xs); }

  .icon-leading,
  .icon-trailing {
    color: currentColor;
    flex: 0 0 auto;
  }

  :host([size="small"]) .icon-leading {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  :host(:not([size])) .icon-leading,
  :host([size="large"]) .icon-leading {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  .icon-trailing {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  /* Kind tokens */
  :host([kind="primary"]),
  :host(:not([kind])) { --text-button-fg: var(--color-content-primary); }
  :host([kind="secondary"]) { --text-button-fg: var(--color-content-secondary); }
  :host([kind="brand"]) { --text-button-fg: var(--color-content-extended-brand); }
  :host([kind="success"]) { --text-button-fg: var(--color-content-extended-strong-success); }
  :host([kind="warning"]) { --text-button-fg: var(--color-content-extended-strong-warning); }
  :host([kind="error"]) { --text-button-fg: var(--color-content-extended-error); }
  :host([kind="info"]) { --text-button-fg: var(--color-content-extended-strong-info); }
  :host([kind="accent"]) { --text-button-fg: var(--color-content-extended-strong-accent); }

  :host([kind="on-primary"]) { --text-button-fg: var(--color-on-content-on-primary); }
  :host([kind="on-secondary"]) { --text-button-fg: var(--color-on-content-on-secondary); }
  :host([kind="on-brand"]) { --text-button-fg: var(--color-on-content-extended-on-brand); }
  :host([kind="on-info"]) { --text-button-fg: var(--color-on-content-extended-on-info); }
  :host([kind="on-accent"]) { --text-button-fg: var(--color-on-content-extended-on-accent); }
  :host([kind="on-success"]) { --text-button-fg: var(--color-on-content-extended-on-success); }
  :host([kind="on-warning"]) { --text-button-fg: var(--color-on-content-extended-on-warning); }
  :host([kind="on-error"]) { --text-button-fg: var(--color-on-content-extended-on-error); }

  /* Underline: default = no underline at rest, underline on hover */
  :host(:not([underlined])) .label { text-decoration: none; }

  :host(:not([underlined])) .btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active) .label {
    text-decoration: underline;
  }

  :host([underlined]) .label { text-decoration: underline; }

  :host([underlined]) .btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active) .label {
    text-decoration: none;
  }

  .btn:not(:disabled):not([aria-disabled="true"]):active {
    opacity: 0.6;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .btn:not(:disabled):not([aria-disabled="true"]):focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
    border-radius: var(--radius-sm);
  }
`);

class OXTextButton extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'icon', 'trailing-icon', 'underlined', 'truncate', 'disabled', 'href'];

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
    const href = this.getAttribute('href');
    const disabled = this.hasAttribute('disabled');
    const size = this.getAttribute('size') || 'large';
    const typoClass = size === 'small' ? 'text-copy-small-heavy-tight' : 'text-copy-medium-heavy-tight';
    const tag = href ? 'a' : 'button';

    const leadingHtml = icon
      ? `<span class="icon-leading material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';
    const trailingHtml = trailingIcon
      ? `<span class="icon-trailing material-symbols-outlined" aria-hidden="true">${trailingIcon}</span>`
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
      <${tag} class="btn ${typoClass}" ${attrs.join(' ')}>
        ${leadingHtml}
        <span class="label" part="label"><slot></slot></span>
        ${trailingHtml}
      </${tag}>`;
  }
}

customElements.define('ox-text-button', OXTextButton);
