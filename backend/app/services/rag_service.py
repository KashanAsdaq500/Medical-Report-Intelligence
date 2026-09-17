import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Tuple

from backend.app.schemas.patient import PatientInput, BiomarkerComparison
from backend.app.schemas.rag import GuidelineCitation, RAGContextResponse

logger = logging.getLogger(__name__)

KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "data" / "medical_knowledge"


class RAGService:
    """
    RAG (Retrieval-Augmented Generation) Clinical Context Engine.
    
    Strictly Informational & Non-Diagnostic:
    - Utilizes curated, authoritative guidelines (ADA 2024, WHO, AHA, CDC/NIDDK).
    - Compares patient biomarkers against established population reference intervals.
    - Explicitly identifies which entered biomarkers fall outside standard healthy ranges.
    - Strictly avoids prescribing, diagnosing, or recommending pharmaceutical therapies.
    """

    def __init__(self, knowledge_dir: Path = None):
        self.knowledge_dir = knowledge_dir or KNOWLEDGE_DIR
        self.corpus: List[Dict[str, Any]] = []
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        """Loads authoritative guideline documents from disk"""
        self.corpus = []
        if not self.knowledge_dir.exists():
            logger.warning(f"Knowledge directory {self.knowledge_dir} not found.")
            return

        for json_file in self.knowledge_dir.glob("*.json"):
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.corpus.extend(data)
                    elif isinstance(data, dict):
                        self.corpus.append(data)
                logger.info(f"Loaded {json_file.name} into RAG knowledge base.")
            except Exception as e:
                logger.error(f"Error loading {json_file}: {e}")

    def evaluate_biomarkers(self, patient: PatientInput) -> Tuple[List[BiomarkerComparison], List[str]]:
        """
        Compares entered biomarkers against established medical reference ranges.
        Returns detailed comparison rows and a list of out-of-range biomarker names.
        """
        comparisons: List[BiomarkerComparison] = []
        out_of_range: List[str] = []

        # 1. Glucose (2-hour plasma post-load)
        if patient.glucose < 100.0:
            g_status = "Normal"
            g_note = "Within standard normal fasting and postprandial glycemic boundaries."
        elif patient.glucose < 140.0:
            g_status = "Normal (Postprandial)"
            g_note = "Below standard 2-hour postprandial threshold (< 140 mg/dL, ADA 2024)."
        elif patient.glucose < 200.0:
            g_status = "Elevated (Impaired Glucose Tolerance)"
            g_note = "Falls within the 140–199 mg/dL impaired glucose tolerance (prediabetes) interval."
            out_of_range.append("Glucose")
        else:
            g_status = "Significantly Elevated"
            g_note = "Meets or exceeds 200 mg/dL provisional clinical threshold; warrants clinical evaluation."
            out_of_range.append("Glucose")

        comparisons.append(BiomarkerComparison(
            biomarker="Plasma Glucose (2-hour)",
            feature_key="glucose",
            entered_value=float(patient.glucose),
            unit="mg/dL",
            reference_interval="Normal: < 140 mg/dL (Fasting: < 100 mg/dL)",
            status=g_status,
            clinical_note=g_note
        ))

        # 2. BMI
        if patient.bmi < 18.5:
            bmi_status = "Underweight"
            bmi_note = "BMI is below the standard healthy adult threshold."
        elif patient.bmi < 25.0:
            bmi_status = "Normal / Healthy Weight"
            bmi_note = "Within CDC standard healthy adult range (18.5 – 24.9 kg/m²)."
        elif patient.bmi < 30.0:
            bmi_status = "Overweight"
            bmi_note = "Elevated beyond standard normal range (25.0 – 29.9 kg/m²), an established metabolic risk indicator."
            out_of_range.append("BMI")
        elif patient.bmi < 35.0:
            bmi_status = "Obesity (Class I)"
            bmi_note = "Falls into Obesity Class I (30.0 – 34.9 kg/m²), associated with increased peripheral insulin resistance."
            out_of_range.append("BMI")
        else:
            bmi_status = "Obesity (Class II/III)"
            bmi_note = "Substantially exceeds normal reference limits (>= 35.0 kg/m²)."
            out_of_range.append("BMI")

        comparisons.append(BiomarkerComparison(
            biomarker="Body Mass Index (BMI)",
            feature_key="bmi",
            entered_value=float(patient.bmi),
            unit="kg/m²",
            reference_interval="Healthy: 18.5 – 24.9 kg/m²",
            status=bmi_status,
            clinical_note=bmi_note
        ))

        # 3. Blood Pressure (Diastolic)
        if patient.blood_pressure < 80.0:
            bp_status = "Normal"
            bp_note = "Within AHA/ACC 2017 standard normal diastolic range (< 80 mm Hg)."
        elif patient.blood_pressure < 90.0:
            bp_status = "Stage 1 Hypertension Threshold"
            bp_note = "Falls within Stage 1 diastolic range (80 – 89 mm Hg, AHA 2017)."
            out_of_range.append("BloodPressure")
        else:
            bp_status = "Stage 2 Hypertension Threshold"
            bp_note = "Exceeds 90 mm Hg diastolic threshold; warrants standardized medical evaluation."
            out_of_range.append("BloodPressure")

        comparisons.append(BiomarkerComparison(
            biomarker="Diastolic Blood Pressure",
            feature_key="blood_pressure",
            entered_value=float(patient.blood_pressure),
            unit="mm Hg",
            reference_interval="Normal: < 80 mm Hg",
            status=bp_status,
            clinical_note=bp_note
        ))

        # 4. Serum Insulin (2-hour)
        if patient.insulin == 0.0:
            ins_status = "Not Measured / Baseline Zero"
            ins_note = "Insulin level recorded as 0 (often represents unmeasured assay in dataset)."
        elif patient.insulin <= 166.0:
            ins_status = "Normal Postprandial"
            ins_note = "Within expected 2-hour postprandial serum insulin limits (16 – 166 mu U/ml)."
        else:
            ins_status = "Elevated (Hyperinsulinemia Indicator)"
            ins_note = "Exceeds 166 mu U/ml; may indicate pancreatic compensatory secretion due to insulin resistance."
            out_of_range.append("Insulin")

        comparisons.append(BiomarkerComparison(
            biomarker="Serum Insulin (2-hour)",
            feature_key="insulin",
            entered_value=float(patient.insulin),
            unit="mu U/ml",
            reference_interval="Normal 2h: 16 – 166 mu U/ml",
            status=ins_status,
            clinical_note=ins_note
        ))

        # 5. Age
        if patient.age >= 35.0:
            age_status = "Screening Recommended"
            age_note = "Meets ADA guideline threshold (age >= 35) for regular asymptomatic diabetes screening."
            out_of_range.append("Age")
        else:
            age_status = "Young Adult Range"
            age_note = "Under age 35; screening indicated primarily if accompanied by elevated BMI or family history."

        comparisons.append(BiomarkerComparison(
            biomarker="Patient Age",
            feature_key="age",
            entered_value=float(patient.age),
            unit="years",
            reference_interval="Routine Screening: Age >= 35 (ADA 2024)",
            status=age_status,
            clinical_note=age_note
        ))

        # 6. Diabetes Pedigree Function
        if patient.diabetes_pedigree > 0.5:
            ped_status = "Higher Familial Risk"
            ped_note = "Above cohort median (~0.37), reflecting family history and genetic clustering."
            out_of_range.append("DiabetesPedigree")
        else:
            ped_status = "Average / Lower Genetic Clustering"
            ped_note = "Within or below cohort median score for family diabetes incidence."

        comparisons.append(BiomarkerComparison(
            biomarker="Diabetes Pedigree Function",
            feature_key="diabetes_pedigree",
            entered_value=float(patient.diabetes_pedigree),
            unit="score",
            reference_interval="Population Median: ~0.372",
            status=ped_status,
            clinical_note=ped_note
        ))

        return comparisons, out_of_range

    def retrieve_citations(self, out_of_range: List[str]) -> List[GuidelineCitation]:
        """
        Retrieves matching authoritative guidelines with full citations and reference info.
        Prioritizes guidelines addressing the patient's out-of-range biomarkers.
        """
        matched_citations: List[GuidelineCitation] = []
        seen_ids = set()

        # Always include ADA and WHO glucose criteria as primary references
        priority_keys = ["Glucose"] + out_of_range

        for item in self.corpus:
            doc_id = item.get("id")
            if doc_id in seen_ids:
                continue

            biomarker = item.get("biomarker", "")
            # Check relevance
            matches = any(k.lower() in biomarker.lower() for k in priority_keys) or len(matched_citations) < 2

            if matches:
                seen_ids.add(doc_id)
                matched_citations.append(GuidelineCitation(
                    id=doc_id,
                    source=item.get("source", "Authoritative Clinical Standard"),
                    document_title=item.get("document_title", ""),
                    section=item.get("section", ""),
                    publication_year=item.get("publication_year", 2024),
                    url_or_doi=item.get("url_or_doi"),
                    biomarker=biomarker,
                    measurement_type=item.get("measurement_type", ""),
                    reference_ranges=item.get("reference_ranges", {}),
                    guideline_statement=item.get("guideline_statement", ""),
                    clinical_context=item.get("clinical_context", "")
                ))

        return matched_citations

    def synthesize_explanation(
        self,
        patient: PatientInput,
        out_of_range: List[str],
        citations: List[GuidelineCitation]
    ) -> str:
        """
        Produces an objective, strictly non-diagnostic informational narrative.
        Explains which values deviate and cites authoritative publications.
        Does NOT diagnose, prescribe, or recommend medication.
        """
        lines = []
        lines.append("### Objective Clinical Reference Context (Non-Diagnostic)")
        lines.append("")

        if out_of_range:
            biomarker_list = ", ".join(out_of_range)
            lines.append(
                f"Evaluation against standard clinical reference intervals indicates that the following "
                f"entered parameters fall outside standard healthy ranges: **{biomarker_list}**."
            )
        else:
            lines.append(
                "All entered clinical parameters fall within standard healthy reference ranges."
            )

        lines.append("")
        lines.append("#### Key Guideline Alignments:")

        # Specific guideline alignments
        if "Glucose" in out_of_range or patient.glucose >= 140.0:
            lines.append(
                f"- **Glycemic Thresholds ({citations[0].source} — {citations[0].document_title})**: "
                f"The entered 2-hour plasma glucose value of **{patient.glucose:.1f} mg/dL** exceeds the normal "
                f"reference limit (< 140 mg/dL). According to ADA Table 2.2, values between 140–199 mg/dL "
                f"define Impaired Glucose Tolerance (IGT), while values >= 200 mg/dL warrant clinical confirmation."
            )

        if "BMI" in out_of_range:
            lines.append(
                f"- **Adiposity & Insulin Resistance (CDC / NIH Clinical Guidelines)**: "
                f"The entered BMI of **{patient.bmi:.1f} kg/m²** falls into the elevated/overweight category "
                f"(healthy standard: 18.5–24.9 kg/m²). Adipose mass is an established physiological contributor "
                f"to peripheral insulin insensitivity."
            )

        if "BloodPressure" in out_of_range:
            lines.append(
                f"- **Vascular Hemodynamics (AHA / ACC 2017 Guidelines)**: "
                f"The entered diastolic blood pressure of **{patient.blood_pressure:.1f} mm Hg** meets or exceeds "
                f"the 80 mm Hg threshold, which frequently co-occurs with metabolic risk factors."
            )

        if "Age" in out_of_range:
            lines.append(
                f"- **Screening Age Recommendation (ADA Standards of Care 2024)**: "
                f"Patient age ({patient.age:.0f} years) meets the ADA screening indication (age >= 35) "
                f"for routine clinical diabetes risk evaluation."
            )

        lines.append("")
        lines.append(
            "> **Medical Safety Notice**: This evaluation is generated for clinical decision support and educational demonstration. "
            "It does not constitute a clinical diagnosis, does not prescribe therapy, and does not evaluate individualized therapeutic regimens. "
            "Official diagnostic confirmation requires formal venous laboratory analysis evaluated by a licensed healthcare provider."
        )

        return "\n".join(lines)

    def process(self, patient: PatientInput) -> Tuple[List[BiomarkerComparison], RAGContextResponse]:
        """Orchestrates biomarker evaluation, guideline retrieval, and narrative synthesis"""
        comparisons, out_of_range = self.evaluate_biomarkers(patient)
        citations = self.retrieve_citations(out_of_range)
        summary = self.synthesize_explanation(patient, out_of_range, citations)

        rag_response = RAGContextResponse(
            retrieved_citations=citations,
            informational_summary=summary,
            out_of_range_biomarkers=out_of_range
        )

        return comparisons, rag_response


rag_service = RAGService()
