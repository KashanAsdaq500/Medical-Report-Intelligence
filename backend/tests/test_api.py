import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "documentation" in data


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True


def test_predict_and_assess_endpoint():
    payload = {
        "pregnancies": 1,
        "glucose": 120.0,
        "blood_pressure": 70.0,
        "skin_thickness": 20.0,
        "insulin": 79.0,
        "bmi": 25.0,
        "diabetes_pedigree": 0.4,
        "age": 30.0
    }

    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify response contract
    assert "id" in data
    assert data["id"].startswith("PT-")
    assert "prediction" in data
    assert data["prediction"]["prediction"] in [0, 1]
    assert "probability_diabetes" in data["prediction"]

    # Verify RAG context and authoritative citations
    assert "rag_context" in data
    citations = data["rag_context"]["retrieved_citations"]
    assert len(citations) > 0
    assert "source" in citations[0]
    assert "document_title" in citations[0]

    # Verify mandatory clinical disclaimer
    assert "clinical_disclaimer" in data
    assert "DECISION SUPPORT" in data["clinical_disclaimer"].upper()


def test_predict_validation_error():
    """Ensure invalid / out-of-range clinical inputs are rejected with 422"""
    invalid_payload = {
        "pregnancies": -5,  # Invalid: negative
        "glucose": 120.0,
        "blood_pressure": 70.0,
        "skin_thickness": 20.0,
        "insulin": 79.0,
        "bmi": 25.0,
        "diabetes_pedigree": 0.4,
        "age": 30.0
    }
    response = client.post("/api/v1/predict", json=invalid_payload)
    assert response.status_code == 422


def test_rag_guidelines_endpoint():
    response = client.get("/api/v1/rag/guidelines")
    assert response.status_code == 200
    guidelines = response.json()
    assert len(guidelines) >= 3
    # Check that authoritative sources are present
    sources = [g["source"] for g in guidelines]
    assert any("American Diabetes Association" in s for s in sources)


def test_history_endpoint():
    # Make a prediction first
    payload = {
        "pregnancies": 2,
        "glucose": 140.0,
        "blood_pressure": 80.0,
        "skin_thickness": 25.0,
        "insulin": 100.0,
        "bmi": 28.0,
        "diabetes_pedigree": 0.5,
        "age": 38.0
    }
    client.post("/api/v1/predict", json=payload)

    # Query history
    response = client.get("/api/v1/history?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] >= 1
    assert len(data["items"]) >= 1
    assert data["items"][0]["id"].startswith("PT-")
