const cardsRoot = document.getElementById("protectionCards");
const notice = document.getElementById("protectionNotice");
const totalTop = document.getElementById("protectionTotalTop");
const totalMobile = document.getElementById("protectionTotalMobile");
const continueTop = document.getElementById("protectionContinueTop");
const continueMobile = document.getElementById("protectionContinueMobile");
const mobileSummary = document.querySelector(".protection-mobile-summary");
const pageFooter = document.querySelector("ox-booking-footer");
const bookingOptionLabel = document.getElementById("protectionBookingOptionLabel");
const mileageLabel = document.getElementById("protectionMileageLabel");
const selectedPackageItem = document.getElementById("protectionSelectedPackageItem");
const params = new URLSearchParams(window.location.search);

const parseAmount = (value, fallback) => {
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getTotalPriceParts = (amount) => {
  const absolute = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(absolute);
  const [integerPart, decimalPart] = formatted.split(".");
  return { currency: "$", integerPart, decimalPart: `.${decimalPart}` };
};

const total = parseAmount(params.get("total"), 649.72);
const offerDaily = parseAmount(params.get("daily"), 0);
const minimumAge = parseAmount(params.get("minimumAge"), 18);
const rentalDaysFromQuery = parseAmount(params.get("rentalDays"), 0);
const rentalDaysFallback = offerDaily > 0 ? Math.max(1, Math.round(total / offerDaily)) : 1;
const rentalDays = Math.max(1, Math.round(rentalDaysFromQuery || rentalDaysFallback));
const bookingOption = params.get("bookingOption") || "best-price";
const mileageType = params.get("mileageType") || "unlimited";
const mileageIncludedKm = params.get("mileageIncludedKm") || "";
const mileageExtraPerKm = params.get("mileageExtraPerKm") || "";

const state = { selectedId: null };

const COVERAGE_ITEMS = [
  "Collision damages, scratches, bumps & theft",
  "Tire, windshield & windows",
  "Interior damage (e.g. spills)",
  "Roadside help for common mobility issues (e.g. loss of keys)",
];

const getOptions = () => {
  const basicDaily = total * 0.05;
  const smartDaily = total * 0.075;
  const allInclusiveDaily = total * 0.085;
  const smartPrevious = smartDaily / (1 - 0.4);
  const allPrevious = allInclusiveDaily / (1 - 0.5);
  return [
    {
      id: "none",
      title: "No extra protection",
      stars: 0,
      deductible: "Deductible: up to full vehicle value",
      deductibleKind: "error",
      discount: "",
      daily: null,
      previous: null,
      coverage: [false, false, false, false],
      footer: "Included",
    },
    {
      id: "basic",
      title: "Basic Protection",
      stars: 1,
      deductible: `Deductible: up to ${formatCurrency(total * 2)}`,
      deductibleKind: "primary",
      discount: "",
      daily: basicDaily,
      previous: null,
      coverage: [true, false, false, false],
      footer: "",
    },
    {
      id: "smart",
      title: "Smart Protection",
      stars: 2,
      deductible: "No deductible",
      deductibleKind: "success",
      discount: "-40% online discount",
      daily: smartDaily,
      previous: smartPrevious,
      coverage: [true, true, false, false],
      footer: "",
    },
    {
      id: "all",
      title: "All Inclusive Protection",
      stars: 3,
      deductible: "No deductible",
      deductibleKind: "success",
      discount: "-50% online discount",
      daily: allInclusiveDaily,
      previous: allPrevious,
      coverage: [true, true, true, true],
      footer: "",
    },
  ];
};

const renderCards = () => {
  cardsRoot.innerHTML = "";
  const options = getOptions();
  for (const option of options) {
    const card = document.createElement("ox-protection-card");
    card.setAttribute("option-id", option.id);
    card.setAttribute("title", option.title);
    card.setAttribute("stars", String(option.stars));
    card.setAttribute("deductible", option.deductible);
    card.setAttribute("deductible-kind", option.deductibleKind);

    if (option.daily !== null) {
      card.setAttribute("daily-price", String(option.daily));
    }
    if (option.previous !== null) {
      card.setAttribute("previous-price", String(option.previous));
    }
    if (option.discount) {
      card.setAttribute("badge-text", option.discount);
    }
    if (option.footer) {
      card.setAttribute("footer-text", option.footer);
    }

    for (let i = 0; i < COVERAGE_ITEMS.length; i++) {
      const li = document.createElement("ox-list-item");
      li.setAttribute("slot", "coverage");
      li.setAttribute("icon", option.coverage[i] ? "check" : "close");
      li.setAttribute("trailing-icon", "info");
      li.setAttribute("trailing-label", `More information about ${COVERAGE_ITEMS[i]}`);
      if (!option.coverage[i]) {
        li.setAttribute("kind", "secondary");
      }
      li.textContent = COVERAGE_ITEMS[i];
      card.appendChild(li);
    }

    cardsRoot.appendChild(card);
  }
};

const syncTotals = () => {
  const options = getOptions();
  const selectedOption = options.find((o) => o.id === state.selectedId);
  const protectionTotal =
    selectedOption && selectedOption.daily !== null
      ? selectedOption.daily * rentalDays
      : 0;
  const grandTotal = total + protectionTotal;
  const parts = getTotalPriceParts(grandTotal);

  for (const el of [totalTop, totalMobile]) {
    el.setAttribute("integer", parts.integerPart);
    el.setAttribute("decimal", parts.decimalPart);
  }
};

const syncNotice = () => {
  notice.hidden = minimumAge < 21;
};

const buildContinueHref = () => {
  const options = getOptions();
  const selectedOption = options.find((o) => o.id === state.selectedId);
  const protectionTotal =
    selectedOption && selectedOption.daily !== null
      ? selectedOption.daily * rentalDays
      : 0;
  const grandTotal = total + protectionTotal;
  const nextParams = new URLSearchParams();
  nextParams.set("total", grandTotal.toFixed(2));
  nextParams.set("daily", String(offerDaily));
  nextParams.set("rentalDays", String(rentalDays));
  nextParams.set("bookingOption", bookingOption);
  nextParams.set("mileageType", mileageType);
  if (mileageIncludedKm) nextParams.set("mileageIncludedKm", mileageIncludedKm);
  if (mileageExtraPerKm) nextParams.set("mileageExtraPerKm", mileageExtraPerKm);
  if (state.selectedId) nextParams.set("protectionPackage", state.selectedId);
  return `./add-ons.html?${nextParams.toString()}`;
};

const syncContinueState = () => {
  const disabled = !state.selectedId;
  const href = disabled ? null : buildContinueHref();
  for (const btn of [continueTop, continueMobile]) {
    btn.toggleAttribute("disabled", disabled);
    if (href) {
      btn.setAttribute("href", href);
    } else {
      btn.removeAttribute("href");
    }
  }
};

const syncBookingOptionLabel = () => {
  if (!bookingOptionLabel) return;
  bookingOptionLabel.textContent =
    bookingOption === "stay-flexible"
      ? "Booking option: Stay flexible - Free cancellation and rebooking any time before pickup time"
      : "Booking option: Best price - Pay now, cancel and rebook for a fee";
};

const syncMileageLabel = () => {
  if (!mileageLabel) return;
  if (mileageType === "limited" && mileageIncludedKm && mileageExtraPerKm) {
    mileageLabel.textContent = `${mileageIncludedKm} km are included, each additional kilometer costs $${mileageExtraPerKm}`;
    return;
  }
  mileageLabel.textContent = "Unlimited kilometers";
};

const syncSelectedPackageLabel = () => {
  if (!selectedPackageItem) return;
  const options = getOptions();
  const selectedOption = options.find((o) => o.id === state.selectedId);
  if (!selectedOption || selectedOption.id === "none") {
    selectedPackageItem.hidden = true;
    selectedPackageItem.textContent = "";
    return;
  }
  selectedPackageItem.textContent = `${selectedOption.title} - ${selectedOption.deductible}`;
  selectedPackageItem.hidden = false;
};

const syncMobileSummaryPosition = () => {
  if (!(mobileSummary instanceof HTMLElement) || !(pageFooter instanceof HTMLElement)) {
    return;
  }
  const summaryHeight = Math.ceil(mobileSummary.getBoundingClientRect().height);
  document.documentElement.style.setProperty(
    "--protection-mobile-summary-height",
    `${summaryHeight}px`
  );
  if (!window.matchMedia("(max-width: 899px)").matches) {
    mobileSummary.style.bottom = "0px";
    return;
  }
  const footerRect = pageFooter.getBoundingClientRect();
  const overlapWithFooter = Math.max(0, window.innerHeight - footerRect.top);
  mobileSummary.style.bottom = `${overlapWithFooter}px`;
};

const scheduleMobileSummarySync = () => {
  syncMobileSummaryPosition();
  requestAnimationFrame(syncMobileSummaryPosition);
};

/* Selection is coordinated by ox-protection-group.
   It fires protection-change after updating selected/expanded attributes on cards. */
cardsRoot.addEventListener("protection-change", (event) => {
  state.selectedId = event.detail.optionId;
  syncTotals();
  syncSelectedPackageLabel();
  syncContinueState();
  scheduleMobileSummarySync();
});

/* Accordion transitions inside card shadow DOM bubble up as retargeted events. */
cardsRoot.addEventListener("transitionend", scheduleMobileSummarySync);

window.addEventListener("scroll", syncMobileSummaryPosition, { passive: true });
window.addEventListener("resize", scheduleMobileSummarySync);

renderCards();
cardsRoot._syncExpansionForBreakpoint?.();
syncTotals();
syncNotice();
syncBookingOptionLabel();
syncMileageLabel();
syncSelectedPackageLabel();
syncContinueState();
scheduleMobileSummarySync();
