import os
import pandas as pd

from preprocessing import (
    analyze_categorical_features,
    analyze_duplicates,
    analyze_missing_values,
    analyze_numerical_features,
    analyze_target,
    create_preprocessing_pipeline,
    fit_and_save_preprocessor,
    identify_feature_types,
    inspect_dataset_overview,
    load_dataset,
    split_dataset,
)


def run_dataset_analysis():
    print("=" * 80)
    print("  STEP 2: DATASET ANALYSIS & PREPROCESSING PIPELINE INITIALIZATION")
    print("  Project: An Empirical Investigation Into E-Commerce Cart Abandonment Factors")
    print("=" * 80)

    dataset_path = os.path.join("dataset", "online_shoppers_intention.csv")

    # 1. Load Dataset
    print(f"\n[1/7] Loading dataset from: {dataset_path}")
    df = load_dataset(dataset_path)
    overview = inspect_dataset_overview(df)

    print(f" -> Dimensions: {overview['num_rows']} rows x {overview['num_cols']} columns")
    print(f" -> Memory Usage: {overview['memory_usage_mb']} MB")
    print(f" -> Columns ({len(overview['column_names'])}): {overview['column_names']}")

    print("\n--- FIRST 5 ROWS ---")
    print(overview["head"].to_string())

    print("\n--- LAST 5 ROWS ---")
    print(overview["tail"].to_string())

    # 2. Data Validation (Missing Values & Duplicates)
    print("\n[2/7] Running Data Validation...")
    missing_df = analyze_missing_values(df)

    print("\n--- MISSING VALUE REPORT ---")
    print(missing_df.to_string(index=False))

    duplicates = analyze_duplicates(df)
    print("\n--- DUPLICATE RECORDS REPORT ---")
    print(f" -> Total Records     : {duplicates['total_records']}")
    print(f" -> Duplicate Records : {duplicates['duplicate_count']}")
    print(f" -> Duplicate Rate    : {duplicates['duplicate_pct']}%")
    print(
        " -> Explanation       : Identical session attribute vectors reflect duplicate user browsing behavior patterns"
    )
    print(
        "                         across sessions. They represent genuine repeated traffic patterns and are retained"
    )
    print("                         without silent deletion to maintain true distribution probabilities.")

    # 3. Feature Identification & Analysis
    print("\n[3/7] Identifying Feature Types...")
    num_cols, cat_cols = identify_feature_types(df, target_col="Revenue")
    print(f" -> Numerical Features ({len(num_cols)})  : {num_cols}")
    print(f" -> Categorical Features ({len(cat_cols)}): {cat_cols}")

    print("\n--- NUMERICAL DESCRIPTIVE STATISTICS ---")
    desc_stats, outlier_df = analyze_numerical_features(df, num_cols)
    print(desc_stats.round(4).to_string())

    print("\n--- OUTLIER ANALYSIS (IQR METHOD) ---")
    print(outlier_df.to_string(index=False))
    print(" -> Note: Outliers are preserved to allow tree-based Random Forest models to capture extreme sessions.")

    print("\n--- CATEGORICAL FEATURE ANALYSIS ---")
    cat_summary = analyze_categorical_features(df, cat_cols)
    for col, info in cat_summary.items():
        print(f" * Feature '{col}': {info['num_unique']} unique values")
        print(f"   Values      : {info['unique_values']}")
        print(f"   Frequencies : {info['frequencies']}")
        print(f"   Percentages : {info['percentages']}")

    # 4. Target Variable Analysis
    print("\n[4/7] Analyzing Target Variable ('Revenue')...")
    target_info = analyze_target(df, target_col="Revenue")
    print(f" -> Target Column    : {target_info['target_col']}")
    print(f" -> Class Counts     : {target_info['class_counts']}")
    print(f" -> Class Percentages: {target_info['class_percentages']}%")
    print(f" -> Non-Conversion (Revenue = False): {target_info['non_conversion_count (False)']} sessions")
    print(f" -> Conversion (Revenue = True)     : {target_info['conversion_count (True)']} sessions")
    print(f" -> Imbalance Ratio (False : True)  : {target_info['imbalance_ratio_false_to_true']} : 1")
    print(
        " -> Research Context: Revenue=False represents session non-conversion, which serves as a proxy for potential"
    )
    print("                      cart abandonment & drop-off behavior analysis.")

    # 5. Train / Test Split
    print("\n[5/7] Performing 80/20 Stratified Train/Test Split...")
    X_train, X_test, y_train, y_test = split_dataset(df, target_col="Revenue", test_size=0.2, random_state=42)
    print(f" -> Training set shape : X_train={X_train.shape}, y_train={y_train.shape}")
    print(f" -> Testing set shape  : X_test={X_test.shape}, y_test={y_test.shape}")
    print(
        f" -> Train target distribution: 0 (False)={int((y_train==0).sum())}, 1 (True)={int((y_train==1).sum())} ({round((y_train==1).mean()*100, 2)}% positive)"
    )
    print(
        f" -> Test target distribution : 0 (False)={int((y_test==0).sum())}, 1 (True)={int((y_test==1).sum())} ({round((y_test==1).mean()*100, 2)}% positive)"
    )

    # 6. Fit Preprocessor (Prevent Data Leakage)
    print("\n[6/7] Fitting Preprocessing Pipeline on Training Data ONLY...")
    preprocessor = create_preprocessing_pipeline(num_cols, cat_cols)
    fitted_preprocessor = fit_and_save_preprocessor(preprocessor, X_train, save_path="ml/models/preprocessor.pkl")

    X_train_transformed = fitted_preprocessor.transform(X_train)
    X_test_transformed = fitted_preprocessor.transform(X_test)
    print(f" -> Preprocessor saved to: ml/models/preprocessor.pkl")
    print(f" -> Transformed Training Features Shape: {X_train_transformed.shape}")
    print(f" -> Transformed Testing Features Shape : {X_test_transformed.shape}")
    print(" -> Data leakage prevented: Preprocessor was fitted ONLY on X_train.")

    # 7. Generate Reports
    print("\n[7/7] Generating Data Quality Reports...")

    # Report 1: data_quality_report.csv
    results_dir = os.path.join("ml", "results")
    os.makedirs(results_dir, exist_ok=True)

    dq_list = []
    for col in df.columns:
        dq_list.append(
            {
                "Column": col,
                "Data Type": str(df[col].dtype),
                "Missing Count": int(df[col].isnull().sum()),
                "Missing Percentage": round(float((df[col].isnull().sum() / len(df)) * 100), 4),
                "Unique Count": int(df[col].nunique()),
            }
        )

    dq_df = pd.DataFrame(dq_list)
    dq_csv_path = os.path.join(results_dir, "data_quality_report.csv")
    dq_df.to_csv(dq_csv_path, index=False)
    print(f" -> Saved Data Quality Report: {dq_csv_path}")

    # Report 2: dataset_summary.txt
    summary_txt_path = os.path.join(results_dir, "dataset_summary.txt")
    with open(summary_txt_path, "w", encoding="utf-8") as f:
        f.write("========================================================================\n")
        f.write("           DATASET SUMMARY & PREPROCESSING PIPELINE REPORT             \n")
        f.write("========================================================================\n\n")
        f.write(f"Project Title: An Empirical Investigation Into E-Commerce Cart Abandonment Factors\n")
        f.write(f"Dataset File : {dataset_path}\n")
        f.write(f"Total Rows   : {overview['num_rows']}\n")
        f.write(f"Total Cols   : {overview['num_cols']}\n")
        f.write(f"Memory Usage : {overview['memory_usage_mb']} MB\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("FEATURE SPECIFICATIONS\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"Target Column               : Revenue\n")
        f.write(f"Numerical Features ({len(num_cols)})     : {', '.join(num_cols)}\n")
        f.write(f"Categorical Features ({len(cat_cols)})   : {', '.join(cat_cols)}\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("DATA QUALITY SUMMARY\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"Total Missing Values        : {df.isnull().sum().sum()}\n")
        f.write(
            f"Duplicate Record Count      : {duplicates['duplicate_count']} ({duplicates['duplicate_pct']}% of total)\n"
        )
        f.write(
            "Duplicate Treatment Note    : Duplicate session feature rows are retained as valid natural traffic distributions.\n\n"
        )

        f.write("------------------------------------------------------------------------\n")
        f.write("TARGET DISTRIBUTION (Revenue)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(
            f"Non-Conversion (Revenue=False): {target_info['non_conversion_count (False)']} ({target_info['class_percentages'].get(False, 0)}%)\n"
        )
        f.write(
            f"Conversion (Revenue=True)    : {target_info['conversion_count (True)']} ({target_info['class_percentages'].get(True, 0)}%)\n"
        )
        f.write(
            f"Imbalance Ratio (False:True)  : {target_info['imbalance_ratio_false_to_true']} : 1\n"
        )
        f.write(
            "Research Proxy Note          : Revenue=False represents non-conversion sessions, used as proxy for potential cart abandonment.\n\n"
        )

        f.write("------------------------------------------------------------------------\n")
        f.write("TRAIN / TEST SPLIT (80% Train / 20% Test, Stratified, random_state=42)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"X_train Shape               : {X_train.shape}\n")
        f.write(f"X_test Shape                : {X_test.shape}\n")
        f.write(f"y_train Shape               : {y_train.shape}\n")
        f.write(f"y_test Shape                : {y_test.shape}\n")
        f.write(f"Transformed X_train Shape   : {X_train_transformed.shape}\n")
        f.write(f"Transformed X_test Shape    : {X_test_transformed.shape}\n")
        f.write(f"Fitted Preprocessor Path    : ml/models/preprocessor.pkl\n")
        f.write("========================================================================\n")

    print(f" -> Saved Dataset Summary: {summary_txt_path}")

    print("\n" + "=" * 80)
    print("  STEP 2 ANALYSIS & PREPROCESSING SUCCESSFULLY COMPLETED!")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    run_dataset_analysis()
