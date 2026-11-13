import sys
from pathlib import Path

# Add backend/app directory to python path
app_dir = Path(__file__).resolve().parent / "app"
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
    print(" -> test_health_endpoint: PASS")


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"
    print(" -> test_root_endpoint: PASS")


def test_predict_sample_session():
    sample_payload = {
        "Administrative": 1,
        "Administrative_Duration": 4.0,
        "Informational": 0,
        "Informational_Duration": 0.0,
        "ProductRelated": 13,
        "ProductRelated_Duration": 161.1666667,
        "BounceRates": 0.024615385,
        "ExitRates": 0.061538462,
        "PageValues": 0.0,
        "SpecialDay": 0.6,
        "Month": "May",
        "OperatingSystems": 2,
        "Browser": 5,
        "Region": 9,
        "TrafficType": 5,
        "VisitorType": "Returning_Visitor",
        "Weekend": False,
    }
    response = client.post("/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "label" in data
    assert "conversion_probability" in data
    assert "confidence" in data
    assert "recommendation" in data
    assert data["prediction"] == 0
    assert data["label"] == "Likely Non-Conversion"
    print(f" -> test_predict_sample_session: PASS (prediction={data['prediction']}, prob={data['conversion_probability']})")


def test_predict_validation_error():
    # Send negative PageValues which breaks ge=0 validation constraint
    invalid_payload = {
        "Administrative": -1,
        "Administrative_Duration": 4.0,
        "Informational": 0,
        "Informational_Duration": 0.0,
        "ProductRelated": 13,
        "ProductRelated_Duration": 161.1666667,
        "BounceRates": 0.02,
        "ExitRates": 0.06,
        "PageValues": -10.0,
        "SpecialDay": 0.6,
        "Month": "May",
        "OperatingSystems": 2,
        "Browser": 5,
        "Region": 9,
        "TrafficType": 5,
        "VisitorType": "Returning_Visitor",
        "Weekend": False,
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422  # Unprocessable Entity
    print(" -> test_predict_validation_error: PASS (Returned 422 Unprocessable Entity)")


def test_predict_high_intent_session():
    # Session with high PageValues indicating high conversion intent
    high_intent_payload = {
        "Administrative": 5,
        "Administrative_Duration": 120.0,
        "Informational": 2,
        "Informational_Duration": 45.0,
        "ProductRelated": 45,
        "ProductRelated_Duration": 1800.0,
        "BounceRates": 0.0,
        "ExitRates": 0.01,
        "PageValues": 65.4,
        "SpecialDay": 0.0,
        "Month": "Nov",
        "OperatingSystems": 2,
        "Browser": 2,
        "Region": 1,
        "TrafficType": 2,
        "VisitorType": "New_Visitor",
        "Weekend": True,
    }
    response = client.post("/predict", json=high_intent_payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    print(f" -> test_predict_high_intent_session: PASS (prediction={data['prediction']}, prob={data['conversion_probability']})")


if __name__ == "__main__":
    print("Running FastAPI TestClient Suite...")
    test_health_endpoint()
    test_root_endpoint()
    test_predict_sample_session()
    test_predict_validation_error()
    test_predict_high_intent_session()
    print("All FastAPI TestClient tests PASSED successfully.")
