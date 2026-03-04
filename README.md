# p100 booking lab

A shared playground for designers to prototype booking flow in the browser using Cursor.

**Philosophy**: Fast experimentation over perfect implementation.


## Goal

1. Prototype and redesign booking funnel using https://sixt.com/ as a baseline
2. Fast experimentation over perfect implementation
3. Not a production code


## Getting started

You only need to do this once on your computer.

### 1. Install Xcode Command Line Tools

Open Terminal and run `xcode-select --install`. This installs Git and basic developer tools.

### 2. Install Homebrew

Homebrew helps keep tools updated. Follow instructions on https://brew.sh/

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

1. Create a branch
2. Ask Cursor: "Redesign search filters visually"
3. Run local preview: `npm run dev`
4. Commit changes + open PR


## Project structure

This repo separates reference material from experiments.

- `sources/` - original crawled websites (read-only)
- `prototype/` - working booking flow prototype
  - `prototype/base.html` — shared HTML boilerplate, starting point for new pages
- `experiments/` - redesign explorations


## Icons

Material Symbols loaded via CDN — no install needed.

### How to use icons

1. Browse [fonts.google.com/icons](https://fonts.google.com/icons) and find an icon name (e.g. `arrow_forward`)
2. Tell Cursor: "Add an `arrow_forward` icon next to the CTA"

### Custom icons

Custom SVGs (flags, vehicles) go in `prototype/assets/icons/`. Raw Figma exports are fine — don't optimize for prototyping.


## Rules

- Never edit `sources/`
- Do not modify `prototype/` unless you are improving the shared baseline
- Work inside `experiments/` for exploration and redesigns


## Adding a new experiment

Experiments are independent redesign explorations built on top of the prototype funnel.

The `prototype/` folder is the stable master version of the booking flow.

### Steps

1. Create a new branch in Cursor (e.g. `feat/protection-bundles`)
2. Create a new folder inside `experiments/` using this format: `YYYY-MM-short-name` (e.g. 2026-03-protection-bundles)
3. Ask Cursor to copy the relevant step or entire flow from `prototype/` into it (depends on what needs to be redesigned)
4. Start redesigning

**Important**: Each designer works only inside their experiment folder.

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
<link rel="stylesheet" href="../../prototype/styles/layout.css">
<link rel="stylesheet" href="./styles/overrides.css">
```

**To change a component** copy only that component's CSS into your experiment folder and override it — not the full stylesheet.

**Important**: Only copy `tokens.css` if you're intentionally forking the entire design system. That's rare.
