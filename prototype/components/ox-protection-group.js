/* Protection group — Light DOM coordinator
   Manages radio-selection exclusivity, mobile accordion, and visual order
   for child <ox-protection-card> elements. No Shadow DOM — uses a
   document-level constructable stylesheet for base flex layout.

   API: <ox-protection-group>
          <ox-protection-card option-id="none" ...></ox-protection-card>
          <ox-protection-card option-id="basic" ...></ox-protection-card>
        </ox-protection-group>

   Behavior:
   - Only one card selected at a time (radio-group semantics)
   - Mobile (<900px): only one card expanded at a time; selecting auto-expands
   - Desktop (≥900px): all cards always expanded
   - Mobile visual order is reversed via style.order so the best tier appears first
   - No default selection (product decision)

   Events consumed (from child cards):
     protection-select — selects the card and deselects others
     protection-toggle — toggles accordion on mobile

   Events fired:
     protection-change — { optionId } — bubbles when selection changes */

const MOBILE_MQ = '(max-width: 899px)';

/* Document-level stylesheet (light DOM component can't use shadow stylesheets). */
const groupStyles = new CSSStyleSheet();
groupStyles.replaceSync(`
  ox-protection-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
`);

class OXProtectionGroup extends HTMLElement {
  connectedCallback() {
    if (!document.adoptedStyleSheets.includes(groupStyles)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, groupStyles];
    }
    this._onSelect = this._handleSelect.bind(this);
    this._onToggle = this._handleToggle.bind(this);
    this._onMqChange = this._handleMqChange.bind(this);

    this.addEventListener('protection-select', this._onSelect);
    this.addEventListener('protection-toggle', this._onToggle);

    this._mql = window.matchMedia(MOBILE_MQ);
    this._mql.addEventListener('change', this._onMqChange);

    this._syncExpansionForBreakpoint();
  }

  disconnectedCallback() {
    this.removeEventListener('protection-select', this._onSelect);
    this.removeEventListener('protection-toggle', this._onToggle);
    this._mql?.removeEventListener('change', this._onMqChange);
  }

  get _cards() {
    return [...this.querySelectorAll('ox-protection-card')];
  }

  get _isMobile() {
    return this._mql?.matches ?? false;
  }

  /* Select one card, deselect all others. On mobile, also auto-expand the selected card. */
  _handleSelect(e) {
    e.stopPropagation();
    const { optionId } = e.detail;

    for (const card of this._cards) {
      const match = card.getAttribute('option-id') === optionId;
      card.toggleAttribute('selected', match);

      if (this._isMobile) {
        card.toggleAttribute('expanded', match);
      }
    }

    this.dispatchEvent(new CustomEvent('protection-change', {
      bubbles: true,
      detail: { optionId },
    }));
  }

  /* Mobile only: expand/collapse a single card's accordion. */
  _handleToggle(e) {
    e.stopPropagation();
    const { optionId, expanded } = e.detail;

    if (!this._isMobile) return;

    for (const card of this._cards) {
      const match = card.getAttribute('option-id') === optionId;
      card.toggleAttribute('expanded', match && expanded);
    }
  }

  _handleMqChange() {
    this._syncExpansionForBreakpoint();
  }

  /* Breakpoint changed or initial mount: set expansion state and visual order.
     Mobile: only selected card expanded, order reversed (best tier first).
     Desktop: all cards expanded, DOM order restored. */
  _syncExpansionForBreakpoint() {
    const cards = this._cards;
    const len = cards.length;

    if (this._isMobile) {
      const selectedId = cards.find(c => c.hasAttribute('selected'))?.getAttribute('option-id');
      cards.forEach((card, i) => {
        card.toggleAttribute('expanded', card.getAttribute('option-id') === selectedId);
        card.style.order = String(len - i);
      });
    } else {
      for (const card of cards) {
        card.toggleAttribute('expanded', true);
        card.style.order = '';
      }
    }
  }
}

customElements.define('ox-protection-group', OXProtectionGroup);
