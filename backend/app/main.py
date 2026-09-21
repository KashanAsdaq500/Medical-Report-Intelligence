from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import api_router
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "## Medical Report Intelligence API 🩺\n\n"
        "An AI-powered clinical decision support backend providing diabetes risk inference "
        "using a trained DecisionTreeClassifier and authoritative medical reference retrieval (RAG).\n\n"
        "### ⚕️ Clinical Decision Support Disclaimer\n"
        "This API and its machine learning models are designed solely for educational, research, "
        "and screening demonstration purposes. **It does NOT provide medical diagnosis, clinical prognosis, "
        "or pharmaceutical treatment recommendations.** All assessments require formal venous laboratory "
        "evaluation by a licensed healthcare provider."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "disclaimer": "AI-assisted decision-support demo. Not for standalone clinical diagnosis."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=(settings.ENVIRONMENT == "development")
    )

