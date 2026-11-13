# An Empirical Investigation Into E-Commerce Cart Abandonment Factors via Exploratory Data Analysis

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3%2B-F7931E.svg)](https://scikit-learn.org/)
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.9171-brightgreen.svg)]()

A complete machine learning powered e-commerce web application and academic research suite investigating customer browsing behavior, non-conversion session drop-offs, and real-time purchase intention prediction.

---

## 1. Executive Summary

This project conducts Exploratory Data Analysis (EDA) and predictive modeling on **12,330 e-commerce sessions** from the **Online Shoppers Purchasing Intention Dataset** (UCI Machine Learning Repository / Kaggle).

Session non-conversion (`Revenue = False`, representing 84.53% of dataset sessions) serves as an empirical proxy for potential cart abandonment and drop-off behavior. A **Random Forest Classifier** trained on 17 behavioral, environmental, and temporal features achieves an **ROC-AUC score of 0.9171** and **Accuracy of 0.8913** on unseen test data.

The project integrates:
1. **Machine Learning Pipeline**: Data validation, leakage-free preprocessing, EDA visualization, model training, evaluation, and serialization.
2. **FastAPI REST API**: High-performance backend exposing `POST /predict` with Pydantic validation.
3. **React E-Commerce Web App**: Interactive online store (`http://localhost:5173`) with live session tracking and prediction-based engagement responses (`LOW`, `MEDIUM`, `HIGH` intent bands).
4. **Academic Research Dashboard**: Dedicated analytics interface (`http://localhost:5173/research`) presenting 19 EDA charts, model evaluation metrics, $2 \times 2$ confusion matrix, ROC curve, and 7 research tables.

---

## 2. Dataset Specifications

- **Dataset File**: `dataset/online_shoppers_intention.csv`
- **Total Records (N)**: 12,330 customer browsing sessions
- **Features (P)**: 17 predictor features (10 numerical, 7 categorical) + 1 target (`Revenue`)
- **Target Distribution**:
  - `Revenue = False` (Non-Conversion): 10,422 sessions (**84.53%**)
  - `Revenue = True` (Conversion): 1,908 sessions (**15.47%**)

### Input Predictor Features

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `Administrative` | Numerical (Int) | Count of administrative page views (Cart, Checkout, Account) |
| `Administrative_Duration` | Numerical (Float) | Active time (seconds) spent on administrative pages |
| `Informational` | Numerical (Int) | Count of informational page views (About, FAQ, Shipping) |
| `Informational_Duration` | Numerical (Float) | Active time (seconds) spent on informational pages |
| `ProductRelated` | Numerical (Int) | Count of product grid, category, and product detail views |
| `ProductRelated_Duration` | Numerical (Float) | Active time (seconds) spent browsing products |
| `BounceRates` | Numerical (Float) | Average bounce rate of pages visited by the user |
| `ExitRates` | Numerical (Float) | Average exit rate of pages visited by the user |
| `PageValues` | Numerical (Float) | Google Analytics page value metric prior to transaction |
| `SpecialDay` | Numerical (Float) | Proximity of session date to special holiday occasion |
| `Month` | Categorical (String) | Month of the browsing session (Feb, Mar, May, Nov, etc.) |
| `OperatingSystems` | Categorical (Int) | Operating system category identifier |
| `Browser` | Categorical (Int) | Browser category identifier |
| `Region` | Categorical (Int) | Geographic region identifier |
| `TrafficType` | Categorical (Int) | Traffic source acquisition category identifier |
| `VisitorType` | Categorical (String) | Visitor type (`Returning_Visitor`, `New_Visitor`, `Other`) |
| `Weekend` | Categorical (Bool) | Boolean flag indicating Saturday/Sunday sessions |

---

## 3. Technology Stack

- **Machine Learning & Data Science**: Python 3.10+, Scikit-Learn, Pandas, NumPy, Joblib, Matplotlib, Seaborn.
- **REST Backend**: Python FastAPI, Pydantic V2, Uvicorn.
- **Frontend Web Application**: React 19, Vite 8, JavaScript (ES6+), Vanilla CSS3, Lucide React Icons.
- **Testing & Verification**: Node.js test runner, FastAPI `TestClient`.

---

## 4. Machine Learning & Model Performance

### Model Configuration
- **Classifier**: `RandomForestClassifier`
- **Hyperparameters**: `n_estimators=200`, `class_weight='balanced'`, `random_state=42`
- **Preprocessing**: `ColumnTransformer` (StandardScaler for numericals + OneHotEncoder for categoricals) fitted strictly on 80% training set (`X_train`) to prevent data leakage.

### Official Experimental Test-Set Results (2,466 Test Samples)

