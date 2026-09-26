import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), extra="ignore")

    PROJECT_NAME: str = "Medical Report Intelligence API"
    VERSION: str = "1.0.0"
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    API_V1_STR: str = "/api/v1"

    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Model path
    # Works locally and on Vercel where backend/ is the deployment root.
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        str(BASE_DIR / "models" / "diabetes_model.pkl")
    )

    # Database
    _raw_db_url: str = os.getenv("DATABASE_URL", "sqlite:///./reports.db")
    if _raw_db_url.startswith("postgres://"):
        DATABASE_URL: str = _raw_db_url.replace("postgres://", "postgresql://", 1)
    else:
        DATABASE_URL: str = _raw_db_url

    # CORS
CORS_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://medical-report-intelligence-fronten-livid.vercel.app"
]


settings = Settings()
