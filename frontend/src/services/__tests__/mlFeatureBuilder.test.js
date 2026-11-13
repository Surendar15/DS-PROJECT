import { buildMlFeatureVector, validateMlFeatureVector } from "../mlFeatureBuilder.js";

function runRegressionTests() {
  console.log("==================================================");
  console.log("   STEP 8: ML FEATURE BUILDER REGRESSION TESTS");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // Test 1: Scenario A - Initial single page visitor
  const stateA = {
    adminViews: 0,
    adminDuration: 0.0,
    infoViews: 0,
    infoDuration: 0.0,
    productViews: 1,
    productDuration: 12.0,
    searchCount: 0,
    categoryCount: 0,
    cartInteractionCount: 0,
    exitCount: 0,
    isNewVisitor: true,
    currentPage: "/",
  };
  const cartA = [];
  const featuresA = buildMlFeatureVector(stateA, cartA);
  const valA = validateMlFeatureVector(featuresA);

  assert(valA.isValid, "Scenario A: Feature vector is valid according to schema");
  assert(Object.keys(featuresA).length === 17, "Scenario A: Contains exactly 17 features");
  assert(featuresA.ProductRelated === 1, "Scenario A: ProductRelated equals 1");
  assert(featuresA.PageValues === 0.0, "Scenario A: PageValues is 0.0 for empty cart");
  assert(featuresA.BounceRates === 0.20, "Scenario A: Single page visit bounce rate is 0.20");

  // Test 2: Scenario B - Engaged visitor browsing products and searching
  const stateB = {
    adminViews: 0,
    adminDuration: 0.0,
    infoViews: 1,
    infoDuration: 25.0,
    productViews: 8,
    productDuration: 340.0,
    searchCount: 2,
    categoryCount: 3,
    cartInteractionCount: 1,
    exitCount: 1,
    isNewVisitor: false,
    currentPage: "/products",
  };
  const cartB = [{ id: 1, name: "Headphones", price: 199.99, quantity: 1 }];
  const featuresB = buildMlFeatureVector(stateB, cartB);
  const valB = validateMlFeatureVector(featuresB);

  assert(valB.isValid, "Scenario B: Engaged visitor feature vector is valid");
  assert(featuresB.ProductRelated === 8, "Scenario B: ProductRelated equals 8");
  assert(featuresB.Informational === 1, "Scenario B: Informational equals 1");
  assert(featuresB.PageValues > 0.0, "Scenario B: PageValues is positive for cart item");
  assert(featuresB.VisitorType === "Returning_Visitor", "Scenario B: VisitorType is Returning_Visitor");

  // Test 3: Scenario C - Cart & Checkout focused visitor
  const stateC = {
    adminViews: 3,
    adminDuration: 180.0,
    infoViews: 0,
    infoDuration: 0.0,
    productViews: 12,
    productDuration: 520.0,
    searchCount: 1,
    categoryCount: 2,
    cartInteractionCount: 4,
    exitCount: 0,
    isNewVisitor: false,
    currentPage: "/checkout",
  };
  const cartC = [
    { id: 1, name: "Headphones", price: 199.99, quantity: 2 },
    { id: 2, name: "Smart Watch", price: 129.50, quantity: 1 },
  ];
  const featuresC = buildMlFeatureVector(stateC, cartC);
  const valC = validateMlFeatureVector(featuresC);

  assert(valC.isValid, "Scenario C: Checkout session feature vector is valid");
  assert(featuresC.Administrative === 3, "Scenario C: Administrative equals 3");
  assert(featuresC.PageValues > featuresB.PageValues, "Scenario C: High-intent checkout increases PageValues");

  console.log("--------------------------------------------------");
  console.log(`Regression Test Summary: ${passedTests} / ${totalTests} PASSED`);
  console.log("==================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runRegressionTests();
