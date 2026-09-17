"use client";

import React from "react";
import { ShieldAlert, Cpu, BookOpen, Layers, GitBranch, Server } from "lucide-react";
import { ClinicalDisclaimer } from "@/components/ClinicalDisclaimer";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          System Architecture & Clinical Standards
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Technical specifications, authoritative medical references, and clinical decision-support ethics.
        </p>
      </div>

      <ClinicalDisclaimer />

      {/* 1. Machine Learning Model Specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <Cpu className="w-5 h-5 text-clinical-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Machine Learning Engine (DecisionTreeClassifier)
          </h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          The machine learning classification engine utilizes a trained <code>DecisionTreeClassifier</code> (persisted in{" "}
          <code>models/diabetes_model.pkl</code>). Trained with a constrained maximum depth of 5, the tree evaluates non-linear
          interactions among 8 physiological biomarkers to compute binary classification and class probability distributions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Trained Dataset:</span>
            <span className="text-slate-600">Pima Indians Diabetes Dataset (National Institute of Diabetes and Digestive and Kidney Diseases)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Model Hyperparameters:</span>
            <span className="text-slate-600">DecisionTreeClassifier (max_depth=5, random_state=42, stratify=y)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Evaluated Features (8):</span>
            <span className="text-slate-600">Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Inference Invariance:</span>
            <span className="text-slate-600">The pre-existing trained artifact is preserved exactly without retraining or parameter alteration.</span>
          </div>
        </div>
      </div>

      {/* 2. Authoritative RAG Clinical Standards */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <BookOpen className="w-5 h-5 text-clinical-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Authoritative Medical Knowledge Base (RAG)
          </h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          The Retrieval-Augmented Generation (RAG) subsystem operates strictly on genuine, accredited medical guidelines.
          Guidelines are indexed with verbatim provenance, document titles, publication editions, and official DOIs:
        </p>

        <div className="space-y-3 text-xs">
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 block">American Diabetes Association (ADA)</span>
                <span className="text-clinical-700 font-medium">Standards of Care in Diabetes — 2024 (Table 2.2 &amp; 2.3)</span>
              </div>
              <span className="text-slate-400 font-mono">2024</span>
            </div>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Provides the clinical thresholds for Fasting Plasma Glucose (&lt; 100 mg/dL normal, 100–125 mg/dL prediabetes, &ge; 126 mg/dL provisional)
              and 2-hour Oral Glucose Tolerance Tests (&lt; 140 mg/dL normal, 140–199 mg/dL impaired, &ge; 200 mg/dL provisional).
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 block">World Health Organization (WHO) &amp; IDF</span>
                <span className="text-clinical-700 font-medium">Definition and Diagnosis of Diabetes Mellitus and Intermediate Hyperglycaemia</span>
              </div>
              <span className="text-slate-400 font-mono">2019 / 2006</span>
            </div>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Formalizes intermediate hyperglycaemia diagnostic criteria and emphasizes that single screening indicators require confirmatory venous blood testing.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 block">American Heart Association (AHA) / ACC</span>
                <span className="text-clinical-700 font-medium">Guideline for High Blood Pressure in Adults</span>
              </div>
              <span className="text-slate-400 font-mono">2017 / 2018</span>
            </div>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Defines diastolic blood pressure categories: Normal (&lt; 80 mm Hg), Stage 1 Hypertension (80–89 mm Hg), and Stage 2 (&ge; 90 mm Hg).
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 block">Centers for Disease Control and Prevention (CDC) &amp; NIH NIDDK</span>
                <span className="text-clinical-700 font-medium">Adult Body Mass Index &amp; Serum Insulin Physiological Patterns</span>
              </div>
              <span className="text-slate-400 font-mono">2022 / 2023</span>
            </div>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Standardizes adult BMI ranges (healthy: 18.5–24.9 kg/m², overweight: 25.0–29.9 kg/m², obesity: &ge; 30.0 kg/m²) and expected 2-hour postprandial insulin ranges.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Full-Stack Enterprise Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-4">
          <Layers className="w-5 h-5 text-clinical-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Full-Stack Production Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Frontend: Next.js (TypeScript)</span>
            <p className="text-slate-600">
              Modern App Router with client-side reactive components, Tailwind CSS clinical theme, typed API client, and deployment-ready for Vercel.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Backend: FastAPI (Python)</span>
            <p className="text-slate-600">
              High-performance asynchronous REST API, Pydantic v2 data validation, OpenAPI interactive Swagger documentation, and dynamic port binding for Render/Railway.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Database: SQLAlchemy ORM</span>
            <p className="text-slate-600">
              Zero-config SQLite for local development; dynamically adapts to PostgreSQL (Supabase / Render / Railway) via the <code>DATABASE_URL</code> environment variable.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Containerization &amp; CI/CD</span>
            <p className="text-slate-600">
              Multi-stage Dockerfiles for backend and frontend, unified <code>docker-compose.yml</code>, and automated GitHub Actions CI pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
