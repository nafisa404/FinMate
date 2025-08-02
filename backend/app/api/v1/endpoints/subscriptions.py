from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.subscription import Subscription

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_subscriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user subscriptions"""
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()
    
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "category": s.category,
            "amount": s.amount,
            "billing_cycle": s.billing_cycle,
            "next_billing_date": s.next_billing_date,
            "provider": s.provider,
            "ai_recommendation": s.ai_recommendation,
            "ai_confidence": s.ai_confidence
        }
        for s in subscriptions
    ]

@router.post("/", response_model=dict)
async def create_subscription(
    subscription_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new subscription"""
    db_subscription = Subscription(
        user_id=current_user.id,
        name=subscription_data["name"],
        description=subscription_data.get("description"),
        category=subscription_data["category"],
        amount=subscription_data["amount"],
        currency=subscription_data.get("currency", "USD"),
        billing_cycle=subscription_data["billing_cycle"],
        start_date=datetime.now(),
        next_billing_date=datetime.now() + timedelta(days=30),  # Default to monthly
        provider=subscription_data.get("provider"),
        account_email=subscription_data.get("account_email"),
        website=subscription_data.get("website")
    )
    
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    
    return {
        "id": db_subscription.id,
        "name": db_subscription.name,
        "message": "Subscription created successfully"
    }

@router.put("/{subscription_id}", response_model=dict)
async def update_subscription(
    subscription_id: int,
    subscription_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    update_data = subscription_data
    for field, value in update_data.items():
        if hasattr(subscription, field):
            setattr(subscription, field, value)
    
    db.commit()
    db.refresh(subscription)
    
    return {
        "id": subscription.id,
        "name": subscription.name,
        "message": "Subscription updated successfully"
    }

@router.delete("/{subscription_id}")
async def cancel_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    subscription.is_active = False
    subscription.end_date = datetime.now()
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}

@router.get("/analytics/summary")
async def get_subscription_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get subscription analytics summary"""
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()
    
    total_monthly_cost = sum(s.amount for s in subscriptions if s.billing_cycle == "monthly")
    total_yearly_cost = sum(s.amount * 12 for s in subscriptions if s.billing_cycle == "monthly")
    total_yearly_cost += sum(s.amount for s in subscriptions if s.billing_cycle == "yearly")
    
    category_breakdown = {}
    for s in subscriptions:
        if s.category not in category_breakdown:
            category_breakdown[s.category] = 0
        category_breakdown[s.category] += s.amount
    
    return {
        "total_subscriptions": len(subscriptions),
        "total_monthly_cost": total_monthly_cost,
        "total_yearly_cost": total_yearly_cost,
        "category_breakdown": category_breakdown,
        "potential_savings": total_monthly_cost * 0.2  # Estimate 20% potential savings
    } 