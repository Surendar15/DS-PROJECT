import { getEngagementStrategy } from "../engagementStrategy.js";

function runEngagementStrategyTests() {
  console.log("==================================================");
  console.log("   STEP 10: ENGAGEMENT STRATEGY REGRESSION TESTS  ");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, name) {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  // LOW INTENT Tests
  assert(getEngagementStrategy(0.00).level === "LOW", "0.00 maps to LOW INTENT");
  assert(getEngagementStrategy(0.11).level === "LOW", "0.11 maps to LOW INTENT");
  assert(getEngagementStrategy(0.2999).level === "LOW", "0.2999 maps to LOW INTENT");

  // MEDIUM INTENT Tests
  assert(getEngagementStrategy(0.30).level === "MEDIUM", "0.30 maps to MEDIUM INTENT");
  assert(getEngagementStrategy(0.505).level === "MEDIUM", "0.505 maps to MEDIUM INTENT");
  assert(getEngagementStrategy(0.5999).level === "MEDIUM", "0.5999 maps to MEDIUM INTENT");

  // HIGH INTENT Tests
  assert(getEngagementStrategy(0.60).level === "HIGH", "0.60 maps to HIGH INTENT");
  assert(getEngagementStrategy(0.68).level === "HIGH", "0.68 maps to HIGH INTENT");
  assert(getEngagementStrategy(0.71).level === "HIGH", "0.71 maps to HIGH INTENT");
  assert(getEngagementStrategy(1.00).level === "HIGH", "1.00 maps to HIGH INTENT");

  // Percentage input handling
  assert(getEngagementStrategy(11.0).level === "LOW", "11.0% maps to LOW INTENT");
  assert(getEngagementStrategy(50.5).level === "MEDIUM", "50.5% maps to MEDIUM INTENT");
  assert(getEngagementStrategy(68.0).level === "HIGH", "68.0% maps to HIGH INTENT");

  // Edge cases & safety
  assert(getEngagementStrategy(undefined).level === "LOW", "undefined handles safely as LOW");
  assert(getEngagementStrategy(null).level === "LOW", "null handles safely as LOW");
  assert(getEngagementStrategy(NaN).level === "LOW", "NaN handles safely as LOW");
  assert(getEngagementStrategy(-0.1).level === "LOW", "-0.1 clamps to LOW");
  assert(getEngagementStrategy(150.0).level === "HIGH", "150.0% clamps to HIGH");

  console.log("--------------------------------------------------");
  console.log(`Regression Test Summary: ${passed} / ${total} PASSED`);
  console.log("==================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runEngagementStrategyTests();
