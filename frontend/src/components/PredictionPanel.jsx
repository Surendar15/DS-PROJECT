import React, { useState } from "react";
import {
  TrendingUp, AlertCircle, CheckCircle, RefreshCw, Code, ChevronDown, ChevronUp,
  ArrowRight, Sparkles, History, Cpu, Layers, Activity, Calendar, Monitor,
  Grid, FileJson, Copy, Check
} from "lucide-react";
import { useSession } from "../context/SessionContext";
import { useCart } from "../context/CartContext";
import { buildMlFeatureVector, validateMlFeatureVector } from "../services/mlFeatureBuilder";
import { getEngagementStrategy } from "../services/engagementStrategy";
import { PRODUCTS } from "../data/products";

const FEATURE_GROUPS = [
  {
    title: "Page Activity & Durations",
    icon: Layers,
    color: "text-sky-400",
    features: [
      { key: "Administrative", label: "Admin Pages Viewed", type: "number" },
      { key: "Administrative_Duration", label: "Admin Time Spent", type: "sec" },
      { key: "Informational", label: "Info Pages Viewed", type: "number" },
      { key: "Informational_Duration", label: "Info Time Spent", type: "sec" },
      { key: "ProductRelated", label: "Product Pages Viewed", type: "number" },
      { key: "ProductRelated_Duration", label: "Product Time Spent", type: "sec" },
    ],
  },
  {
    title: "Engagement & Rates",
    icon: Activity,
    color: "text-emerald-400",
    features: [
      { key: "PageValues", label: "Cart & Page Value Score", type: "currency" },
      { key: "BounceRates", label: "Bounce Probability Rate", type: "rate" },
      { key: "ExitRates", label: "Exit Probability Rate", type: "rate" },
    ],
  },
  {
    title: "Temporal & Customer Profile",
    icon: Calendar,
    color: "text-purple-400",
    features: [
      { key: "Month", label: "Dataset Recorded Month", type: "string" },
      { key: "SpecialDay", label: "Special Day Closeness", type: "number" },
      { key: "Weekend", label: "Weekend Session Flag", type: "boolean" },
      { key: "VisitorType", label: "Visitor Classification", type: "string" },
    ],
  },
  {
    title: "Client Hardware & Acquisition",
    icon: Monitor,
    color: "text-amber-400",
    features: [
      { key: "OperatingSystems", label: "Operating System Code", type: "number" },
      { key: "Browser", label: "Browser Signature Code", type: "number" },
      { key: "Region", label: "Geographic Region Code", type: "number" },
      { key: "TrafficType", label: "Traffic Channel Code", type: "number" },
    ],
  },
];

