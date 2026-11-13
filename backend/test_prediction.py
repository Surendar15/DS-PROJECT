import requests


def test_live_backend_api():
    base_url = "http://127.0.0.1:8000"

    print(f"Connecting to live backend API at {base_url}...")

    # 1. Health check
    health_res = requests.get(f"{base_url}/health")
    print(f"GET /health status: {health_res.status_code}, response: {health_res.json()}")

    # 2. Sample session prediction
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

    pred_res = requests.post(f"{base_url}/predict", json=sample_payload)
    print(f"POST /predict status: {pred_res.status_code}")
    print("Prediction Response:")
    print(pred_res.json())


if __name__ == "__main__":
    test_live_backend_api()
