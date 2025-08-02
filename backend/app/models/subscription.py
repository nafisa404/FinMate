from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Numeric, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Subscription details
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # streaming, software, fitness, etc.
    
    # Pricing
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    billing_cycle = Column(String(20), nullable=False)  # monthly, yearly, quarterly
    
    # Dates
    start_date = Column(DateTime, nullable=False)
    next_billing_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    auto_renew = Column(Boolean, default=True)
    
    # Provider details
    provider = Column(String(255), nullable=True)
    account_email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    
    # Usage tracking
    last_used = Column(DateTime, nullable=True)
    usage_frequency = Column(String(50), nullable=True)  # daily, weekly, monthly, rarely
    
    # AI insights
    ai_recommendation = Column(String(50), nullable=True)  # keep, cancel, downgrade, optimize
    ai_confidence = Column(Numeric(3, 2), nullable=True)
    ai_reasoning = Column(Text, nullable=True)
    
    # Dates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    
    def __repr__(self):
        return f"<Subscription(id={self.id}, name='{self.name}', amount={self.amount})>" 