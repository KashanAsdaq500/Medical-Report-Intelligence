"use client";

import React from "react";
import { PredictionResult } from "@/types";
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Hash, Cpu } from "lucide-react";

interface RiskGaugeProps {
  prediction: PredictionResult;
  assessmentId: string;
  timestamp: string;
}

export function RiskGauge({ prediction, assessmentId, timestamp }: RiskGaugeProps) {
  const isElevated = prediction.prediction === 1;
  const prob = prediction.probability_diabetes;

  const formattedDate = new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-medical p-5 sm:p-7 overflow-hidden">
      {/* Session Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Supervised Machine Learning Decision-Support
            </span>
          </div>
          <h3 className="text-xl font-bold text-navy-900 mt-1 tracking-tight">
            Diabetes Risk Classification Analysis
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
          <span className="inline-flex items-center space-x-1 bg-surface-50 border border-slate-200 px-2.5 py-1 rounded-md font-mono text-slate-600">
            <Hash className="w-3 h-3 text-slate-400" />
            <span>{assessmentId}</span>
          </span>
          <span className="inline-flex items-center space-x-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Primary Classification Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

        {/* ML Primary Decision */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            isElevated
              ? "bg-rose-50/60 border-rose-200/80 text-rose-950"
              : "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isElevated ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isElevated ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">
                Model Classification
              </span>
              <span className="text-base sm:text-lg font-bold block leading-tight">
                {prediction.prediction_label}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-200/60 leading-relaxed">
            Decision tree leaf node prediction based on multi-variate biomarker thresholds.
          </p>
        </div>

        {/* Calculated Diabetes Probability */}
        <div className="bg-surface-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-600 block">
                Diabetes Risk Probability
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-md font-bold tracking-tight ${
                  prediction.risk_level === "Elevated Risk"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : prediction.risk_level === "Moderate Risk"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {prediction.risk_level}
              </span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-mono">
              {prediction.probability_diabetes.toFixed(1)}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-200/60 leading-relaxed">
            Posterior probability of diabetes calculated by the decision tree node split.
          </p>
        </div>

        {/* Calculated Non-Diabetes Probability */}
        <div className="bg-surface-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-600 block">
                Non-Diabetes Probability
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Baseline
              </span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
              {prediction.probability_no_diabetes.toFixed(1)}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-200/60 leading-relaxed">
            Complementary probability representing low likelihood of diabetes mellitus.
          </p>
        </div>
      </div>

      {/* Visual Calibrated Risk Spectrum */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs font-semibold text-navy-900 mb-2">
          <span>Clinical Probability Spectrum</span>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
            Current: {prob.toFixed(1)}%
          </span>
        </div>

        {/* 3-Tier Calibrated Spectrum Bar */}
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/80">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              prob > 60
                ? "bg-rose-500"
                : prob > 35
                ? "bg-amber-500"
                : "bg-emerald-600"
            }`}
            style={{ width: `${Math.max(prob, 2)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Low Risk (0–35%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Moderate (35–60%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Elevated Risk (60–100%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
