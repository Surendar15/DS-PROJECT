# Final System Architecture Specification

## Project Title
**An Empirical Investigation Into E-Commerce Cart Abandonment Factors via Exploratory Data Analysis**

---

## 1. High-Level Architecture Overview

The system combines an **Offline Machine Learning Research Pipeline** with an **Online Real-Time Inference Application** and an **Academic Research Dashboard**.

```text
========================================================================================
                        OFFLINE RESEARCH & MODEL PIPELINE                               
========================================================================================
Kaggle Dataset (12,330 rows × 18 cols)
        │
        ▼
Preprocessing & Leakage-Free Scaling (`ml/src/preprocessing.py`)
        │
        ▼
Exploratory Data Analysis & Chart Generation (`ml/src/eda.py`)
        │
        ▼
Random Forest Classifier Training (`ml/src/train_model.py`)
        │
        ▼
Serialized Pipeline Models (`ml/models/full_pipeline.pkl`)

========================================================================================
                      ONLINE INFERENCE & USER WEB APPLICATION                          
========================================================================================
USER INTERACTION (React E-Commerce Website: http://localhost:5173)
        │
        ▼
Session Tracker & Route Classifier (`SessionContext.jsx` & `sessionTracker.js`)
        │
        ▼
17 ML Feature Construction (`mlFeatureBuilder.js`)
        │
        ▼
FastAPI REST Inference Backend (`POST http://localhost:8000/predict`)
        │
        ▼
Random Forest Model Inference (`full_pipeline.pkl` -> proba %)
        │
        ▼
Application Decision Strategy (`engagementStrategy.js`: LOW / MEDIUM / HIGH)
        │
        ▼
Interactive Website Response & Recommendations (`PredictionPanel.jsx`)

========================================================================================
                   ACADEMIC RESEARCH & MODEL ANALYTICS DASHBOARD                        
========================================================================================
Research Dashboard Route (`http://localhost:5173/research`)
        │
        ├── Dataset & Target Distribution Specs (15.47% Conv vs 84.53% Non-Conv)
        ├── Behavioral & Categorical Exploratory Visualizations (19 PNG Plots)
        ├── Correlation Analysis & Behavioral Ranking (PageValues r = +0.4926)
        ├── Random Forest Model Performance Cards (ROC-AUC = 0.9171, Acc = 0.8913)
        ├── Test Confusion Matrix (TN=2028, FP=56, FN=212, TP=170) & ROC Curve
        ├── Top-10 Gini Feature Importance Ranking (PageValues = 32.57%)
        ├── 7 Formatted Experimental Research Tables
        └── Key Findings & Methodological Limitations
```

---

## 2. Component Breakdown

### A. Machine Learning Pipeline (`ml/`)
- **Dataset**: `dataset/online_shoppers_intention.csv` (12,330 rows, 17 predictors + `Revenue` target).
- **Preprocessing**: `ColumnTransformer` applying `StandardScaler` to 10 numerical features and `OneHotEncoder` to 7 categorical features. Fitted strictly on 80% training data (`X_train`) to prevent data leakage.
- **Model**: `RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)`.
- **Artifacts**: `ml/models/full_pipeline.pkl`, `ml/models/random_forest.pkl`, `ml/models/preprocessor.pkl`.

### B. Inference Backend (`backend/app/`)
- **Framework**: Python FastAPI running on Uvicorn (`http://localhost:8000`).
- **Singleton Loader**: `ModelService` loads `full_pipeline.pkl` once at startup.
- **Endpoints**:
  - `GET /`: API identification & docs pointer.
  - `GET /health`: Operational health check.
  - `POST /predict`: Pydantic V2 validated endpoint accepting raw 17-feature vector and returning prediction, conversion probability %, and merchant recommendation.
- **CORS**: Configured `CORSMiddleware` supporting browser requests from `http://localhost:5173`.

### C. React Customer E-Commerce App (`frontend/src/`)
- **Framework**: React 19 + Vite 8 running on `http://localhost:5173`.
- **Cart Management**: `CartContext.jsx` managing cart state, subtotal, quantity updates, and simulated checkout.
- **Session Tracking**: `SessionContext.jsx` tracking session duration, page views, search queries, and route classifications (`Administrative`, `Informational`, `ProductRelated`).
- **Feature Builder**: `mlFeatureBuilder.js` translating real-time browser session state into the 17 features expected by FastAPI.
- **Prediction Panel**: `PredictionPanel.jsx` displaying real-time purchase intent, conversion probability progress bar, merchant advice, and session intent trend (`11% → 50.5% → 68%`).

### D. Application Decision Strategy (`engagementStrategy.js`)
- **Low Intent ($0.00\% - 29.99\%$)**: Gentle product discovery assistance, rule-based catalog suggestions (`[ Explore Products ]`).
- **Medium Intent ($30.00\% - 59.99\%$)**: Active engagement, 2–4 related product cards (`[ View Related Products ]`).
- **High Intent ($60.00\% - 100.00\%$)**: Smooth checkout prioritization, direct access to cart/checkout (`[ Proceed to Checkout ]`).

### E. Research & Model Analytics Dashboard (`/research`)
- **Route**: `http://localhost:5173/research`.
- **Visual Analytics**: 19 embedded EDA PNG charts, model evaluation metrics, $2 \times 2$ confusion matrix, ROC curve, and top 10 Gini feature importances.
- **Experimental Tables**: Interactive 7-table viewer displaying Table 1 through Table 7.

---

## 3. Verified Experimental Baseline Metrics

```text
Accuracy          = 0.8913 (89.13%)
Precision         = 0.7522 (75.22%)
Recall            = 0.4450 (44.50%)
F1-Score          = 0.5592 (55.92%)
ROC-AUC           = 0.9171 (91.71%)
Average Precision = 0.7211 (72.11%)
Confusion Matrix  = TN: 2,028 | FP: 56 | FN: 212 | TP: 170
Top Predictor     = PageValues (32.57% Gini Importance, r = +0.4926)
```
