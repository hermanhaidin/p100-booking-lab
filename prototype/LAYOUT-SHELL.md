# Layout Shell Contract

Use `layout-shell` as the default content container for all prototype pages.

## Why

- Keeps content aligned to the same viewport margins across sections.
- Caps content at `1440px` on wide screens.
- Prevents section-specific margin hacks.

## Breakpoint behavior

- `<=649px`: `16px` visible side margins
- `650-1199px`: `32px` visible side margins
- `1200-1599px`: `80px` visible side margins
- `>=1600px`: centered content capped at `1440px`

## Standard section scaffold

```html
<section>
  <div class="layout-shell">
    <!-- section content -->
  </div>
</section>
```

## Full-bleed background scaffold

```html
<section class="layout-full-bleed">
  <div class="layout-shell">
    <!-- content on top of full-width background -->
  </div>
</section>
```

## Optional 12-column alignment helper

Use this only when the section needs strict column alignment.

```html
<section>
  <div class="layout-shell">
    <div class="layout-grid-12">
      <!-- column-aligned blocks -->
    </div>
  </div>
</section>
```

## Rules for new pages

Apply this contract to new pages and states, including:

- offer-list
- protection
- add-ons
- review-booking

Do not repeat `max-width: 1440px` and `margin: 0 auto` on individual section components unless there is a documented exception.
