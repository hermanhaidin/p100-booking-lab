/* Shared separator component.
   API: <ox-separator orientation="horizontal|vertical" size="small|medium|large|extra-large" contrast="low|medium|high"> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --separator-thickness: var(--stroke-sm);
    --separator-color: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    display: block;
    flex-shrink: 0;
  }

  :host([hidden]) { display: none; }

  hr {
    background-color: var(--separator-color);
    border: 0;
    margin: 0;
    padding: 0;
  }

  :host(:not([orientation])) hr,
  :host([orientation="horizontal"]) hr {
    block-size: var(--separator-thickness);
    inline-size: 100%;
  }

  :host([orientation="vertical"]) hr {
    block-size: 100%;
    inline-size: var(--separator-thickness);
  }

  :host([size="small"]),
  :host(:not([size])) {
    --separator-thickness: var(--stroke-sm);
  }

  :host([size="medium"]) {
    --separator-thickness: var(--stroke-md);
  }

  :host([size="large"]) {
    --separator-thickness: var(--stroke-lg);
  }

  :host([size="extra-large"]) {
    --separator-thickness: var(--stroke-xl);
  }

  :host([contrast="low"]),
  :host(:not([contrast])) {
    --separator-color: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
  }

  :host([contrast="medium"]) {
    --separator-color: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
  }

  :host([contrast="high"]) {
    --separator-color: color-mix(in srgb, var(--color-content-secondary) 40%, transparent);
  }
`);

class OXSeparator extends HTMLElement {
  static observedAttributes = ['orientation', 'size', 'contrast'];

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
    this.shadowRoot.innerHTML = `<hr aria-hidden="true">`;
  }
}

customElements.define('ox-separator', OXSeparator);
