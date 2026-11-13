# Live ML Prediction End-to-End Test Evidence

**Test Timestamp**: 2026-08-28 21:06:30
**Frontend URL**: http://localhost:5173
**Backend URL**: http://localhost:8000
**Model Pipeline**: `ml/models/full_pipeline.pkl`

---

## Scenario A — Low-Engagement Initial Session

### Generated Feature Vector
```json
{
  "Administrative": 0,
  "Administrative_Duration": 0.0,
  "Informational": 0,
  "Informational_Duration": 0.0,
  "ProductRelated": 1,
  "ProductRelated_Duration": 15.0,
  "BounceRates": 0.2,
  "ExitRates": 0.03,
  "PageValues": 0.0,
  "SpecialDay": 0.0,
  "Month": "May",
  "OperatingSystems": 2,
  "Browser": 2,
  "Region": 1,
  "TrafficType": 1,
  "VisitorType": "New_Visitor",
  "Weekend": false
}
```

### API Prediction Response (`POST /predict` Status 200 OK)
```json
{
  "prediction": 0,
  "label": "Likely Non-Conversion",
  "conversion_probability": 0.06,
  "conversion_probability_percent": 6.0,
  "confidence": 0.94,
  "recommendation": {
    "action": "engage",
    "message": "Customer shows low purchase intent. Consider a gentle engagement offer or assistance.",
    "recommendation_type": "PROMOTIONAL_DISCOUNT"
  }
}
```

---

## Scenario B — High-Engagement Cart & Checkout Session

### Generated Feature Vector
```json
{
  "Administrative": 3,
  "Administrative_Duration": 145.0,
  "Informational": 1,
  "Informational_Duration": 30.0,
  "ProductRelated": 12,
  "ProductRelated_Duration": 480.0,
  "BounceRates": 0.0016,
  "ExitRates": 0.0125,
  "PageValues": 52.4,
  "SpecialDay": 0.0,
  "Month": "May",
  "OperatingSystems": 2,
  "Browser": 2,
  "Region": 1,
  "TrafficType": 2,
  "VisitorType": "Returning_Visitor",
  "Weekend": false
}
```

### API Prediction Response (`POST /predict` Status 200 OK)
```json
{
  "prediction": 1,
  "label": "Likely Conversion",
  "conversion_probability": 0.695,
  "conversion_probability_percent": 69.5,
  "confidence": 0.695,
  "recommendation": {
    "action": "maintain",
    "message": "Customer shows strong purchase intent. Maintain a smooth checkout experience.",
    "recommendation_type": "NO_INTERVENTION"
  }
}
```

---

## Repeatability & Feature Sensitivity Verification

- **Session A vs Session B Difference**:
  - `ProductRelated`: 1 vs 12
  - `Administrative`: 0 vs 3
  - `PageValues`: 0.0 vs 52.4
  - `Conversion Probability`: 6.0% vs 69.5%
- **Repeatability Test**: Re-querying Session B vector produced identical prediction class (1) and exact probability (0.695).
- **End-to-End Test Result**: **PASS**
