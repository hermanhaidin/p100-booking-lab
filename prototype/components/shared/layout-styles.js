/* Shared layout-shell styles for components that need horizontal centering.
   Mirrors prototype/styles/layout.css rules so they work inside Shadow DOM. */

const layoutStyles = new CSSStyleSheet();
layoutStyles.replaceSync(`
  .layout-shell {
    margin-inline: auto;
    padding-inline: var(--spacing-xs);
    width: 100%;
  }

  @media (min-width: 650px) and (max-width: 1199px) {
    .layout-shell {
      padding-inline: var(--spacing-lg);
    }
  }

  @media (min-width: 1200px) and (max-width: 1599px) {
    .layout-shell {
      padding-inline: var(--spacing-4xl);
    }
  }

  @media (min-width: 1600px) {
    .layout-shell {
      max-width: 1440px;
      padding-inline: 0;
    }
  }
`);

export { layoutStyles };
