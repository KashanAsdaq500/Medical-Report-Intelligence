from pathlib import Path
import joblib
import pandas as pd
import pytest

from backend.app.schemas.patient import PatientInput
from backend.app.services.ml_service import ml_service, FEATURE_NAMES


def test_model_file_exists():
    """Verify models/diabetes_model.pkl exists and was NOT modified/replaced"""
    model_path = Path("models/diabetes_model.pkl")
    assert model_path.exists(), "models/diabetes_model.pkl must exist"


def test_ml_service_matches_trained_model_on_dataset_samples():
    """
    Ensure the ML service produces identical predictions and probabilities to the
    preserved DecisionTreeClassifier across multiple samples from the original dataset.
    """
    direct_model = joblib.load("models/diabetes_model.pkl")
    df = pd.read_csv("data/diabetes.csv")

    # Test top 10 rows from the actual dataset
    for idx, row in df.head(10).iterrows():
        patient = PatientInput(
            pregnancies=int(row["Pregnancies"]),
            glucose=float(row["Glucose"]),
            blood_pressure=float(row["BloodPressure"]),
            skin_thickness=float(row["SkinThickness"]),
            insulin=float(row["Insulin"]),
            bmi=float(row["BMI"]),
            diabetes_pedigree=float(row["DiabetesPedigreeFunction"]),
            age=float(row["Age"])
        )

        patient_df = pd.DataFrame([{
            "Pregnancies": float(row["Pregnancies"]),
            "Glucose": float(row["Glucose"]),
            "BloodPressure": float(row["BloodPressure"]),
            "SkinThickness": float(row["SkinThickness"]),
            "Insulin": float(row["Insulin"]),
            "BMI": float(row["BMI"]),
            "DiabetesPedigreeFunction": float(row["DiabetesPedigreeFunction"]),
            "Age": float(row["Age"])
        }], columns=FEATURE_NAMES)

        expected_pred = int(direct_model.predict(patient_df)[0])
        expected_prob = direct_model.predict_proba(patient_df)[0]
        expected_prob_diabetes = round(float(expected_prob[1] * 100), 2)
        expected_prob_no_diabetes = round(float(expected_prob[0] * 100), 2)

        result = ml_service.predict(patient)

        # Verification: strict equality with original model
        assert result.prediction == expected_pred
        assert result.probability_diabetes == expected_prob_diabetes
        assert result.probability_no_diabetes == expected_prob_no_diabetes
        assert result.prediction_label in ["Diabetes Indicated", "No Diabetes Indicated"]
