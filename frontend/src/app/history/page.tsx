"use client";

import React, { useEffect, useState } from "react";
import { fetchHistory } from "@/lib/api";
import { AssessmentHistoryItem } from "@/types";
import { Database, RefreshCw, AlertCircle, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function HistoryPage() {
  const [items, setItems] = useState<AssessmentHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(0, 50);
      setItems(data.items);
      setTotalCount(data.total_records);
    } catch (err: any) {
      setError(err.message || "Failed to load historical assessments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-clinical-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Assessment Audit History
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persisted clinical evaluations with strictly anonymized session identifiers (PostgreSQL / SQLite).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
            Total Records: {totalCount}
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-clinical-500" />
            Loading assessment records...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No assessment records recorded yet. Run a prediction from the Assessment Dashboard!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Anonymized ID</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Age / BMI</th>
                  <th className="py-3.5 px-4">Glucose / BP</th>
                  <th className="py-3.5 px-4">ML Prediction</th>
                  <th className="py-3.5 px-4">Diabetes Prob.</th>
                  <th className="py-3.5 px-4">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((r) => {
                  const isElevated = r.prediction === 1;
                  const date = new Date(r.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-clinical-700">
                        {r.id}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 flex items-center space-x-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{date}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <span className="font-medium">{r.age} yrs</span> •{" "}
                        <span className="text-slate-500">{r.bmi} kg/m²</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <span className="font-semibold text-clinical-900">{r.glucose} mg/dL</span> •{" "}
                        <span className="text-slate-500">{r.blood_pressure} mm Hg</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            isElevated
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isElevated ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span>{r.prediction_label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        {r.probability_diabetes.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            r.risk_level === "Elevated Risk"
                              ? "bg-rose-100 text-rose-800"
                              : r.risk_level === "Moderate Risk"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
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
