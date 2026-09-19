"use client";

import React from "react";
import { Cpu, BookOpen, Layers, ExternalLink, ShieldCheck, Database, Server } from "lucide-react";
import { ClinicalDisclaimer } from "@/components/ClinicalDisclaimer";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-7">
      <div>
        <div className="flex items-center space-x-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Clinical &amp; System Architecture Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          System Architecture &amp; Clinical Standards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Technical specifications, authoritative medical references, and clinical decision-support ethics.
        </p>
      </div>

      <ClinicalDisclaimer />

      {/* 1. Machine Learning Model Specifications */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 shadow-medical">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-clinical-50 border border-clinical-200/60 flex items-center justify-center text-clinical-800 flex-shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-900 tracking-tight">
              Machine Learning Engine: DecisionTreeClassifier
            </h2>
            <p className="text-xs text-slate-500">Supervised classification model for multi-variate diabetes risk stratification</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          The machine learning classification engine evaluates non-linear physiological interactions across 8 standardized clinical biomarkers.
          Trained with a constrained maximum depth of 5 to maintain interpretability and avoid overfitting, the tree produces deterministic class probability distributions and categorical risk tiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-surface-50 p-3.5 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Training Dataset:</span>
            <span className="text-slate-600">Pima Indians Diabetes Cohort (National Institute of Diabetes and Digestive and Kidney Diseases — NIDDK)</span>
          </div>
          <div className="bg-surface-50 p-3.5 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Model Hyperparameters:</span>
            <span className="text-slate-600 font-mono text-[11px]">DecisionTreeClassifier(criterion=&apos;gini&apos;, max_depth=5, random_state=42)</span>
          </div>
          <div className="bg-surface-50 p-3.5 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Evaluated Features (8):</span>
            <span className="text-slate-600">Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age</span>
          </div>
          <div className="bg-surface-50 p-3.5 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Model Integrity:</span>
            <span className="text-slate-600">Serialized in <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">models/diabetes_model.pkl</code>; evaluated with fixed inference invariance.</span>
          </div>
        </div>
      </div>

      {/* 2. Authoritative RAG Clinical Standards */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 shadow-medical">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-900 tracking-tight">
              Authoritative Medical Knowledge Base (RAG)
            </h2>
            <p className="text-xs text-slate-500">Retrieval-Augmented Generation mapped to accredited clinical guidelines</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          The RAG subsystem retrieves accredited clinical statements, physiological reference intervals, and diagnostic guidelines.
          Every cited guideline includes verifiable source provenance, publication edition, and official DOI:
        </p>

        <div className="space-y-3 text-xs">
          <div className="border border-slate-200/90 rounded-lg p-4 bg-surface-50/70">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-navy-900 block text-sm">American Diabetes Association (ADA)</span>
                <span className="text-clinical-800 font-semibold">Standards of Care in Diabetes — 2024 (Classification and Diagnosis)</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">2024</span>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Provides the clinical thresholds for Fasting Plasma Glucose (&lt; 100 mg/dL normal, 100–125 mg/dL prediabetes, &ge; 126 mg/dL provisional)
              and 2-hour Oral Glucose Tolerance Tests (&lt; 140 mg/dL normal, 140–199 mg/dL impaired, &ge; 200 mg/dL provisional).
            </p>
          </div>

          <div className="border border-slate-200/90 rounded-lg p-4 bg-surface-50/70">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-navy-900 block text-sm">World Health Organization (WHO) &amp; IDF</span>
                <span className="text-clinical-800 font-semibold">Definition and Diagnosis of Diabetes Mellitus and Intermediate Hyperglycaemia</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">2019</span>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Formalizes international diagnostic criteria for impaired glucose tolerance and emphasizes that isolated screening scores require confirmatory venous blood evaluation.
            </p>
          </div>

          <div className="border border-slate-200/90 rounded-lg p-4 bg-surface-50/70">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-navy-900 block text-sm">American Heart Association (AHA) / ACC</span>
                <span className="text-clinical-800 font-semibold">Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">2018</span>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Defines adult blood pressure categories: Normal (&lt; 80 mm Hg diastolic), Elevated / Stage 1 Hypertension (80–89 mm Hg), and Stage 2 (&ge; 90 mm Hg).
            </p>
          </div>

          <div className="border border-slate-200/90 rounded-lg p-4 bg-surface-50/70">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-navy-900 block text-sm">Centers for Disease Control and Prevention (CDC) &amp; NIH NIDDK</span>
                <span className="text-clinical-800 font-semibold">Adult Body Mass Index &amp; Serum Insulin Physiological Patterns</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">2023</span>
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Standardizes adult BMI categories (healthy: 18.5–24.9 kg/m², overweight: 25.0–29.9 kg/m², obesity: &ge; 30.0 kg/m²) and expected postprandial insulin ranges.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Full-Stack Enterprise Architecture */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 shadow-medical">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 rounded-lg bg-navy-50 border border-navy-200/60 flex items-center justify-center text-navy-800 flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-900 tracking-tight">
              Full-Stack Production Architecture
            </h2>
            <p className="text-xs text-slate-500">Modern, decoupled web application architecture designed for deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-surface-50 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Frontend: Next.js 14 (TypeScript)</span>
            <p className="text-slate-600 leading-relaxed">
              App Router architecture with reactive client components, Tailwind CSS medical design system, typed API client, and Vercel-ready static optimization.
            </p>
          </div>
          <div className="p-3.5 bg-surface-50 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Backend: FastAPI (Python 3.11)</span>
            <p className="text-slate-600 leading-relaxed">
              High-performance asynchronous REST API, Pydantic v2 data validation, scikit-learn inference pipeline, and interactive OpenAPI documentation.
            </p>
          </div>
          <div className="p-3.5 bg-surface-50 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Persistence: SQLAlchemy ORM</span>
            <p className="text-slate-600 leading-relaxed">
              Relational data models supporting zero-config local SQLite with automatic migration to production PostgreSQL via the <code className="bg-white px-1 rounded border border-slate-200 text-slate-800">DATABASE_URL</code> variable.
            </p>
          </div>
          <div className="p-3.5 bg-surface-50 rounded-lg border border-slate-200/80">
            <span className="font-bold text-navy-900 block mb-1">Containerization &amp; DevOps</span>
            <p className="text-slate-600 leading-relaxed">
              Multi-stage Dockerfiles for both frontend and backend, unified <code className="bg-white px-1 rounded border border-slate-200 text-slate-800">docker-compose.yml</code> orchestration, and automated CI pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
