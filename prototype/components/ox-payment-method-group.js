/* Payment method group — Light DOM coordinator
   Manages radio-selection exclusivity and visual stacking for child
   <ox-payment-method> elements. No Shadow DOM.

   Events consumed: payment-select — selects the method and deselects others
   Events fired: payment-change — { value } — bubbles when selection changes

   API: <ox-payment-method-group>
          <ox-payment-method value="credit-card">...</ox-payment-method>
          <ox-payment-method value="paypal">...</ox-payment-method>
        </ox-payment-method-group> */

const paymentMethodGroupStyles = new CSSStyleSheet();
paymentMethodGroupStyles.replaceSync(`
  ox-payment-method-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

`);

class OxPaymentMethodGroup extends HTMLElement {
  connectedCallback() {
    const root = this.getRootNode();
    const target = root === document ? document : root;
    if (!target.adoptedStyleSheets.includes(paymentMethodGroupStyles)) {
      target.adoptedStyleSheets = [...target.adoptedStyleSheets, paymentMethodGroupStyles];
    }

    this._onSelect = this._handleSelect.bind(this);
    this.addEventListener('payment-select', this._onSelect);
  }

  disconnectedCallback() {
    this.removeEventListener('payment-select', this._onSelect);
  }

  get _methods() {
    return [...this.querySelectorAll('ox-payment-method')];
  }

  _handleSelect(e) {
    e.stopPropagation();
    const { value } = e.detail;

    for (const method of this._methods) {
      method.toggleAttribute('selected', method.getAttribute('value') === value);
    }

    this.dispatchEvent(new CustomEvent('payment-change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }
}

customElements.define('ox-payment-method-group', OxPaymentMethodGroup);
