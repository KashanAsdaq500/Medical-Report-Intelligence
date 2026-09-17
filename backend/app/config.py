import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Medical Report Intelligence API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Dynamic Port support for Render / Railway ($PORT)
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Model path resolution: default to project root models/diabetes_model.pkl
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        str(BASE_DIR / "models" / "diabetes_model.pkl")
    )

    # Database: SQLite locally, easily switched to PostgreSQL via DATABASE_URL
    # Handles Render/Heroku 'postgres://' -> 'postgresql://' URL formatting
    _raw_db_url: str = os.getenv("DATABASE_URL", "sqlite:///./reports.db")
    if _raw_db_url.startswith("postgres://"):
        DATABASE_URL: str = _raw_db_url.replace("postgres://", "postgresql://", 1)
    else:
        DATABASE_URL: str = _raw_db_url

    # CORS settings: Allows local frontend development and production URLs
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]


settings = Settings()
