import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

from preprocessing import (
    create_preprocessing_pipeline,
    fit_and_save_preprocessor,
    identify_feature_types,
    load_dataset,
    split_dataset,
)


def train_random_forest_model(
    filepath: str = "dataset/online_shoppers_intention.csv",
    model_save_path: str = "ml/models/random_forest.pkl",
    preprocessor_save_path: str = "ml/models/preprocessor.pkl",
    pipeline_save_path: str = "ml/models/full_pipeline.pkl",
    n_estimators: int = 200,
    random_state: int = 42,
) -> tuple[RandomForestClassifier, Pipeline, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, list[str], list[str]]:
    """
    Loads dataset, splits 80/20 train/test, fits preprocessor on X_train only,
    trains RandomForestClassifier with class_weight='balanced', and serializes models.
    """
    df = load_dataset(filepath)

    num_cols, cat_cols = identify_feature_types(df, target_col="Revenue")
    X_train, X_test, y_train, y_test = split_dataset(
        df, target_col="Revenue", test_size=0.2, random_state=random_state
    )

    # 1. Fit Preprocessor on Training Data ONLY
    preprocessor = create_preprocessing_pipeline(num_cols, cat_cols)
    preprocessor = fit_and_save_preprocessor(
        preprocessor, X_train, save_path=preprocessor_save_path
    )

    # 2. Transform Features
    X_train_transformed = preprocessor.transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)

    # 3. Train Random Forest Classifier
    rf_model = RandomForestClassifier(
        n_estimators=n_estimators,
        class_weight="balanced",
        random_state=random_state,
        n_jobs=-1,
    )
    rf_model.fit(X_train_transformed, y_train)

    # 4. Save Model Objects
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    joblib.dump(rf_model, model_save_path)

    # 5. Create and Save Full Sklearn Pipeline
    full_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", rf_model),
        ]
    )
    joblib.dump(full_pipeline, pipeline_save_path)

    return (
        rf_model,
        full_pipeline,
        X_train,
        X_test,
        y_train,
        y_test,
        num_cols,
        cat_cols,
    )


if __name__ == "__main__":
    print("Training Random Forest Classifier...")
    model, pipeline, X_train, X_test, y_train, y_test, num_cols, cat_cols = train_random_forest_model()
    print("Random Forest model trained and saved successfully.")
