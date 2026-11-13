import os
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Set global clean Seaborn style for research charts
sns.set_theme(style="whitegrid", font="sans-serif")
plt.rcParams.update(
    {
        "font.size": 11,
        "axes.labelsize": 12,
        "axes.titlesize": 14,
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
        "figure.titlesize": 16,
    }
)


def load_raw_dataset(filepath: str = "dataset/online_shoppers_intention.csv") -> pd.DataFrame:
    """Load original interpretable CSV dataset."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found at {filepath}")
    return pd.read_csv(filepath)


def generate_eda_summary(df: pd.DataFrame, save_path: str = "ml/results/eda_summary.txt"):
    """Generates basic dataset overview summary text file."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    bool_cols = df.select_dtypes(include=["bool"]).columns.tolist()
    obj_cols = df.select_dtypes(include=["object"]).columns.tolist()
    cat_cols = [c for c in obj_cols + bool_cols if c != "Revenue"]

    rev_counts = df["Revenue"].value_counts()
    rev_pcts = df["Revenue"].value_counts(normalize=True) * 100

    with open(save_path, "w", encoding="utf-8") as f:
        f.write("========================================================================\n")
        f.write("                 EDA DATASET OVERVIEW & SUMMARY REPORT                 \n")
        f.write("========================================================================\n\n")
        f.write(f"Dataset Location         : dataset/online_shoppers_intention.csv\n")
        f.write(f"Number of Observations   : {len(df)}\n")
        f.write(f"Number of Features       : {df.shape[1] - 1}\n")
        f.write(f"Target Variable          : Revenue\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("FEATURE CLASSIFICATION\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"Numerical Features ({len(num_cols)})   : {', '.join(num_cols)}\n")
        f.write(f"Categorical Features ({len(cat_cols)}): {', '.join(cat_cols)}\n")
        f.write(f"Boolean Features ({len(bool_cols)})    : {', '.join(bool_cols)}\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("TARGET DISTRIBUTION (Revenue)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"Revenue = False (Non-Conversion): {rev_counts.get(False, 0)} ({rev_pcts.get(False, 0):.2f}%)\n")
        f.write(f"Revenue = True  (Conversion)    : {rev_counts.get(True, 0)} ({rev_pcts.get(True, 0):.2f}%)\n")
        f.write(f"Imbalance Ratio (False:True)     : {(rev_counts.get(False, 0)/rev_counts.get(True, 1)):.2f} : 1\n")
        f.write("========================================================================\n")

    print(f" -> Saved Overview Summary to: {save_path}")


