"use client";

import React from "react";
import { BiomarkerComparison } from "@/types";
import { Check, AlertCircle, Info } from "lucide-react";

interface BiomarkerComparisonProps {
  comparisons: BiomarkerComparison[];
}

export function BiomarkerRadar({ comparisons }: BiomarkerComparisonProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Biomarker Clinical Reference Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective evaluation of entered patient values against standard population reference ranges
          </p>
        </div>
        <span className="text-xs font-semibold bg-clinical-50 text-clinical-700 px-3 py-1 rounded-full border border-clinical-100">
          Non-Diagnostic
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <th className="pb-3 pr-4">Biomarker</th>
              <th className="pb-3 px-4">Patient Value</th>
              <th className="pb-3 px-4">Standard Reference Interval</th>
              <th className="pb-3 px-4">Evaluation Status</th>
              <th className="pb-3 pl-4">Physiological Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisons.map((item, idx) => {
              const isNormal = item.status.toLowerCase().includes("normal");
              const isElevated =
                item.status.toLowerCase().includes("elevated") ||
                item.status.toLowerCase().includes("obesity") ||
                item.status.toLowerCase().includes("hypertension");

              return (
                <tr key={idx} className="hover:bg-slate-50/75 transition">
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">
                    {item.biomarker}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                    {item.entered_value} <span className="text-xs text-slate-500">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {item.reference_interval}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        isNormal
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isElevated
                          ? "bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {isNormal ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : isElevated ? (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      ) : (
                        <Info className="w-3 h-3 text-blue-600" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-500 max-w-xs">
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
