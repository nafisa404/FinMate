from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Transaction details
    amount = Column(Numeric(10, 2), nullable=False)  # Amount in cents
    currency = Column(String(3), default="USD")
    description = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    
    # Transaction type
    transaction_type = Column(String(20), nullable=False)  # income, expense, transfer
    
    # Date and time
    transaction_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional metadata
    merchant = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    tags = Column(Text, nullable=True)  # JSON array of tags
    notes = Column(Text, nullable=True)
    
    # AI categorization
    ai_category = Column(String(100), nullable=True)
    ai_confidence = Column(Numeric(3, 2), nullable=True)  # 0.00 to 1.00
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, amount={self.amount}, category='{self.category}')>" 