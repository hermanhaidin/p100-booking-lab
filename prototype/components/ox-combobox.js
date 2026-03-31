/* Combobox — dropdown selector with inline filtering
   Type in the field to filter options. Options set programmatically via setOptions().
   Each option can have a displayValue for compact display in the field.
   API: <ox-combobox label="Country" value="US" required dropdown-width="400px"></ox-combobox> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    position: relative;
  }

  :host([hidden]) { display: none; }

  .field {
    align-items: center;
    background-color: var(--color-surface-container);
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: var(--radius-md);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    gap: var(--spacing-3xs);
    height: 52px;
    padding: 0 var(--spacing-2xs);
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
    cursor: not-allowed;
    opacity: 0.3;
    pointer-events: none;
  }

  .leading {
    align-items: center;
    align-self: center;
    display: flex;
    flex: 0 0 auto;
    height: 24px;
    justify-content: center;
    width: 24px;
  }

  .field:not(.has-value) .leading,
  .leading:empty {
    display: none;
  }

  .content {
    flex: 1;
    min-width: 0;
    position: relative;
    height: 100%;
  }

  .native {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    caret-color: var(--color-overlay-focus);
    color: var(--color-content-primary);
    cursor: pointer;
    height: 100%;
    outline: none;
    overflow: hidden;
    padding: 20px 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  :host([open]) .native {
    cursor: text;
  }

  .label {
    color: var(--color-content-secondary);
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left top;
    transition: top 150ms ease, transform 150ms ease, color 150ms ease;
  }

  /* Float label up: on focus, when has value, or when open */
  .field:focus-within .label,
  .native:not(:placeholder-shown) + .label,
  :host([open]) .label {
    color: var(--color-content-primary);
    top: var(--spacing-4xs);
    transform: scale(0.75);
  }

  /* Keep label primary when field has value after blur */
  .native:not(:placeholder-shown) + .label {
    color: var(--color-content-primary);
  }

  .arrow {
    color: var(--color-content-primary);
    flex: 0 0 auto;
    transition: transform 150ms ease;
  }

  :host([open]) .arrow {
    transform: rotate(180deg);
  }

  /* --- Dropdown --- */

  .dropdown {
    background-color: var(--color-surface-container);
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: var(--radius-lg);
    box-shadow: var(--elevation-medium);
    display: none;
    left: 0;
    max-height: 300px;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: calc(100% + var(--spacing-4xs));
    z-index: 100;
  }

  :host([open]) .dropdown {
    display: block;
  }

  .group-heading {
    color: var(--color-content-secondary);
    padding: var(--spacing-3xs) var(--spacing-xs);
  }

  .group-divider {
    border: 0;
    border-top: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 10%, transparent);
    margin: var(--spacing-4xs) 0;
  }

  .option {
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: var(--spacing-3xs);
    min-height: 44px;
    padding: var(--spacing-3xs) var(--spacing-xs);
  }

  .option:hover {
    background-color: var(--color-overlay-hover);
  }

  .option[aria-selected="true"] {
    background-color: color-mix(in srgb, var(--color-content-primary) 8%, transparent);
  }

  .option[hidden] { display: none; }

  .option-leading {
    flex: 0 0 auto;
  }

  /* --- Error row --- */

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

class OxCombobox extends HTMLElement {
  static observedAttributes = ['label', 'value', 'required', 'error', 'error-text', 'disabled', 'name', 'dropdown-width'];

