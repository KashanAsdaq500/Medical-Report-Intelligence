import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.schemas.patient import PatientInput, AssessmentResponse
from backend.app.services.ml_service import ml_service
from backend.app.services.rag_service import rag_service
from backend.app.services.db_service import db_service


logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Clinical Assessment & Prediction"])


@router.post(
    "/predict",
    response_model=AssessmentResponse,
    summary="Evaluate Patient Biomarkers & Predict Diabetes Risk",
    description=(
        "Performs machine learning inference with the preserved DecisionTreeClassifier, "
        "evaluates biomarkers against authoritative clinical guidelines (ADA 2024, WHO, AHA, CDC), "
        "persists the anonymized assessment record in PostgreSQL, "
        "and returns complete decision-support results."
    )
)
def assess_patient(
    patient_data: PatientInput,
    db: Session = Depends(get_db)
):
    try:
        # 1. Run Machine Learning Inference
        prediction_result = ml_service.predict(patient_data)

        # 2. RAG Evaluation against Authoritative Reference Ranges
        biomarker_comparisons, rag_context = rag_service.process(patient_data)

        # 3. Save assessment in PostgreSQL
        record = db_service.create_assessment(
            db=db,
            patient_input=patient_data,
            prediction=prediction_result,
            rag_context=rag_context
        )

        logger.info(
            f"Assessment saved successfully. PostgreSQL ID: {record.id}"
        )

        # 4. Return API response
        return AssessmentResponse(
            id=record.id,
            timestamp=record.created_at.isoformat() + "Z",
            patient_inputs=patient_data,
            prediction=prediction_result,
            biomarker_comparisons=biomarker_comparisons,
            rag_context=rag_context
        )

    except Exception as e:
        logger.error(
            f"Error during assessment execution: {e}",
            exc_info=True
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference processing error: {str(e)}"
        )
