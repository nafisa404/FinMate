from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Profile fields
    phone = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    profile_picture = Column(String, nullable=True)
    
    # Financial profile
    monthly_income = Column(Integer, nullable=True)  # in cents
    risk_tolerance = Column(String, nullable=True)  # conservative, moderate, aggressive
    financial_goals = Column(Text, nullable=True)  # JSON string
    investment_experience = Column(String, nullable=True)  # beginner, intermediate, advanced
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>" 