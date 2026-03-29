const cardsRoot = document.getElementById("addonsCards");
const notice = document.getElementById("addonsNotice");
const totalTop = document.getElementById("addonsTotalTop");
const totalMobile = document.getElementById("addonsTotalMobile");
const continueTop = document.getElementById("addonsContinueTop");
const continueMobile = document.getElementById("addonsContinueMobile");
const mobileSummary = document.querySelector(".addons-mobile-summary");
const pageFooter = document.querySelector("ox-booking-footer");
const overviewEl = document.getElementById("addonsOverview");
const bookingOptionLabel = document.getElementById("addonsBookingOptionLabel");
const mileageLabel = document.getElementById("addonsMileageLabel");
const protectionLabel = document.getElementById("addonsProtectionLabel");

const params = new URLSearchParams(window.location.search);

const parseAmount = (value, fallback) => {
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
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

const total = parseAmount(params.get("total"), 936.75);
const rentalDaysFromQuery = parseAmount(params.get("rentalDays"), 0);
const offerDaily = parseAmount(params.get("daily"), 0);
const rentalDaysFallback = offerDaily > 0 ? Math.max(1, Math.round(total / offerDaily)) : 4;
const rentalDays = Math.max(1, Math.round(rentalDaysFromQuery || rentalDaysFallback));
const minimumAge = parseAmount(params.get("minimumAge"), 18);
const bookingOption = params.get("bookingOption") || "best-price";
const mileageType = params.get("mileageType") || "unlimited";
const mileageIncludedKm = params.get("mileageIncludedKm") || "";
const mileageExtraPerKm = params.get("mileageExtraPerKm") || "";
const protectionPackage = params.get("protectionPackage") || "";

const ADDONS = [
  { id: "additional-driver", title: "Additional driver", price: 10.91, priceSuffix: "/ day & driver", icon: "person_add", details: "Share the driving for a safer and more relaxed trip. Each extra driver must show a valid license when picking up the vehicle.", controlType: "stepper", maxQuantity: 5 },
  { id: "gps-carplay", title: "GPS and Android Auto / Apple CarPlay", price: 10.91, priceSuffix: "/ day", icon: "navigation", details: "You receive a vehicle with a GPS to reach your destination on time. Additionally, you can use your smartphone on the touch screen display of your rental vehicle with Android Auto / Apple CarPlay, for example, for calls or music playback.", controlType: "switch", maxQuantity: 1 },
  { id: "refuelling", title: "Refuelling/recharging service", price: 24.79, priceSuffix: "/ one-time", icon: "local_gas_station", details: "Save time on your return and skip the last gas stop. Bring the car back with any amount of fuel, and we'll refill it for you at the normal pump price - with no refueling penalties or surprise fees. Of course, this service also applies to electric vehicles.", controlType: "switch", maxQuantity: 1 },
  { id: "cross-border", title: "Cross-border driving", price: 29.51, priceSuffix: "/ one-time", icon: "globe", details: "Drive with authorization and selected protection in approved countries such as Austria, France, Italy, the Netherlands, and Switzerland. This prevents coverage gaps or rental violations so you can explore internationally with confidence and peace of mind. For a complete list of approved countries, please refer to the rental information.", controlType: "switch", maxQuantity: 1 },
  { id: "baby-seat", title: "Baby seat", price: 13.39, priceSuffix: "/ day", iconSrc: "../assets/icons/special_infant_seat.svg", details: "Designed for infants and toddlers up to 4 years old (16-41 in / 40-105 cm tall), this rear-facing seat delivers essential early-stage protection. It ensures proper positioning so your baby rides safer and you travel with greater peace of mind.", controlType: "stepper", maxQuantity: 3 },
  { id: "child-seat", title: "Child seat", price: 13.39, priceSuffix: "/ day", iconSrc: "../assets/icons/special_toddler_seat.svg", details: "Built for children approximately 15 months to 12 years old (30-59 in / 76-150 cm tall), this seat provides size-appropriate restraint and support. It improves safety and comfort as your child grows, making every trip more secure and worry-free.", controlType: "stepper", maxQuantity: 3 },
  { id: "booster-seat", title: "Booster seat", price: 12.40, priceSuffix: "/ day", iconSrc: "../assets/icons/special_booster_backless_seat.svg", details: "Ideal for children 8-12 years old (53-59 in / 135-150 cm tall), this booster positions the seatbelt correctly across the body. It enhances protection and comfort so older kids ride safer on every journey.", controlType: "stepper", maxQuantity: 3 },
  { id: "snow-chains", title: "Snow chains", price: 17.85, priceSuffix: "/ day", icon: "snowflake", details: "Snow chains provide the traction needed to stay in control on icy or snowy roads. They are required in some regions, helping you avoid fines while driving more safely and confidently in winter conditions.", controlType: "switch", maxQuantity: 1 },
  { id: "ski-rack", title: "Ski rack", price: 17.85, priceSuffix: "/ day", icon: "downhill_skiing", details: "Carry skis and snowboards safely outside the vehicle to free up passenger space. This protects your equipment and makes winter travel more comfortable and hassle-free.", controlType: "stepper", maxQuantity: 3 },
  { id: "priority-service", title: "Priority Service", price: 34.71, priceSuffix: "/ one-time", icon: "diamond", details: "Collect your keys and vehicle through dedicated priority counters and parking instead of waiting in standard pickup lines. This speeds up your arrival and lets you start your trip with less hassle.", controlType: "switch", maxQuantity: 1 },
  { id: "all-wheel-drive", title: "All-wheel drive", price: 9.90, priceSuffix: "/ day", iconSrc: "../assets/icons/special_4_wheel_drive.svg", details: "All-wheel drive provides better traction and stability in challenging weather like snow and rain.", controlType: "switch", maxQuantity: 1 },
  { id: "trailer-coupling", title: "Trailer coupling", price: 15.87, priceSuffix: "/ day", icon: "rv_hookup", details: "If you need more space.", controlType: "switch", maxQuantity: 1 },
  { id: "diesel-engine", title: "Diesel engine", price: 7.92, priceSuffix: "/ day", icon: "oil_barrel", details: "By using diesel, you can save money on fuel costs as it requires less fuel compared to a regular engine.", controlType: "switch", maxQuantity: 1 },
  { id: "comfort-features", title: "Comfort features", price: 5.94, priceSuffix: "/ day", icon: "self_improvement", details: "Driver-assist features like parking support and Bluetooth connectivity help you maneuver more safely and easily. This reduces driving pressure and creates a smoother, more relaxed ride.", controlType: "switch", maxQuantity: 1 },
  { id: "terminal-drop-off", title: "Terminal Drop-Off Service", price: 88.29, priceSuffix: "/ one-time", icon: "flight_takeoff", details: "Save time: Return your vehicle at your departure terminal (available within branch operating hours).", controlType: "switch", maxQuantity: 1 },
];

const state = {
  addons: {},
};

const isOneTime = (suffix) => suffix.includes("one-time");

const getAddonCost = (addon, quantity) => {
  if (isOneTime(addon.priceSuffix)) return addon.price * quantity;
  return addon.price * quantity * rentalDays;
};

const renderCards = () => {
  cardsRoot.innerHTML = "";
  for (const addon of ADDONS) {
    const card = document.createElement("ox-add-on-card");
    card.setAttribute("addon-id", addon.id);
    card.setAttribute("title", addon.title);
    card.setAttribute("price", String(addon.price));
    card.setAttribute("price-suffix", addon.priceSuffix);
    if (addon.iconSrc) {
      card.setAttribute("icon-src", addon.iconSrc);
    } else if (addon.icon) {
      card.setAttribute("icon", addon.icon);
    }
    card.setAttribute("details", addon.details);
    card.setAttribute("control-type", addon.controlType);
    card.setAttribute("max-quantity", String(addon.maxQuantity));
    cardsRoot.appendChild(card);
  }
};

const syncTotals = () => {
  let addonTotal = 0;
  for (const addon of ADDONS) {
    const s = state.addons[addon.id];
    if (s && s.selected) {
      addonTotal += getAddonCost(addon, s.quantity);
    }
  }
  const grandTotal = total + addonTotal;
  const parts = getTotalPriceParts(grandTotal);

  for (const el of [totalTop, totalMobile]) {
    if (!el) continue;
    el.setAttribute("integer", parts.integerPart);
    el.setAttribute("decimal", parts.decimalPart);
  }
};

const syncNotice = () => {
  if (notice) notice.hidden = minimumAge < 21;
};

const buildBackHref = () => {
  const backParams = new URLSearchParams();
  const offerTotal = offerDaily * rentalDays;
  backParams.set("total", offerTotal.toFixed(2));
  backParams.set("daily", String(offerDaily));
  backParams.set("rentalDays", String(rentalDays));
  backParams.set("bookingOption", bookingOption);
  backParams.set("mileageType", mileageType);
  if (mileageIncludedKm) backParams.set("mileageIncludedKm", mileageIncludedKm);
  if (mileageExtraPerKm) backParams.set("mileageExtraPerKm", mileageExtraPerKm);
  if (minimumAge >= 21) backParams.set("minimumAge", String(minimumAge));
  return `./protection.html?${backParams.toString()}`;
};

const syncBackLinks = () => {
  const href = buildBackHref();
  const header = document.querySelector("ox-booking-header");
  if (header) header.setAttribute("back-href", href);
  const backBtn = document.querySelector(".addons-top__back");
  if (backBtn) backBtn.setAttribute("href", href);
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

const syncProtectionLabel = () => {
  if (!protectionLabel) return;
  if (protectionPackage && protectionPackage !== "none") {
    const labels = {
      basic: "Basic Protection",
      smart: "Smart Protection",
      all: "All Inclusive Protection - No deductible",
    };
    protectionLabel.textContent = labels[protectionPackage] || protectionPackage;
    protectionLabel.hidden = false;
  } else {
    protectionLabel.hidden = true;
  }
};

const syncBookingOverview = () => {
  if (!overviewEl) return;

  /* Remove previously added dynamic add-on items */
  overviewEl.querySelectorAll("ox-list-item[data-addon]").forEach((el) => el.remove());

  /* Add items for selected add-ons */
  for (const addon of ADDONS) {
    const s = state.addons[addon.id];
    if (s && s.selected) {
      const item = document.createElement("ox-list-item");
      item.setAttribute("icon", "check");
      item.setAttribute("data-addon", addon.id);
      const qtyLabel = s.quantity > 1 ? ` (x${s.quantity})` : "";
      item.textContent = `${addon.title}${qtyLabel}`;
      overviewEl.appendChild(item);
    }
  }
};

const syncMobileSummaryPosition = () => {
  if (!(mobileSummary instanceof HTMLElement) || !(pageFooter instanceof HTMLElement)) {
    return;
  }
  const summaryHeight = Math.ceil(mobileSummary.getBoundingClientRect().height);
  document.documentElement.style.setProperty(
    "--addons-mobile-summary-height",
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

cardsRoot.addEventListener("addon-change", (event) => {
  const { addonId, selected, quantity } = event.detail;
  state.addons[addonId] = { selected, quantity };
  syncTotals();
  syncBookingOverview();
  scheduleMobileSummarySync();
});

cardsRoot.addEventListener("transitionend", scheduleMobileSummarySync);

window.addEventListener("scroll", syncMobileSummaryPosition, { passive: true });
window.addEventListener("resize", scheduleMobileSummarySync);

renderCards();
syncTotals();
syncNotice();
syncBackLinks();
syncBookingOptionLabel();
syncMileageLabel();
syncProtectionLabel();
syncBookingOverview();
scheduleMobileSummarySync();
