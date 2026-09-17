import streamlit as st
import pandas as pd
import joblib
from pathlib import Path

# -----------------------------------------------------------------------------
# Page Configuration
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Medical Report Intelligence",
    page_icon="🩺",
    layout="wide"
)

# -----------------------------------------------------------------------------
# Styling (Clean, Professional Medical Theme)
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    .main-title {
        color: #0f172a;
        font-size: 2.1rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        color: #475569;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
    .disclaimer-card {
        background-color: #f8fafc;
        border-left: 4px solid #0284c7;
        padding: 0.9rem 1.2rem;
        border-radius: 4px;
        color: #334155;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Load Pretrained Model (Cached)
# -----------------------------------------------------------------------------
@st.cache_resource(show_spinner="Loading model...")
def load_trained_model():
    model_path = Path(__file__).resolve().parent / "models" / "diabetes_model.pkl"
    if not model_path.exists():
        st.error(f"Model file not found at: `{model_path}`")
        st.stop()
    return joblib.load(model_path)

model = load_trained_model()

# -----------------------------------------------------------------------------
# Header & Prominent Disclaimer
# -----------------------------------------------------------------------------
st.markdown('<div class="main-title">🩺 Medical Report Intelligence</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">AI-Powered Diabetes Risk Prediction & Clinical Assessment</div>', unsafe_allow_html=True)

st.markdown("""
<div class="disclaimer-card">
    <strong>⚕️ Clinical Disclaimer:</strong> This application is an educational and decision-support tool powered by a trained Decision Tree Classifier. 
    It is not intended to provide definitive medical diagnosis or replace evaluation by a qualified healthcare professional.
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Sidebar: Quick Presets & Model Info
# -----------------------------------------------------------------------------
PRESETS = {
    "Custom (Manual Input)": {
        "Pregnancies": 1, "Glucose": 115.0, "BloodPressure": 72.0, "SkinThickness": 20.0,
        "Insulin": 80.0, "BMI": 26.5, "DiabetesPedigreeFunction": 0.450, "Age": 32
    },
    "Sample: Low Risk Profile": {
        "Pregnancies": 1, "Glucose": 85.0, "BloodPressure": 66.0, "SkinThickness": 29.0,
        "Insulin": 0.0, "BMI": 26.6, "DiabetesPedigreeFunction": 0.351, "Age": 31
    },
    "Sample: High Risk Profile": {
        "Pregnancies": 6, "Glucose": 148.0, "BloodPressure": 72.0, "SkinThickness": 35.0,
        "Insulin": 0.0, "BMI": 33.6, "DiabetesPedigreeFunction": 0.627, "Age": 50
    }
}

with st.sidebar:
    st.header("Settings & Presets")
    selected_preset = st.selectbox("Load Sample Data:", list(PRESETS.keys()))
    preset = PRESETS[selected_preset]
    
    st.markdown("---")
    st.markdown("**Model Details:**")
    st.markdown("- **Algorithm:** Decision Tree Classifier")
    st.markdown("- **Features:** 8 Clinical Predictors")
    st.markdown("- **Trained On:** Pima Indians Diabetes Dataset")

# -----------------------------------------------------------------------------
# Input Form (Clean 2-Column Layout)
# -----------------------------------------------------------------------------
st.subheader("Patient Clinical Data")

col1, col2 = st.columns(2, gap="large")

with col1:
    st.markdown("##### Demographics & Physical Vitals")
    age = st.number_input(
        "Age (years)",
        min_value=1,
        max_value=120,
        value=int(preset["Age"]),
        step=1
    )
    bmi = st.number_input(
        "Body Mass Index - BMI (kg/m²)",
        min_value=10.0,
        max_value=70.0,
        value=float(preset["BMI"]),
        step=0.1,
        format="%.1f"
    )
    blood_pressure = st.number_input(
        "Diastolic Blood Pressure (mm Hg)",
        min_value=30.0,
        max_value=200.0,
        value=float(preset["BloodPressure"]),
        step=1.0
    )
    pregnancies = st.number_input(
        "Pregnancies",
        min_value=0,
        max_value=20,
        value=int(preset["Pregnancies"]),
        step=1
    )

with col2:
    st.markdown("##### Laboratory & Metabolic Biomarkers")
    glucose = st.number_input(
        "Plasma Glucose Concentration (mg/dL)",
        min_value=40.0,
        max_value=300.0,
        value=float(preset["Glucose"]),
        step=1.0
    )
    insulin = st.number_input(
        "2-Hour Serum Insulin (mu U/ml)",
        min_value=0.0,
        max_value=900.0,
        value=float(preset["Insulin"]),
        step=1.0
    )
    skin_thickness = st.number_input(
        "Triceps Skin Fold Thickness (mm)",
        min_value=0.0,
        max_value=100.0,
        value=float(preset["SkinThickness"]),
        step=1.0
    )
    diabetes_pedigree = st.number_input(
        "Diabetes Pedigree Function",
        min_value=0.0,
        max_value=3.0,
        value=float(preset["DiabetesPedigreeFunction"]),
        step=0.01,
        format="%.3f"
    )

st.write("")

# -----------------------------------------------------------------------------
# Prediction Logic (Existing ML Model)
# -----------------------------------------------------------------------------
if st.button("Predict Diabetes Risk", type="primary", use_container_width=True):
    # Patient DataFrame with the exact feature names and order
    patient_df = pd.DataFrame([{
        "Pregnancies": pregnancies,
        "Glucose": glucose,
        "BloodPressure": blood_pressure,
        "SkinThickness": skin_thickness,
        "Insulin": insulin,
        "BMI": bmi,
        "DiabetesPedigreeFunction": diabetes_pedigree,
        "Age": age
    }])

    prediction = int(model.predict(patient_df)[0])
    probabilities = model.predict_proba(patient_df)[0]
    prob_no_diabetes = probabilities[0] * 100
    prob_diabetes = probabilities[1] * 100

    st.markdown("---")
    st.subheader("Prediction Result")

    m_col1, m_col2, m_col3 = st.columns(3)

    with m_col1:
        if prediction == 1:
            st.error("Prediction: Diabetes Indicated")
        else:
            st.success("Prediction: No Diabetes Indicated")

    with m_col2:
        st.metric(label="Calculated Diabetes Probability", value=f"{prob_diabetes:.1f}%")

    with m_col3:
        st.metric(label="Calculated Non-Diabetes Probability", value=f"{prob_no_diabetes:.1f}%")

    st.progress(float(prob_diabetes) / 100.0)

    # -------------------------------------------------------------------------
    # General Reference Information (Clearly Non-Diagnostic)
    # -------------------------------------------------------------------------
    st.write("")
    with st.expander("📋 General Reference Information (Non-Diagnostic)"):
        st.caption(
            "The following values are general population references for informational context only. "
            "They do NOT constitute diagnostic thresholds."
        )
        ref_df = pd.DataFrame([
            {"Biomarker": "Glucose (2h plasma)", "Entered Value": f"{glucose:.0f} mg/dL", "General Reference": "Fasting < 100 mg/dL; 2-hour < 140 mg/dL"},
            {"Biomarker": "BMI", "Entered Value": f"{bmi:.1f} kg/m²", "General Reference": "Normal: 18.5 - 24.9 kg/m²"},
            {"Biomarker": "Blood Pressure (Diastolic)", "Entered Value": f"{blood_pressure:.0f} mm Hg", "General Reference": "Normal: < 80 mm Hg"},
            {"Biomarker": "Insulin (2h serum)", "Entered Value": f"{insulin:.0f} mu U/ml", "General Reference": "Normal fasting: 16 - 166 mu U/ml"}
        ])
        st.table(ref_df)
