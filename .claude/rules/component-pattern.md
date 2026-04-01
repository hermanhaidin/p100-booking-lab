# Web Component Pattern

Every component follows this exact structure. Copy it when creating new components.

```javascript
/* Component description
   API: <ox-example kind="primary" size="large" disabled>Label</ox-example> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
    /* Use tokens, never hardcode values */
  }
  :host([hidden]) { display: none; }
  /* Variants via :host([attribute]) selectors */
`);

class OxExample extends HTMLElement {
  static observedAttributes = ['kind', 'size', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const kind = this.getAttribute('kind') || 'primary';
    this.shadowRoot.innerHTML = `
      <button class="example text-copy-medium-heavy">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('ox-example', OxExample);
```

## Key conventions

- Components live in `prototype/components/`, one `.js` file per component
- Shared constructable stylesheets in `prototype/components/shared/`:
  - `base-styles.js` — typography utility classes + icon utilities including `filled` attribute support (adopted by all components)
  - `layout-styles.js` — layout-shell horizontal centering (for full-width components)
  - `ox-icon-button-styles.js` — shared interaction styles for icon buttons
- Design tokens (CSS custom properties on `:root`) inherit into Shadow DOM automatically — never embed token values in component files
- All styling via `:host` and `:host([attribute])` selectors
- Typography classes applied inside shadow DOM templates (e.g. `class="text-copy-medium-heavy"`)
- Components own their typography internally — consumers should not need to pass typography classes
- Custom events use `{ bubbles: true, composed: true }` to cross shadow boundaries
- Light DOM coordinators (ox-protection-group, ox-choice-card-group) skip Shadow DOM intentionally — they manage child component state
- Register the element at bottom of file: `customElements.define('ox-name', ClassName)`
- Add the import to `prototype/components/index.js`

## Icons

Material Symbols loaded via Google Fonts CDN in `prototype/base.html`. Always start new pages from `base.html`.

- Default icon style is **outlined** (FILL 0)
- Add the `filled` boolean attribute to switch to filled style (FILL 1) — CSS-driven, no per-component JS
- Custom SVGs live in `prototype/assets/icons/`, use `{category}-{name}.svg` naming
- Icon utilities available inside Web Components via the shared `baseStyles`
