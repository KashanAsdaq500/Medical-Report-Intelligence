import { PatientInput } from "@/types";

export interface PresetProfile {
  name: string;
  category: "Low Risk" | "Borderline" | "High Risk" | "Healthy Baseline";
  description: string;
  data: PatientInput;
}

export const CLINICAL_PRESETS: PresetProfile[] = [
  {
    name: "Sample: Low Risk Profile",
    category: "Low Risk",
    description: "Normal post-load glucose, healthy blood pressure, moderate genetic score.",
    data: {
      pregnancies: 1,
      glucose: 85.0,
      blood_pressure: 66.0,
      skin_thickness: 29.0,
      insulin: 0.0,
      bmi: 26.6,
      diabetes_pedigree: 0.351,
      age: 31
    }
  },
  {
    name: "Sample: Borderline / Impaired Profile",
    category: "Borderline",
    description: "Elevated postprandial glucose (135 mg/dL), overweight BMI (28.4), age >= 35.",
    data: {
      pregnancies: 2,
      glucose: 135.0,
      blood_pressure: 78.0,
      skin_thickness: 25.0,
      insulin: 85.0,
      bmi: 28.4,
      diabetes_pedigree: 0.450,
      age: 38
    }
  },
  {
    name: "Sample: High Risk Profile",
    category: "High Risk",
    description: "Marked hyperglycemia (148 mg/dL), Class I Obesity (33.6 BMI), multiple pregnancies, age 50.",
    data: {
      pregnancies: 6,
      glucose: 148.0,
      blood_pressure: 72.0,
      skin_thickness: 35.0,
      insulin: 0.0,
      bmi: 33.6,
      diabetes_pedigree: 0.627,
      age: 50
    }
  },
  {
    name: "Sample: Young Adult Baseline",
    category: "Healthy Baseline",
    description: "Healthy baseline glucose (92 mg/dL), optimal BMI (22.2), normal blood pressure.",
    data: {
      pregnancies: 0,
      glucose: 92.0,
      blood_pressure: 68.0,
      skin_thickness: 18.0,
      insulin: 45.0,
      bmi: 22.2,
      diabetes_pedigree: 0.220,
      age: 24
    }
  }
];