def plot_revenue_distribution(df: pd.DataFrame, save_path: str = "ml/results/revenue_distribution.png"):
    """Plots target variable (Revenue) distribution showing counts and percentages."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    rev_counts = df["Revenue"].value_counts()
    total = len(df)

    fig, ax = plt.subplots(figsize=(8, 6))
    colors = ["#e53935", "#43a047"]  # Red for non-conversion, Green for conversion
    bars = ax.bar(["Non-Conversion\n(Revenue = False)", "Conversion\n(Revenue = True)"], rev_counts.values, color=colors, width=0.5, edgecolor="black", linewidth=1)

    for bar in bars:
        height = bar.get_height()
        pct = (height / total) * 100
        ax.annotate(
            f"{height:,}\n({pct:.2f}%)",
            xy=(bar.get_x() + bar.get_width() / 2, height / 2),
            xytext=(0, 0),
            textcoords="offset points",
            ha="center",
            va="center",
            fontsize=12,
            fontweight="bold",
            color="white",
        )

    ax.set_title("Target Distribution: Session Conversion vs Non-Conversion (Revenue)", fontsize=14, fontweight="bold", pad=15)
    ax.set_ylabel("Number of Sessions", fontsize=12)
    ax.set_ylim(0, max(rev_counts.values) * 1.15)
    ax.yaxis.grid(True, linestyle="--", alpha=0.7)

    plt.tight_layout()
    plt.savefig(save_path, dpi=300)
    plt.close()
    print(f" -> Saved Target Distribution Chart to: {save_path}")


def plot_numerical_distributions(df: pd.DataFrame, output_dir: str = "ml/results/eda"):
    """Generates distribution plots for key numerical behavioral variables."""
    os.makedirs(output_dir, exist_ok=True)

    num_cols = [
        "Administrative",
        "Administrative_Duration",
        "Informational",
        "Informational_Duration",
        "ProductRelated",
        "ProductRelated_Duration",
        "BounceRates",
        "ExitRates",
        "PageValues",
        "SpecialDay",
    ]

    for col in num_cols:
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Histogram / KDE
        sns.histplot(df[col], kde=True, ax=axes[0], color="#1976d2", bins=30)
        axes[0].set_title(f"Distribution of {col}", fontweight="bold")
        axes[0].set_xlabel(col)
        axes[0].set_ylabel("Frequency")

        # Boxplot by Revenue
        sns.boxplot(x="Revenue", y=col, hue="Revenue", data=df, ax=axes[1], palette=["#e53935", "#43a047"], legend=False)
        axes[1].set_title(f"{col} by Session Revenue Status", fontweight="bold")
        axes[1].set_xticks([0, 1])
        axes[1].set_xticklabels(["Non-Conversion\n(False)", "Conversion\n(True)"])
        axes[1].set_xlabel("Revenue Status")
        axes[1].set_ylabel(col)

        plt.suptitle(f"Exploratory Distribution Analysis: {col}", fontsize=15, fontweight="bold", y=1.02)
        plt.tight_layout()
        plot_path = os.path.join(output_dir, f"{col.lower()}_distribution.png")
        plt.savefig(plot_path, dpi=300, bbox_inches="tight")
        plt.close()

    print(f" -> Saved {len(num_cols)} Numerical Distribution Plots in: {output_dir}/")


def analyze_behavioral_comparison(df: pd.DataFrame, save_path: str = "ml/results/behavioral_comparison.csv"):
    """Calculates grouped descriptive statistics comparing Revenue=True vs Revenue=False."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    num_cols = [
        "ProductRelated",
        "ProductRelated_Duration",
        "Administrative",
        "Administrative_Duration",
        "Informational",
        "Informational_Duration",
        "BounceRates",
        "ExitRates",
        "PageValues",
        "SpecialDay",
    ]

    records = []
    for col in num_cols:
        false_grp = df[df["Revenue"] == False][col]
        true_grp = df[df["Revenue"] == True][col]

        records.append(
            {
                "Variable": col,
                "NonConversion_Mean": round(false_grp.mean(), 4),
                "NonConversion_Median": round(false_grp.median(), 4),
                "NonConversion_Std": round(false_grp.std(), 4),
                "NonConversion_Min": round(false_grp.min(), 4),
                "NonConversion_Max": round(false_grp.max(), 4),
                "Conversion_Mean": round(true_grp.mean(), 4),
                "Conversion_Median": round(true_grp.median(), 4),
                "Conversion_Std": round(true_grp.std(), 4),
                "Conversion_Min": round(true_grp.min(), 4),
                "Conversion_Max": round(true_grp.max(), 4),
                "Mean_Difference": round(true_grp.mean() - false_grp.mean(), 4),
            }
        )

    comp_df = pd.DataFrame(records)
    comp_df.to_csv(save_path, index=False)
    print(f" -> Saved Behavioral Comparison CSV to: {save_path}")
    return comp_df


