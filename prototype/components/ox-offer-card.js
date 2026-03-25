/* Offer card — vehicle rental offer card
   Card shell split into top content, centered media, and bottom content.
   Variant modifiers control the radial gradient overlay on the top half.
   Self-renders ox-badge, ox-price, and ox-list-item from data attributes.

   Attributes:
     variant     — default | premium | guaranteed (auto-derived from model-label)
     title       — vehicle name (e.g. "BMW 3 Series")
     subtitle    — e.g. "Full-size Elite Wagon Automatic"
     image       — vehicle image URL
     active      — boolean, brand-colored outline + downward triangle indicator
     offer-index — data identifier for which offer this card represents
     model-label — "Premium brand" | "Or similar model" | "Guaranteed model"
     specs       — comma-separated, e.g. "5 seats,4 suitcases,Automatic"
     badges      — comma-separated, e.g. "Hot offer" or "Hot offer,Four-Wheel Drive Guaranteed"
     included    — e.g. "Unlimited kilometers" or "1,200 kilometers included"
     daily-price — e.g. "107.64"
     total-price — e.g. "649.72"
     daily-suffix — default "/ day"
     total-suffix — default "total"
     currency    — default "$"

   Events (bubbles, composed):
     offer-card-click — { offerIndex } — fired on card click

   API: <ox-offer-card
          title="BMW 3 Series Touring"
          subtitle="Full-size Elite Wagon Automatic"
          image="..."
          model-label="Premium brand"
          specs="5 seats,4 suitcases,Automatic"
          badges="Hot offer"
          included="Unlimited kilometers"
          daily-price="107.64"
          total-price="649.72"
          offer-index="0"
          active
        ></ox-offer-card> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --offer-card-active-indicator-width: 20px;
    --offer-card-active-indicator-height: 10px;
    display: block;
  }

  :host([hidden]) { display: none; }

  .card {
    background-color: var(--color-surface-container);
    background-image:
      linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.08) 45%, rgba(0, 0, 0, 0.58) 100%),
      url("https://img.sixt.com/1600/6f09b0e8-6820-4ac0-bedd-5797e9814c18.jpg");
    background-position: center;
    background-size: cover;
    border: none;
    border-radius: var(--radius-lg);
    color: inherit;
    cursor: pointer;
    display: block;
    outline: var(--stroke-xl) solid transparent;
    outline-offset: var(--stroke-xl);
    overflow: hidden;
    position: relative;
    text-decoration: none;
    transition: outline-color 150ms ease;
  }

  .card::before {
    content: "";
    height: 50%;
    inset: 0 0 auto 0;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }

  /* Variant overlays */
  :host([variant="default"]) .card::before,
  :host(:not([variant])) .card::before {
    display: none;
  }

  :host([variant="premium"]) .card::before {
    background: var(--radial-gradient-brand-top-trailing);
  }

  :host([variant="guaranteed"]) .card::before {
    background: var(--radial-gradient-gold-top-trailing);
  }

  /* Hover / focus / active states */
  .card:hover {
    outline-color: var(--color-content-secondary);
  }

  .card:focus-visible {
    outline-color: var(--color-overlay-focus);
  }

  :host([active]) .card {
    outline-color: var(--color-content-extended-brand);
    overflow: visible;
  }

  :host([active]) .card::after {
    background-color: var(--color-content-extended-brand);
    bottom: calc(-1 * (var(--stroke-xl) + var(--offer-card-active-indicator-height)));
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    content: "";
    height: var(--offer-card-active-indicator-height);
    left: 50%;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    width: var(--offer-card-active-indicator-width);
    z-index: 3;
  }

  /* Top block */
  .top {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xs);
    inset: 0 0 auto 0;
    padding: var(--spacing-xs) var(--spacing-xs) 0;
    position: absolute;
    z-index: 2;
  }

  .heading p { margin: 0; }

  .title, .subtitle {
    color: var(--color-content-primary);
  }

  .badges {
    align-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3xs);
    padding-top: var(--spacing-3xs);
  }

  /* Centered media */
  .media {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-block: var(--spacing-5xl);
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .media img {
    aspect-ratio: 3 / 2;
    display: block;
    height: auto;
    object-fit: cover;
    width: 100%;
  }

  /* Bottom block */
  .bottom {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xs);
    inset: auto 0 0 0;
    justify-content: flex-end;
    padding: 0 var(--spacing-xs) var(--spacing-xs);
    position: absolute;
    z-index: 2;
  }

  .hot-offer-badge {
    align-self: flex-start;
  }

  .pricing {
    align-items: baseline;
    display: flex;
    gap: var(--spacing-3xs);
  }

  .bottom-badges {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3xs);
  }
