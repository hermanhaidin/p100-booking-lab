/* Bottom-sheet / dialog
   API: <ox-bottomsheet heading="Title" subtitle="Sub" size="medium" small-title back open>
          <ox-icon-button slot="head-actions" icon="share" label="Share"></ox-icon-button>
          <p>Body</p>
          <ox-button slot="footer" kind="brand" size="large">Continue</ox-button>
          <ox-text-button slot="footer">Cancel</ox-text-button>
        </ox-bottomsheet>
   Sizes: "small" (420px), "medium" (560px), "full", default (640px, 1080px wide ≥1200px).
   Events: ox-close, ox-back. Methods: show(), hide(). */

import { baseStyles } from './shared/base-styles.js';

const LOCK = 'ox-bottomsheet-open';
let lockReady = false;
function ensureLock() {
  if (lockReady) return; lockReady = true;
  const s = document.createElement('style');
  s.textContent = `html:has(body.${LOCK}),body.${LOCK}{overflow:hidden}body.${LOCK}{position:fixed;width:100%}`;
  document.head.appendChild(s);
}

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --_bg: var(--color-surface-container);
    --_gutter: var(--spacing-xs);
    --_head-h: calc(48px + var(--spacing-4xs) * 2);
    --_ease: cubic-bezier(.4,0,.2,1);
    --_mix: color-mix(in srgb, var(--color-content-tertiary) 34%, transparent);
    --_max-w: 640px;
    align-items: flex-end; display: flex; inset: 0; justify-content: center;
    padding-top: calc(env(safe-area-inset-top,0px) + 10vh);
    pointer-events: none; position: fixed;
    transition: visibility 0s 300ms; visibility: hidden;
    z-index: var(--z-modal, 130);
  }
  :host([hidden]) { display: none; }
  :host([open]) { pointer-events: auto; transition-delay: 0s; visibility: visible; }

  .scrim { background: var(--color-overlay-dimming); inset: 0; opacity: 0; position: fixed; transition: opacity 200ms ease; }
  :host([open]) .scrim { opacity: 1; }
  .scrim-fill { display: none; }
  :host([size="full"]) .scrim-fill { background: var(--_bg); bottom: 0; display: block; height: 50vh; left: 0; opacity: 0; pointer-events: none; position: fixed; right: 0; transition: opacity 200ms ease; z-index: 0; }
  :host([size="full"][open]) .scrim-fill { opacity: 1; }

  .panel {
    background: var(--_bg); border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex; flex-direction: column; max-height: 100%; max-width: var(--_max-w);
    min-width: 320px; overflow: auto; overscroll-behavior: contain; position: relative;
    transform: translateY(100%); transition: transform 300ms var(--_ease); width: 100%; z-index: 1;
  }
  :host([open]) .panel { transform: none; }
  :host([size="full"]) .panel { box-shadow: none; height: 100%; }
  :host([small-title]) .panel { overflow: clip; }

  .head {
    align-items: center; background: var(--_bg); box-shadow: inset 0 calc(var(--stroke-sm,1px) * -1) 0 transparent;
    display: flex; flex-shrink: 0; min-height: var(--_head-h);
    padding: 0 var(--spacing-4xs); position: sticky; top: 0;
    transition: box-shadow 250ms var(--_ease); z-index: 2;
  }
  .head ox-icon-button { --icon-button-margin: 0; position: relative; z-index: 1; }
  .head-actions ::slotted(ox-icon-button) { --icon-button-margin: 0; }
  .head-actions { display: flex; margin-left: auto; }
  .head-actions[hidden] { display: none; }
  :host([small-title]) .head { background: transparent; border-bottom: var(--stroke-sm,1px) solid var(--_mix); position: relative; }
  :host([is-scrolled]) .head { box-shadow: inset 0 calc(var(--stroke-sm,1px) * -1) 0 var(--_mix); }

  /* --- Title + subtitle --- */
  .title, .subtitle { left: 0; margin: 0; right: 0; text-overflow: ellipsis; }
  .title {
    color: var(--color-content-primary);
    font-family: var(--font-display, "Helvetica Now Display", Helvetica, Arial, sans-serif);
    font-size: var(--typography-font-size-medium-title); font-weight: 900;
    letter-spacing: var(--typography-letter-spacing-large-title);
    line-height: 1; padding: var(--spacing-3xs) var(--_gutter) 0; text-transform: uppercase;
  }
  .subtitle {
    color: var(--color-content-primary);
    font-family: var(--font-copy, "Helvetica Now Text", Helvetica, Arial, sans-serif);
    font-size: var(--typography-font-size-medium-copy); font-weight: 400;
    letter-spacing: var(--typography-letter-spacing-copy, 0.12px);
    line-height: 1.5; padding: var(--spacing-xs) var(--_gutter) 0;
  }

  /* Small-title overlay */
  :host([small-title]) .title,
  :host([small-title]) .subtitle {
    height: var(--_head-h); overflow: hidden; padding: 0 var(--_head-h);
    pointer-events: none; position: absolute; text-align: center; white-space: nowrap;
  }
  :host([small-title]) .title {
    font-family: inherit; font-size: var(--typography-font-size-large-copy); font-weight: 700;
    letter-spacing: var(--typography-letter-spacing-copy, 0.12px);
    line-height: var(--_head-h); text-transform: none;
  }
  :host([small-title]) .subtitle {
    color: var(--color-content-secondary); font-family: inherit;
    font-size: var(--typography-font-size-small-copy); font-weight: inherit;
    line-height: var(--_head-h);
  }
  :host([small-title][has-multiple-actions]) .title,
  :host([small-title][has-multiple-actions]) .subtitle { padding: 0 calc(var(--_head-h) * 2); }
  :host([small-title][subtitle]:not([subtitle=""])) .title,
  :host([small-title][subtitle]:not([subtitle=""])) .subtitle { height: auto; line-height: 1.2; }
  :host([small-title][subtitle]:not([subtitle=""])) .title { top: calc(var(--_head-h) / 2 + 1px); transform: translateY(-100%); }
  :host([small-title][subtitle]:not([subtitle=""])) .subtitle { top: calc(var(--_head-h) / 2 + 5px); }

  /* Scrolled compact title in head */
  .head-title, .head-subtitle {
    inset: 0; opacity: 0; overflow: hidden; padding: 0 var(--_head-h);
    pointer-events: none; position: absolute; text-align: center;
    text-overflow: ellipsis; transition: opacity 250ms var(--_ease); white-space: nowrap;
  }
  .head-title { color: var(--color-content-primary); font-family: var(--font-copy, "Helvetica Now Text", Helvetica, Arial, sans-serif); font-size: var(--typography-font-size-large-copy); font-weight: 700; line-height: var(--_head-h); }
  .head-subtitle { color: var(--color-content-secondary); font-family: var(--font-copy, "Helvetica Now Text", Helvetica, Arial, sans-serif); font-size: var(--typography-font-size-small-copy); line-height: var(--_head-h); }
  .head-title.has-subtitle, .head-subtitle.has-subtitle { height: auto; inset: auto 0; line-height: 1.2; }
  .head-title.has-subtitle { top: calc(var(--_head-h) / 2 + 1px); transform: translateY(-100%); }
  .head-subtitle.has-subtitle { top: calc(var(--_head-h) / 2 + 5px); }
  :host([is-scrolled]) .head-title, :host([is-scrolled]) .head-subtitle { opacity: 1; }
  :host([has-multiple-actions]) .head-title, :host([has-multiple-actions]) .head-subtitle { padding: 0 calc(var(--_head-h) * 2); }

  /* Body */
  .body { flex: 1 0 auto; margin: var(--spacing-xs) var(--_gutter) 0; min-height: 0; overscroll-behavior: contain; }
  :host([small-title]) .body { flex-shrink: 1; overflow-y: auto; }
  .body > ::slotted(:first-child) { margin-top: 0; }
  .body > ::slotted(:last-child) { margin-bottom: 0; }
  :host([no-foot]) .body::after { content: ""; display: block; height: var(--_gutter); }

  /* Foot */
  .foot { background: var(--_bg); bottom: 0; display: flex; flex-direction: column; flex-shrink: 0; gap: var(--spacing-2xs); padding: var(--spacing-lg) var(--_gutter) var(--_gutter); position: sticky; }
  :host([small-title]) .foot { position: relative; }
  .foot[hidden] { display: none; }
  .foot ::slotted(ox-button) { display: flex; width: 100%; }
  .foot ::slotted(ox-text-button) { align-self: center; }

  /* ≥600px dialog */
  @media (min-width: 600px) {
    :host { --_gutter: var(--spacing-2xl); --_max-w: 560px; align-items: center; padding: var(--spacing-2xl); transition: visibility 0s 200ms; }
    .panel { border-radius: var(--radius-md); box-shadow: var(--elevation-large); opacity: 0; transform: scale(.95); transition: transform 200ms ease, opacity 200ms ease; width: var(--_max-w); }
    :host([open]) .panel { opacity: 1; }
    :host([size="full"]) .panel { box-shadow: var(--elevation-large); height: auto; max-height: 100%; }
    :host([size="full"]) .scrim-fill { display: none; }
  }
  :host([size="small"]) { --_gutter: var(--spacing-xs); --_max-w: 420px; }

  /* ≥1200px wide layout */
  @media (min-width: 1200px) {
    :host(:not([size="full"]):not([size="medium"]):not([size="small"])[heading]) { --_max-w: 1080px; }
    :host(:not([size="full"]):not([size="medium"]):not([size="small"])) .foot:not([hidden]) { align-items: center; display: grid; gap: var(--spacing-xs); grid-auto-columns: 1fr; grid-auto-flow: column; }
    :host(:not([size="full"]):not([size="medium"]):not([size="small"])) .foot::before { content: ""; }
    :host([has-text-button]:not([size="full"]):not([size="medium"]):not([size="small"])) .foot { grid-template-columns: auto; }
    :host(:not([size="full"]):not([size="medium"]):not([size="small"])) .foot ::slotted(ox-text-button) { grid-column: 1; order: -1; }
    :host(:not([size="full"]):not([size="medium"]):not([size="small"])) .foot ::slotted(ox-button[data-foot-primary]) { order: 1; }
  }
  @media (prefers-reduced-motion: reduce) { .panel, .scrim, .scrim-fill { transition: none; } }