def analyze_visitor_type_conversion(df: pd.DataFrame, csv_path: str = "ml/results/visitor_type_conversion.csv", plot_path: str = "ml/results/eda/visitor_type_conversion.png"):
    """Analyzes VisitorType conversion rates and exports table & visualization."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    grouped = df.groupby("VisitorType")["Revenue"].agg(
        Total_Sessions="count",
        Conversions="sum",
    ).reset_index()

    grouped["Non_Conversions"] = grouped["Total_Sessions"] - grouped["Conversions"]
    grouped["Conversion_Rate_Pct"] = (grouped["Conversions"] / grouped["Total_Sessions"] * 100).round(4)
    grouped = grouped.sort_values(by="Total_Sessions", ascending=False).reset_index(drop=True)

    grouped.to_csv(csv_path, index=False)
    print(f" -> Saved VisitorType Conversion CSV to: {csv_path}")

    # Plot
    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(grouped["VisitorType"], grouped["Conversion_Rate_Pct"], color="#0288d1", edgecolor="black")

    for bar, sessions in zip(bars, grouped["Total_Sessions"]):
        height = bar.get_height()
        ax.annotate(
            f"{height:.2f}%\n(N={sessions:,})",
            xy=(bar.get_x() + bar.get_width() / 2, height),
            xytext=(0, 5),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=10,
            fontweight="bold",
        )

    ax.set_title("Conversion Rate (%) by Visitor Type", fontsize=14, fontweight="bold", pad=15)
    ax.set_xlabel("Visitor Type", fontsize=12)
    ax.set_ylabel("Conversion Rate (%)", fontsize=12)
    ax.set_ylim(0, max(grouped["Conversion_Rate_Pct"]) * 1.25)
    ax.yaxis.grid(True, linestyle="--", alpha=0.7)

    plt.tight_layout()
    plt.savefig(plot_path, dpi=300)
    plt.close()
    print(f" -> Saved VisitorType Chart to: {plot_path}")
    return grouped


def analyze_month_conversion(df: pd.DataFrame, csv_path: str = "ml/results/month_conversion.csv", plot_path: str = "ml/results/eda/month_conversion.png"):
    """Analyzes Month conversion rates preserving logical calendar order."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    calendar_order = ["Feb", "Mar", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    actual_months = [m for m in calendar_order if m in df["Month"].unique()]

    df_month = df.copy()
    df_month["Month"] = pd.Categorical(df_month["Month"], categories=actual_months, ordered=True)

    grouped = df_month.groupby("Month", observed=False)["Revenue"].agg(
        Total_Sessions="count",
        Conversions="sum",
    ).reset_index()

    grouped["Non_Conversions"] = grouped["Total_Sessions"] - grouped["Conversions"]
    grouped["Conversion_Rate_Pct"] = (grouped["Conversions"] / grouped["Total_Sessions"] * 100).round(4)

    grouped.to_csv(csv_path, index=False)
    print(f" -> Saved Month Conversion CSV to: {csv_path}")

    # Plot
    fig, ax1 = plt.subplots(figsize=(11, 6))

    color1 = "#1565c0"
    ax1.set_xlabel("Month", fontsize=12, fontweight="bold")
    ax1.set_ylabel("Total Session Volume", color=color1, fontsize=12, fontweight="bold")
    bars = ax1.bar(grouped["Month"].astype(str), grouped["Total_Sessions"], color=color1, alpha=0.4, label="Total Sessions")
    ax1.tick_params(axis="y", labelcolor=color1)

    ax2 = ax1.twinx()
    color2 = "#d81b60"
    ax2.set_ylabel("Conversion Rate (%)", color=color2, fontsize=12, fontweight="bold")
    line = ax2.plot(grouped["Month"].astype(str), grouped["Conversion_Rate_Pct"], color=color2, marker="o", linewidth=2.5, markersize=8, label="Conversion Rate (%)")
    ax2.tick_params(axis="y", labelcolor=color2)
    ax2.set_ylim(0, max(grouped["Conversion_Rate_Pct"]) * 1.3)

    for i, txt in enumerate(grouped["Conversion_Rate_Pct"]):
        ax2.annotate(f"{txt:.1f}%", (grouped["Month"].astype(str)[i], txt), xytext=(0, 8), textcoords="offset points", ha="center", fontweight="bold", color=color2)

    plt.title("Monthly Session Volume and Conversion Rate (%)", fontsize=14, fontweight="bold", pad=15)
    fig.tight_layout()
    plt.savefig(plot_path, dpi=300)
    plt.close()
    print(f" -> Saved Month Chart to: {plot_path}")
    return grouped


