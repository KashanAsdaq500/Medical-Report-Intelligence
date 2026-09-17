from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.db.models import AssessmentRecord
from backend.app.schemas.patient import PatientInput, PredictionResult
from backend.app.schemas.rag import RAGContextResponse


class DBService:
    @staticmethod
    def create_assessment(
        db: Session,
        patient_input: PatientInput,
        prediction: PredictionResult,
        rag_context: RAGContextResponse
    ) -> AssessmentRecord:
        """Persists an anonymized assessment record to the database"""
        out_of_range_str = ", ".join(rag_context.out_of_range_biomarkers)
        
        record = AssessmentRecord(
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
    def get_assessments(db: Session, skip: int = 0, limit: int = 20) -> List[AssessmentRecord]:
        """Retrieves recent assessment records with pagination"""
        return (
            db.query(AssessmentRecord)
            .order_by(AssessmentRecord.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_assessment_by_id(db: Session, record_id: str) -> Optional[AssessmentRecord]:
        """Retrieves a single assessment record by anonymized ID"""
        return db.query(AssessmentRecord).filter(AssessmentRecord.id == record_id).first()

    @staticmethod
    def get_total_count(db: Session) -> int:
        """Returns the total number of recorded assessments"""
        return db.query(AssessmentRecord).count()


db_service = DBService()
