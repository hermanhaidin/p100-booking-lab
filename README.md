# p100 booking lab

A shared playground for designers to prototype booking flow in the browser using Cursor.


## Goal

Prototype and redesign booking funnel using https://sixt.com/ as a baseline. Not a production code.

Primary tooling:
- Cursor
- Firecrawl


## Getting started

You only need to do this once on your computer.

### 1. Install Xcode Command Line Tools

Open Terminal and run `xcode-select --install`. This installs Git and basic developer tools.

### 2. Install Homebrew

Homebrew helps keep tools updated. Follow instructions on https://brew.sh/

### 3. Install Node.js

In Terminal run `brew install node`. Keep your tools updated with `brew update && brew upgrade`.


## How to work here

You do NOT need to be an engineer.

Typical workflow:

1. Create a branch
2. Ask Cursor: "Redesign search filters visually"
3. Run local preview: `npm run dev`
4. Commit changes


## Project structure

This repo separates reference material from experiments.

- `sources/` - original crawled websites (read-only)
- `prototype/` - working booking flow prototype
- `experiments/` - redesign explorations


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


## Philosophy

Fast experimentation over perfect implementation.