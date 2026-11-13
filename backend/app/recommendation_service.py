import sys
from pathlib import Path

app_dir = Path(__file__).resolve().parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

from schemas import RecommendationObject


def generate_engagement_recommendation(conversion_probability: float, prediction: int) -> RecommendationObject:
    """
    Rule-based recommendation engine layered on top of the ML purchase intention prediction.
    Generates actionable business interventions based on predicted conversion probability.
    """
    if conversion_probability >= 0.50:
        return RecommendationObject(
            action="maintain",
            message="Customer shows strong purchase intent. Maintain a smooth checkout experience.",
            recommendation_type="NO_INTERVENTION",
        )
    elif conversion_probability >= 0.20:
        return RecommendationObject(
            action="recommend",
            message="Customer shows moderate purchase intent. Consider showing relevant product recommendations.",
            recommendation_type="PRODUCT_RECOMMENDATION",
        )
    else:
        return RecommendationObject(
            action="engage",
            message="Customer shows low purchase intent. Consider a gentle engagement offer or assistance.",
            recommendation_type="PROMOTIONAL_DISCOUNT",
        )
