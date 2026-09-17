from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import settings

# Database Engine Configuration:
# Supports both SQLite (local development/portfolio) and PostgreSQL (Render/Supabase production)
connect_args = {}
engine_kwargs = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL production pooling settings
    engine_kwargs = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes database schema tables"""
    import backend.app.db.models  # Ensure models are registered with Base.metadata
    Base.metadata.create_all(bind=engine)


# Ensure tables are created on module import
init_db()
