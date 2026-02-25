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
- HTML + CSS
- Tailwind utilities
- Lightweight JavaScript where needed

**Avoid:**
- Backend services
- Databases
- Authentication systems

## Project structure

- Never modify files inside `sources/` - original crawled websites
- Do not modify `prototype/` unless explicitly improving the shared baseline - master version of the booking funnel
- Most changes should happen inside `experiments/` - independent redesign explorations
- If unsure, work inside `experiments/`


## Experiments

- Experiments should not modify shared prototype files
- If experimentation requires component changes, copy components locally into the experiment folder