from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class TransactionBase(BaseModel):
    amount: Decimal
    currency: str = "USD"
    description: str
    category: str
    subcategory: Optional[str] = None
    transaction_type: str  # income, expense, transfer
    transaction_date: datetime
    merchant: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    merchant: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None

class Transaction(TransactionBase):
    id: int
    user_id: int
    ai_category: Optional[str] = None
    ai_confidence: Optional[Decimal] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TransactionSummary(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    net_amount: Decimal
    transaction_count: int
    period_start: datetime
    period_end: datetime

class CategorySummary(BaseModel):
    category: str
    total_amount: Decimal
    transaction_count: int
    percentage: float

class TransactionAnalytics(BaseModel):
    summary: TransactionSummary
    category_breakdown: List[CategorySummary]
    monthly_trends: List[dict]
    spending_patterns: dict 