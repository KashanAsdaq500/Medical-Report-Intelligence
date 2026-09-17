"use client";

import React, { useState } from "react";
import { PatientInput, AssessmentResponse } from "@/types";
import { submitAssessment } from "@/lib/api";
import { ClinicalDisclaimer } from "@/components/ClinicalDisclaimer";
import { AssessmentForm } from "@/components/AssessmentForm";
import { RiskGauge } from "@/components/RiskGauge";
import { BiomarkerRadar } from "@/components/BiomarkerRadar";
import { RagEvidenceDrawer } from "@/components/RagEvidenceDrawer";
import { AlertCircle, Stethoscope } from "lucide-react";

export default function DashboardPage() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAssessmentSubmit = async (patientData: PatientInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await submitAssessment(patientData);
      setAssessmentResult(response);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to execute assessment. Ensure the FastAPI backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Intro */}
      <div className="bg-gradient-to-r from-clinical-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-clinical-500/30 border border-clinical-400/30 text-clinical-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>AI Clinical Decision Support Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Medical Report Intelligence
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            A production-grade architecture uniting machine learning risk classification
            (DecisionTreeClassifier) with authoritative clinical guideline retrieval (RAG)
            anchored in ADA 2024, WHO, AHA, and CDC reference criteria.
          </p>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Clinical Safety Banner */}
      <ClinicalDisclaimer />

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Clinical Assessment Form */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-slate-900">
            Patient Biomarker Evaluation
          </h2>
          <p className="text-xs text-slate-500">
            Enter physiological parameters or select a sample profile to run inference and retrieve clinical references.
          </p>
        </div>
        <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
      </div>

      {/* Results Section */}
      {assessmentResult && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-500">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">
              Evaluation & Clinical Reference Results
            </h2>
            <p className="text-xs text-slate-500">
              Session Record: <span className="font-mono font-semibold">{assessmentResult.id}</span>
            </p>
          </div>

          {/* 1. Risk Gauge / Decision Tree Outcome */}
          <RiskGauge
            prediction={assessmentResult.prediction}
            assessmentId={assessmentResult.id}
            timestamp={assessmentResult.timestamp}
          />

          {/* 2. Biomarker Reference Comparison */}
          <BiomarkerRadar comparisons={assessmentResult.biomarker_comparisons} />

          {/* 3. RAG Authoritative Evidence Drawer */}
          <RagEvidenceDrawer ragContext={assessmentResult.rag_context} />
        </div>
      )}
    </div>
  );
}
