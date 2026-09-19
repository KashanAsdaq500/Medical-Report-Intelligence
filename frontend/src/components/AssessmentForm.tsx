"use client";

import React, { useState } from "react";
import { PatientInput } from "@/types";
import { CLINICAL_PRESETS } from "@/lib/presets";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  User,
  HeartPulse,
  Activity,
  Dna,
  RotateCcw,
} from "lucide-react";

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

  const handleReset = () => {
    setActivePreset("Custom");
    setFormData({
      pregnancies: 0,
      glucose: 100.0,
      blood_pressure: 70.0,
      skin_thickness: 20.0,
      insulin: 70.0,
      bmi: 24.0,
      diabetes_pedigree: 0.35,
      age: 30,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-medical p-5 sm:p-7 transition-all">
      {/* Quick Scenario Profiles Header */}
      <div className="pb-5 mb-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Standard Clinical Test Profiles
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-navy-900 transition font-medium self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* Preset Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CLINICAL_PRESETS.map((p) => {
            const isSelected = activePreset === p.name;
            const badgeColor =
              p.category === "High Risk"
                ? "text-rose-700 bg-rose-50 border-rose-200"
                : p.category === "Borderline"
                ? "text-amber-700 bg-amber-50 border-amber-200"
                : "text-emerald-700 bg-emerald-50 border-emerald-200";

            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p.name)}
                className={`text-left p-3 rounded-lg border text-xs transition-all duration-150 relative ${
                  isSelected
                    ? "bg-clinical-50/70 border-clinical-500 shadow-sm ring-1 ring-clinical-500/20"
                    : "bg-surface-50 border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-bold tracking-tight ${isSelected ? "text-clinical-900" : "text-navy-900"}`}>
                    {p.name.replace("Sample: ", "")}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {p.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 4 Logical Clinical Biomarker Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Panel 1: Patient Demographics & Obstetric History */}
          <div className="bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-200/80">
              <div className="w-6 h-6 rounded bg-navy-100 flex items-center justify-center text-navy-700">
                <User className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                1. Demographics &amp; Obstetric Profile
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Age */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Patient Age
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">Years</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  required
                  value={formData.age}
                  onChange={(e) => handleChange("age", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ADA screening guideline recommends evaluation for all adults &ge; 35 years.
                </span>
              </div>

              {/* Pregnancies */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Gravidity / Total Pregnancies
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">Count</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="1"
                  required
                  value={formData.pregnancies}
                  onChange={(e) => handleChange("pregnancies", parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Cumulative history of past pregnancies; correlates with gestational insulin resistance.
                </span>
              </div>
            </div>
          </div>

          {/* Panel 2: Cardiovascular & Anthropometrics */}
          <div className="bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-200/80">
              <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center text-teal-800">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                2. Cardiovascular &amp; Anthropometrics
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Diastolic Blood Pressure */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Diastolic Blood Pressure
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">mm Hg</span>
                </div>
                <input
                  type="number"
                  min="30"
                  max="200"
                  step="1"
                  required
                  value={formData.blood_pressure}
                  onChange={(e) => handleChange("blood_pressure", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  AHA clinical reference: Normal &lt; 80 mm Hg; Stage 1 Hypertension 80–89 mm Hg.
                </span>
              </div>

              {/* BMI */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Body Mass Index (BMI)
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">kg/m²</span>
                </div>
                <input
                  type="number"
                  min="10.0"
                  max="70.0"
                  step="0.1"
                  required
                  value={formData.bmi}
                  onChange={(e) => handleChange("bmi", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  WHO standard reference: 18.5 – 24.9 kg/m² healthy; &ge; 25.0 overweight; &ge; 30.0 obesity.
                </span>
              </div>
            </div>
          </div>

          {/* Panel 3: Glycemic & Endocrine Biomarkers */}
          <div className="bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-200/80">
              <div className="w-6 h-6 rounded bg-clinical-100 flex items-center justify-center text-clinical-800">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                3. Glycemic &amp; Endocrine Biomarkers
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Plasma Glucose */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Plasma Glucose Concentration (2-hr post-load)
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">mg/dL</span>
                </div>
                <input
                  type="number"
                  min="40"
                  max="300"
                  step="1"
                  required
                  value={formData.glucose}
                  onChange={(e) => handleChange("glucose", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-clinical-300 bg-white px-3 py-2 text-sm text-clinical-950 font-bold focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ADA/WHO diagnostic threshold: &lt; 140 mg/dL normal; 140–199 impaired; &ge; 200 provisional.
                </span>
              </div>

              {/* 2-Hour Serum Insulin */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    2-Hour Serum Insulin
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">μU/mL</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="900"
                  step="1"
                  required
                  value={formData.insulin}
                  onChange={(e) => handleChange("insulin", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Standard physiological postprandial interval: 16 – 166 μU/mL.
                </span>
              </div>
            </div>
          </div>

          {/* Panel 4: Adiposity & Familial Predisposition */}
          <div className="bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-200/80">
              <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-slate-800">
                <Dna className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                4. Adiposity &amp; Familial Predisposition
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Skin Fold Thickness */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Triceps Skin Fold Thickness
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">mm</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  value={formData.skin_thickness}
                  onChange={(e) => handleChange("skin_thickness", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Anthropometric subcutaneous adiposity indicator; adult reference 10 – 30 mm.
                </span>
              </div>

              {/* Diabetes Pedigree Function */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Diabetes Pedigree Function Score
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">0.0 – 3.0</span>
                </div>
                <input
                  type="number"
                  min="0.0"
                  max="3.0"
                  step="0.001"
                  required
                  value={formData.diabetes_pedigree}
                  onChange={(e) => handleChange("diabetes_pedigree", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 font-medium focus:border-clinical-600 focus:ring-1 focus:ring-clinical-600 outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Familial pedigree genetic score (study population median: ~0.372).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[280px] bg-clinical-900 hover:bg-clinical-950 active:bg-navy-950 text-white text-sm font-semibold py-3 px-6 rounded-lg shadow-medical hover:shadow-medical-md transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Computing Inference &amp; Retrieving Guidelines...</span>
              </>
            ) : (
              <>
                <span>Execute Clinical Risk Assessment</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Inference processed via scikit-learn DecisionTreeClassifier + RAG Guideline Retrieval.
          </p>
        </div>
      </form>
    </div>
  );
}
