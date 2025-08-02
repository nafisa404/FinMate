import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for FinMate application"""
    
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    
    # AI/ML Services
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "")
    
    # Financial APIs
    YAHOO_FINANCE_API_KEY = os.getenv("YAHOO_FINANCE_API_KEY", "")
    COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY", "")
    
    # Application Settings
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # Database Settings
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    
    # Security Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # Feature Flags
    ENABLE_AI_FEATURES = os.getenv("ENABLE_AI_FEATURES", "True").lower() == "true"
    ENABLE_REAL_TIME_DATA = os.getenv("ENABLE_REAL_TIME_DATA", "True").lower() == "true"
    ENABLE_GAMIFICATION = os.getenv("ENABLE_GAMIFICATION", "True").lower() == "true"
    
    # UI Settings
    THEME_COLOR = "#1f77b4"
    ACCENT_COLOR = "#28a745"
    WARNING_COLOR = "#ffc107"
    ERROR_COLOR = "#dc3545"
    
    # Default Values
    DEFAULT_CURRENCY = "USD"
    DEFAULT_TIMEZONE = "UTC"
    
    # Pagination
    ITEMS_PER_PAGE = 20
    
    # Cache Settings
    CACHE_TTL = 300  # 5 minutes
    
    @classmethod
    def validate_config(cls):
        """Validate required configuration"""
        required_vars = [
            "SUPABASE_URL",
            "SUPABASE_ANON_KEY"
        ]
        
        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)
        
        if missing_vars:
            print(f"Warning: Missing required environment variables: {', '.join(missing_vars)}")
            print("Some features may not work properly without these variables.")
        
        return len(missing_vars) == 0
    
    @classmethod
    def get_database_config(cls):
        """Get database configuration"""
        return {
            "url": cls.DATABASE_URL,
            "pool_size": 10,
            "max_overflow": 20,
            "pool_timeout": 30,
            "pool_recycle": 3600
        }
    
    @classmethod
    def get_ai_config(cls):
        """Get AI configuration"""
        return {
            "openai_api_key": cls.OPENAI_API_KEY,
            "huggingface_token": cls.HUGGINGFACE_TOKEN,
            "enable_features": cls.ENABLE_AI_FEATURES,
            "model_timeout": 30,
            "max_tokens": 1000
        }
    
    @classmethod
    def get_api_config(cls):
        """Get API configuration"""
        return {
            "yahoo_finance_key": cls.YAHOO_FINANCE_API_KEY,
            "coingecko_key": cls.COINGECKO_API_KEY,
            "enable_real_time": cls.ENABLE_REAL_TIME_DATA,
            "request_timeout": 10,
            "max_retries": 3
        } 