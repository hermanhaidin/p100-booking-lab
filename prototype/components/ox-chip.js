/* Shared chip component API
   - Chips are button-like toggles/tabs with optional selected state.
   - Supports small/large sizes and solid/outlined variants.
   - Preset: dropdown (adds trailing keyboard_arrow_down icon).
   API: <ox-chip size="small" variant="solid" icon="directions_car" icon-style="filled" selected disabled preset="dropdown" sublabel="...">Label</ox-chip> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --chip-bg: var(--color-surface-secondary-container);
    --chip-fg: var(--color-content-primary);
    --chip-selected-bg: var(--color-content-primary);
    --chip-selected-fg: var(--color-on-content-on-primary);
    --chip-outline-stroke: color-mix(in srgb, var(--color-content-secondary) 25%, transparent);
    --chip-outline-hover-bg: var(--chip-outline-stroke);
    --chip-outline-hover-fg: var(--color-content-primary);
    --chip-outline-hover-border: transparent;
    --chip-outline-hover-shadow: inset 0 0 0 9999px transparent;
    --chip-press-scale: 0.94;
    display: inline-flex;
  }

  :host([hidden]) { display: none; }

  .chip {
    align-items: center;
    background-color: var(--chip-bg);
    border: none;
    border-radius: var(--radius-pill);
    box-shadow: inset 0 0 0 9999px transparent;
    color: var(--chip-fg);
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-3xs);
    justify-content: center;
    min-width: 64px;
    outline: none;
    padding: 0 var(--spacing-xs);
    text-align: left;
    text-decoration: none;
    transition: box-shadow 150ms ease, background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
    width: fit-content;
  }

  :host(:not([size])) .chip,
  :host([size="small"]) .chip {
    border-radius: var(--radius-pill);
    height: 36px;
  }

  :host([size="large"]) .chip {
    border-radius: var(--radius-md);
    height: 52px;
    min-width: 72px;
  }

  :host([icon]) .chip {
    padding-left: var(--spacing-2xs);
    padding-right: var(--spacing-xs);
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
  }

  :host(:not([size])) .icon,
  :host([size="small"]) .icon {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }

  :host([size="large"]) .icon {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  :host([icon-style="filled"]) .icon,
  :host(:not([icon-style])) .icon {
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  }

  :host([icon-style="outline"]) .icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  }

  .content {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5xs);
    min-width: 0;
  }

  .label {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .sublabel {
    color: var(--color-content-secondary);
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .trailing-icon {
    flex: 0 0 auto;
    font-size: 16px;
    height: 16px;
    transform: none;
    width: 16px;
  }

  /* Dropdown preset: tighter right padding when trailing icon */
  :host([preset="dropdown"]) .chip {
    padding-right: var(--spacing-2xs);
  }

  /* Selected state */
  :host([selected]) .chip {
    background-color: var(--chip-selected-bg);
    border-color: transparent;
    color: var(--chip-selected-fg);
  }

  :host([selected]) .sublabel {
    color: var(--chip-selected-fg);
  }

  /* Solid interactions */
  :host(:not([variant="outlined"])) .chip:not(:disabled):not([aria-disabled="true"]):is(:hover, :active) {
    box-shadow: inset 0 0 0 9999px var(--color-overlay-hover);
  }

  :host(:not([variant="outlined"])) .chip:not(:disabled):not([aria-disabled="true"]):active {
    transform: scale(var(--chip-press-scale));
  }

  /* Outlined baseline (unselected) */
  :host([variant="outlined"]:not([selected])) .chip {
    background-color: transparent;
    border: var(--stroke-md) solid var(--chip-outline-stroke);
    color: var(--color-content-primary);
  }

  :host([variant="outlined"]:not([selected])) .chip:not(:disabled):not([aria-disabled="true"]):is(:hover, :active) {
    background-color: var(--chip-outline-hover-bg);
    border-color: var(--chip-outline-hover-border);
    box-shadow: var(--chip-outline-hover-shadow);
    color: var(--chip-outline-hover-fg);
  }

  :host([variant="outlined"]:not([selected])) .chip:not(:disabled):not([aria-disabled="true"]):active {
    transform: scale(var(--chip-press-scale));
  }

  /* Selected outlined */
  :host([variant="outlined"][selected]) .chip:not(:disabled):not([aria-disabled="true"]):is(:hover, :active) {
    box-shadow: inset 0 0 0 9999px var(--color-overlay-hover);
  }

  :host([variant="outlined"][selected]) .chip:not(:disabled):not([aria-disabled="true"]):active {
    transform: scale(var(--chip-press-scale));
  }

  .chip:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }

  .chip:disabled,
  .chip[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.3;
  }
`);

class OXChip extends HTMLElement {
  static observedAttributes = ['size', 'variant', 'icon', 'icon-style', 'selected', 'disabled', 'preset', 'sublabel'];

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
    const sublabel = this.getAttribute('sublabel');
    const preset = this.getAttribute('preset');
    const disabled = this.hasAttribute('disabled');
    const size = this.getAttribute('size') || 'small';
    const typoClass = size === 'large' ? 'text-copy-large-regular-tight' : 'text-copy-medium-regular-tight';

    const iconHtml = icon
      ? `<span class="icon material-symbols-outlined" aria-hidden="true">${icon}</span>`
      : '';

    const trailingHtml = preset === 'dropdown'
      ? `<span class="trailing-icon material-symbols-outlined" aria-hidden="true">keyboard_arrow_down</span>`
      : '';

    const labelContent = sublabel
      ? `<span class="content">
           <span class="label ${typoClass}"><slot></slot></span>
           <span class="sublabel text-copy-small-regular">${sublabel}</span>
         </span>`
      : `<span class="label ${typoClass}"><slot></slot></span>`;

    this.shadowRoot.innerHTML = `
      <button type="button" class="chip" ${disabled ? 'disabled' : ''}>
        ${iconHtml}
        ${labelContent}
        ${trailingHtml}
      </button>`;
  }
}

customElements.define('ox-chip', OXChip);
