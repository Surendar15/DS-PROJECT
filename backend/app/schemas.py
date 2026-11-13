from typing import Annotated
from pydantic import BaseModel, Field


class SessionPredictRequest(BaseModel):
    """
    Input schema for e-commerce user browsing session feature vector.
    Validates all 17 raw features required by the trained ML pipeline.
    """

    Administrative: Annotated[int, Field(ge=0, description="Number of administrative page views", example=1)]
    Administrative_Duration: Annotated[float, Field(ge=0.0, description="Duration spent on administrative pages (seconds)", example=4.0)]
    Informational: Annotated[int, Field(ge=0, description="Number of informational page views", example=0)]
    Informational_Duration: Annotated[float, Field(ge=0.0, description="Duration spent on informational pages (seconds)", example=0.0)]
    ProductRelated: Annotated[int, Field(ge=0, description="Number of product-related page views", example=13)]
    ProductRelated_Duration: Annotated[float, Field(ge=0.0, description="Duration spent on product-related pages (seconds)", example=161.1666667)]
    BounceRates: Annotated[float, Field(ge=0.0, le=1.0, description="Average bounce rate of pages visited by visitor", example=0.024615385)]
    ExitRates: Annotated[float, Field(ge=0.0, le=1.0, description="Average exit rate of pages visited by visitor", example=0.061538462)]
    PageValues: Annotated[float, Field(ge=0.0, description="Average page value for web pages visited", example=0.0)]
    SpecialDay: Annotated[float, Field(ge=0.0, le=1.0, description="Closeness of site visiting time to a specific special day", example=0.6)]
    Month: Annotated[str, Field(description="Month of the session visit", example="May")]
    OperatingSystems: Annotated[int, Field(description="Operating system ID used by visitor", example=2)]
    Browser: Annotated[int, Field(description="Browser ID used by visitor", example=5)]
    Region: Annotated[int, Field(description="Geographic region ID of visitor", example=9)]
    TrafficType: Annotated[int, Field(description="Traffic source type ID", example=5)]
    VisitorType: Annotated[str, Field(description="Visitor category: Returning_Visitor, New_Visitor, or Other", example="Returning_Visitor")]
    Weekend: Annotated[bool, Field(description="Boolean flag indicating if session occurred on weekend", example=False)]


class RecommendationObject(BaseModel):
    """
    Business recommendation object generated from prediction probability & behavior.
    """

    action: str = Field(description="Recommended action key: 'maintain', 'recommend', 'engage'", example="engage")
    message: str = Field(description="Human-readable business recommendation message")
    recommendation_type: str = Field(description="Recommendation category code", example="PROMOTIONAL_DISCOUNT")


class SessionPredictResponse(BaseModel):
    """
    Structured output response for session purchase intention prediction.
    """

    prediction: int = Field(description="Predicted binary class: 0 (Likely Non-Conversion), 1 (Likely Conversion)", example=0)
    label: str = Field(description="Human-readable prediction label", example="Likely Non-Conversion")
    conversion_probability: float = Field(description="Model predicted probability for conversion class (Revenue=True)", example=0.015)
    conversion_probability_percent: float = Field(description="Percentage representation of conversion probability", example=1.5)
    confidence: float = Field(description="Model prediction confidence score (probability of predicted class)", example=0.985)
    recommendation: RecommendationObject
