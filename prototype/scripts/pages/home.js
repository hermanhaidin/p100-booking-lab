(function initHomeCarousels() {
  const carouselApi = window.P100Carousel;
  if (!carouselApi) {
    return;
  }

  const getMoreSixtCardsPerView = () => {
    if (window.matchMedia("(min-width: 900px)").matches) {
      return 3;
    }
    if (window.matchMedia("(min-width: 650px)").matches) {
      return 2;
    }
    return 1;
  };

  const carouselConfigs = [
    {
      selector: "[data-offers-carousel]",
      cardSelector: ".offer-carousel-card",
      getCardsPerView: () => (window.matchMedia("(min-width: 900px)").matches ? 2 : 1),
    },
    {
      selector: "[data-more-sixt-carousel]",
      cardSelector: ".more-sixt-card",
      getCardsPerView: getMoreSixtCardsPerView,
    },
    {
      selector: "[data-testimonial-carousel]",
      cardSelector: ".testimonial-card",
      getCardsPerView: () => 1,
    },
  ];

  carouselApi.initCarousels(carouselConfigs);
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
      button.classList.toggle("is-active", isActive);
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
