/**
 * Session Tracking Utility Service
 * Classifies frontend routes and imports feature builder from mlFeatureBuilder.js.
 */

export { buildMlFeatureVector, validateMlFeatureVector } from "./mlFeatureBuilder";

export const PAGE_CATEGORIES = {
  ADMINISTRATIVE: ["/cart", "/checkout", "/account", "/orders"],
  INFORMATIONAL: ["/about", "/faq", "/shipping", "/returns", "/contact"],
  PRODUCT_RELATED: ["/", "/products", "/product", "/search", "/categories"],
};

export function classifyPageType(path) {
  if (PAGE_CATEGORIES.ADMINISTRATIVE.some((p) => path.startsWith(p))) {
    return "Administrative";
  }
  if (PAGE_CATEGORIES.INFORMATIONAL.some((p) => path.startsWith(p))) {
    return "Informational";
  }
  return "ProductRelated";
}
