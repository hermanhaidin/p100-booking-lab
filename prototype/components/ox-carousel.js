/* Horizontal carousel with slotted children as slides.
   Auto-generates dot pagination and prev/next arrow controls.
   Supports responsive cards-per-view via breakpoint attributes.
   API: <ox-carousel cards-per-view="1" cards-per-view-md="2" gap="xs"
          prev-label="Previous" next-label="Next" dot-label="Go to slide {n}">
          <article>Slide 1</article>
          <article>Slide 2</article>
        </ox-carousel> */

import { baseStyles } from './shared/base-styles.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  :host([hidden]) { display: none; }

  .viewport {
    overflow: hidden;
    position: relative;
    touch-action: pan-y;
  }

  .track {
    display: flex;
    gap: var(--carousel-gap, var(--spacing-xs));
    transition: transform 320ms ease;
    will-change: transform;
  }

  ::slotted(*) {
    flex: 0 0 100%;
    min-width: 0;
  }

  .controls {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .dots {
    display: inline-flex;
    gap: 0;
  }

  .dot {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-xs);
    justify-content: center;
    padding: 0;
    width: var(--spacing-xs);
  }

  .dot[hidden] {
    display: none;
  }

  .dot::before {
    background-color: var(--color-content-secondary);
    border-radius: var(--radius-pill);
    content: "";
    height: 6px;
    opacity: 0.8;
    width: 6px;
  }

  .dot[aria-current="true"] {
    opacity: 1;
  }

  .dot[aria-current="true"]::before {
    background-color: var(--color-content-primary);
    opacity: 1;
  }

  .arrows-overlay {
    display: none;
  }

  .arrows-row {
    display: inline-flex;
    gap: var(--spacing-xs);
  }

  @media (max-width: 649px) {
    .controls {
      justify-content: center;
    }

    .arrows-row {
      display: none;
    }

    .arrows-overlay {
      display: flex;
      inset: 50% 0 auto;
      justify-content: space-between;
      padding-inline: var(--spacing-xs);
      pointer-events: none;
      position: absolute;
      transform: translateY(-50%);
      z-index: 3;
    }

    .arrows-overlay ox-floating-button {
      pointer-events: auto;
    }
  }
