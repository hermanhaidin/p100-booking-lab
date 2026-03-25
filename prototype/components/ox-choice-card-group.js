/* Choice card group — Light DOM coordinator
   Manages radio-selection exclusivity and visual stacking for child
   <ox-choice-card> elements. No Shadow DOM — uses a document-level
   constructable stylesheet for layout and corner rounding.

   Attributes:
     single — boolean, standalone-tile mode (full radius on each card)

   Events consumed (from child cards):
     choice-select — selects the card and deselects others

   Events fired:
     choice-change — { value } — bubbles when selection changes

   API: <ox-choice-card-group>
          <ox-choice-card value="a">...</ox-choice-card>
          <ox-choice-card value="b">...</ox-choice-card>
        </ox-choice-card-group> */

const choiceCardGroupStyles = new CSSStyleSheet();
choiceCardGroupStyles.replaceSync(`
  ox-choice-card-group {
    display: flex;
    flex-direction: column;
  }

  /* Stacked: collapse shared seams into a single 1px line */
  ox-choice-card-group:not([single]) > ox-choice-card + ox-choice-card {
    margin-top: calc(-1 * var(--stroke-sm));
  }

  /* Stacked corner rounding */
  ox-choice-card-group:not([single]) > ox-choice-card:first-child {
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
  }

  ox-choice-card-group:not([single]) > ox-choice-card:last-child {
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
  }

  /* Single-tile mode: full radius on each card */
  ox-choice-card-group[single] > ox-choice-card {
    border-radius: var(--radius-md);
  }

  /* Spacing between groups */
  ox-choice-card-group + ox-choice-card-group {
    margin-top: var(--spacing-xs);
  }
`);

class OXChoiceCardGroup extends HTMLElement {
  connectedCallback() {
    const root = this.getRootNode();
    const target = root === document ? document : root;
    if (!target.adoptedStyleSheets.includes(choiceCardGroupStyles)) {
      target.adoptedStyleSheets = [...target.adoptedStyleSheets, choiceCardGroupStyles];
    }

    this._onSelect = this._handleSelect.bind(this);
    this.addEventListener('choice-select', this._onSelect);
  }

  disconnectedCallback() {
    this.removeEventListener('choice-select', this._onSelect);
  }

  get _cards() {
    return [...this.querySelectorAll('ox-choice-card')];
  }

  _handleSelect(e) {
    e.stopPropagation();
    const { value } = e.detail;

    for (const card of this._cards) {
      card.toggleAttribute('selected', card.getAttribute('value') === value);
    }

    this.dispatchEvent(new CustomEvent('choice-change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }
}

customElements.define('ox-choice-card-group', OXChoiceCardGroup);
