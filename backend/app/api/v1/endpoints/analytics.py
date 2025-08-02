from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.models.subscription import Subscription
from app.models.investment import Investment
from app.services.ai_service import get_financial_insights

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard analytics"""
    # Get date range (last 30 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Transaction analytics
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == "expense")
    net_amount = total_income - total_expenses
    
    # Category breakdown
    category_totals = {}
    for t in transactions:
        if t.transaction_type == "expense":
            if t.category not in category_totals:
                category_totals[t.category] = 0
            category_totals[t.category] += t.amount
    
    # Subscription analytics
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()
    
    monthly_subscription_cost = sum(s.amount for s in subscriptions if s.billing_cycle == "monthly")
    yearly_subscription_cost = sum(s.amount * 12 for s in subscriptions if s.billing_cycle == "monthly")
    yearly_subscription_cost += sum(s.amount for s in subscriptions if s.billing_cycle == "yearly")
    
    # Investment analytics
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.is_active == True
    ).all()
    
    total_investment_value = sum(i.quantity * (i.current_price or i.average_price) for i in investments)
    total_investment_cost = sum(i.quantity * i.average_price for i in investments)
    total_gain_loss = total_investment_value - total_investment_cost
    
    # AI insights
    ai_insights = await get_financial_insights(transactions)
    
    return {
        "period": {
            "start_date": start_date,
            "end_date": end_date
        },
        "transactions": {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_amount": net_amount,
            "transaction_count": len(transactions),
            "category_breakdown": category_totals
        },
        "subscriptions": {
            "total_count": len(subscriptions),
            "monthly_cost": monthly_subscription_cost,
            "yearly_cost": yearly_subscription_cost,
            "potential_savings": monthly_subscription_cost * 0.2
        },
        "investments": {
            "total_value": total_investment_value,
            "total_cost": total_investment_cost,
            "total_gain_loss": total_gain_loss,
            "gain_loss_percentage": (total_gain_loss / total_investment_cost * 100) if total_investment_cost > 0 else 0
        },
        "ai_insights": ai_insights,
        "financial_health_score": _calculate_financial_health_score(
            total_income, total_expenses, monthly_subscription_cost, total_investment_value
        )
    }

@router.get("/spending-trends")
async def get_spending_trends(
    days: int = Query(30, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get spending trends over time"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get daily spending data
    daily_spending = db.query(
        db.func.date(Transaction.transaction_date).label('date'),
        db.func.sum(Transaction.amount).label('total_amount')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(db.func.date(Transaction.transaction_date)).all()
    
    # Get category trends
    category_trends = db.query(
        Transaction.category,
        db.func.sum(Transaction.amount).label('total_amount'),
        db.func.count(Transaction.id).label('transaction_count')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(Transaction.category).all()
    
    return {
        "period": {
            "start_date": start_date,
            "end_date": end_date,
            "days": days
        },
        "daily_spending": [
            {
                "date": str(day.date),
                "amount": float(day.total_amount)
            }
            for day in daily_spending
        ],
        "category_trends": [
            {
                "category": trend.category,
                "total_amount": float(trend.total_amount),
                "transaction_count": trend.transaction_count
            }
            for trend in category_trends
        ]
    }

@router.get("/savings-analysis")
async def get_savings_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed savings analysis"""
    # Get last 6 months of data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).all()
    
    # Calculate monthly savings
    monthly_data = {}
    for t in transactions:
        month_key = t.transaction_date.strftime("%Y-%m")
        if month_key not in monthly_data:
            monthly_data[month_key] = {"income": 0, "expenses": 0}
        
        if t.transaction_type == "income":
            monthly_data[month_key]["income"] += t.amount
        elif t.transaction_type == "expense":
            monthly_data[month_key]["expenses"] += t.amount
    
    # Calculate savings rate
    total_income = sum(data["income"] for data in monthly_data.values())
    total_expenses = sum(data["expenses"] for data in monthly_data.values())
    savings_rate = ((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0
    
    # Identify potential savings opportunities
    category_expenses = {}
    for t in transactions:
        if t.transaction_type == "expense":
            if t.category not in category_expenses:
                category_expenses[t.category] = 0
            category_expenses[t.category] += t.amount
    
    # Find top spending categories
    top_categories = sorted(category_expenses.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "savings_rate": savings_rate,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "total_savings": total_income - total_expenses,
        "monthly_breakdown": [
            {
                "month": month,
                "income": data["income"],
                "expenses": data["expenses"],
                "savings": data["income"] - data["expenses"],
                "savings_rate": ((data["income"] - data["expenses"]) / data["income"] * 100) if data["income"] > 0 else 0
            }
            for month, data in monthly_data.items()
        ],
        "top_spending_categories": [
            {
                "category": category,
                "amount": amount,
                "percentage": (amount / total_expenses * 100) if total_expenses > 0 else 0
            }
            for category, amount in top_categories
        ],
        "savings_recommendations": _generate_savings_recommendations(category_expenses, total_expenses)
    }

def _calculate_financial_health_score(income, expenses, subscription_cost, investment_value):
    """Calculate a financial health score (0-100)"""
    if income == 0:
        return 0
    
    # Calculate various metrics
    savings_rate = ((income - expenses) / income * 100) if income > 0 else 0
    subscription_ratio = (subscription_cost / income * 100) if income > 0 else 0
    investment_ratio = (investment_value / income * 100) if income > 0 else 0
    
    # Score components
    savings_score = min(savings_rate * 2, 40)  # Max 40 points for savings
    subscription_score = max(20 - subscription_ratio, 0)  # Max 20 points for low subscription cost
    investment_score = min(investment_ratio / 2, 20)  # Max 20 points for investments
    expense_control_score = max(20 - (expenses / income * 100), 0)  # Max 20 points for expense control
    
    total_score = savings_score + subscription_score + investment_score + expense_control_score
    return min(max(total_score, 0), 100)

def _generate_savings_recommendations(category_expenses, total_expenses):
    """Generate personalized savings recommendations"""
    recommendations = []
    
    # High spending categories
    high_spending = {k: v for k, v in category_expenses.items() if v > total_expenses * 0.15}
    
    for category, amount in high_spending.items():
        if category == "Food & Dining":
            recommendations.append({
                "category": category,
                "suggestion": "Consider meal planning and cooking at home more often",
                "potential_savings": amount * 0.3
            })
        elif category == "Entertainment":
            recommendations.append({
                "category": category,
                "suggestion": "Look for free or low-cost entertainment alternatives",
                "potential_savings": amount * 0.4
            })
        elif category == "Shopping":
            recommendations.append({
                "category": category,
                "suggestion": "Wait 24 hours before making non-essential purchases",
                "potential_savings": amount * 0.25
            })
        else:
            recommendations.append({
                "category": category,
                "suggestion": f"Review {category.lower()} expenses and identify areas to reduce",
                "potential_savings": amount * 0.2
            })
    
    return recommendations 