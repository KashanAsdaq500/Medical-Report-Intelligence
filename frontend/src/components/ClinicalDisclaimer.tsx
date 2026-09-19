"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function ClinicalDisclaimer() {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-medical">
      <div className="flex items-start space-x-3.5">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-clinical-700 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-navy-900 tracking-tight">
              Clinical Decision-Support &amp; Research Advisory
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Non-Diagnostic System
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This platform demonstrates an AI-assisted clinical decision-support architecture combining supervised machine learning
            risk screening with authoritative guideline retrieval (ADA 2024, WHO, AHA, CDC).
            <span className="font-semibold text-slate-800">
              {" "}Outputs are strictly informational and do not constitute a definitive medical diagnosis, treatment recommendation, or prescription.
            </span>
            {" "}Final clinical evaluation requires formal venous laboratory testing and diagnosis by a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