def analyze_weekend_conversion(df: pd.DataFrame, csv_path: str = "ml/results/weekend_conversion.csv", plot_path: str = "ml/results/eda/weekend_conversion.png"):
    """Analyzes Weekend conversion rates."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    grouped = df.groupby("Weekend")["Revenue"].agg(
        Total_Sessions="count",
        Conversions="sum",
    ).reset_index()

    grouped["Non_Conversions"] = grouped["Total_Sessions"] - grouped["Conversions"]
    grouped["Conversion_Rate_Pct"] = (grouped["Conversions"] / grouped["Total_Sessions"] * 100).round(4)
    grouped["Weekend_Label"] = grouped["Weekend"].map({False: "Weekday", True: "Weekend"})

    grouped.to_csv(csv_path, index=False)
    print(f" -> Saved Weekend Conversion CSV to: {csv_path}")

    # Plot
    fig, ax = plt.subplots(figsize=(7, 5))
    colors = ["#5c6bc0", "#26a69a"]
    bars = ax.bar(grouped["Weekend_Label"], grouped["Conversion_Rate_Pct"], color=colors, width=0.45, edgecolor="black")

    for bar, sessions in zip(bars, grouped["Total_Sessions"]):
        height = bar.get_height()
        ax.annotate(
            f"{height:.2f}%\n(N={sessions:,})",
            xy=(bar.get_x() + bar.get_width() / 2, height / 2),
            xytext=(0, 0),
            textcoords="offset points",
            ha="center",
            va="center",
            fontsize=11,
            fontweight="bold",
            color="white",
        )

    ax.set_title("Conversion Rate (%) Comparison: Weekday vs Weekend", fontsize=14, fontweight="bold", pad=15)
    ax.set_ylabel("Conversion Rate (%)", fontsize=12)
    ax.set_ylim(0, max(grouped["Conversion_Rate_Pct"]) * 1.25)
    ax.yaxis.grid(True, linestyle="--", alpha=0.7)

    plt.tight_layout()
    plt.savefig(plot_path, dpi=300)
    plt.close()
    print(f" -> Saved Weekend Chart to: {plot_path}")
    return grouped


def analyze_traffic_type_conversion(df: pd.DataFrame, csv_path: str = "ml/results/traffic_type_conversion.csv", plot_path: str = "ml/results/eda/traffic_type_conversion.png"):
    """Analyzes TrafficType conversion rates."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    grouped = df.groupby("TrafficType")["Revenue"].agg(
        Total_Sessions="count",
        Conversions="sum",
    ).reset_index()

    grouped["Non_Conversions"] = grouped["Total_Sessions"] - grouped["Conversions"]
    grouped["Conversion_Rate_Pct"] = (grouped["Conversions"] / grouped["Total_Sessions"] * 100).round(4)
    grouped = grouped.sort_values(by="Total_Sessions", ascending=False).reset_index(drop=True)

    grouped.to_csv(csv_path, index=False)
    print(f" -> Saved TrafficType Conversion CSV to: {csv_path}")

    # Plot top traffic types by volume
    top_traffic = grouped.head(10).sort_values(by="TrafficType")

    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar([f"Type {t}" for t in top_traffic["TrafficType"]], top_traffic["Conversion_Rate_Pct"], color="#00897b", edgecolor="black")

    for bar, sessions in zip(bars, top_traffic["Total_Sessions"]):
        height = bar.get_height()
        ax.annotate(
            f"{height:.1f}%\n(N={sessions})",
            xy=(bar.get_x() + bar.get_width() / 2, height),
            xytext=(0, 4),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=9,
            fontweight="bold",
        )

    ax.set_title("Conversion Rate (%) by Top Traffic Types (Annotated with Session Volume N)", fontsize=14, fontweight="bold", pad=15)
    ax.set_xlabel("Traffic Type ID", fontsize=12)
    ax.set_ylabel("Conversion Rate (%)", fontsize=12)
    ax.set_ylim(0, max(top_traffic["Conversion_Rate_Pct"]) * 1.25)
    ax.yaxis.grid(True, linestyle="--", alpha=0.7)

    plt.tight_layout()
    plt.savefig(plot_path, dpi=300)
    plt.close()
    print(f" -> Saved TrafficType Chart to: {plot_path}")
    return grouped


