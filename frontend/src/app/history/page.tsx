"use client";
import { useAuth } from "@clerk/nextjs";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchHistory } from "@/lib/api";
import { AssessmentHistoryItem } from "@/types";
import {
  Database,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function HistoryPage() {
  const { getToken } = useAuth();

  const [items, setItems] = useState<AssessmentHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(0, 50, getToken);
      setItems(data.items || []);
      setTotalCount(data.total_records || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load historical assessments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const elevatedCount = items.filter((i) => i.prediction === 1).length;
  const normalCount = items.filter((i) => i.prediction === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-clinical-50 border border-clinical-200/60 flex items-center justify-center text-clinical-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
                Clinical Assessment Audit Log
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically anonymized evaluation logs persisted to relational storage (PostgreSQL / SQLite).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-medical transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-clinical-600" : "text-slate-500"}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Audit Stats Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-medical">
          <span className="text-xs font-semibold text-slate-500 block">Total Recorded Assessments</span>
          <div className="text-2xl font-extrabold text-navy-900 mt-1 font-mono">{totalCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative session records</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-medical">
          <span className="text-xs font-semibold text-slate-500 block">Negative / Normal Classifications</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">{normalCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Low risk biomarker profiles</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-medical">
          <span className="text-xs font-semibold text-slate-500 block">Elevated Risk Classifications</span>
          <div className="text-2xl font-extrabold text-rose-700 mt-1 font-mono">{elevatedCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Model indication: diabetes flagged</span>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-medical overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-clinical-600" />
            <span>Loading assessment records from database...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">No Assessment Records Found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Run a clinical evaluation from the Assessment Dashboard to populate this audit log.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-clinical-700 hover:text-clinical-900 bg-clinical-50 px-3 py-1.5 rounded-lg border border-clinical-200/60 transition"
            >
              <span>Go to Assessment Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 border-b border-slate-200 text-slate-600 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Anonymized UUID</th>
                  <th className="py-3 px-4">Evaluation Timestamp</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Key Biomarkers</th>
                  <th className="py-3 px-4">ML Prediction</th>
                  <th className="py-3 px-4">Posterior Prob.</th>
                  <th className="py-3 px-4">Stratified Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((r) => {
                  const isElevated = r.prediction === 1;
                  const date = new Date(r.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition duration-100">
                      <td className="py-3.5 px-4 font-mono font-bold text-clinical-800 text-[11px]">
                        {r.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{date}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-navy-900">
                        <span className="font-semibold">{r.age} yrs</span>
                        <span className="text-slate-400 mx-1">Ã¢â‚¬Â¢</span>
                        <span className="text-slate-600 font-mono text-[11px]">{r.bmi} kg/mÃ‚Â²</span>
                      </td>
                      <td className="py-3.5 px-4 text-navy-900">
                        <span className="font-bold text-clinical-900">{r.glucose} mg/dL</span>
                        <span className="text-slate-400 mx-1">Ã¢â‚¬Â¢</span>
                        <span className="text-slate-600 text-[11px]">{r.blood_pressure} mm Hg</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                            isElevated
                              ? "bg-rose-50 text-rose-800 border-rose-200/80"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                          }`}
                        >
                          {isElevated ? (
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>{r.prediction_label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900 text-xs">
                        {r.probability_diabetes.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                            r.risk_level === "Elevated Risk"
                              ? "bg-rose-100 text-rose-800 border-rose-200"
                              : r.risk_level === "Moderate Risk"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {r.risk_level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
