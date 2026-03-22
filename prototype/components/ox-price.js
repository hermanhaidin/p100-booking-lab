/* Shared price component API
   - Prices are composable from optional parts: prefix, sign, currency, integer, decimal, suffix.
   - Default market is EN + USD with left currency; use currency-position="right" for regional swaps.
   - Kind controls color: primary (default), secondary, brand, info, accent, success, warning, error,
     plus on-foreground kinds: on-primary, on-secondary, on-brand, on-info, on-accent, on-success, on-warning, on-error.
   - Boolean "regular" switches from heavy (default) to regular weight typography.
   - Boolean "striked" adds a strikethrough line; thickness follows weight (1px regular, 2px heavy).
   API: <ox-price kind="primary" size="large" currency="$" integer="71" decimal=".27" suffix="/ day">
        <ox-price kind="secondary" regular striked currency="$" integer="89" decimal=".50"> */

import { baseStyles } from './shared/base-styles.js';

const TYPO = {
  large:  { integer: 'text-title-small-heavy',  rest: 'text-copy-medium-heavy-tight' },
  medium: { integer: 'text-copy-medium-heavy-tight', rest: 'text-copy-medium-heavy-tight' },
  small:  { integer: 'text-copy-small-heavy',   rest: 'text-copy-small-heavy' },
};

const TYPO_REGULAR = {
  large:  { integer: 'text-title-small-regular',  rest: 'text-copy-medium-regular' },
  medium: { integer: 'text-copy-medium-regular', rest: 'text-copy-medium-regular' },
  small:  { integer: 'text-copy-small-regular',  rest: 'text-copy-small-regular' },
};

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --price-fg: var(--color-content-primary);
    --price-element-gap: var(--spacing-5xs);
    --price-strike-position: 50%;
    align-items: baseline;
    color: var(--price-fg);
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

  /* Kind tokens */
  :host([kind="primary"]),
  :host(:not([kind])) { --price-fg: var(--color-content-primary); }
  :host([kind="secondary"]) { --price-fg: var(--color-content-secondary); }
  :host([kind="brand"]) { --price-fg: var(--color-content-extended-brand); }
  :host([kind="info"]) { --price-fg: var(--color-content-extended-strong-info); }
  :host([kind="accent"]) { --price-fg: var(--color-content-extended-strong-accent); }
  :host([kind="success"]) { --price-fg: var(--color-content-extended-strong-success); }
  :host([kind="warning"]) { --price-fg: var(--color-content-extended-strong-warning); }
  :host([kind="error"]) { --price-fg: var(--color-content-extended-error); }

  :host([kind="on-primary"]) { --price-fg: var(--color-on-content-on-primary); }
  :host([kind="on-secondary"]) { --price-fg: var(--color-on-content-on-secondary); }
  :host([kind="on-brand"]) { --price-fg: var(--color-on-content-extended-on-brand); }
  :host([kind="on-info"]) { --price-fg: var(--color-on-content-extended-on-info); }
  :host([kind="on-accent"]) { --price-fg: var(--color-on-content-extended-on-accent); }
  :host([kind="on-success"]) { --price-fg: var(--color-on-content-extended-on-success); }
  :host([kind="on-warning"]) { --price-fg: var(--color-on-content-extended-on-warning); }
  :host([kind="on-error"]) { --price-fg: var(--color-on-content-extended-on-error); }

  /* Strikethrough */
  :host([striked])::after {
    background-color: currentColor;
    content: "";
    height: var(--stroke-md);
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: var(--price-strike-position);
    transform: translateY(-50%);
  }

  :host([regular][striked])::after {
    height: var(--stroke-sm);
  }

  :host([size="large"][striked]) {
    --price-strike-position: 60%;
  }
`);

class OXPrice extends HTMLElement {
  static observedAttributes = [
    'kind', 'size', 'regular', 'striked', 'currency-position',
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
    const isRegular = this.hasAttribute('regular');
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
