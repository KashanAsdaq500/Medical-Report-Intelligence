"use client";

import React from "react";
import { BiomarkerComparison } from "@/types";
import { CheckCircle2, AlertCircle, AlertTriangle, FileSpreadsheet } from "lucide-react";

interface BiomarkerComparisonProps {
  comparisons: BiomarkerComparison[];
}

export function BiomarkerRadar({ comparisons }: BiomarkerComparisonProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-medical p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900 tracking-tight">
              Biomarker Laboratory Reference Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized evaluation of entered physiological biomarkers against population reference standards
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-slate-50 text-slate-600 px-3 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
          Objective Reference Evaluation
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-surface-50 text-slate-600 text-[11px] uppercase font-bold tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Biomarker</th>
              <th className="py-3 px-4">Entered Patient Value</th>
              <th className="py-3 px-4">Standard Reference Interval</th>
              <th className="py-3 px-4">Clinical Status</th>
              <th className="py-3 px-4 rounded-r-lg">Physiological Context &amp; Guidance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {comparisons.map((item, idx) => {
              const statusLower = item.status.toLowerCase();
              const isNormal = statusLower.includes("normal") || statusLower.includes("optimal") || statusLower.includes("healthy");
              const isElevated =
                statusLower.includes("elevated") ||
                statusLower.includes("obesity") ||
                statusLower.includes("hypertension") ||
                statusLower.includes("high");
              const isBorderline = statusLower.includes("impaired") || statusLower.includes("borderline") || statusLower.includes("overweight");

              return (
                <tr key={idx} className="hover:bg-slate-50/70 transition duration-100">
                  <td className="py-3.5 px-4 font-semibold text-navy-900">
                    {item.biomarker}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-900">
                    <span className="font-bold text-sm text-navy-900">{item.entered_value}</span>{" "}
                    <span className="text-[11px] text-slate-500 font-sans">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {item.reference_interval}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-md font-semibold border ${
                        isNormal
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                          : isElevated
                          ? "bg-rose-50 text-rose-800 border-rose-200/80"
                          : isBorderline
                          ? "bg-amber-50 text-amber-800 border-amber-200/80"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isNormal ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : isElevated ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-sm">
                    {item.clinical_note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
