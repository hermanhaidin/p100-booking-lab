/* Quantity stepper component
   Morphs between a switch-like pill (value=0) and an extended counter (value≥1).

   API: <ox-stepper value="0" min="0" max="5" disabled></ox-stepper>

   Attributes:
     value    — current count (default 0)
     min      — minimum value (default 0)
     max      — maximum value (required)
     disabled — boolean; prevents interaction

   Events (bubbles, composed):
     change — { value } — fired when value changes via click or keyboard */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  :host([disabled]) {
    opacity: 0.3;
    pointer-events: none;
  }

  .stepper {
    align-items: center;
    background-color: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: flex-start;
    overflow: hidden;
    padding: var(--spacing-4xs);
    transition: width 150ms ease, background-color 150ms ease;
    width: 56px;
  }

  :host(:not([disabled])) .stepper:not(.is-expanded):hover {
    background-color: var(--color-content-secondary);
  }

  .stepper.is-expanded {
    background-color: var(--color-content-primary);
    cursor: default;
    justify-content: space-between;
    width: 96px;
  }

  .stepper:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .minus-btn,
  .plus-btn {
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    height: 24px;
    justify-content: center;
    padding: 0;
    width: 24px;
  }

  .minus-btn {
    color: var(--color-on-content-on-primary);
    display: none;
  }

  .plus-btn {
    display: none;
  }

  .is-expanded .minus-btn,
  .is-expanded .plus-btn {
    display: flex;
  }

  .minus-btn .material-symbols-outlined,
  .plus-btn .material-symbols-outlined {
    font-size: 20px;
    height: 20px;
    width: 20px;
  }

  .count {
    color: var(--color-on-content-on-primary);
    display: none;
    min-width: 16px;
    text-align: center;
    user-select: none;
  }

  .is-expanded .count {
    display: block;
  }

  .plus-circle {
    align-items: center;
    background-color: var(--color-on-content-on-primary);
    border-radius: 50%;
    display: flex;
    height: 24px;
    justify-content: center;
    width: 24px;
  }

  .plus-circle .material-symbols-outlined {
    color: var(--color-content-primary);
  }

  .plus-btn.is-at-max .plus-circle {
    background-color: transparent;
  }

  .plus-btn.is-at-max .plus-circle .material-symbols-outlined {
    color: var(--color-on-content-on-primary);
    opacity: 0.3;
  }

  .plus-btn.is-at-max {
    cursor: default;
  }

  /* Collapsed knob — mimics ox-switch off state */
  .knob {
    background-color: var(--color-on-content-on-secondary);
    border-radius: 50%;
    display: block;
    height: 24px;
    width: 24px;
  }

  .is-expanded .knob {
    display: none;
  }
`);

class OXStepper extends HTMLElement {
  static observedAttributes = ['value', 'min', 'max', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  attributeChangedCallback() {
    this._sync();
  }

  get _value() { return parseInt(this.getAttribute('value'), 10) || 0; }
  get _min() { return parseInt(this.getAttribute('min'), 10) || 0; }
  get _max() { return parseInt(this.getAttribute('max'), 10) || 99; }

  _setValue(next) {
    const clamped = Math.max(this._min, Math.min(this._max, next));
    this.setAttribute('value', String(clamped));
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true,
      detail: { value: clamped },
    }));
  }

  _sync() {
    const root = this.shadowRoot.querySelector('.stepper');
    if (!root) return;

    const val = this._value;
    const isExpanded = val > 0;
    root.classList.toggle('is-expanded', isExpanded);

    const count = root.querySelector('.count');
    if (count) count.textContent = String(val);

    const plusBtn = root.querySelector('.plus-btn');
    if (plusBtn) plusBtn.classList.toggle('is-at-max', val >= this._max);

    const minusBtn = root.querySelector('.minus-btn');
    if (minusBtn) minusBtn.disabled = val <= this._min;
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled')) return;

      const minus = e.target.closest('.minus-btn');
      const plus = e.target.closest('.plus-btn');

      if (minus) {
        e.stopPropagation();
        this._setValue(this._value - 1);
        return;
      }
      if (plus && this._value < this._max) {
        e.stopPropagation();
        this._setValue(this._value + 1);
        return;
      }

      /* Click on collapsed stepper (not on plus) acts as toggle on */
      if (this._value === 0) {
        this._setValue(1);
      }
    });

    this.shadowRoot.querySelector('.stepper')?.addEventListener('keydown', (e) => {
      if (this.hasAttribute('disabled')) return;
      let handled = false;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === '+') {
        this._setValue(this._value + 1);
        handled = true;
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === '-') {
        this._setValue(this._value - 1);
        handled = true;
      }
      if (handled) e.preventDefault();
    });
  }

  render() {
    const val = this._value;
    const expanded = val > 0;
    const atMax = val >= this._max;
    this.shadowRoot.innerHTML = `
      <div class="stepper${expanded ? ' is-expanded' : ''}" role="group"
           aria-label="Quantity" tabindex="0" aria-valuenow="${val}"
           aria-valuemin="${this._min}" aria-valuemax="${this._max}">
        <button type="button" class="minus-btn" aria-label="Decrease quantity"
          ${val <= this._min ? 'disabled' : ''}>
          <span class="material-symbols-outlined" aria-hidden="true">remove</span>
        </button>
        <span class="count text-copy-small-heavy" aria-live="polite">${val}</span>
        <button type="button" class="plus-btn${atMax ? ' is-at-max' : ''}" aria-label="Increase quantity">
          <span class="plus-circle">
            <span class="material-symbols-outlined" aria-hidden="true">add</span>
          </span>
        </button>
        <span class="knob"></span>
      </div>`;
  }
}

customElements.define('ox-stepper', OXStepper);
