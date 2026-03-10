(function initCarouselHelper(global) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const initCarousel = (carousel, options) => {
    const viewport = carousel.querySelector(".carousel__viewport");
    const track = carousel.querySelector(".carousel__track");
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

        if (isAttemptingBrowserBack) {
          resetWheelGestureState();
          return;
        }

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

  const initCarousels = (configs) => {
    configs.forEach((config) => {
      document.querySelectorAll(config.selector).forEach((carousel) => {
        initCarousel(carousel, config);
      });
    });
  };

  global.P100Carousel = {
    initCarousel,
    initCarousels,
  };
})(window);
