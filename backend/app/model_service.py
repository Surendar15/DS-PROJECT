import sys
from pathlib import Path

app_dir = Path(__file__).resolve().parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

import joblib
import pandas as pd
from schemas import SessionPredictRequest


class ModelService:
    """
    Singleton service responsible for loading the trained ML pipeline once
    and executing raw session predictions.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        # Resolve project root path robustly
        current_file = Path(__file__).resolve()
        project_root = current_file.parent.parent.parent

        pipeline_path = project_root / "ml" / "models" / "full_pipeline.pkl"
        rf_path = project_root / "ml" / "models" / "random_forest.pkl"
        prep_path = project_root / "ml" / "models" / "preprocessor.pkl"

        if pipeline_path.exists():
            print(f"[ModelService] Loading full ML pipeline from: {pipeline_path}")
            self.pipeline = joblib.load(pipeline_path)
            self.use_full_pipeline = True
        elif rf_path.exists() and prep_path.exists():
            print(f"[ModelService] Loading model & preprocessor separately from: {rf_path}")
            self.preprocessor = joblib.load(prep_path)
            self.model = joblib.load(rf_path)
            self.use_full_pipeline = False
        else:
            raise FileNotFoundError(
                f"Trained model files not found in '{project_root / 'ml' / 'models'}'. Run STEP 4 training script first."
            )

    def predict(self, session_data: SessionPredictRequest) -> tuple[int, float]:
        """
        Converts session input to DataFrame, runs pipeline prediction,
        and returns (prediction_class, conversion_probability).
        """
        raw_dict = session_data.model_dump()
        df_input = pd.DataFrame([raw_dict])

        if self.use_full_pipeline:
            pred_class = int(self.pipeline.predict(df_input)[0])
            prob_conversion = float(self.pipeline.predict_proba(df_input)[0][1])
        else:
            df_transformed = self.preprocessor.transform(df_input)
            pred_class = int(self.model.predict(df_transformed)[0])
            prob_conversion = float(self.model.predict_proba(df_transformed)[0][1])

        return pred_class, prob_conversion


# Export singleton getter
def get_model_service() -> ModelService:
    return ModelService()
