"use client";

import React, { useState } from "react";
import { RAGContextResponse } from "@/types";
import {
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Bookmark,
  FileText,
  AlertCircle,
} from "lucide-react";

interface RagEvidenceDrawerProps {
  ragContext: RAGContextResponse;
}

function renderFormattedInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-navy-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function ClinicalMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentBullets: { text: string; key: number }[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-2 my-2.5 pl-1">
          {currentBullets.map((b) => (
            <li key={b.key} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
              <span>{renderFormattedInline(b.text)}</span>
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      return;
    }

    if (trimmed.startsWith("####") || trimmed.startsWith("###")) {
      flushBullets();
      const title = trimmed.replace(/^#+\s*/, "");
      elements.push(
        <h5
          key={`h-${idx}`}
          className="text-xs sm:text-sm font-bold text-navy-900 tracking-tight mt-3 mb-1.5 uppercase tracking-wider"
        >
          {title}
        </h5>
      );
    } else if (trimmed.startsWith(">")) {
      flushBullets();
      const text = trimmed.replace(/^>\s*/, "");
      elements.push(
        <div
          key={`quote-${idx}`}
          className="mt-3 p-3.5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-lg text-xs text-amber-950 leading-relaxed"
        >
          {renderFormattedInline(text)}
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const text = trimmed.replace(/^[-*]\s+/, "");
      currentBullets.push({ text, key: idx });
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${idx}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5">
          {renderFormattedInline(trimmed)}
        </p>
      );
    }
  });

  flushBullets();

  return <div className="space-y-1">{elements}</div>;
}

export function RagEvidenceDrawer({ ragContext }: RagEvidenceDrawerProps) {
  const [expandedCitation, setExpandedCitation] = useState<string | null>(
    ragContext.retrieved_citations.length > 0 ? ragContext.retrieved_citations[0].id : null
  );

  const toggleCitation = (id: string) => {
    setExpandedCitation(expandedCitation === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-medical p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-clinical-50 border border-clinical-200/60 flex items-center justify-center text-clinical-800 flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900 tracking-tight">
              Clinical Guideline Evidence &amp; Citations (RAG)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative evidence retrieved from peer-reviewed clinical organizations (ADA 2024, WHO, AHA, CDC)
            </p>
          </div>
        </div>
        <div className="inline-flex items-center space-x-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200/70 px-3 py-1 rounded-md self-start sm:self-auto font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Attributed Clinical Sources</span>
        </div>
      </div>

      {/* Out of Range Biomarkers Banner */}
      {ragContext.out_of_range_biomarkers.length > 0 && (
        <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Biomarkers Outside Standard Reference Interval: </span>
              <span className="font-medium text-amber-900">
                {ragContext.out_of_range_biomarkers.join(", ")}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-200/70 self-start sm:self-auto">
            {ragContext.out_of_range_biomarkers.length} Deviating Parameters
          </span>
        </div>
      )}

      {/* Synthesis Summary Card */}
      <div className="mt-4 p-4 rounded-lg bg-surface-50 border border-slate-200/80">
        <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-clinical-600" />
          <span>Clinical Decision-Support Informational Synthesis</span>
        </div>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <ClinicalMarkdown content={ragContext.informational_summary} />
        </div>
      </div>

      {/* Guideline Citations List */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Retrieved Guideline Documents ({ragContext.retrieved_citations.length})
          </h4>
          <span className="text-[11px] text-slate-400">Click to expand clinical statement details</span>
        </div>

        <div className="space-y-3">
          {ragContext.retrieved_citations.map((citation) => {
            const isExpanded = expandedCitation === citation.id;

            return (
              <div
                key={citation.id}
                className="border border-slate-200/90 rounded-lg overflow-hidden transition-all duration-150 bg-white hover:border-slate-300"
              >
                <button
                  onClick={() => toggleCitation(citation.id)}
                  className="w-full text-left p-4 flex items-start justify-between space-x-3 bg-white hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-clinical-700 mt-0.5 flex-shrink-0">
                      <Bookmark className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-clinical-900 bg-clinical-50 px-2 py-0.5 rounded border border-clinical-200/70">
                          {citation.source}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {citation.publication_year}
                        </span>
                        <span className="text-[11px] font-medium text-slate-600">
                          • {citation.biomarker}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900 mt-1">
                        {citation.document_title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {citation.section}
                      </p>
                    </div>
                  </div>

                  <div className="p-1 rounded-md text-slate-400 hover:text-navy-900 flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-100 bg-surface-50/80 text-xs text-slate-700 space-y-3">
                    <div className="pt-3">
                      <span className="font-bold text-navy-900 block mb-1">
                        Authoritative Guideline Statement:
                      </span>
                      <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80 italic">
                        &ldquo;{renderFormattedInline(citation.guideline_statement)}&rdquo;
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-navy-900 block mb-1">
                        Clinical Context &amp; Decision Protocol:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {renderFormattedInline(citation.clinical_context)}
                      </p>
                    </div>

                    {Object.keys(citation.reference_ranges).length > 0 && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                        <span className="font-bold text-navy-900 block mb-2">
                          Standard Clinical Reference Intervals:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(citation.reference_ranges).map(([key, val]) => (
                            <div key={key} className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="capitalize text-slate-500 block">
                                {key.replace(/_/g, " ")}:
                              </span>
                              <span className="font-mono font-bold text-navy-900 mt-0.5 block">
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
                          className="inline-flex items-center space-x-1.5 text-clinical-700 hover:text-clinical-900 font-semibold transition"
                        >
                          <span>Official Reference Publication / DOI</span>
                          <ExternalLink className="w-3.5 h-3.5" />
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
