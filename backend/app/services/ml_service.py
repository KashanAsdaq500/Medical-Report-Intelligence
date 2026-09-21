import logging
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
import pandas as pd

from app.config import settings
from app.schemas.patient import PatientInput, PredictionResult

logger = logging.getLogger(__name__)

FEATURE_NAMES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]


class MLService:
    def __init__(self, model_path: str = None):
        self.model_path = Path(model_path or settings.MODEL_PATH)
        self.model = None
        self._load_model()

    def _load_model(self):
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Trained model not found at specified path: {self.model_path}. "
                "Ensure models/diabetes_model.pkl is present."
            )
        try:
            self.model = joblib.load(self.model_path)
            logger.info(f"Successfully loaded DecisionTreeClassifier from {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to load model from {self.model_path}: {e}")
            raise

    def predict(self, patient_data: PatientInput) -> PredictionResult:
        """
        Executes prediction on the preserved DecisionTreeClassifier using the exact 8 features.
        Preserves original logic and probability calculations from the original Streamlit app and predict.py.
        """
        # Maintain exact feature ordering
        feature_dict = {
            "Pregnancies": float(patient_data.pregnancies),
            "Glucose": float(patient_data.glucose),
            "BloodPressure": float(patient_data.blood_pressure),
            "SkinThickness": float(patient_data.skin_thickness),
            "Insulin": float(patient_data.insulin),
            "BMI": float(patient_data.bmi),
            "DiabetesPedigreeFunction": float(patient_data.diabetes_pedigree),
            "Age": float(patient_data.age)
        }

        patient_df = pd.DataFrame([feature_dict], columns=FEATURE_NAMES)

        # Run exact sklearn predict and predict_proba
        raw_pred = int(self.model.predict(patient_df)[0])
        probabilities = self.model.predict_proba(patient_df)[0]
        
        prob_no_diabetes = round(float(probabilities[0] * 100.0), 2)
        prob_diabetes = round(float(probabilities[1] * 100.0), 2)

        # Qualitative risk category for clinical decision-support interpretation
        if prob_diabetes >= 60.0:
            risk_level = "Elevated Risk"
        elif prob_diabetes >= 35.0:
            risk_level = "Moderate Risk"
        else:
            risk_level = "Low Risk"

        prediction_label = "Diabetes Indicated" if raw_pred == 1 else "No Diabetes Indicated"

        return PredictionResult(
            prediction=raw_pred,
            prediction_label=prediction_label,
            probability_diabetes=prob_diabetes,
            probability_no_diabetes=prob_no_diabetes,
            risk_level=risk_level
        )


# Singleton instance
ml_service = MLService()

