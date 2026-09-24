from typing import List, Optional

from sqlalchemy.orm import Session

from app.db.models import AssessmentRecord
from app.schemas.patient import PatientInput, PredictionResult
from app.schemas.rag import RAGContextResponse


class DBService:

    @staticmethod
    def create_assessment(
        db: Session,
        patient_input: PatientInput,
        prediction: PredictionResult,
        rag_context: RAGContextResponse,
        user_id: str
    ) -> AssessmentRecord:
        """Persists an assessment record for the authenticated Clerk user."""
        out_of_range_str = ", ".join(
            rag_context.out_of_range_biomarkers
        )

        record = AssessmentRecord(
            user_id=user_id,
            pregnancies=patient_input.pregnancies,
            glucose=patient_input.glucose,
            blood_pressure=patient_input.blood_pressure,
            skin_thickness=patient_input.skin_thickness,
            insulin=patient_input.insulin,
            bmi=patient_input.bmi,
            diabetes_pedigree=patient_input.diabetes_pedigree,
            age=patient_input.age,
            prediction=prediction.prediction,
            prediction_label=prediction.prediction_label,
            probability_diabetes=prediction.probability_diabetes,
            probability_no_diabetes=prediction.probability_no_diabetes,
            risk_level=prediction.risk_level,
            out_of_range_biomarkers=out_of_range_str,
            informational_summary=rag_context.informational_summary,
            decision_support_disclaimer=True
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def get_assessments(
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[AssessmentRecord]:
        """Retrieves recent assessments belonging only to the authenticated user."""
        return (
            db.query(AssessmentRecord)
            .filter(AssessmentRecord.user_id == user_id)
            .order_by(AssessmentRecord.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_assessment_by_id(
        db: Session,
        record_id: str,
        user_id: str
    ) -> Optional[AssessmentRecord]:
        """Retrieves an assessment only if it belongs to the authenticated user."""
        return (
            db.query(AssessmentRecord)
            .filter(
                AssessmentRecord.id == record_id,
                AssessmentRecord.user_id == user_id
            )
            .first()
        )

    @staticmethod
    def get_total_count(
        db: Session,
        user_id: str
    ) -> int:
        """Returns the total number of assessments for the authenticated user."""
        return (
            db.query(AssessmentRecord)
            .filter(AssessmentRecord.user_id == user_id)
            .count()
        )


db_service = DBService()