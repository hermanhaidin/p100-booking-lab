/* review-booking.js — Page orchestration for the review booking step. */

const params = new URLSearchParams(window.location.search);

/* --- Helpers --- */

const parseAmount = (value, fallback) => {
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatUSD = (amount) => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(Math.abs(amount));
  const [integerPart, decimalPart] = formatted.split(".");
  return { currency: "$", integerPart, decimalPart: `.${decimalPart}` };
};

const EUR_RATE = 0.847;

const formatEUR = (usdAmount) => {
  const eur = usdAmount * EUR_RATE;
  return `€${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(eur)}`;
};

/* --- URL params --- */

const total = parseAmount(params.get("total"), 1171.07);
const offerDaily = parseAmount(params.get("daily"), 0);
const rentalDaysFromQuery = parseAmount(params.get("rentalDays"), 0);
const rentalDaysFallback = offerDaily > 0 ? Math.max(1, Math.round(total / offerDaily)) : 4;
const rentalDays = Math.max(1, Math.round(rentalDaysFromQuery || rentalDaysFallback));
const bookingOption = params.get("bookingOption") || "best-price";
const mileageType = params.get("mileageType") || "unlimited";
const mileageIncludedKm = params.get("mileageIncludedKm") || "";
const mileageExtraPerKm = params.get("mileageExtraPerKm") || "";
const protectionPackage = params.get("protectionPackage") || "";
const vehicleTitle = params.get("vehicleTitle") || "BMW 3 Series Touring";
const vehicleSubtitle = params.get("vehicleSubtitle") || "or similar";
const vehicleImage = params.get("vehicleImage") || "https://www.sixt.com/fileadmin2/files/global/sideview/user_upload/fleet/png/752x500/bmw-3-stw-black-2023.png";
const studioBg = params.get("studioBg") || "https://img.sixt.com/1600/6f09b0e8-6820-4ac0-bedd-5797e9814c18.jpg";

let addonsData = [];
try {
  addonsData = JSON.parse(params.get("addons") || "[]");
} catch { /* ignore parse errors */ }

/* --- DOM refs --- */

const header = document.querySelector("ox-booking-header");
const backBtn = document.querySelector(".review-top__back");
const totalTop = document.getElementById("reviewTotalTop");
const totalMain = document.getElementById("reviewTotalMain");
const totalEur = document.getElementById("reviewTotalEur");
const ageCheckbox = document.getElementById("ageCheckbox");
const fieldDob = document.getElementById("fieldDob");
const fieldCountryCode = document.getElementById("fieldCountryCode");
const fieldCountry = document.getElementById("fieldCountry");
const fieldState = document.getElementById("fieldState");
const fieldCardNumber = document.getElementById("fieldCardNumber");
const fieldCardName = document.getElementById("fieldCardName");
const fieldFirstName = document.getElementById("fieldFirstName");
const fieldLastName = document.getElementById("fieldLastName");
const fieldExpiry = document.getElementById("fieldExpiry");
const payAndBook = document.getElementById("payAndBook");
const cancellationFee = document.getElementById("cancellationFee");
const paymentGroup = document.getElementById("paymentGroup");

/* Sidebar + mobile summary refs */
const sidebarSummary = document.getElementById("reviewSidebar");
const mobileSummary = document.getElementById("reviewMobileSummary");
const sidebarMileageLabel = document.getElementById("sidebarMileageLabel");
const sidebarProtectionLabel = document.getElementById("sidebarProtectionLabel");
const mobileMileageLabel = document.getElementById("mobileMileageLabel");
const mobileProtectionLabel = document.getElementById("mobileProtectionLabel");

/* --- Populate totals --- */

const syncTotals = () => {
  const parts = formatUSD(total);
  const eurText = formatEUR(total);

  for (const el of [totalTop, totalMain]) {
    if (!el) continue;
    el.setAttribute("integer", parts.integerPart);
    el.setAttribute("decimal", parts.decimalPart);
  }

  if (totalEur) totalEur.textContent = eurText;

  /* Update summary components */
  const priceText = `$${parts.integerPart}${parts.decimalPart}`;
  for (const el of [sidebarSummary, mobileSummary]) {
    if (!el) continue;
    el.setAttribute("total-price", priceText);
    el.setAttribute("total-secondary", eurText);
  }
};

