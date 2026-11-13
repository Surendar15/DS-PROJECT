/**
 * Machine Learning Feature Builder & Validator Service
 * Converts live user session state & cart items into the exact 17 features expected by FastAPI /predict.
 */

export function detectOperatingSystem() {
  if (typeof navigator === "undefined") return 2;
  const ua = navigator.userAgent || "";
  if (/Windows/i.test(ua)) return 2;
  if (/Macintosh|Mac OS|iPhone|iPad|iPod/i.test(ua)) return 1;
  if (/Android/i.test(ua)) return 3;
  if (/Linux/i.test(ua)) return 4;
  return 2;
}

export function detectBrowser() {
  if (typeof navigator === "undefined") return 2;
  const ua = navigator.userAgent || "";
  if (/Edg/i.test(ua)) return 4;
  if (/Chrome/i.test(ua)) return 2;
  if (/Safari/i.test(ua)) return 1;
  if (/Firefox/i.test(ua)) return 3;
  return 2;
}

export function getCurrentDatasetMonth() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIndex = new Date().getMonth();
  const validDatasetMonths = ["Feb", "Mar", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const detected = months[currentMonthIndex];
  return validDatasetMonths.includes(detected) ? detected : "May";
}

export function isWeekendDay() {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

/**
 * Builds the 17-feature vector from session state and cart items
 */
export function buildMlFeatureVector(sessionState = {}, cartItems = []) {
  const totalPages = Math.max(
    1,
    (sessionState.adminViews || 0) + (sessionState.infoViews || 0) + (sessionState.productViews || 0)
  );

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const checkoutIntentBonus = sessionState.currentPage === "/checkout" ? 10.0 : 0.0;

  // Transparent Application-Level PageValues Proxy Formula
  const rawPageValues = (cartSubtotal / totalPages) + (cartItemCount * 5.0) + checkoutIntentBonus;
  const pageValues = Number(Math.max(0.0, rawPageValues).toFixed(2));

  // Bounce & Exit Rates
  const bounceRates = totalPages <= 1 ? 0.20 : Number((0.02 / totalPages).toFixed(4));
  const exitRates = Number(((sessionState.exitCount || 0) / totalPages).toFixed(4)) || 0.03;

  const featureVector = {
    Administrative: Math.max(0, sessionState.adminViews || 0),
    Administrative_Duration: Number(Math.max(0.0, sessionState.adminDuration || 0.0).toFixed(2)),
    Informational: Math.max(0, sessionState.infoViews || 0),
    Informational_Duration: Number(Math.max(0.0, sessionState.infoDuration || 0.0).toFixed(2)),
    ProductRelated: Math.max(0, sessionState.productViews || 0),
    ProductRelated_Duration: Number(Math.max(0.0, sessionState.productDuration || 0.0).toFixed(2)),
    BounceRates: Number(Math.min(1.0, Math.max(0.0, bounceRates)).toFixed(4)),
    ExitRates: Number(Math.min(1.0, Math.max(0.0, exitRates)).toFixed(4)),
    PageValues: pageValues,
    SpecialDay: 0.0,
    Month: getCurrentDatasetMonth(),
    OperatingSystems: detectOperatingSystem(),
    Browser: detectBrowser(),
    Region: 1,
    TrafficType: (sessionState.searchCount || 0) > 0 ? 2 : 1,
    VisitorType: sessionState.isNewVisitor ? "New_Visitor" : "Returning_Visitor",
    Weekend: isWeekendDay(),
  };

  return featureVector;
}

/**
 * Validates the constructed feature vector against FastAPI schema requirements
 */
export function validateMlFeatureVector(features) {
  const errors = [];

  const requiredKeys = [
    "Administrative", "Administrative_Duration", "Informational", "Informational_Duration",
    "ProductRelated", "ProductRelated_Duration", "BounceRates", "ExitRates", "PageValues",
    "SpecialDay", "Month", "OperatingSystems", "Browser", "Region", "TrafficType",
    "VisitorType", "Weekend"
  ];

  for (const key of requiredKeys) {
    if (features[key] === undefined || features[key] === null) {
      errors.push(`Missing feature property: ${key}`);
    }
  }

  // Range and type validations
  if (typeof features.Administrative !== "number" || features.Administrative < 0) {
    errors.push("Administrative must be non-negative integer");
  }
  if (typeof features.BounceRates !== "number" || features.BounceRates < 0 || features.BounceRates > 1) {
    errors.push("BounceRates must be float between 0.0 and 1.0");
  }
  if (typeof features.ExitRates !== "number" || features.ExitRates < 0 || features.ExitRates > 1) {
    errors.push("ExitRates must be float between 0.0 and 1.0");
  }
  if (typeof features.PageValues !== "number" || features.PageValues < 0) {
    errors.push("PageValues must be non-negative float");
  }
  if (typeof features.Weekend !== "boolean") {
    errors.push("Weekend must be boolean");
  }

  const validMonths = ["Feb", "Mar", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!validMonths.includes(features.Month)) {
    errors.push(`Invalid Month value: ${features.Month}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
