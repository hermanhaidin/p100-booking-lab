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
- HTML + CSS with design tokens from `prototype/styles/tokens.css`
- Reusable utility classes (typography, components) over inline styles
- Lightweight JavaScript where needed

**Never introduce:**
- Tailwind, PostCSS, or CSS build tools
- React, Vue, or any JS framework
- Component libraries (shadcn, Radix, etc.)
- Backend services, databases, or authentication

## Icons

- Material Symbols is loaded via Google Fonts CDN in `prototype/base.html`
- When creating new HTML pages, always start from or copy `prototype/base.html`
- Custom SVGs live in `prototype/assets/icons/`, use `{category}-{name}.svg` naming


## Operating model

This repository is primarily used in **solo zip mode**:
- Designers receive a zip, unpack locally, and edit directly in Cursor
- Git collaboration workflows (branching, PRs, branch protection) are optional and not required for day-to-day design work
- If files are broken, reset by re-unzipping a fresh copy

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


## Experiments

- Experiments should be loadable by their own URL via the dev server.
- Experiments may copy/override only the pieces they need (components, page CSS, JS modules).
- Prefer importing shared styles from `prototype/styles/` and layering overrides.