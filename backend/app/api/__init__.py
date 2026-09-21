from fastapi import APIRouter
from app.api.routes_predict import router as predict_router
from app.api.routes_history import router as history_router
from app.api.routes_rag import router as rag_router
from app.config import settings

api_router = APIRouter(prefix=settings.API_V1_STR)

# Mount sub-routers
api_router.include_router(predict_router)
api_router.include_router(history_router)
api_router.include_router(rag_router)


@api_router.get("/health", tags=["System Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "model_loaded": True
    }

