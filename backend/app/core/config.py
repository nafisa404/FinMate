from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FinMate API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://finmate:finmate@localhost:5432/finmate")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8501",
        "http://127.0.0.1:8501",
        "http://127.0.0.1:3000"
    ]
    
    # AI/ML
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Financial APIs
    YAHOO_FINANCE_API_KEY: str = os.getenv("YAHOO_FINANCE_API_KEY", "")
    
    # Email (for notifications)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # Redis (for caching and sessions)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 