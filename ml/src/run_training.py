import os
import joblib
import pandas as pd
from evaluate_model import evaluate_model_performance
from train_model import train_random_forest_model


def main():
    print("=" * 80)
    print("  STEP 4: RANDOM FOREST TRAINING, EVALUATION & FEATURE IMPORTANCE RUNNER")
    print("  Project: An Empirical Investigation Into E-Commerce Cart Abandonment Factors")
    print("=" * 80)

    # 1. Train Model & Save Pipeline
    print("\n[1/4] Training Random Forest Classifier on 80% Training Data...")
    (
        rf_model,
        full_pipeline,
        X_train,
        X_test,
        y_train,
        y_test,
        num_cols,
        cat_cols,
    ) = train_random_forest_model(
        filepath="dataset/online_shoppers_intention.csv",
        model_save_path="ml/models/random_forest.pkl",
        preprocessor_save_path="ml/models/preprocessor.pkl",
        pipeline_save_path="ml/models/full_pipeline.pkl",
        n_estimators=200,
        random_state=42,
    )

    print(f" -> Training set size : {len(X_train):,} samples")
    print(f" -> Testing set size  : {len(X_test):,} samples")

    # 2. Evaluate Model Performance on Unseen Test Set
    print("\n[2/4] Evaluating model performance on 20% unseen test set...")
    preprocessor = joblib.load("ml/models/preprocessor.pkl")
    eval_results = evaluate_model_performance(
        model=rf_model,
        preprocessor=preprocessor,
        X_test=X_test,
        y_test=y_test,
        results_dir="ml/results",
    )

    # 3. Model Reload Verification Test
    print("\n[3/4] Performing Joblib Model Reload & Prediction Verification Test...")
    reload_status = "FAIL"
    try:
        # Load saved preprocessor and model
        loaded_preprocessor = joblib.load("ml/models/preprocessor.pkl")
        loaded_model = joblib.load("ml/models/random_forest.pkl")
        loaded_pipeline = joblib.load("ml/models/full_pipeline.pkl")

        # Take a single raw sample from X_test
        sample_raw = X_test.iloc[[0]]
        sample_transformed = loaded_preprocessor.transform(sample_raw)

        sample_pred = loaded_model.predict(sample_transformed)[0]
        sample_prob = loaded_model.predict_proba(sample_transformed)[0][1]

        pipeline_pred = loaded_pipeline.predict(sample_raw)[0]
        pipeline_prob = loaded_pipeline.predict_proba(sample_raw)[0][1]

        if sample_pred == pipeline_pred and abs(sample_prob - pipeline_prob) < 1e-6:
            reload_status = "PASS"
            print(f" -> Sample Raw Input Feature Row:\n{sample_raw.to_dict(orient='records')[0]}")
            print(f" -> Predicted Class              : {sample_pred} ({'Conversion' if sample_pred == 1 else 'Non-Conversion'})")
            print(f" -> Predicted Conversion Prob    : {sample_prob:.4f}")
            print(f" -> Pipeline Test Verification   : {reload_status}")
    except Exception as e:
        print(f" -> Reload Test Error: {e}")
        reload_status = "FAIL"

    # 4. Print Summary Report as required by Section 18
    print("\n" + "=" * 50)
    print("STEP 4: RANDOM FOREST RESULTS")
    print("=" * 50)
    print(f"\nDataset:")
    print(f"Training samples: {len(X_train):,}")
    print(f"Testing samples : {len(X_test):,}")

    print(f"\nModel:")
    print("Random Forest Classifier (n_estimators=200, class_weight='balanced', random_state=42)")

    print(f"\nPerformance Metrics (Test Set):")
    print(f"Accuracy         : {eval_results['accuracy']:.4f}")
    print(f"Precision        : {eval_results['precision']:.4f}")
    print(f"Recall           : {eval_results['recall']:.4f}")
    print(f"F1-score         : {eval_results['f1']:.4f}")
    print(f"ROC-AUC          : {eval_results['roc_auc']:.4f}")
    print(f"Average Precision: {eval_results['avg_precision']:.4f}")

    print(f"\nConfusion Matrix:")
    print(f"TN: {eval_results['tn']:,}")
    print(f"FP: {eval_results['fp']:,}")
    print(f"FN: {eval_results['fn']:,}")
    print(f"TP: {eval_results['tp']:,}")

    print(f"\nTop 10 Features:")
    for idx, item in enumerate(eval_results["top_10_features"], 1):
        print(f"{idx:2d}. {item['Feature']:<30} (Importance = {item['Importance']:.6f})")

    print(f"\nModel saved:")
    print("ml/models/random_forest.pkl")
    print("ml/models/full_pipeline.pkl")

    print(f"\nReload test:")
    print(f"{reload_status}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    main()
