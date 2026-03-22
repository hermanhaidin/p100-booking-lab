/* Shared icon-button interaction styles
   Provides consistent hover/active/focus/disabled behavior for any element
   acting as an icon button. Apply `.icon-btn` to the button/anchor and
   `.icon-btn-icon` to the icon span inside.
   Structural CSS (sizing, margins, color, radius) stays in each component. */

const iconButtonStyles = new CSSStyleSheet();
iconButtonStyles.replaceSync(`
  .icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    transition: opacity 120ms ease, color 120ms ease;
  }

  .icon-btn-icon {
    transition: transform 120ms ease;
  }

  .icon-btn:not(:disabled):not([aria-disabled="true"]):hover .icon-btn-icon {
    transform: scale(1.08);
  }

  .icon-btn:not(:disabled):not([aria-disabled="true"]):active {
    opacity: 0.6;
  }

  .icon-btn:disabled,
  .icon-btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .icon-btn:focus-visible {
    outline: var(--stroke-lg) solid var(--color-overlay-focus);
    outline-offset: var(--stroke-md);
  }
`);

export { iconButtonStyles };
