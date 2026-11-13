/**
 * Application-Level Prediction-Based Engagement Strategy Service
 * Maps Random Forest conversion probability to application decision bands and website responses.
 *
 * Decision Bands (Application Decision Thresholds):
 * - LOW INTENT    : 0.00 <= prob < 0.30  (Gentle Assistance & Product Discovery)
 * - MEDIUM INTENT : 0.30 <= prob < 0.60  (Engagement & Related Product Suggestions)
 * - HIGH INTENT   : 0.60 <= prob <= 1.00 (Smooth Checkout Prioritization)
 */

export function getEngagementStrategy(probInput) {
  let prob = Number(probInput);
  if (isNaN(prob) || probInput === null || probInput === undefined) {
    prob = 0.0;
  }
  // Convert percentage (e.g. 50.5% -> 0.505) if between 1.0 and 100.0
  if (prob > 1.0 && prob <= 100.0) {
    prob = prob / 100.0;
  }
  prob = Math.max(0.0, Math.min(1.0, prob));

  // LOW INTENT: 0% - 29.99%
  if (prob < 0.30) {
    return {
      level: "LOW",
      intentTitle: "LOW INTENT",
      recommendedActionTitle: "Gentle Engagement",
      message: "Offer gentle product discovery assistance without aggressive interruptions.",
      merchantAdvice: "Customer shows lower purchase intent. Consider gentle assistance or product discovery support.",
      buttonText: "Explore Products",
      buttonAction: "explore",
      showAssistance: true,
      showRelatedProducts: true,
      prioritizeCheckout: false,
      colorClass: "low-intent",
    };
  }

  // MEDIUM INTENT: 30% - 59.99%
  if (prob < 0.60) {
    return {
      level: "MEDIUM",
      intentTitle: "MEDIUM INTENT",
      recommendedActionTitle: "Engagement",
      message: "Encourage continued browsing with relevant product suggestions and cart reminders.",
      merchantAdvice: "Customer shows moderate purchase intent. Consider relevant product suggestions or a gentle cart reminder.",
      buttonText: "View Related Products",
      buttonAction: "related",
      showAssistance: false,
      showRelatedProducts: true,
      prioritizeCheckout: false,
      colorClass: "medium-intent",
    };
  }

  // HIGH INTENT: 60% - 100%
  return {
    level: "HIGH",
    intentTitle: "HIGH INTENT",
    recommendedActionTitle: "Smooth Checkout",
    message: "Maintain a frictionless checkout path and avoid unnecessary navigation barriers.",
    merchantAdvice: "Customer shows strong purchase intent. Maintain a smooth checkout experience and avoid unnecessary friction.",
    buttonText: "Proceed to Checkout",
    buttonAction: "checkout",
    showAssistance: false,
    showRelatedProducts: false,
    prioritizeCheckout: true,
    colorClass: "high-intent",
  };
}