| Evaluation Metric | Test Score |
| :--- | :--- |
| **ROC-AUC Score** | **0.9171 (91.71%)** |
| **Classification Accuracy** | **0.8913 (89.13%)** |
| **Precision Score** | **0.7522 (75.22%)** |
| **Recall Score (Sensitivity)** | **0.4450 (44.50%)** |
| **F1-Score** | **0.5592 (55.92%)** |
| **Average Precision (PR-AUC)** | **0.7211 (72.11%)** |

### Test-Set Confusion Matrix

$$\begin{pmatrix} \text{TN} = 2,028 & \text{FP} = 56 \\ \text{FN} = 212 & \text{TP} = 170 \end{pmatrix}$$

### Top 5 Predictor Importance (Gini Importance)
1. **`PageValues`**: **0.325718** (32.57%) — Top positive factor ($r = +0.4926$)
2. **`ExitRates`**: **0.090266** (9.03%) — Top disengagement factor ($r = -0.2071$)
3. **`ProductRelated_Duration`**: **0.082969** (8.30%)
4. **`ProductRelated`**: **0.070199** (7.02%)
5. **`BounceRates`**: **0.055189** (5.52%)

---

## 5. System Architecture & Live Workflow

```text
USER BROWSING (http://localhost:5173)
        │
        ▼
SESSION TRACKER (`SessionContext.jsx` / `sessionTracker.js`)
        │
        ▼
17 ML FEATURE BUILDER (`mlFeatureBuilder.js`)
        │
        ▼
FASTAPI PREDICTION ENDPOINT (`POST http://localhost:8000/predict`)
        │
        ▼
MODEL PIPELINE INFERENCE (`ml/models/full_pipeline.pkl`)
        │
        ▼
APPLICATION DECISION BANDS (`engagementStrategy.js`)
        │
        ▼
WEBSITE RESPONSE (`PredictionPanel.jsx`)
```

### Application Decision Bands (Engagement Strategy)

- **`LOW INTENT` ($0.00\% - 29.99\%$)**: Offer gentle product discovery support without aggressive popups (`[ Explore Products ]`).
- **`MEDIUM INTENT` ($30.00\% - 59.99\%$)**: Encourage browsing with 2–4 related product suggestions (`[ View Related Products ]`).
- **`HIGH INTENT` ($60.00\% - 100.00\%$)**: Prioritize frictionless checkout path (`[ Proceed to Checkout ]`).

---

## 6. How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Start FastAPI Backend
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger OpenAPI Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Step 3: Start React Frontend Application
Open a second terminal window:
```bash
cd frontend
npm run dev
```
- E-Commerce Web App: `http://localhost:5173`
- Research Analytics Dashboard: `http://localhost:5173/research`

---

## 7. Running Regression Test Suites

### Frontend Regression Tests (Feature Builder & Strategy)
```bash
cmd /c "node frontend/src/services/__tests__/mlFeatureBuilder.test.js && node frontend/src/services/__tests__/engagementStrategy.test.js"
```

### Backend & System Suite Verification
```bash
python test_system_suite.py
```

---

## 8. Research Documentation & Tables Directory

- [`research/ml_feature_schema.txt`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/ml_feature_schema.txt): Pipeline input schema specifications.
- [`research/ml_feature_mapping.csv`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/ml_feature_mapping.csv): Detailed 17-feature mapping matrix.
- [`research/live_session_feature_methodology.md`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/live_session_feature_methodology.md): Feature extraction methodology & proxy formulas.
- [`research/prediction_based_engagement_strategy.md`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/prediction_based_engagement_strategy.md): Application decision thresholds & response logic.
- [`research/final_system_architecture.md`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/final_system_architecture.md): Full technical system architecture document.
- [`research/tables/`](file:///c:/Users/surendar/OneDrive/Documents/SECE/3rd%20Year/Data%20Science/ecommerce-cart-abandonment/research/tables/): Tables 1 through 7 in CSV format.

---

## 9. Methodological Limitations

1. **Class Imbalance**: Dataset contains 84.53% non-conversion sessions; class weighting was applied during training.
2. **Correlation vs Causality**: Feature importance and correlation values reflect predictive association, not direct causal impact.
3. **Application Proxies**: Live client web apps use proxy formulas for `PageValues`, `BounceRates`, and `ExitRates` as Google Analytics server logs are unavailable client-side.
4. **Decision Thresholds**: Application engagement bands (`LOW`, `MEDIUM`, `HIGH`) are business decision rules, not newly trained ML model thresholds.

---

## 10. License & Citation

Developed as an academic research and software engineering investigation into e-commerce customer behavior factors.
