---
name: new-page
description: Scaffold a complete new booking funnel page — creates the HTML, CSS, and JS files with correct relative paths and boilerplate imports. Usage: /new-page <slug>
---

Scaffold a new booking funnel page. If the user provided a slug as an argument, use it. Otherwise ask: "What slug should the page use? (e.g. `checkout`, `confirmation`)"

## Files to create

Given slug `{slug}`, create these three files:

### 1. `prototype/pages/{slug}.html`

Use this exact boilerplate (note `../` prefix for paths — pages live one level below prototype root):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{Slug title-cased} — SIXT</title>

  <!-- Material Symbols (CDN) — browse icons at fonts.google.com/icons -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

  <!-- P100 shared styles (tokens + typography + components) -->
  <link rel="stylesheet" href="../styles/all.css">

  <!-- Page styles -->
  <link rel="stylesheet" href="../styles/pages/{slug}.css">
</head>
<body>

  <main>
    <!-- page content goes here -->
  </main>

  <script type="module" src="../components/index.js"></script>
  <script type="module" src="../scripts/pages/{slug}.js"></script>
</body>
</html>
```

### 2. `prototype/styles/pages/{slug}.css`

```css
/* {slug} page styles */
```

### 3. `prototype/scripts/pages/{slug}.js`

```javascript
/* {slug} page script */
```

## After creating the files

Output a checklist:
- [ ] `prototype/pages/{slug}.html` — page shell
- [ ] `prototype/styles/pages/{slug}.css` — page styles
- [ ] `prototype/scripts/pages/{slug}.js` — page script

Remind the user to open `http://localhost:5173/prototype/pages/{slug}.html` to verify.
