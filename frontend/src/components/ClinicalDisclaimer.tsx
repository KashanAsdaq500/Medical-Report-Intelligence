"use client";

import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

export function ClinicalDisclaimer() {
  return (
    <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm mb-6 text-amber-950">
      <div className="flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold tracking-tight text-amber-900">
            Clinical Decision Support & Educational Demonstration
          </p>
          <p className="mt-1 text-amber-800/90 leading-relaxed">
            This platform demonstrates an AI-assisted decision-support architecture powered by a machine learning model
            and medical guideline retrieval (RAG). <strong>It is strictly informational and does not provide clinical diagnosis,
            evaluate individual treatments, or prescribe medication.</strong> Any clinical assessment requires formal laboratory
            blood evaluation and interpretation by a licensed healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
