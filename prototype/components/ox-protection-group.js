/* Protection group — Light DOM coordinator
   Manages radio-selection exclusivity and mobile accordion behavior
   for child <ox-protection-card> elements.

   API: <ox-protection-group>
          <ox-protection-card option-id="none" ...></ox-protection-card>
          <ox-protection-card option-id="basic" ...></ox-protection-card>
        </ox-protection-group>

   Behavior:
   - Only one card selected at a time (radio-group semantics)
   - Mobile (<900px): only one card expanded at a time; selecting expands
   - Desktop (≥900px): all cards always expanded
   - No default selection (product decision)
   - Fires 'protection-change' with { optionId } when selection changes */

const MOBILE_MQ = '(max-width: 899px)';

class OXProtectionGroup extends HTMLElement {
  connectedCallback() {
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

  _syncExpansionForBreakpoint() {
    const cards = this._cards;
    if (this._isMobile) {
      const selectedId = cards.find(c => c.hasAttribute('selected'))?.getAttribute('option-id');
      for (const card of cards) {
        card.toggleAttribute('expanded', card.getAttribute('option-id') === selectedId);
      }
    } else {
      for (const card of cards) {
        card.toggleAttribute('expanded', true);
      }
    }
  }
}

customElements.define('ox-protection-group', OXProtectionGroup);
