from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import AssessmentRecord
from backend.app.schemas.patient import AssessmentHistoryItem
from backend.app.services.db_service import db_service

router = APIRouter(prefix="/history", tags=["Assessment History"])


class HistoryResponse(BaseModel):
    total_records: int
    page_size: int
    skip: int
    items: List[AssessmentHistoryItem]


@router.get(
    "",
    response_model=HistoryResponse,
    summary="List Past Clinical Assessments",
    description="Retrieves paginated historical clinical assessments with anonymized identifiers."
)
def get_assessment_history(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of items to retrieve"),
    db: Session = Depends(get_db)
):
    total = db_service.get_total_count(db)
    records = db_service.get_assessments(db, skip=skip, limit=limit)

    items = [
        AssessmentHistoryItem(
            id=r.id,
            timestamp=r.created_at.isoformat(),
            age=r.age,
            glucose=r.glucose,
            bmi=r.bmi,
            blood_pressure=r.blood_pressure,
            prediction=r.prediction,
            prediction_label=r.prediction_label,
            probability_diabetes=r.probability_diabetes,
            risk_level=r.risk_level
        )
        for r in records
    ]

    return HistoryResponse(
        total_records=total,
        page_size=limit,
        skip=skip,
        items=items
    )


@router.get(
    "/{assessment_id}",
    summary="Get Specific Assessment Detail",
    description="Retrieves complete input and output details for a specific assessment record."
)
def get_assessment_detail(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    record = db_service.get_assessment_by_id(db, assessment_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment record with ID '{assessment_id}' not found."
        )

    return {
        "id": record.id,
        "created_at": record.created_at.isoformat(),
        "inputs": {
            "pregnancies": record.pregnancies,
            "glucose": record.glucose,
            "blood_pressure": record.blood_pressure,
            "skin_thickness": record.skin_thickness,
            "insulin": record.insulin,
            "bmi": record.bmi,
            "diabetes_pedigree": record.diabetes_pedigree,
            "age": record.age,
        },
        "prediction": {
            "prediction": record.prediction,
            "prediction_label": record.prediction_label,
            "probability_diabetes": record.probability_diabetes,
            "probability_no_diabetes": record.probability_no_diabetes,
            "risk_level": record.risk_level,
        },
        "rag_context": {
            "out_of_range_biomarkers": [b.strip() for b in record.out_of_range_biomarkers.split(",") if b.strip()],
            "informational_summary": record.informational_summary,
        }
    }
