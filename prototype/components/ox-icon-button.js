/* Shared icon-button component API
   - Kind names mirror token semantics: primary|secondary|brand|info|accent|success|warning|error
   - on-* variants are foreground colors for filled backgrounds
   API: <ox-icon-button kind="primary" size="large" icon="close" label="Close"></ox-icon-button> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --icon-button-fg: var(--color-content-primary);
    --icon-button-icon-size: 24px;
    --icon-button-hit-size: 36px;
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  .btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    box-sizing: border-box;
    color: var(--icon-button-fg);
    cursor: pointer;
    display: inline-flex;
    height: var(--icon-button-hit-size);
    justify-content: center;
    margin: 0;
    min-height: var(--icon-button-hit-size);
    min-width: var(--icon-button-hit-size);
    outline: none;
    padding: 0;
    text-decoration: none;
    transition: opacity 120ms ease, color 120ms ease;
    width: var(--icon-button-hit-size);
  }

  .btn:visited { color: var(--icon-button-fg); }

  .icon {
    color: currentColor;
    display: block;
    flex: 0 0 auto;
    font-size: var(--icon-button-icon-size);
    height: var(--icon-button-icon-size);
    transition: transform 120ms ease;
    width: var(--icon-button-icon-size);
  }

  :host([size="small"]) {
    --icon-button-icon-size: 16px;
  }

  :host(:not([size])),
  :host([size="large"]) {
    --icon-button-icon-size: 24px;
  }

  /* Kind tokens */
  :host([kind="primary"]),
  :host(:not([kind])) { --icon-button-fg: var(--color-content-primary); }
  :host([kind="secondary"]) { --icon-button-fg: var(--color-content-secondary); }
  :host([kind="brand"]) { --icon-button-fg: var(--color-content-extended-brand); }
  :host([kind="info"]) { --icon-button-fg: var(--color-content-extended-strong-info); }
  :host([kind="accent"]) { --icon-button-fg: var(--color-content-extended-strong-accent); }
  :host([kind="success"]) { --icon-button-fg: var(--color-content-extended-strong-success); }
  :host([kind="warning"]) { --icon-button-fg: var(--color-content-extended-strong-warning); }
  :host([kind="error"]) { --icon-button-fg: var(--color-content-extended-error); }

  :host([kind="on-primary"]) { --icon-button-fg: var(--color-on-content-on-primary); }
  :host([kind="on-secondary"]) { --icon-button-fg: var(--color-on-content-on-secondary); }
  :host([kind="on-brand"]) { --icon-button-fg: var(--color-on-content-extended-on-brand); }
  :host([kind="on-info"]) { --icon-button-fg: var(--color-on-content-extended-on-info); }
  :host([kind="on-accent"]) { --icon-button-fg: var(--color-on-content-extended-on-accent); }
  :host([kind="on-success"]) { --icon-button-fg: var(--color-on-content-extended-on-success); }
  :host([kind="on-warning"]) { --icon-button-fg: var(--color-on-content-extended-on-warning); }
  :host([kind="on-error"]) { --icon-button-fg: var(--color-on-content-extended-on-error); }

  /* Interactions */
  .btn:not(:disabled):not([aria-disabled="true"]):hover .icon {
    transform: scale(1.08);
  }

  .btn:not(:disabled):not([aria-disabled="true"]):active {
    opacity: 0.6;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }
`);

class OXIconButton extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'icon', 'label', 'disabled', 'href'];

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
    const icon = this.getAttribute('icon') || '';
    const label = this.getAttribute('label') || '';
    const href = this.getAttribute('href');
    const disabled = this.hasAttribute('disabled');
    const tag = href ? 'a' : 'button';

    const attrs = [`aria-label="${label}"`];
    if (href) {
      attrs.push(`href="${href}"`);
      if (disabled) attrs.push('aria-disabled="true"');
    } else {
      attrs.push('type="button"');
      if (disabled) attrs.push('disabled');
    }

    this.shadowRoot.innerHTML = `
      <${tag} class="btn" ${attrs.join(' ')}>
        <span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>
      </${tag}>`;
  }
}

customElements.define('ox-icon-button', OXIconButton);
