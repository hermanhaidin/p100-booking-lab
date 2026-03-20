/* Shared badge component API
   - Badges are read-only marketing/detail nudges (not interactive controls).
   - All badges are pill-shaped and fixed at 24px height.
   - Visual variants: solid, outlined, bordered.
   - Presets: offer-spec, similar-model, premium-brand, guaranteed-model, hot-offer-promo.
   API: <ox-badge kind="brand" variant="solid" icon="star" icon-style="filled" preset="">Label</ox-badge> */

import { baseStyles } from './shared/base-styles.js';

const TRAILING_ICON_PRESETS = ['similar-model', 'premium-brand', 'guaranteed-model'];

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --badge-bg: var(--color-content-extended-soft-brand);
    --badge-fg: var(--color-content-extended-strong-brand);
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

  :host(:not([icon])) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-2xs);
  }

  :host([icon]) {
    padding-left: var(--spacing-3xs);
    padding-right: var(--spacing-2xs);
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
    font-size: 16px;
    height: 16px;
    width: 16px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  :host([icon-style="outline"]) .icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  /* Preset: offer-spec */
  :host([preset="offer-spec"]) {
    background-color: color-mix(in srgb, var(--color-global-white) 12%, transparent);
    color: var(--color-global-white);
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

  :host([preset="similar-model"]) .icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* Preset: premium-brand (trailing icon) */
  :host([preset="premium-brand"]) {
    background-color: var(--color-content-extended-brand);
    color: var(--color-on-content-extended-on-brand);
  }

  :host([preset="premium-brand"][icon]) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-3xs);
  }

  :host([preset="premium-brand"]) .icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* Preset: guaranteed-model (trailing icon) */
  :host([preset="guaranteed-model"]) {
    background-color: var(--color-loyalty-gold);
    color: var(--color-global-white);
  }

  :host([preset="guaranteed-model"][icon]) {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-3xs);
  }

  :host([preset="guaranteed-model"]) .icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
  }

  /* Preset: hot-offer-promo */
  :host([preset="hot-offer-promo"]) {
    background-color: var(--color-content-extended-strong-brand);
    border: var(--stroke-sm) solid var(--color-content-extended-brand);
    color: var(--color-on-content-extended-on-brand);
  }
`);

class OXBadge extends HTMLElement {
  static observedAttributes = ['kind', 'variant', 'icon', 'icon-style', 'preset'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const icon = this.getAttribute('icon');
    const preset = this.getAttribute('preset');
    const trailing = preset && TRAILING_ICON_PRESETS.includes(preset);

    const iconHtml = icon
      ? `<span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    if (trailing) {
      this.shadowRoot.innerHTML = `
        <span class="label text-copy-small-heavy"><slot></slot></span>
        ${iconHtml}`;
    } else {
      this.shadowRoot.innerHTML = `
        ${iconHtml}
        <span class="label text-copy-small-heavy"><slot></slot></span>`;
    }
  }
}

customElements.define('ox-badge', OXBadge);
