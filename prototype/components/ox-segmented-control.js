/* Segmented control — pill-shaped tab switcher with animated indicator
   API: <ox-segmented-control>
          <button value="a">Label</button> ...
        </ox-segmented-control>
   2–4 segments, min 56px each, 2-line max with truncation.
   Keyboard: Tab → active segment, Arrow Left/Right to move.
   Events: ox-change { detail: { value } } */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background: var(--color-surface-secondary-container);
    border-radius: var(--radius-pill, 160px);
    display: inline-flex;
    min-height: 36px;
    position: relative;
  }
  :host([hidden]) { display: none; }

  .track {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    position: relative;
  }

  .indicator {
    background: var(--color-content-primary);
    border-radius: var(--radius-pill, 160px);
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: transform 150ms ease;
  }

  /* Typography via CSS — classes can't reach light-DOM slotted buttons */
  ::slotted(button) {
    all: unset;
    align-items: center;
    box-sizing: border-box;
    color: var(--color-content-primary);
    cursor: pointer;
    display: flex;
    font-family: var(--font-copy, "Helvetica Now Text", Helvetica, Arial, sans-serif);
    font-size: var(--typography-font-size-medium-copy);
    font-weight: 400;
    justify-content: center;
    letter-spacing: var(--typography-letter-spacing-copy, 0.12px);
    line-height: 1.5;
    max-height: calc(8px + 2lh);
    min-width: 56px;
    overflow: hidden;
    padding: 4px var(--spacing-md);
    position: relative;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
  }
  ::slotted(button[aria-selected="true"]) {
    color: var(--color-on-content-extended-on-brand);
    font-weight: 700;
  }
  ::slotted(button:focus-visible) {
    border-radius: var(--radius-pill, 160px);
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  @media (prefers-reduced-motion: reduce) {
    .indicator { transition: none; }
  }
`);

class OxSegmentedControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<div class="track"><div class="indicator"></div><slot></slot></div>`;
    this.setAttribute('role', 'tablist');
    this.addEventListener('click', this);
    this.addEventListener('keydown', this);
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this._init());
    this._init();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this);
    this.removeEventListener('keydown', this);
  }

  handleEvent(e) {
    if (e.type === 'keydown') { this._onKey(e); return; }
    const btn = e.target.closest('button');
    if (!btn || btn.getAttribute('aria-selected') === 'true') return;
    this._select(btn);
  }

  _onKey(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const btns = this._buttons();
    const idx = btns.findIndex(b => b.getAttribute('aria-selected') === 'true');
    if (idx < 0) return;
    const next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
    if (next < 0 || next >= btns.length) return;
    this._select(btns[next]);
    btns[next].focus();
    e.preventDefault();
  }

  _buttons() { return [...this.querySelectorAll(':scope > button')]; }

  _init() {
    const btns = this._buttons();
    if (!btns.length) return;
    if (!btns.some(b => b.getAttribute('aria-selected') === 'true')) {
      btns[0].setAttribute('aria-selected', 'true');
    }
    btns.forEach(b => {
      b.setAttribute('role', 'tab');
      b.setAttribute('tabindex', b.getAttribute('aria-selected') === 'true' ? '0' : '-1');
    });
    this._updateIndicator(false);
  }

  _select(btn) {
    this._buttons().forEach(b => {
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    this._updateIndicator(true);
    this.dispatchEvent(new CustomEvent('ox-change', {
      bubbles: true, composed: true,
      detail: { value: btn.getAttribute('value') || btn.textContent.trim() }
    }));
  }

  _updateIndicator(animate) {
    const btns = this._buttons();
    const count = btns.length;
    const index = btns.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const ind = this.shadowRoot.querySelector('.indicator');
    if (!ind || index < 0 || !count) return;
    if (!animate) ind.style.transition = 'none';
    ind.style.width = `${100 / count}%`;
    ind.style.transform = `translateX(${index * 100}%)`;
    /* Force reflow so the position snaps before re-enabling transition */
    if (!animate) { ind.offsetHeight; ind.style.transition = ''; }
  }
}

customElements.define('ox-segmented-control', OxSegmentedControl);