export default function PredictionPanel({ onNavigate }) {
  const session = useSession();
  const { cartItems } = useCart();
  const [showDebug, setShowDebug] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inspectorMode, setInspectorMode] = useState("styled"); // "styled" | "json"
  const [copied, setCopied] = useState(false);

  const { predictionResult, predictionHistory, isPredicting, predictionError, fetchPrediction } = session;

  // Build live 17-feature vector for preview & API
  const liveFeatures = buildMlFeatureVector(session, cartItems);
  const validation = validateMlFeatureVector(liveFeatures);

  // Compute application strategy when prediction result exists
  const strategy = predictionResult
    ? getEngagementStrategy(predictionResult.conversion_probability_percent)
    : null;

  const handleEvaluate = () => {
    fetchPrediction(cartItems);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(liveFeatures, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFeatureValue = (key, value, type) => {
    if (value === undefined || value === null) return { text: "N/A", styleClass: "" };

    if (type === "boolean") {
      return {
        text: value ? "TRUE (Weekend)" : "FALSE (Weekday)",
        styleClass: value ? "purple" : "",
      };
    }
    if (type === "currency") {
      return {
        text: `₹${Number(value).toFixed(2)}`,
        styleClass: "highlight",
      };
    }
    if (type === "rate") {
      return {
        text: Number(value).toFixed(4),
        styleClass: "rate",
      };
    }
    if (type === "sec") {
      return {
        text: `${Number(value).toFixed(1)}s`,
        styleClass: "",
      };
    }
    if (key === "VisitorType") {
      return {
        text: String(value),
        styleClass: value === "Returning_Visitor" ? "purple" : "emerald",
      };
    }
    if (typeof value === "number") {
      return {
        text: String(value),
        styleClass: "",
      };
    }
    return {
      text: String(value),
      styleClass: "",
    };
  };

  // Rule-based related products selection (LOW and MEDIUM intent)
  const relatedProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="prediction-panel-card">
      <div className="prediction-panel-header">
        <div className="prediction-title">
          <TrendingUp size={20} className="text-sky-400" />
          <span>Real-Time Purchase Intention ML Engine</span>
        </div>
        <div className="flex items-center gap-2">
          {predictionHistory && predictionHistory.length > 0 && (
            <button
              className="btn btn-xs btn-outline flex items-center gap-1"
              onClick={() => setShowHistory(!showHistory)}
              title="Toggle Session History"
            >
              <History size={14} />
              <span>History ({predictionHistory.length})</span>
            </button>
          )}
          <button
            className="btn btn-xs btn-outline flex items-center gap-1"
            onClick={() => setShowDebug(!showDebug)}
            title="Toggle Development Feature Inspector"
          >
            <Code size={14} />
            <span>{showDebug ? "Hide Features" : "Inspect Features"}</span>
            {showDebug ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            className="btn btn-sm btn-primary flex items-center gap-1"
            onClick={handleEvaluate}
            disabled={isPredicting}
          >
            <RefreshCw size={15} className={isPredicting ? "spin" : ""} />
            <span>{isPredicting ? "Predicting..." : "Predict Intent"}</span>
          </button>
        </div>
      </div>

      <div className="prediction-panel-body">
        {predictionError && (
          <div className="prediction-error-banner p-3 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2 mb-4">
            <AlertCircle size={16} />
            <span>{predictionError}</span>
          </div>
        )}

        {!predictionResult && !predictionError && (
          <div className="prediction-placeholder">
            <div className="pulsing-dot" />
            <p className="font-semibold text-slate-200">Real-Time ML Purchase Intention Engine Active</p>
            <span className="placeholder-subtext">
              Browse products, search, or add items to cart then click &quot;Predict Intent&quot; to compute live conversion probability.
            </span>
          </div>
        )}

        {predictionResult && strategy && (
          <div className="prediction-result-display">
            {/* Top Summary Row */}
            <div className="result-main-row">
              <div className="prediction-badge-wrapper">
                {predictionResult.prediction === 1 ? (
                  <span className="prediction-badge conversion">
                    <CheckCircle size={18} /> {predictionResult.label}
                  </span>
                ) : (
                  <span className="prediction-badge non-conversion">
                    <AlertCircle size={18} /> {predictionResult.label}
                  </span>
                )}

                <div className={`intent-band-badge ${strategy.colorClass}`}>
                  Intent Band: <strong>{strategy.intentTitle}</strong>
                </div>
              </div>

              <div className="probability-metric">
                <span className="prob-label">Conversion Probability</span>
                <span className="prob-value">
                  {predictionResult.conversion_probability_percent}%
                </span>
              </div>
            </div>

            {/* Probability Progress Bar */}
            <div className="probability-progress-bar">
              <div
                className={`progress-fill ${predictionResult.prediction === 1 ? "high" : "low"}`}
                style={{ width: `${Math.min(100, predictionResult.conversion_probability_percent)}%` }}
              />
            </div>

            {/* Recommended Action Strategy Box */}
            <div className={`recommendation-box ${strategy.colorClass}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sky-400 text-sm">
                  Recommended Action: {strategy.recommendedActionTitle}
                </span>
              </div>
              <p className="recommendation-msg mb-2">{strategy.message}</p>
              <div className="text-xs text-slate-400 italic mb-3">
                Merchant Advice: {strategy.merchantAdvice}
              </div>

              {onNavigate && (
                <button
                  className="btn btn-sm btn-primary mt-1"
                  onClick={() => {
                    if (strategy.buttonAction === "checkout") onNavigate("cart");
                    else onNavigate("products");
                  }}
                >
                  {strategy.buttonText} <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Rule-Based Product Suggestions for Low & Medium Intent */}
            {strategy.showRelatedProducts && relatedProducts && (
              <div className="related-products-mini-section pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 mb-2.5">
                  <Sparkles size={14} /> Recommended Products for Continued Discovery
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedProducts.map((prod) => (
                    <div key={prod.id} className="related-prod-card cursor-pointer" onClick={() => onNavigate && onNavigate("products")}>
                      <img src={prod.image} alt={prod.name} className="related-prod-thumb" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-200 truncate">{prod.name}</span>
                        <span className="text-xs font-mono font-bold text-sky-400 mt-0.5">₹{prod.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Intention Session Trend Line */}
            {predictionHistory && predictionHistory.length > 1 && (
              <div className="session-trend-bar pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="font-semibold text-slate-300">Session Intent Trend:</span>
                <span className="font-mono text-sky-300">
                  {predictionHistory.map((h) => `${h.probPercent}%`).join(" → ")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Prediction History Dropdown */}
        {showHistory && predictionHistory && predictionHistory.length > 0 && (
          <div className="mt-3 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
            <div className="font-semibold text-sky-400 mb-2 pb-1 border-b border-slate-800 flex justify-between items-center">
              <span>Session Prediction History ({predictionHistory.length} calls)</span>
              <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-slate-300">Close</button>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {predictionHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">{item.timestamp}</span>
                  <span className={item.prediction === 1 ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                    {item.label} ({item.probPercent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Development Debug 17 Feature Vector Inspector Panel */}
        {showDebug && (
          <div className="feature-inspector-container">
            <div className="feature-inspector-header">
              <div className="flex items-center gap-3">
                <div className="feature-inspector-title">
                  <Cpu size={18} className="text-sky-400" />
                  <span>17 ML Feature Vector Inspector</span>
                </div>
                <div className={`feature-schema-badge ${validation.isValid ? "" : "invalid"}`}>
                  <CheckCircle size={12} />
                  <span>{validation.isValid ? "Schema Valid (17/17 Features)" : "Schema Invalid"}</span>
                </div>
              </div>

              <div className="feature-inspector-controls">
                <button
                  className={`feature-view-btn ${inspectorMode === "styled" ? "active" : ""}`}
                  onClick={() => setInspectorMode("styled")}
                  title="Styled Grid View"
                >
                  <Grid size={13} />
                  <span>Styled Grid</span>
                </button>
                <button
                  className={`feature-view-btn ${inspectorMode === "json" ? "active" : ""}`}
                  onClick={() => setInspectorMode("json")}
                  title="Raw JSON View"
                >
                  <FileJson size={13} />
                  <span>Raw JSON</span>
                </button>
                <button
                  className="feature-view-btn"
                  onClick={handleCopyJson}
                  title="Copy JSON Payload"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy JSON"}</span>
                </button>
              </div>
            </div>

            {inspectorMode === "styled" ? (
              <div className="feature-groups-grid">
                {FEATURE_GROUPS.map((group, idx) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={idx} className="feature-group-card">
                      <div className={`feature-group-header ${group.color}`}>
                        <GroupIcon size={16} />
                        <span>{group.title}</span>
                      </div>
                      <div className="feature-items-list">
                        {group.features.map((feat) => {
                          const rawVal = liveFeatures[feat.key];
                          const formatted = formatFeatureValue(feat.key, rawVal, feat.type);
                          return (
                            <div key={feat.key} className="feature-item-row">
                              <div className="feature-item-info">
                                <span className="feature-item-key">{feat.key}</span>
                                <span className="feature-item-label">{feat.label}</span>
                              </div>
                              <span className={`feature-value-badge ${formatted.styleClass}`}>
                                {formatted.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <pre className="feature-json-pre">{JSON.stringify(liveFeatures, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

