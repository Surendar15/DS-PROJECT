import sys
from pathlib import Path

app_dir = Path(__file__).resolve().parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from model_service import get_model_service
from recommendation_service import generate_engagement_recommendation
from schemas import SessionPredictRequest, SessionPredictResponse

app = FastAPI(
    title="E-Commerce Purchase Intention & Cart Abandonment Prediction API",
    description="FastAPI REST API for real-time customer session purchase intention prediction and engagement recommendations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for React Frontend & Local Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["API Info"])
def root_endpoint():
    """Returns API identification and operational status."""
    return {
        "name": "E-Commerce Purchase Intention Prediction API",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health Check"])
def health_endpoint():
    """Health check endpoint verifying backend service operational status."""
    return {"status": "healthy"}


@app.post(
    "/predict",
    response_model=SessionPredictResponse,
    status_code=status.HTTP_200_OK,
    tags=["Machine Learning Prediction"],
    summary="Predict Session Purchase Intention",
    description="Accepts 17 raw session behavioral features, passes them to the trained Random Forest pipeline, and returns prediction, probability, confidence score, and actionable recommendation.",
)
def predict_session_intention(request: SessionPredictRequest):
    try:
        model_service = get_model_service()
        pred_class, prob_conversion = model_service.predict(request)

        # Human-readable labels and confidence
        label = "Likely Conversion" if pred_class == 1 else "Likely Non-Conversion"
        confidence = prob_conversion if pred_class == 1 else (1.0 - prob_conversion)

        # Business recommendation
        recommendation = generate_engagement_recommendation(prob_conversion, pred_class)

        return SessionPredictResponse(
            prediction=pred_class,
            label=label,
            conversion_probability=round(prob_conversion, 4),
            conversion_probability_percent=round(prob_conversion * 100.0, 2),
            confidence=round(confidence, 4),
            recommendation=recommendation,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction service failure: {str(e)}",
        )
