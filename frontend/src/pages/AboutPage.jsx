import React from "react";
import { Database, Cpu, BarChart2, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="page-container about-page">
      <div className="about-hero">
        <h1>An Empirical Investigation Into E-Commerce Cart Abandonment Factors</h1>
        <p className="subtitle">
          Exploratory Data Analysis and Machine Learning Research Application
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <Database className="text-primary mb-3" size={32} />
          <h3>Online Shoppers Intention Dataset</h3>
          <p>
            Trained on 12,330 customer browsing sessions from Kaggle / UCI Machine Learning Repository analyzing behavioral, administrative, and temporal features.
          </p>
        </div>

        <div className="about-card">
          <Cpu className="text-primary mb-3" size={32} />
          <h3>Random Forest Machine Learning</h3>
          <p>
            Uses a balanced Scikit-Learn Random Forest Classifier (n_estimators=200, ROC-AUC = 0.9171) to detect potential non-conversion sessions in real time.
          </p>
        </div>

        <div className="about-card">
          <BarChart2 className="text-primary mb-3" size={32} />
          <h3>PageValues & Disengagement Profiling</h3>
          <p>
            Identified PageValues, ExitRates, and ProductRelated duration as the most influential factors governing customer purchase intention.
          </p>
        </div>
      </div>

      <div className="research-note-box mt-8">
        <h4><CheckCircle2 size={20} className="text-success inline mr-2" /> Empirical Methodology Note</h4>
        <p>
          Target variable <code>Revenue</code> indicates completed session conversion (<code>Revenue = True</code>).
          In this research, session non-conversion (<code>Revenue = False</code>) serves as an empirical proxy for potential cart abandonment and session drop-off behavior.
        </p>
      </div>
    </div>
  );
}