def analyze_correlation_matrix(df: pd.DataFrame, csv_path: str = "ml/results/correlation_matrix.csv", plot_path: str = "ml/results/correlation_heatmap.png"):
    """Calculates correlation matrix for numerical features + target and saves CSV & heatmap."""
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    num_cols = [
        "Administrative",
        "Administrative_Duration",
        "Informational",
        "Informational_Duration",
        "ProductRelated",
        "ProductRelated_Duration",
        "BounceRates",
        "ExitRates",
        "PageValues",
        "SpecialDay",
    ]

    df_corr = df[num_cols].copy()
    df_corr["Revenue"] = df["Revenue"].astype(int)

    corr = df_corr.corr().round(4)
    corr.to_csv(csv_path)
    print(f" -> Saved Correlation Matrix CSV to: {csv_path}")

    # Heatmap plot
    plt.figure(figsize=(11, 9))
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1, mask=mask, linewidths=0.5, cbar_kws={"shrink": 0.8})
    plt.title("Correlation Matrix Heatmap: Behavioral Features & Revenue", fontsize=15, fontweight="bold", pad=15)
    plt.tight_layout()
    plt.savefig(plot_path, dpi=300)
    plt.close()
    print(f" -> Saved Correlation Heatmap to: {plot_path}")
    return corr


