/* Protection card component
   Complex card with radio, star rating, deductible, price, accordion.
   Renders both mobile and desktop layouts; CSS media queries toggle visibility.
   API: <ox-protection-card
          option-id="smart" title="Smart Protection" stars="2"
          deductible="No deductible" deductible-kind="success"
          daily-price="48.72" previous-price="81.20" price-suffix="/ day"
          badge-text="-40% online discount" badge-kind="brand"
          selected expanded
        >
          <ox-list-item slot="coverage" icon="check">Collision damages</ox-list-item>
        </ox-protection-card> */

import { baseStyles } from './shared/base-styles.js';
import { iconButtonStyles } from './shared/ox-icon-button-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    background-color: var(--color-surface-container);
    border: 0;
    border-radius: var(--radius-md);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0;
    height: 100%;
    overflow: hidden;
    padding: 0;
    position: relative;
  }

  :host([hidden]) { display: none; }

  :host::after {
    border: var(--stroke-sm) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: inherit;
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
    transition: border-color 150ms ease, border-width 150ms ease;
    z-index: 2;
  }

  :host([selected]) {
    z-index: 1;
  }

  :host([selected])::after {
    border-color: var(--color-content-primary);
    border-width: var(--stroke-md);
  }

  /* --- Radio control (inline, not ox-radio-button) --- */
  .radio-wrap {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    position: relative;
  }

  .radio-native {
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 1px;
  }

  .radio-control {
    background-color: transparent;
    border: var(--stroke-md) solid color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    border-radius: 999px;
    box-sizing: border-box;
    cursor: inherit;
    display: inline-block;
    height: 24px;
    transition: border-color 150ms ease, border-width 150ms ease;
    width: 24px;
  }

  .radio-wrap:hover .radio-native:not(:checked):not(:disabled) + .radio-control {
    border-color: var(--color-content-secondary);
  }

  .radio-native:checked + .radio-control {
    border-color: var(--color-content-primary);
    border-width: 7px;
  }

  .radio-native:focus-visible + .radio-control {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  /* --- Top / Bottom structure --- */
  .top {
    background-color: var(--color-surface-secondary-container);
    display: grid;
    gap: var(--spacing-3xs);
    padding: var(--spacing-xs);
  }

  .bottom {
    background-color: var(--color-surface-container);
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--spacing-2xs);
    padding: var(--spacing-xs);
  }

  /* --- Desktop layout elements --- */
  .summary {
    display: block;
  }

  .summary--meta {
    margin-top: 0;
  }

  .radio-label {
    align-items: start;
    cursor: pointer;
    display: block;
  }

  .summary-main {
    display: grid;
    gap: var(--spacing-3xs);
  }

  .summary-main--header {
    gap: 0;
  }

  .title-row {
    align-items: start;
    column-gap: var(--spacing-3xs);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    width: 100%;
  }

  .title-row .radio-wrap {
    align-self: start;
    flex: 0 0 auto;
    margin-left: 0;
  }

  .title {
    flex: 1 1 auto;
    margin: 0;
  }

  .title-main {
    align-items: start;
    column-gap: var(--spacing-3xs);
    display: flex;
    min-width: 0;
    width: 100%;
  }

  .title-stars {
    display: none;
    margin-left: auto;
  }

  .rating-row {
    align-items: center;
    column-gap: var(--spacing-3xs);
    display: flex;
    flex-wrap: nowrap;
    min-height: 24px;
    row-gap: 0;
  }

  .stars {
    color: var(--color-content-primary);
    display: inline-flex;
    gap: var(--spacing-5xs);
  }

  .stars .material-symbols-outlined {
    font-size: 16px;
    height: 16px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
    width: 16px;
  }

  .stars .star-filled,
  .title-stars .star-filled {
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* --- Mobile-only elements (hidden by default) --- */
  .mobile-top-row,
  .mobile-content {
    display: none;
  }

  /* --- Accordion button (hidden by default, shown on mobile) --- */
  .accordion-btn {
    align-items: center;
    border-radius: var(--radius-sm);
    color: var(--color-content-primary);
    display: none;
    height: 48px;
    justify-content: center;
    margin: calc(-1 * var(--spacing-3xs));
    min-height: 48px;
    min-width: 48px;
    width: 48px;
  }

  .accordion-icon {
    color: currentColor;
    display: block;
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  /* --- Deductible --- */
  .deductible {
    margin: 0;
  }

  .deductible--primary {
    color: var(--color-content-primary);
  }

  .deductible--success {
    color: var(--color-content-extended-success);
  }

  .deductible--error {
    color: var(--color-content-extended-error);
  }

  /* --- Price & meta --- */
  .price-row {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3xs);
    margin: 0;
  }

  .bottom-meta {
    margin-top: auto;
  }

  .bottom-meta--mobile {
    margin-top: 0;
  }

  .bottom-meta ox-badge {
    margin-top: var(--spacing-3xs);
  }

  .footer-text {
    margin: 0;
  }

  /* --- Coverage slot --- */
  .coverage {
    display: grid;
    gap: var(--spacing-2xs);
  }

  /* --- Mobile accordion mode (<=899px) --- */
  @media (max-width: 899px) {
    .accordion-btn {
      display: inline-flex;
    }

    .summary,
    .summary--header,
    .summary--meta {
      display: none;
    }

    .mobile-top-row {
      align-items: start;
      column-gap: var(--spacing-2xs);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    .mobile-top-row .radio-wrap {
      align-self: start;
      margin-top: 0;
    }

    .mobile-content {
      display: grid;
      gap: var(--spacing-3xs);
      min-width: 0;
    }

    .title-stars {
      display: inline-flex;
      gap: var(--spacing-5xs);
    }

    .title-stars .material-symbols-outlined {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }

    .summary--meta .rating-row {
      display: none;
    }

    .top {
      background-color: var(--color-surface-container);
      padding-bottom: var(--spacing-3xs);
    }

    .bottom {
      display: block;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      padding-top: 0;
      transition: max-height 300ms ease, opacity 300ms ease;
      will-change: max-height, opacity;
    }

    .bottom.is-expanded {
      max-height: 420px;
      opacity: 1;
    }

    ::slotted(:nth-child(1)) { opacity: 0; transform: translateY(-4px); transition: opacity 120ms ease, transform 120ms ease; }
    ::slotted(:nth-child(2)) { opacity: 0; transform: translateY(-4px); transition: opacity 120ms ease, transform 120ms ease; }
    ::slotted(:nth-child(3)) { opacity: 0; transform: translateY(-4px); transition: opacity 120ms ease, transform 120ms ease; }
    ::slotted(:nth-child(4)) { opacity: 0; transform: translateY(-4px); transition: opacity 120ms ease, transform 120ms ease; }

    .bottom.is-expanded ::slotted(:nth-child(1)) { opacity: 1; transform: translateY(0); transition-delay: 0ms; }
    .bottom.is-expanded ::slotted(:nth-child(2)) { opacity: 1; transform: translateY(0); transition-delay: 20ms; }
    .bottom.is-expanded ::slotted(:nth-child(3)) { opacity: 1; transform: translateY(0); transition-delay: 40ms; }
    .bottom.is-expanded ::slotted(:nth-child(4)) { opacity: 1; transform: translateY(0); transition-delay: 60ms; }

    .bottom .bottom-meta {
      display: none;
    }

    .top .bottom-meta--mobile {
      margin-top: 0;
    }

    .summary--header,
    .summary--meta {
      margin: 0;
    }
  }

  /* --- Desktop mode (>=900px) --- */
  @media (min-width: 900px) {
    .mobile-top-row { display: none; }
    .bottom-meta--mobile { display: none; }

    .title-row {
      align-items: start;
      column-gap: var(--spacing-3xs);
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .title-row .radio-wrap {
      margin-left: auto;
      order: 2;
    }

    .title-row .title-main {
      flex: 1 1 auto;
      order: 1;
    }
  }

  @media (min-width: 1200px) {
    .title-row {
      min-height: calc(var(--typography-font-size-small-title) * 2 * 1.2);
    }
  }
`);

class OXProtectionCard extends HTMLElement {
  static observedAttributes = [
    'option-id', 'title', 'selected', 'expanded', 'stars',
    'deductible', 'deductible-kind', 'daily-price', 'previous-price',
    'price-suffix', 'badge-text', 'badge-kind', 'footer-text',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, iconButtonStyles, styles];
  }

  connectedCallback() {
    this.render();
    this._listen();
  }

  attributeChangedCallback(name) {
    if (name === 'selected') {
      this._syncRadios();
      return;
    }
    if (name === 'expanded') {
      this._syncExpansion();
      return;
    }
    this.render();
  }

  _syncRadios() {
    const checked = this.hasAttribute('selected');
    this.shadowRoot.querySelectorAll('.radio-native').forEach(r => { r.checked = checked; });
  }

  _syncExpansion() {
    const expanded = this.hasAttribute('expanded');
    const bottom = this.shadowRoot.querySelector('.bottom');
    if (bottom) bottom.classList.toggle('is-expanded', expanded);
    this.setAttribute('aria-expanded', String(expanded));

    this.shadowRoot.querySelectorAll('.accordion-btn').forEach(btn => {
      const icon = btn.querySelector('.accordion-icon');
      if (icon) icon.textContent = expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
      const title = this.getAttribute('title') || 'details';
      btn.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${title} details`);
    });
  }

  get _hasGroup() {
    return !!this.closest('ox-protection-group');
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.closest('[data-info]')) {
        e.stopPropagation();
        return;
      }

      const toggleBtn = e.target.closest('.accordion-btn');
      if (toggleBtn) {
        e.stopPropagation();
        const wasExpanded = this.hasAttribute('expanded');
        const nextExpanded = !wasExpanded;
        if (!this._hasGroup) this.toggleAttribute('expanded', nextExpanded);
        this.dispatchEvent(new CustomEvent('protection-toggle', {
          bubbles: true, composed: true,
          detail: { optionId: this.getAttribute('option-id'), expanded: nextExpanded },
        }));
        return;
      }

      const optionId = this.getAttribute('option-id');
      this.dispatchEvent(new CustomEvent('protection-select', {
        bubbles: true, composed: true,
        detail: { optionId },
      }));
    });
  }

  _buildStars(count) {
    const out = [];
    for (let i = 0; i < 3; i++) {
      const filled = i < count;
      out.push(`<span class="material-symbols-outlined${filled ? ' star-filled' : ''}" aria-hidden="true">${filled ? 'star' : 'star_outline'}</span>`);
    }
    return out.join('');
  }

  _priceParts(amount) {
    if (amount == null) return null;
    const num = Number(amount);
    if (!Number.isFinite(num)) return null;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true,
    }).format(Math.abs(num));
    const [integer, decimal] = formatted.split('.');
    return { integer, decimal: `.${decimal}` };
  }

  render() {
    const optionId = this.getAttribute('option-id') || '';
    const title = this.getAttribute('title') || '';
    const selected = this.hasAttribute('selected');
    const expanded = this.hasAttribute('expanded');
    const stars = parseInt(this.getAttribute('stars'), 10) || 0;
    const deductible = this.getAttribute('deductible') || '';
    const deductibleKind = this.getAttribute('deductible-kind') || 'primary';
    const dailyPrice = this.getAttribute('daily-price');
    const previousPrice = this.getAttribute('previous-price');
    const priceSuffix = this.getAttribute('price-suffix') ?? '/ day';
    const badgeText = this.getAttribute('badge-text');
    const footerText = this.getAttribute('footer-text');

    const checkedAttr = selected ? 'checked' : '';
    const starsHtml = this._buildStars(stars);
    const expandedClass = expanded ? ' is-expanded' : '';
    const chevron = expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    const accordionLabel = `${expanded ? 'Collapse' : 'Expand'} ${title} details`;

    const daily = this._priceParts(dailyPrice);
    const prev = this._priceParts(previousPrice);
    const dailyPriceHtml = daily
      ? `<ox-price currency="$" integer="${daily.integer}" decimal="${daily.decimal}" suffix="${priceSuffix}"></ox-price>`
      : '';
    const prevPriceHtml = prev
      ? `<ox-price kind="secondary" size="medium" regular striked currency="$" integer="${prev.integer}" decimal="${prev.decimal}" suffix="${priceSuffix}"></ox-price>`
      : '';
    const priceRowHtml = dailyPriceHtml ? `<div class="price-row">${dailyPriceHtml}${prevPriceHtml}</div>` : '';

    const badgeHtml = badgeText
      ? `<ox-badge kind="brand" variant="outlined">${badgeText}</ox-badge>`
      : '';

    const footerHtml = footerText
      ? `<p class="footer-text text-title-small-heavy">${footerText}</p>`
      : '';

    const bottomMetaHtml = (priceRowHtml || footerHtml)
      ? `<div class="bottom-meta">${priceRowHtml}${footerHtml}</div>`
      : '';

    const mobileBottomMetaHtml = (priceRowHtml || badgeHtml || footerHtml)
      ? `<div class="bottom-meta bottom-meta--mobile">${priceRowHtml}${badgeHtml}${footerHtml}</div>`
      : '';

    this.setAttribute('aria-expanded', String(expanded));

    this.shadowRoot.innerHTML = `
      <div class="top">
        <!-- Mobile layout -->
        <div class="mobile-top-row">
          <span class="radio-wrap">
            <input class="radio-native" type="radio" value="${optionId}" ${checkedAttr}>
            <span class="radio-control" aria-hidden="true"></span>
          </span>
          <div class="mobile-content">
            <span class="title-main">
              <span class="title text-title-small-heavy">${title}</span>
              <span class="title-stars">${starsHtml}</span>
            </span>
            <p class="deductible deductible--${deductibleKind} text-copy-medium-heavy">${deductible}</p>
            ${mobileBottomMetaHtml}
          </div>
          <button type="button" class="accordion-btn icon-btn" aria-label="${accordionLabel}">
            <span class="accordion-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">${chevron}</span>
          </button>
        </div>

        <!-- Desktop layout -->
        <div class="summary summary--header">
          <label class="radio-label">
            <span class="summary-main summary-main--header">
              <span class="title-row">
                <span class="radio-wrap">
                  <input class="radio-native" type="radio" value="${optionId}" ${checkedAttr}>
                  <span class="radio-control" aria-hidden="true"></span>
                </span>
                <span class="title-main">
                  <span class="title text-title-small-heavy">${title}</span>
                  <span class="title-stars">${starsHtml}</span>
                </span>
              </span>
            </span>
          </label>
          <button type="button" class="accordion-btn icon-btn" aria-label="${accordionLabel}">
            <span class="accordion-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">${chevron}</span>
          </button>
        </div>

        <div class="summary summary--meta">
          <label class="radio-label">
            <span class="summary-main summary-main--meta">
              <span class="rating-row">
                <span class="stars">${starsHtml}</span>
                ${badgeHtml}
              </span>
              <p class="deductible deductible--${deductibleKind} text-copy-medium-heavy">${deductible}</p>
            </span>
          </label>
        </div>
      </div>

      <div class="bottom${expandedClass}">
        <div class="coverage"><slot name="coverage"></slot></div>
        ${bottomMetaHtml}
      </div>`;
  }
}

customElements.define('ox-protection-card', OXProtectionCard);
