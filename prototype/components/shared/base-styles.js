const css = `
/* --- Shadow DOM reset --- */

:host { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }

/* --- Material Symbols icon utility --- */

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 24px;
}

/* --- Typography utility classes --- */
/* Named after P100 text styles. Responsive: font sizes update via tokens.css media queries. */

/* --- Display --- */

.text-display-large-heavy {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-large-heavy-caps {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

.text-display-large-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-large-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

.text-display-medium-heavy {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-medium-heavy-caps {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

.text-display-medium-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-medium-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

.text-display-small-heavy {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-small-heavy-caps {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-display);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

.text-display-small-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
}

.text-display-small-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-display);
  text-transform: uppercase;
}

/* --- Title --- */

.text-title-large-heavy {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-title);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
}

.text-title-large-heavy-caps {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-title);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
  text-transform: uppercase;
}

.text-title-large-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-title);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
}

.text-title-large-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-title);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
  text-transform: uppercase;
}

.text-title-medium-heavy {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-title);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
}

.text-title-medium-heavy-caps {
  font-family: "Helvetica Now Display", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-title);
  font-weight: 900;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
  text-transform: uppercase;
}

.text-title-medium-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-title);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
}

.text-title-medium-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-title);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--typography-letter-spacing-large-title);
  text-transform: uppercase;
}

.text-title-small-heavy {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-title);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-small-title);
}

.text-title-small-heavy-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-title);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-small-title);
  text-transform: uppercase;
}

.text-title-small-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-title);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-small-title);
}

.text-title-small-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-title);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-small-title);
  text-transform: uppercase;
}

/* --- Copy --- */

/* xlarge */
.text-copy-xlarge-heavy {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-xlarge-heavy-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-xlarge-heavy-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-xlarge-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-xlarge-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-xlarge-regular-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-x-large-copy);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

/* large */
.text-copy-large-heavy {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-large-heavy-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-large-heavy-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-large-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-large-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-large-regular-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-large-copy);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

/* medium */
.text-copy-medium-heavy {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-medium-heavy-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-medium-heavy-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-medium-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-medium-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-medium-regular-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-medium-copy);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

/* small */
.text-copy-small-heavy {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-small-heavy-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-small-heavy-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-small-regular {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
}

.text-copy-small-regular-caps {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: var(--typography-letter-spacing-copy);
  text-transform: uppercase;
}

.text-copy-small-regular-tight {
  font-family: "Helvetica Now Text", Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size-small-copy);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: var(--typography-letter-spacing-copy);
}
`;

const baseStyles = new CSSStyleSheet();
baseStyles.replaceSync(css);

export { baseStyles };
