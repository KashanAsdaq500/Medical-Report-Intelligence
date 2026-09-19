"use client";

import React, { useState, useRef, useEffect } from "react";
import { PatientInput, AssessmentResponse } from "@/types";
import { submitAssessment } from "@/lib/api";
import { ClinicalDisclaimer } from "@/components/ClinicalDisclaimer";
import { AssessmentForm } from "@/components/AssessmentForm";
import { RiskGauge } from "@/components/RiskGauge";
import { BiomarkerRadar } from "@/components/BiomarkerRadar";
import { RagEvidenceDrawer } from "@/components/RagEvidenceDrawer";
import {
  AlertCircle,
  Stethoscope,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal & prevent background body scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleAssessmentSubmit = async (patientData: PatientInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await submitAssessment(patientData);
      setAssessmentResult(response);
      setIsModalOpen(false); // Reset modal state on new submission
      // Smooth scroll to results once computed
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
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
      {/* Calm, Trustworthy Clinical Hero Header */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 text-white shadow-medical-md relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-clinical-800/10 to-transparent pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-navy-800/80 border border-clinical-700/40 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold mb-3.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Clinical Decision Support Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Medical Report Intelligence
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
            An AI-assisted clinical decision-support system integrating calibrated machine learning
            risk classification with authoritative clinical guideline retrieval (RAG) anchored in
            ADA 2024, WHO, AHA, and CDC reference criteria.
          </p>

          {/* Clinical Architecture Feature Badges */}
          <div className="mt-5 pt-4 border-t border-navy-800 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>DecisionTreeClassifier Model</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>RAG Clinical Guidelines (ADA / WHO / AHA)</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Anonymized Session Audit</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Clinical Safety Advisory */}
      <ClinicalDisclaimer />

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Clinical Assessment Form Section */}
      <div>
        <div className="mb-3.5">
          <h2 className="text-lg font-bold text-navy-900 tracking-tight">
            Patient Biomarker Evaluation Input
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter 8 physiological parameters or select a standard clinical profile to compute risk stratifications and retrieve corresponding medical guidelines.
          </p>
        </div>
        <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
      </div>

      {/* Findings & Guideline Evaluation Results Section */}
      {assessmentResult && (
        <div ref={resultsRef} className="space-y-6 pt-4 animate-in fade-in duration-500">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-navy-900 tracking-tight">
                Clinical Risk Assessment Outcome
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Session Audit Record: <span className="font-mono font-bold text-clinical-800">{assessmentResult.id}</span>
              </p>
            </div>
            <div className="text-[11px] text-slate-400">
              Evaluated {new Date(assessmentResult.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          {/* 1. Main Prediction / Result Summary (ALWAYS VISIBLE) */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-medical transition-all ${
              assessmentResult.prediction.prediction === 1
                ? "bg-rose-50/50 border-rose-200/90"
                : "bg-emerald-50/50 border-emerald-200/90"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              {/* Outcome Badge & Clinical Label */}
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    assessmentResult.prediction.prediction === 1
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {assessmentResult.prediction.prediction === 1 ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Primary Model Classification
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        assessmentResult.prediction.risk_level === "Elevated Risk"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : assessmentResult.prediction.risk_level === "Moderate Risk"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {assessmentResult.prediction.risk_level}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                    {assessmentResult.prediction.prediction_label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {assessmentResult.prediction.prediction === 1
                      ? "Multi-variate decision tree classification indicates elevated diabetes risk based on entered physiological biomarkers. Detailed laboratory status and ADA/WHO clinical guideline citations are available below."
                      : "Multi-variate decision tree classification indicates low diabetes risk within standard physiological tolerances. Detailed laboratory status and ADA/WHO clinical guideline citations are available below."}
                  </p>
                </div>
              </div>

              {/* Calculated Risk Percentages */}
              <div className="flex sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-3 lg:pt-0 lg:pl-6 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Calculated Risk
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-navy-900">
                    {assessmentResult.prediction.probability_diabetes.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Baseline: <span className="font-mono text-slate-700">{assessmentResult.prediction.probability_no_diabetes.toFixed(1)}%</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Prominent Medical Modal Trigger Button */}
          <div className="flex flex-col items-center justify-center pt-2 pb-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
              aria-controls="clinical-assessment-details-modal"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-clinical-950 active:bg-slate-950 text-white font-semibold text-sm shadow-medical hover:shadow-medical-md transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-clinical-600 focus:ring-offset-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              <span>View Clinical Assessment Details</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
            </button>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Click above to open the comprehensive clinical evaluation modal with probability spectrum, biomarker comparisons, and RAG guidelines.
            </p>
          </div>

          {/* 3. Clinical Assessment Details Modal / Dialog Window */}
          {isModalOpen && (
            <div
              id="clinical-assessment-details-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clinical-details-modal-title"
              className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsModalOpen(false);
                }
              }}
            >
              <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-200/90 bg-white sticky top-0 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-teal-400 flex-shrink-0 shadow-sm">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2
                        id="clinical-details-modal-title"
                        className="text-lg sm:text-xl font-bold text-navy-900 tracking-tight leading-snug"
                      >
                        Clinical Assessment Details
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>
                          Session Audit Record:{" "}
                          <strong className="font-mono text-clinical-800">{assessmentResult.id}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Evaluated{" "}
                          {new Date(assessmentResult.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top-Right Close Button (X) */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close clinical assessment details modal"
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-clinical-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-surface-50/50">
                  {/* A. Detailed Risk Gauge / Decision Tree Spectrum */}
                  <RiskGauge
                    prediction={assessmentResult.prediction}
                    assessmentId={assessmentResult.id}
                    timestamp={assessmentResult.timestamp}
                  />

                  {/* B. Biomarker Laboratory Reference Analysis */}
                  <BiomarkerRadar comparisons={assessmentResult.biomarker_comparisons} />

                  {/* C. RAG Authoritative Evidence Drawer & Retrieved Documents */}
                  <RagEvidenceDrawer ragContext={assessmentResult.rag_context} />

                  {/* D. Clinical Decision-Support Governance Notice */}
                  <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-medical text-xs text-slate-600">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="w-5 h-5 text-clinical-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold text-navy-900 tracking-tight text-xs sm:text-sm">
                          Clinical Governance &amp; Non-Diagnostic Protocol
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          All machine learning inferences, threshold classifications, and guideline citations are compiled strictly for clinical decision support, peer reference, and educational research demonstration. This system does not autonomously generate diagnoses, prescribe pharmaceutical interventions, or substitute for formal venous laboratory testing evaluated by licensed medical practitioners.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-5 sm:px-7 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400">
                    Press <kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">Esc</kbd> or click outside to close
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Close Details
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
