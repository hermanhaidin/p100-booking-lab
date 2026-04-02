/* Dialog (bottom-sheet on mobile, centered dialog on desktop)
   API: <ox-dialog heading="Title" subtitle="Sub" size="small|medium|full" small-title tall back open>
          <ox-icon-button slot="head-actions" icon="share" label="Share"></ox-icon-button>
          <p>Body</p>
          <ox-button slot="footer" kind="brand" size="large">Continue</ox-button>
        </ox-dialog>
   Events: ox-close, ox-back. Methods: show(), hide(). */

import { baseStyles } from './shared/base-styles.js';

const LOCK = 'ox-dialog-open';
const SCROLL_THRESHOLD = 72;
let lockReady = false;
function ensureLock() {
  if (lockReady) return; lockReady = true;
  const s = document.createElement('style');
  s.textContent = `html:has(body.${LOCK}),body.${LOCK}{overflow:hidden}\nbody.${LOCK}{position:fixed;width:100%}`;
  document.head.appendChild(s);
}

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --_bg: var(--color-surface-container);
    --_gutter: var(--spacing-xs);
    --_ease: cubic-bezier(.4,0,.2,1);
    --_max-w: 640px;
    align-items: flex-end;
    display: flex;
    inset: 0;
    justify-content: center;
    padding-top: calc(env(safe-area-inset-top, 0px) + 10vh);
    pointer-events: none;
    position: fixed;
    transition: visibility 0s 150ms;
    visibility: hidden;
    z-index: var(--z-modal, 130);
  }
  :host([hidden]) { display: none; }
  :host([open]) {
    pointer-events: auto;
    transition-delay: 0s;
    visibility: visible;
  }

  .scrim {
    background: var(--color-overlay-dimming);
    inset: 0;
    opacity: 0;
    position: fixed;
    transition: opacity 150ms ease;
  }
  :host([open]) .scrim { opacity: 1; }

  .panel {
    background: var(--_bg);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: var(--_max-w);
    min-width: 320px;
    overflow: auto;
    overscroll-behavior: contain;
    position: relative;
    transform: translateY(100%);
    transition: transform 150ms var(--_ease);
    width: 100%;
    z-index: 1;
  }
  :host([open]) .panel { transform: none; }
  :host([tall]) .panel { height: 100%; }
  :host([small-title]) .panel { overflow: clip; }

  ox-navbar {
    --ox-navbar-bg: var(--color-surface-container);
    --ox-navbar-bar-pad: var(--spacing-4xs);
    display: contents;
  }

  .body {
    flex: 1 0 auto;
    margin: var(--spacing-xs) var(--_gutter) 0;
    min-height: 0;
    overscroll-behavior: contain;
  }
  :host([small-title]) .body {
    flex-shrink: 1;
    overflow-y: auto;
  }
  .body > ::slotted(:first-child) { margin-top: 0; }
  .body > ::slotted(:last-child) { margin-bottom: 0; }
  :host([no-foot]) .body::after {
    content: "";
    display: block;
    height: var(--_gutter);
  }

  .foot {
    background: var(--_bg);
    bottom: 0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: var(--spacing-2xs);
    padding: var(--spacing-lg) var(--_gutter) var(--_gutter);
    position: sticky;
  }
  :host([small-title]) .foot { position: relative; }
  .foot[hidden] { display: none; }
  .foot ::slotted(ox-button) {
    display: flex;
    width: 100%;
  }
  .foot ::slotted(ox-text-button) { align-self: center; }

  /* Size: small */
  :host([size="small"]) { --_gutter: var(--spacing-xs); }
  :host([size="small"]) ox-navbar {
    --ox-navbar-gutter: var(--spacing-xs);
    --ox-navbar-bar-pad: var(--spacing-4xs);
  }

  /* Size: full — base (mobile) */
  :host([size="full"]) {
    --_bg: var(--color-surface-canvas);
    padding-top: 0;
  }
  :host([size="full"]) .scrim { display: none; }
  :host([size="full"]) .panel {
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    max-width: none;
    min-width: 0;
  }
  :host([size="full"]) ox-navbar {
    --ox-navbar-bg: var(--color-surface-canvas);
    --ox-navbar-bar-pad: initial;
    --ox-navbar-gutter: var(--spacing-xs);
  }
  :host([size="full"]) .body,
  :host([size="full"]) .foot {
    box-sizing: border-box;
    margin-inline: auto;
    padding-inline: var(--spacing-xs);
    width: 100%;
  }
  :host([size="full"]) .body { margin-top: var(--spacing-xs); }

  /* ≥600px — centered dialog */
  @media (min-width: 600px) {
    :host {
      --_gutter: var(--spacing-2xl);
      --_max-w: 560px;
      align-items: center;
      padding: var(--spacing-2xl);
    }
    :host([size="small"]) { --_max-w: 420px; }
    :host([size="full"]) { padding: 0; }

    .panel {
      border-radius: var(--radius-md);
      box-shadow: var(--elevation-large);
      opacity: 0;
      transform: scale(.95);
      transition: transform 150ms ease, opacity 150ms ease;
      width: var(--_max-w);
    }
    :host([open]) .panel { opacity: 1; }
    :host([size="full"]) .panel {
      border-radius: 0;
      box-shadow: none;
      opacity: 1;
      transform: none;
      width: 100%;
    }

    ox-navbar { --ox-navbar-gutter: var(--spacing-2xl); }

    :host([size="full"]) .body,
    :host([size="full"]) .foot { padding-inline: var(--spacing-lg); }
    :host([size="full"]) ox-navbar {
      --ox-navbar-gutter: var(--spacing-lg);
      --ox-navbar-bar-pad: var(--spacing-sm);
    }
  }

  /* ≥1200px — wide layout */
  @media (min-width: 1200px) {
    :host(:not([size="medium"]):not([size="small"])[heading]) { --_max-w: 1080px; }
    :host(:not([size="medium"]):not([size="small"])) .foot:not([hidden]) {
      align-items: center;
      display: grid;
      gap: var(--spacing-xs);
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
    }
    :host(:not([size="medium"]):not([size="small"])) .foot::before { content: ""; }
    :host([has-text-button]:not([size="medium"]):not([size="small"])) .foot { grid-template-columns: auto; }
    :host(:not([size="medium"]):not([size="small"])) .foot ::slotted(ox-text-button) {
      grid-column: 1;
      order: -1;
    }
    :host(:not([size="medium"]):not([size="small"])) .foot ::slotted(ox-button[data-foot-primary]) { order: 1; }

    :host([size="full"]) .body,
    :host([size="full"]) .foot { padding-inline: var(--spacing-4xl); }
    :host([size="full"]) ox-navbar {
      --ox-navbar-gutter: var(--spacing-4xl);
      --ox-navbar-bar-pad: calc(var(--spacing-4xl) - 12px);
    }
  }

  /* ≥1600px — max-width centering */
  @media (min-width: 1600px) {
    :host([size="full"]) .body,
    :host([size="full"]) .foot {
      max-width: 1440px;
      padding-inline: 0;
    }
    :host([size="full"]) ox-navbar {
      --ox-navbar-gutter: max(0px, calc((100vw - 1440px) / 2));
      --ox-navbar-bar-pad: max(0px, calc((100vw - 1440px) / 2 - 12px));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel,
    .scrim { transition: none; }
  }
`);

class OxDialog extends HTMLElement {
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

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKey);
    this.shadowRoot.querySelector('.panel')?.removeEventListener('scroll', this._onScroll);
    this._mo?.disconnect();
  }

  attributeChangedCallback(name) {
    if (name === 'open') { this.hasAttribute('open') ? this._onOpen() : this._onClose(); return; }
    if (name === 'size') return;
    if (name === 'small-title') {
      const nav = this.shadowRoot.querySelector('ox-navbar');
      if (nav) {
        const st = this.hasAttribute('small-title');
        nav.toggleAttribute('collapsed', st);
        nav.toggleAttribute('no-sticky', st);
        if (!st) { const p = this.shadowRoot.querySelector('.panel'); nav.toggleAttribute('scrolled', p ? p.scrollTop > SCROLL_THRESHOLD : false); }
      }
      return;
    }
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
    this.shadowRoot.querySelector('ox-navbar')?.removeAttribute('scrolled');
    this.shadowRoot.querySelector('.panel')?.removeEventListener('scroll', this._onScroll);
  }

  _onKey(e) { if (e.key === 'Escape') this._dismiss(); }

  _onScroll() {
    const p = this.shadowRoot.querySelector('.panel');
    const nav = this.shadowRoot.querySelector('ox-navbar');
    if (p && nav && !this.hasAttribute('small-title')) nav.toggleAttribute('scrolled', p.scrollTop > SCROLL_THRESHOLD);
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => { if (e.target.classList.contains('scrim')) this._dismiss(); });
    this.shadowRoot.addEventListener('ox-close', (e) => { e.stopPropagation(); this._dismiss(); });
    this.shadowRoot.addEventListener('ox-back', (e) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('ox-back', { bubbles: true, composed: true }));
    });
  }

  _observeSlots() {
    const actSlot = this.shadowRoot.querySelector('slot[name="head-actions"]');
    if (actSlot) { actSlot.addEventListener('slotchange', () => this._syncActions()); this._syncActions(); }
    const footSlot = this.shadowRoot.querySelector('slot[name="footer"]');
    if (footSlot) { footSlot.addEventListener('slotchange', () => this._syncFooter()); this._syncFooter(); }
    this._mo?.disconnect();
    this._mo = new MutationObserver(() => { this._syncActions(); this._syncFooter(); });
    this._mo.observe(this, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  }

  _syncActions() {
    const slot = this.shadowRoot.querySelector('slot[name="head-actions"]');
    const nav = this.shadowRoot.querySelector('ox-navbar');
    if (!slot || !nav) return;
    const n = slot.assignedElements().filter(el => !el.hidden).length;
    nav.toggleAttribute('has-actions', n > 0);
    nav.toggleAttribute('has-multiple-actions', n > 1);
  }

  _syncFooter() {
    const slot = this.shadowRoot.querySelector('slot[name="footer"]');
    if (!slot) return;
    const els = slot.assignedElements();
    this.shadowRoot.querySelector('.foot')?.toggleAttribute('hidden', els.length === 0);
    this.toggleAttribute('no-foot', els.length === 0);
    let first = true, hasText = false;
    for (const el of els) {
      if (el.localName === 'ox-button') { el.toggleAttribute('data-foot-primary', first); first = false; }
      if (el.localName === 'ox-text-button') hasText = true;
    }
    this.toggleAttribute('has-text-button', hasText);
  }

  render() {
    const heading = this.getAttribute('heading') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const back = this.hasAttribute('back');
    const smallTitle = this.hasAttribute('small-title');

    this.shadowRoot.innerHTML = `
      <div class="scrim"></div>
      <section class="panel" role="dialog" aria-modal="true" aria-label="${heading || 'Dialog'}">
        <ox-navbar ${heading ? `heading="${heading}"` : ''} ${subtitle ? `subtitle="${subtitle}"` : ''} leading="${back ? 'back' : 'close'}" ${smallTitle ? 'collapsed no-sticky' : ''}
        ><slot name="head-actions" slot="actions"></slot><slot name="head-bar-content" slot="bar-content"></slot></ox-navbar>
        <div class="body"><slot></slot></div>
        <div class="foot"><slot name="footer"></slot></div>
      </section>`;
    this._observeSlots();
    /* Re-attach scroll listener if dialog is open (render rebuilds the panel DOM) */
    if (this.hasAttribute('open'))
      this.shadowRoot.querySelector('.panel')?.addEventListener('scroll', this._onScroll, { passive: true });
  }
}

customElements.define('ox-dialog', OxDialog);
