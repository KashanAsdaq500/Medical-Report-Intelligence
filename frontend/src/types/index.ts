export interface PatientInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree: number;
  age: number;
}

export interface PredictionResult {
  prediction: number;
  prediction_label: string;
  probability_diabetes: number;
  probability_no_diabetes: number;
  risk_level: "Low Risk" | "Moderate Risk" | "Elevated Risk";
}

export interface BiomarkerComparison {
  biomarker: string;
  feature_key: string;
  entered_value: number;
  unit: string;
  reference_interval: string;
  status: string;
  clinical_note: string;
}

export interface GuidelineCitation {
  id: string;
  source: string;
  document_title: string;
  section: string;
  publication_year: number;
  url_or_doi?: string;
  biomarker: string;
  measurement_type: string;
  reference_ranges: Record<string, string>;
  guideline_statement: string;
  clinical_context: string;
}

export interface RAGContextResponse {
  retrieved_citations: GuidelineCitation[];
  informational_summary: string;
  out_of_range_biomarkers: string[];
  strictly_non_diagnostic_notice: string;
}

export interface AssessmentResponse {
  id: string;
  timestamp: string;
  patient_inputs: PatientInput;
  prediction: PredictionResult;
  biomarker_comparisons: BiomarkerComparison[];
  rag_context: RAGContextResponse;
  clinical_disclaimer: string;
}

export interface AssessmentHistoryItem {
  id: string;
  timestamp: string;
  age: number;
  glucose: number;
  bmi: number;
  blood_pressure: number;
  prediction: number;
  prediction_label: string;
  probability_diabetes: number;
  risk_level: string;
}

export interface HistoryResponse {
  total_records: number;
  page_size: number;
  skip: number;
  items: AssessmentHistoryItem[];
}