`);

const BREAKPOINTS = { sm: 650, md: 900, lg: 1200 };
const DRAG_THRESHOLD = 40;
const WHEEL_THRESHOLD = 24;
const WHEEL_NOISE_FLOOR = 2;
const WHEEL_GESTURE_IDLE_MS = 160;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const SPACING_TOKENS = {
  '0': '0px',
  '5xs': 'var(--spacing-5xs)',
  '4xs': 'var(--spacing-4xs)',
  '3xs': 'var(--spacing-3xs)',
  '2xs': 'var(--spacing-2xs)',
  'xs': 'var(--spacing-xs)',
  'sm': 'var(--spacing-sm)',
  'md': 'var(--spacing-md)',
  'lg': 'var(--spacing-lg)',
  'xl': 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
};

class OxCarousel extends HTMLElement {
  static observedAttributes = [
    'cards-per-view', 'cards-per-view-sm', 'cards-per-view-md', 'cards-per-view-lg',
    'gap', 'prev-label', 'next-label', 'dot-label',
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [baseStyles, styles];

    this._currentIndex = 0;
    this._cardsPerView = 1;
    this._maxIndex = 0;
    this._slideStep = 0;
    this._cards = [];

    this._wheelDeltaBuffer = 0;
    this._wheelGestureConsumed = false;
    this._wheelGestureResetTimer = null;
    this._pointerStartX = null;
    this._pointerStartY = null;
    this._pointerStartedOnControl = false;
    this._resizeRaf = null;

    this._mqListeners = [];

    this._onSlotChange = this._onSlotChange.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);
  }

  connectedCallback() {
    this._render();
    this._setupListeners();
  }

  disconnectedCallback() {
    this._teardownListeners();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this._render();
    this._setupListeners();
  }

  /* ---- Rendering ---- */

  _render() {
    const prevLabel = this.getAttribute('prev-label') || 'Previous';
    const nextLabel = this.getAttribute('next-label') || 'Next';

    this.shadowRoot.innerHTML = `
      <div class="carousel">
        <div class="viewport" part="viewport">
          <div class="track" part="track">
            <slot></slot>
          </div>
          <div class="arrows-overlay">
            <ox-floating-button size="medium" content="icon-only" icon="chevron_left" label="${prevLabel}" class="arrow-prev"></ox-floating-button>
            <ox-floating-button size="medium" content="icon-only" icon="chevron_right" label="${nextLabel}" class="arrow-next"></ox-floating-button>
          </div>
        </div>
        <div class="controls" part="controls">
          <div class="dots" part="dots"></div>
          <div class="arrows-row">
            <ox-floating-button size="medium" content="icon-only" icon="chevron_left" label="${prevLabel}" class="arrow-prev"></ox-floating-button>
            <ox-floating-button size="medium" content="icon-only" icon="chevron_right" label="${nextLabel}" class="arrow-next"></ox-floating-button>
          </div>
        </div>
      </div>
    `;

    this._applyGap();
  }

  _applyGap() {
    const gap = this.getAttribute('gap') || 'xs';
    const token = SPACING_TOKENS[gap] || `var(--spacing-${gap})`;
    this.style.setProperty('--carousel-gap', token);
  }

  /* ---- Listener management ---- */

  _setupListeners() {
    this._teardownListeners();

    const slot = this.shadowRoot.querySelector('slot');
    const viewport = this.shadowRoot.querySelector('.viewport');
    if (!slot || !viewport) return;

    slot.addEventListener('slotchange', this._onSlotChange);
    window.addEventListener('resize', this._onResize);
    viewport.addEventListener('wheel', this._onWheel, { passive: false });
    viewport.addEventListener('pointerdown', this._onPointerDown);
    viewport.addEventListener('pointerup', this._onPointerUp);
    viewport.addEventListener('pointercancel', this._onPointerCancel);
    viewport.addEventListener('lostpointercapture', this._onPointerCancel);

    // Prev/next button listeners
    this.shadowRoot.querySelectorAll('.arrow-prev').forEach(btn => {
      btn.addEventListener('click', () => this._moveBy(-1));
    });
    this.shadowRoot.querySelectorAll('.arrow-next').forEach(btn => {
      btn.addEventListener('click', () => this._moveBy(1));
    });

    // Responsive breakpoint listeners
    for (const [suffix, px] of Object.entries(BREAKPOINTS)) {
      if (this.hasAttribute(`cards-per-view-${suffix}`)) {
        const mql = window.matchMedia(`(min-width: ${px}px)`);
        const handler = () => this._updateMetrics();
        mql.addEventListener('change', handler);
        this._mqListeners.push({ mql, handler });
      }
    }

    // Initial metrics after slot content is available
    this._onSlotChange();
  }

  _teardownListeners() {
    const slot = this.shadowRoot.querySelector('slot');
    const viewport = this.shadowRoot.querySelector('.viewport');
    if (slot) slot.removeEventListener('slotchange', this._onSlotChange);
    if (viewport) {
      viewport.removeEventListener('wheel', this._onWheel);
      viewport.removeEventListener('pointerdown', this._onPointerDown);
      viewport.removeEventListener('pointerup', this._onPointerUp);
      viewport.removeEventListener('pointercancel', this._onPointerCancel);
      viewport.removeEventListener('lostpointercapture', this._onPointerCancel);
    }
    window.removeEventListener('resize', this._onResize);

    for (const { mql, handler } of this._mqListeners) {
      mql.removeEventListener('change', handler);
    }
    this._mqListeners = [];

    if (this._resizeRaf !== null) {
      window.cancelAnimationFrame(this._resizeRaf);
      this._resizeRaf = null;
    }
    if (this._wheelGestureResetTimer !== null) {
      window.clearTimeout(this._wheelGestureResetTimer);
      this._wheelGestureResetTimer = null;
    }
  }

  /* ---- Slot & metrics ---- */

  _onSlotChange() {
    const slot = this.shadowRoot.querySelector('slot');
    this._cards = slot ? slot.assignedElements() : [];
    this._updateMetrics();
  }

  _getCardsPerView() {
    for (const suffix of ['lg', 'md', 'sm']) {
      const attr = this.getAttribute(`cards-per-view-${suffix}`);
      if (attr && window.matchMedia(`(min-width: ${BREAKPOINTS[suffix]}px)`).matches) {
        return parseInt(attr, 10) || 1;
      }
    }
    return parseInt(this.getAttribute('cards-per-view'), 10) || 1;
  }

  _getTrackGap() {
    const track = this.shadowRoot.querySelector('.track');
    if (!track) return 0;
    const s = window.getComputedStyle(track);
    const gap = parseFloat(s.columnGap || s.gap || '0');
    return Number.isNaN(gap) ? 0 : gap;
  }

  _updateMetrics() {
    const cards = this._cards;
    if (cards.length === 0) return;

    this._cardsPerView = clamp(this._getCardsPerView(), 1, cards.length);
    this._maxIndex = Math.max(0, cards.length - this._cardsPerView);
    this._currentIndex = clamp(this._currentIndex, 0, this._maxIndex);

    const firstCard = cards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    this._slideStep = cardWidth + this._getTrackGap();

    this._renderDots();
    this._applyTransform();
    this._updateControls();
  }

  /* ---- Dots ---- */

  _renderDots() {
    const dotsContainer = this.shadowRoot.querySelector('.dots');
    if (!dotsContainer) return;

    const dotLabel = this.getAttribute('dot-label') || 'Go to slide {n}';
    const totalDots = this._cards.length;
    const existingDots = dotsContainer.querySelectorAll('.dot');

    if (existingDots.length !== totalDots) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', dotLabel.replace('{n}', String(i + 1)));
        dot.addEventListener('click', () => this._moveTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    this._updateDotStates();
  }

  _updateDotStates() {
    const dots = this.shadowRoot.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      const isVisible = index <= this._maxIndex;
      dot.hidden = !isVisible;
      dot.disabled = !isVisible;

      if (!isVisible) {
        dot.removeAttribute('aria-current');
        return;
      }

      if (index === this._currentIndex) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  /* ---- Navigation ---- */

  _moveTo(nextIndex) {
    const clamped = clamp(nextIndex, 0, this._maxIndex);
    if (clamped === this._currentIndex) return false;
    this._currentIndex = clamped;
    this._applyTransform();
    this._updateControls();
    return true;
  }

  _moveBy(delta) {
    return this._moveTo(this._currentIndex + delta);
  }

  _applyTransform() {
    const track = this.shadowRoot.querySelector('.track');
    if (!track) return;
    const offset = this._currentIndex * this._slideStep;
    track.style.transform = `translateX(${-offset}px)`;
  }

  _updateControls() {
    const isAtStart = this._currentIndex === 0;
    const isAtEnd = this._currentIndex >= this._maxIndex;

    this.shadowRoot.querySelectorAll('.arrow-prev').forEach(btn => {
      btn.toggleAttribute('disabled', isAtStart);
    });
    this.shadowRoot.querySelectorAll('.arrow-next').forEach(btn => {
      btn.toggleAttribute('disabled', isAtEnd);
    });

    this._updateDotStates();
  }

  /* ---- Resize ---- */

  _onResize() {
    if (this._resizeRaf !== null) {
      window.cancelAnimationFrame(this._resizeRaf);
    }
    this._resizeRaf = window.requestAnimationFrame(() => {
      this._resizeRaf = null;
      this._updateMetrics();
    });
  }

  /* ---- Wheel ---- */

  _resetWheelGestureState() {
    this._wheelDeltaBuffer = 0;
    this._wheelGestureConsumed = false;
    if (this._wheelGestureResetTimer !== null) {
      window.clearTimeout(this._wheelGestureResetTimer);
      this._wheelGestureResetTimer = null;
    }
  }

  _scheduleWheelGestureReset() {
    if (this._wheelGestureResetTimer !== null) {
      window.clearTimeout(this._wheelGestureResetTimer);
    }
    this._wheelGestureResetTimer = window.setTimeout(() => {
      this._wheelGestureResetTimer = null;
      this._wheelDeltaBuffer = 0;
      this._wheelGestureConsumed = false;
    }, WHEEL_GESTURE_IDLE_MS);
  }

  _onWheel(event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      this._resetWheelGestureState();
      return;
    }

    const directionalDelta = event.deltaX;
    if (Math.abs(directionalDelta) < WHEEL_NOISE_FLOOR) return;

    const direction = directionalDelta > 0 ? 1 : -1;
    const isAttemptingBrowserBack = direction < 0 && this._currentIndex === 0;

    if (isAttemptingBrowserBack) {
      this._resetWheelGestureState();
      return;
    }

    event.preventDefault();
    this._scheduleWheelGestureReset();

    if (this._wheelGestureConsumed) return;

    if (this._wheelDeltaBuffer !== 0 && Math.sign(this._wheelDeltaBuffer) !== Math.sign(directionalDelta)) {
      this._wheelDeltaBuffer = directionalDelta;
    } else {
      this._wheelDeltaBuffer += directionalDelta;
    }

    if (Math.abs(this._wheelDeltaBuffer) < WHEEL_THRESHOLD) return;

    const bufferedDirection = this._wheelDeltaBuffer > 0 ? 1 : -1;
    this._wheelDeltaBuffer = 0;
    this._wheelGestureConsumed = true;
    this._moveBy(bufferedDirection);
  }

  /* ---- Pointer / drag ---- */

  _onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    this._pointerStartedOnControl = Boolean(
      event.target.closest('ox-floating-button, .dot')
    );
    if (this._pointerStartedOnControl) {
      this._pointerStartX = null;
      this._pointerStartY = null;
      return;
    }

    this._pointerStartX = event.clientX;
    this._pointerStartY = event.clientY;

    const viewport = this.shadowRoot.querySelector('.viewport');
    if (viewport && viewport.setPointerCapture) {
      viewport.setPointerCapture(event.pointerId);
    }
  }

  _onPointerUp(event) {
    if (this._pointerStartedOnControl) {
      this._pointerStartedOnControl = false;
      this._pointerStartX = null;
      this._pointerStartY = null;
      return;
    }
    if (this._pointerStartX === null || this._pointerStartY === null) return;

    const deltaX = event.clientX - this._pointerStartX;
    const deltaY = event.clientY - this._pointerStartY;
    this._pointerStartX = null;
    this._pointerStartY = null;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (Math.abs(deltaX) < DRAG_THRESHOLD) return;

    this._moveBy(deltaX < 0 ? 1 : -1);
  }

  _onPointerCancel() {
    this._pointerStartedOnControl = false;
    this._pointerStartX = null;
    this._pointerStartY = null;
  }
}

customElements.define('ox-carousel', OxCarousel);
