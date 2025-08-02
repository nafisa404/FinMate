from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import (
    Transaction as TransactionSchema,
    TransactionCreate,
    TransactionUpdate,
    TransactionAnalytics,
    TransactionSummary,
    CategorySummary
)
from app.services.ai_service import categorize_transaction

router = APIRouter()

@router.post("/", response_model=TransactionSchema)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    # Use AI to categorize if not provided
    if not transaction.category:
        ai_category, confidence = await categorize_transaction(transaction.description)
        transaction.category = ai_category
    
    db_transaction = Transaction(
        **transaction.dict(),
        user_id=current_user.id
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.get("/", response_model=List[TransactionSchema])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user transactions with filters"""
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    if category:
        query = query.filter(Transaction.category == category)
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    if start_date:
        query = query.filter(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_date <= end_date)
    
    transactions = query.offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionSchema)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction

@router.put("/{transaction_id}", response_model=TransactionSchema)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    update_data = transaction_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()
    
    return {"message": "Transaction deleted successfully"}

@router.get("/analytics/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get transaction summary for a period"""
    if not start_date:
        start_date = datetime.now() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now()
    
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    )
    
    transactions = query.all()
    
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == "expense")
    net_amount = total_income - total_expenses
    
    return TransactionSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        net_amount=net_amount,
        transaction_count=len(transactions),
        period_start=start_date,
        period_end=end_date
    )

@router.get("/analytics/categories", response_model=List[CategorySummary])
async def get_category_breakdown(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get spending breakdown by category"""
    if not start_date:
        start_date = datetime.now() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now()
    
    # Get total expenses for percentage calculation
    total_expenses = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).with_entities(db.func.sum(Transaction.amount)).scalar() or Decimal(0)
    
    # Get category breakdown
    categories = db.query(
        Transaction.category,
        db.func.sum(Transaction.amount).label('total_amount'),
        db.func.count(Transaction.id).label('transaction_count')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(Transaction.category).all()
    
    result = []
    for category, amount, count in categories:
        percentage = (amount / total_expenses * 100) if total_expenses > 0 else 0
        result.append(CategorySummary(
            category=category,
            total_amount=amount,
            transaction_count=count,
            percentage=float(percentage)
        ))
    
    return result 