"use client";

import React, { useState } from "react";
import { RAGContextResponse } from "@/types";
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, ShieldCheck, Bookmark } from "lucide-react";

interface RagEvidenceDrawerProps {
  ragContext: RAGContextResponse;
}

export function RagEvidenceDrawer({ ragContext }: RagEvidenceDrawerProps) {
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);

  const toggleCitation = (id: string) => {
    setExpandedCitation(expandedCitation === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-clinical-50 text-clinical-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              RAG Clinical Reference & Guideline Citations
            </h3>
            <p className="text-xs text-slate-500">
              Authoritative evidence retrieved from established clinical organizations (ADA, WHO, AHA, CDC)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Authoritative & Attributed</span>
        </div>
      </div>

      {/* Out of Range Parameters Summary */}
      {ragContext.out_of_range_biomarkers.length > 0 && (
        <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 flex items-center justify-between">
          <div className="text-xs text-amber-900">
            <span className="font-bold">Parameters Outside Standard Range: </span>
            <span className="font-medium text-amber-800">
              {ragContext.out_of_range_biomarkers.join(", ")}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
            {ragContext.out_of_range_biomarkers.length} Deviating
          </span>
        </div>
      )}

      {/* Informational Summary Box */}
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {ragContext.informational_summary}
      </div>

      {/* Authoritative Citations List */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Retrieved Guideline Literature & Standards ({ragContext.retrieved_citations.length})
        </h4>

        <div className="space-y-3">
          {ragContext.retrieved_citations.map((citation) => {
            const isExpanded = expandedCitation === citation.id;

            return (
              <div
                key={citation.id}
                className="border border-slate-200 rounded-lg overflow-hidden transition-all bg-white hover:border-slate-300"
              >
                <button
                  onClick={() => toggleCitation(citation.id)}
                  className="w-full text-left p-4 flex items-start justify-between space-x-3 bg-white hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-start space-x-3">
                    <Bookmark className="w-4 h-4 text-clinical-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-clinical-800 bg-clinical-50 px-2 py-0.5 rounded border border-clinical-100">
                          {citation.source}
                        </span>
                        <span className="text-xs text-slate-400">
                          {citation.publication_year}
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-900 mt-1">
                        {citation.document_title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {citation.section} • {citation.biomarker}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-700 space-y-2.5">
                    <div className="pt-3">
                      <span className="font-semibold text-slate-900 block mb-1">
                        Guideline Statement:
                      </span>
                      <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                        {citation.guideline_statement}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900 block mb-1">
                        Clinical Context:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {citation.clinical_context}
                      </p>
                    </div>

                    {Object.keys(citation.reference_ranges).length > 0 && (
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="font-semibold text-slate-900 block mb-1">
                          Standard Reference Intervals:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {Object.entries(citation.reference_ranges).map(([key, val]) => (
                            <div key={key} className="text-[11px]">
                              <span className="capitalize text-slate-500">
                                {key.replace(/_/g, " ")}:
                              </span>{" "}
                              <span className="font-mono font-medium text-slate-800">
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {citation.url_or_doi && (
                      <div className="pt-1">
                        <a
                          href={citation.url_or_doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-clinical-600 hover:text-clinical-800 font-medium"
                        >
                          <span>Official Reference Publication</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
