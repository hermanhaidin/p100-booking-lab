# CLAUDE.md

SIXT booking funnel prototype. Vanilla HTML, CSS, and Web Components. Not production code — fast experimentation over perfect implementation.


## Quick start

```bash
npm install && npm run dev
```

Open `http://localhost:5173/prototype/pages/home.html` to browse the prototype.


## Tech stack

**Use:**
- Vanilla Web Components (Custom Elements + Shadow DOM) for all reusable UI
- `ox-` prefix for all custom element tag names (matches SIXT Storybook naming)
- HTML + CSS for page-level layout and composition
- Design tokens from `prototype/styles/tokens.css`
- Typography utility classes from `prototype/styles/typography.css`
- Lightweight page-level JavaScript for orchestration

**Never introduce:**
- Tailwind, PostCSS, or any CSS build tools
- React, Vue, or any JS framework
- Component libraries (shadcn, Radix, etc.)
- Web Component libraries (Lit, Stencil, Fast) — vanilla only
- Backend services, databases, or authentication


## Project structure

- `sources/` — original crawled websites (read-only, never modify)
- `prototype/` — working booking flow prototype
  - `prototype/base.html` — shared HTML boilerplate, starting point for new pages
  - `prototype/components/` — Web Component definitions
  - `prototype/components/shared/` — shared constructable stylesheets
  - `prototype/scripts/pages/` — page-level orchestration scripts
  - `prototype/styles/tokens.css` — design tokens
  - `prototype/styles/typography.css` — text utility classes
  - `prototype/styles/pages/` — page-specific layout CSS
  - `prototype/data/` — content data files (markdown)
  - `prototype/assets/` — images, logos, custom SVGs
- `experiments/` — isolated redesign explorations (optional)


## Style enforcement

1. Reuse existing token + typography utilities first
2. If missing, extend `tokens.css` or `typography.css` — never add raw values inline
3. Keep page CSS scoped to structure and layout; components own their own typography


## Migration status

| Page | Status |
|------|--------|
| home | Done |
| offer-list | Done |
| protection | Done |
| add-ons | Done |
| review-booking | Done |


## Operating model

GitHub + Vercel auto-deploy on push to main. Branch-based work encouraged for experiments.

When instructions conflict, follow this priority:
1. User request in chat
2. This CLAUDE.md
3. README.md


## See also

Detailed reference in `.claude/rules/`:
- `component-pattern.md` — Web Component boilerplate, key conventions, icons
- `design-tokens.md` — colors, typography, spacing, breakpoints, enforcement
- `component-inventory.md` — full component table (35 components)
- `data-and-content.md` — data files, pricing logic, creating new pages
