from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean
from app.db.database import Base


def generate_assessment_id() -> str:
    """Generates an anonymized clinical assessment record ID"""
    short_uuid = uuid.uuid4().hex[:8].upper()
    return f"PT-{short_uuid}"


def utc_now():
    return datetime.now(timezone.utc)


class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(String(32), primary_key=True, default=generate_assessment_id, index=True)
    created_at = Column(DateTime, default=utc_now, index=True)

    # Patient Biomarkers (Strictly anonymized numerical parameters)
    pregnancies = Column(Integer, nullable=False)
    glucose = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    skin_thickness = Column(Float, nullable=False)
    insulin = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    diabetes_pedigree = Column(Float, nullable=False)
    age = Column(Float, nullable=False)

    # Machine Learning Decision-Support Outputs
    prediction = Column(Integer, nullable=False)  # 0 or 1
    prediction_label = Column(String(64), nullable=False)
    probability_diabetes = Column(Float, nullable=False)
    probability_no_diabetes = Column(Float, nullable=False)
    risk_level = Column(String(32), nullable=False)

    # RAG Reference & Context Storage
    out_of_range_biomarkers = Column(String(255), default="")
    informational_summary = Column(Text, nullable=True)

    # Safety & Compliance
    decision_support_disclaimer = Column(Boolean, default=True)

