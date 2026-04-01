/* Home page orchestration
   - Dialog demo (ox-bottomsheet configurator opened via header Help button)
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
    ['[data-demo-btn-primary]', 'brand', 'Confirm', false],
    ['[data-demo-btn-secondary]', 'secondary', 'Download', false],
    ['[data-demo-btn-secondary2]', 'secondary', 'Share', false],
    ['[data-demo-btn-text]', null, 'Dismiss', true],
  ];

  function isOn(el) { return el && el.hasAttribute('checked'); }

  function update() {
    /* Size */
    const sizeRadio = modal.querySelector('ox-radio-button[data-demo-size][checked]');
    const sizeVal = sizeRadio ? sizeRadio.getAttribute('value') : '';
    if (sizeVal) { modal.setAttribute('size', sizeVal); } else { modal.removeAttribute('size'); }
    modal.toggleAttribute('small-title', isOn($('[data-demo-small-title]')));

    /* Header — title / subtitle */
    const showTitle = isOn($('[data-demo-show-title]'));
    const subtitleSwitch = $('[data-demo-show-subtitle]');
    subtitleSwitch.toggleAttribute('disabled', !showTitle);
    if (!showTitle) subtitleSwitch.removeAttribute('checked');
    const showSubtitle = isOn(subtitleSwitch);

    if (showTitle) { modal.setAttribute('heading', TITLE_TEXT); } else { modal.removeAttribute('heading'); }
    if (showSubtitle) { modal.setAttribute('subtitle', SUBTITLE_TEXT); } else { modal.removeAttribute('subtitle'); }

    /* Header — back / close */
    modal.toggleAttribute('back', isOn($('[data-demo-show-back]')));

    /* Header — trailing action icons */
    const showActions = isOn($('[data-demo-show-actions]'));
    actionEls.forEach((el) => el.toggleAttribute('hidden', !showActions));

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
  }

  /* Radio group coordination — enforce mutual exclusivity */
  function selectRadio(radio) {
    $$('ox-radio-button[data-demo-size]').forEach(r => {
      if (r !== radio) r.removeAttribute('checked');
    });
    radio.setAttribute('checked', '');
    update();
  }

  /* Delegated change listener for all ox-radio-button / ox-switch controls */
  modal.addEventListener('change', (e) => {
    const radio = e.target.closest('ox-radio-button[data-demo-size]');
    if (radio) { selectRadio(radio); return; }
    update();
  });

  /* Label click forwarding — custom elements aren't native labelable targets */
  modal.querySelectorAll('[data-demo-label]').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('ox-radio-button') || e.target.closest('ox-checkbox')) return;
      const radio = row.querySelector('ox-radio-button');
      if (radio && !radio.hasAttribute('disabled')) {
        selectRadio(radio);
        return;
      }
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
