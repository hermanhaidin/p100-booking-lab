/* Home page orchestration
   - SEO link tab switching (ox-chip selected attribute + panel visibility) */

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
