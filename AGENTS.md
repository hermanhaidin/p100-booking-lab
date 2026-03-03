# Agent rules

This repository is a shared playground for designers to prototype booking flow using macOS + Cursor AI editor.

Focus on fast iteration and visual exploration. Optimize for designer readability.


## Goals

- Prototype booking flow using real websites as a baseline
- Prioritize visual interaction and layout over engineering complexity
- This is NOT production software
- Avoid introducing backend logic or complex architecture


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


## Project structure

- Never modify files inside `sources/` - original crawled websites
- Do not modify `prototype/` unless explicitly improving the shared baseline - master version of the booking funnel
- Most changes should happen inside `experiments/` - independent redesign explorations
- If unsure, work inside `experiments/`


## Experiments

- Experiments should not modify shared prototype files
- If experimentation requires component changes, copy components locally into the experiment folder
- To override tokens, add an override CSS file loaded after `tokens.css` — do not copy `tokens.css`
- Experiments must be loadable at their own URL via the dev server