/* --- Populate booking summary sidebar --- */

const syncSummaries = () => {
  for (const el of [sidebarSummary, mobileSummary]) {
    if (!el) continue;
    el.setAttribute("vehicle-title", vehicleTitle);
    el.setAttribute("vehicle-subtitle", vehicleSubtitle);
    if (vehicleImage) el.setAttribute("vehicle-image", vehicleImage);
    el.setAttribute("studio-bg", studioBg);
    el.setAttribute("pickup-location", "Munich Airport");
    el.setAttribute("pickup-date", "Mon, Mar 16, 2026 | 12:00 PM");
    el.setAttribute("return-location", "Munich Airport");
    el.setAttribute("return-date", "Fri, Mar 20, 2026 | 12:00 PM");
    el.setAttribute("payment-label", bookingOption === "stay-flexible" ? "Stay flexible" : "Pay now");
    el.setAttribute("payment-badge", bookingOption === "stay-flexible" ? "FREE CANCELLATION" : "BEST PRICE");
  }
};

const syncLabels = () => {
  /* Mileage */
  const mileageText =
    mileageType === "limited" && mileageIncludedKm && mileageExtraPerKm
      ? `${mileageIncludedKm} km included, each additional km costs $${mileageExtraPerKm}`
      : "Unlimited kilometers";
  for (const el of [sidebarMileageLabel, mobileMileageLabel]) {
    if (el) el.textContent = mileageText;
  }

  /* Protection */
  const protectionLabels = {
    basic: "Basic Protection",
    smart: "Smart Protection",
    all: "All Inclusive Protection - No deductible",
  };
  for (const el of [sidebarProtectionLabel, mobileProtectionLabel]) {
    if (!el) continue;
    if (protectionPackage && protectionPackage !== "none") {
      el.textContent = protectionLabels[protectionPackage] || protectionPackage;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  /* Add dynamic add-on items to both summaries */
  for (const summaryEl of [sidebarSummary, mobileSummary]) {
    if (!summaryEl) continue;
    summaryEl.querySelectorAll("ox-list-item[data-addon]").forEach((el) => el.remove());
    for (const addon of addonsData) {
      const item = document.createElement("ox-list-item");
      item.setAttribute("icon", "check");
      item.setAttribute("data-addon", addon.id);
      const qtyLabel = addon.quantity > 1 ? ` (x${addon.quantity})` : "";
      item.textContent = `${addon.title}${qtyLabel}`;
      summaryEl.appendChild(item);
    }
  }
};

/* --- Cancellation fee (≈8.39% of total) --- */

const syncCancellationFee = () => {
  if (!cancellationFee) return;
  const fee = total * 0.0839;
  const feeFormatted = `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fee)}`;
  cancellationFee.textContent = `Booking cancellation: An amount of ${feeFormatted} will be charged to cancel the booking (possible until the agreed pickup time). Any remaining prepaid amount over ${feeFormatted} will be refunded.`;
};

/* --- Back links --- */

const buildBackHref = () => {
  const backParams = new URLSearchParams();
  backParams.set("total", total.toFixed(2));
  if (offerDaily) backParams.set("daily", String(offerDaily));
  backParams.set("rentalDays", String(rentalDays));
  backParams.set("bookingOption", bookingOption);
  backParams.set("mileageType", mileageType);
  if (mileageIncludedKm) backParams.set("mileageIncludedKm", mileageIncludedKm);
  if (mileageExtraPerKm) backParams.set("mileageExtraPerKm", mileageExtraPerKm);
  if (protectionPackage) backParams.set("protectionPackage", protectionPackage);
  if (vehicleTitle !== "BMW 3 Series Touring") backParams.set("vehicleTitle", vehicleTitle);
  if (vehicleSubtitle !== "or similar") backParams.set("vehicleSubtitle", vehicleSubtitle);
  if (vehicleImage) backParams.set("vehicleImage", vehicleImage);
  if (addonsData.length) backParams.set("addons", JSON.stringify(addonsData));
  return `./add-ons.html?${backParams.toString()}`;
};

const syncBackLinks = () => {
  const href = buildBackHref();
  if (header) header.setAttribute("back-href", href);
  if (backBtn) backBtn.setAttribute("href", href);
};

/* --- Country code combobox --- */

const POPULAR_COUNTRY_CODES = [
  { value: "+1", label: "United States +1", displayValue: "+1", leading: "🇺🇸", group: "Most popular" },
  { value: "+44", label: "United Kingdom +44", displayValue: "+44", leading: "🇬🇧", group: "Most popular" },
  { value: "+41", label: "Switzerland +41", displayValue: "+41", leading: "🇨🇭", group: "Most popular" },
  { value: "+34", label: "Spain +34", displayValue: "+34", leading: "🇪🇸", group: "Most popular" },
  { value: "+31", label: "Netherlands +31", displayValue: "+31", leading: "🇳🇱", group: "Most popular" },
  { value: "+39", label: "Italy +39", displayValue: "+39", leading: "🇮🇹", group: "Most popular" },
  { value: "+49", label: "Germany +49", displayValue: "+49", leading: "🇩🇪", group: "Most popular" },
  { value: "+33", label: "France +33", displayValue: "+33", leading: "🇫🇷", group: "Most popular" },
  { value: "+1-CA", label: "Canada +1", displayValue: "+1", leading: "🇨🇦", group: "Most popular" },
  { value: "+32", label: "Belgium +32", displayValue: "+32", leading: "🇧🇪", group: "Most popular" },
  { value: "+43", label: "Austria +43", displayValue: "+43", leading: "🇦🇹", group: "Most popular" },
];

const ALL_COUNTRY_CODES = [
  { value: "+93", label: "Afghanistan +93", displayValue: "+93", leading: "🇦🇫" },
  { value: "+355", label: "Albania +355", displayValue: "+355", leading: "🇦🇱" },
  { value: "+213", label: "Algeria +213", displayValue: "+213", leading: "🇩🇿" },
  { value: "+61", label: "Australia +61", displayValue: "+61", leading: "🇦🇺" },
  { value: "+43-all", label: "Austria +43", displayValue: "+43", leading: "🇦🇹" },
  { value: "+32-all", label: "Belgium +32", displayValue: "+32", leading: "🇧🇪" },
  { value: "+55", label: "Brazil +55", displayValue: "+55", leading: "🇧🇷" },
  { value: "+359", label: "Bulgaria +359", displayValue: "+359", leading: "🇧🇬" },
  { value: "+1-CA-all", label: "Canada +1", displayValue: "+1", leading: "🇨🇦" },
  { value: "+56", label: "Chile +56", displayValue: "+56", leading: "🇨🇱" },
  { value: "+86", label: "China +86", displayValue: "+86", leading: "🇨🇳" },
  { value: "+57", label: "Colombia +57", displayValue: "+57", leading: "🇨🇴" },
  { value: "+385", label: "Croatia +385", displayValue: "+385", leading: "🇭🇷" },
  { value: "+420", label: "Czech Republic +420", displayValue: "+420", leading: "🇨🇿" },
  { value: "+45", label: "Denmark +45", displayValue: "+45", leading: "🇩🇰" },
  { value: "+20", label: "Egypt +20", displayValue: "+20", leading: "🇪🇬" },
  { value: "+358", label: "Finland +358", displayValue: "+358", leading: "🇫🇮" },
  { value: "+33-all", label: "France +33", displayValue: "+33", leading: "🇫🇷" },
  { value: "+49-all", label: "Germany +49", displayValue: "+49", leading: "🇩🇪" },
  { value: "+30", label: "Greece +30", displayValue: "+30", leading: "🇬🇷" },
  { value: "+36", label: "Hungary +36", displayValue: "+36", leading: "🇭🇺" },
  { value: "+354", label: "Iceland +354", displayValue: "+354", leading: "🇮🇸" },
  { value: "+91", label: "India +91", displayValue: "+91", leading: "🇮🇳" },
  { value: "+62", label: "Indonesia +62", displayValue: "+62", leading: "🇮🇩" },
  { value: "+353", label: "Ireland +353", displayValue: "+353", leading: "🇮🇪" },
  { value: "+972", label: "Israel +972", displayValue: "+972", leading: "🇮🇱" },
  { value: "+39-all", label: "Italy +39", displayValue: "+39", leading: "🇮🇹" },
  { value: "+81", label: "Japan +81", displayValue: "+81", leading: "🇯🇵" },
  { value: "+82", label: "South Korea +82", displayValue: "+82", leading: "🇰🇷" },
  { value: "+352", label: "Luxembourg +352", displayValue: "+352", leading: "🇱🇺" },
  { value: "+60", label: "Malaysia +60", displayValue: "+60", leading: "🇲🇾" },
  { value: "+52", label: "Mexico +52", displayValue: "+52", leading: "🇲🇽" },
  { value: "+31-all", label: "Netherlands +31", displayValue: "+31", leading: "🇳🇱" },
  { value: "+64", label: "New Zealand +64", displayValue: "+64", leading: "🇳🇿" },
  { value: "+47", label: "Norway +47", displayValue: "+47", leading: "🇳🇴" },
  { value: "+48", label: "Poland +48", displayValue: "+48", leading: "🇵🇱" },
  { value: "+351", label: "Portugal +351", displayValue: "+351", leading: "🇵🇹" },
  { value: "+40", label: "Romania +40", displayValue: "+40", leading: "🇷🇴" },
  { value: "+7", label: "Russia +7", displayValue: "+7", leading: "🇷🇺" },
  { value: "+966", label: "Saudi Arabia +966", displayValue: "+966", leading: "🇸🇦" },
  { value: "+65", label: "Singapore +65", displayValue: "+65", leading: "🇸🇬" },
  { value: "+421", label: "Slovakia +421", displayValue: "+421", leading: "🇸🇰" },
  { value: "+386", label: "Slovenia +386", displayValue: "+386", leading: "🇸🇮" },
  { value: "+27", label: "South Africa +27", displayValue: "+27", leading: "🇿🇦" },
  { value: "+34-all", label: "Spain +34", displayValue: "+34", leading: "🇪🇸" },
  { value: "+46", label: "Sweden +46", displayValue: "+46", leading: "🇸🇪" },
  { value: "+41-all", label: "Switzerland +41", displayValue: "+41", leading: "🇨🇭" },
  { value: "+66", label: "Thailand +66", displayValue: "+66", leading: "🇹🇭" },
  { value: "+90", label: "Turkey +90", displayValue: "+90", leading: "🇹🇷" },
  { value: "+380", label: "Ukraine +380", displayValue: "+380", leading: "🇺🇦" },
  { value: "+971", label: "United Arab Emirates +971", displayValue: "+971", leading: "🇦🇪" },
  { value: "+44-all", label: "United Kingdom +44", displayValue: "+44", leading: "🇬🇧" },
  { value: "+1-all", label: "United States +1", displayValue: "+1", leading: "🇺🇸" },
];

const COUNTRY_CODE_OPTIONS = [...POPULAR_COUNTRY_CODES, ...ALL_COUNTRY_CODES];

/* --- Country combobox (invoice) --- */

const COUNTRIES = [
  { value: "US", label: "United States", leading: "🇺🇸" },
  { value: "GB", label: "United Kingdom", leading: "🇬🇧" },
  { value: "DE", label: "Germany", leading: "🇩🇪" },
  { value: "FR", label: "France", leading: "🇫🇷" },
  { value: "IT", label: "Italy", leading: "🇮🇹" },
  { value: "ES", label: "Spain", leading: "🇪🇸" },
  { value: "NL", label: "Netherlands", leading: "🇳🇱" },
  { value: "CH", label: "Switzerland", leading: "🇨🇭" },
  { value: "AT", label: "Austria", leading: "🇦🇹" },
  { value: "BE", label: "Belgium", leading: "🇧🇪" },
  { value: "CA", label: "Canada", leading: "🇨🇦" },
  { value: "AU", label: "Australia", leading: "🇦🇺" },
  { value: "BR", label: "Brazil", leading: "🇧🇷" },
  { value: "CN", label: "China", leading: "🇨🇳" },
  { value: "DK", label: "Denmark", leading: "🇩🇰" },
  { value: "FI", label: "Finland", leading: "🇫🇮" },
  { value: "GR", label: "Greece", leading: "🇬🇷" },
  { value: "IE", label: "Ireland", leading: "🇮🇪" },
  { value: "JP", label: "Japan", leading: "🇯🇵" },
  { value: "MX", label: "Mexico", leading: "🇲🇽" },
  { value: "NO", label: "Norway", leading: "🇳🇴" },
  { value: "PL", label: "Poland", leading: "🇵🇱" },
  { value: "PT", label: "Portugal", leading: "🇵🇹" },
  { value: "SE", label: "Sweden", leading: "🇸🇪" },
  { value: "TR", label: "Turkey", leading: "🇹🇷" },
];

/* --- US states --- */

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

/* --- Init comboboxes (deferred to allow custom elements to upgrade) --- */

const initComboboxes = () => {
  if (fieldCountryCode && typeof fieldCountryCode.setOptions === "function") {
    fieldCountryCode.setOptions(COUNTRY_CODE_OPTIONS);
    fieldCountryCode.setAttribute("value", "+1");
  }
  if (fieldCountry && typeof fieldCountry.setOptions === "function") {
    fieldCountry.setOptions(COUNTRIES);
    fieldCountry.setAttribute("value", "US");
  }
  if (fieldState && typeof fieldState.setOptions === "function") {
    fieldState.setOptions(US_STATES);
    fieldState.hidden = false;
  }
};

/* --- Age checkbox toggle --- */

const ageCheckboxRow = document.getElementById("ageCheckboxRow");

if (ageCheckboxRow && ageCheckbox) {
  ageCheckboxRow.addEventListener("click", (e) => {
    if (e.target.closest("ox-checkbox")) return;
    const input = ageCheckbox.shadowRoot?.querySelector("input");
    if (input && !input.disabled) {
      input.checked = !input.checked;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

if (ageCheckbox) {
  ageCheckbox.addEventListener("change", (e) => {
    const checked = e.detail?.checked ?? ageCheckbox.hasAttribute("checked");
    if (fieldDob) fieldDob.hidden = checked;
  });
}

/* --- Country change → show/hide state --- */

if (fieldCountry) {
  fieldCountry.addEventListener("change", (e) => {
    const isUS = (e.detail?.value || fieldCountry.getAttribute("value")) === "US";
    if (fieldState) fieldState.hidden = !isUS;
  });
}

/* --- Credit card auto-formatting --- */

const formatCardNumber = (input) => {
  if (!input) return;
  const el = input.shadowRoot?.querySelector("input") || input;

  const handler = () => {
    const raw = el.value.replace(/\D/g, "").slice(0, 16);
    const groups = raw.match(/.{1,4}/g) || [];
    const formatted = groups.join(" ");
    if (el.value !== formatted) {
      const cursorPos = el.selectionStart;
      el.value = formatted;
      /* Try to restore cursor position sensibly */
      const newPos = Math.min(cursorPos + (formatted.length - el.value.length), formatted.length);
      el.setSelectionRange(newPos, newPos);
    }
  };

  el.addEventListener("input", handler);
};

const formatExpiry = (input) => {
  if (!input) return;
  const el = input.shadowRoot?.querySelector("input") || input;

  const handler = () => {
    let raw = el.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    if (el.value !== raw) {
      el.value = raw;
    }
  };

  el.addEventListener("input", handler);
};

const formatDob = (input) => {
  if (!input) return;
  const el = input.shadowRoot?.querySelector("input") || input;

  const handler = () => {
    let raw = el.value.replace(/\D/g, "").slice(0, 8);
    if (raw.length >= 5) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
    } else if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    if (el.value !== raw) {
      el.value = raw;
    }
  };

  el.addEventListener("input", handler);
};

/* --- Form validation --- */

const REQUIRED_FIELDS = [
  "fieldEmail", "fieldFirstName", "fieldLastName", "fieldPhone",
];

const REQUIRED_CC_FIELDS = [
  "fieldCardNumber", "fieldCardName", "fieldExpiry", "fieldCvv",
];

const validateForm = () => {
  let firstError = null;
  const selectedPayment = paymentGroup
    ? paymentGroup.querySelector("ox-payment-method[selected]")?.getAttribute("value")
    : null;

  const fieldsToValidate = [...REQUIRED_FIELDS];

  /* Add credit card fields if credit card is selected */
  if (selectedPayment === "credit-card") {
    fieldsToValidate.push(...REQUIRED_CC_FIELDS);
  }

  /* Add invoice address required fields */
  fieldsToValidate.push("fieldStreet", "fieldZip", "fieldCity");

  /* Add DOB if visible */
  if (fieldDob && !fieldDob.hidden) {
    fieldsToValidate.push("fieldDob");
  }

  for (const id of fieldsToValidate) {
    const field = document.getElementById(id);
    if (!field) continue;

    const value = field.getAttribute("value") || "";
    const nativeInput = field.shadowRoot?.querySelector("input");
    const currentValue = nativeInput?.value || value;

    if (!currentValue.trim()) {
      field.setAttribute("error", "");
      field.setAttribute("error-text", "Invalid entry or required field");
      if (!firstError) firstError = field;
    } else {
      field.removeAttribute("error");
      field.removeAttribute("error-text");
    }
  }

  /* Validate comboboxes */
  for (const combo of [fieldCountryCode, fieldCountry]) {
    if (!combo || combo.hidden) continue;
    if (!combo.getAttribute("value")) {
      combo.setAttribute("error", "");
      combo.setAttribute("error-text", "Invalid entry or required field");
      if (!firstError) firstError = combo;
    } else {
      combo.removeAttribute("error");
      combo.removeAttribute("error-text");
    }
  }

  /* Validate state if visible */
  if (fieldState && !fieldState.hidden) {
    if (!fieldState.getAttribute("value")) {
      fieldState.setAttribute("error", "");
      fieldState.setAttribute("error-text", "Invalid entry or required field");
      if (!firstError) firstError = fieldState;
    } else {
      fieldState.removeAttribute("error");
      fieldState.removeAttribute("error-text");
    }
  }

  /* Check payment method is selected */
  if (!selectedPayment) {
    if (!firstError) {
      firstError = document.getElementById("paymentMethods");
    }
  }

  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  return true;
};

/* --- Pay and Book CTA --- */

if (payAndBook) {
  payAndBook.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      /* Success — in a real app this would submit. For prototype, show alert. */
      alert("Booking confirmed! Thank you for choosing SIXT.");
    }
  });
}

/* --- Init --- */

const init = () => {
  syncTotals();
  syncSummaries();
  syncLabels();
  syncCancellationFee();
  syncBackLinks();
  initComboboxes();

  /* Deferred: set up auto-formatting after custom elements upgrade */
  requestAnimationFrame(() => {
    formatCardNumber(fieldCardNumber);
    formatExpiry(fieldExpiry);
    formatDob(fieldDob);

    /* Block space key in card number field */
    const cardNumInput = fieldCardNumber?.shadowRoot?.querySelector("input");
    if (cardNumInput) {
      cardNumInput.addEventListener("keydown", (e) => {
        if (e.key === " ") e.preventDefault();
      });
    }

    /* Auto-fill cardholder name from driver first + last name */
    const cardNameInput = fieldCardName?.shadowRoot?.querySelector("input");
    const firstNameInput = fieldFirstName?.shadowRoot?.querySelector("input");
    const lastNameInput = fieldLastName?.shadowRoot?.querySelector("input");

    if (cardNameInput && firstNameInput && lastNameInput) {
      let cardNameManuallyEdited = false;

      const syncCardholderName = () => {
        if (cardNameManuallyEdited) return;
        const first = firstNameInput.value.trim();
        const last = lastNameInput.value.trim();
        const combined = [first, last].filter(Boolean).join(" ");
        cardNameInput.value = combined;
        fieldCardName.setAttribute("value", combined);
      };

      firstNameInput.addEventListener("input", syncCardholderName);
      lastNameInput.addEventListener("input", syncCardholderName);

      cardNameInput.addEventListener("input", () => {
        if (cardNameInput.value.trim() === "") {
          cardNameManuallyEdited = false;
        } else {
          cardNameManuallyEdited = true;
        }
      });
    }
  });
};

/* Wait for custom elements to be defined before initializing comboboxes */
if (customElements.get("ox-combobox")) {
  init();
} else {
  customElements.whenDefined("ox-combobox").then(init).catch(() => init());
  /* Fallback timeout in case the element never registers */
  setTimeout(init, 500);
}
