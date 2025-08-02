from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.investment import Investment, Portfolio
from app.services.ai_service import get_investment_recommendations

router = APIRouter()

@router.get("/portfolios", response_model=List[dict])
async def get_portfolios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user portfolios"""
    portfolios = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id,
        Portfolio.is_active == True
    ).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "total_value": p.total_value,
            "total_gain_loss": p.total_gain_loss,
            "total_gain_loss_percent": p.total_gain_loss_percent
        }
        for p in portfolios
    ]

@router.get("/investments", response_model=List[dict])
async def get_investments(
    portfolio_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user investments"""
    query = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.is_active == True
    )
    
    if portfolio_id:
        query = query.filter(Investment.portfolio_id == portfolio_id)
    
    investments = query.all()
    
    return [
        {
            "id": i.id,
            "symbol": i.symbol,
            "name": i.name,
            "investment_type": i.investment_type,
            "quantity": i.quantity,
            "average_price": i.average_price,
            "current_price": i.current_price,
            "total_value": i.quantity * (i.current_price or i.average_price),
            "gain_loss": (i.current_price - i.average_price) * i.quantity if i.current_price else None
        }
        for i in investments
    ]

@router.post("/investments", response_model=dict)
async def create_investment(
    investment_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new investment"""
    db_investment = Investment(
        user_id=current_user.id,
        symbol=investment_data["symbol"],
        name=investment_data["name"],
        investment_type=investment_data["investment_type"],
        quantity=investment_data["quantity"],
        average_price=investment_data["average_price"],
        purchase_date=datetime.now(),
        portfolio_id=investment_data.get("portfolio_id")
    )
    
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    
    return {
        "id": db_investment.id,
        "symbol": db_investment.symbol,
        "name": db_investment.name,
        "message": "Investment created successfully"
    }

@router.get("/recommendations")
async def get_investment_recommendations_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered investment recommendations"""
    user_profile = {
        "monthly_income": current_user.monthly_income,
        "risk_tolerance": current_user.risk_tolerance,
        "investment_experience": current_user.investment_experience,
        "financial_goals": current_user.financial_goals
    }
    
    recommendations = await get_investment_recommendations(user_profile)
    return recommendations 