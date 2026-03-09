# p100 booking lab

A shared playground for designers to prototype booking flow in the browser using Cursor.

**Philosophy**: Fast experimentation over perfect implementation.


## Goal

1. Prototype and redesign booking funnel using https://sixt.com/ as a baseline
2. Fast experimentation over perfect implementation
3. This is not a production code


## Getting started

You only need to do this once on your computer.

### 1. Install Xcode Command Line Tools

Open Terminal and run `xcode-select --install`. This installs Git and basic developer tools.

### 2. Install Homebrew

Homebrew helps keep tools updated. Follow instructions on https://brew.sh/.

### 3. Install Node.js

In Terminal run `brew install node`. Keep your tools updated with `brew update && brew upgrade`.


## Why plain HTML + CSS

We use plain HTML + CSS with a custom design token system (`prototype/styles/tokens.css`). No frameworks, no build-time CSS tools.

This is a deliberate choice — our token names map directly to the P100 design system, so classes read like design specs:

```html
<!-- Our approach — reads like the design system -->
<h2 class="text-display-medium-heavy-caps">More SIXT</h2>

<!-- Tailwind equivalent — fragmented, no design system link -->
<h2 class="font-display text-[48px] font-black leading-none uppercase tracking-wider">More SIXT</h2>
```

### We don't use

1. Tailwind — would require duplicating our token system into a config file and learning utility class vocabulary
2. React, Vue, or any framework — adds build complexity with no benefit for static prototypes
3. Component libraries (shadcn, etc.) — we define our own components to match sixt.com exactly


## How to work here

You do NOT need to be an engineer.

Typical workflow:

1. Unzip project
2. Open folder in Cursor
3. Run local preview via `npm install` and `npm run dev`
4. Edit directly in `prototype/` (or create `experiments/` if you want isolation)
5. If things get messy, start again from a fresh zip


## Project structure

This repo separates reference material from experiments:

- `sources/` - original crawled websites (read-only)
- `prototype/` - working booking flow prototype
  - `prototype/base.html` — shared HTML boilerplate, starting point for new pages
- `experiments/` - redesign explorations

### Where to edit what

- `prototype/styles/tokens.css` — design tokens (colors, spacing, radius, stroke, elevation, responsive type scales)
- `prototype/styles/typography.css` — text utility classes (`text-*`)
- `prototype/styles/components/*.css` — reusable components (button, chip, dialog, etc.)
- `prototype/styles/pages/*.css` — page-specific composition and layout


## Icons

Material Symbols loaded via CDN — no install needed.

### How to use icons

1. Browse [fonts.google.com/icons](https://fonts.google.com/icons) and find an icon name (e.g. `arrow_forward`)
2. Tell Cursor: "Add an `arrow_forward` icon next to the CTA"

### Custom icons

Custom SVGs (flags, vehicles) go in `prototype/assets/icons/`. Raw Figma exports are fine — don't optimize for prototyping.


## Rules

- Never edit `sources/`
- `prototype/` is the main editable baseline
- `experiments/` is optional for isolated redesign explorations


## Adding a new experiment

Use experiments when you want an isolated redesign exploration built on top of the prototype funnel.

`prototype/` is the default funnel baseline. You can edit it directly, or branch off into `experiments/` when you want to explore alternatives.

### Steps

1. Create a folder inside `experiments/` using `YYYY-MM-short-name` (e.g. `2026-03-protection-bundles`)
2. Copy the relevant page/flow from `prototype/` into the experiment folder
3. Keep shared imports from `prototype/styles/` and add local overrides only where needed
4. Open the experiment page via its own URL in the dev server (separate browser tab)

### Customizing styles in an experiment

The prototype's shared CSS (tokens, layout, components) loads from `prototype/styles/`. Experiments extend or override these — don't copy entire files to change a few values.

**To tweak a token value** add an override file:

```css
/* experiments/2026-03-my-thing/styles/overrides.css */
:root {
  --color-content-extended-brand: #E04500;
  --stroke-xl: 8px;
}
```

Load it after the prototype styles in your HTML:

```html
<link rel="stylesheet" href="../../prototype/styles/tokens.css">
<link rel="stylesheet" href="../../prototype/styles/fonts.css">
<link rel="stylesheet" href="../../prototype/styles/layout.css">
<link rel="stylesheet" href="../../prototype/styles/base.css">
<link rel="stylesheet" href="../../prototype/styles/typography.css">
<link rel="stylesheet" href="./styles/overrides.css">
```

**To change a component** copy only that component's CSS into your experiment folder and override it — not the full stylesheet.

**Important**: Only copy `tokens.css` if you're intentionally forking the entire design system. That's rare.
