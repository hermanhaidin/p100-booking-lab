/* Home page orchestration
   - Dialog demo (ox-dialog configurator opened via header Help button)
   - SEO link tab switching (ox-chip selected attribute + panel visibility) */

/* --- Dialog demo — interactive configurator --- */
(function initDialogDemo() {
  const modal = document.getElementById('dialog-demo');
  if (!modal) return;

  const $ = (s) => modal.querySelector(s);
  const $$ = (s) => modal.querySelectorAll(s);

  const TITLE_TEXT = 'Choose your preferred rental plan';
  const SUBTITLE_TEXT = 'Compare all available options and select the one that works best for your trip, budget, and coverage needs.';

  const actionEls = $$('[data-demo-action]');

  /* Footer button definitions: [switchSelector, kind, label, isTextButton] */
  const footBtns = [
    ['[data-demo-btn-primary]', 'brand', 'Continue', false],
    ['[data-demo-btn-secondary]', 'secondary', 'Download', false],
    ['[data-demo-btn-secondary2]', 'secondary', 'Share', false],
    ['[data-demo-btn-text]', null, 'Dismiss', true],
  ];

  function isOn(el) { return el && el.hasAttribute('checked'); }

  function update() {
    /* Size */
    const sizeCtrl = modal.querySelector('[data-demo-size-ctrl]');
    const activeBtn = sizeCtrl?.querySelector('button[aria-selected="true"]');
    const sizeVal = activeBtn ? activeBtn.getAttribute('value') : '';
    if (sizeVal) { modal.setAttribute('size', sizeVal); } else { modal.removeAttribute('size'); }
    modal.toggleAttribute('small-title', isOn($('[data-demo-small-title]')));
    modal.toggleAttribute('tall', isOn($('[data-demo-tall]')));

    /* Header — title / subtitle */
    const showTitle = isOn($('[data-demo-show-title]'));
    const subtitleSwitch = $('[data-demo-show-subtitle]');
    subtitleSwitch.toggleAttribute('disabled', !showTitle);
    if (!showTitle) subtitleSwitch.removeAttribute('checked');
    const showSubtitle = isOn(subtitleSwitch);

    if (showTitle) { modal.setAttribute('heading', TITLE_TEXT); } else { modal.removeAttribute('heading'); }
    if (showSubtitle) { modal.setAttribute('subtitle', SUBTITLE_TEXT); } else { modal.removeAttribute('subtitle'); }

    /* Header — trailing action icons */
    const showActions = isOn($('[data-demo-show-actions]'));
    actionEls.forEach((el) => el.toggleAttribute('hidden', !showActions));

    /* Header — segmented control */
    const segCtrl = modal.querySelector('[data-demo-segmented-ctrl]');
    if (segCtrl) segCtrl.toggleAttribute('hidden', !isOn($('[data-demo-segmented]')));

    /* Footer — rebuild slotted buttons */
    modal.querySelectorAll('[data-demo-foot-item]').forEach((el) => el.remove());
    footBtns.forEach(([sel, kind, label, isText]) => {
      if (!isOn($(sel))) return;
      if (isText) {
        const btn = document.createElement('ox-text-button');
        btn.setAttribute('slot', 'footer');
        btn.setAttribute('data-demo-foot-item', '');
        btn.setAttribute('underlined', '');
        btn.textContent = label;
        modal.appendChild(btn);
      } else {
        const btn = document.createElement('ox-button');
        btn.setAttribute('slot', 'footer');
        btn.setAttribute('data-demo-foot-item', '');
        btn.setAttribute('kind', kind);
        btn.setAttribute('size', 'large');
        btn.textContent = label;
        modal.appendChild(btn);
      }
    });

    /* Detail page footer override */
    if (isOn($('[data-demo-detail-hide-footer]'))) {
      modal.querySelectorAll('[data-demo-foot-item]').forEach(el => el.remove());
    }
  }

  /* Size segmented control */
  modal.addEventListener('ox-change', (e) => {
    if (e.target.matches('[data-demo-size-ctrl]')) { update(); return; }
  });

  /* Delegated change listener for ox-switch / ox-checkbox controls */
  modal.addEventListener('change', (e) => { update(); });

  /* Label click forwarding — custom elements aren't native labelable targets */
  modal.querySelectorAll('[data-demo-label]').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('ox-checkbox')) return;
      const sw = row.querySelector('ox-checkbox');
      if (sw && !sw.hasAttribute('disabled')) {
        sw.toggleAttribute('checked');
        sw.dispatchEvent(new CustomEvent('change', {
          bubbles: true, composed: true,
          detail: { checked: sw.hasAttribute('checked') },
        }));
      }
    });
  });

  /* Open via header Help button */
  document.addEventListener('ox-help', () => modal.show());

  /* Multi-page flow — Confirm swaps to detail page, Back returns */
  const configPage = modal.querySelector('[data-demo-page="config"]');
  const detailPage = modal.querySelector('[data-demo-page="detail"]');

  function flipHeight(fn) {
    const old = modal.shadowRoot?.querySelector('.panel');
    const from = old ? old.offsetHeight : 0;
    fn();
    const panel = modal.shadowRoot?.querySelector('.panel');
    if (!panel || !from) return;
    panel.style.overflow = 'hidden';
    panel.style.transition = 'none';
    panel.style.height = 'auto';
    const to = panel.offsetHeight;
    if (from === to) { panel.style.overflow = ''; panel.style.transition = ''; return; }
    panel.style.height = from + 'px';
    panel.offsetHeight; /* force reflow — commit 'from' state */
    panel.style.transition = 'height 300ms cubic-bezier(.4,0,.2,1)';
    panel.style.height = to + 'px';
    panel.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'height') return;
      panel.style.height = '';
      panel.style.overflow = '';
      panel.style.transition = '';
    }, { once: true });
  }

  function swapPage(fn) {
    if (modal.getAttribute('size') === 'full' || modal.hasAttribute('tall')) { fn(); return; }
    flipHeight(fn);
  }

  function goToDetail() {
    swapPage(() => {
      configPage.style.display = 'none';
      detailPage.style.display = 'flex';
      modal.setAttribute('heading', 'Confirm your selection');
      modal.setAttribute('subtitle', 'Review your choices before proceeding.');
      modal.setAttribute('back', '');
    });
  }

  function goToConfig() {
    swapPage(() => {
      detailPage.style.display = 'none';
      configPage.style.display = 'flex';
      modal.removeAttribute('back');
      $('[data-demo-detail-hide-footer]')?.removeAttribute('checked');
      update();
    });
  }

  modal.addEventListener('click', (e) => {
    const btn = e.target.closest('ox-button[data-demo-foot-item]');
    if (btn && btn.getAttribute('kind') === 'brand') goToDetail();
  });
  modal.addEventListener('ox-back', goToConfig);

  /* Initial sync */
  update();
})();

(function initSeoLinkTabs() {
  const tabButtons = Array.from(document.querySelectorAll("[data-seo-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-seo-panel]"));

  if (tabButtons.length === 0 || panels.length === 0) {
    return;
  }

  const panelByKey = new Map();
  panels.forEach((panel) => {
    const key = panel.dataset.seoPanel;
    if (key) {
      panelByKey.set(key, panel);
    }
  });

  const setActiveTab = (activeKey) => {
    tabButtons.forEach((button) => {
      const key = button.dataset.seoTab;
      const isActive = key === activeKey;
      button.toggleAttribute("selected", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.seoPanel === activeKey;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const activeKey = button.dataset.seoTab;
      if (!activeKey || !panelByKey.has(activeKey)) {
        return;
      }
      setActiveTab(activeKey);
    });
  });
})();
