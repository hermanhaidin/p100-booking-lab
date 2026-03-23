/* Radio button visual primitive
   A styled radio control. Group coordination (mutual exclusivity) is the
   consumer's responsibility — shadow DOM prevents native radio grouping.
   API: <ox-radio-button value="smart" checked disabled error></ox-radio-button> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --radio-border-default: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    --radio-border-hover: var(--color-content-secondary);
    --radio-border-error: var(--color-content-extended-error);
    --radio-border-disabled: color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    --radio-border-selected: var(--color-content-primary);
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
    background-color: transparent;
    border: var(--stroke-md) solid var(--radio-border-default);
    border-radius: 999px;
    box-sizing: border-box;
    cursor: inherit;
    display: inline-block;
    height: 24px;
    transition: border-color 150ms ease, border-width 150ms ease, opacity 150ms ease;
    width: 24px;
  }

  :host(:hover) .native:not(:checked):not(:disabled) + .control {
    border-color: var(--radio-border-hover);
  }

  .native:checked + .control {
    border-color: var(--radio-border-selected);
    border-width: 7px;
  }

  .native:focus-visible + .control {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .native:disabled + .control {
    cursor: not-allowed;
  }

  .native:not(:checked):disabled + .control {
    border-color: var(--radio-border-disabled);
  }

  .native:checked:disabled + .control {
    border-color: var(--radio-border-selected);
    opacity: 0.3;
  }

  :host([error]) .native:not(:disabled) + .control {
    border-color: var(--radio-border-error);
  }

  :host([error]:hover) .native:not(:checked):not(:disabled) + .control {
    border-color: var(--radio-border-error);
  }
`);

class OXRadioButton extends HTMLElement {
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
      if (input && !input.disabled && !input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  render() {
    const checked = this.hasAttribute('checked') ? 'checked' : '';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const value = this.getAttribute('value') || '';

    this.shadowRoot.innerHTML = `
      <input class="native" type="radio" value="${value}" ${checked} ${disabled}>
      <span class="control" aria-hidden="true"></span>`;
  }
}

customElements.define('ox-radio-button', OXRadioButton);
