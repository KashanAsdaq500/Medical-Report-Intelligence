import joblib
import pandas as pd


# Load trained model
model = joblib.load("models/diabetes_model.pkl")

print("=== Medical Report Intelligence ===")
print("Enter patient information below.\n")


# Get patient information
pregnancies = float(input("Pregnancies: "))
glucose = float(input("Glucose: "))
blood_pressure = float(input("Blood Pressure: "))
skin_thickness = float(input("Skin Thickness: "))
insulin = float(input("Insulin: "))
bmi = float(input("BMI: "))
diabetes_pedigree = float(input("Diabetes Pedigree Function: "))
age = float(input("Age: "))


# Create patient DataFrame
patient = pd.DataFrame([{
    "Pregnancies": pregnancies,
    "Glucose": glucose,
    "BloodPressure": blood_pressure,
    "SkinThickness": skin_thickness,
    "Insulin": insulin,
    "BMI": bmi,
    "DiabetesPedigreeFunction": diabetes_pedigree,
    "Age": age
}])


# Make prediction
prediction = model.predict(patient)[0]


# Display result
print("\n==============================")

if prediction == 1:
    print("Prediction: Diabetes")
else:
    print("Prediction: No Diabetes")

print("==============================")