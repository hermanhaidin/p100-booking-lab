/* Navigation bar (immersive)
   API: <ox-navbar heading="Title" subtitle="Hint" leading="back|close|none" collapsed no-sticky>
          <ox-icon-button slot="actions" icon="share" label="Share"></ox-icon-button>
          <div slot="bar-content">...</div>
          <div slot="accessory">...</div>
        </ox-navbar>
   CSS: --ox-navbar-bg, --ox-navbar-gutter, --ox-navbar-bar-pad
   Events: ox-back, ox-close */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --_bg: var(--ox-navbar-bg, var(--color-surface-canvas));
    --_ease: cubic-bezier(.4,0,.2,1);
    --_mix: color-mix(in srgb, var(--color-content-tertiary) 34%, transparent);
    --_gutter: var(--ox-navbar-gutter, var(--spacing-xs));
    --_bar-pad: var(--ox-navbar-bar-pad, var(--spacing-4xs));
    --_btn: 48px;
    --_overlay-pad: calc(var(--_btn) + var(--_bar-pad) + var(--spacing-4xs));
    background: var(--_bg);
    display: block;
  }
  :host([hidden]) { display: none; }

  .bar {
    align-items: center;
    background: var(--_bg);
    box-shadow: inset 0 calc(var(--stroke-sm, 1px) * -1) 0 transparent;
    display: flex;
    min-height: var(--_btn);
    padding: 0 var(--_bar-pad);
    position: sticky;
    top: 0;
    transition: box-shadow 150ms var(--_ease);
    z-index: 2;
  }
  :host([no-sticky]) .bar { position: relative; }
  :host([scrolled]) .bar { box-shadow: inset 0 calc(var(--stroke-sm, 1px) * -1) 0 var(--_mix); }

  .bar ox-icon-button {
    --icon-button-margin: 0;
    position: relative;
    z-index: 1;
  }
  .leading[hidden] { display: none; }

  .trailing {
    display: flex;
    margin-left: auto;
    position: relative;
    z-index: 1;
  }
  .trailing ::slotted(ox-icon-button),
  .trailing ::slotted(ox-text-button) {
    --icon-button-margin: 0;
  }
  .trailing[hidden] { display: none; }

  /* Compact titles + bar-content share overlay positioning */
  .compact,
  .bar-content {
    align-items: center;
    display: flex;
    inset: 0;
    justify-content: center;
    padding: 0 var(--_overlay-pad);
    pointer-events: none;
    position: absolute;
    z-index: 1;
  }
  :host([has-multiple-actions]) .compact,
  :host([has-multiple-actions]) .bar-content {
    padding: 0 calc(var(--_overlay-pad) * 2);
  }

  .compact {
    flex-direction: column;
    opacity: 0;
    overflow: hidden;
    text-align: center;
    transition: opacity 150ms var(--_ease);
  }
  :host([collapsed]) .compact,
  :host([scrolled]) .compact { opacity: 1; }

  .bar-content { display: none; }
  .bar-content ::slotted(*) { pointer-events: auto; }
  :host([has-bar-content]) .bar-content { display: flex; }
  :host([has-bar-content]) .compact { display: none; }

  .compact-heading,
  .compact-subtitle {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .compact-heading { color: var(--color-content-primary); }
  .compact-subtitle { color: var(--color-content-secondary); }

  .expanded { padding: var(--spacing-3xs) var(--_gutter); }
  :host([collapsed]) .expanded { display: none; }

  .heading {
    color: var(--color-content-primary);
    margin: 0;
  }
  .subtitle {
    color: var(--color-content-primary);
    margin: 0;
    padding-top: var(--spacing-3xs);
  }

  .separator {
    background: var(--_mix);
    display: none;
    height: var(--stroke-sm, 1px);
  }
  :host([collapsed]) .separator { display: block; }

  .accessory { display: contents; }

  @media (min-width: 600px) {
    :host {
      --_bar-pad: var(--ox-navbar-bar-pad, var(--spacing-sm));
      --_btn: calc(48px + var(--spacing-3xs));
      --_gutter: var(--ox-navbar-gutter, var(--spacing-lg));
    }
    .expanded { padding-bottom: var(--spacing-2xs); }
  }

  @media (prefers-reduced-motion: reduce) {
    .compact,
    .bar { transition: none; }
  }
`);

class OxNavbar extends HTMLElement {
  static observedAttributes = ['heading', 'subtitle', 'leading'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() { this._connected = true; this.render(); this.shadowRoot.addEventListener('click', this._onClick); }
  disconnectedCallback() { this._mo?.disconnect(); this.shadowRoot.removeEventListener('click', this._onClick); }
  attributeChangedCallback() { if (this._connected) this.render(); }

  _onClick(e) {
    const btn = e.target.closest('.leading');
    if (!btn) return;
    const leading = this.getAttribute('leading') || 'back';
    this.dispatchEvent(new CustomEvent(leading === 'close' ? 'ox-close' : 'ox-back', { bubbles: true, composed: true }));
  }

  _observeSlots() {
    const actSlot = this.shadowRoot.querySelector('slot[name="actions"]');
    if (actSlot) { actSlot.addEventListener('slotchange', () => this._syncActions()); this._syncActions(); }
    const barSlot = this.shadowRoot.querySelector('slot[name="bar-content"]');
    if (barSlot) { barSlot.addEventListener('slotchange', () => this._syncBarContent()); this._syncBarContent(); }
    this._mo?.disconnect();
    this._mo = new MutationObserver(() => this._syncActions());
    this._mo.observe(this, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  }

  _syncBarContent() {
    const slot = this.shadowRoot.querySelector('slot[name="bar-content"]');
    if (!slot) return;
    this.toggleAttribute('has-bar-content', slot.assignedElements({ flatten: true }).filter(el => !el.hidden).length > 0);
  }

  _syncActions() {
    const slot = this.shadowRoot.querySelector('slot[name="actions"]');
    if (!slot) return;
    const n = slot.assignedElements({ flatten: true }).filter(el => el.tagName !== 'SLOT' && !el.hidden).length;
    this.toggleAttribute('has-actions', n > 0);
    this.toggleAttribute('has-multiple-actions', n > 1);
  }

  render() {
    const heading = this.getAttribute('heading') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const leading = this.getAttribute('leading') || 'back';
    const icon = leading === 'close' ? 'close' : 'arrow_back_ios_new';
    const label = leading === 'close' ? 'Close' : 'Go back';

    this.shadowRoot.innerHTML = `
      <header class="bar">
        <ox-icon-button class="leading" icon="${icon}" label="${label}"${leading === 'none' ? ' hidden' : ''}></ox-icon-button>
        ${heading || subtitle ? `<div class="compact">
          ${heading ? `<span class="compact-heading text-copy-large-heavy">${heading}</span>` : ''}
          ${subtitle ? `<span class="compact-subtitle text-copy-small-regular">${subtitle}</span>` : ''}
        </div>` : ''}
        <div class="bar-content"><slot name="bar-content"></slot></div>
        <div class="trailing"><slot name="actions"></slot></div>
      </header>
      ${heading || subtitle ? `<div class="expanded">
        ${heading ? `<h2 class="heading text-title-medium-heavy-caps">${heading}</h2>` : ''}
        ${subtitle ? `<p class="subtitle text-copy-medium-regular">${subtitle}</p>` : ''}
      </div>` : ''}
      <div class="accessory"><slot name="accessory"></slot></div>
      <div class="separator"></div>`;
    this._observeSlots();
  }
}

customElements.define('ox-navbar', OxNavbar);
