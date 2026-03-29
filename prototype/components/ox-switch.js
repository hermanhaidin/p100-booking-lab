/* Toggle switch component
   API: <ox-switch checked disabled></ox-switch>

   Attributes:
     checked  — boolean; toggles on/off state
     disabled — boolean; prevents interaction

   Events (bubbles, composed):
     change — { checked } — fired when toggled via click or keyboard */

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

  .track {
    align-items: center;
    background-color: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    padding: var(--spacing-4xs);
    position: relative;
    transition: background-color 150ms ease;
    width: 56px;
  }

  :host([disabled]) .track {
    cursor: not-allowed;
  }

  :host(:not([checked]):not([disabled]):hover) .track {
    background-color: var(--color-content-secondary);
  }

  :host([checked]) .track {
    background-color: var(--color-content-primary);
  }

  :host([checked]:not([disabled]):hover) .track {
    cursor: pointer;
  }

  .track:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .knob {
    background-color: var(--color-on-content-on-secondary);
    border-radius: 50%;
    display: block;
    height: 24px;
    transform: translateX(0);
    transition: transform 150ms ease, background-color 150ms ease;
    width: 24px;
  }

  :host([checked]) .knob {
    background-color: var(--color-on-content-on-primary);
    transform: translateX(24px);
  }
`);

class OXSwitch extends HTMLElement {
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
    if (name === 'checked') {
      this._syncChecked();
      return;
    }
    if (name === 'disabled') {
      this._syncDisabled();
    }
  }

  _syncChecked() {
    const btn = this.shadowRoot.querySelector('.track');
    if (btn) btn.setAttribute('aria-checked', String(this.hasAttribute('checked')));
  }

  _syncDisabled() {
    const btn = this.shadowRoot.querySelector('.track');
    if (btn) btn.disabled = this.hasAttribute('disabled');
  }

  _listen() {
    this.shadowRoot.addEventListener('click', () => {
      if (this.hasAttribute('disabled')) return;
      this.toggleAttribute('checked');
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true, composed: true,
        detail: { checked: this.hasAttribute('checked') },
      }));
    });
  }

  render() {
    const checked = this.hasAttribute('checked');
    const disabled = this.hasAttribute('disabled');
    this.shadowRoot.innerHTML = `
      <button type="button" role="switch" class="track"
        aria-checked="${checked}" ${disabled ? 'disabled' : ''}>
        <span class="knob"></span>
      </button>`;
  }
}

customElements.define('ox-switch', OXSwitch);
