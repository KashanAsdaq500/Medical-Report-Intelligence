from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class GuidelineCitation(BaseModel):
    id: str
    source: str = Field(..., description="Authoritative clinical organization, e.g., ADA, WHO, AHA")
    document_title: str = Field(..., description="Formal guideline publication title")
    section: str = Field(..., description="Section, chapter, or table reference")
    publication_year: int = Field(..., description="Year of publication or official clinical update")
    url_or_doi: Optional[str] = Field(None, description="Official publication URL or DOI identifier")
    biomarker: str = Field(..., description="Primary biomarker this guideline informs")
    measurement_type: str = Field(..., description="Specific laboratory assay or measurement condition")
    reference_ranges: Dict[str, Any] = Field(default_factory=dict, description="Standard physiological reference intervals")
    guideline_statement: str = Field(..., description="Direct verbatim or standardized summary of clinical criteria")
    clinical_context: str = Field(..., description="Contextual interpretation guidance")


class RAGContextResponse(BaseModel):
    retrieved_citations: List[GuidelineCitation] = Field(
        default_factory=list,
        description="Authoritative medical literature and guideline references retrieved for the patient's biomarker profile"
    )
    informational_summary: str = Field(
        ...,
        description="Strictly informational comparison explaining which entered values deviate from standard reference intervals"
    )
    out_of_range_biomarkers: List[str] = Field(
        default_factory=list,
        description="List of patient biomarkers that deviate from standard healthy population intervals"
    )
    strictly_non_diagnostic_notice: str = Field(
        default=(
            "INFORMATIONAL ONLY: The retrieved references and biomarker comparisons are for educational and "
            "clinical decision-support context only. They do not constitute a medical diagnosis, clinical prognosis, "
            "or treatment recommendation."
        ),
        description="Mandatory clinical safety notice"
    )