  _options = [];
  _selectedOption = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
    this._onOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutsideClick);
  }

  attributeChangedCallback(name) {
    if (name === 'value') {
      this._syncSelection();
    } else if (name === 'error' || name === 'error-text') {
      this._syncError();
    } else {
      this.render();
      this._listen();
    }
  }

  setOptions(options) {
    this._options = options;
    this.render();
    this._listen();
    this._syncSelection();
  }

  _syncSelection() {
    const val = this.getAttribute('value');
    this._selectedOption = this._options.find((o) => o.value === val) || null;
    this._syncDisplay();
  }

  _syncDisplay() {
    const field = this.shadowRoot.querySelector('.field');
    const leading = this.shadowRoot.querySelector('.leading');
    const native = this.shadowRoot.querySelector('.native');
    if (!field) return;

    if (this._selectedOption) {
      field.classList.add('has-value');
      if (leading) leading.textContent = this._selectedOption.leading || '';
      if (native && !this.hasAttribute('open')) {
        native.value = this._selectedOption.displayValue || this._selectedOption.label || '';
      }
    } else {
      field.classList.remove('has-value');
      if (native && !this.hasAttribute('open')) native.value = '';
    }

    /* Update aria-selected in dropdown */
    const val = this.getAttribute('value');
    this.shadowRoot.querySelectorAll('.option').forEach((opt) => {
      opt.setAttribute('aria-selected', opt.dataset.value === val ? 'true' : 'false');
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

  _open() {
    if (this.hasAttribute('open')) return;
    this.setAttribute('open', '');
    document.addEventListener('click', this._onOutsideClick);
    const native = this.shadowRoot.querySelector('.native');
    if (native) {
      native.removeAttribute('readonly');
      native.value = '';
      requestAnimationFrame(() => native.focus());
    }
    this._filterOptions('');
  }

  _close() {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    document.removeEventListener('click', this._onOutsideClick);
    const native = this.shadowRoot.querySelector('.native');
    if (native) {
      native.setAttribute('readonly', '');
      if (this._selectedOption) {
        native.value = this._selectedOption.displayValue || this._selectedOption.label || '';
      } else {
        native.value = '';
      }
    }
  }

  _toggle() {
    if (this.hasAttribute('open')) {
      this._close();
    } else {
      this._open();
    }
  }

  _select(value) {
    this.setAttribute('value', value);
    this._syncSelection();
    this._close();
    const native = this.shadowRoot.querySelector('.native');
    if (native) native.blur();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value,
        label: this._selectedOption?.label || '',
        displayValue: this._selectedOption?.displayValue || this._selectedOption?.label || '',
      },
    }));
  }

  _filterOptions(query) {
    const lowerQuery = query.toLowerCase();
    this.shadowRoot.querySelectorAll('.option').forEach((opt) => {
      const label = (opt.dataset.label || '').toLowerCase();
      opt.hidden = lowerQuery && !label.includes(lowerQuery);
    });
    /* Hide group headings if all options in group are hidden */
    this.shadowRoot.querySelectorAll('.group-heading').forEach((heading) => {
      let next = heading.nextElementSibling;
      let anyVisible = false;
      while (next && !next.classList.contains('group-heading') && !next.classList.contains('group-divider')) {
        if (!next.hidden) anyVisible = true;
        next = next.nextElementSibling;
      }
      heading.hidden = !anyVisible;
    });
    this.shadowRoot.querySelectorAll('.group-divider').forEach((div) => {
      const prev = div.previousElementSibling;
      if (prev && prev.hidden) div.hidden = true;
      else div.hidden = false;
    });
  }

  _handleOutsideClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
      this._close();
    }
  }

  _listen() {
    const field = this.shadowRoot.querySelector('.field');
    const native = this.shadowRoot.querySelector('.native');
    const arrow = this.shadowRoot.querySelector('.arrow');

    if (arrow) {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggle();
      });
    }

    if (field) {
      field.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.hasAttribute('open')) {
          this._open();
        }
      });
    }

    if (native) {
      native.addEventListener('input', () => {
        if (this.hasAttribute('open')) {
          this._filterOptions(native.value);
        }
      });
      native.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._close();
      });
    }

    this.shadowRoot.querySelectorAll('.option').forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        this._select(opt.dataset.value);
      });
    });

    /* Prevent dropdown clicks from closing */
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    if (dropdown) {
      dropdown.addEventListener('mousedown', (e) => e.preventDefault());
      dropdown.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  render() {
    const label = this.getAttribute('label') || '';
    const hasError = this.hasAttribute('error');
    const errorText = this.getAttribute('error-text') || '';
    const errorHidden = !(hasError && errorText);
    const dropdownWidth = this.getAttribute('dropdown-width');

    /* Build option HTML grouped */
    let optionsHtml = '';
    let currentGroup = null;
    let hasAnyGroup = false;

    for (const opt of this._options) {
      if (opt.group && opt.group !== currentGroup) {
        if (currentGroup !== null) {
          optionsHtml += '<hr class="group-divider">';
        }
        optionsHtml += `<div class="group-heading text-copy-small-heavy-caps">${opt.group}</div>`;
        currentGroup = opt.group;
        hasAnyGroup = true;
      } else if (!opt.group && hasAnyGroup && currentGroup !== '__all__') {
        if (currentGroup !== null) {
          optionsHtml += '<hr class="group-divider">';
        }
        currentGroup = '__all__';
      }

      const leadingHtml = opt.leading
        ? `<span class="option-leading">${opt.leading}</span>`
        : '';
      optionsHtml += `<div class="option text-copy-medium-regular" role="option" data-value="${opt.value}" data-label="${opt.label}" aria-selected="false">${leadingHtml}<span>${opt.label}</span></div>`;
    }

    const selected = this._selectedOption;
    const hasValue = !!selected;
    const fieldClass = `field${hasValue ? ' has-value' : ''}`;
    const displayValue = selected ? (selected.displayValue || selected.label || '') : '';
    const dropdownStyle = dropdownWidth ? ` style="width: ${dropdownWidth}; right: auto;"` : '';

    this.shadowRoot.innerHTML = `
      <div class="${fieldClass}" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <span class="leading text-copy-xlarge-regular">${selected?.leading || ''}</span>
        <div class="content">
          <input class="native text-copy-large-regular" placeholder=" " readonly value="${displayValue}" autocomplete="off">
          <label class="label text-copy-large-regular">${label}</label>
        </div>
        <span class="arrow material-symbols-outlined" aria-hidden="true">expand_more</span>
      </div>
      <div class="dropdown" role="listbox"${dropdownStyle}>
        <div class="options">${optionsHtml}</div>
      </div>
      <div class="error-row" ${errorHidden ? 'hidden' : ''}>
        <span class="error-icon material-symbols-outlined">error</span>
        <span class="error-text text-copy-small-regular">${errorText}</span>
      </div>`;

    this._syncDisplay();
  }
}

customElements.define('ox-combobox', OxCombobox);
