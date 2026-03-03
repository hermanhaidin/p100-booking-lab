(function initHomeCarousels() {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const initCarousel = (carousel, options) => {
    const viewport = carousel.querySelector(".offers-carousel-viewport");
    const track = carousel.querySelector(".offers-carousel-track");
    const cards = Array.from(carousel.querySelectorAll(options.cardSelector));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevButtons = Array.from(carousel.querySelectorAll("[data-carousel-prev]"));
    const nextButtons = Array.from(carousel.querySelectorAll("[data-carousel-next]"));

    if (!viewport || !track || cards.length === 0) {
      return;
    }

    const dragThreshold = 40;
    const wheelThreshold = 24;
    const wheelNoiseFloor = 2;
    const wheelGestureIdleMs = 160;

    let currentIndex = 0;
    let cardsPerView = 1;
    let maxIndex = 0;
    let slideStep = 0;
    let wheelDeltaBuffer = 0;
    let wheelGestureConsumed = false;
    let wheelGestureResetTimer = null;
    let pointerStartX = null;
    let pointerStartY = null;
    let pointerStartedOnControl = false;
    let resizeRaf = null;

    const getTrackGap = () => {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      return Number.isNaN(gap) ? 0 : gap;
    };

    const updateDots = () => {
      dots.forEach((dot, index) => {
        const isVisible = index <= maxIndex;
        dot.hidden = !isVisible;
        dot.disabled = !isVisible;

        if (!isVisible) {
          dot.classList.remove("is-active");
          dot.removeAttribute("aria-current");
          return;
        }

        const isActive = index === currentIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const updateControls = () => {
      const isAtStart = currentIndex === 0;
      const isAtEnd = currentIndex >= maxIndex;
      prevButtons.forEach((button) => {
        button.disabled = isAtStart;
      });
      nextButtons.forEach((button) => {
        button.disabled = isAtEnd;
      });
      updateDots();
    };

    const render = () => {
      const offset = currentIndex * slideStep;
      track.style.transform = `translateX(${-offset}px)`;
      updateControls();
    };

    const moveTo = (nextIndex) => {
      const clampedIndex = clamp(nextIndex, 0, maxIndex);
      if (clampedIndex === currentIndex) {
        return false;
      }
      currentIndex = clampedIndex;
      render();
      return true;
    };

    const moveBy = (delta) => moveTo(currentIndex + delta);

    const resetWheelGestureState = () => {
      wheelDeltaBuffer = 0;
      wheelGestureConsumed = false;
      if (wheelGestureResetTimer !== null) {
        window.clearTimeout(wheelGestureResetTimer);
        wheelGestureResetTimer = null;
      }
    };

    const scheduleWheelGestureReset = () => {
      if (wheelGestureResetTimer !== null) {
        window.clearTimeout(wheelGestureResetTimer);
      }
      wheelGestureResetTimer = window.setTimeout(() => {
        wheelGestureResetTimer = null;
        wheelDeltaBuffer = 0;
        wheelGestureConsumed = false;
      }, wheelGestureIdleMs);
    };

    const updateMetrics = () => {
      cardsPerView = clamp(options.getCardsPerView(), 1, cards.length);
      maxIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex = clamp(currentIndex, 0, maxIndex);

      const firstCard = cards[0];
      const cardWidth = firstCard.getBoundingClientRect().width;
      slideStep = cardWidth + getTrackGap();

      render();
    };

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        moveBy(-1);
      });
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        moveBy(1);
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        moveTo(index);
      });
    });

    viewport.addEventListener(
      "wheel",
      (event) => {
        // Only treat wheel as carousel input when horizontal intent is clear.
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
          resetWheelGestureState();
          return;
        }

        const directionalDelta = event.deltaX;
        if (Math.abs(directionalDelta) < wheelNoiseFloor) {
          return;
        }

        const direction = directionalDelta > 0 ? 1 : -1;
        const isAttemptingBrowserBack = direction < 0 && currentIndex === 0;

        // Let macOS history navigation happen only when the user is already at first card.
        if (isAttemptingBrowserBack) {
          resetWheelGestureState();
          return;
        }

        // Consume every horizontal gesture over the carousel to avoid page bounce.
        event.preventDefault();
        scheduleWheelGestureReset();

        if (wheelGestureConsumed) {
          return;
        }

        if (wheelDeltaBuffer !== 0 && Math.sign(wheelDeltaBuffer) !== Math.sign(directionalDelta)) {
          wheelDeltaBuffer = directionalDelta;
        } else {
          wheelDeltaBuffer += directionalDelta;
        }

        if (Math.abs(wheelDeltaBuffer) < wheelThreshold) {
          return;
        }

        const bufferedDirection = wheelDeltaBuffer > 0 ? 1 : -1;
        wheelDeltaBuffer = 0;
        wheelGestureConsumed = true;
        moveBy(bufferedDirection);
      },
      { passive: false }
    );

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      pointerStartedOnControl = Boolean(
        event.target.closest(
          "[data-carousel-prev], [data-carousel-next], [data-carousel-dot], .offer-carousel-cta, .promo-card-button"
        )
      );
      if (pointerStartedOnControl) {
        pointerStartX = null;
        pointerStartY = null;
        return;
      }

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      if (viewport.setPointerCapture) {
        viewport.setPointerCapture(event.pointerId);
      }
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartedOnControl) {
        pointerStartedOnControl = false;
        pointerStartX = null;
        pointerStartY = null;
        return;
      }
      if (pointerStartX === null || pointerStartY === null) {
        return;
      }

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      pointerStartX = null;
      pointerStartY = null;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      if (Math.abs(deltaX) < dragThreshold) {
        return;
      }
      moveBy(deltaX < 0 ? 1 : -1);
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartedOnControl = false;
      pointerStartX = null;
      pointerStartY = null;
    });

    viewport.addEventListener("lostpointercapture", () => {
      pointerStartedOnControl = false;
      pointerStartX = null;
      pointerStartY = null;
    });

    window.addEventListener("resize", () => {
      if (resizeRaf !== null) {
        window.cancelAnimationFrame(resizeRaf);
      }
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = null;
        updateMetrics();
      });
    });

    updateMetrics();
  };

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

  carouselConfigs.forEach((config) => {
    document.querySelectorAll(config.selector).forEach((carousel) => {
      initCarousel(carousel, config);
    });
  });
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
