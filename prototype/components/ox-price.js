/* Shared price component API
   - Prices are composable from optional parts: prefix, sign, currency, integer, decimal, suffix.
   - Default market is EN + USD with left currency; use currency-position="right" for regional swaps.
   - Typography is applied internally based on size + variant weight.
   API: <ox-price size="large" variant="default" currency="$" integer="71" decimal=".27" suffix="/ day"> */

import { baseStyles } from './shared/base-styles.js';

const TYPO = {
  large:  { integer: 'text-title-small-heavy',  rest: 'text-copy-medium-heavy-tight' },
  medium: { integer: 'text-copy-medium-heavy-tight', rest: 'text-copy-small-heavy-tight' },
  small:  { integer: 'text-copy-small-heavy',   rest: 'text-copy-small-heavy' },
};

const TYPO_REGULAR = {
  large:  { integer: 'text-title-small-regular',  rest: 'text-copy-medium-regular' },
  medium: { integer: 'text-copy-medium-regular', rest: 'text-copy-small-regular' },
  small:  { integer: 'text-copy-small-regular',  rest: 'text-copy-small-regular' },
};

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --price-element-gap: var(--spacing-5xs);
    --price-strike-position: 50%;
    align-items: baseline;
    color: var(--color-content-primary);
    display: inline-flex;
    margin: 0;
    position: relative;
    white-space: nowrap;
  }

  :host([hidden]) { display: none; }

  .prefix {
    margin-inline-end: var(--price-element-gap);
    order: 10;
  }

  .sign {
    margin-inline-end: var(--price-element-gap);
    order: 20;
  }

  .currency {
    margin-inline-end: var(--price-element-gap);
    order: 30;
  }

  .integer { order: 40; }
  .decimal { order: 50; }

  .suffix {
    margin-inline-start: var(--price-element-gap);
    order: 60;
  }

  :host([currency-position="right"]) .currency {
    margin-inline-end: 0;
    margin-inline-start: var(--price-element-gap);
    order: 55;
  }

  :host([variant="hot"]) {
    color: var(--color-content-extended-brand);
  }

  :host([variant="muted"]) {
    color: var(--color-content-secondary);
  }

  :host([variant="striked"]) {
    color: var(--color-content-secondary);
  }

  :host([variant="striked"])::after {
    background-color: currentColor;
    content: "";
    height: calc((var(--stroke-sm) + var(--stroke-md)) / 2);
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: var(--price-strike-position);
    transform: translateY(-50%);
  }

  :host([size="large"][variant="striked"]) {
    --price-strike-position: 60%;
  }
`);

class OXPrice extends HTMLElement {
  static observedAttributes = [
    'size', 'variant', 'currency-position',
    'integer', 'decimal', 'suffix', 'prefix', 'sign', 'currency',
  ];

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
    const size = this.getAttribute('size') || 'large';
    const variant = this.getAttribute('variant') || 'default';
    const isRegular = variant === 'muted' || variant === 'striked';
    const typo = (isRegular ? TYPO_REGULAR : TYPO)[size] || TYPO.large;

    const prefix = this.getAttribute('prefix');
    const sign = this.getAttribute('sign');
    const currency = this.getAttribute('currency');
    const integer = this.getAttribute('integer');
    const decimal = this.getAttribute('decimal');
    const suffix = this.getAttribute('suffix');

    const parts = [];
    if (prefix)   parts.push(`<span class="prefix ${typo.rest}">${prefix}</span>`);
    if (sign)     parts.push(`<span class="sign ${typo.rest}">${sign}</span>`);
    if (currency) parts.push(`<span class="currency ${typo.rest}">${currency}</span>`);
    if (integer)  parts.push(`<span class="integer ${typo.integer}">${integer}</span>`);
    if (decimal)  parts.push(`<span class="decimal ${typo.rest}">${decimal}</span>`);
    if (suffix)   parts.push(`<span class="suffix ${typo.rest}">${suffix}</span>`);

    this.shadowRoot.innerHTML = parts.join('');
  }
}

customElements.define('ox-price', OXPrice);
