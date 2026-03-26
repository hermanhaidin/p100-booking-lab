(() => {
  const header = document.querySelector('ox-booking-header');
  const grid = document.getElementById('offer-list-grid');
  if (!grid) return;

  const MOBILE_BREAKPOINT = '(max-width: 649px)';
  const TABLET_BREAKPOINT = '(min-width: 650px) and (max-width: 1199px)';
  const mobileDetailsOverlay = document.createElement('div');
  const mobileDetailsSheet = document.createElement('div');
  let offersData = [];
  let assetsMap = new Map();
  let bannerData = null;
  let selectedOfferIndex = null;
  let lastTriggerElement = null;

  // Header theme: option-light on tablet+, prime-light on mobile.
  const syncHeaderTheme = () => {
    if (!header) return;
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
    header.setAttribute('theme', isMobile ? 'prime-light' : 'option-light');
  };

  // --- Parsing helpers (unchanged from original) ---

  const parseAssets = (markdown) => {
    const assets = new Map();
    const lines = markdown.split('\n');
    for (const line of lines) {
      const match = line.match(/^-\s*(.*?):\s*(https?:\/\/\S+)\s*$/);
      if (match) {
        assets.set(match[1].trim(), match[2].trim());
      }
    }
    return assets;
  };

  const parseOfferBlock = (block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const offer = {};
    for (const line of lines) {
      const match = line.match(/^-\s*([^:]+):\s*(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = match[2].replaceAll('`', '').trim();
      offer[key] = value;
    }
    offer.Badges = offer.Badges && offer.Badges !== 'N/A'
      ? offer.Badges.split(',').map((v) => v.trim()).filter(Boolean)
      : [];
    offer.Specs = offer.Specs
      ? offer.Specs.split(',').map((v) => v.trim()).filter(Boolean)
      : [];
    return offer;
  };

  const parseOffers = (markdown) => {
    const offers = [];
    const offerMatches = markdown.matchAll(/- \*\*Offer (\d+)\*\*\n((?: {4}- .*\n)+)/g);
    for (const match of offerMatches) {
      offers.push({
        index: Number(match[1]),
        ...parseOfferBlock(match[2]),
      });
    }
    return offers;
  };

  const parseBanner = (markdown) => {
    const titleMatch = markdown.match(/## Banner[\s\S]*?- \*\*Title\*\*: `([^`]+)`/);
    const subtitleMatch = markdown.match(/## Banner[\s\S]*?- \*\*Subtitle\*\*: `([^`]+)`/);
    const ctaMatch = markdown.match(/## Banner[\s\S]*?- \*\*CTA\*\*: `([^`]+)`/);
    return {
      title: titleMatch ? titleMatch[1] : '',
      subtitle: subtitleMatch ? subtitleMatch[1] : '',
      cta: ctaMatch ? ctaMatch[1] : '',
    };
  };

  // --- Price helpers ---

  const parsePriceParts = (value, type) => {
    const cleaned = value.replaceAll('$', '').trim();
    const [amount, suffixRaw] = cleaned.split(type === 'day' ? '/' : ' ');
    const [integerPart, decimalPart] = amount.split('.');
    const suffix = type === 'day' ? `/ ${suffixRaw.trim()}` : suffixRaw.trim();
    return { integerPart, decimalPart: `.${decimalPart ?? '00'}`, suffix };
  };

  const parseCurrencyAmount = (value) => {
    const normalized = String(value ?? '').replace(/[^0-9.-]/g, '');
    const amount = Number.parseFloat(normalized);
    return Number.isFinite(amount) ? amount : 0;
  };

  const getPriceAmount = (priceParts) =>
    parseCurrencyAmount(`${priceParts.integerPart}${priceParts.decimalPart}`);

  const buildPriceParts = (amount, suffix) => {
    const normalized = Number.isFinite(amount) ? amount : 0;
    const [integerPart, decimalDigits] = normalized.toFixed(2).split('.');
    return { integerPart, decimalPart: `.${decimalDigits}`, suffix };
  };

  // --- Data helpers ---

  const getTripDurationDaysFromHeader = () => {
    const datesText = header?.getAttribute('dates') || '';
    const tripMatch = datesText.match(
      /([A-Za-z]{3}\s+\d{1,2})\s*\|\s*([\d:]+\s*[AP]M)\s*-\s*([A-Za-z]{3}\s+\d{1,2})\s*\|\s*([\d:]+\s*[AP]M)/i,
    );
    if (!tripMatch) return null;

    const [, startDatePart, startTimePart, endDatePart, endTimePart] = tripMatch;
    const year = new Date().getFullYear();
    const start = new Date(`${startDatePart} ${year} ${startTimePart}`);
    let end = new Date(`${endDatePart} ${year} ${endTimePart}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    if (end < start) {
      end = new Date(`${endDatePart} ${year + 1} ${endTimePart}`);
    }

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return null;
    return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  };

  const getOfferVariantKey = (modelLabel) => {
    if (modelLabel === 'Premium brand') return 'premium';
    if (modelLabel === 'Guaranteed model') return 'guaranteed';
    return 'default';
  };

  const getModelBadgeLabel = (offer) => offer['Model label'] || 'Or similar model';

  const getMinimumAge = (offer) =>
    getOfferVariantKey(getModelBadgeLabel(offer)) === 'default' ? 18 : 21;

  const getDailyPriceAmount = (offer) => {
    const dailyRaw = String(offer['Price per day'] ?? '').replaceAll('/day', '').trim();
    return parseCurrencyAmount(dailyRaw);
  };

  const getFlexibleAddon = (offer) => (getDailyPriceAmount(offer) * 0.05).toFixed(2);

  const getMileageDetails = (offer) => {
    const includedRaw = String(offer.Included ?? '').trim();
    const limitedMatch = includedRaw.match(/([\d,]+)\s*(?:kilometers?|km)\s*included/i);
    if (limitedMatch) {
      const includedKm = limitedMatch[1];
      const additionalPerKm = (getDailyPriceAmount(offer) * 0.005).toFixed(2);
      return {
        title: `${includedKm} km`,
        subtitle: `+$${additionalPerKm} / for every additional km`,
        includedLabel: 'Included',
      };
    }
    return {
      title: 'Unlimited kilometers',
      subtitle: 'All kilometers are included in the price',
      includedLabel: 'Included',
    };
  };

  // --- Price amount extraction from raw offer data ---

  const getAmountFromOffer = (offer, bookingOption) => {
    const baseDailyParts = parsePriceParts(offer['Price per day'], 'day');
    const baseTotalParts = parsePriceParts(offer['Total price'], 'total');
    const baseDailyAmount = getPriceAmount(baseDailyParts);
    const baseTotalAmount = getPriceAmount(baseTotalParts);
    const flexibleAddonAmount = Number.parseFloat(getFlexibleAddon(offer));
    const isFlexible = bookingOption === 'stay-flexible';
    const fallbackRentalDays = baseDailyAmount > 0
      ? Math.max(1, Math.round(baseTotalAmount / baseDailyAmount))
      : 1;
    const rentalDays = getTripDurationDaysFromHeader() || fallbackRentalDays;
    const dailyAmount = isFlexible ? baseDailyAmount + flexibleAddonAmount : baseDailyAmount;
    const totalAmount = isFlexible ? baseTotalAmount + (flexibleAddonAmount * rentalDays) : baseTotalAmount;
    return { dailyAmount, totalAmount, rentalDays, baseDailyParts, baseTotalParts };
  };

  // --- Grid layout helpers ---

  const getGridColumns = () => {
    if (window.matchMedia('(min-width: 1200px)').matches) return 3;
    if (window.matchMedia('(min-width: 650px)').matches) return 2;
    return 1;
  };

  const buildGridSequence = () => {
    const sequence = [];
    offersData.forEach((offer, offerIndex) => {
      sequence.push({ type: 'offer', offer, offerIndex });
      if (offerIndex === 2 && bannerData) {
        sequence.push({ type: 'banner' });
      }
    });
    return sequence;
  };

  const getInlineInsertIndex = (sequence) => {
    if (selectedOfferIndex === null) return -1;
    const selectedSequenceIndex = sequence.findIndex(
      (item) => item.type === 'offer' && item.offerIndex === selectedOfferIndex,
    );
    if (selectedSequenceIndex < 0) return -1;
    const columns = getGridColumns();
    return Math.min(
      (Math.floor(selectedSequenceIndex / columns) + 1) * columns,
      sequence.length,
    );
  };

  // --- Component render helpers ---

  const renderOfferCard = (offer, imageUrl, offerIndex) => {
    const card = document.createElement('ox-offer-card');
    card.setAttribute('title', offer.Title);
    card.setAttribute('subtitle', offer.Subtitle);
    card.setAttribute('image', imageUrl);
    card.setAttribute('offer-index', String(offerIndex));
    card.setAttribute('model-label', getModelBadgeLabel(offer));
    card.setAttribute('specs', offer.Specs.join(', '));
    card.setAttribute('badges', offer.Badges.join(', '));
    card.setAttribute('included', offer.Included || '');
    card.setAttribute('currency', '$');

    const rawDaily = String(offer['Price per day'] ?? '').replace(/^\$?\s*/, '').split('/')[0].trim();
    const rawTotal = String(offer['Total price'] ?? '').replace(/^\$?\s*/, '').split(' ')[0].trim();
    card.setAttribute('daily-price', rawDaily);
    card.setAttribute('total-price', rawTotal);

    const dailyParts = parsePriceParts(offer['Price per day'], 'day');
    const totalParts = parsePriceParts(offer['Total price'], 'total');
    card.setAttribute('daily-suffix', dailyParts.suffix);
    card.setAttribute('total-suffix', totalParts.suffix);

    if (selectedOfferIndex === offerIndex) {
      card.setAttribute('active', '');
    }
    return card;
  };

  const renderOfferBanner = (banner, bannerImage) => {
    const el = document.createElement('ox-offer-banner');
    el.setAttribute('title', banner.title);
    el.setAttribute('subtitle', banner.subtitle);
    el.setAttribute('cta-text', banner.cta);
    el.setAttribute('image', bannerImage);
    el.setAttribute('href', '#');
    return el;
  };

  const renderOfferDetails = (offer, imageUrl) => {
    const modelLabel = getModelBadgeLabel(offer);
    const variant = getOfferVariantKey(modelLabel);
    const dailyPrice = parsePriceParts(offer['Price per day'], 'day');
    const totalPrice = parsePriceParts(offer['Total price'], 'total');
    const flexibleAddon = getFlexibleAddon(offer);
    const flexibleAddonPrice = parsePriceParts(`$ ${flexibleAddon} / day`, 'day');
    const mileageDetails = getMileageDetails(offer);

    const el = document.createElement('ox-offer-details');
    el.setAttribute('variant', variant);
    el.setAttribute('title', offer.Title);
    el.setAttribute('subtitle', offer.Subtitle);
    el.setAttribute('image', imageUrl);
    el.setAttribute('model-label', modelLabel);
    el.setAttribute('specs', offer.Specs.join(', '));
    el.setAttribute('included', offer.Included || '');
    el.setAttribute('currency', '$');
    el.setAttribute('daily-integer', dailyPrice.integerPart);
    el.setAttribute('daily-decimal', dailyPrice.decimalPart);
    el.setAttribute('daily-suffix', dailyPrice.suffix);
    el.setAttribute('total-integer', totalPrice.integerPart);
    el.setAttribute('total-decimal', totalPrice.decimalPart);
    el.setAttribute('total-suffix', totalPrice.suffix);
    el.setAttribute('flexible-addon-integer', flexibleAddonPrice.integerPart);
    el.setAttribute('flexible-addon-decimal', flexibleAddonPrice.decimalPart);
    el.setAttribute('flexible-addon-suffix', flexibleAddonPrice.suffix);
    el.setAttribute('mileage-title', mileageDetails.title);
    el.setAttribute('mileage-subtitle', mileageDetails.subtitle);
    el.setAttribute('mileage-included-label', mileageDetails.includedLabel);
    el.setAttribute('min-age', String(getMinimumAge(offer)));
    el.setAttribute('booking-option', 'best-price');

    return el;
  };

  // --- Core state and rendering ---

  const closeOfferDetails = ({ restoreFocus = true } = {}) => {
    if (selectedOfferIndex === null) return;
    selectedOfferIndex = null;
    renderList();
    if (restoreFocus && lastTriggerElement && lastTriggerElement.isConnected) {
      lastTriggerElement.focus();
    }
  };

  const syncMobileDialogState = () => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
    const mobileOpen = isMobile && selectedOfferIndex !== null;
    mobileDetailsOverlay.classList.toggle('is-open', mobileOpen);
    mobileDetailsOverlay.setAttribute('aria-hidden', mobileOpen ? 'false' : 'true');
    mobileDetailsSheet.classList.toggle('is-open', mobileOpen);
    mobileDetailsSheet.setAttribute('aria-hidden', mobileOpen ? 'false' : 'true');
    document.body.classList.toggle('offer-details-lock-scroll', mobileOpen);
  };

  const focusDetailsCloseButton = () => {
    const scope = window.matchMedia(MOBILE_BREAKPOINT).matches ? mobileDetailsSheet : grid;
    const detailsEl = scope.querySelector('ox-offer-details');
    if (!detailsEl?.shadowRoot) return;
    const closeBtn = detailsEl.shadowRoot.querySelector('[data-close]');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const syncBannerHeightToCard = () => {
    const firstCard = grid.querySelector('ox-offer-card');
    if (!firstCard) return;
    const cardHeight = Math.round(firstCard.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--offer-banner-mobile-height', `${cardHeight}px`);
  };

  const scrollInlineDetailsIntoView = () => {
    if (selectedOfferIndex === null || window.matchMedia(MOBILE_BREAKPOINT).matches) return;
    const detailsSlot = grid.querySelector('.offer-list-details-slot');
    if (!detailsSlot) return;
    const rect = detailsSlot.getBoundingClientRect();
    const pageY = window.scrollY + rect.top;
    const isTablet = window.matchMedia(TABLET_BREAKPOINT).matches;
    const targetY = isTablet
      ? Math.max(0, pageY - Math.round(window.innerHeight * 0.18))
      : Math.max(0, pageY - Math.round((window.innerHeight - rect.height) / 2));
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const renderList = () => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
    const sequence = buildGridSequence();
    const inlineInsertIndex = !isMobile ? getInlineInsertIndex(sequence) : -1;
    const elements = [];

    sequence.forEach((item, index) => {
      if (item.type === 'offer') {
        const imageUrl = assetsMap.get(item.offer.Title) || '';
        elements.push(renderOfferCard(item.offer, imageUrl, item.offerIndex));
      } else if (item.type === 'banner' && bannerData) {
        const bannerImage = assetsMap.get('Banner') || '';
        elements.push(renderOfferBanner(bannerData, bannerImage));
      }

      if (inlineInsertIndex === index + 1 && selectedOfferIndex !== null) {
        const selectedOffer = offersData[selectedOfferIndex];
        const selectedImage = selectedOffer ? assetsMap.get(selectedOffer.Title) || '' : '';
        if (selectedOffer) {
          const slot = document.createElement('div');
          slot.className = 'offer-list-details-slot';
          const wrapper = document.createElement('div');
          wrapper.className = 'offer-list-details-wrapper';
          wrapper.appendChild(renderOfferDetails(selectedOffer, selectedImage));
          slot.appendChild(wrapper);
          elements.push(slot);
        }
      }
    });

    grid.replaceChildren(...elements);

    if (isMobile && selectedOfferIndex !== null) {
      const selectedOffer = offersData[selectedOfferIndex];
      const selectedImage = selectedOffer ? assetsMap.get(selectedOffer.Title) || '' : '';
      if (selectedOffer) {
        mobileDetailsSheet.replaceChildren(renderOfferDetails(selectedOffer, selectedImage));
      } else {
        mobileDetailsSheet.replaceChildren();
      }
    } else {
      mobileDetailsSheet.replaceChildren();
    }

    syncMobileDialogState();
    requestAnimationFrame(() => {
      syncBannerHeightToCard();
      if (!isMobile && selectedOfferIndex !== null) {
        scrollInlineDetailsIntoView();
      }
    });
  };

  // --- Price updates when booking option changes ---

  const updateOfferDetailsPricing = (detailsEl, offer, bookingOption) => {
    if (!detailsEl || !offer) return;

    const { dailyAmount, totalAmount } = getAmountFromOffer(offer, bookingOption);
    const baseDailyParts = parsePriceParts(offer['Price per day'], 'day');
    const baseTotalParts = parsePriceParts(offer['Total price'], 'total');
    const nextDailyParts = buildPriceParts(dailyAmount, baseDailyParts.suffix);
    const nextTotalParts = buildPriceParts(totalAmount, baseTotalParts.suffix);

    detailsEl.setAttribute('daily-integer', nextDailyParts.integerPart);
    detailsEl.setAttribute('daily-decimal', nextDailyParts.decimalPart);
    detailsEl.setAttribute('daily-suffix', nextDailyParts.suffix);
    detailsEl.setAttribute('total-integer', nextTotalParts.integerPart);
    detailsEl.setAttribute('total-decimal', nextTotalParts.decimalPart);
    detailsEl.setAttribute('total-suffix', nextTotalParts.suffix);
  };

  // --- Navigation ---

  const proceedToProtection = () => {
    if (selectedOfferIndex === null) return;
    const selectedOffer = offersData[selectedOfferIndex];
    if (!selectedOffer) return;

    const scope = window.matchMedia(MOBILE_BREAKPOINT).matches ? mobileDetailsSheet : grid;
    const detailsEl = scope.querySelector('ox-offer-details');
    const bookingOption = detailsEl?.getAttribute('booking-option') || 'best-price';
    const mileageDetails = getMileageDetails(selectedOffer);

    const { dailyAmount, totalAmount, rentalDays } = getAmountFromOffer(selectedOffer, bookingOption);

    const limitedKmMatch = mileageDetails.title.match(/^([\d,]+)\s*km$/i);
    const extraKmPriceMatch = mileageDetails.subtitle.match(/\+\$([\d.]+)/i);
    const mileageIncludedKm = limitedKmMatch?.[1] || '';
    const mileageExtraPerKm = extraKmPriceMatch?.[1] || '';
    const mileageType = mileageIncludedKm && mileageExtraPerKm ? 'limited' : 'unlimited';

    const params = new URLSearchParams({
      offerIndex: String(selectedOfferIndex),
      offerTitle: selectedOffer.Title || '',
      total: totalAmount.toFixed(2),
      daily: dailyAmount.toFixed(2),
      minimumAge: String(getMinimumAge(selectedOffer)),
      rentalDays: String(rentalDays),
      bookingOption,
      mileageType,
      mileageIncludedKm,
      mileageExtraPerKm,
    });
    window.location.href = `./protection.html?${params.toString()}`;
  };

  // --- Event handlers ---

  const handleCardClick = (event) => {
    const index = event.detail?.offerIndex;
    if (index == null || !Number.isInteger(index)) return;
    selectedOfferIndex = index;
    lastTriggerElement = event.target;
    renderList();
    requestAnimationFrame(focusDetailsCloseButton);
  };

  const handleDetailsClose = () => closeOfferDetails();

  const handleDetailsNext = () => proceedToProtection();

  const handleOptionChange = (event) => {
    if (selectedOfferIndex === null) return;
    const offer = offersData[selectedOfferIndex];
    if (!offer) return;
    const detailsEl = event.target.closest('ox-offer-details');
    updateOfferDetailsPricing(detailsEl, offer, event.detail?.bookingOption || 'best-price');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && selectedOfferIndex !== null) {
      closeOfferDetails();
    }
  };

  const initMobileLayer = () => {
    mobileDetailsOverlay.className = 'offer-details-overlay';
    mobileDetailsOverlay.setAttribute('aria-hidden', 'true');
    mobileDetailsSheet.className = 'offer-details-mobile-sheet';
    mobileDetailsSheet.id = 'offer-details-mobile-sheet';
    mobileDetailsSheet.setAttribute('aria-hidden', 'true');
    document.body.append(mobileDetailsOverlay, mobileDetailsSheet);
  };

  const onViewportResize = () => {
    syncHeaderTheme();
    renderList();
  };

  // --- Data loading ---

  const fetchAndPrepareData = async () => {
    const [contentResponse, assetsResponse] = await Promise.all([
      fetch(grid.dataset.contentSrc),
      fetch(grid.dataset.assetsSrc),
    ]);
    if (!contentResponse.ok || !assetsResponse.ok) return;
    const [contentMarkdown, assetsMarkdown] = await Promise.all([
      contentResponse.text(),
      assetsResponse.text(),
    ]);
    offersData = parseOffers(contentMarkdown);
    bannerData = parseBanner(contentMarkdown);
    assetsMap = parseAssets(assetsMarkdown);
  };

  // --- Bootstrap ---

  syncHeaderTheme();
  initMobileLayer();

  grid.addEventListener('offer-card-click', handleCardClick);
  grid.addEventListener('offer-details-close', handleDetailsClose);
  grid.addEventListener('offer-details-next', handleDetailsNext);
  grid.addEventListener('offer-details-option-change', handleOptionChange);

  mobileDetailsOverlay.addEventListener('click', () => closeOfferDetails());
  mobileDetailsSheet.addEventListener('offer-details-close', handleDetailsClose);
  mobileDetailsSheet.addEventListener('offer-details-next', handleDetailsNext);
  mobileDetailsSheet.addEventListener('offer-details-option-change', handleOptionChange);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onViewportResize);

  fetchAndPrepareData().then(() => {
    renderList();
  });
})();
