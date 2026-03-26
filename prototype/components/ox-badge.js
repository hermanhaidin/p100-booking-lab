/* Shared badge component API
   - Badges are pill-shaped and fixed at 24px height.
   - Visual variants: solid, outlined, bordered.
   - Presets: offer-spec, similar-model, premium-brand, guaranteed-model, hot-offer-promo.
   - Trailing-icon presets render the icon as a small interactive icon button.
   - hot-offer-promo auto-injects flame SVG; use icon-src for other custom image icons.
   API: <ox-badge kind="brand" variant="solid" icon="star" preset="">Label</ox-badge>
        <ox-badge preset="hot-offer-promo">Hot offer</ox-badge>
        <ox-badge icon-src="../assets/icons/custom.svg">Custom</ox-badge> */

import { baseStyles } from './shared/base-styles.js';
import { iconButtonStyles } from './shared/ox-icon-button-styles.js';

const TRAILING_ICON_PRESETS = ['similar-model', 'premium-brand', 'guaranteed-model'];
const REGULAR_LABEL_PRESETS = ['offer-spec', 'similar-model', 'premium-brand', 'guaranteed-model'];

/* eslint-disable max-len */
const FLAME_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_iiiii_23122_27553)"><path d="M19.98 12.354C18.41 8.27405 12.82 8.05405 14.17 2.12405C14.27 1.68405 13.8 1.34405 13.42 1.57405C9.79 3.71405 7.18 8.00405 9.37 13.624C9.55 14.084 9.01 14.514 8.62 14.214C6.81 12.844 6.62 10.874 6.78 9.46405C6.84 8.94405 6.16 8.69405 5.87 9.12405C5.19 10.164 4.5 11.844 4.5 14.374C4.88 19.974 9.61 21.694 11.31 21.914C13.74 22.224 16.37 21.774 18.26 20.044C20.34 18.114 21.1 15.034 19.98 12.354Z" fill="#FF5000"/></g><defs><filter id="filter0_iiiii_23122_27553" x="0.5" y="-2.5" width="20.9963" height="26.5049" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="1" dy="2"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.980833 0 0 0 0 0.808333 0 0 0 1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow_23122_27553"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="-4" dy="-4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.313726 0 0 0 0 0 0 0 0 1 0"/><feBlend mode="normal" in2="effect1_innerShadow_23122_27553" result="effect2_innerShadow_23122_27553"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.940111 0 0 0 0 0.401104 0 0 0 1 0"/><feBlend mode="normal" in2="effect2_innerShadow_23122_27553" result="effect3_innerShadow_23122_27553"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="-2" dy="-2"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0.727818 0 0 0 0 0.230876 0 0 0 0 0.00370239 0 0 0 1 0"/><feBlend mode="normal" in2="effect3_innerShadow_23122_27553" result="effect4_innerShadow_23122_27553"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="-1" dy="-1"/><feGaussianBlur stdDeviation="0.5"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0.989506 0 0 0 0 0.510031 0 0 0 0 0.290843 0 0 0 1 0"/><feBlend mode="normal" in2="effect4_innerShadow_23122_27553" result="effect5_innerShadow_23122_27553"/></filter></defs></svg>`;
/* eslint-enable max-len */

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --badge-bg: var(--color-content-extended-brand);
    --badge-fg: var(--color-on-content-extended-on-brand);
    --badge-border-color: var(--color-content-extended-brand);
    align-items: center;
    background-color: var(--badge-bg);
    border: none;
    border-radius: var(--radius-pill);
    color: var(--badge-fg);
    display: inline-flex;
    gap: var(--spacing-4xs);
    height: 24px;
    max-width: 100%;
    min-width: 0;
    text-decoration: none;
    vertical-align: middle;
  }

  :host([hidden]) { display: none; }

  :host(:not([icon]):not([icon-src]):not([preset="hot-offer-promo"])) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-2xs);
  }

  :host([icon]) {
    padding-left: var(--spacing-3xs);
    padding-right: var(--spacing-2xs);
  }

  :host([icon-src]) {
    padding-left: var(--spacing-3xs);
    padding-right: var(--spacing-2xs);
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  img.icon {
    object-fit: contain;
  }

  .flame-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .flame-icon svg {
    display: block;
    height: 16px;
    width: 16px;
  }

  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trailing-btn {
    align-items: center;
    border-radius: var(--radius-sm);
    color: currentColor;
    display: inline-flex;
    flex: 0 0 auto;
    height: 32px;
    justify-content: center;
    margin: -8px;
    min-height: 32px;
    min-width: 32px;
    width: 32px;
  }

  .trailing-icon {
    color: currentColor;
    display: block;
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  /* Kind token mappings — solid */
  :host([kind="primary"]) {
    --badge-bg: var(--color-content-primary);
    --badge-fg: var(--color-on-content-on-primary);
    --badge-border-color: var(--color-content-primary);
  }

  :host([kind="secondary"]) {
    --badge-bg: var(--color-content-secondary);
    --badge-fg: var(--color-on-content-on-secondary);
    --badge-border-color: var(--color-content-secondary);
  }

  :host([kind="brand"]) {
    --badge-bg: var(--color-content-extended-brand);
    --badge-fg: var(--color-on-content-extended-on-brand);
    --badge-border-color: var(--color-content-extended-brand);
  }

  :host([kind="info"]) {
    --badge-bg: var(--color-content-extended-info);
    --badge-fg: var(--color-on-content-extended-on-info);
    --badge-border-color: var(--color-content-extended-strong-info);
  }

  :host([kind="accent"]) {
    --badge-bg: var(--color-content-extended-accent);
    --badge-fg: var(--color-on-content-extended-on-accent);
    --badge-border-color: var(--color-content-extended-strong-accent);
  }

  :host([kind="success"]) {
    --badge-bg: var(--color-content-extended-success);
    --badge-fg: var(--color-on-content-extended-on-success);
    --badge-border-color: var(--color-content-extended-strong-success);
  }

  :host([kind="warning"]) {
    --badge-bg: var(--color-content-extended-warning);
    --badge-fg: var(--color-on-content-extended-on-warning);
    --badge-border-color: var(--color-content-extended-strong-warning);
  }

  :host([kind="error"]) {
    --badge-bg: var(--color-content-extended-error);
    --badge-fg: var(--color-on-content-extended-on-error);
    --badge-border-color: var(--color-content-extended-error);
  }

  /* Outlined variant */
  :host([variant="outlined"]) {
    background-color: transparent;
    border: var(--stroke-sm) solid var(--badge-border-color);
    color: var(--badge-border-color);
  }

  /* Bordered variant */
  :host([variant="bordered"]) {
    background-color: var(--badge-bordered-bg, var(--badge-bg));
    border: none;
    color: var(--badge-bordered-fg, var(--badge-fg));
  }

  :host([variant="bordered"][kind="primary"]) {
    --badge-bordered-bg: var(--color-surface-secondary-container);
    --badge-bordered-fg: var(--color-content-primary);
  }

  :host([variant="bordered"][kind="secondary"]) {
    --badge-bordered-bg: var(--color-surface-container);
    --badge-bordered-fg: var(--color-content-primary);
  }

  :host([variant="bordered"][kind="brand"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-brand);
    --badge-bordered-fg: var(--color-content-extended-brand);
  }

  :host([variant="bordered"][kind="info"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-info);
    --badge-bordered-fg: var(--color-content-extended-strong-info);
  }

  :host([variant="bordered"][kind="accent"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-accent);
    --badge-bordered-fg: var(--color-content-extended-strong-accent);
  }

  :host([variant="bordered"][kind="success"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-success);
    --badge-bordered-fg: var(--color-content-extended-strong-success);
  }

  :host([variant="bordered"][kind="warning"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-warning);
    --badge-bordered-fg: var(--color-content-extended-strong-warning);
  }

  :host([variant="bordered"][kind="error"]) {
    --badge-bordered-bg: var(--color-content-extended-soft-error);
    --badge-bordered-fg: var(--color-content-extended-error);
  }

  /* Preset: offer-spec — filled leading icon */
  :host([preset="offer-spec"]) {
    background-color: color-mix(in srgb, var(--color-global-white) 12%, transparent);
    color: var(--color-global-white);
  }

  :host([preset="offer-spec"]) .icon {
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* Preset: similar-model (trailing icon) */
  :host([preset="similar-model"]) {
    background-color: color-mix(in srgb, var(--color-global-white) 12%, transparent);
    color: var(--color-global-white);
  }

  :host([preset="similar-model"][icon]) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-3xs);
  }

  /* Preset: premium-brand (trailing icon button) */
  :host([preset="premium-brand"]) {
    background-color: var(--color-content-extended-brand);
    color: var(--color-on-content-extended-on-brand);
  }

  :host([preset="premium-brand"][icon]) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-3xs);
  }

  /* Preset: guaranteed-model (trailing icon button) */
  :host([preset="guaranteed-model"]) {
    background-color: var(--color-loyalty-gold);
    color: var(--color-global-white);
  }

  :host([preset="guaranteed-model"][icon]) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-3xs);
  }

  /* Model presets: outlined trailing icon, opsz 20 */
  :host([preset="similar-model"]) .trailing-icon,
  :host([preset="premium-brand"]) .trailing-icon,
  :host([preset="guaranteed-model"]) .trailing-icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* Preset: hot-offer-promo — auto-injects flame icon */
  :host([preset="hot-offer-promo"]) {
    background-color: var(--color-content-extended-strong-brand);
    border: var(--stroke-sm) solid var(--color-content-extended-brand);
    color: var(--color-on-content-extended-on-brand);
    padding-left: var(--spacing-3xs);
    padding-right: var(--spacing-2xs);
  }
