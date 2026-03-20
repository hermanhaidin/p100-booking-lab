/* Shared link component API for dense, text-forward anchors
   - Kind names: primary|secondary|brand|info|accent|success|warning|error + on-* variants
   - Disabled state intentionally unsupported; links represent navigational destinations.
   API: <ox-link href="#" kind="primary" underlined truncate>Link text</ox-link> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --link-fg: var(--color-content-primary);
    display: inline;
  }

  :host([hidden]) { display: none; }

  a {
    color: var(--link-fg);
    cursor: pointer;
    display: inline-block;
    margin: 0;
    max-width: 100%;
    min-width: 0;
    outline: none;
    text-align: left;
    text-decoration: none;
    text-underline-offset: var(--spacing-4xs);
    transition: opacity 150ms ease, color 150ms ease, text-decoration-color 150ms ease;
    width: fit-content;
    font: inherit;
  }

  a:visited { color: var(--link-fg); }

  :host([truncate]) a {
    display: block;
    overflow-x: hidden;
    overflow-y: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  /* Kind tokens */
  :host([kind="primary"]),
  :host(:not([kind])) { --link-fg: var(--color-content-primary); }
  :host([kind="secondary"]) { --link-fg: var(--color-content-secondary); }
  :host([kind="brand"]) { --link-fg: var(--color-content-extended-brand); }
  :host([kind="success"]) { --link-fg: var(--color-content-extended-strong-success); }
  :host([kind="warning"]) { --link-fg: var(--color-content-extended-strong-warning); }
  :host([kind="error"]) { --link-fg: var(--color-content-extended-error); }
  :host([kind="info"]) { --link-fg: var(--color-content-extended-strong-info); }
  :host([kind="accent"]) { --link-fg: var(--color-content-extended-strong-accent); }

  :host([kind="on-primary"]) { --link-fg: var(--color-on-content-on-primary); }
  :host([kind="on-secondary"]) { --link-fg: var(--color-on-content-on-secondary); }
  :host([kind="on-brand"]) { --link-fg: var(--color-on-content-extended-on-brand); }
  :host([kind="on-info"]) { --link-fg: var(--color-on-content-extended-on-info); }
  :host([kind="on-accent"]) { --link-fg: var(--color-on-content-extended-on-accent); }
  :host([kind="on-success"]) { --link-fg: var(--color-on-content-extended-on-success); }
  :host([kind="on-warning"]) { --link-fg: var(--color-on-content-extended-on-warning); }
  :host([kind="on-error"]) { --link-fg: var(--color-on-content-extended-on-error); }

  /* Underline: default no underline at rest, underline on hover */
  :host(:not([underlined])) a { text-decoration: none; }
  :host(:not([underlined])) a:is(:hover, :active) { text-decoration: underline; }
  :host([underlined]) a { text-decoration: underline; }
  :host([underlined]) a:is(:hover, :active) { text-decoration: none; }

  a:active { opacity: 0.6; }

  a:focus-visible {
    border-radius: var(--radius-sm);
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }
`);

class OXLink extends HTMLElement {
  static observedAttributes = ['href', 'kind', 'underlined', 'truncate'];

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
    const href = this.getAttribute('href') || '#';
    this.shadowRoot.innerHTML = `<a href="${href}"><slot></slot></a>`;
  }
}

customElements.define('ox-link', OXLink);
