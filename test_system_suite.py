import sys
import os
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent / "backend" / "app"))

import joblib
from fastapi.testclient import TestClient
from main import app

def run_system_suite():
    print("============================================================")
    print("      STEP 12: COMPLETE SYSTEM SUITE AUDIT & TEST           ")
    print("============================================================")

    # 1. Project Structure Audit
    required_files = [
        "dataset/online_shoppers_intention.csv",
        "ml/models/random_forest.pkl",
        "ml/models/full_pipeline.pkl",
        "ml/results/eda_findings.txt",
        "research/tables/table_1_dataset_characteristics.csv",
        "research/tables/table_2_class_distribution.csv",
        "research/tables/table_3_behavioral_comparison.csv",
        "research/tables/table_4_categorical_conversion.csv",
        "research/tables/table_5_model_performance.csv",
        "research/tables/table_6_confusion_matrix.csv",
        "research/tables/table_7_feature_importance.csv",
        "frontend/src/services/mlFeatureBuilder.js",
        "frontend/src/services/engagementStrategy.js",
        "frontend/src/components/PredictionPanel.jsx",
        "frontend/src/pages/ResearchDashboard.jsx",
        "research/live_session_feature_methodology.md",
        "research/prediction_based_engagement_strategy.md",
    ]

    missing = []
    for fpath in required_files:
        if not os.path.exists(fpath):
            missing.append(fpath)

    print(f"[AUDIT 1] File Structure Audit: {'PASS' if not missing else 'FAIL'}")
    if missing:
        print(f"          Missing files: {missing}")
    assert not missing, "Missing required system files"

    # 2. ML Pipeline Loading & Schema Test
    pipeline_path = "ml/models/full_pipeline.pkl"
    try:
        pipeline = joblib.load(pipeline_path)
        print(f"[AUDIT 2] ML Pipeline Loading ({pipeline_path}): PASS")
    except Exception as e:
        print(f"[AUDIT 2] ML Pipeline Loading ({pipeline_path}): FAIL ({e})")
        assert False, f"Failed to load ML pipeline: {e}"

    # 3. FastAPI Client Tests
    client = TestClient(app)

    # Health & Root
    res_root = client.get("/")
    assert res_root.status_code == 200, "Root endpoint failed"
    print(f"[AUDIT 3] GET / Root Endpoint: PASS (200 OK)")

    res_health = client.get("/health")
    assert res_health.status_code == 200, "Health endpoint failed"
    print(f"[AUDIT 4] GET /health Endpoint: PASS (200 OK)")

    res_docs = client.get("/docs")
    assert res_docs.status_code == 200, "Docs endpoint failed"
    print(f"[AUDIT 5] GET /docs Swagger OpenAPI: PASS (200 OK)")

    # Prediction Test
    valid_payload = {
        "Administrative": 4,
        "Administrative_Duration": 31.0,
        "Informational": 0,
        "Informational_Duration": 0.0,
        "ProductRelated": 12,
        "ProductRelated_Duration": 121.0,
        "BounceRates": 0.0013,
        "ExitRates": 0.03,
        "PageValues": 105.84,
        "SpecialDay": 0.0,
        "Month": "Aug",
        "OperatingSystems": 2,
        "Browser": 2,
        "Region": 1,
        "TrafficType": 2,
        "VisitorType": "Returning_Visitor",
        "Weekend": False,
    }

    res_pred = client.post("/predict", json=valid_payload)
    print(f"[AUDIT 6] POST /predict Inference: PASS ({res_pred.status_code} OK)")
    assert res_pred.status_code == 200, "Prediction endpoint failed"
    pred_data = res_pred.json()
    assert "prediction" in pred_data and "conversion_probability" in pred_data, "Invalid response schema"

    # API Validation Error Handling Test (Invalid/Missing field)
    invalid_payload = {
        "Administrative": 4,
        # Missing required features
    }
    res_invalid = client.post("/predict", json=invalid_payload)
    print(f"[AUDIT 7] API Validation Error Handling (HTTP 422): PASS ({res_invalid.status_code} Unprocessable Entity)")
    assert res_invalid.status_code == 422, "API validation check failed"

    # Verify server remains healthy after invalid payload
    res_health_post = client.get("/health")
    assert res_health_post.status_code == 200, "Server failed after validation error"
    print(f"[AUDIT 8] Server Stability Post-Error: PASS (200 OK)")

    print("============================================================")
    print("        ALL SYSTEM AUDIT & REGRESSION CHECKS PASSED         ")
    print("============================================================")

if __name__ == "__main__":
    run_system_suite()
