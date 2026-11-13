export const DATASET_OVERVIEW = {
  totalRows: 12330,
  totalFeatures: 17,
  targetName: "Revenue",
  conversionCount: 1908,
  nonConversionCount: 10422,
  conversionRate: "15.47%",
  nonConversionRate: "84.53%",
};

export const MODEL_METRICS = {
  modelType: "Random Forest Classifier",
  nEstimators: 200,
  classWeight: "balanced",
  randomState: 42,
  trainSamples: 9864,
  testSamples: 2466,
  accuracy: 0.8913,
  precision: 0.7522,
  recall: 0.4450,
  f1Score: 0.5592,
  rocAuc: 0.9171,
  avgPrecision: 0.7211,
};

export const CONFUSION_MATRIX_DATA = {
  TN: 2028,
  FP: 56,
  FN: 212,
  TP: 170,
};

export const TOP_FEATURE_IMPORTANCE = [
  { rank: 1, feature: "PageValues", importance: 0.325718 },
  { rank: 2, feature: "ExitRates", importance: 0.090266 },
  { rank: 3, feature: "ProductRelated_Duration", importance: 0.082969 },
  { rank: 4, feature: "ProductRelated", importance: 0.070199 },
  { rank: 5, feature: "BounceRates", importance: 0.055189 },
  { rank: 6, feature: "Administrative_Duration", importance: 0.046018 },
  { rank: 7, feature: "Administrative", importance: 0.040472 },
  { rank: 8, feature: "Month_Nov", importance: 0.023529 },
  { rank: 9, feature: "Informational_Duration", importance: 0.021263 },
  { rank: 10, feature: "Informational", importance: 0.016982 },
];

export const BEHAVIORAL_COMPARISON_DATA = [
  { feature: "ProductRelated", nonConversionMean: "28.32", conversionMean: "48.29", pValue: "< 0.001", correlation: "+0.1585" },
  { feature: "ProductRelated_Duration", nonConversionMean: "1069.99s", conversionMean: "1876.21s", pValue: "< 0.001", correlation: "+0.1523" },
  { feature: "Administrative", nonConversionMean: "2.12", conversionMean: "3.39", pValue: "< 0.001", correlation: "+0.1389" },
  { feature: "Administrative_Duration", nonConversionMean: "73.74s", conversionMean: "119.48s", pValue: "< 0.001", correlation: "+0.0936" },
  { feature: "Informational", nonConversionMean: "0.45", conversionMean: "0.79", pValue: "< 0.001", correlation: "+0.0952" },
  { feature: "Informational_Duration", nonConversionMean: "30.24s", conversionMean: "57.50s", pValue: "< 0.001", correlation: "+0.0703" },
  { feature: "PageValues", nonConversionMean: "1.98", conversionMean: "27.26", pValue: "< 0.001", correlation: "+0.4926" },
  { feature: "BounceRates", nonConversionMean: "0.025", conversionMean: "0.005", pValue: "< 0.001", correlation: "-0.1507" },
  { feature: "ExitRates", nonConversionMean: "0.047", conversionMean: "0.020", pValue: "< 0.001", correlation: "-0.2071" },
];

export const RESEARCH_TABLE_1 = [
  { parameter: "Dataset Name", value: "Online Shoppers Purchasing Intention Dataset" },
  { parameter: "Source", value: "UCI Machine Learning Repository / Kaggle" },
  { parameter: "Total Session Records (N)", value: "12,330" },
  { parameter: "Total Input Features (P)", value: "17" },
  { parameter: "Target Variable", value: "Revenue (True = 1, False = 0)" },
  { parameter: "Numerical Features Count", value: "10" },
  { parameter: "Categorical Features Count", value: "7" },
  { parameter: "Missing Values Count", value: "0 (Complete dataset)" },
  { parameter: "Duplicate Rows Count", value: "125" },
  { parameter: "Data Types", value: "Float64 (7), Int64 (7), String (2), Bool (2)" },
];

export const RESEARCH_TABLE_2 = [
  { classLabel: "Revenue = False (Non-Conversion)", count: 10422, percentage: "84.53%" },
  { classLabel: "Revenue = True (Conversion)", count: 1908, percentage: "15.47%" },
  { classLabel: "Total Dataset Sessions", count: 12330, percentage: "100.00%" },
];

export const RESEARCH_TABLE_3 = BEHAVIORAL_COMPARISON_DATA;

export const RESEARCH_TABLE_4 = [
  { categoryGroup: "VisitorType", subgroup: "Returning_Visitor", total: 10551, conversionCount: 1470, conversionRate: "13.93%" },
  { categoryGroup: "VisitorType", subgroup: "New_Visitor", total: 1694, conversionCount: 422, conversionRate: "24.91%" },
  { categoryGroup: "VisitorType", subgroup: "Other", total: 85, conversionCount: 16, conversionRate: "18.82%" },
  { categoryGroup: "Month", subgroup: "Nov", total: 2998, conversionCount: 760, conversionRate: "25.35%" },
  { categoryGroup: "Month", subgroup: "May", total: 3364, conversionCount: 365, conversionRate: "10.85%" },
  { categoryGroup: "Month", subgroup: "Mar", total: 1907, conversionCount: 190, conversionRate: "9.96%" },
  { categoryGroup: "Weekend", subgroup: "True (Weekend)", total: 2868, conversionCount: 499, conversionRate: "17.40%" },
  { categoryGroup: "Weekend", subgroup: "False (Weekday)", total: 9462, conversionCount: 1409, conversionRate: "14.89%" },
];

export const RESEARCH_TABLE_5 = [
  { metricName: "Classification Accuracy", score: "0.8913 (89.13%)" },
  { metricName: "Precision Score", score: "0.7522 (75.22%)" },
  { metricName: "Recall Score (Sensitivity)", score: "0.4450 (44.50%)" },
  { metricName: "F1-Score", score: "0.5592 (55.92%)" },
  { metricName: "ROC-AUC Score", score: "0.9171 (91.71%)" },
  { metricName: "Average Precision (PR-AUC)", score: "0.7211 (72.11%)" },
];

export const RESEARCH_TABLE_6 = [
  { actualClass: "Actual Non-Conversion (0)", predictedNonConv: "2,028 (True Negative)", predictedConv: "56 (False Positive)" },
  { actualClass: "Actual Conversion (1)", predictedNonConv: "212 (False Negative)", predictedConv: "170 (True Positive)" },
];

export const RESEARCH_TABLE_7 = TOP_FEATURE_IMPORTANCE;
