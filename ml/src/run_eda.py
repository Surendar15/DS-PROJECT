import os
import glob
from eda import (
    load_raw_dataset,
    generate_eda_summary,
    plot_revenue_distribution,
    plot_numerical_distributions,
    analyze_behavioral_comparison,
    analyze_visitor_type_conversion,
    analyze_month_conversion,
    analyze_weekend_conversion,
    analyze_traffic_type_conversion,
    analyze_correlation_matrix,
    rank_behavioral_factors,
    plot_focused_behavioral_analyses,
    generate_eda_findings_report,
)


def main():
    print("=" * 80)
    print("  STEP 3: EXPLORATORY DATA ANALYSIS (EDA) RUNNER")
    print("  Project: An Empirical Investigation Into E-Commerce Cart Abandonment Factors")
    print("=" * 80)

    # 1. Load Dataset
    print("\n[1/10] Loading raw interpretable dataset...")
    df = load_raw_dataset("dataset/online_shoppers_intention.csv")
    print(f" -> Loaded {len(df):,} rows x {df.shape[1]} columns.")

    # 2. Overview Summary
    print("\n[2/10] Generating dataset overview summary...")
    generate_eda_summary(df, save_path="ml/results/eda_summary.txt")

    # 3. Target Distribution
    print("\n[3/10] Plotting target variable distribution...")
    plot_revenue_distribution(df, save_path="ml/results/revenue_distribution.png")

    # 4. Numerical Feature Distributions
    print("\n[4/10] Plotting individual numerical feature distributions...")
    plot_numerical_distributions(df, output_dir="ml/results/eda")

    # 5. Grouped Behavioral Comparison
    print("\n[5/10] Computing grouped behavioral statistics (Revenue=True vs Revenue=False)...")
    comp_df = analyze_behavioral_comparison(df, save_path="ml/results/behavioral_comparison.csv")

    # 6. Categorical Conversion Analysis
    print("\n[6/10] Analyzing categorical conversion patterns...")
    vis_df = analyze_visitor_type_conversion(
        df,
        csv_path="ml/results/visitor_type_conversion.csv",
        plot_path="ml/results/eda/visitor_type_conversion.png",
    )
    month_df = analyze_month_conversion(
        df,
        csv_path="ml/results/month_conversion.csv",
        plot_path="ml/results/eda/month_conversion.png",
    )
    weekend_df = analyze_weekend_conversion(
        df,
        csv_path="ml/results/weekend_conversion.csv",
        plot_path="ml/results/eda/weekend_conversion.png",
    )
    traffic_df = analyze_traffic_type_conversion(
        df,
        csv_path="ml/results/traffic_type_conversion.csv",
        plot_path="ml/results/eda/traffic_type_conversion.png",
    )

    # 7. Correlation Analysis
    print("\n[7/10] Computing correlation matrix & heatmap...")
    corr_matrix = analyze_correlation_matrix(
        df,
        csv_path="ml/results/correlation_matrix.csv",
        plot_path="ml/results/correlation_heatmap.png",
    )

    # 8. Behavioral Factor Ranking
    print("\n[8/10] Computing behavioral association ranking...")
    ranked_df = rank_behavioral_factors(
        corr_matrix, save_path="ml/results/behavioral_factor_ranking.csv"
    )

    # 9. Focused Plots
    print("\n[9/10] Generating focused behavioral plots (PageValues, Bounce/Exit Rates, Product Engagement)...")
    plot_focused_behavioral_analyses(df, output_dir="ml/results")

    # 10. EDA Findings Report
    print("\n[10/10] Generating dynamic EDA findings summary report...")
    generate_eda_findings_report(
        df,
        comp_df,
        vis_df,
        month_df,
        weekend_df,
        ranked_df,
        save_path="ml/results/eda_findings.txt",
    )

    # Validation Counts
    all_csvs = glob.glob("ml/results/*.csv")
    all_pngs = glob.glob("ml/results/*.png") + glob.glob("ml/results/eda/*.png")

    total_sessions = len(df)
    conv_count = int(df["Revenue"].sum())
    non_conv_count = total_sessions - conv_count
    conv_pct = (conv_count / total_sessions) * 100
    non_conv_pct = (non_conv_count / total_sessions) * 100

    print("\n" + "=" * 80)
    print("  EDA EXECUTION VERIFICATION SUMMARY")
    print("=" * 80)
    print(f" -> Dataset Size               : {total_sessions:,} rows x {df.shape[1]} columns")
    print(f" -> Conversion Count (True)   : {conv_count:,} ({conv_pct:.2f}%)")
    print(f" -> Non-Conversion Count (False): {non_conv_count:,} ({non_conv_pct:.2f}%)")
    print(f" -> Top Behavioral Association : {ranked_df.iloc[0]['Feature']} (r = {ranked_df.iloc[0]['Pearson_Correlation']:+.4f})")
    print(f" -> Total Charts Generated     : {len(all_pngs)} PNG files")
    print(f" -> Total CSV Tables Generated : {len(all_csvs)} CSV files")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
