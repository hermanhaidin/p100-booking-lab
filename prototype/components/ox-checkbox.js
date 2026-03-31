/* Checkbox visual primitive
   A styled checkbox control. Mirrors ox-radio-button pattern.
   API: <ox-checkbox checked disabled value="age-23" error></ox-checkbox> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --cb-border-default: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    --cb-border-hover: var(--color-content-secondary);
    --cb-border-error: var(--color-content-extended-error);
    --cb-border-disabled: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    --cb-border-checked: var(--color-content-primary);
    --cb-bg-checked: var(--color-content-primary);
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
    border: var(--stroke-md) solid var(--cb-border-default);
    border-radius: var(--radius-xs);
    box-sizing: border-box;
    cursor: inherit;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    transition: background-color 150ms ease, border-color 150ms ease, opacity 150ms ease;
    width: 24px;
  }

  :host(:hover) .native:not(:checked):not(:disabled) + .control {
    border-color: var(--cb-border-hover);
  }

  .native:checked + .control {
    background-color: var(--cb-bg-checked);
    border-color: var(--cb-border-checked);
  }

  .native:focus-visible + .control {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: 0;
  }

  .native:disabled + .control {
    cursor: not-allowed;
  }

  .native:not(:checked):disabled + .control {
    border-color: var(--cb-border-disabled);
  }

  .native:checked:disabled + .control {
    background-color: var(--cb-bg-checked);
    border-color: var(--cb-border-checked);
    opacity: 0.3;
  }

  :host([error]) .native:not(:disabled) + .control {
    border-color: var(--cb-border-error);
  }

  :host([error]:hover) .native:not(:checked):not(:disabled) + .control {
    border-color: var(--cb-border-error);
  }

  .check-icon {
    color: var(--color-on-content-on-primary);
    display: none;
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  .native:checked + .control .check-icon {
    display: inline-flex;
  }
`);

class OxCheckbox extends HTMLElement {
  static observedAttributes = ['value', 'checked', 'disabled', 'error'];

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
        detail: { value: this.getAttribute('value'), checked: input.checked },
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
    const value = this.getAttribute('value') || '';

    this.shadowRoot.innerHTML = `
      <input class="native" type="checkbox" value="${value}" ${checked} ${disabled}>
      <span class="control" aria-hidden="true">
        <span class="check-icon material-symbols-outlined">check</span>
      </span>`;
  }
}

customElements.define('ox-checkbox', OxCheckbox);
