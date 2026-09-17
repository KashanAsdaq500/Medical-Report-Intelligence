"use client";

import React, { useState } from "react";
import { PatientInput } from "@/types";
import { CLINICAL_PRESETS } from "@/lib/presets";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

interface AssessmentFormProps {
  onSubmit: (data: PatientInput) => Promise<void>;
  isLoading: boolean;
}

export function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [formData, setFormData] = useState<PatientInput>({
    pregnancies: 1,
    glucose: 115.0,
    blood_pressure: 72.0,
    skin_thickness: 20.0,
    insulin: 80.0,
    bmi: 26.5,
    diabetes_pedigree: 0.450,
    age: 32,
  });

  const [activePreset, setActivePreset] = useState<string>("Custom");

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    const found = CLINICAL_PRESETS.find((p) => p.name === presetName);
    if (found) {
      setFormData(found.data);
    }
  };

  const handleChange = (field: keyof PatientInput, value: number) => {
    setActivePreset("Custom");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Preset Profiles Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-clinical-600" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Clinical Profile Presets
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CLINICAL_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p.name)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                activePreset === p.name
                  ? "bg-clinical-600 text-white border-clinical-600 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {p.name}
            </button>
          ))}
          {activePreset === "Custom" && (
            <span className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-medium">
              Custom (Manual Input)
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Demographics & Physical Vitals */}
          <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
              Demographics & Physical Vitals
            </h4>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                step="1"
                required
                value={formData.age}
                onChange={(e) => handleChange("age", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">ADA screening indication at age &ge; 35</span>
            </div>

            {/* BMI */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Mass Index — BMI (kg/m²)
              </label>
              <input
                type="number"
                min="10.0"
                max="70.0"
                step="0.1"
                required
                value={formData.bmi}
                onChange={(e) => handleChange("bmi", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">Healthy adult standard: 18.5 – 24.9 kg/m²</span>
            </div>

            {/* Blood Pressure */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diastolic Blood Pressure (mm Hg)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                step="1"
                required
                value={formData.blood_pressure}
                onChange={(e) => handleChange("blood_pressure", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">AHA standard normal: &lt; 80 mm Hg</span>
            </div>

            {/* Pregnancies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pregnancies
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                required
                value={formData.pregnancies}
                onChange={(e) => handleChange("pregnancies", parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">Total number of past pregnancies</span>
            </div>
          </div>

          {/* Column 2: Laboratory & Metabolic Biomarkers */}
          <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
              Laboratory & Metabolic Biomarkers
            </h4>

            {/* Glucose */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plasma Glucose Concentration (2h post-load, mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="300"
                step="1"
                required
                value={formData.glucose}
                onChange={(e) => handleChange("glucose", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none font-semibold text-clinical-900"
              />
              <span className="text-[11px] text-slate-400">ADA/WHO normal 2h: &lt; 140 mg/dL</span>
            </div>

            {/* Insulin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2-Hour Serum Insulin (mu U/ml)
              </label>
              <input
                type="number"
                min="0"
                max="900"
                step="1"
                required
                value={formData.insulin}
                onChange={(e) => handleChange("insulin", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">Normal 2h reference: 16 – 166 mu U/ml</span>
            </div>

            {/* Skin Thickness */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Triceps Skin Fold Thickness (mm)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                required
                value={formData.skin_thickness}
                onChange={(e) => handleChange("skin_thickness", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">Anthropometric subcutaneous fat measure</span>
            </div>

            {/* Diabetes Pedigree Function */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diabetes Pedigree Function Score
              </label>
              <input
                type="number"
                min="0.0"
                max="3.0"
                step="0.001"
                required
                value={formData.diabetes_pedigree}
                onChange={(e) => handleChange("diabetes_pedigree", parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">Genetic family history score (cohort median: ~0.37)</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-clinical-600 hover:bg-clinical-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Evaluating Biomarkers & Retrieving Guidelines...</span>
            </>
          ) : (
            <>
              <span>Run AI Clinical Risk Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
