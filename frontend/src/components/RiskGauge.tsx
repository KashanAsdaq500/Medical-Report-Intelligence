"use client";

import React from "react";
import { PredictionResult } from "@/types";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface RiskGaugeProps {
  prediction: PredictionResult;
  assessmentId: string;
  timestamp: string;
}

export function RiskGauge({ prediction, assessmentId, timestamp }: RiskGaugeProps) {
  const isElevated = prediction.prediction === 1;
  const prob = prediction.probability_diabetes;

  // Formatting date
  const formattedDate = new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Machine Learning Decision-Support Result
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            Diabetes Risk Classification
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <span className="inline-block bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-1 rounded font-medium">
            {assessmentId}
          </span>
          <span className="block text-xs text-slate-400 mt-0.5">{formattedDate}</span>
        </div>
      </div>

      {/* Main Prediction Banner */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3.5 ${
            isElevated
              ? "bg-rose-50/80 border-rose-200 text-rose-900"
              : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
          }`}
        >
          {isElevated ? (
            <AlertTriangle className="w-8 h-8 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          )}
          <div>
            <span className="text-xs uppercase font-semibold opacity-75 block">
              Decision Tree Output
            </span>
            <span className="text-lg font-bold block">
              {prediction.prediction_label}
            </span>
          </div>
        </div>

        {/* Calculated Probability Metric */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-xs text-slate-500 font-medium block">
            Calculated Diabetes Probability
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {prediction.probability_diabetes.toFixed(1)}%
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                prediction.risk_level === "Elevated Risk"
                  ? "bg-rose-100 text-rose-700"
                  : prediction.risk_level === "Moderate Risk"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {prediction.risk_level}
            </span>
          </div>
        </div>

        {/* Calculated Non-Diabetes Probability Metric */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-xs text-slate-500 font-medium block">
            Calculated Non-Diabetes Probability
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {prediction.probability_no_diabetes.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Model Baseline
            </span>
          </div>
        </div>
      </div>

      {/* Visual Risk Probability Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Risk Probability Spectrum</span>
          <span>{prob.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              prob > 60
                ? "bg-rose-500"
                : prob > 35
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${Math.max(prob, 2)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>0% (Low Risk)</span>
          <span>50% (Threshold)</span>
          <span>100% (High Risk)</span>
        </div>
      </div>
    </div>
  );
}