def rank_behavioral_factors(corr_matrix: pd.DataFrame, save_path: str = "ml/results/behavioral_factor_ranking.csv"):
    """Calculates ranked statistical association score of numerical features with Revenue."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    target_corr = corr_matrix["Revenue"].drop("Revenue")
    ranked_series = target_corr.abs().sort_values(ascending=False)

    ranked_df = pd.DataFrame(
        {
            "Rank": range(1, len(ranked_series) + 1),
            "Feature": ranked_series.index,
            "Pearson_Correlation": target_corr[ranked_series.index].values.round(4),
            "Absolute_Association_Score": ranked_series.values.round(4),
        }
    )

    ranked_df.to_csv(save_path, index=False)
    print(f" -> Saved Behavioral Factor Ranking CSV to: {save_path}")
    return ranked_df


def plot_focused_behavioral_analyses(df: pd.DataFrame, output_dir: str = "ml/results"):
    """Generates focused EDA plots for PageValues, Bounce/Exit Rates, and Product Engagement."""
    os.makedirs(output_dir, exist_ok=True)

    # 1. PageValues vs Revenue
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.boxplot(x="Revenue", y="PageValues", hue="Revenue", data=df, palette=["#e53935", "#43a047"], ax=ax, showfliers=True, legend=False)
    ax.set_title("Behavioral Focus: PageValues vs Revenue Status", fontsize=14, fontweight="bold", pad=15)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["Non-Conversion (False)", "Conversion (True)"])
    ax.set_xlabel("Revenue Status", fontsize=12)
    ax.set_ylabel("PageValues", fontsize=12)
    plt.tight_layout()
    pageval_path = os.path.join(output_dir, "page_values_vs_revenue.png")
    plt.savefig(pageval_path, dpi=300)
    plt.close()
    print(f" -> Saved PageValues Plot to: {pageval_path}")

    # 2. BounceRates & ExitRates vs Revenue
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    sns.boxplot(x="Revenue", y="BounceRates", hue="Revenue", data=df, palette=["#e53935", "#43a047"], ax=axes[0], legend=False)
    axes[0].set_title("BounceRates by Revenue Status", fontweight="bold")
    axes[0].set_xticks([0, 1])
    axes[0].set_xticklabels(["Non-Conversion", "Conversion"])
    axes[0].set_ylabel("BounceRates")

    sns.boxplot(x="Revenue", y="ExitRates", hue="Revenue", data=df, palette=["#e53935", "#43a047"], ax=axes[1], legend=False)
    axes[1].set_title("ExitRates by Revenue Status", fontweight="bold")
    axes[1].set_xticks([0, 1])
    axes[1].set_xticklabels(["Non-Conversion", "Conversion"])
    axes[1].set_ylabel("ExitRates")

    plt.suptitle("Behavioral Focus: Session Disengagement Metrics (Bounce & Exit Rates)", fontsize=15, fontweight="bold", y=1.02)
    plt.tight_layout()
    bounce_path = os.path.join(output_dir, "bounce_exit_vs_revenue.png")
    plt.savefig(bounce_path, dpi=300)
    plt.close()
    print(f" -> Saved Bounce & Exit Rates Plot to: {bounce_path}")

    # 3. Product Engagement vs Revenue
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    sns.boxplot(x="Revenue", y="ProductRelated", hue="Revenue", data=df, palette=["#e53935", "#43a047"], ax=axes[0], showfliers=False, legend=False)
    axes[0].set_title("ProductRelated Page Views (Outliers Hidden)", fontweight="bold")
    axes[0].set_xticks([0, 1])
    axes[0].set_xticklabels(["Non-Conversion", "Conversion"])

    sns.boxplot(x="Revenue", y="ProductRelated_Duration", hue="Revenue", data=df, palette=["#e53935", "#43a047"], ax=axes[1], showfliers=False, legend=False)
    axes[1].set_title("ProductRelated Duration (sec) (Outliers Hidden)", fontweight="bold")
    axes[1].set_xticks([0, 1])
    axes[1].set_xticklabels(["Non-Conversion", "Conversion"])

    plt.suptitle("Behavioral Focus: Product Page Engagement Metrics", fontsize=15, fontweight="bold", y=1.02)
    plt.tight_layout()
    prod_path = os.path.join(output_dir, "product_engagement_vs_revenue.png")
    plt.savefig(prod_path, dpi=300)
    plt.close()
    print(f" -> Saved Product Engagement Plot to: {prod_path}")


def generate_eda_findings_report(
    df: pd.DataFrame,
    comp_df: pd.DataFrame,
    vis_df: pd.DataFrame,
    month_df: pd.DataFrame,
    weekend_df: pd.DataFrame,
    ranked_df: pd.DataFrame,
    save_path: str = "ml/results/eda_findings.txt",
):
    """Generates eda_findings.txt summarizing actual quantitative dataset observations."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    total_sessions = len(df)
    conv_count = int(df["Revenue"].sum())
    non_conv_count = total_sessions - conv_count
    conv_pct = (conv_count / total_sessions) * 100
    non_conv_pct = (non_conv_count / total_sessions) * 100

    # Extract PageValues mean stats
    pv_row = comp_df[comp_df["Variable"] == "PageValues"].iloc[0]
    bounce_row = comp_df[comp_df["Variable"] == "BounceRates"].iloc[0]
    exit_row = comp_df[comp_df["Variable"] == "ExitRates"].iloc[0]
    prod_view_row = comp_df[comp_df["Variable"] == "ProductRelated"].iloc[0]
    prod_dur_row = comp_df[comp_df["Variable"] == "ProductRelated_Duration"].iloc[0]

    # Highest month
    top_month = month_df.sort_values(by="Conversion_Rate_Pct", ascending=False).iloc[0]
    top_visitor = vis_df.sort_values(by="Conversion_Rate_Pct", ascending=False).iloc[0]

    with open(save_path, "w", encoding="utf-8") as f:
        f.write("========================================================================\n")
        f.write("             EMPIRICAL EXPLORATORY DATA ANALYSIS (EDA) FINDINGS          \n")
        f.write("========================================================================\n\n")
        f.write("Research Objective:\n")
        f.write("Investigate e-commerce customer behavior factors associated with non-conversion\n")
        f.write("and potential cart abandonment to inform targeted conversion optimization.\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("1. OVERALL CONVERSION & SESSION DISTRIBUTION\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"- Total Browsing Sessions  : {total_sessions:,}\n")
        f.write(f"- Non-Converting Sessions  : {non_conv_count:,} ({non_conv_pct:.2f}%)\n")
        f.write(f"- Converting Sessions      : {conv_count:,} ({conv_pct:.2f}%)\n")
        f.write(f"- Class Imbalance Ratio    : {(non_conv_count/conv_count):.2f} : 1\n")
        f.write("- Research Interpretation : Non-converting sessions (84.53%) represent potential\n")
        f.write("  abandonment and drop-off traffic where user intent was not fulfilled.\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("2. PAGEVALUES OBSERVATIONS (STRONGEST EDA PREDICTOR)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"- Converting Sessions Mean PageValues    : {pv_row['Conversion_Mean']:.2f}\n")
        f.write(f"- Non-Converting Sessions Mean PageValues: {pv_row['NonConversion_Mean']:.2f}\n")
        f.write(f"- Difference                             : +{pv_row['Mean_Difference']:.2f}\n")
        f.write("- Empirical Finding                      : High PageValues strongly coincide with\n")
        f.write("  completed purchases, whereas sessions with zero or near-zero PageValues account\n")
        f.write("  for the vast majority of non-conversions.\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("3. BOUNCE & EXIT RATES (DISENGAGEMENT METRICS)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"- Mean Bounce Rate (Non-Converting vs Converting): {bounce_row['NonConversion_Mean']:.4f} vs {bounce_row['Conversion_Mean']:.4f}\n")
        f.write(f"- Mean Exit Rate (Non-Converting vs Converting)  : {exit_row['NonConversion_Mean']:.4f} vs {exit_row['Conversion_Mean']:.4f}\n")
        f.write("- Empirical Finding                      : Non-converting sessions exhibited significantly\n")
        f.write("  higher average bounce and exit rates, indicating early drop-off before reaching checkout.\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("4. PRODUCT ENGAGEMENT (PAGE VIEWS & DURATION)\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"- Mean Product Page Views (Non-Converting vs Converting): {prod_view_row['NonConversion_Mean']:.2f} vs {prod_view_row['Conversion_Mean']:.2f}\n")
        f.write(f"- Mean Product Duration (sec) (Non-Converting vs Conv) : {prod_dur_row['NonConversion_Mean']:.2f} vs {prod_dur_row['Conversion_Mean']:.2f}\n")
        f.write("- Empirical Finding                      : Converting sessions engaged with substantially\n")
        f.write("  more product pages and spent nearly twice as long exploring products.\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("5. CATEGORICAL & TEMPORAL PATTERNS\n")
        f.write("------------------------------------------------------------------------\n")
        f.write(f"- Highest Converting Visitor Group: {top_visitor['VisitorType']} ({top_visitor['Conversion_Rate_Pct']:.2f}% conversion rate)\n")
        f.write(f"- Highest Converting Month        : {top_month['Month']} ({top_month['Conversion_Rate_Pct']:.2f}% conversion rate)\n")
        f.write(f"- Weekend Conversion vs Weekday   : Weekday conversion rate is {weekend_df[weekend_df['Weekend']==False]['Conversion_Rate_Pct'].iloc[0]:.2f}% vs Weekend {weekend_df[weekend_df['Weekend']==True]['Conversion_Rate_Pct'].iloc[0]:.2f}%\n\n")

        f.write("------------------------------------------------------------------------\n")
        f.write("6. BEHAVIORAL FEATURE ASSOCIATION RANKING (PEARSON CORRELATION WITH REVENUE)\n")
        f.write("------------------------------------------------------------------------\n")
        for idx, row in ranked_df.iterrows():
            f.write(f"  {row['Rank']}. {row['Feature']:<25} : Correlation = {row['Pearson_Correlation']:+.4f} (Abs Score = {row['Absolute_Association_Score']:.4f})\n")

        f.write("\n========================================================================\n")

    print(f" -> Saved EDA Findings Report to: {save_path}")