`);

class OXBadge extends HTMLElement {
  static observedAttributes = ['kind', 'variant', 'icon', 'icon-src', 'preset'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, iconButtonStyles, styles];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const icon = this.getAttribute('icon');
    const iconSrc = this.getAttribute('icon-src');
    const preset = this.getAttribute('preset');
    const trailing = preset && TRAILING_ICON_PRESETS.includes(preset);
    const isHotOffer = preset === 'hot-offer-promo';
    const labelClass = REGULAR_LABEL_PRESETS.includes(preset)
      ? 'text-copy-small-regular'
      : 'text-copy-small-heavy';

    let leadingIconHtml = '';
    if (isHotOffer && !icon && !iconSrc) {
      leadingIconHtml = `<span class="icon flame-icon" aria-hidden="true">${FLAME_ICON_SVG}</span>`;
    } else if (iconSrc) {
      leadingIconHtml = `<img class="icon" src="${iconSrc}" alt="" aria-hidden="true">`;
    } else if (icon) {
      leadingIconHtml = `<span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>`;
    }

    const trailingBtnHtml = icon
      ? `<button type="button" class="trailing-btn icon-btn" aria-label="${icon}">
           <span class="trailing-icon icon-btn-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
         </button>`
      : '';

    if (trailing) {
      this.shadowRoot.innerHTML = `
        <span class="label ${labelClass}"><slot></slot></span>
        ${trailingBtnHtml}`;
    } else {
      this.shadowRoot.innerHTML = `
        ${leadingIconHtml}
        <span class="label ${labelClass}"><slot></slot></span>`;
    }
  }
}

customElements.define('ox-badge', OXBadge);
