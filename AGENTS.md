# Agent rules

This repository is a shared playground for designers to prototype booking flow using macOS + Cursor AI editor.

Focus on fast iteration and visual exploration. Optimize for designer readability.


## Goals

1. Prototype booking flow using real websites as a baseline
2. Prioritize visual interaction and layout over engineering complexity
3. This is not a production code
4. Avoid introducing backend logic or complex architecture


## Tech stack

**Prefer:**
- Vanilla Web Components (Custom Elements + Shadow DOM) for all reusable UI components
- `ox-` prefix for all custom element tag names (e.g. `<ox-button>`, `<ox-booking-header>`) — aligns with the team's Storybook naming (OXButton, etc.)
- HTML + CSS for page-level layout and composition
- Design tokens from `prototype/styles/tokens.css`
- Lightweight page-level JavaScript for orchestration

**Never introduce:**
- Tailwind, PostCSS, or CSS build tools
- React, Vue, or any JS framework
- Component libraries (shadcn, Radix, etc.)
- Web Component libraries (Lit, Stencil, Fast) — use vanilla only
- Backend services, databases, or authentication


## Components

- Components live in `prototype/components/`, one `.js` file per component
- Each component defines a Custom Element with `ox-` prefix using Shadow DOM
- Components adopt shared constructable stylesheets for typography and icon utilities
- Design tokens (CSS custom properties on `:root`) inherit into Shadow DOM automatically — never embed token values in component files
- Component CSS previously in `prototype/styles/components/*.css` is migrated into component shadow stylesheets during the Web Components migration


## Icons

- Material Symbols is loaded via Google Fonts CDN in `prototype/base.html`
- When creating new HTML pages, always start from or copy `prototype/base.html`
- Custom SVGs live in `prototype/assets/icons/`, use `{category}-{name}.svg` naming
- Icon utilities are also available inside Web Components via the shared base styles module
- Default icon style is **outlined** (FILL 0). Add the `filled` boolean attribute to any component to switch to filled style (FILL 1). This is a shared CSS-driven behavior from `base-styles.js` — no per-component JS needed.


## Operating model

This repo uses GitHub for collaboration and deploys to Vercel automatically on push to main. Designers work in Cursor, push to GitHub, and share the live Vercel URL with the team. Branch-based work is encouraged for experiments.

When instructions conflict, follow this priority:
1. User request in chat
2. This `AGENTS.md`
3. `README.md` examples


## Project structure

- Never modify files inside `sources/` (reference crawl, read-only).
- `prototype/` is the main working funnel and can be edited directly.
- `experiments/` is optional; use it for isolated what-if explorations or parallel concepts.
- Do not force work into `experiments/` unless the user asks for isolation.

### Where to edit what

- `prototype/styles/tokens.css` - design tokens
- `prototype/styles/typography.css` - text utility classes (`text-*`)
- `prototype/styles/components/*.css` - reusable components
- `prototype/styles/pages/*.css` - page-specific layout and composition
- `prototype/components/*.js` — Web Component definitions
- `prototype/components/shared/` — shared constructable stylesheets
- `prototype/data/` — content data files used at runtime (markdown)
- `prototype/scripts/pages/*.js` — page-level orchestration scripts


## Experiments

- Experiments should be loadable by their own URL via the dev server.
- Experiments may copy/override only the pieces they need (components, page CSS, JS modules).
- Prefer importing shared styles from `prototype/styles/` and layering overrides.