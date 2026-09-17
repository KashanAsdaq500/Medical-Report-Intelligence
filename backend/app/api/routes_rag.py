from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.schemas.rag import GuidelineCitation
from backend.app.services.rag_service import rag_service

router = APIRouter(prefix="/rag", tags=["RAG Medical Knowledge"])


@router.get(
    "/guidelines",
    response_model=List[GuidelineCitation],
    summary="List Curated Authoritative Medical Guidelines",
    description="Returns all authoritative clinical reference guidelines indexed in the RAG knowledge base."
)
def list_guidelines(
    biomarker: Optional[str] = Query(None, description="Filter by biomarker name (e.g. Glucose, BMI, BloodPressure)")
):
    all_citations = rag_service.retrieve_citations(
        out_of_range=[biomarker] if biomarker else ["Glucose", "BMI", "BloodPressure", "Insulin"]
    )
    return all_citations