`);

class OxBottomsheet extends HTMLElement {
  static observedAttributes = ['open', 'size', 'small-title', 'heading', 'subtitle', 'back'];

  constructor() {
    super();
    ensureLock();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
    this._scrollY = 0;
    this._onKey = this._onKey.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  connectedCallback() { this._connected = true; this.render(); this._listen(); }
  disconnectedCallback() { document.removeEventListener('keydown', this._onKey); this._mo?.disconnect(); }

  attributeChangedCallback(name) {
    if (name === 'open') { this.hasAttribute('open') ? this._onOpen() : this._onClose(); return; }
    if (name === 'size' || name === 'small-title') return;
    if (this._connected) this.render();
  }

  show() { this.setAttribute('open', ''); }
  hide() { if (this.hasAttribute('open')) this.removeAttribute('open'); }

  _dismiss() {
    this.hide();
    this.dispatchEvent(new CustomEvent('ox-close', { bubbles: true, composed: true }));
  }

  _onOpen() {
    this._scrollY = window.scrollY || 0;
    document.body.style.top = `-${this._scrollY}px`;
    document.body.classList.add(LOCK);
    window.scrollTo(0, 0);
    document.addEventListener('keydown', this._onKey);
    requestAnimationFrame(() => {
      this.shadowRoot.querySelector('.panel')?.addEventListener('scroll', this._onScroll, { passive: true });
    });
  }

  _onClose() {
    document.body.classList.remove(LOCK);
    document.body.style.top = '';
    window.scrollTo(0, this._scrollY);
    document.removeEventListener('keydown', this._onKey);
    this.removeAttribute('is-scrolled');
    this.shadowRoot.querySelector('.panel')?.removeEventListener('scroll', this._onScroll);
  }

  _onKey(e) { if (e.key === 'Escape') this._dismiss(); }

  _onScroll() {
    const p = this.shadowRoot.querySelector('.panel');
    if (p) this.toggleAttribute('is-scrolled', p.scrollTop > 72);
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('scrim') || e.target.closest('.close-btn')) { this._dismiss(); return; }
      if (e.target.closest('.back-btn')) this.dispatchEvent(new CustomEvent('ox-back', { bubbles: true, composed: true }));
    });
  }

  _observeSlots() {
    for (const [name, fn] of [['head-actions', '_syncActions'], ['footer', '_syncFooter']]) {
      const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
      if (slot) { slot.addEventListener('slotchange', () => this[fn]()); this[fn](); }
    }
    this._mo?.disconnect();
    this._mo = new MutationObserver(() => { this._syncActions(); this._syncFooter(); });
    this._mo.observe(this, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  }

  _syncActions() {
    const slot = this.shadowRoot.querySelector('slot[name="head-actions"]');
    if (!slot) return;
    const n = slot.assignedElements().filter(el => !el.hidden).length;
    this.shadowRoot.querySelector('.head-actions')?.toggleAttribute('hidden', n === 0);
    this.toggleAttribute('has-actions', n > 0);
    this.toggleAttribute('has-multiple-actions', n > 1);
  }

  _syncFooter() {
    const slot = this.shadowRoot.querySelector('slot[name="footer"]');
    if (!slot) return;
    const els = slot.assignedElements();
    this.shadowRoot.querySelector('.foot')?.toggleAttribute('hidden', els.length === 0);
    this.toggleAttribute('no-foot', els.length === 0);
    let first = true, hasText = false;
    for (const el of els) {
      if (el.localName === 'ox-button') {
        el.toggleAttribute('data-foot-primary', first); first = false;
        if (el.getAttribute('variant') === 'outlined') el.removeAttribute('variant');
      }
      if (el.localName === 'ox-text-button') hasText = true;
    }
    this.toggleAttribute('has-text-button', hasText);
  }

  render() {
    const t = this.getAttribute('heading') || '';
    const s = this.getAttribute('subtitle') || '';
    const back = this.hasAttribute('back');
    const sub = s ? ' has-subtitle' : '';

    this.shadowRoot.innerHTML = `
      <div class="scrim"></div><div class="scrim-fill"></div>
      <section class="panel" role="dialog" aria-modal="true" aria-label="${t || 'Dialog'}">
        <div class="head">
          <ox-icon-button class="${back ? 'back-btn' : 'close-btn'}" icon="${back ? 'arrow_back_ios_new' : 'close'}" label="${back ? 'Go back' : 'Close'}"></ox-icon-button>
          <div class="head-actions"><slot name="head-actions"></slot></div>
          ${t ? `<span class="head-title${sub}">${t}</span>` : ''}
          ${s ? `<span class="head-subtitle has-subtitle">${s}</span>` : ''}
        </div>
        ${t ? `<h2 class="title">${t}</h2>` : ''}
        ${s ? `<p class="subtitle">${s}</p>` : ''}
        <div class="body"><slot></slot></div>
        <div class="foot"><slot name="footer"></slot></div>
      </section>`;

    if (this.hasAttribute('open'))
      this.shadowRoot.querySelector('.panel')?.addEventListener('scroll', this._onScroll, { passive: true });
    this._observeSlots();
  }
}

customElements.define('ox-bottomsheet', OxBottomsheet);