`);

class OXOfferCard extends HTMLElement {
  static observedAttributes = [
    'variant', 'title', 'subtitle', 'image', 'active', 'offer-index',
    'model-label', 'specs', 'badges', 'included',
    'daily-price', 'total-price', 'daily-suffix', 'total-suffix', 'currency',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.setAttribute('data-p100-theme', 'option-light');
    this._syncVariant();
    this.render();
    this._listen();
  }

  attributeChangedCallback(name) {
    if (name === 'model-label') {
      this._syncVariant();
    }
    this.render();
  }

  _syncVariant() {
    const modelLabel = this.getAttribute('model-label');
    if (!modelLabel) return;
    const derived = modelLabel === 'Premium brand' ? 'premium'
      : modelLabel === 'Guaranteed model' ? 'guaranteed'
      : 'default';
    if (this.getAttribute('variant') !== derived) {
      this.setAttribute('variant', derived);
    }
  }

  _listen() {
    this.shadowRoot.addEventListener('click', (e) => {
      e.preventDefault();
      const offerIndex = this.getAttribute('offer-index');
      this.dispatchEvent(new CustomEvent('offer-card-click', {
        bubbles: true,
        composed: true,
        detail: { offerIndex: offerIndex !== null ? Number(offerIndex) : null },
      }));
    });
  }

  _esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _parsePriceParts(priceStr) {
    if (!priceStr) return null;
    const parts = priceStr.split('.');
    return {
      integer: parts[0] || '0',
      decimal: parts[1] !== undefined ? `.${parts[1]}` : '.00',
    };
  }

  _getSpecBadge(spec) {
    const seatMatch = spec.match(/^(\d+)\s+seats$/i);
    if (seatMatch) return { icon: 'person', label: seatMatch[1] };

    const suitcaseMatch = spec.match(/^(\d+)\s+suitcases$/i);
    if (suitcaseMatch) return { icon: 'travel_luggage_and_bags', label: suitcaseMatch[1] };

    const bagsMatch = spec.match(/^(\d+)\s+bags$/i);
    if (bagsMatch) return { icon: 'travel_luggage_and_bags', label: bagsMatch[1] };

    if (/^automatic$/i.test(spec)) return { icon: 'hdr_auto', label: 'Automatic' };
    if (/^manual$/i.test(spec)) return { icon: 'auto_transmission', label: 'Manual' };
    if (/^electric$/i.test(spec)) return { icon: 'bolt', label: 'Electric' };
    if (/^hybrid$/i.test(spec)) return { icon: 'power', label: 'Hybrid' };
    if (/^\d+mi$/i.test(spec)) return { icon: 'battery_charging_full', label: spec };

    return { icon: 'info', label: spec };
  }

  _getModelPreset(modelLabel) {
    if (modelLabel === 'Premium brand') return 'premium-brand';
    if (modelLabel === 'Guaranteed model') return 'guaranteed-model';
    return 'similar-model';
  }

  render() {
    const title = this._esc(this.getAttribute('title') || '');
    const subtitle = this._esc(this.getAttribute('subtitle') || '');
    const image = this._esc(this.getAttribute('image') || '');
    const isActive = this.hasAttribute('active');
    const modelLabel = this.getAttribute('model-label') || '';
    const specsRaw = this.getAttribute('specs') || '';
    const badgesRaw = this.getAttribute('badges') || '';
    const included = this._esc(this.getAttribute('included') || '');
    const dailyPrice = this.getAttribute('daily-price') || '';
    const totalPrice = this.getAttribute('total-price') || '';
    const dailySuffix = this._esc(this.getAttribute('daily-suffix') || '/ day');
    const totalSuffix = this._esc(this.getAttribute('total-suffix') || 'total');
    const currency = this._esc(this.getAttribute('currency') || '$');

    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const badges = badgesRaw ? badgesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const isHotOffer = badges.includes('Hot offer');
    const bottomBadges = badges.filter(b => b !== 'Hot offer');

    // Badge assembly
    const modelBadgeHtml = modelLabel
      ? `<ox-badge preset="${this._getModelPreset(modelLabel)}" icon="info">${this._esc(modelLabel)}</ox-badge>`
      : '';

    const specBadgesHtml = specs.map(spec => {
      const badge = this._getSpecBadge(spec);
      return `<ox-badge preset="offer-spec" icon="${this._esc(badge.icon)}" filled>${this._esc(badge.label)}</ox-badge>`;
    }).join('');

    const hotOfferHtml = isHotOffer
      ? `<div class="hot-offer-badge"><ox-badge preset="hot-offer-promo">Hot offer</ox-badge></div>`
      : '';

    const includedHtml = included
      ? `<ox-list-item size="small" icon="check" filled style="--list-item-leading-icon-color: var(--color-content-extended-success)">${included}</ox-list-item>`
      : '';

    // Pricing assembly
    const daily = this._parsePriceParts(dailyPrice);
    const total = this._parsePriceParts(totalPrice);
    const dailyKind = isHotOffer ? ' kind="brand"' : '';

    const pricingHtml = daily
      ? `<div class="pricing">
          <ox-price size="large"${dailyKind} currency="${currency}" integer="${daily.integer}" decimal="${daily.decimal}" suffix="${dailySuffix}"></ox-price>
          ${total ? `<ox-price size="medium" regular kind="secondary" currency="${currency}" integer="${total.integer}" decimal="${total.decimal}" suffix="${totalSuffix}"></ox-price>` : ''}
        </div>`
      : '';

    const bottomBadgesHtml = bottomBadges.length
      ? `<div class="bottom-badges">${bottomBadges.map(b =>
          `<ox-badge variant="outlined" kind="primary">${this._esc(b)}</ox-badge>`
        ).join('')}</div>`
      : '';

    // Template
    this.shadowRoot.innerHTML = `
      <a href="#" class="card"
        aria-label="View ${title} offer"
        aria-expanded="${isActive ? 'true' : 'false'}">
        <div class="top">
          <div class="heading">
            <p class="title text-title-small-heavy-caps">${title}</p>
            <p class="subtitle text-copy-medium-regular">${subtitle}</p>
          </div>
          <div class="badges">${modelBadgeHtml}${specBadgesHtml}</div>
        </div>
        <div class="media">
          ${image ? `<img src="${image}" alt="${title}">` : ''}
        </div>
        <div class="bottom">
          ${hotOfferHtml}
          ${includedHtml}
          ${pricingHtml}
          ${bottomBadgesHtml}
        </div>
      </a>`;
  }
}

customElements.define('ox-offer-card', OXOfferCard);
