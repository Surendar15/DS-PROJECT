import React, { useState } from "react";
import {
  Database,
  Cpu,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  Layers,
  Table,
  Activity,
  TrendingUp,
  PieChart,
  Maximize2,
  X,
  Search,
  BookOpen,
  Award,
  Filter,
  FileText
} from "lucide-react";

import {
  DATASET_OVERVIEW,
  MODEL_METRICS,
  CONFUSION_MATRIX_DATA,
  TOP_FEATURE_IMPORTANCE,
  RESEARCH_TABLE_1,
  RESEARCH_TABLE_2,
  RESEARCH_TABLE_3,
  RESEARCH_TABLE_4,
  RESEARCH_TABLE_5,
  RESEARCH_TABLE_6,
  RESEARCH_TABLE_7,
} from "../data/researchData";

export default function ResearchDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeTableTab, setActiveTableTab] = useState("table1");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (src, title, caption) => {
    setLightboxImage({ src, title, caption });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="page-container research-dashboard-page">
      {/* 1. Ultra-Level Academic Research Header */}
      <header className="research-hero-banner mb-8">
        <div className="research-hero-badge">
          <BookOpen size={15} /> Academic Research & Model Analytics Suite
        </div>
        <h1 className="research-hero-title">
          An Empirical Investigation Into E-Commerce Cart Abandonment Factors via Exploratory Data Analysis
        </h1>
        <p className="research-hero-desc">
          Rigorous statistical exploration of 12,330 online shopping sessions and Random Forest-based purchase-intention prediction on the Online Shoppers Purchasing Intention Dataset.
        </p>

        {/* Paper & Model Meta Chips */}
        <div className="research-meta-grid mt-6">
          <div className="meta-chip">
            <Database size={14} className="text-sky-400" />
            <span>Dataset: <strong>UCI Online Shoppers (12,330 Sessions)</strong></span>
          </div>
          <div className="meta-chip">
            <Cpu size={14} className="text-purple-400" />
            <span>Model: <strong>Random Forest (n_estimators=200, balanced)</strong></span>
          </div>
          <div className="meta-chip accent">
            <Award size={14} className="text-emerald-400" />
            <span>ROC-AUC: <strong>0.9171</strong> | Accuracy: <strong>89.13%</strong></span>
          </div>
        </div>
      </header>

      {/* Offline vs Live Note Banner */}
      <div className="research-banner-note mb-8">
        <Activity size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sky-300 text-sm mb-1">
            Offline Experimental Ground-Truth vs Live Machine Learning Engine
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            This analytical dashboard presents official offline experimental results derived from 80/20 train-test evaluations. The live e-commerce store leverages the serialized <code>full_pipeline.pkl</code> model for real-time customer intent classification.
          </p>
        </div>
      </div>

      {/* Sticky Navigation Tabs Bar */}
      <nav className="research-nav-tabs mb-8">
        <button
          className={`res-nav-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Database size={16} /> Dataset Structure
        </button>
        <button
          className={`res-nav-btn ${activeTab === "model" ? "active" : ""}`}
          onClick={() => setActiveTab("model")}
        >
          <Cpu size={16} /> Model Performance & Matrix
        </button>
        <button
          className={`res-nav-btn ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          <BarChart2 size={16} /> Feature Importance
        </button>
        <button
          className={`res-nav-btn ${activeTab === "eda" ? "active" : ""}`}
          onClick={() => setActiveTab("eda")}
        >
          <PieChart size={16} /> EDA Charts Gallery
        </button>
        <button
          className={`res-nav-btn ${activeTab === "tables" ? "active" : ""}`}
          onClick={() => setActiveTab("tables")}
        >
          <Table size={16} /> Experimental Tables (1–7)
        </button>
      </nav>

      {/* TAB 1: DATASET OVERVIEW & STRUCTURE */}
      {(activeTab === "overview" || activeTab === "all") && (
        <section className="research-section mb-12">
          <div className="section-title-wrapper mb-4">
            <Database size={22} className="text-sky-400" />
            <h2>Dataset Structure & Session Demographics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="res-stat-card">
              <span className="stat-card-label">Total Sessions</span>
              <div className="stat-card-value">{DATASET_OVERVIEW.totalRows.toLocaleString()}</div>
              <span className="stat-card-sub">Full Dataset</span>
            </div>
            <div className="res-stat-card">
              <span className="stat-card-label">Predictor Features</span>
              <div className="stat-card-value text-sky-400">{DATASET_OVERVIEW.totalFeatures}</div>
              <span className="stat-card-sub">17 ML Features + Target</span>
            </div>
            <div className="res-stat-card">
              <span className="stat-card-label">Conversions</span>
              <div className="stat-card-value text-emerald-400">{DATASET_OVERVIEW.conversionCount.toLocaleString()}</div>
              <span className="stat-card-sub text-emerald-400 font-semibold">{DATASET_OVERVIEW.conversionRate}</span>
            </div>
            <div className="res-stat-card">
              <span className="stat-card-label">Non-Conversions</span>
              <div className="stat-card-value text-amber-400">{DATASET_OVERVIEW.nonConversionCount.toLocaleString()}</div>
              <span className="stat-card-sub text-amber-400 font-semibold">{DATASET_OVERVIEW.nonConversionRate}</span>
            </div>
            <div className="res-stat-card">
              <span className="stat-card-label">Train Split (80%)</span>
              <div className="stat-card-value">{MODEL_METRICS.trainSamples.toLocaleString()}</div>
              <span className="stat-card-sub">Sessions</span>
            </div>
            <div className="res-stat-card">
              <span className="stat-card-label">Test Split (20%)</span>
              <div className="stat-card-value">{MODEL_METRICS.testSamples.toLocaleString()}</div>
              <span className="stat-card-sub">Holdout Sessions</span>
            </div>
          </div>

          {/* Class Imbalance & Correlation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="res-card-glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="card-title flex items-center gap-2">
                  <PieChart size={18} className="text-sky-400" /> Target Class Imbalance (Revenue)
                </h3>
                <button
                  className="btn-zoom"
                  onClick={() =>
                    openLightbox(
                      "/results/revenue_distribution.png",
                      "Target Class Distribution",
                      "Demonstrates heavy class imbalance: 84.53% Non-Conversions vs 15.47% Conversions."
                    )
                  }
                >
                  <Maximize2 size={14} /> Zoom
                </button>
              </div>
              <div className="res-image-container cursor-pointer" onClick={() => openLightbox("/results/revenue_distribution.png", "Target Class Distribution")}>
                <img src="/results/revenue_distribution.png" alt="Revenue Distribution" />
              </div>
              <p className="res-card-caption mt-3">
                The target variable <code>Revenue</code> exhibits significant class imbalance: 10,422 sessions (84.53%) did not result in a purchase, whereas 1,908 sessions (15.47%) converted. Balanced class weighting was applied to mitigate minority class bias.
              </p>
            </div>

            <div className="res-card-glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="card-title flex items-center gap-2">
                  <TrendingUp size={18} className="text-sky-400" /> Correlation Matrix Heatmap
                </h3>
                <button
                  className="btn-zoom"
                  onClick={() =>
                    openLightbox(
                      "/results/correlation_heatmap.png",
                      "Feature Correlation Matrix Heatmap",
                      "Displays linear correlation coefficients across all 17 features and target Revenue."
                    )
                  }
                >
                  <Maximize2 size={14} /> Zoom
                </button>
              </div>
              <div className="res-image-container cursor-pointer" onClick={() => openLightbox("/results/correlation_heatmap.png", "Correlation Heatmap")}>
                <img src="/results/correlation_heatmap.png" alt="Correlation Heatmap" />
              </div>
              <div className="res-card-caption mt-3">
                <span className="text-sky-400 font-bold">Highest Positive Correlation:</span> <code>PageValues</code> (r = +0.4926, p &lt; 0.001).<br />
                <span className="text-amber-400 font-bold">Highest Negative Correlation:</span> <code>ExitRates</code> (r = -0.2071, p &lt; 0.001).
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: MODEL PERFORMANCE & CONFUSION MATRIX */}
      {(activeTab === "model" || activeTab === "all") && (
        <section className="research-section mb-12">
          <div className="section-title-wrapper mb-4">
            <Cpu size={22} className="text-sky-400" />
            <h2>Random Forest Classifier Model Evaluation</h2>
          </div>

          {/* Model Metrics 6 Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="res-metric-badge primary">
              <span className="badge-label">ROC-AUC</span>
              <span className="badge-value">{MODEL_METRICS.rocAuc}</span>
              <span className="badge-desc">Discriminative Power</span>
            </div>
            <div className="res-metric-badge success">
              <span className="badge-label">Accuracy</span>
              <span className="badge-value">{MODEL_METRICS.accuracy}</span>
              <span className="badge-desc">Overall Correctness</span>
            </div>
            <div className="res-metric-badge text-sky-200">
              <span className="badge-label">Precision</span>
              <span className="badge-value">{MODEL_METRICS.precision}</span>
              <span className="badge-desc">Positive Predictive</span>
            </div>
            <div className="res-metric-badge warning">
              <span className="badge-label">Recall</span>
              <span className="badge-value">{MODEL_METRICS.recall}</span>
              <span className="badge-desc">Conversion Sensitivity</span>
            </div>
            <div className="res-metric-badge text-purple-300">
              <span className="badge-label">F1-Score</span>
              <span className="badge-value">{MODEL_METRICS.f1Score}</span>
              <span className="badge-desc">Harmonic Mean</span>
            </div>
            <div className="res-metric-badge accent">
              <span className="badge-label">PR-AUC</span>
              <span className="badge-value">{MODEL_METRICS.avgPrecision}</span>
              <span className="badge-desc">Precision-Recall Curve</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2x2 Interactive Confusion Matrix */}
            <div className="res-card-glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="card-title">Confusion Matrix (2,466 Holdout Test Samples)</h3>
                <button className="btn-zoom" onClick={() => openLightbox("/results/confusion_matrix.png", "Confusion Matrix Plot")}>
                  <Maximize2 size={14} /> Zoom
                </button>
              </div>

              <div className="confusion-matrix-grid mb-4">
                <div className="cm-cell true-negative">
                  <span className="cm-tag">TRUE NEGATIVE (TN)</span>
                  <span className="cm-num">{CONFUSION_MATRIX_DATA.TN}</span>
                  <span className="cm-sub">82.24% • Non-Conversion Correct</span>
                </div>
                <div className="cm-cell false-positive">
                  <span className="cm-tag">FALSE POSITIVE (FP)</span>
                  <span className="cm-num">{CONFUSION_MATRIX_DATA.FP}</span>
                  <span className="cm-sub">2.27% • False Alarm</span>
                </div>
                <div className="cm-cell false-negative">
                  <span className="cm-tag">FALSE NEGATIVE (FN)</span>
                  <span className="cm-num">{CONFUSION_MATRIX_DATA.FN}</span>
                  <span className="cm-sub">8.60% • Missed Conversion</span>
                </div>
                <div className="cm-cell true-positive">
                  <span className="cm-tag">TRUE POSITIVE (TP)</span>
                  <span className="cm-num">{CONFUSION_MATRIX_DATA.TP}</span>
                  <span className="cm-sub">6.89% • Conversion Correct</span>
                </div>
              </div>

              <div className="res-image-container cursor-pointer" onClick={() => openLightbox("/results/confusion_matrix.png", "Confusion Matrix Heatmap")}>
                <img src="/results/confusion_matrix.png" alt="Confusion Matrix" />
              </div>
            </div>

            {/* ROC Curve Box */}
            <div className="res-card-glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="card-title">ROC Curve (AUC = 0.9171)</h3>
                <button className="btn-zoom" onClick={() => openLightbox("/results/roc_curve.png", "ROC Curve Plot")}>
                  <Maximize2 size={14} /> Zoom
                </button>
              </div>

              <div className="res-image-container mb-3 cursor-pointer" onClick={() => openLightbox("/results/roc_curve.png", "ROC Curve")}>
                <img src="/results/roc_curve.png" alt="ROC Curve" />
              </div>
              <p className="res-card-caption">
                The ROC Curve illustrates outstanding discriminative ability across classification thresholds. An area under the curve of <strong>0.9171</strong> demonstrates strong separation between converting and non-converting session patterns.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: FEATURE IMPORTANCE */}
      {(activeTab === "features" || activeTab === "all") && (
        <section className="research-section mb-12">
          <div className="section-title-wrapper mb-4">
            <BarChart2 size={22} className="text-sky-400" />
            <h2>Random Forest Feature Importance (Top Predictors)</h2>
          </div>

          <div className="res-card-glass">
            <p className="text-xs text-slate-300 mb-6">
              Feature importances computed using mean decrease in impurity (Gini importance) across 200 decision trees in the trained Random Forest Classifier.
            </p>

            <div className="space-y-3">
              {TOP_FEATURE_IMPORTANCE.map((item) => (
                <div key={item.feature} className="feature-rank-row">
                  <span className="rank-num">#{item.rank}</span>
                  <span className="feature-name">{item.feature}</span>
                  <div className="progress-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(item.importance / 0.35) * 100}%` }}
                    />
                  </div>
                  <span className="importance-percent font-mono">{(item.importance * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: EDA CHARTS GALLERY */}
      {(activeTab === "eda" || activeTab === "all") && (
        <section className="research-section mb-12">
          <div className="section-title-wrapper mb-4">
            <PieChart size={22} className="text-sky-400" />
            <h2>Exploratory Data Analysis (EDA) Visualizations Gallery</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/eda/visitor_type_conversion.png", "Visitor Type Conversion Rate")}>
              <div className="eda-card-img">
                <img src="/results/eda/visitor_type_conversion.png" alt="Visitor Type" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Visitor Type</h4>
                <p>New Visitors convert at 24.91% vs 13.93% for Returning Visitors.</p>
              </div>
            </div>

            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/eda/month_conversion.png", "Monthly Conversion Trends")}>
              <div className="eda-card-img">
                <img src="/results/eda/month_conversion.png" alt="Month Conversion" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Monthly Trends</h4>
                <p>November peaks with 25.35% conversion rate (760 conversions).</p>
              </div>
            </div>

            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/eda/weekend_conversion.png", "Weekend Conversion Effect")}>
              <div className="eda-card-img">
                <img src="/results/eda/weekend_conversion.png" alt="Weekend Conversion" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Weekend Effect</h4>
                <p>Weekend sessions achieve higher conversion rates (17.40% vs 14.89%).</p>
              </div>
            </div>

            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/eda/traffic_type_conversion.png", "Traffic Source Conversion")}>
              <div className="eda-card-img">
                <img src="/results/eda/traffic_type_conversion.png" alt="Traffic Type" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Traffic Channels</h4>
                <p>Traffic Types 2, 7, and 16 show elevated conversion propensities.</p>
              </div>
            </div>
          </div>

          {/* Focused Behavioral Figures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/page_values_vs_revenue.png", "PageValues Distribution by Conversion Status")}>
              <div className="eda-card-img">
                <img src="/results/page_values_vs_revenue.png" alt="Page Values vs Revenue" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>PageValues vs Revenue</h4>
                <p>Mean PageValue is 27.26 for conversions vs 1.98 for non-conversions.</p>
              </div>
            </div>

            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/bounce_exit_vs_revenue.png", "Bounce and Exit Rates vs Revenue")}>
              <div className="eda-card-img">
                <img src="/results/bounce_exit_vs_revenue.png" alt="Bounce and Exit Rates" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Bounce & Exit Rates</h4>
                <p>ExitRates average 0.020 for conversions vs 0.047 for non-conversions.</p>
              </div>
            </div>

            <div className="eda-gallery-card cursor-pointer" onClick={() => openLightbox("/results/product_engagement_vs_revenue.png", "Product Engagement Duration")}>
              <div className="eda-card-img">
                <img src="/results/product_engagement_vs_revenue.png" alt="Product Engagement" />
                <div className="eda-hover-overlay"><Maximize2 size={20} /></div>
              </div>
              <div className="eda-card-body">
                <h4>Product Engagement</h4>
                <p>ProductRelated duration averages 1,876s for conversions vs 1,070s.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: EXPERIMENTAL RESEARCH TABLES (1–7) */}
      {(activeTab === "tables" || activeTab === "all") && (
        <section className="research-section mb-12">
          <div className="section-title-wrapper flex-between mb-4">
            <div className="flex items-center gap-2">
              <Table size={22} className="text-sky-400" />
              <h2>Experimental Research Data Tables (1–7)</h2>
            </div>

            {/* Table Search Input */}
            <div className="table-search-box">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search table rows..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
              />
              {tableSearchQuery && (
                <button onClick={() => setTableSearchQuery("")}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="res-card-glass">
            {/* Table Selector Sub-Tabs */}
            <div className="table-tabs-bar mb-4">
              {[
                { id: "table1", label: "Table 1: Specs" },
                { id: "table2", label: "Table 2: Class Split" },
                { id: "table3", label: "Table 3: Behavioral" },
                { id: "table4", label: "Table 4: Categorical" },
                { id: "table5", label: "Table 5: Model Perf" },
                { id: "table6", label: "Table 6: Confusion Matrix" },
                { id: "table7", label: "Table 7: Importance" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`table-tab-btn ${activeTableTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTableTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Render Selected Table */}
            <div className="research-table-container">
              {activeTableTab === "table1" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Dataset Parameter</th>
                      <th>Experimental Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_1.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.parameter.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        String(r.value).toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-slate-200">{row.parameter}</td>
                        <td className="font-semibold text-sky-400 font-mono">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table2" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Class Label</th>
                      <th>Session Count (N)</th>
                      <th>Percentage Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_2.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.classLabel.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-slate-200">{row.classLabel}</td>
                        <td className="font-mono">{row.count.toLocaleString()}</td>
                        <td className="font-semibold text-sky-400 font-mono">{row.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table3" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Feature Name</th>
                      <th>Non-Conversion Mean</th>
                      <th>Conversion Mean</th>
                      <th>Statistical Sig (p)</th>
                      <th>Correlation (r)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_3.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.feature.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-100">{row.feature}</td>
                        <td className="text-slate-400 font-mono">{row.nonConversionMean}</td>
                        <td className="text-emerald-400 font-semibold font-mono">{row.conversionMean}</td>
                        <td className="text-slate-400 font-mono">{row.pValue}</td>
                        <td className="text-sky-300 font-semibold font-mono">{row.correlation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table4" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Category Group</th>
                      <th>Subgroup</th>
                      <th>Total Sessions</th>
                      <th>Conversions</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_4.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.categoryGroup.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        r.subgroup.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="text-slate-400">{row.categoryGroup}</td>
                        <td className="font-semibold text-slate-200">{row.subgroup}</td>
                        <td className="font-mono">{row.total.toLocaleString()}</td>
                        <td className="text-emerald-400 font-semibold font-mono">{row.conversionCount}</td>
                        <td className="text-sky-400 font-semibold font-mono">{row.conversionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table5" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Model Evaluation Metric</th>
                      <th>Test-Set Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_5.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.metricName.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-slate-200">{row.metricName}</td>
                        <td className="text-emerald-400 font-bold font-mono text-base">{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table6" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Actual Target Class</th>
                      <th>Predicted Non-Conversion (0)</th>
                      <th>Predicted Conversion (1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_6.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.actualClass.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-slate-200">{row.actualClass}</td>
                        <td className="text-emerald-400 font-semibold font-mono">{row.predictedNonConv}</td>
                        <td className="text-amber-400 font-semibold font-mono">{row.predictedConv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === "table7" && (
                <table className="research-table-styled">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Feature Name</th>
                      <th>Importance Weight</th>
                      <th>Percentage Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESEARCH_TABLE_7.filter(
                      (r) =>
                        !tableSearchQuery ||
                        r.feature.toLowerCase().includes(tableSearchQuery.toLowerCase())
                    ).map((row) => (
                      <tr key={row.rank}>
                        <td className="text-slate-400 font-mono">#{row.rank}</td>
                        <td className="font-semibold text-slate-100">{row.feature}</td>
                        <td className="text-sky-300 font-mono">{row.importance.toFixed(6)}</td>
                        <td className="text-emerald-400 font-semibold font-mono">{(row.importance * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. Empirical Findings & Limitations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="res-card-glass border-l-4 border-l-emerald-500">
          <h3 className="card-title flex items-center gap-2 mb-3 text-emerald-400">
            <CheckCircle size={18} /> Core Empirical Findings
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
            <li>The dataset contains 12,330 shopping sessions with a 15.47% conversion rate.</li>
            <li><code>PageValues</code> exhibits the strongest positive correlation with conversion (r = +0.4926).</li>
            <li><code>PageValues</code> is the top predictor in the Random Forest model (32.57% Gini importance).</li>
            <li><code>ExitRates</code> is the top disengagement predictor (r = -0.2071).</li>
            <li>The Random Forest achieved ROC-AUC = 0.9171 and Accuracy = 0.8913 on unseen test data.</li>
            <li>Recall = 0.4450 indicates that while precision is high (0.7522), some subtle conversion sessions remain hard to isolate.</li>
          </ul>
        </div>

        <div className="res-card-glass border-l-4 border-l-amber-500">
          <h3 className="card-title flex items-center gap-2 mb-3 text-amber-400">
            <AlertTriangle size={18} /> Methodological Constraints
          </h3>
          <ol className="space-y-2 text-xs text-slate-300 leading-relaxed list-decimal pl-4">
            <li>The dataset exhibits heavy class imbalance (84.53% non-conversion).</li>
            <li>Correlation and Random Forest feature importance reflect predictive association, not direct causality.</li>
            <li>The live website uses application-level proxy formulas for <code>PageValues</code>, <code>BounceRates</code>, and <code>ExitRates</code>.</li>
            <li>Environment features (Region, TrafficType, SpecialDay) use controlled demo defaults.</li>
            <li>Application decision thresholds (LOW, MEDIUM, HIGH) are business engagement rules.</li>
          </ol>
        </div>
      </section>

      {/* Lightbox Fullscreen Modal */}
      {lightboxImage && (
        <div className="chart-lightbox-overlay" onClick={closeLightbox}>
          <div className="chart-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="chart-lightbox-header">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-sky-400" /> {lightboxImage.title || "Research Figure Preview"}
              </h3>
              <button className="chart-lightbox-close" onClick={closeLightbox}>
                <X size={20} />
              </button>
            </div>
            <div className="chart-lightbox-body">
              <img src={lightboxImage.src} alt={lightboxImage.title} />
            </div>
            {lightboxImage.caption && (
              <div className="chart-lightbox-footer">
                <p>{lightboxImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
