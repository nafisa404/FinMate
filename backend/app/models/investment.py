from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Numeric, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Investment(Base):
    __tablename__ = "investments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Investment details
    symbol = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    investment_type = Column(String(50), nullable=False)  # stock, etf, mutual_fund, crypto, etc.
    
    # Position details
    quantity = Column(Numeric(15, 6), nullable=False)
    average_price = Column(Numeric(10, 4), nullable=False)
    current_price = Column(Numeric(10, 4), nullable=True)
    
    # Portfolio allocation
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=True)
    
    # Dates
    purchase_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional metadata
    broker = Column(String(100), nullable=True)
    account_type = Column(String(50), nullable=True)  # taxable, ira, 401k, etc.
    notes = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="investments")
    portfolio = relationship("Portfolio", back_populates="investments")
    
    def __repr__(self):
        return f"<Investment(id={self.id}, symbol='{self.symbol}', quantity={self.quantity})>"

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Portfolio details
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Allocation strategy
    target_allocation = Column(Text, nullable=True)  # JSON object with asset allocation
    rebalance_frequency = Column(String(50), nullable=True)  # monthly, quarterly, annually
    
    # Performance tracking
    total_value = Column(Numeric(15, 2), nullable=True)
    total_gain_loss = Column(Numeric(15, 2), nullable=True)
    total_gain_loss_percent = Column(Numeric(5, 2), nullable=True)
    
    # Dates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="portfolios")
    investments = relationship("Investment", back_populates="portfolio")
    
    def __repr__(self):
        return f"<Portfolio(id={self.id}, name='{self.name}', user_id={self.user_id})>" 