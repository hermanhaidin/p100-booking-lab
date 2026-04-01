/* Checkbox component
   A styled checkbox control matching the SIXT design system.
   API: <ox-checkbox checked disabled></ox-checkbox>

   Attributes:
     checked  — boolean; toggles on/off state
     disabled — boolean; prevents interaction

   Events (bubbles, composed):
     change — { checked } — fired when toggled via click or keyboard */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    position: relative;
  }

  :host([hidden]) { display: none; }

  :host([disabled]) { cursor: not-allowed; }

  .native {
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 1px;
  }

  .control {
    align-items: center;
    background-color: transparent;
    border: var(--stroke-md) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: var(--radius-xs);
    box-sizing: border-box;
    cursor: inherit;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    transition: background-color 140ms ease, border-color 140ms ease;
    width: 24px;
  }

  .control::after {
    color: var(--color-on-content-on-primary);
    content: "check";
    font-family: "Material Symbols Outlined";
    font-size: 18px;
    font-weight: 400;
    opacity: 0;
    transition: opacity 100ms ease;
  }

  :host(:hover) .native:not(:checked):not(:disabled) + .control {
    border-color: var(--color-content-secondary);
  }

  .native:checked + .control {
    background-color: var(--color-content-primary);
    border-color: var(--color-content-primary);
  }

  .native:checked + .control::after {
    opacity: 1;
  }

  .native:focus-visible + .control {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .native:disabled + .control {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .native:not(:checked):disabled + .control {
    border-color: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
  }
`);

class OXCheckbox extends HTMLElement {
  static observedAttributes = ['checked', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  attributeChangedCallback(name) {
    const input = this.shadowRoot.querySelector('.native');
    if (!input) { this.render(); return; }

    if (name === 'checked') {
      input.checked = this.hasAttribute('checked');
    } else if (name === 'disabled') {
      input.disabled = this.hasAttribute('disabled');
    }
  }

  _listen() {
    this.shadowRoot.addEventListener('change', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) return;
      this.toggleAttribute('checked', input.checked);
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { checked: input.checked },
      }));
    });

    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target instanceof HTMLInputElement) return;
      const input = this.shadowRoot.querySelector('.native');
      if (input && !input.disabled) {
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  render() {
    const checked = this.hasAttribute('checked') ? 'checked' : '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';

    this.shadowRoot.innerHTML = `
      <input class="native" type="checkbox" ${checked} ${disabled}>
      <span class="control" aria-hidden="true"></span>`;
  }
}

customElements.define('ox-checkbox', OXCheckbox);
