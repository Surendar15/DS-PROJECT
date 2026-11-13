import os
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def load_dataset(filepath: str) -> pd.DataFrame:
    """
    Load the dataset from the specified CSV filepath.
    Ensures the original dataset is not modified.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")
    df = pd.read_csv(filepath)
    return df


def inspect_dataset_overview(df: pd.DataFrame) -> dict:
    """
    Returns basic dataset statistics: shape, data types, memory usage, head, tail.
    """
    memory_usage_mb = df.memory_usage(deep=True).sum() / (1024 * 1024)
    return {
        "num_rows": df.shape[0],
        "num_cols": df.shape[1],
        "column_names": list(df.columns),
        "dtypes": df.dtypes.to_dict(),
        "memory_usage_mb": round(memory_usage_mb, 4),
        "head": df.head(5),
        "tail": df.tail(5),
    }


def analyze_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Analyzes missing values per column.
    Returns a DataFrame with Column, Data Type, Missing Count, and Missing Percentage.
    """
    missing_count = df.isnull().sum()
    missing_pct = (missing_count / len(df)) * 100
    report_df = pd.DataFrame(
        {
            "Column": df.columns,
            "Data Type": df.dtypes.astype(str),
            "Missing Count": missing_count,
            "Missing Percentage": missing_pct.round(4),
        }
    ).reset_index(drop=True)
    return report_df


def analyze_duplicates(df: pd.DataFrame) -> dict:
    """
    Analyzes duplicate records in the dataset.
    """
    total_records = len(df)
    duplicate_count = df.duplicated().sum()
    duplicate_pct = (duplicate_count / total_records) * 100
    return {
        "total_records": total_records,
        "duplicate_count": int(duplicate_count),
        "duplicate_pct": round(float(duplicate_pct), 4),
    }


def identify_feature_types(df: pd.DataFrame, target_col: str = "Revenue") -> tuple[list[str], list[str]]:
    """
    Automatically identifies numerical and categorical feature columns.
    Categorical columns include strings, booleans, and discrete categorical integer IDs.
    """
    features = [col for col in df.columns if col != target_col]

    # Explicit categorical features in Online Shoppers Purchasing Intention dataset
    # Categorical columns: Month, VisitorType, Weekend, OperatingSystems, Browser, Region, TrafficType
    known_categorical = ["Month", "VisitorType", "Weekend", "OperatingSystems", "Browser", "Region", "TrafficType"]

    cat_cols = []
    num_cols = []

    for col in features:
        if col in known_categorical or df[col].dtype == "object" or df[col].dtype == "bool":
            cat_cols.append(col)
        else:
            num_cols.append(col)

    return num_cols, cat_cols


def analyze_numerical_features(df: pd.DataFrame, num_cols: list[str]) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Computes descriptive statistics and IQR-based outlier analysis for numerical columns.
    """
    desc_stats = df[num_cols].describe().T

    outlier_list = []
    for col in num_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
        outlier_count = len(outliers)
        outlier_pct = (outlier_count / len(df)) * 100
        outlier_list.append(
            {
                "Column": col,
                "Q1": Q1,
                "Median": df[col].median(),
                "Q3": Q3,
                "IQR": IQR,
                "Lower Bound": lower_bound,
                "Upper Bound": upper_bound,
                "Outlier Count": outlier_count,
                "Outlier Percentage": round(outlier_pct, 4),
            }
        )

    outlier_df = pd.DataFrame(outlier_list)
    return desc_stats, outlier_df


def analyze_categorical_features(df: pd.DataFrame, cat_cols: list[str]) -> dict:
    """
    Analyzes category frequencies, percentages, and unique values for categorical features.
    """
    cat_summary = {}
    for col in cat_cols:
        val_counts = df[col].value_counts(dropna=False)
        val_pcts = df[col].value_counts(normalize=True, dropna=False) * 100
        unique_vals = df[col].unique().tolist()

        cat_summary[col] = {
            "num_unique": len(unique_vals),
            "unique_values": unique_vals if len(unique_vals) <= 20 else unique_vals[:20] + ["..."],
            "frequencies": val_counts.to_dict(),
            "percentages": val_pcts.round(4).to_dict(),
        }
    return cat_summary


def analyze_target(df: pd.DataFrame, target_col: str = "Revenue") -> dict:
    """
    Analyzes class counts, percentages, and imbalance ratio for the target column.
    """
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset.")

    class_counts = df[target_col].value_counts().to_dict()
    class_pcts = (df[target_col].value_counts(normalize=True) * 100).round(4).to_dict()

    true_count = class_counts.get(True, 0)
    false_count = class_counts.get(False, 0)
    imbalance_ratio = round(false_count / true_count, 4) if true_count > 0 else 0.0

    return {
        "target_col": target_col,
        "class_counts": class_counts,
        "class_percentages": class_pcts,
        "non_conversion_count (False)": false_count,
        "conversion_count (True)": true_count,
        "imbalance_ratio_false_to_true": imbalance_ratio,
    }


def create_preprocessing_pipeline(num_cols: list[str], cat_cols: list[str]) -> ColumnTransformer:
    """
    Creates a scikit-learn ColumnTransformer preprocessing pipeline.
    Numerical pipeline: SimpleImputer (median) + StandardScaler
    Categorical pipeline: SimpleImputer (most_frequent) + OneHotEncoder (handle_unknown='ignore')
    """
    num_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    cat_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, num_cols),
            ("cat", cat_pipeline, cat_cols),
        ],
        remainder="drop",
    )

    return preprocessor


def split_dataset(
    df: pd.DataFrame, target_col: str = "Revenue", test_size: float = 0.2, random_state: int = 42
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Splits features and target into stratified train/test sets.
    Target variable is converted to integer (0 / 1) for modeling.
    """
    X = df.drop(columns=[target_col]).copy()
    y = df[target_col].astype(int).copy()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    return X_train, X_test, y_train, y_test


def fit_and_save_preprocessor(
    preprocessor: ColumnTransformer, X_train: pd.DataFrame, save_path: str = "ml/models/preprocessor.pkl"
) -> ColumnTransformer:
    """
    Fits the preprocessing pipeline ONLY on the training data to prevent data leakage,
    and serializes the fitted preprocessor using joblib.
    """
    preprocessor.fit(X_train)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(preprocessor, save_path)
    return preprocessor
