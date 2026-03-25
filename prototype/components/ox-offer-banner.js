/* Offer banner — promotional image card for the offer grid
   Full-bleed background image with gradient overlay, bottom-aligned
   text content, and a CTA pill button.

   Attributes:
     title    — headline text
     subtitle — supporting text
     cta-text — call-to-action button label
     image    — background image URL
     href     — link destination

   API: <ox-offer-banner title="Upgrade to premium" subtitle="..." cta-text="Learn more" image="..." href="#"></ox-offer-banner> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: flex;
  }

  :host([hidden]) { display: none; }

  .banner {
    border-radius: var(--radius-lg);
    color: var(--color-global-white);
    display: flex;
    min-height: 100%;
    outline: var(--stroke-xl) solid transparent;
    outline-offset: var(--stroke-xl);
    overflow: hidden;
    position: relative;
    text-decoration: none;
    transition: outline-color 150ms ease;
    width: 100%;
  }

  .banner:hover {
    outline-color: var(--color-content-secondary);
  }

  .banner:focus-visible {
    outline-color: var(--color-overlay-focus);
  }

  .banner::after {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-global-black) 13%, transparent) 0%,
        color-mix(in srgb, var(--color-global-black) 89%, transparent) 100%
      );
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
    z-index: 1;
  }

  .image {
    height: 100%;
    inset: 0;
    object-fit: cover;
    position: absolute;
    transition: transform 300ms ease;
    width: 100%;
  }

  .banner:hover .image {
    transform: scale(1.05);
  }

  .content {
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
    position: relative;
    width: 100%;
    z-index: 2;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xs);
  }

  .title, .subtitle { margin: 0; }

  .cta { width: 100%; }

  @media (max-width: 899px) {
    .banner {
      height: var(--offer-banner-mobile-height, auto);
      min-height: var(--offer-banner-mobile-height, auto);
    }
  }
`);

class OXOfferBanner extends HTMLElement {
  static observedAttributes = ['title', 'subtitle', 'cta-text', 'image', 'href'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.setAttribute('data-p100-theme', 'option-light');
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const ctaText = this.getAttribute('cta-text') || '';
    const image = this.getAttribute('image') || '';
    const href = this.getAttribute('href') || '#';

    this.shadowRoot.innerHTML = `
      <a href="${href}" class="banner" aria-label="${title}">
        ${image ? `<img class="image" src="${image}" alt="" aria-hidden="true">` : ''}
        <div class="content">
          <div class="text">
            <p class="title text-title-medium-heavy-caps">${title}</p>
            <p class="subtitle text-copy-medium-regular">${subtitle}</p>
          </div>
          <ox-button class="cta" kind="brand">${ctaText}</ox-button>
        </div>
      </a>`;
  }
}

customElements.define('ox-offer-banner', OXOfferBanner);
