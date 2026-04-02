/* Text field with floating label
   Form input with floating label, error state, optional trailing icon.
   API: <ox-text-field label="Email" type="email" autocomplete="email"
          required error error-text="Invalid entry" trailing-icon="help">
        </ox-text-field> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  :host([hidden]) { display: none; }

  .field {
    background-color: var(--color-surface-container);
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: var(--radius-md);
    box-sizing: border-box;
    height: 52px;
    position: relative;
    transition: border-color 150ms ease;
  }

  .field:focus-within {
    border-color: transparent;
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: 0;
  }

  :host([error]) .field {
    border-color: transparent;
    outline: var(--stroke-lg) solid var(--color-content-extended-error);
    outline-offset: 0;
  }

  :host([error]) .field:focus-within {
    outline-color: var(--color-overlay-focus);
  }

  :host([disabled]) .field {
    opacity: 0.3;
    pointer-events: none;
  }

  .native {
    background: transparent;
    border: 0;
    border-radius: inherit;
    box-sizing: border-box;
    caret-color: var(--color-overlay-focus);
    color: var(--color-content-primary);
    height: 100%;
    outline: none;
    padding: 20px var(--spacing-2xs) 4px;
    width: 100%;
  }

  :host([trailing-icon]) .native {
    padding-right: calc(var(--spacing-2xs) + 24px + var(--spacing-3xs));
  }

  .leading {
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: center;
    left: var(--spacing-2xs);
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
  }

  :host([leading-icon]) .native {
    padding-left: calc(var(--spacing-2xs) + 24px + var(--spacing-3xs));
  }

  :host([leading-icon]) .label {
    left: calc(var(--spacing-2xs) + 24px + var(--spacing-3xs));
  }

  .label {
    color: var(--color-content-secondary);
    left: var(--spacing-2xs);
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left top;
    transition: top 150ms ease, transform 150ms ease, color 150ms ease;
  }

  .field:focus-within .label,
  .native:not(:placeholder-shown) + .label {
    color: var(--color-content-primary);
    top: var(--spacing-4xs);
    transform: scale(0.75);
  }

  .trailing {
    position: absolute;
    right: var(--spacing-2xs);
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  .error-row {
    align-items: center;
    color: var(--color-content-extended-error);
    display: flex;
    gap: var(--spacing-4xs);
    margin-top: var(--spacing-4xs);
  }

  .error-row[hidden] {
    display: none;
  }

  .error-icon {
    flex: 0 0 auto;
    font-size: 16px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
    height: 16px;
    width: 16px;
  }
`);

class OxTextField extends HTMLElement {
  static observedAttributes = [
    'label', 'type', 'autocomplete', 'maxlength', 'required',
    'error', 'error-text', 'trailing-icon', 'trailing-label',
    'leading-icon', 'value', 'disabled', 'name',
  ];

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

    if (name === 'value') {
      input.value = this.getAttribute('value') || '';
    } else if (name === 'disabled') {
      input.disabled = this.hasAttribute('disabled');
    } else if (name === 'error' || name === 'error-text') {
      this._syncError();
    } else {
      this.render();
    }
  }

  get value() {
    const input = this.shadowRoot.querySelector('.native');
    return input ? input.value : this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttribute('value', val);
    const input = this.shadowRoot.querySelector('.native');
    if (input) input.value = val;
  }

  _listen() {
    this.shadowRoot.addEventListener('input', (e) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      this.dispatchEvent(new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: e.target.value },
      }));
    });

    this.shadowRoot.addEventListener('change', (e) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: e.target.value },
      }));
    });
  }

  _syncError() {
    const errorRow = this.shadowRoot.querySelector('.error-row');
    if (!errorRow) return;
    const hasError = this.hasAttribute('error');
    const errorText = this.getAttribute('error-text') || '';
    errorRow.hidden = !(hasError && errorText);
    const textEl = errorRow.querySelector('.error-text');
    if (textEl) textEl.textContent = errorText;
  }

  render() {
    const label = this.getAttribute('label') || '';
    const type = this.getAttribute('type') || 'text';
    const autocomplete = this.getAttribute('autocomplete');
    const maxlength = this.getAttribute('maxlength');
    const disabled = this.hasAttribute('disabled');
    const value = this.getAttribute('value') || '';
    const name = this.getAttribute('name') || '';
    const trailingIcon = this.getAttribute('trailing-icon');
    const trailingLabel = this.getAttribute('trailing-label') || '';
    const leadingIcon = this.getAttribute('leading-icon');
    const hasError = this.hasAttribute('error');
    const errorText = this.getAttribute('error-text') || '';

    const acAttr = autocomplete ? ` autocomplete="${autocomplete}"` : '';
    const mlAttr = maxlength ? ` maxlength="${maxlength}"` : '';
    const nameAttr = name ? ` name="${name}"` : '';

    const leadingHtml = leadingIcon
      ? `<span class="leading material-symbols-outlined">${leadingIcon}</span>`
      : '';

    const trailingHtml = trailingIcon
      ? `<ox-icon-button class="trailing" kind="primary" size="large" icon="${trailingIcon}" label="${trailingLabel}"></ox-icon-button>`
      : '';

    const errorHidden = !(hasError && errorText);

    this.shadowRoot.innerHTML = `
      <div class="field">
        ${leadingHtml}
        <input class="native text-copy-large-regular" type="${type}" placeholder=" "${acAttr}${mlAttr}${nameAttr} value="${value}" ${disabled ? 'disabled' : ''}>
        <label class="label text-copy-large-regular">${label}</label>
        ${trailingHtml}
      </div>
      <div class="error-row" ${errorHidden ? 'hidden' : ''}>
        <span class="error-icon material-symbols-outlined">error</span>
        <span class="error-text text-copy-small-regular">${errorText}</span>
      </div>`;
  }
}

customElements.define('ox-text-field', OxTextField);
